#!/bin/bash

# Backend Deployment Script
# Builds Docker image and deploys to EC2

set -e

echo "🚀 Starting backend deployment..."

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
if [ -z "$EC2_HOST" ]; then
  echo "❌ Error: EC2_HOST is not set"
  exit 1
fi

if [ -z "$EC2_USER" ]; then
  echo "❌ Error: EC2_USER is not set"
  exit 1
fi

# Build Docker image
echo "🔨 Building Docker image..."
docker build -t hackathon-backend:latest -f backend/Dockerfile backend/

# Save Docker image
echo "💾 Saving Docker image..."
docker save hackathon-backend:latest | gzip > backend-image.tar.gz

# Copy to EC2
echo "📤 Uploading to EC2..."
scp backend-image.tar.gz $EC2_USER@$EC2_HOST:~/

# Copy docker-compose file
scp docker-compose.yml $EC2_USER@$EC2_HOST:~/

# Deploy on EC2
echo "🚢 Deploying on EC2..."
ssh $EC2_USER@$EC2_HOST << 'EOF'
  # Load Docker image
  docker load < backend-image.tar.gz
  
  # Stop existing containers
  docker-compose down
  
  # Start new containers
  docker-compose up -d
  
  # Clean up
  rm backend-image.tar.gz
  
  echo "✅ Backend deployed successfully!"
EOF

# Clean up local files
rm backend-image.tar.gz

echo "✅ Backend deployment complete!"
echo "🌐 API URL: http://$EC2_HOST:3000"
