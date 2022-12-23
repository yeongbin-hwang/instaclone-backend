echo '[FRONTEND DEPLOY START] nginx start'

kubectl apply -f frontend-service.yaml
kubectl apply -f frontend-deployment.yaml