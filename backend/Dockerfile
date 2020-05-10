# pull official base image
FROM tensorflow/tensorflow:2.0.1-py3

# set work directory
WORKDIR /usr/src/app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install psycopg2 dependencies
RUN apt-get update \
    && apt-get install -y libpq-dev python-dev python3-dev build-essential \ 
    netcat \
    libsm6 libxrender1 libxext6 curl

# copy entrypoint.sh
COPY ./requirements.txt /usr/src/app/requirements.txt
COPY ./entrypoint.sh /usr/src/app/entrypoint.sh

# copy project
COPY . /usr/src/app/
COPY ./manage.py /usr/src/app/

# install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Download YOLOv3 weights
RUN curl -o ./data/yolov3.weights -O https://pjreddie.com/media/files/yolov3.weights
RUN python convert.py --weights ./data/yolov3.weights --output ./checkpoints/yolov3.tf
