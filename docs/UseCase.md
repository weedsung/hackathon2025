# 📘 Use Case Document – 이메일 커뮤니케이션 검토 및 답장 가이드 AI 웹서비스

---

## 📑 목차

1. [액터 정의 (Actor Definitions)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
2. [사용 시나리오 개요 (Use Case Scenarios)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
3. [주요 단계 및 흐름 (Main Steps and Flow of Events)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
4. [예외 흐름 및 엣지 케이스 (Alternative Flows and Edge Cases)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
5. [전제 조건 / 사후 조건 (Preconditions and Postconditions)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
6. [비즈니스 규칙 및 제약사항 (Business Rules and Constraints)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
7. [예외 처리 절차 (Exception Handling Procedures)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
8. [사용자 인터페이스 고려사항 (User Interface Considerations)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
9. [데이터 요구사항 및 흐름 (Data Requirements and Data Flow)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)
10. [보안 및 개인정보 보호 고려사항 (Security and Privacy Considerations)](https://www.notion.so/2370d239490080d88c96f76f6b6bca43?pvs=21)

---

## 1. 🧑‍💼 액터 정의 (Actor Definitions)

| 액터명 | 설명 |
| --- | --- |
| 일반 사용자 | 이메일 커뮤니케이션을 AI로 검토하거나 가이드를 받고자 하는 직장인 |
| 관리자 (향후 도입) | 사용자 로그/요청 관리, 기능 테스트 및 통계 분석 |

---

## 2. 📚 사용 시나리오 개요 (Use Case Scenarios)

### UC-01: 메일 내용 검토
- 사용자는 작성한 이메일을 붙여넣고 AI에게 오해 소지를 검토받는다.

### UC-02: 답장 메뉴얼 생성
- 받은 메일 내용에 대해 상황에 적합한 답장 템플릿을 추천받는다.

### UC-03: 과거 이메일 대화 기반 질문
- 이전에 주고받은 메일 내용을 기반으로 후속 질문을 한다.

---

## 3. 🧭 주요 단계 및 흐름 (Main Steps and Flow of Events)

### UC-01: 메일 내용 검토
1. 사용자가 로그인한다.
2. 사이드바에서 '메일 검토' 선택.
3. 이메일 내용을 입력하거나 붙여넣는다.
4. '검토 요청' 클릭 → GPT/Gemini API 호출.
5. 결과: 오해 소지 문장, 감정 분석, 대체 표현 추천.
6. 사용자는 결과를 확인하고 필요 시 수정함.

---

## 4. 🔁 예외 흐름 및 엣지 케이스 (Alternative Flows and Edge Cases)

| 예외 상황 | 대처 흐름 |
| --- | --- |
| 입력값 없음 | "메일 내용을 입력해주세요" 경고 표시 |
| 너무 짧은 입력 | "메일 내용이 너무 짧습니다. 최소 50자 이상 입력해주세요." |
| API 응답 지연 | 로딩 애니메이션 + "답변 생성 중입니다…" |
| API 에러 발생 | 사용자에게 에러 메시지 표시: "AI 응답을 받지 못했습니다. 다시 시도해주세요." |
| 히스토리 없음 | "기록된 대화가 없습니다. 먼저 메일 검토를 진행해보세요." |

---

## 5. 🧷 전제 조건 / 사후 조건 (Preconditions and Postconditions)

### 전제 조건
- 사용자는 로그인 상태여야 함
- GPT/Gemini API 키 활성화되어 있어야 함
- 입력된 메일 내용이 유효한 텍스트여야 함

### 사후 조건
- 분석 결과가 저장되고, 히스토리에 기록됨
- 사용자는 분석 결과를 보고 판단할 수 있음

---

## 6. 🧾 비즈니스 규칙 및 제약사항 (Business Rules and Constraints)

| 규칙 | 설명 |
| --- | --- |
| 로그인 필수 | 모든 기능은 인증 후 접근 가능 |
| 하루 API 호출 수 제한 | 일일 무료 사용자 기준 예: 10회 |
| AI 응답 시간 제한 | 10초 초과 시 로딩 실패 처리 |
| 이메일 저장 기간 | 개인정보 보호법에 따라 30일 후 자동 삭제 (옵션 제공) |

---

## 7. ❗ 예외 처리 절차 (Exception Handling Procedures)

| 예외 유형 | 처리 방법 |
| --- | --- |
| API Timeout | 사용자에게 로딩 실패 안내 → 재시도 버튼 제공 |
| 서버 다운 | 서비스 상태 페이지 연결 또는 "일시적으로 사용이 어렵습니다" 메시지 표시 |
| 잘못된 요청 | 프론트엔드에서 유효성 검증 → 서버로 오류 요청 방지 |
| 인증 만료 | 로그인 재요청 및 세션 재설정 |

---

## 8. 🖥 사용자 인터페이스 고려사항 (User Interface Considerations)

- **반응형 UI**: 모바일 및 데스크톱 모두 최적화
- **사이드바 내비게이션**: 직관적인 메뉴 이동 가능
- **폼 UX**: 붙여넣기 편의성 / 자동 줄바꿈 지원
- **결과 UI**: 강조 표시 (오해 문장 → 빨간색 하이라이트)
- **접근성 고려**: Tab 이동, ARIA 라벨 제공, 색맹 모드 대응

---

## 9. 📊 데이터 요구사항 및 흐름 (Data Requirements and Data Flow)

### 데이터 입력
- 이메일 텍스트 (사용자 입력)
- 선택된 톤 (예: 공손하게, 간단히 등)

### 데이터 처리
- GPT 또는 Gemini API에 입력 전달
- 응답 결과: 오해 지점, 분석 요약, 답장 예시

### 데이터 출력
- 수정 추천 문장
- 점수화된 커뮤니케이션 진단표
- AI 생성 답장 템플릿

### 데이터 흐름 예시
사용자 입력 → Node.js 서버 → GPT API 호출 → 결과 수신 → React UI에 출력 → DB에 저장

---

## 🔐 보안 및 개인정보 보호 고려사항 (Security and Privacy Considerations)

| 항목 | 설명 |
| --- | --- |
| 인증 | Firebase Auth 또는 OAuth 기반 로그인 필수 |
| 데이터 저장 | Supabase/PostgreSQL 사용 시 암호화된 저장소 사용 |
| 개인정보 보호 | 이메일 내용은 사용자가 명시한 경우에만 저장 (기본은 비저장 옵션) |
| API 보안 | API Key는 서버 측에서만 보관, 클라이언트에 노출 금지 |
| 접근 제어 | 인증되지 않은 접근 시 리다이렉트 처리 (/login) |
| 데이터 삭제 | 사용자가 원하면 즉시 삭제 요청 가능, 자동 30일 삭제 시스템 도입 예정 |

---

> ⚠️ 본 문서는 MVP(최소 기능 제품) 기준으로 작성되었으며, 추후 기업 고객용 SaaS 모델을 고려해 로깅, 권한 관리 등 확장될 수 있습니다. 