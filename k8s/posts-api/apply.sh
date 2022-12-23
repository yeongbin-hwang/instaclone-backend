echo '[BACKEND POSTS-API DEPLOY START] posts-api'

kubectl apply -f posts-service.yaml
kubectl apply -f posts-deployment.yaml