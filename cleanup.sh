# this is a cleanup code for removing all the container (Running and stopped) and images from the system. 
# Including the docker cache will be removed. Next time docker-compose will run with out any cache and runs all the steps.

# In Windows we can run in Git bash/ VS code terminal. -> ./cleanup.sh
# Enable the sleep in the end to see the output. or else through VS Code it will run as a seperate process in git bash whose output is not shown.

running_cont=$(docker ps -q)
if [ -n "$running_cont" ]; then
    echo "Stopping all containers"
    docker stop $running_cont
else
    echo "There is no Running containers"
fi

all_cont=$(docker ps -a -q)
if [ -n "$all_cont" ]; then
    echo "Removing all containers"
    docker rm $all_cont
else
    echo "There is no containers"
fi

all_img=$(docker images -a -q)
if [ -n "$all_cont" ]; then
    echo "Removing all images"
    docker rmi $all_cont --force
else
    echo "There is no images"
fi

docker system prune -a -f

sleep 5