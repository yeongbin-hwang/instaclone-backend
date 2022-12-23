echo '[BACKEND AUTH-API DEPLOY START] auth-api'

kubectl apply -f auth-service.yaml
kubectl apply -f auth-deployment.yaml