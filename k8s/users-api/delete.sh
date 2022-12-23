echo '[BACKEND USERS-API DELETE] users-api'

kubectl delete -f service.yaml
kubectl delete -f deployment.yaml