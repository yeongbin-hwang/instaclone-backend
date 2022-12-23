echo '[BACKEND AUTH-API DELETE] auth-api'

kubectl delete -f service.yaml
kubectl delete -f deployment.yaml