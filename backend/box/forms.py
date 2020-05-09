from django import forms
from models.models import Box

class BoxForm(forms.ModelForm):
    class Meta:
        model = Box
        fields = [
            'image',
            'x',
            'y',
            'height',
            'width',
            'label',
            'probability'
        ]