# GiftLink Quick Start Guide

Get the GiftLink application running in minutes!

## Prerequisites

- Docker and Docker Compose installed
- Node.js 20+ (for local development without Docker)
- Git

## Quick Start (5 minutes)

### 1. Clone or Navigate to Repository
```bash
cd fullstack-capstone-project
```

### 2. Start Services with Docker Compose
```bash
bash scripts/docker-compose-up.sh
```

### 3. Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3060
- **MongoDB:** localhost:27017

### 4. Stop Services
```bash
bash scripts/docker-compose-down.sh
```

## Detailed Setup

### Option 1: Docker Compose (Recommended for Development)

1. **Setup environment:**
```bash
bash scripts/setup-env.sh
```

2. **Start all services:**
```bash
docker-compose up -d
```

3. **Check services:**
```bash
docker-compose ps
docker-compose logs -f
```

4. **Stop services:**
```bash
docker-compose down
```

### Option 2: Local Development

#### Backend Setup
```bash
cd giftlink-backend
npm install
# Create .env file with MongoDB URL and JWT secret
npm start
```

#### Frontend Setup
```bash
cd giftlink-frontend
npm install
npm start
```

#### MongoDB Setup
Install and run MongoDB locally, or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:6
```

### Option 3: Kubernetes Deployment

1. **Build images:**
```bash
docker build -t your-registry/giftlink-backend:v1 ./giftlink-backend
docker build -t your-registry/giftlink-frontend:v1 ./giftlink-frontend
docker push your-registry/giftlink-backend:v1
docker push your-registry/giftlink-frontend:v1
```

2. **Update image tags in k8s files**

3. **Deploy:**
```bash
bash scripts/deploy-k8s.sh
```

## Project Structure

```
.
├── docker-compose.yml              # Docker Compose configuration
├── giftlink-backend/               # Node.js/Express backend
│   ├── app.js                      # Main application file
│   ├── Dockerfile                  # Docker image for backend
│   └── .env                        # Environment variables
├── giftlink-frontend/              # React frontend
│   ├── src/                        # Source code
│   ├── Dockerfile                  # Docker image for frontend
│   └── .env                        # Environment variables
├── k8s/                            # Kubernetes manifests
├── scripts/                        # Deployment scripts
├── DEPLOYMENT.md                   # Detailed deployment guide
└── QUICKSTART.md                   # This file
```

## Common Tasks

### View Application Logs
```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# Kubernetes
kubectl logs -f deployment/backend-deployment
kubectl logs -f deployment/frontend-deployment
```

### Access MongoDB
```bash
# Docker Compose
docker exec -it mongodb mongosh

# Kubernetes
kubectl exec -it <mongodb-pod> -- mongosh
```

### Scale Services (Kubernetes)
```bash
kubectl scale deployment backend-deployment --replicas=3
kubectl scale deployment frontend-deployment --replicas=2
```

### Rebuild Images
```bash
# Docker Compose
docker-compose build --no-cache

# Manual
docker build -t giftlink-backend:latest ./giftlink-backend
docker build -t giftlink-frontend:latest ./giftlink-frontend
```

## Environment Variables

### Backend Configuration
- `MONGO_URL` - MongoDB connection string (default: mongodb://mongodb:27017/giftdb)
- `JWT_SECRET` - Secret for JWT signing
- `NODE_ENV` - Environment type (development/production)
- `PORT` - Server port (default: 3060)

### Frontend Configuration
- `REACT_APP_API_URL` - Backend API endpoint
- `REACT_APP_BACKEND_URL` - Alternative backend URL
- `NODE_ENV` - Environment type

## Troubleshooting

### Services won't start
1. Check if Docker is running: `docker ps`
2. Check logs: `docker-compose logs`
3. Verify ports are available: `lsof -i :3000` (change 3000 to other ports as needed)

### MongoDB connection errors
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Verify connection string in .env
# Default: mongodb://mongodb:27017/giftdb
```

### Frontend can't reach backend
1. Check backend is running: `docker-compose ps backend`
2. Verify API URL in frontend .env
3. Check backend logs for errors: `docker-compose logs backend`

### Kubernetes pod won't start
```bash
# Check pod status
kubectl describe pod <pod-name>

# View logs
kubectl logs <pod-name>

# Check resource availability
kubectl describe nodes
```

## Development Tips

### Hot Reload
- Frontend automatically reloads on code changes in Docker Compose
- Backend requires restart: `docker-compose restart backend`

### Database Access
- MongoDB is exposed on port 27017 in Docker Compose
- Access with tools like MongoDB Compass or mongosh

### API Testing
- Use tools like Postman or curl to test backend endpoints
- Backend runs on http://localhost:3060

## Next Steps

1. Read [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment guide
2. Check [scripts/README.md](scripts/README.md) for script details
3. Review backend and frontend READMEs for specific setup
4. Configure environment variables for your setup
5. Deploy to your target environment

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review logs for error messages
3. Verify all prerequisites are installed
4. Check DEPLOYMENT.md for detailed information

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
