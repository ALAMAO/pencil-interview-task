from django.contrib.auth.models import User
from django.core import serializers
from django.core.exceptions import ObjectDoesNotExist
from django.db import DataError
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from django.utils.dateparse import parse_datetime

from models.models import Box, Image
from image.forms import ImageForm

import json

# Simplified version at the moment
# Usage of YOLO model will most likely be implemented here
@api_view(['POST'])
@csrf_exempt
def create_new(request):
    try:
        # takes in data from front end and processes it accordingly
        data = json.loads(request.body.decode('utf-8'))

        # TODO => run model here to derive the coordinates and labels found,
        # TODO => process image file accordingly before saving into the table 'Image'

        image_form = ImageForm(data)

        # checks if the data provided is valid
        if image_form.is_valid():
            # saves into the database
            image = image_form.save()
            response = serializers.serialize("json", [image, ])

            return HttpResponse(response, content_type='application/json')
        
        else:
            return JsonResponse({"message": image_form.errors}, status=400)

        # TODO => for the coordinates and labels found, save it onto the table 'Box'

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
                    'x': box['x'],
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