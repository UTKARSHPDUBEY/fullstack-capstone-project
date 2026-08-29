#!/bin/bash

# Kubernetes Deployment Script
# This script deploys the GiftLink application to Kubernetes

set -e

echo "=========================================="
echo "Deploying GiftLink to Kubernetes"
echo "=========================================="

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo "Error: kubectl is not installed"
    exit 1
fi

# Check if connected to cluster
if ! kubectl cluster-info &> /dev/null; then
    echo "Error: Not connected to Kubernetes cluster"
    exit 1
fi

# Get current context
CONTEXT=$(kubectl config current-context)
echo "Deploying to cluster: $CONTEXT"
echo ""

# Confirm deployment
read -p "Continue with deployment? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

echo ""
echo "Applying Kubernetes manifests..."

# Apply manifests in order
echo "1. Creating PersistentVolumeClaim..."
kubectl apply -f k8s/mongodb-pvc.yaml

echo "2. Creating MongoDB deployment..."
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/mongo-service.yaml

echo "3. Creating Backend deployment..."
kubectl apply -f k8s/backend-configmap.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml

echo "4. Creating Frontend deployment..."
kubectl apply -f k8s/frontend-configmap.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Wait for deployments to be ready
echo ""
echo "Waiting for deployments to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/mongodb-deployment
kubectl wait --for=condition=available --timeout=300s deployment/backend-deployment
kubectl wait --for=condition=available --timeout=300s deployment/frontend-deployment

echo ""
echo "=========================================="
echo "Deployment completed successfully!"
echo "=========================================="
echo ""
echo "Checking pod status:"
kubectl get pods

echo ""
echo "Services created:"
kubectl get svc

echo ""
echo "To access the services:"
echo "1. Get the Node IP:"
echo "   kubectl get nodes -o wide"
echo ""
echo "2. Frontend:"
echo "   kubectl get svc frontend-service"
echo "   Access at: http://<node-ip>:<nodePort>"
echo ""
echo "3. Backend API:"
echo "   kubectl get svc backend-service"
echo "   Access at: http://<node-ip>:30601"
echo ""
echo "4. View logs:"
echo "   kubectl logs -f deployment/backend-deployment"
echo "   kubectl logs -f deployment/frontend-deployment"
echo ""
