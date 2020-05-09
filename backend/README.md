# Getting Started
## Prerequisites

1. django 3.0
```
-- Installing
$ python -m pip install Django

-- Checking the version
$ python -m django --version
```

2. virtualenv
This makes sure that your own local python environment would not get bloated during development.
```
pip install virtualenv
```

3. Docker


## Steps

### Starting up the database
If you just want to work independently from the other components.
```
-- Starting the container
$ docker-compose up

-- Stopping the container
$ docker-compose stop --remove-orphans
```

### (Only do for the first time!) Set up virtual environment 
This creates a directory `/venv`
```
$ virtualenv venv
```

### Activate virtual environemnt
```
$ source venv/bin/activate
```

If successful, you should be able to see the word 'venv' appear on the latest line of your terminal/ shell:
```
(venv) (base) Angelico-MBP:backend angelico$ 
```

### Install all package dependencies
```
$ pip install -r requirements.txt
```
### (Only do for the first time!) Download yolo v3 weights and convert to TensorFlow checkpoint
Reference from: https://github.com/zzh8829/yolov3-tf2
```
cd backend
wget https://pjreddie.com/media/files/yolov3.weights -O data/yolov3.weights
python convert.py --weights ./data/yolov3.weights --output ./checkpoints/yolov3.tf
```
To verify the above is done correctly:
```
python backend.py
```
![Success Image](https://hochenrui.com/success.JPG)

### (Only do for the first time!) Set up the database
```
$ python manage.py migrate
```

### Run the server
```
$ python manage.py runserver
```

If successful, you should be able to see this:
```
Watching for file changes with StatReloader
Performing system checks...

System check identified no issues (0 silenced).
May 09, 2020 - 07:32:09
Django version 3.0.6, using settings 'backend.settings'
Starting development server at http://127.0.0.1:8000/
Quit the server with CONTROL-C.
```

You should be able to access the server at http://localhost:8000.

## Finishing development
1. Turn off the server
2. If you installed any new dependencies via `pip`, update the requirements file:
```
pip freeze > requirements.txt
```
3. Shut down docker database container. (if started)

## API
### Image
1. `/image/get`: Returns information about images
2. `/image/new`: Used to create a new image in the database (under construction)

### Box
1. `/box/get`: Returns information about bounding boxes
2. `/box/new`: Used to create a new bounding box in the database (under construction)



