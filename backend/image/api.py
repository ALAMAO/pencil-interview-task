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

CLASSES = 'yolov3_tf2/data/coco.names'
WEIGHTS = 'yolov3_tf2/checkpoints/yolov3.tf'
SIZE = 416
NUM_CLASSES = 80


# Simplified version at the moment
# Usage of YOLO model will most likely be implemented here
@api_view(['POST'])
@csrf_exempt
def create_new(request):

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
        try:
            app._run_init(['yolov3'], app.parse_flags_with_usage)
            yolo = YoloV3(classes=NUM_CLASSES)   
            yolo.load_weights(WEIGHTS).expect_partial()
            class_names = [c.strip() for c in open(CLASSES).readlines()]

            img_raw = tf.image.decode_image(open(os.path.join(BASE_DIR) + '/' +  image_path, 'rb').read(), channels=3)
            img = tf.expand_dims(img_raw, 0)
            img = transform_images(img, SIZE)
            
            bbs, scores, classes, nums = yolo(img)
            bbs, scores, classes, nums = bbs[0], scores[0], classes[0], nums[0]

            img = cv2.cvtColor(img_raw.numpy(), cv2.COLOR_RGB2BGR)
        except ObjectDoesNotExist as e:
            return JsonResponse({"message": str(e)}, status=404)
        except DataError as e:
            return JsonResponse({"message": str(e)}, status=400)

        # detect objects
        boxes = []
        for i in range(nums):
            x1, y1, x2, y2 = np.array(bbs[i])
            
            box_data = {
                "image": image_id,
                "x": x1,
                "y": y1,
                "height": y2 - y1,
                "width": x2 - x1,
                "label": class_names[int(classes[i])],
                "probability": np.array(scores[i])
            }

            boxes.append(box_data)
        
        # save the boxes
        with transaction.atomic():
            for box in boxes:
                box_form =  BoxForm(box)
                box_form.save()
        
        return JsonResponse({"message": "Success"}, status=204)
    else:
        return JsonResponse({"message": image_form.errors}, status=400)

@api_view(['GET'])
def get_details(request):
    sort_params = request.GET.dict()
    
    images = Image.objects.filter(**sort_params).values()

    final_response = []
    # for each image, get its corresponding boxes     
    for image in images:
        image_id = image['id']

        boxes = []
        for box in Box.objects.filter(image_id=image_id).values():
            item = {
                'id': box['id'],
                'x': box['x'],
                'y': box['y'],
                'height': box['height'],
                'width': box['width'],
                'label': box['label'],
                'probability': box['probability'],
            }
            boxes.append(item)

        item = {
            'id': image_id,
            'file': image['file'],
            'height': image['height'],
            'width': image['width'],
            'manual_labelled': image['manual_labelled'],
            'boxes': boxes
        }

        final_response.append(item)

    return HttpResponse(json.dumps(final_response), content_type="application/json")