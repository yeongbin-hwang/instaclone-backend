echo '[BACKEND POSTS-API DELETE] posts-api'

kubectl delete -f posts-service.yaml
kubectl delete -f posts-deployment.yaml