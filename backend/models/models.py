from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.postgres.fields import JSONField, ArrayField

class Image(models.Model):
    class Meta:
        db_table = "image"
    
    id = models.CharField(primary_key=True, max_length=255)
    file = models.ImageField(upload_to="static/images")
    height = models.FloatField(default=0)
    width = models.FloatField(default=0)
    inserted_at = models.DateTimeField(default=timezone.now)

class Box(models.Model):
    class Meta:
        db_table = "box"
    
    image = models.ForeignKey(Image, on_delete=models.SET_NULL, blank=True, null=True)
    top_left_x_coordinate = models.FloatField(default=0)
    top_left_y_coordinate = models.FloatField(default=0)
    height = models.FloatField(default=0)
    width = models.FloatField(default=0)
    label = models.CharField(max_length=100, blank=True, null=True)
    label_probability = models.FloatField(blank=True, null=True)
    inserted_at = models.DateTimeField(default=timezone.now)
