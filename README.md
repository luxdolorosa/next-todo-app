# Next.js Todo App - Render 배포 실습

Next.js + MongoDB (Mongoose)를 사용한 투두 리스트 애플리케이션입니다. Render 클라우드 플랫폼에 배포하고 GitHub Actions를 통한 CI/CD를 구성하는 실습 프로젝트입니다.

## 🚀 기능

- ✅ 투두 추가, 조회, 수정, 삭제 (CRUD)
- ✅ 완료/미완료 상태 토글
- ✅ MongoDB를 통한 데이터 영구 저장
- ✅ Tailwind CSS로 구성된 모던한 UI
- ✅ GitHub Actions를 통한 자동 배포 (CI/CD)

## 📋 사전 요구사항

- Node.js 18 이상
- MongoDB Atlas 계정 (또는 로컬 MongoDB)
- GitHub 계정
- Render 계정

## 🛠️ 로컬 개발 환경 설정

### 1. 프로젝트 클론 및 의존성 설치

```bash
# 의존성 설치
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 MongoDB 연결 문자열을 입력하세요:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
```

### 3. MongoDB Atlas 설정 (선택사항)

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)에 가입
2. 무료 클러스터 생성
3. Database Access에서 사용자 생성
4. Network Access에서 IP 주소 추가 (로컬 개발 시 `0.0.0.0/0` 허용 가능)
5. Connect → Drivers에서 연결 문자열 복사

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📦 빌드 및 프로덕션 실행

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## ☁️ Render 배포 가이드

### 1. GitHub에 코드 푸시

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Render에서 Web Service 생성

1. [Render Dashboard](https://dashboard.render.com)에 로그인
2. "New +" 버튼 클릭 → "Web Service" 선택
3. GitHub 저장소 연결
4. 서비스 설정:
   - **Name**: `next-todo-app` (원하는 이름)
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Root Directory**: `.` (루트 디렉토리)

### 3. 환경 변수 설정

Render 대시보드에서:
1. "Environment" 탭으로 이동
2. "Add Environment Variable" 클릭
3. 다음 변수 추가:
   - **Key**: `MONGODB_URI`
   - **Value**: MongoDB Atlas 연결 문자열
   - **Key**: `NODE_ENV`
   - **Value**: `production`

### 4. 배포 확인

- Render 대시보드에서 배포 상태 확인
- 배포 완료 후 제공되는 URL로 접속하여 테스트

## 🔄 GitHub Actions CI/CD 설정

GitHub Actions는 코드 푸시 시 자동으로 빌드 테스트를 실행합니다.
별도의 설정 없이도 동작하지만, 빌드가 실패하는 경우 아래를 참고하세요.

### 1. 자동 빌드 테스트

- `main` 또는 `master` 브랜치에 푸시할 때마다 자동으로 빌드 테스트 실행
- 린트 검사 및 빌드 검증 수행
- 빌드 성공/실패 알림 확인

### 2. GitHub Secrets 설정 (필요한 경우만)

**중요**: GitHub Secrets는 선택사항입니다. 
빌드가 정상적으로 완료되면 설정할 필요가 없습니다.

빌드가 실패하는 경우에만 GitHub Secrets를 설정하세요:

1. GitHub 저장소 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. 다음 Secret 추가:
   - **Name**: `MONGODB_URI`
   - **Value**: MongoDB Atlas 연결 문자열

### 3. 환경 변수 차이점

**Render와 GitHub Actions는 서로 다른 환경입니다:**

| 환경 | 목적 | MONGODB_URI 설정 위치 |
|------|------|---------------------|
| **Render** | 실제 애플리케이션 실행 | Render 대시보드 → Environment 탭 (필수) |
| **GitHub Actions** | 빌드 테스트만 수행 | GitHub Secrets (선택사항) |

**참고**: 
- Render 배포에는 Render 대시보드에서 환경 변수를 설정하면 됩니다.
- GitHub Actions는 빌드 테스트만 하므로 실제 MongoDB 연결이 필요하지 않을 수 있습니다.
- 빌드가 실패하는 경우에만 GitHub Secrets에 `MONGODB_URI`를 추가하세요.

### 4. Render 자동 배포

Render는 GitHub 저장소와 연결되어 있으면 자동으로 배포됩니다:
- 코드 푸시 → Render가 변경 감지 → 자동 배포
- GitHub Actions와는 독립적으로 동작합니다.

## 📁 프로젝트 구조

```
my-app/
├── app/
│   ├── page.jsx              # 메인 페이지 (투두 리스트 UI)
│   ├── layout.jsx            # 레이아웃
│   ├── globals.css           # 전역 스타일
│   └── api/
│       └── todos/
│           └── route.js      # REST API 엔드포인트
├── lib/
│   └── mongoose.js           # Mongoose 연결 유틸리티
├── models/
│   └── Todo.js               # Todo 스키마 및 모델
├── .env.example              # 환경 변수 예시
├── .env.local                # 로컬 환경 변수 (gitignore)
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions 워크플로우
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## 🔧 주요 기술 스택

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose ODM)
- **Deployment**: Render
- **CI/CD**: GitHub Actions

## 📝 API 엔드포인트

### GET `/api/todos`
모든 투두 조회

**Response:**
```json
{
  "todos": [
    {
      "_id": "...",
      "text": "할 일 내용",
      "completed": false,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### POST `/api/todos`
새 투두 생성

**Request Body:**
```json
{
  "text": "새로운 할 일"
}
```

### PUT `/api/todos`
투두 수정 (완료 상태 토글)

**Request Body:**
```json
{
  "_id": "투두ID",
  "completed": true
}
```

### DELETE `/api/todos?_id=<투두ID>`
투두 삭제

## 🐛 문제 해결

### MongoDB 연결 오류
- MongoDB Atlas의 Network Access에서 IP 주소가 허용되었는지 확인
- 연결 문자열에 사용자명과 비밀번호가 올바른지 확인
- 환경 변수가 올바르게 설정되었는지 확인

### Render 배포 실패
- Build Command와 Start Command가 올바른지 확인
- 환경 변수가 설정되었는지 확인
- 로그를 확인하여 구체적인 오류 메시지 확인

### GitHub Actions 실패
- GitHub Secrets에 `MONGODB_URI`가 설정되었는지 확인
- 워크플로우 파일의 문법이 올바른지 확인

## 📚 학습 목표

이 프로젝트를 통해 다음을 학습할 수 있습니다:

1. ✅ Next.js App Router를 사용한 풀스택 개발
2. ✅ Mongoose를 사용한 MongoDB 스키마 모델링 및 데이터베이스 작업
3. ✅ 환경 변수 관리 (로컬/프로덕션)
4. ✅ Render 클라우드 플랫폼 배포
5. ✅ GitHub Actions를 통한 CI/CD 구성
6. ✅ 프로덕션 환경에서의 애플리케이션 운영

## 📄 라이선스

이 프로젝트는 교육 목적으로 제작되었습니다.
