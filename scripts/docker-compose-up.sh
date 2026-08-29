#!/bin/bash

# Docker Compose Start Script
# This script starts all services using docker-compose

set -e

echo "=========================================="
echo "Starting GiftLink Services with Docker Compose"
echo "=========================================="

# Check if docker-compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is not installed"
    exit 1
fi

# Check if docker is running
if ! docker info &> /dev/null; then
    echo "Error: Docker is not running"
    exit 1
fi

echo "Building services..."
docker-compose build

echo ""
echo "Starting services..."
docker-compose up -d

echo ""
echo "Waiting for services to start..."
sleep 5

echo ""
echo "Service Status:"
docker-compose ps

echo ""
echo "=========================================="
echo "Services are running!"
echo "=========================================="
echo ""
echo "Accessing the services:"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:3060"
echo "  MongoDB: localhost:27017"
echo ""
echo "View logs: docker-compose logs -f"
echo "Stop services: docker-compose down"
echo ""
