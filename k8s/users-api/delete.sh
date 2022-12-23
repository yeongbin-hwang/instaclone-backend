echo '[BACKEND USERS-API DELETE] users-api'

kubectl delete -f users-service.yaml
kubectl delete -f users-deployment.yaml