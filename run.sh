#!/bin/bash

echo "Starting EMS docker"

docker-compose up -d --build

# sleep 3

# docker-compose exec -it ems-service /bin/bash

# # Build Docker image with the image_name
# docker build -t ems-service-image .
 
# # Run Docker container with the container_name
# docker run --name ems-service -p 3000:3000 ems-service-image
