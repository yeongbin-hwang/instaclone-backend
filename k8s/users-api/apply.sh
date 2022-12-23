echo '[BACKEND USERS-API DEPLOY START] users-api'

kubectl apply -f users-service.yaml
kubectl apply -f users-deployment.yaml