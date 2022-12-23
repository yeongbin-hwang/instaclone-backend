echo '[BACKEND POSTS-API DELETE] posts-api'

kubectl delete -f service.yaml
kubectl delete -f deployment.yaml