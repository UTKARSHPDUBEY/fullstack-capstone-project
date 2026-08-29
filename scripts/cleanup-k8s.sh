#!/bin/bash

# Kubernetes Cleanup Script
# This script removes all GiftLink resources from Kubernetes

set -e

echo "=========================================="
echo "Cleaning up GiftLink Kubernetes Resources"
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
echo "Cleaning up resources in cluster: $CONTEXT"
echo ""

# Confirm cleanup
read -p "WARNING: This will delete all GiftLink resources. Continue? (y/n) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cleanup cancelled"
    exit 1
fi

echo ""
echo "Removing Kubernetes resources..."

# Delete in reverse order
echo "1. Removing frontend resources..."
kubectl delete svc frontend-service --ignore-not-found
kubectl delete deployment frontend-deployment --ignore-not-found
kubectl delete configmap frontend-config --ignore-not-found

echo "2. Removing backend resources..."
kubectl delete svc backend-service --ignore-not-found
kubectl delete deployment backend-deployment --ignore-not-found
kubectl delete configmap backend-config --ignore-not-found

echo "3. Removing MongoDB resources..."
kubectl delete svc mongodb-service --ignore-not-found
kubectl delete deployment mongodb-deployment --ignore-not-found

# Ask about PVC cleanup
echo ""
echo "PersistentVolumeClaim (PVC) found:"
read -p "Do you want to delete the PVC (mongodb-pvc)? This will remove stored data. (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    kubectl delete pvc mongodb-pvc --ignore-not-found
    echo "PVC deleted"
else
    echo "PVC kept"
fi

echo ""
echo "=========================================="
echo "Cleanup completed!"
echo "=========================================="
echo ""
echo "Remaining resources:"
kubectl get all
echo ""
