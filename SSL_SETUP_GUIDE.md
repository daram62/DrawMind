# 🔒 EC2 백엔드 HTTPS 설정 가이드

## 필요한 것
- ✅ EC2 서버 (이미 있음)
- ✅ 도메인 또는 서브도메인
- ⏱️ 소요 시간: 30분~1시간

---

## 방법 A: 도메인이 있는 경우 (권장)

### 1단계: DNS 설정

도메인 관리 페이지 (가비아, Route53 등)에서:

```
Type: A
Name: api (또는 backend)
Value: 43.200.181.143
TTL: 300
```

예시:
- `api.yourdomain.com` → `43.200.181.143`

### 2단계: EC2 서버 접속

```bash
ssh -i your-key.pem ubuntu@43.200.181.143
```

### 3단계: Nginx 설치

```bash
sudo apt update
sudo apt install nginx -y
```

### 4단계: Certbot 설치 (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 5단계: Nginx 설정

```bash
sudo nano /etc/nginx/sites-available/backend
```

다음 내용 입력:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;  # 여기에 실제 도메인 입력

    location / {
        proxy_pass http://localhost:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6단계: Nginx 설정 활성화

```bash
sudo ln -s /etc/nginx/sites-available/backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7단계: SSL 인증서 발급

```bash
sudo certbot --nginx -d api.yourdomain.com
```

질문에 답변:
- 이메일 입력
- 약관 동의 (Y)
- 뉴스레터 (N)
- Redirect HTTP to HTTPS? → **2** (Yes, redirect)

### 8단계: 방화벽 설정

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8001/tcp
sudo ufw reload
```

### 9단계: 테스트

브라우저에서:
```
https://api.yourdomain.com/health
```

✅ 작동하면 성공!

---

## 방법 B: 도메인이 없는 경우

### 옵션 1: 무료 도메인 사용

**Freenom** (무료 도메인):
1. https://www.freenom.com 접속
2. 무료 도메인 등록 (.tk, .ml, .ga 등)
3. DNS 설정에서 A 레코드 추가
4. 위의 방법 A 진행

**단점**: 신뢰도가 낮고 불안정할 수 있음

### 옵션 2: AWS Route53 사용

1. Route53에서 도메인 구매 ($12/년)
2. Hosted Zone 생성
3. A 레코드 추가
4. 위의 방법 A 진행

### 옵션 3: Cloudflare Tunnel (무료, 도메인 불필요!)

가장 쉬운 방법:

#### 1. Cloudflare 계정 생성
https://dash.cloudflare.com/sign-up

#### 2. EC2에서 Cloudflared 설치

```bash
# Cloudflared 다운로드
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb

# 설치
sudo dpkg -i cloudflared-linux-amd64.deb

# 로그인
cloudflared tunnel login
```

브라우저가 열리면 Cloudflare 로그인

#### 3. Tunnel 생성

```bash
# Tunnel 생성
cloudflared tunnel create backend-api

# 설정 파일 생성
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

config.yml 내용:
```yaml
tunnel: <TUNNEL-ID>  # 위에서 생성된 ID
credentials-file: /home/ubuntu/.cloudflared/<TUNNEL-ID>.json

ingress:
  - hostname: backend-api-<random>.trycloudflare.com
    service: http://localhost:8001
  - service: http_status:404
```

#### 4. Tunnel 실행

```bash
cloudflared tunnel run backend-api
```

#### 5. 백그라운드 실행 (systemd)

```bash
sudo cloudflared service install
sudo systemctl start cloudflared
sudo systemctl enable cloudflared
```

#### 6. URL 확인

```bash
cloudflared tunnel info backend-api
```

HTTPS URL이 자동으로 생성됩니다!
예: `https://backend-api-abc123.trycloudflare.com`

---

## 🎯 추천 방법

### 빠르고 쉬운 순서:
1. **Cloudflare Tunnel** (무료, 5분) ⚡
2. **Freenom 무료 도메인** (무료, 20분)
3. **Route53 도메인 구매** (유료, 30분)

---

## 📝 프론트엔드 환경 변수 업데이트

SSL 설정 완료 후:

```env
# frontend/.env.production
VITE_API_BASE_URL=https://api.yourdomain.com
# 또는
VITE_API_BASE_URL=https://backend-api-abc123.trycloudflare.com
```

---

## 🔄 재배포

```bash
git add .
git commit -m "chore: HTTPS API URL 업데이트"
git push origin main
```

Vercel이 자동으로 재배포합니다!

---

## 🐛 트러블슈팅

### Certbot 에러
```bash
sudo certbot renew --dry-run
```

### Nginx 에러
```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Cloudflare Tunnel 에러
```bash
sudo systemctl status cloudflared
sudo journalctl -u cloudflared -f
```

---

어떤 방법으로 하실 건가요?
1. 도메인 있음 → 방법 A
2. 도메인 없음 → Cloudflare Tunnel (추천!)
3. 도메인 구매 → Route53

알려주시면 단계별로 도와드릴게요! 🚀
