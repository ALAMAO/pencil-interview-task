FROM mhart/alpine-node:14.2 AS builder
WORKDIR /app



# install app dependencies
COPY . ./
RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

RUN npm install
