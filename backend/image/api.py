from django.contrib.auth.models import User
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.db import DataError
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.utils.dateparse import parse_datetime
from django.db import transaction

from models.models import Box, Image
from image.forms import ImageForm
from box.forms import BoxForm

import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

import json

import tensorflow as tf
import sys
from absl import app, logging, flags
from absl.flags import FLAGS
import time
import cv2
import numpy as np
import tensorflow as tf
from yolov3_tf2.models import (
    YoloV3, YoloV3Tiny
)
from yolov3_tf2.dataset import transform_images, load_tfrecord_dataset
from yolov3_tf2.utils import draw_outputs

app._run_init(['yolov3'], app.parse_flags_with_usage)

# Simplified version at the moment
# Usage of YOLO model will most likely be implemented here
@api_view(['POST'])
@csrf_exempt
def create_new(request):
    classes = 'data/coco.names'
    weights = 'checkpoints/yolov3.tf'
    size = 416
    num_classes = 80

    yolo = YoloV3(classes=num_classes)   
    yolo.load_weights(weights).expect_partial()
    class_names = [c.strip() for c in open(classes).readlines()]
    
    try:
        # check if file md5 already exists
        md5_hash = request.POST['id']
        image_exists = Image.objects.filter(id = md5_hash).exists()

        if image_exists:
            return JsonResponse({"message": "Image already exists."}, status=204)
        
        image_form  = ImageForm(request.POST, request.FILES)
        if image_form.is_valid():
            # saves image into the database
            image = image_form.save()
            
            image_path = image.file.name
            image_id = image.id

            img_raw = tf.image.decode_image(open(os.path.join(BASE_DIR) + '/' +  image_path, 'rb').read(), channels=3)
            img = tf.expand_dims(img_raw, 0)
            img = transform_images(img, size)
            
            boxes, scores, classes, nums = yolo(img)

            img = cv2.cvtColor(img_raw.numpy(), cv2.COLOR_RGB2BGR)

            # detect objects
            set_boxes = []
            for i in range(nums[0]):
                comment=class_names[int(classes[0][i])]
                score=np.array(scores[0][i])
                x1y1x2y2 = np.array(boxes[0][i])
                x1 = x1y1x2y2[0]
                y1 = x1y1x2y2[1]
                x2 = x1y1x2y2[2]
                y2 = x1y1x2y2[3]
                
                box_data = {
                    "image": image_id,
                    "x": x1,
                    "y": y1,
                    "height": y2 - y1,
                    "width": x2 - x1,
                    "label": comment,
                    "probability": score
                }

                set_boxes.append(box_data)
            
            # save the boxes
            with transaction.atomic():
                for box in set_boxes:
                    box_form =  BoxForm(box)
                    box_form.save()
            
            return JsonResponse({"message": "Success"}, status=204)
                
        else:
            return JsonResponse({"message": image_form.errors}, status=400)
        
    except ObjectDoesNotExist as e:
        return JsonResponse({"message": str(e)}, status=404)
    except DataError as e:
        return JsonResponse({"message": str(e)}, status=400)

@api_view(['GET'])
def get_details(request):
    try:
        sort_params = request.GET.dict()
        
        images = Image.objects.filter(**sort_params).values()

        final_response = []
        # for each image, get its corresponding boxes     
        for image in images:
            filter = { 'image': image['id'] }
            boxes = Box.objects.filter(**filter).values()
            boxes_cleaned = []

            for box in boxes:
                box_item = {
                    'id': box['id'],
                    'x': box['x'],
                    'y': box['y'],
                    'height': box['height'],
                    'width': box['width'],
                    'label': box['label'],
                    'probability': box['probability'],
                }
                boxes_cleaned.append(box_item)

            image_item = {
                'id': image['id'],
                'file': image['file'],
                'height': image['height'],
                'width': image['width'],
                'boxes': boxes_cleaned
            }

            final_response.append(image_item)

        return HttpResponse(json.dumps(final_response), content_type="application/json")
    except Exception as e:
        return JsonResponse({
            "message": str(e)
        }, status = 400)