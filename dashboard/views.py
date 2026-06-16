import os
# MUST be set before any other imports
os.environ["TF_USE_LEGACY_KERAS"] = "1"
os.environ["TF_CUDNN_USE_AUTOTUNE"] = "0" 
os.environ["OPENCV_FFMPEG_THREADS"] = "1"
os.environ["OPENCV_VIDEOIO_PRIORITY_MSMF"] = "0"

import tensorflow as tf
HAS_GPU = len(tf.config.list_physical_devices('GPU')) > 0

if HAS_GPU:
    os.environ["TF_FORCE_GPU_ALLOW_GROWTH"] = "true"
    os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True" 
else:
    # Force CPU for TensorFlow if no GPU found
    os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
    print("[SYSTEM] No GPU detected. Running in CPU mode.")

import cv2
import numpy as np
cv2.setNumThreads(0) 

# Set RTSP timeout and transport to TCP
os.environ["OPENCV_FFMPEG_CAPTURE_OPTIONS"] = "rtsp_transport;tcp|stimeout;5000000"

import uuid
import threading
import queue
import time
from datetime import datetime
from django.shortcuts import render, redirect, get_object_or_404
from django.http import StreamingHttpResponse, JsonResponse, HttpResponse
from django.conf import settings
from django.core.files.base import ContentFile
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
import tensorflow as tf
from deepface import DeepFace

from django.utils import timezone
from .models import Employee, AlertLog, CameraDevice, Attendance, SystemSettings
from .forms import EmployeeForm, CameraDeviceForm
from . import model_swapper

# Global locks and Queues
yolo_lock = threading.Lock()
face_queue = queue.Queue()

# Initialize default mode
model_swapper.switch_mode("ppe")

# --- HELPERS ---
def get_db_path():
    db_path = os.path.join(settings.MEDIA_ROOT, 'employees')
    os.makedirs(db_path, exist_ok=True)
    return db_path

def create_no_signal_frame(text="NO SIGNAL"):
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    cv2.putText(frame, text, (140, 250), cv2.FONT_HERSHEY_SIMPLEX, 1.2, (80, 80, 80), 2)
    _, buffer = cv2.imencode('.jpg', frame)
    return buffer.tobytes()

NO_SIGNAL_BYTES = create_no_signal_frame()
CONNECTING_BYTES = create_no_signal_frame("CONNECTING...")

# --- BACKGROUND WORKER (CONSUMER) ---
def face_recognition_worker():
    print("[INIT] Background Face Recognition Worker Started.")
    while True:
        try:
            task = face_queue.get()
            if task is None: continue
            
            face_crop = task['face_crop']
            annotated_frame_buf = task['frame_buf']
            v_type = task['v_type']
            db_p = get_db_path()
            
            emp_id, is_unk = None, True
            final_dist = None
            likely_name = None
            skip_log = False
            
            # Only run recognition if we are in face mode
            if model_swapper.get_system_mode() == "face":
                print(f"[WORKER] Task received. Violation: {v_type}")
                if face_crop.size > 0:
                    # 1. DYNAMIC ENLARGE: Scale more if the face is smaller
                    orig_h = face_crop.shape[0]
                    scale = 1.0
                    if orig_h < 100: scale = 4.0
                    elif orig_h < 200: scale = 3.0
                    elif orig_h < 400: scale = 2.0
                    
                    if scale > 1.0:
                        face_crop = cv2.resize(face_crop, (0,0), fx=scale, fy=scale, interpolation=cv2.INTER_CUBIC)
                        print(f"[WORKER] Small face detected ({orig_h}px). Scaled {scale}x for AI.")
                    
                    # Toned down sharpening to avoid artifacts
                    gaussian = cv2.GaussianBlur(face_crop, (0, 0), 1.0)
                    face_crop = cv2.addWeighted(face_crop, 1.2, gaussian, -0.2, 0)

                    # Save debug face crop
                    debug_path = os.path.join(settings.MEDIA_ROOT, 'debug_face.jpg')
                    cv2.imwrite(debug_path, face_crop)
                    
                    if os.path.exists(db_p):
                        db_images = [f for f in os.listdir(db_p) if f.lower().endswith(('.jpg', '.png')) and not f.endswith('.pkl')]
                        if len(db_images) > 0:
                            try:
                                print(f"[WORKER] Analyzing with ArcFace (RetinaFace Backend)...")
                                with yolo_lock:
                                    # RetinaFace is slower on CPU but much more accurate than OpenCV
                                    dfs = DeepFace.find(
                                        img_path=face_crop, 
                                        db_path=db_p, 
                                        model_name="ArcFace", 
                                        detector_backend="retinaface", 
                                        distance_metric="cosine", 
                                        enforce_detection=False, 
                                        silent=True
                                    )
                                
                                if dfs and not dfs[0].empty:
                                    df = dfs[0]
                                    dist_col = [c for c in df.columns if any(x in c.lower() for x in ['cosine', 'distance'])][0]
                                    
                                    best_dist = df.iloc[0][dist_col]
                                    best_id = os.path.basename(df.iloc[0]['identity'])
                                    final_dist = best_dist
                                    
                                    # Find the best match for diagnostics/likely candidate
                                    candidate = Employee.objects.filter(photo__icontains=best_id).first()
                                    if candidate:
                                        likely_name = candidate.name

                                    # ArcFace/cosine calibrated default threshold (0.68 = DeepFace recommended ceiling)
                                    if best_dist < 0.68:
                                        if candidate:
                                            emp_id, is_unk = candidate, False
                                            print(f"[SUCCESS] ArcFace Recognized: {candidate.name} (Dist: {best_dist:.4f})")
                                    else:
                                        print(f"[WORKER] Confidence low ({best_dist:.4f} > 0.68). Status: Unknown.")
                                else:
                                    print(f" >>> [RESULT] ArcFace: No matches found in database.")
                            except ValueError:
                                print(f" >>> [DETECTION FAILED] RetinaFace could not find a valid face.")
                                if v_type == "Face Identification Scan":
                                    print("[WORKER] Skipping alert log creation (No face visible in Scan).")
                                    skip_log = True
                            except Exception as e:
                                print(f" >>> [ERROR] ArcFace error: {e}")
            
            # Save Alert (Abort if no face was found during a scan)
            if not skip_log:
                # If we're in face mode and identified an employee, log attendance instead of an alert
                if v_type == "Face Identification Scan" and not is_unk and emp_id:
                    today = timezone.localtime(timezone.now()).date()
                    now_time = timezone.localtime(timezone.now()).time()
                    sys_settings = SystemSettings.get_settings()
                    
                    att, created = Attendance.objects.get_or_create(employee=emp_id, date=today)
                    if created:
                        att.check_in = timezone.now()
                        # Calculate check-in status
                        if now_time > sys_settings.office_open_time:
                            att.status = "Late"
                        else:
                            att.status = "On Time"
                        print(f"[ATTENDANCE] Checked-in: {emp_id.name} ({att.status})")
                    else:
                        att.check_out = timezone.now()
                        # Update status if leaving early
                        if now_time < sys_settings.office_close_time:
                            if "Late" in att.status:
                                att.status = "Late & Early Departure"
                            else:
                                att.status = "Early Departure"
                        else:
                            # If they were late but left on time, keep Late. If they were on time, mark Completed.
                            if att.status == "On Time":
                                att.status = "Completed"
                        print(f"[ATTENDANCE] Updated Check-out: {emp_id.name} ({att.status})")
                    att.save()
                    # Also write to AlertLog so the live alerts panel shows the identified person
                    AlertLog.objects.create(
                        employee=emp_id,
                        unknown_person=False,
                        violation_type="Face Identification Scan",
                        distance_score=final_dist,
                        likely_candidate=None,
                        snapshot=ContentFile(annotated_frame_buf, name=f"a_{uuid.uuid4().hex[:8]}.jpg")
                    )
                else:
                    # Normal violation or unknown person in face mode
                    AlertLog.objects.create(
                        employee=emp_id, 
                        unknown_person=is_unk, 
                        violation_type=v_type, 
                        distance_score=final_dist,
                        likely_candidate=likely_name if is_unk else None,
                        snapshot=ContentFile(annotated_frame_buf, name=f"a_{uuid.uuid4().hex[:8]}.jpg")
                    )
            
            face_queue.task_done()
        except Exception as e:
            print(f"[WORKER] Error processing face: {e}")

threading.Thread(target=face_recognition_worker, daemon=True).start()

# --- CAMERA INSTANCE ---
class CameraInstance:
    def __init__(self, source, frame_rate=10):
        self.source = source
        self.frame_rate = frame_rate
        self.cap = None
        self.frame = None
        self.annotated_frame = None
        self.stopped = True
        self.connecting = False
        self.last_log_time = {}
        self.ai_busy = False
        self.frame_count = 0
        self.lock = threading.Lock()
        self.error_count = 0
        self.last_activity = time.time()

    def start(self):
        with self.lock:
            self.last_activity = time.time()
            if not self.stopped or self.connecting: return
            self.stopped = False
            self.connecting = True
            threading.Thread(target=self._capture_loop, name=f"Cap-{self.source}", daemon=True).start()
            threading.Thread(target=self._ai_loop, name=f"AI-{self.source}", daemon=True).start()

    def stop(self):
        with self.lock:
            self.stopped = True
            self.connecting = False
            if self.cap:
                try: self.cap.release()
                except: pass
                self.cap = None

    def _capture_loop(self):
        actual_source = self.source
        if isinstance(self.source, str) and self.source.isdigit():
            actual_source = int(self.source)
        
        try:
            if isinstance(actual_source, int):
                found = False
                for backend in [cv2.CAP_DSHOW, cv2.CAP_MSMF, cv2.CAP_ANY]:
                    if found: break
                    for idx in [0, 1, 2]:
                        try:
                            tmp_cap = cv2.VideoCapture(idx, backend)
                            if tmp_cap and tmp_cap.isOpened():
                                self.cap = tmp_cap
                                found = True
                                break
                            elif tmp_cap: tmp_cap.release()
                        except: continue
            else:
                self.cap = cv2.VideoCapture(actual_source)

            if not self.cap or not self.cap.isOpened():
                self.stopped = True
                self.connecting = False
                return

            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
            self.connecting = False

            while not self.stopped:
                if time.time() - self.last_activity > 30: break
                try:
                    success, frame = self.cap.read()
                    if success and frame is not None:
                        self.frame = frame
                        self.error_count = 0
                    else:
                        self.error_count += 1
                        if self.error_count > 50: break
                        time.sleep(0.01)
                except: break
        except: pass
        self.stop()

    def _ai_loop(self):
        while not self.stopped:
            if self.frame is None or self.ai_busy:
                time.sleep(0.1)
                continue
            
            self.frame_count += 1
            if self.frame_count % self.frame_rate != 0:
                time.sleep(0.01)
                continue

            self.ai_busy = True
            try:
                raw_frame = self.frame.copy()
                self.annotated_frame = self._process_frame(raw_frame)
            except: pass
            finally: self.ai_busy = False

    def _process_frame(self, frame):
        mode = model_swapper.get_system_mode()
        if mode == "face":
            return self._process_face_mode(frame)
        return self._process_ppe_mode(frame)

    def _process_face_mode(self, frame):
        if model_swapper.yolo_coco is None: return frame
        h, w = frame.shape[:2]
        DET_SIZE = 960  # Higher res for CCTV: keeps distant/small people detectable (CPU-balanced)
        small = cv2.resize(frame, (DET_SIZE, int(h * (DET_SIZE / w))))
        sx, sy = w / DET_SIZE, h / int(h * (DET_SIZE / w))

        with yolo_lock:
            results = list(model_swapper.yolo_coco.predict(small, stream=True, conf=0.25, classes=[0], verbose=False))
            
        annotated = frame.copy()
        now = datetime.now()

        for r in results:
            for box in r.boxes:
                coords = [c*sx if i%2==0 else c*sy for i, c in enumerate(box.xyxy[0].tolist())]
                px1, py1, px2, py2 = map(int, coords)
                
                log_key = "face_mode_cooldown"
                if log_key not in self.last_log_time or (now - self.last_log_time[log_key]).total_seconds() > 3:
                    self.last_log_time[log_key] = now
                    # Focus on the HEAD area (top 45% of person to handle tilts)
                    bw, bh = px2 - px1, py2 - py1
                    head_h = int(bh * 0.45)
                    cx1, cy1 = max(0, px1 - int(bw * 0.15)), max(0, py1 - int(bh * 0.15))
                    cx2, cy2 = min(w, px2 + int(bw * 0.15)), min(h, py1 + head_h) 
                    face_crop = frame[cy1:cy2, cx1:cx2]
                    _, buf = cv2.imencode('.jpg', annotated)
                    if face_crop.size > 0:
                        face_queue.put({'face_crop': face_crop, 'frame_buf': buf.tobytes(), 'v_type': "Face Identification Scan"})
                
                cv2.rectangle(annotated, (px1, py1), (px2, py2), (255, 255, 0), 2)
                cv2.putText(annotated, "IDENTIFYING...", (px1, py1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
        return annotated

    def _process_ppe_mode(self, frame):
        if model_swapper.yolo_ppe is None: return frame
        h, w = frame.shape[:2]
        DET_SIZE = 640
        small = cv2.resize(frame, (DET_SIZE, int(h * (DET_SIZE / w))))
        sx, sy = w / DET_SIZE, h / int(h * (DET_SIZE / w))
        
        with yolo_lock:
            results = list(model_swapper.yolo_ppe.predict(small, stream=True, conf=0.5, verbose=False))
            coco_persons = list(model_swapper.yolo_coco.predict(small, stream=True, conf=0.2, classes=[0], verbose=False)) if model_swapper.yolo_coco else []
            
        annotated = frame.copy()
        violations = []
        all_person_coords = []

        for r in results:
            for box in r.boxes:
                coords = [c*sx if i%2==0 else c*sy for i, c in enumerate(box.xyxy[0].tolist())]
                label = r.names[int(box.cls[0])].lower()
                if label == 'person': 
                    all_person_coords.append(coords)
                elif 'no-' in label or 'not' in label:
                    violations.append({'label': label, 'coords': coords})
                    vx1, vy1, vx2, vy2 = map(int, coords)
                    cv2.rectangle(annotated, (vx1, vy1), (vx2, vy2), (0, 0, 255), 2)
                    cv2.putText(annotated, label.upper(), (vx1, vy1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        if model_swapper.yolo_coco:
            for cr in coco_persons:
                for box in cr.boxes:
                    coords = [c*sx if i%2==0 else c*sy for i, c in enumerate(box.xyxy[0].tolist())]
                    all_person_coords.append(coords)
            
            for p_coords in all_person_coords:
                px1, py1, px2, py2 = map(int, p_coords)
                cx1, cy1 = max(0, px1 - 50), max(0, py1 - 50)
                cx2, cy2 = min(w, px2 + 50), min(h, py2 + 50)
                person_crop = frame[cy1:cy2, cx1:cx2]
                if person_crop.size == 0: continue
                with yolo_lock:
                    phone_results = model_swapper.yolo_coco.predict(person_crop, conf=0.15, classes=[67], verbose=False, imgsz=640)
                for pr in phone_results:
                    for pbox in pr.boxes:
                        phx1, phy1, phx2, phy2 = map(int, pbox.xyxy[0])
                        gx1, gy1, gx2, gy2 = cx1 + phx1, cy1 + phy1, cx1 + phx2, cy1 + phy2
                        violations.append({'label': 'using phone', 'coords': [gx1, gy1, gx2, gy2]})
                        cv2.rectangle(annotated, (gx1, gy1), (gx2, gy2), (0, 0, 255), 2)
                        cv2.putText(annotated, "USING PHONE", (gx1, gy1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)

        now = datetime.now()
        for p_coords in all_person_coords:
            px1, py1, px2, py2 = map(int, p_coords)
            p_v = [v['label'] for v in violations if px1-20 <= (v['coords'][0]+v['coords'][2])/2 <= px2+20 and py1-20 <= (v['coords'][1]+v['coords'][3])/2 <= py2+20]
            if p_v:
                cv2.rectangle(annotated, (px1, py1), (px2, py2), (0, 0, 255), 2)
                v_list = [v == 'using phone' and 'Using Phone' or v.replace('no-', 'Missing ').replace('-', ' ').title() for v in set(p_v)]
                v_type = ", ".join(v_list)
                
                log_key = "general_violation_cooldown"
                if log_key not in self.last_log_time or (now - self.last_log_time[log_key]).total_seconds() > 5:
                    self.last_log_time[log_key] = now
                    cx1, cy1 = max(0, px1-int((px2-px1)*0.1)), max(0, py1-int((py2-py1)*0.1))
                    cx2, cy2 = min(w, px2+int((px2-px1)*0.1)), min(h, py1+int((py2-py1)*0.2)) 
                    face_crop = frame[cy1:cy2, cx1:cx2]
                    _, buf = cv2.imencode('.jpg', annotated)
                    if face_crop.size > 0:
                        face_queue.put({'face_crop': face_crop, 'frame_buf': buf.tobytes(), 'v_type': v_type})
                cv2.putText(annotated, "PPE VIOLATION", (px1, py1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            else:
                cv2.rectangle(annotated, (px1, py1), (px2, py2), (0, 255, 0), 2)
                cv2.putText(annotated, "Safe", (px1, py1-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        return annotated

class CameraManager:
    def __init__(self):
        self.instances = {}
        self.lock = threading.Lock()
    def get_instance(self, source, frame_rate=10):
        with self.lock:
            if source not in self.instances:
                self.instances[source] = CameraInstance(source, frame_rate)
            return self.instances[source]

camera_manager = CameraManager()

def get_frame_bytes(source, frame_rate=10):
    instance = camera_manager.get_instance(source, frame_rate)
    instance.last_activity = time.time()
    instance.start()
    f = instance.annotated_frame if instance.annotated_frame is not None else instance.frame
    if f is not None:
        _, buf = cv2.imencode('.jpg', f)
        return buf.tobytes()
    return CONNECTING_BYTES if instance.connecting else NO_SIGNAL_BYTES

def generate_frames(source, frame_rate=10):
    while True:
        data = get_frame_bytes(source, frame_rate)
        yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n' b'Content-Length: ' + str(len(data)).encode() + b'\r\n\r\n' + data + b'\r\n')
        time.sleep(0.05)

def video_feed(request):
    cam_id = request.GET.get('cam_id')
    source = 0; frame_rate = 10
    if cam_id:
        cam = get_object_or_404(CameraDevice, pk=cam_id)
        source = cam.get_rtsp_url()
        frame_rate = cam.process_frame_rate
    return StreamingHttpResponse(generate_frames(source, frame_rate), content_type='multipart/x-mixed-replace; boundary=frame')

def camera_snapshot(request):
    cam_id = request.GET.get('cam_id')
    source = 0; frame_rate = 10
    if cam_id:
        cam = get_object_or_404(CameraDevice, pk=cam_id)
        source = cam.get_rtsp_url()
        frame_rate = cam.process_frame_rate
    return HttpResponse(get_frame_bytes(source, frame_rate), content_type='image/jpeg')

@ensure_csrf_cookie
def index(request): 
    return render(request, 'index.html')

def devices(request, pk=None):
    if request.method == 'POST':
        device = get_object_or_404(CameraDevice, pk=pk) if pk else None
        form = CameraDeviceForm(request.POST, instance=device)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error', 'errors': form.errors})
    return render(request, 'index.html')

@csrf_exempt
@require_POST
def delete_device(request, pk):
    get_object_or_404(CameraDevice, pk=pk).delete()
    return JsonResponse({'status': 'success'})

def register(request):
    if request.method == 'POST':
        form = EmployeeForm(request.POST, request.FILES)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error'})
    return render(request, 'index.html')

def get_logs(request):
    logs = AlertLog.objects.order_by('-timestamp')[:100]
    data = []
    for l in logs:
        if l.employee:
            name = l.employee.name
            if l.distance_score is not None:
                name += f" (Dist: {l.distance_score:.4f})"
        elif l.unknown_person:
            if l.likely_candidate:
                name = f"Unknown | Likely: {l.likely_candidate}"
                if l.distance_score is not None:
                    name += f" (Dist: {l.distance_score:.4f})"
            else:
                name = "Unknown"
        else:
            name = "Unidentified"
        
        data.append({
            'name': name,
            'violation': l.violation_type,
            'timestamp': timezone.localtime(l.timestamp).strftime('%H:%M:%S'),
            'snapshot_url': l.snapshot.url if l.snapshot else None
        })
    return JsonResponse({'logs': data})

def get_employees(request):
    data = [{ 'id': e.employee_id, 'db_id': e.id, 'name': e.name, 'photo_url': e.photo.url if e.photo else None, 'role': 'Staff', 'department': 'General', 'status': 'Active', 'accessLevel': 'Standard' } for e in Employee.objects.all().order_by('-id')]
    return JsonResponse({'employees': data})

import ping3
import socket
from .models import NVRDevice, RTSPStringTemplate
from .forms import NVRDeviceForm, RTSPStringTemplateForm

def get_cameras(request):
    data = []
    ip_only = request.GET.get('ip_only') == 'true'
    qs = CameraDevice.objects.filter(nvr__isnull=True) if ip_only else CameraDevice.objects.all()
    
    for c in qs.order_by('id'):
        is_active = False
        source = c.get_rtsp_url()
        with camera_manager.lock:
            if source in camera_manager.instances:
                inst = camera_manager.instances[source]
                if not inst.stopped and inst.error_count < 10:
                    is_active = True
        if not is_active and c.ip_address:
            try:
                with socket.create_connection((c.ip_address, 554), timeout=0.5): is_active = True
            except:
                try:
                    delay = ping3.ping(c.ip_address, timeout=0.5)
                    is_active = delay is not None and delay is not False
                except: pass
        data.append({ 'id': c.id, 'name': c.name, 'ip': c.ip_address or f"NVR (CH {c.channel})", 'channel': c.channel, 'fps': c.process_frame_rate, 'active': is_active, 'username': c.username, 'password': c.password })
    return JsonResponse({'cameras': data})

@csrf_exempt
def rtsp_templates(request, pk=None):
    if request.method == 'GET':
        templates = [{'id': t.id, 'name': t.name, 'template_string': t.template_string} for t in RTSPStringTemplate.objects.all().order_by('name')]
        return JsonResponse({'templates': templates})
    elif request.method == 'POST':
        template = get_object_or_404(RTSPStringTemplate, pk=pk) if pk else None
        form = RTSPStringTemplateForm(request.POST, instance=template)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error', 'errors': form.errors})

@csrf_exempt
@require_POST
def delete_rtsp_template(request, pk):
    get_object_or_404(RTSPStringTemplate, pk=pk).delete()
    return JsonResponse({'status': 'success'})

@csrf_exempt
def nvrs(request, pk=None):
    if request.method == 'GET':
        data = []
        for n in NVRDevice.objects.all().order_by('id'):
            channels = [{'id': c.id, 'name': c.name, 'channel': c.channel, 'fps': c.process_frame_rate} for c in n.channels.all().order_by('channel')]
            data.append({
                'id': n.id, 'name': n.name, 'ip_address': n.ip_address, 'port': n.port,
                'username': n.username, 'password': n.password, 
                'rtsp_template_id': n.rtsp_template_id, 'channels': channels
            })
        return JsonResponse({'nvrs': data})
    elif request.method == 'POST':
        nvr = get_object_or_404(NVRDevice, pk=pk) if pk else None
        form = NVRDeviceForm(request.POST, instance=nvr)
        if form.is_valid():
            form.save()
            return JsonResponse({'status': 'success'})
        return JsonResponse({'status': 'error', 'errors': form.errors})

@csrf_exempt
@require_POST
def delete_nvr(request, pk):
    get_object_or_404(NVRDevice, pk=pk).delete()
    return JsonResponse({'status': 'success'})

@csrf_exempt
@require_POST
def add_nvr_channel(request, pk):
    nvr = get_object_or_404(NVRDevice, pk=pk)
    channel = request.POST.get('channel', 1)
    fps = request.POST.get('process_frame_rate', 10)
    
    if CameraDevice.objects.filter(nvr=nvr, channel=channel).exists():
        return JsonResponse({'status': 'error', 'message': 'Channel already exists.'})
        
    name = f"{nvr.name} - CH {channel}"
    CameraDevice.objects.create(name=name, channel=channel, process_frame_rate=fps, nvr=nvr)
    return JsonResponse({'status': 'success'})

@csrf_exempt
@require_POST
def clear_logs(request):
    try:
        logs = AlertLog.objects.all()
        for log in logs:
            if log.snapshot:
                try:
                    if os.path.exists(log.snapshot.path): os.remove(log.snapshot.path)
                except: pass
        AlertLog.objects.all().delete()
        with camera_manager.lock:
            for instance in camera_manager.instances.values(): instance.last_log_time = {}
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)})

def edit_employee(request, pk):
    emp = get_object_or_404(Employee, pk=pk)
    if request.method == 'POST':
        form = EmployeeForm(request.POST, request.FILES, instance=emp)
        if form.is_valid(): form.save(); return JsonResponse({'status': 'success'})
    return JsonResponse({'status': 'error'})

def delete_employee(request, pk):
    get_object_or_404(Employee, pk=pk).delete()
    return JsonResponse({'status': 'success'})

@csrf_exempt
def set_system_mode(request):
    mode = request.GET.get('mode')
    if mode in ["ppe", "face"]:
        model_swapper.switch_mode(mode)
        return JsonResponse({'status': 'success', 'mode': mode})
    return JsonResponse({'status': 'error', 'message': 'Invalid mode'})

def get_system_mode(request):
    return JsonResponse({'mode': model_swapper.get_system_mode()})

def get_attendance(request):
    records = Attendance.objects.select_related('employee').order_by('-date', '-check_in')
    data = []
    for r in records:
        data.append({
            'employee_name': r.employee.name,
            'employee_id': r.employee.employee_id,
            'date': r.date.strftime('%Y-%m-%d'),
            'check_in': r.check_in.strftime('%H:%M:%S') if r.check_in else None,
            'check_out': r.check_out.strftime('%H:%M:%S') if r.check_out else None,
            'status': r.status,
        })
    return JsonResponse({'attendance': data})

@csrf_exempt
def system_settings(request):
    settings = SystemSettings.get_settings()
    if request.method == 'POST':
        open_time = request.POST.get('office_open_time')
        close_time = request.POST.get('office_close_time')
        if open_time: settings.office_open_time = open_time
        if close_time: settings.office_close_time = close_time
        settings.save()
        return JsonResponse({'status': 'success'})
    
    return JsonResponse({
        'office_open_time': settings.office_open_time.strftime('%H:%M'),
        'office_close_time': settings.office_close_time.strftime('%H:%M'),
    })
