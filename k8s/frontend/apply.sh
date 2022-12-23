echo '[FRONTEND DEPLOY START] nginx start'

kubectl apply -f service.yaml
kubectl apply -f deployment.yaml