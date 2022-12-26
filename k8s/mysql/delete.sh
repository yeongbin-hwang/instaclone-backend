echo '[DB DELETE START] mysql delete'

kubectl delete -f host-pv.yaml
kubectl delete -f host-pvc.yaml
kubectl delete -f db-service.yaml
kubectl delete -f db-deployment.yaml