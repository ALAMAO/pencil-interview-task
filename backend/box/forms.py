from django import forms
from models.models import Box

class BoxForm(forms.ModelForm):
    class Meta:
        model = Box
        fields = [
            'image',
            'coordinates',
            'label',
            'label_probability'
        ]