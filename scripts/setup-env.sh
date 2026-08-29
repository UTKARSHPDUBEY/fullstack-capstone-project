#!/bin/bash

# Environment Setup Script
# This script helps set up environment variables for local development

echo "=========================================="
echo "GiftLink Environment Setup"
echo "=========================================="

# Check if .env file exists
if [ -f .env ]; then
    echo ".env file already exists"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled"
        exit 1
    fi
fi

# Create .env file
cat > .env << 'EOF'
# MongoDB Configuration
MONGO_URL=mongodb://mongodb:27017/giftdb

# JWT Configuration
JWT_SECRET=setasecret

# Frontend API Configuration
REACT_APP_API_URL=http://localhost:3060
REACT_APP_BACKEND_URL=http://localhost:3060
EOF

echo ""
echo "=========================================="
echo ".env file created successfully!"
echo "=========================================="
echo ""
echo "Configuration:"
echo "  MONGO_URL=mongodb://mongodb:27017/giftdb"
echo "  JWT_SECRET=setasecret"
echo "  REACT_APP_API_URL=http://localhost:3060"
echo ""
echo "Next steps:"
echo "1. Review and update the .env file as needed"
echo "2. Run 'docker-compose up -d' to start services"
echo ""
