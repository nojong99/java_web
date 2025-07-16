@echo off
REM 배포 스크립트 (Windows)
REM 사용법: scripts\deploy.bat [environment]

setlocal enabledelayedexpansion

set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=production
set DOCKER_REGISTRY=ghcr.io/nojong99/java_web

echo 🚀 배포를 시작합니다...
echo 환경: %ENVIRONMENT%

REM 최신 이미지 가져오기
echo 📦 최신 Docker 이미지를 가져오는 중...
docker pull %DOCKER_REGISTRY%/backend:latest
docker pull %DOCKER_REGISTRY%/frontend:latest

REM 기존 컨테이너 중지 및 제거
echo 🛑 기존 컨테이너를 중지하는 중...
docker-compose down

REM 새 컨테이너 시작
echo ▶️ 새 컨테이너를 시작하는 중...
docker-compose up -d

REM 헬스 체크
echo 🏥 헬스 체크 중...
timeout /t 10 /nobreak >nul

REM 백엔드 헬스 체크
curl -f http://localhost:8080/actuator/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 백엔드가 정상적으로 실행되었습니다.
) else (
    echo ❌ 백엔드 헬스 체크 실패
    exit /b 1
)

REM 프론트엔드 헬스 체크
curl -f http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 프론트엔드가 정상적으로 실행되었습니다.
) else (
    echo ❌ 프론트엔드 헬스 체크 실패
    exit /b 1
)

echo 🎉 배포가 완료되었습니다!
echo 📱 프론트엔드: http://localhost:3000
echo 🔧 백엔드 API: http://localhost:8080
echo 🗄️ H2 데이터베이스: http://localhost:8181

pause 