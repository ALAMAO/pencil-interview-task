from django import forms
from models.models import Box

class BoxForm(forms.ModelForm):
    class Meta:
        model = Box
        fields = [
            'image',
            'top_left_x_coordinate',
            'top_left_y_coordinate',
            'height',
            'width',
            'label',
            'label_probability'
        ]