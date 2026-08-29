# GiftLink Deployment Guide

This guide covers containerization and deployment of the GiftLink application using Docker and Kubernetes.

## Prerequisites

- Docker and Docker Compose installed
- kubectl installed (for Kubernetes deployments)
- Access to a Kubernetes cluster (for production deployments)
- Environment variables configured

## Project Structure

```
.
├── docker-compose.yml                 # Local development with Docker Compose
├── giftlink-backend/                  # Node.js/Express backend
│   ├── Dockerfile
│   ├── .dockerignore
│   └── app.js
├── giftlink-frontend/                 # React frontend
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
├── k8s/                               # Kubernetes manifests
│   ├── mongo-deployment.yaml
│   ├── mongo-service.yaml
│   ├── mongodb-pvc.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── backend-configmap.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── frontend-configmap.yaml
│   ├── giftwebsite-deployment.yaml
│   └── giftwebsite-service.yaml
└── scripts/                           # Deployment scripts
    ├── docker-compose-up.sh
    ├── docker-compose-down.sh
    ├── deploy-k8s.sh
    └── cleanup-k8s.sh
```

## Local Development with Docker Compose

### 1. Setup Environment Variables

Create a `.env` file in the root directory:
```bash
MONGO_URL=mongodb://mongodb:27017/giftdb
JWT_SECRET=setasecret
REACT_APP_API_URL=http://localhost:3060
```

### 2. Start Services

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 3060
- Frontend on port 3000

### 3. Verify Services

```bash
docker-compose ps
docker-compose logs -f
```

### 4. Stop Services

```bash
docker-compose down
```

## Docker Build and Push

### 1. Build Images Locally

```bash
# Backend
cd giftlink-backend
docker build -t your-registry/giftlink-backend:v1 .
cd ..

# Frontend
cd giftlink-frontend
docker build -t your-registry/giftlink-frontend:v1 .
cd ..
```

### 2. Push to Registry

```bash
docker push your-registry/giftlink-backend:v1
docker push your-registry/giftlink-frontend:v1
```

## Kubernetes Deployment

### 1. Prerequisites

- Kubernetes cluster running and accessible
- kubectl configured
- Container images pushed to a registry
- Persistent Volume provisioner available

### 2. Update Image Tags

Edit the image tags in k8s deployment files to match your registry:

```yaml
# k8s/backend-deployment.yaml
image: your-registry/giftlink-backend:v1

# k8s/frontend-deployment.yaml
image: your-registry/giftlink-frontend:v1
```

### 3. Deploy to Kubernetes

```bash
# Apply all resources
kubectl apply -f k8s/

# Or use the deployment script
bash scripts/deploy-k8s.sh
```

### 4. Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get svc

# Check logs
kubectl logs -f deployment/backend-deployment
kubectl logs -f deployment/frontend-deployment
```

### 5. Access Services

**Frontend:**
```bash
# Get NodePort
kubectl get svc frontend-service
# Access at http://<node-ip>:<nodePort>
```

**Backend API:**
```bash
# Get NodePort
kubectl get svc backend-service
# Access at http://<node-ip>:30601
```

## Configuration Management

### Backend Configuration

Edit `k8s/backend-configmap.yaml`:
```yaml
data:
  MONGO_URL: mongodb://mongodb-service:27017/giftdb
  JWT_SECRET: setasecret
```

### Frontend Configuration

Edit `k8s/frontend-configmap.yaml`:
```yaml
data:
  REACT_APP_API_URL: http://backend-service:3060
```

## Persistent Storage

MongoDB uses a PersistentVolumeClaim (PVC) for data storage:

```yaml
# k8s/mongodb-pvc.yaml
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
```

To increase storage, update the size and apply:
```bash
kubectl apply -f k8s/mongodb-pvc.yaml
```

## Scaling

### Kubernetes Pod Scaling

```bash
# Scale backend
kubectl scale deployment backend-deployment --replicas=3

# Scale frontend
kubectl scale deployment frontend-deployment --replicas=2

# Check replicas
kubectl get deployment
```

## Cleanup

### Docker Compose

```bash
docker-compose down -v
```

### Kubernetes

```bash
# Delete all resources
kubectl delete -f k8s/

# Or use cleanup script
bash scripts/cleanup-k8s.sh
```

## Troubleshooting

### Backend Connection Issues

```bash
# Check backend logs
kubectl logs -f deployment/backend-deployment

# Test MongoDB connection
kubectl exec -it <backend-pod> -- node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://mongodb-service:27017/giftdb').then(() => console.log('Connected')).catch(e => console.log('Error:', e))"
```

### Frontend Issues

```bash
# Check frontend logs
kubectl logs -f deployment/frontend-deployment

# Verify API configuration
kubectl describe configmap frontend-config
```

### MongoDB Issues

```bash
# Check MongoDB logs
kubectl logs -f deployment/mongodb-deployment

# Check PVC status
kubectl get pvc
kubectl describe pvc mongodb-pvc
```

## Environment Variables Reference

| Variable | Description | Default |
|----------|-------------|---------|
| MONGO_URL | MongoDB connection string | mongodb://mongodb:27017/giftdb |
| JWT_SECRET | JWT signing secret | setasecret |
| REACT_APP_API_URL | Backend API URL for frontend | http://backend-service:3060 |
| REACT_APP_BACKEND_URL | Alternative backend URL variable | http://localhost:3060 |

## Next Steps

1. Configure your container registry credentials
2. Build and push images
3. Deploy to your Kubernetes cluster
4. Monitor logs and performance
5. Set up CI/CD pipeline for automated deployments

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Node.js Best Practices](https://nodejs.org/en/docs/)
- [React Deployment Guide](https://create-react-app.dev/deployment/)
