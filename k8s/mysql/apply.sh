echo '[DB DEPLOY START] mysql start'

kubectl apply -f host-pv.yaml
kubectl apply -f host-pvc.yaml
kubectl apply -f db-service.yaml
kubectl apply -f db-deployment.yaml