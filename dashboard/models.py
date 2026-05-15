import urllib.parse
from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50, unique=True)
    photo = models.ImageField(upload_to='employees/')

    def __str__(self):
        return f"{self.name} ({self.employee_id})"

class RTSPStringTemplate(models.Model):
    name = models.CharField(max_length=100, unique=True)
    template_string = models.TextField(help_text="Provide the path/query suffix. Use placeholder: {channel}")

    def __str__(self):
        return self.name

class NVRDevice(models.Model):
    name = models.CharField(max_length=100)
    ip_address = models.CharField(max_length=100)
    port = models.IntegerField(default=554)
    username = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    rtsp_template = models.ForeignKey(RTSPStringTemplate, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.name} - {self.ip_address}"

class CameraDevice(models.Model):
    name = models.CharField(max_length=100)
    ip_address = models.CharField(max_length=100, blank=True, null=True)
    username = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    channel = models.IntegerField(default=102)
    process_frame_rate = models.IntegerField(default=10, help_text="Process every Nth frame")
    is_active = models.BooleanField(default=True)
    nvr = models.ForeignKey(NVRDevice, null=True, blank=True, on_delete=models.CASCADE, related_name='channels')

    def get_rtsp_url(self):
        if self.nvr and self.nvr.rtsp_template:
            user = urllib.parse.quote(self.nvr.username, safe="") if self.nvr.username else ""
            pw = urllib.parse.quote(self.nvr.password, safe="") if self.nvr.password else ""

            auth = f"{user}:{pw}@" if user and pw else ""
            base_url = f"rtsp://{auth}{self.nvr.ip_address}:{self.nvr.port}"

            suffix = self.nvr.rtsp_template.template_string.replace('{channel}', str(self.channel))
            if not suffix.startswith('/'):
                suffix = '/' + suffix

            return base_url + suffix

        if self.ip_address:
            if self.username and self.password:
                user = urllib.parse.quote(self.username, safe="")
                pw = urllib.parse.quote(self.password, safe="")
                return f"rtsp://{user}:{pw}@{self.ip_address}:554/Streaming/Channels/{self.channel}"
            return f"rtsp://{self.ip_address}:554/Streaming/Channels/{self.channel}"
        return ""
    def __str__(self):
        return f"{self.name} - {self.ip_address if self.ip_address else 'NVR Channel ' + str(self.channel)}"

class AlertLog(models.Model):
    employee = models.ForeignKey(Employee, on_delete=models.SET_NULL, null=True, blank=True)
    unknown_person = models.BooleanField(default=False)
    violation_type = models.CharField(max_length=255)
    distance_score = models.FloatField(null=True, blank=True)
    likely_candidate = models.CharField(max_length=100, null=True, blank=True)
    snapshot = models.ImageField(upload_to='alerts/', null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        name = self.employee.name if self.employee else ("Unknown" if self.unknown_person else "Unidentified")
        return f"{name} - {self.violation_type} at {self.timestamp.strftime('%Y-%m-%d %H:%M:%S')}"

