echo '[BACKEND USERS-API DEPLOY START] users-api'

kubectl apply -f service.yaml
kubectl apply -f deployment.yaml