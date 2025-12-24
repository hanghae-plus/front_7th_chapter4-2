# CLAUDE.md

ALWAYS RESPOND IN KOREAN
This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React + TypeScript 성능 최적화 학습 프로젝트. 대학 시간표 제작 서비스로, 드래그앤드롭, 실시간 필터링, 페이지네이션 기능을 포함하며 **의도적인 성능 병목**이 있어 최적화 실습이 목적.

## Commands

```bash
pnpm dev              # 개발 서버 실행
pnpm build            # 타입 체크 + 프로덕션 빌드 (tsc -b && vite build)
pnpm test             # 테스트 실행 (watch 모드)
pnpm test:ui          # Vitest UI 대시보드
pnpm test:coverage    # 커버리지 리포트 생성
pnpm lint             # ESLint 실행 (max-warnings 0)
```

## Architecture

```
src/
├── main.tsx              # 앱 진입점
├── App.tsx               # 루트 컴포넌트 (ChakraProvider, ScheduleProvider, ScheduleDndProvider)
├── ScheduleContext.tsx   # 스케줄 상태 관리 (React Context)
├── ScheduleDndProvider.tsx # @dnd-kit 설정 (그리드 스냅 로직)
├── ScheduleTables.tsx    # 시간표 목록 컨테이너
├── ScheduleTable.tsx     # 개별 시간표 그리드 (드래그 가능한 블록)
├── SearchDialog.tsx      # 검색 모달 ★ 주요 최적화 대상
├── types.ts              # Lecture, Schedule 인터페이스
├── constants.ts          # DAY_LABELS, CellSize 상수
└── utils.ts              # parseSchedule, parseHnM 등 유틸리티

public/
├── schedules-majors.json       # 전공 강의 데이터 (~850KB)
└── schedules-liberal-arts.json # 교양 강의 데이터 (~500KB)
```

## Key Data Types

```typescript
interface Lecture {
  id: string;
  title: string;
  credits: string;
  major: string;
  schedule: string;  // "월1~6(2공521),화1~3(미디어509)" 형식
  grade: number;
}

interface Schedule {
  lecture: Lecture;
  day: string;       // "월", "화", ...
  range: number[];   // [1, 2, 3, 4, 5, 6]
  room?: string;
}
```

## Performance Optimization Targets

PR 템플릿에 명시된 최적화 대상:

1. **API 호출 최적화**: Promise.all 오용 + 중복 호출 (fetchMajors/fetchLiberalArts 각 6회씩 호출됨)
2. **SearchDialog 불필요한 계산**: getFilteredLectures()가 매 렌더링마다 재계산
3. **SearchDialog 불필요한 리렌더링**: 상태 변경 시 전체 컴포넌트 리렌더
4. **드래그 블록 렌더링 최적화**: 드래그 중 성능
5. **드롭 블록 렌더링 최적화**: 드롭 완료 후 성능

## Tech Stack

- **빌드**: Vite (rolldown-vite) + SWC
- **UI**: Chakra UI + Framer Motion
- **드래그앤드롭**: @dnd-kit/core
- **API 모킹**: MSW
- **테스트**: Vitest + Testing Library

## Grid System

- 셀 크기: 80px(너비) × 30px(높이)
- 요일: ["월", "화", "수", "목", "금", "토"]
- 시간: 18개 슬롯(30분) + 6개 슬롯(55분, 야간)

## Deployment

GitHub Actions로 S3 + CloudFront 배포. main 브랜치 푸시 시 자동 배포.
