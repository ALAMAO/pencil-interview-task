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
@api_view(['POST'])
@csrf_exempt
def create_new(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
        box_form = BoxForm(data)

        if box_form.is_valid():
            box = box_form.save()
            response = serializers.serialize("json", [box, ])

            return HttpResponse(response, content_type='application/json')
        
        else:
            return JsonResponse({"message": box_form.errors}, status=400)
    except ObjectDoesNotExist as e:
        return JsonResponse({"message": str(e)}, status=404)
    except DataError as e:
        return JsonResponse({"message": str(e)}, status=400)

@api_view(['GET'])
def get_details(request):
    try:
        sort_params = request.GET.dict()
        box = Box.objects.filter(**sort_params)
        
        response = serializers.serialize('json', box)

        return HttpResponse(response, content_type="application/json")
    except Exception as e:
        return JsonResponse({
            "message": str(e)
        }, status = 400)

@api_view(['PUT'])
def update_details(request):
    try:
        # Retrieve Existing Boxes
        image_id = request.query_params['image_id']
        boxes = Box.objects.filter(image_id=image_id)
        boxes.delete()

        # updating row and saving changes to DB
        data = json.loads(request.body.decode('utf-8'))
        boxes = []
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

            boxes.append(box_data)
        
        # save the boxes
        with transaction.atomic():
            for box in boxes:
                box_form =  BoxForm(box)
                box_form.save()

        return JsonResponse({
            "message": "success"
        }, status = 200)

    except Exception as e:
        return JsonResponse({
            "message": str(e)
        }, status = 400)




