# CV Compare



uses spring AI with a local model to take a users CV and compare with an uploaded CV and gives feedback on whether or not you'd be a good fit and a score out of 10.  It will queue up the CVs until the local AI is free and has a frontend to show progress.

Backend1 is the app that deals with taking the CVs from the frontend and storing them responding to the frontend through websockets in realtime when CV compare is complete. Backend2 is responsbile for feed the AI model the data and returning it when complete.

Backend1 and Backend2 talk over Rabbitmq in an event driven fashion and messages are queued in the hope that no messages are lost in the process or if something happens a messaged can be replayed.

![Architecture](/docs/sd.png)

## 

./nx serve backend1

docker run -d --name cvcompare-db \
  -e POSTGRES_USER=myuser \
  -e POSTGRES_PASSWORD=mypassword \
  -e POSTGRES_DB=cvcompare-db \
  -p 5432:5432 -d postgres:15

./nx serve backend2

./nx serve events-frontend

http://localhost:4200/

docker run -d --hostname rabbitmq --name cv-compare-rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management   
guest/guest

http://127.0.0.1:15672/