- to create the docker image using the dockerfile
docker build -t docker-node:1.0 .

- to run the container in detatched mode and bind the port from 3000 to 3000
docker run -d -p 3000:3000 docker-node:1.0

- to see all containers 
docker ps -a

- to see all running containers
docker ps

- to see saved images
docker images



Run this container at localhost:3000