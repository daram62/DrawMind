# AWS 배포 가이드

이 가이드는 AWS에 전체 인프라를 배포하는 방법을 설명합니다.

## 사전 요구사항

- AWS 계정
- AWS CLI 설치 및 설정
- SSH 키 페어 (EC2 접속용)

## 1단계: AWS CLI 설정

```bash
# AWS CLI 설치 확인
aws --version

# AWS 자격증명 설정
aws configure
# AWS Access Key ID: <your-access-key>
# AWS Secret Access Key: <your-secret-key>
# Default region: ap-northeast-2
# Default output format: json
```

## 2단계: S3 버킷 및 CloudFront 생성

자동화 스크립트 실행:

```bash
chmod +x scripts/setup-aws-infrastructure.sh
./scripts/setup-aws-infrastructure.sh
```

또는 수동으로 생성:

### 프론트엔드용 S3 버킷

```bash
# 버킷 생성
aws s3 mb s3://your-frontend-bucket --region ap-northeast-2

# 정적 웹사이트 호스팅 활성화
aws s3 website s3://your-frontend-bucket \
  --index-document index.html \
  --error-document index.html

# 퍼블릭 액세스 설정
aws s3api put-bucket-policy \
  --bucket your-frontend-bucket \
  --policy file://bucket-policy.json
```

### 파일 저장용 S3 버킷

```bash
# 버킷 생성
aws s3 mb s3://your-files-bucket --region ap-northeast-2

# CORS 설정
aws s3api put-bucket-cors \
  --bucket your-files-bucket \
  --cors-configuration file://cors-config.json

# 퍼블릭 읽기 권한
aws s3api put-bucket-policy \
  --bucket your-files-bucket \
  --policy file://files-bucket-policy.json
```

## 3단계: EC2 인스턴스 생성

### AWS 콘솔에서 생성

1. EC2 대시보드 접속
2. "인스턴스 시작" 클릭
3. 설정:
   - **AMI**: Ubuntu Server 22.04 LTS
   - **인스턴스 유형**: t3.small (또는 t2.small)
   - **키 페어**: 기존 키 선택 또는 새로 생성
   - **네트워크 설정**:
     - VPC: 기본 VPC
     - 퍼블릭 IP 자동 할당: 활성화
   - **보안 그룹**:
     - SSH (22): 내 IP
     - HTTP (80): 0.0.0.0/0
     - HTTPS (443): 0.0.0.0/0
     - Custom TCP (3000): 0.0.0.0/0
   - **스토리지**: 20GB gp3

4. 인스턴스 시작

### EC2 초기 설정

```bash
# EC2 접속
ssh -i your-key.pem ubuntu@<ec2-public-ip>

# 시스템 업데이트
sudo apt update && sudo apt upgrade -y

# Docker 설치
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Docker Compose 설치
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 재접속 (docker 그룹 적용)
exit
ssh -i your-key.pem ubuntu@<ec2-public-ip>

# 확인
docker --version
docker-compose --version
```

## 4단계: 환경 변수 설정

### 백엔드 환경 변수

```bash
# backend/.env
NODE_ENV=production
PORT=3000
ALLOWED_ORIGINS=https://your-frontend-url.com

# Database (EC2에서 SQLite 또는 RDS PostgreSQL)
DATABASE_URL=file:./prod.db
# 또는 PostgreSQL
# DATABASE_URL=postgresql://user:password@rds-endpoint:5432/dbname

# AWS S3
AWS_REGION=ap-northeast-2
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
AWS_S3_BUCKET=your-files-bucket

# AI Provider (선택)
AI_PROVIDER=gemini
GEMINI_API_KEY=<your-api-key>
```

### 프론트엔드 환경 변수

```bash
# frontend/.env
VITE_API_URL=http://<ec2-public-ip>:3000
# 또는 도메인 사용시
# VITE_API_URL=https://api.yourdomain.com
```

## 5단계: 프론트엔드 배포

```bash
# 로컬에서 실행
export AWS_S3_FRONTEND_BUCKET=your-frontend-bucket
export AWS_CLOUDFRONT_DISTRIBUTION_ID=your-distribution-id  # 선택
export AWS_REGION=ap-northeast-2

./scripts/deploy-frontend.sh
```

## 6단계: 백엔드 배포

### 방법 1: 배포 스크립트 사용

```bash
# 로컬에서 실행
export EC2_HOST=<ec2-public-ip>
export EC2_USER=ubuntu

./scripts/deploy-backend.sh
```

### 방법 2: 수동 배포

```bash
# 1. 로컬에서 Docker 이미지 빌드
docker build -t hackathon-backend:latest -f backend/Dockerfile backend/

# 2. 이미지 저장
docker save hackathon-backend:latest | gzip > backend-image.tar.gz

# 3. EC2로 전송
scp -i your-key.pem backend-image.tar.gz ubuntu@<ec2-ip>:~/
scp -i your-key.pem docker-compose.yml ubuntu@<ec2-ip>:~/
scp -i your-key.pem backend/.env ubuntu@<ec2-ip>:~/backend.env

# 4. EC2에서 배포
ssh -i your-key.pem ubuntu@<ec2-ip>

# 이미지 로드
docker load < backend-image.tar.gz

# 환경 변수 설정
mkdir -p ~/backend
mv ~/backend.env ~/backend/.env

# Docker Compose 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f
```

## 7단계: 데이터베이스 마이그레이션

```bash
# EC2에서 실행
docker-compose exec backend npx prisma migrate deploy
```

## 8단계: 도메인 설정 (선택)

### Route 53 설정

1. Route 53에서 호스팅 영역 생성
2. A 레코드 추가:
   - **이름**: api.yourdomain.com
   - **유형**: A
   - **값**: EC2 퍼블릭 IP

3. CloudFront 도메인 설정:
   - **이름**: www.yourdomain.com
   - **유형**: CNAME
   - **값**: CloudFront 도메인

### SSL 인증서 (HTTPS)

```bash
# EC2에 Nginx 설치
sudo apt install nginx certbot python3-certbot-nginx -y

# Nginx 설정
sudo nano /etc/nginx/sites-available/default
```

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# SSL 인증서 발급
sudo certbot --nginx -d api.yourdomain.com

# Nginx 재시작
sudo systemctl restart nginx
```

## 9단계: 모니터링 및 로그

### CloudWatch 로그 설정

```bash
# EC2에 CloudWatch 에이전트 설치
wget https://s3.amazonaws.com/amazoncloudwatch-agent/ubuntu/amd64/latest/amazon-cloudwatch-agent.deb
sudo dpkg -i amazon-cloudwatch-agent.deb
```

### 애플리케이션 로그 확인

```bash
# Docker 로그
docker-compose logs -f backend

# Nginx 로그
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 10단계: 백업 설정

### 데이터베이스 백업

```bash
# 백업 스크립트 생성
cat > ~/backup-db.sh <<'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
docker-compose exec -T backend npx prisma db push --force-reset
docker cp $(docker-compose ps -q backend):/app/prisma/prod.db ~/backups/db_$DATE.db
aws s3 cp ~/backups/db_$DATE.db s3://your-backup-bucket/
EOF

chmod +x ~/backup-db.sh

# Cron 설정 (매일 새벽 2시)
crontab -e
# 추가: 0 2 * * * /home/ubuntu/backup-db.sh
```

## 비용 최적화

### 예상 비용 (월간)

- **EC2 t3.small**: ~$15
- **S3 스토리지 (10GB)**: ~$0.23
- **S3 요청**: ~$0.01
- **CloudFront (선택)**: ~$1-5
- **데이터 전송**: ~$1-10

**총 예상 비용**: $17-31/월

### 비용 절감 팁

1. **EC2 예약 인스턴스**: 1년 약정시 ~40% 할인
2. **S3 Intelligent-Tiering**: 자동 비용 최적화
3. **CloudFront 캐싱**: 데이터 전송 비용 절감
4. **Auto Scaling**: 사용량에 따라 자동 조정

## 트러블슈팅

### 문제: EC2 접속 불가
**해결**: 보안 그룹에서 SSH (22) 포트 확인

### 문제: API 접속 불가
**해결**: 
- 보안 그룹에서 3000 포트 확인
- Docker 컨테이너 상태 확인: `docker-compose ps`
- 로그 확인: `docker-compose logs backend`

### 문제: S3 업로드 실패
**해결**:
- IAM 권한 확인
- CORS 설정 확인
- 버킷 정책 확인

### 문제: 데이터베이스 연결 실패
**해결**:
- DATABASE_URL 확인
- Prisma 마이그레이션 실행: `npx prisma migrate deploy`

## 유지보수

### 정기 작업

- **주간**: 로그 확인, 디스크 사용량 확인
- **월간**: 보안 업데이트, 백업 확인
- **분기**: 비용 검토, 성능 최적화

### 업데이트 배포

```bash
# 1. 새 버전 빌드 및 배포
./scripts/deploy-backend.sh

# 2. 무중단 배포 (Blue-Green)
docker-compose up -d --no-deps --build backend
```

## 참고 자료

- [AWS EC2 문서](https://docs.aws.amazon.com/ec2/)
- [AWS S3 문서](https://docs.aws.amazon.com/s3/)
- [Docker 문서](https://docs.docker.com/)
- [Prisma 문서](https://www.prisma.io/docs/)
