echo '[BACKEND AUTH-API DELETE] auth-api'

kubectl delete -f auth-service.yaml
kubectl delete -f auth-deployment.yaml