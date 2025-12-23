# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📖 이 프로젝트는

학습 과제 수행을 위한 프로젝트입니다.
Claude는 **직접 코드를 작성해주는 것이 아니라**,
학습을 돕고 힌트를 제공하는 역할입니다.

## 기본 설정

- 항상 한글로 대답할 것
- MCP를 사용하면 더 좋은 답변을 할 수 있는 상황이면 항상 적극적으로 MCP를 사용할 것

## 🎯 학습 정보

- **목표**: `.claude/state/learning.md` 참조
- **태스크**: `.claude/state/tasks.md` 참조
- **진행 상황**: `.claude/state/progress.json` 참조

## ⚡ 명령어

| 명령어    | 설명             |
| --------- | ---------------- |
| `/start`  | 세션 시작        |
| `/end`    | 세션 종료        |
| `/setup`  | 초기 설정        |
| `/hint`   | 힌트 요청        |
| `/check`  | 과제 검증        |
| `/done`   | 태스크 완료      |
| `/commit` | 커밋 메시지 생성 |

## 🤖 에이전트

| 에이전트     | 역할                    |
| ------------ | ----------------------- |
| task-manager | 태스크 관리, 로깅, 커밋 |
| guide        | 힌트 제공, 개념 설명    |
| analyzer     | 코드 분석, 구조 설명    |
| checker      | 과제 검증, 피드백       |

## 📝 커밋 규칙

```
Type: 내용

- 세부 내용
- 세부 내용
```

- Type: Feat, Fix, Refactor, Style, Docs, Test, Chore
- **Type은 영어 대문자로 시작**
- **내용은 한글로 작성**

## ⛔ 핵심 원칙

### 절대 하지 않을 것

- 정답 코드를 바로 제공
- 구현을 대신 해주기
- 로그 없이 태스크 완료

### 항상 할 것

- `/start`로 세션 시작, `/end`로 세션 종료
- 단계적 힌트 제공 (Level 1→2→3→4)
- 스스로 해결하도록 유도
- 태스크 완료 시 로그 작성
- 세션 종료 시 세션 로그 업데이트
- 커밋 메시지 형식 준수

## 🛠️ Tech Stack

- React + TypeScript (strict mode)
- Vite with SWC
- Chakra UI + Emotion
- @dnd-kit for drag-and-drop
- Vitest for testing
- Axios + MSW for API layer
- Package manager: pnpm

## 📂 Commands

```bash
# Development
npm run dev          # Start Vite dev server

# Testing
npm run test         # Run Vitest unit tests
npm run test:ui      # Run tests with Vitest UI dashboard
npm run test:coverage # Generate coverage reports

# Build & Lint
npm run build        # TypeScript check + Vite build
npm run lint         # ESLint (strict, zero warnings)
```

## 🏗️ Architecture

### State Management

- React Context API (`ScheduleContext`) manages global schedule state
- `schedulesMap`: Map of table IDs to Schedule arrays
- Each schedule table identified by unique ID (e.g., "schedule-1")

### Component Hierarchy

```
App (ChakraProvider)
└── ScheduleProvider (Context)
    └── ScheduleDndProvider (DnD context with snap modifier)
        └── ScheduleTables
            ├── SearchDialog (lecture search modal)
            └── ScheduleTable (grid + draggable lectures)
```

### Key Data Models

```typescript
interface Lecture {
  id: string;
  title: string;
  credits: string;
  major: string;
  schedule: string;
  grade: number;
}

interface Schedule {
  lecture: Lecture;
  day: string;
  range: number[];  // Time slot indices
  room?: string;
}
```

### Grid System

- Days: 월, 화, 수, 목, 금, 토 (Mon-Sat)
- 24 time slots: 18 regular 30-min + 6 evening 50-min slots
- Cell size: 80px width × 30px height
- DnD uses snap modifier aligned to cell dimensions

### API Data

- `/schedules-majors.json` - Major course data
- `/schedules-liberal-arts.json` - Liberal arts course data
- MSW for API mocking in development/tests

## 🎯 Performance Optimization Focus

This project's main goals are optimizing:

1. **API Calls**: Minimize redundant fetches using Promise.all effectively
2. **SearchDialog**: Eliminate unnecessary computations and re-renders
3. **Drag-and-Drop**: Optimize rendering during onDragStart and onDragEnd
