#!/bin/bash

# AWS Infrastructure Setup Script
# This script creates all necessary AWS resources for the hackathon infrastructure

set -e

echo "🚀 Setting up AWS Infrastructure..."

# Load environment variables
if [ -f .env.aws ]; then
  export $(cat .env.aws | grep -v '^#' | xargs)
fi

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first."
    echo "Visit: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured."
    echo "Run: aws configure"
    exit 1
fi

# Set default region
AWS_REGION=${AWS_REGION:-ap-northeast-2}
PROJECT_NAME=${PROJECT_NAME:-hackathon-infra}

echo "📍 Region: $AWS_REGION"
echo "📦 Project: $PROJECT_NAME"

# ============================================
# 1. Create S3 bucket for frontend hosting
# ============================================
echo ""
echo "📦 Creating S3 bucket for frontend..."
FRONTEND_BUCKET="${PROJECT_NAME}-frontend-$(date +%s)"

aws s3 mb s3://$FRONTEND_BUCKET --region $AWS_REGION

# Disable block public access
aws s3api put-public-access-block \
  --bucket $FRONTEND_BUCKET \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Wait for settings to propagate
sleep 2

# Enable static website hosting
aws s3 website s3://$FRONTEND_BUCKET \
  --index-document index.html \
  --error-document index.html

# Set bucket policy for public read
cat > /tmp/bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$FRONTEND_BUCKET/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket $FRONTEND_BUCKET \
  --policy file:///tmp/bucket-policy.json

echo "✅ Frontend bucket created: $FRONTEND_BUCKET"
echo "🌐 Website URL: http://$FRONTEND_BUCKET.s3-website-$AWS_REGION.amazonaws.com"

# ============================================
# 2. Create S3 bucket for file storage
# ============================================
echo ""
echo "📦 Creating S3 bucket for file storage..."
FILES_BUCKET="${PROJECT_NAME}-files-$(date +%s)"

aws s3 mb s3://$FILES_BUCKET --region $AWS_REGION

# Disable block public access
aws s3api put-public-access-block \
  --bucket $FILES_BUCKET \
  --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

# Wait for settings to propagate
sleep 2

# Enable CORS
cat > /tmp/cors-config.json <<EOF
{
  "CORSRules": [
    {
      "AllowedOrigins": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
EOF

aws s3api put-bucket-cors \
  --bucket $FILES_BUCKET \
  --cors-configuration file:///tmp/cors-config.json

# Set bucket policy for public read
cat > /tmp/files-bucket-policy.json <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::$FILES_BUCKET/*"
    }
  ]
}
EOF

aws s3api put-bucket-policy \
  --bucket $FILES_BUCKET \
  --policy file:///tmp/files-bucket-policy.json

echo "✅ Files bucket created: $FILES_BUCKET"

# ============================================
# 3. Create CloudFront Distribution (Optional)
# ============================================
echo ""
read -p "Do you want to create a CloudFront distribution? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  echo "☁️  Creating CloudFront distribution..."
  
  cat > /tmp/cloudfront-config.json <<EOF
{
  "CallerReference": "$(date +%s)",
  "Comment": "$PROJECT_NAME frontend",
  "Enabled": true,
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-$FRONTEND_BUCKET",
        "DomainName": "$FRONTEND_BUCKET.s3-website-$AWS_REGION.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-$FRONTEND_BUCKET",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  }
}
EOF

  DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --distribution-config file:///tmp/cloudfront-config.json \
    --query 'Distribution.Id' \
    --output text)
  
  echo "✅ CloudFront distribution created: $DISTRIBUTION_ID"
  echo "⏳ Distribution is being deployed (this may take 15-20 minutes)"
fi

# ============================================
# 4. Save configuration
# ============================================
echo ""
echo "💾 Saving configuration..."

cat > .env.aws <<EOF
# AWS Configuration
AWS_REGION=$AWS_REGION
AWS_S3_FRONTEND_BUCKET=$FRONTEND_BUCKET
AWS_S3_FILES_BUCKET=$FILES_BUCKET
${DISTRIBUTION_ID:+AWS_CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID}

# Frontend URL
FRONTEND_URL=http://$FRONTEND_BUCKET.s3-website-$AWS_REGION.amazonaws.com
${DISTRIBUTION_ID:+CLOUDFRONT_URL=https://$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)}
EOF

echo "✅ Configuration saved to .env.aws"

# ============================================
# Summary
# ============================================
echo ""
echo "=========================================="
echo "✅ AWS Infrastructure Setup Complete!"
echo "=========================================="
echo ""
echo "📦 Frontend Bucket: $FRONTEND_BUCKET"
echo "🌐 Frontend URL: http://$FRONTEND_BUCKET.s3-website-$AWS_REGION.amazonaws.com"
echo ""
echo "📦 Files Bucket: $FILES_BUCKET"
echo ""
if [ ! -z "$DISTRIBUTION_ID" ]; then
  echo "☁️  CloudFront Distribution: $DISTRIBUTION_ID"
  echo "🌐 CloudFront URL: https://$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)"
  echo ""
fi
echo "Next steps:"
echo "1. Update backend/.env with AWS_S3_BUCKET=$FILES_BUCKET"
echo "2. Update frontend/.env with VITE_API_URL=<your-backend-url>"
echo "3. Run ./scripts/deploy-frontend.sh to deploy frontend"
echo "4. Set up EC2 instance for backend (see AWS_DEPLOYMENT.md)"
echo ""
