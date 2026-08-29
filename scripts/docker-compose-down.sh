#!/bin/bash

# Docker Compose Stop Script
# This script stops and removes all services

set -e

echo "=========================================="
echo "Stopping GiftLink Services"
echo "=========================================="

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed"
    exit 1
fi

echo "Stopping services..."
docker-compose down

echo ""
echo "Removing volumes (optional)..."
read -p "Do you want to remove volumes as well? (y/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    docker-compose down -v
    echo "Volumes removed"
else
    echo "Volumes kept"
fi

echo ""
echo "=========================================="
echo "Services stopped successfully!"
echo "=========================================="
