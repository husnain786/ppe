from django import forms
from .models import Employee, CameraDevice, NVRDevice, RTSPStringTemplate

class EmployeeForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ['name', 'employee_id', 'photo']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'employee_id': forms.TextInput(attrs={'class': 'form-control'}),
            'photo': forms.FileInput(attrs={'class': 'form-control'}),
        }

class CameraDeviceForm(forms.ModelForm):
    class Meta:
        model = CameraDevice
        fields = ['name', 'ip_address', 'username', 'password', 'channel', 'process_frame_rate', 'is_active', 'nvr']
        widgets = {
            'name': forms.TextInput(attrs={'class': 'form-control'}),
            'ip_address': forms.TextInput(attrs={'class': 'form-control'}),
            'username': forms.TextInput(attrs={'class': 'form-control'}),
            'password': forms.PasswordInput(attrs={'class': 'form-control'}, render_value=True),
            'channel': forms.NumberInput(attrs={'class': 'form-control'}),
            'process_frame_rate': forms.NumberInput(attrs={'class': 'form-control'}),
            'is_active': forms.CheckboxInput(attrs={'class': 'form-check-input'}),
        }

class NVRDeviceForm(forms.ModelForm):
    class Meta:
        model = NVRDevice
        fields = ['name', 'ip_address', 'port', 'username', 'password', 'rtsp_template']

class RTSPStringTemplateForm(forms.ModelForm):
    class Meta:
        model = RTSPStringTemplate
        fields = ['name', 'template_string']
