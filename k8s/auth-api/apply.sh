echo '[BACKEND AUTH-API DEPLOY START] auth-api'

kubectl apply -f service.yaml
kubectl apply -f deployment.yaml