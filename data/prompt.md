# 역할: 시니어 풀스택 웹 개발자 및 게임 개발자

## 목표
Supabase 백엔드 연동 및 Vercel 배포에 최적화된 모던 웹 기반 테트리스(Tetris) 게임 애플리케이션을 제작해 줘.

## 기술 스택
- Frontend: Next.js (App Router) 또는 React + Vite, Tailwind CSS, Lucide-react (아이콘)
- Backend/DB: Supabase (@supabase/supabase-js)
- 배포 대상: Vercel

---

## 1. 게임 핵심 기능 (Core Gameplay)
1. 표준 테트리스 규칙 준수:
   - 7가지 테트로미노(I, J, L, O, S, T, Z) 블록 구현 및 랜덤 생성 (7-bag 시스템 권장)
   - 키보드 조작: 좌/우 이동(←, →), 소프트 드롭(↓), 하드 드롭(Space), 회전(↑ 또는 Z/X), 홀드(C/Shift)
   - 다음 블록(Next) 및 보관 블록(Hold) 미리보기 패널
   - 라인 클리어 판정 및 콤보/점수 계산, 점수에 따른 레벨 상승 및 낙하 속도 증가
2. 모바일 반응형 지원:
   - 데스크톱 키보드 조작 외에 모바일 터치 스크린용 온스크린 가상 컨트롤러(D-pad, 회전, 드롭 버튼) 제공
3. 게임 오버 및 일시정지(Pause) 모달 UI 구현

---

## 2. Supabase 데이터베이스 연동 & 기능 요구사항
브라우저 환경에서 안전하게 연동할 수 있도록 `@supabase/supabase-js` 클라이언트 설정 코드와 함께 아래 요구사항을 구현해 줘.

### A. 리더보드 (게임 기록 저장)
- 게임 종료 시 플레이어 닉네임, 최종 점수, 달성 레벨, 클리어 라인 수를 Supabase에 자동/수동 저장.
- 상위 Top 10 랭킹을 보여주는 실시간 리더보드 탭 또는 모달 제공.

### B. 게임 평가 및 리뷰 (Feedback)
- 사용자가 게임에 대해 별점(1~5점)과 한 줄 평가를 남길 수 있는 평가 섹션/모달 구현.
- 평균 평점 및 최근 등록된 리뷰 목록 표시.

---

## 3. 필요 DB 테이블 DDL 및 환경변수 안내
코드 생성과 함께, 내가 Supabase SQL Editor에 바로 실행할 수 있도록 아래 테이블 생성 DDL 스크립트를 마크다운으로 먼저 제공해 줘:
1. `game_records`: id, player_name, score, level, lines_cleared, created_at
2. `game_reviews`: id, rating (1~5), comment, author_name, created_at

환경변수 예시:
- `NEXT_PUBLIC_SUPABASE_URL` (또는 `VITE_SUPABASE_URL`)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (또는 `VITE_SUPABASE_ANON_KEY`)
- 환경변수가 입력되지 않았을 경우 앱이 깨지지 않고 친절하게 설정 안내를 띄우는 Fallback 처리 포함.

---

## 4. UI/UX 디자인 가이드
- 레트로 아케이드 감성을 살린 네온/다크 테마 (Tailwind CSS 기반).
- 직관적인 점수판, 레벨, 클리어 라인 카운터.
- 게임 영역(Canvas 또는 CSS Grid)과 사이드바(순위표/리뷰)의 깔끔한 그리드 레이아웃 구성.

## 출력 결과
- Supabase SQL 스키마
- 환경변수 설정 파일(`.env.example`)
- 바로 실행 및 빌드(`npm run build`) 가능한 완전한 전체 소스 코드 (생략 없이 작성)