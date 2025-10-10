#!/bin/bash

# Simplified AWS Infrastructure Setup
# Creates S3 buckets without public access (more secure)

set -e

echo "🚀 Setting up AWS Infrastructure (Secure Mode)..."

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    exit 1
fi

# Check credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS credentials are not configured."
    exit 1
fi

# Set defaults
AWS_REGION=${AWS_REGION:-ap-northeast-2}
PROJECT_NAME=${PROJECT_NAME:-hackathon-infra}

echo "📍 Region: $AWS_REGION"
echo "📦 Project: $PROJECT_NAME"

# ============================================
# 1. Create S3 bucket for file storage
# ============================================
echo ""
echo "📦 Creating S3 bucket for file storage..."
FILES_BUCKET="${PROJECT_NAME}-files-$(date +%s)"

aws s3 mb s3://$FILES_BUCKET --region $AWS_REGION

# Enable CORS (keep bucket private, use signed URLs)
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

echo "✅ Files bucket created: $FILES_BUCKET"
echo "📝 Note: Bucket is private. Use signed URLs for access."

# ============================================
# 2. Save configuration
# ============================================
echo ""
echo "💾 Saving configuration..."

cat > .env.aws <<EOF
# AWS Configuration
AWS_REGION=$AWS_REGION
AWS_S3_FILES_BUCKET=$FILES_BUCKET

# Note: For frontend deployment, use Vercel, Netlify, or similar services
# They handle static hosting better than S3 + CloudFront for this use case
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
echo "📦 Files Bucket: $FILES_BUCKET"
echo ""
echo "Next steps:"
echo "1. Update backend/.env:"
echo "   AWS_S3_BUCKET=$FILES_BUCKET"
echo ""
echo "2. For frontend deployment, we recommend:"
echo "   - Vercel (recommended): vercel deploy"
echo "   - Netlify: netlify deploy"
echo "   - GitHub Pages"
echo ""
echo "3. For backend deployment:"
echo "   - Railway: railway up"
echo "   - Render: render deploy"
echo "   - Or use EC2 (see AWS_DEPLOYMENT.md)"
echo ""
