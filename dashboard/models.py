from django.db import models

class Employee(models.Model):
    name = models.CharField(max_length=100)
    employee_id = models.CharField(max_length=50, unique=True)
    photo = models.ImageField(upload_to='employees/')

    def __str__(self):
        return f"{self.name} ({self.employee_id})"

class CameraDevice(models.Model):
    name = models.CharField(max_length=100)
    ip_address = models.CharField(max_length=100)
    username = models.CharField(max_length=100, blank=True, null=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    channel = models.IntegerField(default=102)
    process_frame_rate = models.IntegerField(default=10, help_text="Process every Nth frame")
    is_active = models.BooleanField(default=True)

    def get_rtsp_url(self):
        import urllib.parse
        if self.username and self.password:
            user = urllib.parse.quote(self.username)
            pw = urllib.parse.quote(self.password)
            return f"rtsp://{user}:{pw}@{self.ip_address}:554/Streaming/Channels/{self.channel}"
        return f"rtsp://{self.ip_address}:554/Streaming/Channels/{self.channel}"

    def __str__(self):
        return f"{self.name} - {self.ip_address}"

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

