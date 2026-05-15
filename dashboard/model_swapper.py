import gc
import os
import torch
import threading
import tensorflow as tf
from ultralytics import YOLO
from deepface import DeepFace
from django.conf import settings

# Global state
SYSTEM_MODE = "ppe" # "ppe" or "face"
MODELS_LOADED = False
model_lock = threading.Lock()

# Model paths
PPE_PATH = os.path.join(settings.BASE_DIR, 'ppe.pt')
COCO_PATH = os.path.join(settings.BASE_DIR, 'yolo11n.pt')

# Holders
yolo_ppe = None
yolo_coco = None

def get_system_mode():
    return SYSTEM_MODE

def clear_gpu_memory(keep_coco=False):
    """Forcefully clear GPU memory. Optionally keep the base person detector."""
    global yolo_ppe, yolo_coco
    
    with model_lock:
        # Clear PPE specific model
        yolo_ppe = None
        
        if not keep_coco:
            yolo_coco = None
    
    # Clear Keras/DeepFace sessions
    try:
        tf.keras.backend.clear_session()
    except: pass
    
    # Force GC
    gc.collect()
    
    # Clear Torch Cache
    if torch.cuda.is_available():
        torch.cuda.empty_cache()
        torch.cuda.ipc_collect()
    
    print(f"[SYSTEM] GPU Memory Cleared (keep_coco={keep_coco}).")

def load_ppe_models():
    global yolo_ppe, yolo_coco, MODELS_LOADED, SYSTEM_MODE
    print("[SYSTEM] Loading PPE Models...")
    try:
        with model_lock:
            if yolo_ppe is None:
                yolo_ppe = YOLO(PPE_PATH, task='detect')
                if torch.cuda.is_available(): yolo_ppe.to('cuda')
            
            if yolo_coco is None:
                yolo_coco = YOLO(COCO_PATH, task='detect')
                if torch.cuda.is_available(): yolo_coco.to('cuda')
        
        MODELS_LOADED = True
        SYSTEM_MODE = "ppe"
        print("[SYSTEM] PPE Models Loaded.")
    except Exception as e:
        print(f"[SYSTEM] Error loading PPE models: {e}")

def load_face_models():
    global yolo_coco, MODELS_LOADED, SYSTEM_MODE
    print("[SYSTEM] Loading Face Recognition Models...")
    try:
        # Face mode STILL NEEDS a person detector (COCO)
        with model_lock:
            if yolo_coco is None:
                yolo_coco = YOLO(COCO_PATH, task='detect')
                if torch.cuda.is_available(): yolo_coco.to('cuda')

        # DeepFace loads lazily but we can force growth to be safe
        gpus = tf.config.experimental.list_physical_devices('GPU')
        if gpus:
            try:
                for gpu in gpus:
                    tf.config.experimental.set_memory_growth(gpu, True)
            except: pass
        
        MODELS_LOADED = True
        SYSTEM_MODE = "face"
        print("[SYSTEM] Face Models Loaded (Detector + ArcFace).")
    except Exception as e:
        print(f"[SYSTEM] Error loading Face models: {e}")

def switch_mode(new_mode):
    global SYSTEM_MODE, MODELS_LOADED
    if new_mode == SYSTEM_MODE and MODELS_LOADED:
        return
    
    print(f"[SYSTEM] Switching mode: {SYSTEM_MODE} -> {new_mode}")
    
    # When switching to Face mode, we keep COCO for person detection
    if new_mode == "face":
        clear_gpu_memory(keep_coco=True)
        load_face_models()
    else:
        clear_gpu_memory(keep_coco=True)
        load_ppe_models()
    
    SYSTEM_MODE = new_mode
