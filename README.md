

./nx serve backend1

./nx serve backend2

./nx serve events-frontend

docker run -d --hostname rabbitmq --name rabbitmq-eventsmaster -p 5672:5672 -p 15672:15672 rabbitmq:3-management   

http://127.0.0.1:15672/