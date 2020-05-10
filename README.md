# 1. pencil-interview-task
A one stop shop monorepo

# 2. Local Deployment (Docker)

## 2.1 Build Dockers

```bash
## (Re-)Building the containers
$ docker-compose build
```

## 2.2 Starting Docker Containers
```bash
## Deploying Containers
$ docker-compose up

## Deploying Containers (In Detach Mode)
$ docker-compose up -d
```



## 2.2 Stopping Docker Containers
```bash
## Deploying Containers
$ docker-compose down
```

## 2.3 [Temporary] [Testing] Loading Postgres SQL Dump

### 2.3.1 Loading Data Dump

```bash
## Copy the SQL Dump
docker cp backend/sql/db.sql pencil-interview-task_db_1:/

## Enter the PostgreSQL Container
docker exec -it pencil-interview-task_db_1 bash

## Load the SQL Dump
psql postgres postgres < db.sql 
```

Note: Ignore errors on "relation/constraints \<name\> already exists"

### 2.3.2 Verifying Database

Head to http://localhost:8000/image/get", you should observe the following output.

```
[{"model": "models.image", "pk": "123", "fields": {"file": "static/images/123.jpg", "height": 456.0, "width": 810.0, "inserted_at": "2020-05-09T10:43:54.707Z"}}]
```

# 3. System Applications 

## 3.1 General Application Access Points
```
[React (Web) Application]
http://localhost:3000

[Django (API) Application]
http://localhost:8000
```

## 3.2 API Server Access Points
### 3.2.1 Image
1. `/image/get`: Returns information about images
2. `/image/new`: Used to create a new image in the database (under construction)

### 3.2.2 Box
1. `/box/get`: Returns information about bounding boxes
2. `/box/new`: Used to create a new bounding box in the database (under construction)



