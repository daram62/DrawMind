#!/bin/bash

# Frontend Deployment Script
# Builds and deploys the frontend to S3 + CloudFront

set -e

echo "🚀 Starting frontend deployment..."

# Load environment variables
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

# Check required environment variables
if [ -z "$AWS_S3_FRONTEND_BUCKET" ]; then
  echo "❌ Error: AWS_S3_FRONTEND_BUCKET is not set"
  exit 1
fi

# Navigate to frontend directory
cd frontend

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building frontend..."
npm run build

# Sync to S3
echo "☁️  Uploading to S3..."
aws s3 sync dist/ s3://$AWS_S3_FRONTEND_BUCKET --delete

# Invalidate CloudFront cache (if CloudFront distribution ID is set)
if [ ! -z "$AWS_CLOUDFRONT_DISTRIBUTION_ID" ]; then
  echo "🔄 Invalidating CloudFront cache..."
  aws cloudfront create-invalidation \
    --distribution-id $AWS_CLOUDFRONT_DISTRIBUTION_ID \
    --paths "/*"
fi

echo "✅ Frontend deployment complete!"
echo "🌐 URL: https://$AWS_S3_FRONTEND_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
