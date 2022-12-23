echo '[FRONTEND DELETE] nginx delete'

kubectl delete -f service.yaml
kubectl delete -f deployment.yaml