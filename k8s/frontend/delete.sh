echo '[FRONTEND DELETE] nginx delete'

kubectl delete -f frontend-service.yaml
kubectl delete -f frontend-deployment.yaml