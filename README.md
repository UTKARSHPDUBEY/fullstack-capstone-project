# GiftLink - Fullstack Capstone Project

A containerized fullstack application for managing gift exchanges with MongoDB backend, Node.js API, and React frontend.

## Project Overview

GiftLink is a complete fullstack application with:
- **Backend**: Node.js/Express API
- **Frontend**: React web application
- **Database**: MongoDB
- **Containerization**: Docker & Docker Compose
- **Orchestration**: Kubernetes ready

## Quick Start

Get up and running in 5 minutes:

```bash
bash scripts/docker-compose-up.sh
```

Access the application:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3060

See [QUICKSTART.md](QUICKSTART.md) for detailed setup instructions.

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide (5 minute setup)
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment guide
- **[scripts/README.md](scripts/README.md)** - Deployment scripts reference

## Project Structure

```
.
├── docker-compose.yml              # Local development orchestration
├── giftlink-backend/               # Node.js/Express API
│   ├── Dockerfile
│   ├── app.js
│   └── package.json
├── giftlink-frontend/              # React frontend
│   ├── Dockerfile
│   ├── src/
│   └── package.json
├── k8s/                            # Kubernetes manifests
│   ├── mongo-deployment.yaml
│   ├── backend-deployment.yaml
│   └── frontend-deployment.yaml
├── scripts/                        # Deployment & management scripts
│   ├── docker-compose-up.sh
│   ├── docker-compose-down.sh
│   ├── deploy-k8s.sh
│   ├── cleanup-k8s.sh
│   └── setup-env.sh
├── QUICKSTART.md                   # Quick start guide
└── DEPLOYMENT.md                   # Detailed deployment guide
```

## Features

### Containerization
- Dockerfile for backend and frontend
- Docker Compose for local development
- Multi-stage builds for optimized images
- .dockerignore files for clean builds

### Kubernetes Ready
- Complete Kubernetes manifests
- ConfigMaps for environment configuration
- PersistentVolume for MongoDB data
- Service discovery and networking

### Deployment Scripts
- Automated setup with bash scripts
- Docker Compose management
- Kubernetes deployment automation
- Environment configuration helpers

## Prerequisites

### For Local Development
- Docker Desktop (includes Docker and Docker Compose)
- Git

### For Kubernetes Deployment
- kubectl installed and configured
- Access to a Kubernetes cluster
- Container registry access (Docker Hub, ECR, etc.)

## Development Workflow

### Start Development Environment
```bash
bash scripts/docker-compose-up.sh
```

### View Logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop Services
```bash
bash scripts/docker-compose-down.sh
```

### Deploy to Kubernetes
```bash
# Build and push images first
docker build -t your-registry/giftlink-backend:v1 ./giftlink-backend
docker push your-registry/giftlink-backend:v1

# Deploy
bash scripts/deploy-k8s.sh
```

## Configuration

### Environment Variables

**Backend (.env)**
```
MONGO_URL=mongodb://mongodb:27017/giftdb
JWT_SECRET=setasecret
NODE_ENV=development
PORT=3060
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:3060
REACT_APP_BACKEND_URL=http://localhost:3060
NODE_ENV=development
```

## Services

### MongoDB
- Container: `mongodb`
- Port: 27017
- Volume: `mongodb-data` (2Gi PVC for Kubernetes)

### Backend API
- Container: `giftlink-backend`
- Port: 3060
- Image: Node.js 20 Alpine
- Depends on: MongoDB

### Frontend
- Container: `giftlink-frontend`
- Port: 3000
- Image: Node.js 20 Alpine
- Depends on: Backend

## Common Commands

### Docker Compose

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Rebuild images
docker-compose build

# Execute command in container
docker-compose exec backend npm test
```

### Kubernetes

```bash
# Deploy
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get svc

# View logs
kubectl logs -f deployment/backend-deployment

# Scale
kubectl scale deployment backend-deployment --replicas=3

# Cleanup
kubectl delete -f k8s/
```

## Troubleshooting

### Services won't start
1. Ensure Docker is running: `docker ps`
2. Check for port conflicts: `lsof -i :3000`
3. View logs: `docker-compose logs`

### MongoDB connection error
- Verify MONGO_URL in .env
- Check MongoDB container is running
- Ensure network connectivity

### Frontend can't reach backend
- Check backend is running: `docker-compose ps`
- Verify REACT_APP_API_URL in .env
- Check backend logs for errors

### Kubernetes pod issues
```bash
kubectl describe pod <pod-name>
kubectl logs <pod-name>
```

## Building Images

### Backend
```bash
cd giftlink-backend
docker build -t giftlink-backend:v1 .
```

### Frontend
```bash
cd giftlink-frontend
docker build -t giftlink-frontend:v1 .
```

## Deploying to Production

1. **Build and push images** to your container registry
2. **Update image tags** in Kubernetes manifests
3. **Configure ConfigMaps** with production values
4. **Deploy**: `kubectl apply -f k8s/`
5. **Monitor**: `kubectl get pods`, `kubectl logs`

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive production deployment guide.

## License

Licensed under the MIT License - see LICENSE file for details.

## Support

For detailed information:
- [QUICKSTART.md](QUICKSTART.md) - Get started quickly
- [DEPLOYMENT.md](DEPLOYMENT.md) - Complete deployment guide
- [scripts/README.md](scripts/README.md) - Script documentation