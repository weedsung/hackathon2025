# 📋 PaperPilot - 이메일 커뮤니케이션 AI 어시스턴트 PRD

> **Product Requirements Document v1.0**  
> 업데이트: 2025년 7월

---

## 📝 목차

1. [제품 개요 (Product Overview)](#1-제품-개요-product-overview)
2. [문제 정의 및 목표 (Problem Statement & Goals)](#2-문제-정의-및-목표-problem-statement--goals)
3. [타겟 사용자 (Target Users)](#3-타겟-사용자-target-users)
4. [핵심 기능 (Core Features)](#4-핵심-기능-core-features)
5. [기술 스택 (Tech Stack)](#5-기술-스택-tech-stack)
6. [사용자 여정 (User Journey)](#6-사용자-여정-user-journey)
7. [기능 명세 (Feature Specifications)](#7-기능-명세-feature-specifications)
8. [데이터 모델 (Data Models)](#8-데이터-모델-data-models)
9. [UI/UX 요구사항 (UI/UX Requirements)](#9-uiux-요구사항-uiux-requirements)
10. [성능 및 제약사항 (Performance & Constraints)](#10-성능-및-제약사항-performance--constraints)
11. [보안 및 개인정보 보호 (Security & Privacy)](#11-보안-및-개인정보-보호-security--privacy)
12. [개발 우선순위 (Development Priorities)](#12-개발-우선순위-development-priorities)
13. [향후 계획 (Future Roadmap)](#13-향후-계획-future-roadmap)

---

## 1. 제품 개요 (Product Overview)

### 📧 제품명
**PaperPilot** - AI 기반 이메일 커뮤니케이션 어시스턴트

### 🎯 핵심 가치 제안
- **오해 방지**: 작성한 이메일의 오해 소지를 AI가 사전 분석
- **효율적 답장**: 상황별 맞춤 답장 템플릿 자동 생성
- **커뮤니케이션 개선**: AI 기반 톤 분석 및 개선 제안
- **업무 생산성 향상**: 반복적인 이메일 작성 시간 단축

### 📊 제품 현황
- **개발 단계**: MVP 완료, 베타 테스트 준비 중
- **핵심 기능**: 메일 검토, 답장 메뉴얼, 이메일 작성, 히스토리 관리
- **기술 스택**: React.js + Node.js + MongoDB + OpenAI API

---

## 2. 문제 정의 및 목표 (Problem Statement & Goals)

### 🚩 해결하고자 하는 문제

#### 주요 Pain Points
1. **오해 발생**: 이메일 텍스트의 뉘앙스 전달 실패로 인한 업무 오해
2. **시간 소모**: 적절한 표현 찾기 위한 반복적인 수정 작업
3. **톤 일관성**: 상황별 적절한 어조 선택의 어려움
4. **답장 부담**: 매번 새로 작성해야 하는 반복적인 답장 패턴

#### 비즈니스 임팩트
- 이메일 오해로 인한 업무 지연 및 재작업
- 커뮤니케이션 효율성 저하
- 직장인 스트레스 증가

### 🎯 제품 목표

#### 단기 목표 (3개월)
- ✅ 기본 이메일 검토 기능 구현
- ✅ 답장 템플릿 시스템 구축
- ✅ 사용자 인증 및 히스토리 관리
- 🔄 OpenAI API 연동 완료

#### 중기 목표 (6개월)
- 사용자 피드백 기반 AI 모델 개선
- 모바일 반응형 UI 최적화
- 팀/기업용 기능 추가
- 다국어 지원 (영어)

#### 장기 목표 (1년)
- SaaS 구독 모델 도입
- 고급 AI 분석 기능 (감정 분석, 톤 추천)
- Outlook/Gmail 플러그인 개발
- 기업 고객 확보

---

## 3. 타겟 사용자 (Target Users)

### 👤 Primary Persona: 직장인 김민수 (28세)

**배경**
- IT 회사 3년차 사원
- 하루 평균 20~30통의 이메일 처리
- 외부 거래처와의 커뮤니케이션 빈번

**Pain Points**
- 이메일 톤 때문에 오해받은 경험
- 적절한 표현을 찾느라 이메일 작성에 많은 시간 소모
- 상사/동료/거래처별로 다른 톤 적용의 어려움

**Goals & Needs**
- 빠르고 정확한 이메일 작성
- 오해 없는 명확한 커뮤니케이션
- 상황별 적절한 어조 및 표현 제안

### 👥 Secondary Personas
- **팀 리더/관리자**: 부하직원과의 효과적 커뮤니케이션
- **영업/마케팅 담당자**: 고객 대응 이메일 품질 향상
- **신입사원**: 직장 이메일 매너 학습

---

## 4. 핵심 기능 (Core Features)

### ✅ 현재 구현된 기능

#### 4.1 이메일 작성 (ComposePage)
- **받은 메일함 시뮬레이션**: 샘플 이메일 데이터로 실제 환경 모방
- **AI 기반 답장 생성**: OpenAI API를 통한 상황별 답장 자동 생성
- **템플릿 적용**: 기존 템플릿을 활용한 빠른 이메일 작성
- **다중 탭 인터페이스**: 받은편지함/보낸편지함 구분

#### 4.2 메일 검토 (ReviewPage)  
- **AI 오해도 분석**: 이메일 내용의 오해 가능성 점수화 (0-100점)
- **톤 피드백**: 이메일의 전체적인 어조 분석 및 개선 제안
- **구체적 제안사항**: 문제가 될 수 있는 표현과 개선 방향 제시
- **개선된 버전 제공**: AI가 수정한 완성된 이메일 버전

#### 4.3 답장 메뉴얼 (ManualPage)
- **카테고리별 템플릿**: 사과/요청/답변/회의 등 상황별 분류
- **템플릿 검색**: 키워드 기반 템플릿 검색 기능  
- **즉시 복사**: 원클릭 클립보드 복사
- **작성 페이지 연동**: 템플릿 선택 시 즉시 작성 페이지로 이동

#### 4.4 히스토리 관리 (HistoryPage)
- **이메일 기록 저장**: 검토 및 작성 기록 자동 저장
- **날짜별 필터링**: 특정 기간의 이메일 기록 조회
- **재사용 기능**: 과거 이메일을 기반으로 새 이메일 작성

#### 4.5 사용자 설정 (SettingsPage)
- **개인화 설정**: 기본 톤, 분석 레벨, 자동 수정 여부
- **알림 설정**: 이메일/브라우저 알림, 주간 리포트
- **데이터 관리**: 히스토리 저장 기간, 개인정보 보호 설정

#### 4.6 사용자 인증 시스템
- **회원가입/로그인**: JWT 토큰 기반 인증
- **비밀번호 보안**: bcrypt 해시 처리
- **Private Route**: 인증된 사용자만 접근 가능

### 🔄 개발 중인 기능
- OpenAI API 완전 통합
- 실시간 AI 분석 결과
- 고급 감정 분석

---

## 5. 기술 스택 (Tech Stack)

### 🖥️ Frontend
- **Framework**: React 19.1.0
- **Routing**: React Router DOM 7.7.0  
- **UI Library**: Material-UI 7.2.0 + Lucide React (아이콘)
- **HTTP Client**: Axios 1.11.0
- **Build Tool**: Create React App + React App Rewired

### ⚙️ Backend  
- **Runtime**: Node.js
- **Framework**: Express.js 5.1.0
- **Database**: MongoDB + Mongoose 8.16.4
- **Authentication**: JSON Web Token 9.0.2 + bcryptjs 3.0.2
- **AI Integration**: OpenAI API 5.10.2
- **Security**: CORS 2.8.5, dotenv 17.2.0

### 📊 Database Schema
```javascript
// User Model
{
  email: String (unique),
  password: String (hashed),
  name: String,
  department: String,
  settings: {
    defaultTone: String,
    emailNotifications: Boolean,
    analysisLevel: String,
    autoCorrection: Boolean,
    saveHistory: Boolean
  }
}

// Review Model  
{
  user: ObjectId (User ref),
  emailContent: String,
  result: {
    overallScore: Number,
    emotionScore: String,
    misunderstandingRisk: String,
    suggestions: Array,
    improvedVersion: String
  }
}

// History Model
{
  user: ObjectId (User ref),
  type: String (review/manual),
  title: String,
  content: String,
  recipient: String,
  status: String (sent/draft)
}
```

### 🔌 External APIs
- **OpenAI GPT API**: 이메일 분석 및 개선 제안
- **향후 계획**: Google Gmail API, Microsoft Outlook API

---

## 6. 사용자 여정 (User Journey)

### 🚀 신규 사용자 온보딩
1. **회원가입** → 이메일 인증 → **로그인**
2. **대시보드 진입** → 기능 소개 팝업
3. **첫 메일 검토** → AI 분석 체험
4. **답장 템플릿 탐색** → 즉시 활용 가능
5. **설정 개인화** → 선호하는 톤 및 분석 레벨 설정

### 📧 일반적인 사용 플로우
1. **메일 검토 시나리오**
   - 작성한 이메일 복사 → 검토 페이지 접속
   - 내용 붙여넣기 → AI 분석 요청
   - 결과 확인 → 개선사항 적용 → 실제 발송

2. **답장 작성 시나리오**  
   - 받은 메일 확인 → 답장 메뉴얼 탐색
   - 적절한 템플릿 선택 → 작성 페이지로 이동
   - 개인화 수정 → AI 검토 → 발송

3. **히스토리 활용 시나리오**
   - 과거 이메일 검색 → 유사한 상황의 메일 발견
   - 재사용/수정 → 새로운 상황에 맞게 조정

---

## 7. 기능 명세 (Feature Specifications)

### 📨 메일 검토 기능 상세

#### 입력 요구사항
- **최소 길이**: 50자 이상
- **최대 길이**: 10,000자 이하
- **지원 언어**: 한국어 (향후 영어 추가)

#### 분석 항목
- **전체 점수**: 0-100점 스케일
- **오해도 위험**: Low/Medium/High
- **감정 톤**: Positive/Neutral/Negative
- **개선 제안**: 구체적인 문제점 및 해결책

#### 출력 형태
```json
{
  "overallScore": 85,
  "emotionScore": "neutral",
  "misunderstandingRisk": "low",
  "suggestions": [
    {
      "type": "warning|info",
      "text": "문제가 되는 표현",
      "suggestion": "개선 방향"
    }
  ],
  "improvedVersion": "AI가 개선한 완전한 이메일"
}
```

### 📝 답장 메뉴얼 기능 상세

#### 템플릿 카테고리
- **사과 (Apology)**: 지연 사과, 실수 사과, 불편 사과
- **요청 (Request)**: 자료 요청, 협조 요청, 일정 요청
- **답변 (Response)**: 정보 제공, 피드백 응답, 확인 응답
- **회의 (Meeting)**: 일정 조율, 회의록, 후속 조치

#### 템플릿 구조
```javascript
{
  category: String,
  title: String,
  situation: String,  // 사용 상황 설명
  content: String,    // 실제 템플릿 내용
  variables: Array    // 사용자 입력 필요 부분 [선택사항]
}
```

### 🔍 검색 및 필터링
- **카테고리 필터**: 전체/사과/요청/답변/회의
- **키워드 검색**: 제목 및 내용 기반 실시간 검색
- **사용 빈도순 정렬**: 인기 템플릿 우선 표시

---

## 8. 데이터 모델 (Data Models)

### 👤 User Model
```javascript
const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt 해시
  name: { type: String },
  department: { type: String },
  settings: {
    defaultTone: { type: String, default: 'polite' },
    emailNotifications: { type: Boolean, default: true },
    browserNotifications: { type: Boolean, default: false },
    weeklyReport: { type: Boolean, default: true },
    analysisLevel: { type: String, default: 'detailed' },
    autoCorrection: { type: Boolean, default: true },
    saveHistory: { type: Boolean, default: true },
    dataRetention: { type: String, default: '30' } // 일 단위
  },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date }
}
```

### 📊 Review Model
```javascript
const reviewSchema = {
  user: { type: ObjectId, ref: 'User', required: true },
  emailContent: { type: String, required: true },
  result: {
    overallScore: Number,        // 0-100
    emotionScore: String,        // positive/neutral/negative
    misunderstandingRisk: String, // low/medium/high
    suggestions: [Object],       // 구체적 개선 제안
    improvedVersion: String      // AI 개선 버전
  },
  aiModel: { type: String, default: 'gpt-3.5-turbo' },
  processingTime: Number,        // ms 단위
  createdAt: { type: Date, default: Date.now }
}
```

### 📜 History Model
```javascript
const historySchema = {
  user: { type: ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['review', 'manual'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  recipient: { type: String },
  date: { type: Date, default: Date.now },
  score: { type: Number },              // 검토 점수 (review 타입인 경우)
  status: { type: String, enum: ['sent', 'draft'], default: 'sent' },
  template: { type: String },           // 사용된 템플릿 ID
  tags: [String],                       // 사용자 정의 태그
  metadata: {
    wordCount: Number,
    processingTime: Number,
    aiModel: String
  }
}
```

### 📋 ReplyGuide Model
```javascript
const replyGuideSchema = {
  category: { type: String, required: true },
  title: { type: String, required: true },
  situation: { type: String },
  content: { type: String, required: true },
  tags: [String],
  usageCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

---

## 9. UI/UX 요구사항 (UI/UX Requirements)

### 🎨 디자인 시스템

#### 컬러 팔레트
- **Primary**: #1976d2 (파란색) - 주요 버튼, 링크
- **Secondary**: #757575 (회색) - 보조 텍스트, 비활성 요소
- **Success**: #4caf50 (초록색) - 성공 메시지, 완료 상태
- **Warning**: #ff9800 (주황색) - 경고, 주의사항
- **Error**: #f44336 (빨간색) - 오류, 위험 상황

#### 타이포그래피
- **헤딩**: 16px-24px, 폰트 굵기 500-700
- **본문**: 14px, 폰트 굵기 400
- **캡션**: 12px, 폰트 굵기 400, 색상 #666

### 📱 반응형 디자인
- **Desktop**: 1200px 이상 - 사이드바 + 메인 컨텐츠
- **Tablet**: 768px-1199px - 축소된 사이드바
- **Mobile**: 767px 이하 - 햄버거 메뉴로 전환

### 🔄 인터랙션 디자인
- **로딩 상태**: 스켈레톤 UI + 스피너
- **성공/실패 피드백**: 토스트 메시지
- **폼 검증**: 실시간 유효성 검사
- **버튼 상태**: Hover, Active, Disabled 스타일 구분

### ♿ 접근성 (Accessibility)
- **키보드 내비게이션**: Tab 순서 최적화
- **스크린 리더**: ARIA 라벨 제공
- **색상 대비**: WCAG 2.1 AA 기준 준수
- **포커스 표시**: 명확한 포커스 아웃라인

---

## 10. 성능 및 제약사항 (Performance & Constraints)

### ⚡ 성능 요구사항
- **페이지 로딩**: 3초 이내 First Contentful Paint
- **AI 응답 시간**: 평균 5초, 최대 10초
- **검색 응답**: 1초 이내 결과 표시
- **동시 사용자**: 초기 100명, 확장 가능 구조

### 📊 API 제약사항
- **OpenAI API**: 
  - 일일 요청 한도: 무료 사용자 10회, 유료 사용자 100회
  - 토큰 제한: 요청당 최대 4,000 토큰
  - 응답 시간: 평균 3-8초

### 💾 데이터 제약사항
- **이메일 저장**: 개인정보 보호를 위해 30일 후 자동 삭제
- **히스토리 제한**: 사용자당 최대 1,000개 기록
- **첨부파일**: 현재 버전에서는 미지원

### 🔒 보안 제약사항
- **세션 관리**: JWT 토큰 24시간 유효
- **API 보안**: 서버 측 API 키 관리, 클라이언트 노출 금지
- **입력 검증**: XSS, SQL Injection 방어

---

## 11. 보안 및 개인정보 보호 (Security & Privacy)

### 🔐 인증 및 권한관리
- **JWT 토큰**: 24시간 만료, Refresh Token 7일
- **비밀번호**: bcrypt 해시 + Salt (rounds: 12)
- **세션 무효화**: 로그아웃 시 토큰 무효화

### 🛡️ 데이터 보호
- **전송 암호화**: HTTPS 강제 적용
- **저장 암호화**: MongoDB 필드 레벨 암호화
- **API 키 보안**: 환경변수 분리, 클라이언트 접근 차단

### 📋 개인정보 처리방침
- **수집 정보**: 이메일, 이름, 부서 (선택)
- **이메일 내용**: 사용자 동의 하에만 저장, 30일 후 자동 삭제
- **사용 목적**: 서비스 제공, AI 분석, 사용성 개선
- **제3자 제공**: OpenAI API만 이용, 기타 제3자 제공 없음

### 🚫 개인정보 보호 조치
- **익명화**: 로그 데이터에서 개인 식별 정보 제거
- **접근 제어**: 사용자 본인만 자신의 데이터 접근 가능
- **삭제 권리**: 사용자 요청 시 즉시 데이터 삭제
- **데이터 최소화**: 서비스 제공에 필요한 최소한의 정보만 수집

---

## 12. 개발 우선순위 (Development Priorities)

### 🥇 Phase 1: MVP 완성 (완료)
- ✅ 기본 사용자 인증 시스템
- ✅ 메일 검토 UI/UX 구현
- ✅ 답장 템플릿 시스템
- ✅ 히스토리 관리 기능
- ✅ 기본 설정 페이지

### 🥈 Phase 2: AI 통합 (진행 중)
- 🔄 OpenAI API 완전 통합
- 🔄 실시간 AI 분석 구현
- ⏳ 에러 핸들링 개선
- ⏳ 성능 최적화

### 🥉 Phase 3: 사용성 개선 (예정)
- ⏳ 모바일 반응형 최적화
- ⏳ 검색 기능 고도화
- ⏳ 템플릿 개인화 기능
- ⏳ 사용 통계 대시보드

### 🏆 Phase 4: 고급 기능 (향후)
- ⏳ 감정 분석 고도화
- ⏳ 다국어 지원 (영어)
- ⏳ 팀 협업 기능
- ⏳ 외부 이메일 클라이언트 연동

---

## 13. 향후 계획 (Future Roadmap)

### 🚀 단기 계획 (1-3개월)
1. **AI 성능 개선**
   - GPT-4 모델 도입 검토
   - 한국어 특화 프롬프트 최적화
   - 응답 시간 단축 (평균 3초 목표)

2. **사용자 경험 개선**
   - 온보딩 플로우 개선
   - 튜토리얼 및 도움말 강화
   - 피드백 수집 시스템 구축

### 📈 중기 계획 (3-6개월)
1. **기능 확장**
   - 이메일 자동 분류 기능
   - 첨부파일 처리 지원
   - 일정 관리 연동 (캘린더)

2. **비즈니스 모델**
   - 프리미엄 구독 모델 도입
   - API 사용량 기반 과금 체계
   - 기업용 팀 플랜 출시

### 🎯 장기 계획 (6개월-1년)
1. **플랫폼 확장**
   - Gmail/Outlook 플러그인 개발
   - 모바일 앱 출시 (iOS/Android)
   - Slack/Teams 연동

2. **AI 고도화**
   - 개인화된 AI 학습 모델
   - 실시간 톤 조절 기능
   - 회사별 커뮤니케이션 스타일 학습

3. **글로벌 진출**
   - 영어/일본어 버전 출시
   - 해외 시장 진출
   - 현지화 파트너십 구축

---

## 📊 성공 지표 (Success Metrics)

### 👥 사용자 지표
- **월 활성 사용자(MAU)**: 초기 500명 → 6개월 5,000명
- **일 활성 사용자(DAU)**: MAU의 30% 유지
- **사용자 유지율**: 1개월 70%, 3개월 50%

### 📈 제품 지표
- **기능 사용률**: 메일 검토 80%, 답장 메뉴얼 60%
- **AI 분석 정확도**: 사용자 만족도 80% 이상
- **응답 시간**: 평균 5초 이내 달성

### 💰 비즈니스 지표
- **전환율**: 무료 → 유료 10%
- **월 반복 수익(MRR)**: 6개월 내 $1,000 달성
- **고객 생애 가치(LTV)**: $50 이상

---

## 📞 연락처 및 협업

### 👨‍💻 개발팀 구성
- **프론트엔드**: React.js + Material-UI
- **백엔드**: Node.js + Express + MongoDB
- **AI/ML**: OpenAI API 통합 및 최적화
- **DevOps**: AWS/클라우드 인프라 관리

### 📧 문의 및 피드백
- **제품 피드백**: 앱 내 피드백 기능 또는 이메일
- **기술 지원**: 도움말 페이지 및 FAQ
- **비즈니스 문의**: 별도 연락처 제공

---

> **마지막 업데이트**: 2025년 1월  
> **문서 버전**: v1.0  
> **다음 검토 예정**: 2025년 2월
