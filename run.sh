#!/bin/bash

echo "Starting EMS docker"

docker-compose up -d --build
# docker stack deploy -c docker-compose.yml ems-service

# sleep 3

# docker-compose exec -it ems-service /bin/bash

# # Build Docker image with the image_name
# docker build -t ems-service-image .
 
# # Run Docker container with the container_name
# docker run --name ems-service -p 3000:3000 ems-service-image



# Swarm initialized: current node (p9w4dgbt72b1swf4upznnyjjq) is now a manager.

# To add a worker to this swarm, run the following command:

#     docker swarm join --token SWMTKN-1-04muop75665c41m46mpqcie76os2fuy7c1m1crimuezozdkai7-3lls3jdsbzwjglijmtjdhjcw9 192.168.8.125:2377

# To add a manager to this swarm, run 'docker swarm join-token manager' and follow the instructions.