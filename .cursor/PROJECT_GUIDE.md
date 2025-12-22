# 프로젝트 가이드: React 성능 최적화 심화 과제

## 📋 프로젝트 개요

### 프로젝트 소개
이 프로젝트는 **대학 시간표 관리 웹 애플리케이션**입니다. 사용자는 수업을 검색하고, 시간표에 추가하며, 드래그 앤 드롭으로 시간표 블록을 이동할 수 있습니다.

### 기술 스택
- **React** (최신 버전)
- **TypeScript**
- **Chakra UI** - UI 컴포넌트 라이브러리
- **@dnd-kit** - 드래그 앤 드롭 라이브러리
- **Axios** - HTTP 클라이언트
- **Vite (rolldown-vite)** - 빌드 도구
- **Vitest** - 테스트 프레임워크

---

## 🎯 과제의 목적과 의도

### 이 과제를 통해 배우게 되는 것

1. **Promise.all의 올바른 사용법**
   - 비동기 함수의 병렬 실행 vs 순차 실행의 차이
   - 불필요한 API 중복 호출 제거

2. **React 연산 최적화**
   - `useMemo`를 활용한 비용이 큰 연산의 메모이제이션
   - 매 렌더링마다 발생하는 불필요한 계산 방지

3. **React 리렌더링 최적화**
   - `React.memo`를 활용한 컴포넌트 메모이제이션
   - `useCallback`을 활용한 콜백 함수 메모이제이션
   - Context 분리를 통한 불필요한 리렌더링 방지

4. **드래그 앤 드롭 성능 최적화**
   - 드래그 중/드롭 후 불필요한 리렌더링 최소화
   - 상태 업데이트 최적화

---

## 🔍 현재 코드의 문제점 분석

### 1. API 호출 문제 (SearchDialog.tsx)

**위치**: `src/SearchDialog.tsx` 88-96번째 줄

```typescript
// 현재 문제가 있는 코드
const fetchAllLectures = async () => await Promise.all([
  (console.log('API Call 1', performance.now()), await fetchMajors()),
  (console.log('API Call 2', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 3', performance.now()), await fetchMajors()),
  (console.log('API Call 4', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 5', performance.now()), await fetchMajors()),
  (console.log('API Call 6', performance.now()), await fetchLiberalArts()),
]);
```

**문제점**:
- `Promise.all` 내부에서 `await`를 사용하면 **순차 실행**됨 (병렬 X)
- 동일한 API를 6번 중복 호출 (majors 3번, liberalArts 3번)
- 콘솔을 확인하면 API 호출이 순차적으로 일어남을 확인 가능

**해결 방향**:
- `await` 제거하여 진정한 병렬 호출로 변경
- 중복 호출 제거 (majors 1번, liberalArts 1번만 호출)

---

### 2. 불필요한 연산 (SearchDialog.tsx)

**위치**: `src/SearchDialog.tsx` 114-143번째 줄

```typescript
const getFilteredLectures = () => {
  // 매번 복잡한 필터링 연산 수행
  return lectures.filter(...).filter(...).filter(...)...
}

const filteredLectures = getFilteredLectures(); // 매 렌더마다 호출
const allMajors = [...new Set(lectures.map(lecture => lecture.major))]; // 매 렌더마다 계산
```

**문제점**:
- `getFilteredLectures`가 컴포넌트 렌더링마다 재실행
- `allMajors` 계산이 렌더링마다 반복
- 관련 없는 상태가 변해도 재계산됨

**해결 방향**:
- `useMemo`를 활용하여 의존성이 변경될 때만 재계산
- `filteredLectures`는 `lectures`, `searchOptions`가 변할 때만 재계산
- `allMajors`는 `lectures`가 변할 때만 재계산

---

### 3. 불필요한 리렌더링 (SearchDialog.tsx)

**문제점**:
- 검색 옵션 중 하나만 변경되어도 전체 컴포넌트가 리렌더링
- 필터 체크박스 컴포넌트들이 개별 최적화되지 않음

**해결 방향**:
- 무거운 하위 컴포넌트 분리 및 `React.memo` 적용
- `useCallback`으로 콜백 함수 메모이제이션

---

### 4. 시간표 드래그/드롭 렌더링 문제

**위치**: `src/ScheduleDndProvider.tsx`, `src/ScheduleTable.tsx`

**ScheduleDndProvider.tsx 문제점**:
```typescript
setSchedulesMap({
  ...schedulesMap,
  [tableId]: schedulesMap[tableId].map((targetSchedule, targetIndex) => {
    if (targetIndex !== Number(index)) {
      return { ...targetSchedule } // 불필요한 객체 재생성
    }
    // ...
  })
})
```
- 변경되지 않은 스케줄도 새 객체로 생성 → 불필요한 리렌더링 유발

**ScheduleTable.tsx 문제점**:
- 드래그 중 `dndContext` 변경으로 모든 테이블이 리렌더링
- 각 `DraggableSchedule` 컴포넌트가 메모이제이션되지 않음

**해결 방향**:
- 변경되지 않은 항목은 원본 참조 유지
- `React.memo`로 컴포넌트 메모이제이션
- 드래그 상태 관리 최적화

---

## ✅ 과제 체크리스트

| 항목 | 설명 | 핵심 기술 |
|------|------|----------|
| 배포 후 URL 제출 | GitHub Pages로 배포 | GitHub Actions |
| API 호출 최적화 | Promise.all 올바른 사용, 중복 제거 | Promise.all, 캐싱 |
| SearchDialog 연산 최적화 | 필터링 연산 메모이제이션 | useMemo |
| SearchDialog 리렌더링 최적화 | 컴포넌트/콜백 메모이제이션 | React.memo, useCallback |
| 드래그시 렌더링 최적화 | 드래그 중 불필요한 리렌더링 방지 | React.memo, 상태 분리 |
| 드롭시 렌더링 최적화 | 상태 업데이트 최적화 | 불변성 최적화 |

---

## 📁 프로젝트 구조

```
src/
├── App.tsx                 # 앱 진입점 (Provider 래핑)
├── ScheduleContext.tsx     # 시간표 상태 관리 Context
├── ScheduleDndProvider.tsx # 드래그 앤 드롭 Provider
├── ScheduleTables.tsx      # 시간표 목록 컴포넌트
├── ScheduleTable.tsx       # 개별 시간표 컴포넌트
├── SearchDialog.tsx        # 수업 검색 다이얼로그 (★ 주요 최적화 대상)
├── types.ts                # TypeScript 타입 정의
├── utils.ts                # 유틸리티 함수
├── constants.ts            # 상수 정의
└── dummyScheduleMap.ts     # 더미 데이터
```

---

## 🚀 시작하기

### 개발 서버 실행
```bash
pnpm install
pnpm dev
```

### 테스트 실행
```bash
pnpm test
```

### 빌드
```bash
pnpm build
```

### 로컬에서 Pages 경로 테스트
```bash
BASE_URL=/front_7th_chapter4-2/ pnpm build
pnpm vite preview
```

---

## 📊 성능 측정 방법

### 1. API 호출 시간 확인
브라우저 개발자 도구 콘솔에서 확인:
```
API 호출 시작: [timestamp]
API Call 1 [timestamp]
API Call 2 [timestamp]
...
모든 API 호출 완료 [timestamp]
API 호출에 걸린 시간(ms): [duration]
```

최적화 전: 순차적으로 호출 (느림)
최적화 후: 병렬로 호출 (빠름)

### 2. React DevTools Profiler 사용
- 렌더링 횟수 및 시간 측정
- 불필요한 리렌더링 탐지
- 컴포넌트별 렌더링 원인 분석

### 3. Performance 탭 활용
- 드래그/드롭 시 프레임 드롭 확인
- 메인 스레드 블로킹 측정

---

## 💡 최적화 힌트

### Promise.all 올바른 사용
```typescript
// ❌ 잘못된 사용 (순차 실행)
Promise.all([await fn1(), await fn2()])

// ✅ 올바른 사용 (병렬 실행)
Promise.all([fn1(), fn2()])
```

### useMemo 활용
```typescript
// ❌ 매 렌더마다 계산
const result = expensiveCalculation(data);

// ✅ 의존성이 변할 때만 계산
const result = useMemo(() => expensiveCalculation(data), [data]);
```

### React.memo 활용
```typescript
// ❌ 부모가 렌더링되면 항상 리렌더링
const Child = ({ data }) => { ... };

// ✅ props가 변할 때만 리렌더링
const Child = React.memo(({ data }) => { ... });
```

### useCallback 활용
```typescript
// ❌ 매 렌더마다 새 함수 생성
const handleClick = () => { ... };

// ✅ 의존성이 변할 때만 새 함수 생성
const handleClick = useCallback(() => { ... }, [deps]);
```

---

## 📝 참고 자료

- [React 공식 문서 - 성능 최적화](https://react.dev/learn/render-and-commit)
- [useMemo](https://react.dev/reference/react/useMemo)
- [useCallback](https://react.dev/reference/react/useCallback)
- [React.memo](https://react.dev/reference/react/memo)
- [Promise.all - MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)

