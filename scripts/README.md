# GiftLink Deployment Scripts

This directory contains scripts to help with deployment and management of the GiftLink application.

## Available Scripts

### Docker Compose Scripts

#### `docker-compose-up.sh`
Starts all services using Docker Compose (MongoDB, Backend, Frontend)

```bash
bash docker-compose-up.sh
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3060
- MongoDB: localhost:27017

#### `docker-compose-down.sh`
Stops all services and optionally removes volumes

```bash
bash docker-compose-down.sh
```

### Kubernetes Scripts

#### `deploy-k8s.sh`
Deploys the entire application stack to a Kubernetes cluster

```bash
bash deploy-k8s.sh
```

Requirements:
- kubectl installed and configured
- Access to a Kubernetes cluster
- Container images pushed to a registry

#### `cleanup-k8s.sh`
Removes all Kubernetes resources created by the deployment

```bash
bash cleanup-k8s.sh
```

### Setup Scripts

#### `setup-env.sh`
Creates a `.env` file with default configuration for local development

```bash
bash setup-env.sh
```

## Quick Start

### Local Development with Docker Compose

1. Setup environment:
```bash
bash scripts/setup-env.sh
```

2. Start services:
```bash
bash scripts/docker-compose-up.sh
```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend: http://localhost:3060

4. View logs:
```bash
docker-compose logs -f
```

5. Stop services:
```bash
bash scripts/docker-compose-down.sh
```

### Production Deployment with Kubernetes

1. Build and push images:
```bash
docker build -t your-registry/giftlink-backend:v1 ./giftlink-backend
docker build -t your-registry/giftlink-frontend:v1 ./giftlink-frontend
docker push your-registry/giftlink-backend:v1
docker push your-registry/giftlink-frontend:v1
```

2. Update image tags in Kubernetes manifests:
```bash
# Edit k8s/backend-deployment.yaml
# Edit k8s/frontend-deployment.yaml
```

3. Deploy to cluster:
```bash
bash scripts/deploy-k8s.sh
```

4. Verify deployment:
```bash
kubectl get pods
kubectl get svc
```

5. Cleanup (if needed):
```bash
bash scripts/cleanup-k8s.sh
```

## Environment Variables

### Backend (.env)
- `MONGO_URL`: MongoDB connection string
- `JWT_SECRET`: Secret for JWT signing
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port

### Frontend (.env)
- `REACT_APP_API_URL`: Backend API endpoint
- `REACT_APP_BACKEND_URL`: Alternative backend URL
- `NODE_ENV`: Environment (development/production)

## Troubleshooting

### Docker Issues
```bash
# Check if Docker is running
docker ps

# View container logs
docker logs <container-id>

# Remove all stopped containers
docker container prune
```

### Kubernetes Issues
```bash
# Check cluster connection
kubectl cluster-info

# View pod logs
kubectl logs -f <pod-name>

# Describe pod for errors
kubectl describe pod <pod-name>

# Check resource status
kubectl get all
```

## Additional Resources

- [DEPLOYMENT.md](../DEPLOYMENT.md) - Comprehensive deployment guide
- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
