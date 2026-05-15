# Project Context: PPE Detection System

## Project Goal
We are building a real-time PPE (Personal Protective Equipment) detection system using the latest YOLO architecture. It combines object detection for safety gear with facial recognition to identify individuals and log violations.

## Environment Configuration
- **Primary Environment:** `ppe` (Conda)
- **Path:** `C:\Users\Admin\anaconda3\envs\ppe`
- **Database:** MySQL (Database: `ppe`, User: `root`, Password: `admin`)

## Technical Stack
- **Framework:** Django (Python)
- **Object Detection:** YOLOv8 (via `ultralytics`)
- **Facial Recognition:** `DeepFace` (Multi-model: ArcFace + VGG-Face)
- **Face Detector:** `RetinaFace` (for extraction)
- **Vision:** OpenCV (`cv2`)
- **Database:** MySQL
- **Frontend:** React (TypeScript), Vite, Tailwind CSS v4 (SPA)

## Code Structure
- `manage.py`: Django entry point.
- `ppe.pt`: Custom trained YOLO model for PPE classes (Hardhat, Vest, Mask, etc.).
- **`ppe/`**: Project configuration (settings, main URLs).
- **`dashboard/`**: Core Application.
    - `models.py`: 
        - `Employee`: Stores names and facial photos.
        - `AlertLog`: Records violations with employee FK and snapshots.
    - `views.py`: 
        - `generate_frames()`: The heart of the system. Handles the RTSP/Webcam stream, YOLO detection, head-area cropping, and Multi-model DeepFace recognition.
        - `register()`: Employee management interface.
        - `edit_employee()` / `delete_employee()`: CRUD operations for workers.
        - `get_logs()`: JSON API for the live dashboard alert panel.
    - `urls.py`: Routes for the dashboard, video feed, and logs API.
    - `templates/dashboard/`:
        - `base.html`: Main layout with navbar.
        - `index.html`: Live dashboard with video stream, polling alert panel, and snapshot modals.
        - `register.html`: Employee list and registration form.
- **`media/`**:
    - `employees/`: Registered facial photos.
    - `alerts/`: Auto-generated snapshots of violations.
    - `debug_face.jpg`: The last cropped head-area sent to DeepFace (for debugging).

## Detection Logic
1. **Person-Centric Recognition:** The system finds a `Person` first, then looks for violations (e.g., `NO-Hardhat`) inside that person's bounding box.
2. **Two-Pass Phone Detection:** To ensure high accuracy, the system uses a "Digital Zoom" strategy: it detects a person, crops their area with a buffer, and runs a high-sensitivity pass (`conf=0.02`) to find mobile phones.
3. **Multi-Model Voting:** To improve accuracy in CCTV/industrial settings, the system checks the face against both `ArcFace` and `VGG-Face`.
4. **Optimized Performance:** Processes every 15th frame to balance real-time detection with CPU usage.

## Instructions for Gemini
- Always assume code should be compatible with the environment at the path above.
- Prioritize using the `ultralytics` library for YOLO implementation.
- Focus on real-time camera feed processing.
- When modifying `views.py`, ensure the "original_unmarked_frame" is used for cropping to prevent bounding boxes from interfering with facial recognition.
