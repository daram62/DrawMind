#!/bin/bash

# FastAPI를 EC2에 배포하는 스크립트

set -e

echo "🚀 Deploying FastAPI to EC2..."

EC2_IP="13.125.237.117"
SSH_KEY="~/.ssh/hackathon-key.pem"

# 1. Docker 이미지 빌드 (EC2용)
echo "🔨 Building Docker image for EC2 (linux/amd64)..."
cd backend-fastapi
docker buildx build --platform linux/amd64 -t hackathon-api:simple .

# 2. 이미지 저장
echo "💾 Saving Docker image..."
docker save hackathon-api:simple | gzip > hackathon-api.tar.gz

# 3. EC2로 전송
echo "📤 Uploading to EC2..."
scp -i $SSH_KEY hackathon-api.tar.gz ubuntu@$EC2_IP:~/

# 4. EC2에서 배포
echo "🚢 Deploying on EC2..."
ssh -i $SSH_KEY ubuntu@$EC2_IP << 'EOF'
  # 기존 컨테이너 중지 및 삭제
  docker stop api 2>/dev/null || true
  docker rm api 2>/dev/null || true
  
  # 새 이미지 로드
  docker load < hackathon-api.tar.gz
  
  # 컨테이너 실행
  docker run -d -p 8000:8000 --name api --restart unless-stopped hackathon-api:simple
  
  # 정리
  rm hackathon-api.tar.gz
  
  echo "✅ Deployment complete!"
  echo "📝 Checking logs..."
  sleep 2
  docker logs api
EOF

# 5. 로컬 정리
rm hackathon-api.tar.gz

echo ""
echo "=========================================="
echo "✅ Deployment Complete!"
echo "=========================================="
echo ""
echo "🌐 API URL: http://$EC2_IP:8000"
echo "📚 API Docs: http://$EC2_IP:8000/docs"
echo "🏥 Health: http://$EC2_IP:8000/health"
echo ""
