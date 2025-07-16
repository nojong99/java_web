#!/bin/bash

# 배포 스크립트
# 사용법: ./scripts/deploy.sh [environment]

set -e

ENVIRONMENT=${1:-production}
DOCKER_REGISTRY="ghcr.io/nojong99/java_web"

echo "🚀 배포를 시작합니다..."
echo "환경: $ENVIRONMENT"

# 최신 이미지 가져오기
echo "📦 최신 Docker 이미지를 가져오는 중..."
docker pull $DOCKER_REGISTRY/backend:latest
docker pull $DOCKER_REGISTRY/frontend:latest

# 기존 컨테이너 중지 및 제거
echo "🛑 기존 컨테이너를 중지하는 중..."
docker-compose down

# 새 컨테이너 시작
echo "▶️ 새 컨테이너를 시작하는 중..."
docker-compose up -d

# 헬스 체크
echo "🏥 헬스 체크 중..."
sleep 10

# 백엔드 헬스 체크
if curl -f http://localhost:8080/actuator/health; then
    echo "✅ 백엔드가 정상적으로 실행되었습니다."
else
    echo "❌ 백엔드 헬스 체크 실패"
    exit 1
fi

# 프론트엔드 헬스 체크
if curl -f http://localhost:3000; then
    echo "✅ 프론트엔드가 정상적으로 실행되었습니다."
else
    echo "❌ 프론트엔드 헬스 체크 실패"
    exit 1
fi

echo "🎉 배포가 완료되었습니다!"
echo "📱 프론트엔드: http://localhost:3000"
echo "🔧 백엔드 API: http://localhost:8080"
echo "🗄️ H2 데이터베이스: http://localhost:8181" 