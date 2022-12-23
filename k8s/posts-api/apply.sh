echo '[BACKEND POSTS-API DEPLOY START] posts-api'

kubectl apply -f service.yaml
kubectl apply -f deployment.yaml