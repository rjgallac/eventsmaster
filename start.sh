docker start cvcompare-db
docker start cv-compare-rabbitmq
./nx serve backend1 > backend1.log &
./nx serve backend2 > backend2.log &
./nx serve events-frontend > events-frontend.log &
lms load qwen3.5-35b-a3b