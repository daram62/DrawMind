#!/bin/bash

# Deploy FastAPI to AWS ECS
set -e

echo "🚀 Deploying FastAPI to AWS ECS..."

# Load environment variables
if [ -f .env.aws ]; then
  export $(cat .env.aws | grep -v '^#' | xargs)
fi

# Configuration
AWS_REGION=${AWS_REGION:-ap-northeast-2}
ECR_REPOSITORY=${ECR_REPOSITORY:-hackathon-fastapi}
ECS_CLUSTER=${ECS_CLUSTER:-hackathon-cluster}
ECS_SERVICE=${ECS_SERVICE:-hackathon-service}
TASK_FAMILY=${TASK_FAMILY:-hackathon-task}

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

echo "📍 Region: $AWS_REGION"
echo "🏢 Account: $AWS_ACCOUNT_ID"

# ============================================
# 1. Create ECR repository if not exists
# ============================================
echo ""
echo "📦 Creating ECR repository..."

aws ecr describe-repositories --repository-names $ECR_REPOSITORY --region $AWS_REGION 2>/dev/null || \
aws ecr create-repository \
  --repository-name $ECR_REPOSITORY \
  --region $AWS_REGION

ECR_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPOSITORY"
echo "✅ ECR Repository: $ECR_URI"

# ============================================
# 2. Build and push Docker image
# ============================================
echo ""
echo "🔨 Building Docker image..."

cd backend-fastapi
docker build -t $ECR_REPOSITORY:latest .

# Login to ECR
echo "🔐 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | \
  docker login --username AWS --password-stdin $ECR_URI

# Tag and push
echo "📤 Pushing image to ECR..."
docker tag $ECR_REPOSITORY:latest $ECR_URI:latest
docker push $ECR_URI:latest

echo "✅ Image pushed: $ECR_URI:latest"

# ============================================
# 3. Create ECS cluster if not exists
# ============================================
echo ""
echo "🏗️  Creating ECS cluster..."

aws ecs describe-clusters --clusters $ECS_CLUSTER --region $AWS_REGION 2>/dev/null || \
aws ecs create-cluster \
  --cluster-name $ECS_CLUSTER \
  --region $AWS_REGION

echo "✅ ECS Cluster: $ECS_CLUSTER"

# ============================================
# 4. Register task definition
# ============================================
echo ""
echo "📝 Registering task definition..."

cat > /tmp/task-definition.json <<EOF
{
  "family": "$TASK_FAMILY",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "fastapi",
      "image": "$ECR_URI:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {"name": "DEBUG", "value": "False"},
        {"name": "AWS_REGION", "value": "$AWS_REGION"},
        {"name": "AWS_S3_BUCKET", "value": "$AWS_S3_FILES_BUCKET"},
        {"name": "ALLOWED_ORIGINS", "value": "*"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/$TASK_FAMILY",
          "awslogs-region": "$AWS_REGION",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
EOF

# Create log group
aws logs create-log-group --log-group-name "/ecs/$TASK_FAMILY" --region $AWS_REGION 2>/dev/null || true

# Register task definition
aws ecs register-task-definition \
  --cli-input-json file:///tmp/task-definition.json \
  --region $AWS_REGION

echo "✅ Task definition registered"

# ============================================
# 5. Create or update service
# ============================================
echo ""
echo "🚀 Creating/updating ECS service..."

# Get default VPC and subnets
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=isDefault,Values=true" --query "Vpcs[0].VpcId" --output text --region $AWS_REGION)
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query "Subnets[*].SubnetId" --output text --region $AWS_REGION | tr '\t' ',')

# Create security group if not exists
SG_ID=$(aws ec2 describe-security-groups --filters "Name=group-name,Values=hackathon-sg" --query "SecurityGroups[0].GroupId" --output text --region $AWS_REGION 2>/dev/null)

if [ "$SG_ID" == "None" ] || [ -z "$SG_ID" ]; then
  echo "Creating security group..."
  SG_ID=$(aws ec2 create-security-group \
    --group-name hackathon-sg \
    --description "Security group for hackathon ECS service" \
    --vpc-id $VPC_ID \
    --region $AWS_REGION \
    --query 'GroupId' \
    --output text)
  
  # Allow inbound traffic on port 8000
  aws ec2 authorize-security-group-ingress \
    --group-id $SG_ID \
    --protocol tcp \
    --port 8000 \
    --cidr 0.0.0.0/0 \
    --region $AWS_REGION
fi

# Check if service exists
SERVICE_EXISTS=$(aws ecs describe-services --cluster $ECS_CLUSTER --services $ECS_SERVICE --region $AWS_REGION --query "services[0].status" --output text 2>/dev/null)

if [ "$SERVICE_EXISTS" == "ACTIVE" ]; then
  echo "Updating existing service..."
  aws ecs update-service \
    --cluster $ECS_CLUSTER \
    --service $ECS_SERVICE \
    --task-definition $TASK_FAMILY \
    --force-new-deployment \
    --region $AWS_REGION
else
  echo "Creating new service..."
  aws ecs create-service \
    --cluster $ECS_CLUSTER \
    --service-name $ECS_SERVICE \
    --task-definition $TASK_FAMILY \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[$SUBNET_IDS],securityGroups=[$SG_ID],assignPublicIp=ENABLED}" \
    --region $AWS_REGION
fi

echo "✅ Service deployed"

# ============================================
# 6. Get service URL
# ============================================
echo ""
echo "⏳ Waiting for service to start..."
sleep 30

TASK_ARN=$(aws ecs list-tasks --cluster $ECS_CLUSTER --service-name $ECS_SERVICE --region $AWS_REGION --query "taskArns[0]" --output text)

if [ ! -z "$TASK_ARN" ] && [ "$TASK_ARN" != "None" ]; then
  ENI_ID=$(aws ecs describe-tasks --cluster $ECS_CLUSTER --tasks $TASK_ARN --region $AWS_REGION --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value" --output text)
  PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $ENI_ID --region $AWS_REGION --query "NetworkInterfaces[0].Association.PublicIp" --output text)
  
  echo ""
  echo "=========================================="
  echo "✅ Deployment Complete!"
  echo "=========================================="
  echo ""
  echo "🌐 API URL: http://$PUBLIC_IP:8000"
  echo "🏥 Health Check: http://$PUBLIC_IP:8000/health"
  echo "📚 API Docs: http://$PUBLIC_IP:8000/docs"
  echo ""
  echo "Next steps:"
  echo "1. Update frontend/.env with VITE_API_URL=http://$PUBLIC_IP:8000"
  echo "2. Test the API: curl http://$PUBLIC_IP:8000/health"
  echo ""
else
  echo "⚠️  Could not get task information. Check ECS console for service status."
fi
