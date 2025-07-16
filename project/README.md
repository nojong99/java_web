# JWT 토큰 기반 로그인 시스템

Spring Boot와 React를 사용한 JWT 토큰 기반 인증 시스템입니다.

## 기술 스택

### Backend
- Spring Boot 3.5.3
- Spring Security
- Spring Data JPA
- JWT (JSON Web Token)
- H2 Database (개발용)
- Gradle

### Frontend
- React 18
- React Router DOM
- Axios
- CSS3

## 프로젝트 구조

```
project/
├── src/main/java/com/example/demo/
│   ├── config/
│   │   └── ApplicationConfig.java
│   ├── controller/
│   │   ├── AuthController.java
│   │   └── TestController.java
│   ├── dto/
│   │   ├── AuthResponse.java
│   │   ├── LoginRequest.java
│   │   └── RegisterRequest.java
│   ├── entity/
│   │   ├── Role.java
│   │   └── User.java
│   ├── repository/
│   │   └── UserRepository.java
│   ├── security/
│   │   ├── JwtAuthenticationFilter.java
│   │   ├── JwtService.java
│   │   └── SecurityConfig.java
│   ├── service/
│   │   ├── AuthenticationService.java
│   │   └── CustomUserDetailsService.java
│   └── ProjectApplication.java
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Navbar.js
│   │   │   └── Register.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── build.gradle
└── README.md
```

## 주요 기능

### Backend
- JWT 토큰 기반 인증
- 사용자 등록/로그인
- 소셜 로그인 (Google, Naver, Kakao)
- 보호된 API 엔드포인트
- CORS 설정
- 비밀번호 암호화 (BCrypt)

### Frontend
- 반응형 UI
- 로그인/회원가입 폼
- 대시보드
- JWT 토큰 자동 관리
- 보호된 라우트

## 실행 방법

### 1. Backend 실행

```bash
# 프로젝트 루트 디렉토리에서
./gradlew bootRun
```

또는

```bash
./gradlew build
java -jar build/libs/project-0.0.1-SNAPSHOT.jar
```

Backend 서버는 `http://localhost:8080`에서 실행됩니다.

### 2. Frontend 실행

```bash
# frontend 디렉토리로 이동
cd frontend

# 의존성 설치
npm install

# 개발 서버 실행
npm start
```

Frontend는 `http://localhost:3000`에서 실행됩니다.

## API 엔드포인트

### 인증 관련
- `POST /api/v1/auth/register` - 회원가입
- `POST /api/v1/auth/login` - 로그인
- `GET /api/v1/auth/test` - 인증 테스트

### 테스트용
- `GET /api/v1/test/public` - 공개 엔드포인트
- `GET /api/v1/test/protected` - 보호된 엔드포인트 (인증 필요)

## 사용 방법

1. **회원가입**: `/register` 페이지에서 새 계정을 만듭니다.
2. **로그인**: `/login` 페이지에서 기존 계정으로 로그인합니다.
3. **대시보드**: 로그인 후 자동으로 대시보드로 이동합니다.
4. **API 테스트**: 대시보드에서 공개/보호된 엔드포인트를 테스트할 수 있습니다.

## JWT 토큰

- **만료 시간**: 24시간
- **저장 위치**: 브라우저 로컬 스토리지
- **자동 갱신**: API 요청 시 자동으로 Authorization 헤더에 포함

## 데이터베이스

개발 환경에서는 H2 인메모리 데이터베이스를 사용합니다.
- H2 콘솔: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- 사용자명: `sa`
- 비밀번호: `password`

## 보안 설정

- CORS: 모든 도메인 허용 (개발용)
- CSRF: 비활성화 (JWT 사용)
- 세션: STATELESS
- 비밀번호: BCrypt 암호화
- OAuth2: Google, Naver, Kakao 지원

## 소셜 로그인 설정

### 1. Google OAuth2 설정
1. [Google Cloud Console](https://console.cloud.google.com/)에서 프로젝트 생성
2. OAuth 2.0 클라이언트 ID 생성
3. 승인된 리디렉션 URI: `http://localhost:8080/login/oauth2/code/google`
4. `application.properties`에 클라이언트 ID와 시크릿 설정

### 2. Naver OAuth2 설정
1. [Naver Developers](https://developers.naver.com/)에서 애플리케이션 등록
2. 서비스 URL: `http://localhost:8080`
3. Callback URL: `http://localhost:8080/login/oauth2/code/naver`
4. `application.properties`에 클라이언트 ID와 시크릿 설정

### 3. Kakao OAuth2 설정
1. [Kakao Developers](https://developers.kakao.com/)에서 애플리케이션 등록
2. 플랫폼 > Web 플랫폼 등록
3. 사이트 도메인: `http://localhost:8080`
4. Redirect URI: `http://localhost:8080/login/oauth2/code/kakao`
5. `application.properties`에 클라이언트 ID와 시크릿 설정

## CI/CD 파이프라인

이 프로젝트는 GitHub Actions를 사용한 자동화된 CI/CD 파이프라인을 포함합니다.

### GitHub Actions 워크플로우

1. **ci-cd.yml**: 기본 CI/CD 파이프라인
   - 백엔드 빌드 및 테스트
   - 프론트엔드 빌드 및 테스트
   - 통합 테스트
   - 배포 패키지 생성

2. **docker-deploy.yml**: Docker 기반 배포
   - Docker 이미지 빌드
   - GitHub Container Registry에 푸시
   - 자동 배포

### 트리거 조건

- `main` 또는 `master` 브랜치에 푸시
- Pull Request 생성
- 태그 푸시 (`v*` 패턴)

### Docker 배포

```bash
# 로컬에서 Docker 실행
docker-compose up -d

# 배포 스크립트 실행 (Linux/Mac)
./scripts/deploy.sh

# 배포 스크립트 실행 (Windows)
scripts\deploy.bat
```

### Docker 이미지

- **백엔드**: `ghcr.io/nojong99/java_web/backend:latest`
- **프론트엔드**: `ghcr.io/nojong99/java_web/frontend:latest`

## 개발 환경

- Java 17
- Node.js 18+
- npm 또는 yarn
- Docker (선택사항)

## 라이센스

MIT License 