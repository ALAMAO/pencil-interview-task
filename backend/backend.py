#!/usr/bin/env python
# coding: utf-8

# In[1]:


import tensorflow as tf
tf.__version__


# In[2]:


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
from IPython.display import Image, display

# flags.DEFINE_string('classes', './data/coco.names', 'path to classes file')
# flags.DEFINE_string('weights', './checkpoints/yolov3.tf',
#                     'path to weights file')

# flags.DEFINE_integer('size', 416, 'resize images to')
# flags.DEFINE_string('image', './data/girl.png', 'path to input image')
# flags.DEFINE_string('tfrecord', None, 'tfrecord instead of image')
# flags.DEFINE_string('output', './output.jpg', 'path to output image')
# flags.DEFINE_integer('num_classes', 80, 'number of classes in the model')

app._run_init(['yolov3'], app.parse_flags_with_usage)


# In[3]:


def get_yolo(image='data/girl.png', output='output.jpg'):
    classes = 'data/coco.names'
    weights = 'checkpoints/yolov3.tf'
    size = 416
    tfrecord = None
    num_classes = 80
    
    yolo = YoloV3(classes=num_classes)   
    yolo.load_weights(weights).expect_partial()
    class_names = [c.strip() for c in open(classes).readlines()]

    img_raw = tf.image.decode_image(open(image, 'rb').read(), channels=3)
    img = tf.expand_dims(img_raw, 0)
    img = transform_images(img, size)
    
    boxes, scores, classes, nums = yolo(img)

    img = cv2.cvtColor(img_raw.numpy(), cv2.COLOR_RGB2BGR)
    wh = np.flip(img.shape[0:2])
    image_width = wh[0]
    image_height = wh[1]
    img = draw_outputs(img, (boxes, scores, classes, nums), class_names)
    
    cv2.imwrite(output, img)
    print("Image saved in", end=": ")
    print(output)
    print("------------------------")
    print("image_width", end=": ")
    print(image_width)
    print("image_height", end=": ")
    print(image_height)
    print("------------------------")
    annotations = []
    for i in range(nums[0]):
        cid = int(classes[0][i])
        print("cid", end=": ")
        print(cid)
        comment=class_names[int(classes[0][i])]
        print("comment", end=": ")
        print(comment)
        score=np.array(scores[0][i])
        print("score", end=": ")
        print(score)
        x1y1x2y2 = np.array(boxes[0][i])
        x1 = x1y1x2y2[0]
        y1 = x1y1x2y2[1]
        x2 = x1y1x2y2[2]
        y2 = x1y1x2y2[3]
        x = int(x1 * image_width)
        y = int(y1 * image_height)
        width = int((x2 - x1) * image_width)
        height = int((y2 - y1) * image_height)
        print("x", end=": ")
        print(x)
        print("y", end=": ")
        print(y)
        print("width", end=": ")
        print(width)
        print("height", end=": ")
        print(height)
        print("------------------------")


# In[4]:


get_yolo('data/meme.jpg')


# In[5]:


get_yolo('data/girl.png')

