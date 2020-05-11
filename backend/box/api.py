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
from box.forms import BoxForm

import json

# Simplified version at the moment
# Processing of bounding boxes will be done here
@api_view(['PUT'])
def update_details(request):
    image_id = request.query_params['image_id']

    # Retrieve Image
    image = Image.objects.get(id=image_id)
    image.manual_labelled = True

    # Retrieve Existing Boxes
    existing_boxes = Box.objects.filter(image_id=image_id)

    # updating row and saving changes to DB
    data = json.loads(request.body.decode('utf-8'))
    new_boxes = []
    for box in data:
        box_data = {
            "image": image_id,
            "x": box['x'],
            "y": box['y'],
            "height": box['height'],
            "width": box['width'],
            "label": box['label'],
            "probability": box['probability']
        }

        new_boxes.append(box_data)
    
    # save the boxes
    with transaction.atomic():
        existing_boxes.delete()
        for box in new_boxes:
            box_form =  BoxForm(box)
            box_form.save()
        image.save()

    return JsonResponse({
        "message": "success"
    }, status = 200)




