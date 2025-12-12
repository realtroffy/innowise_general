docker build -t authentication-service:1.0.0 -f authentication-service/Dockerfile authentication-service
docker build -t image-service:1.0.0 -f image-service/Dockerfile image-service
docker build -t api-gateway:1.0.0 -f api-gateway/Dockerfile api-gateway
docker build -t activity-service:1.0.0 -f activity-service/Dockerfile activity-service
docker build -t react-frontend:1.0.0 -f innowise_front/Dockerfile innowise_front