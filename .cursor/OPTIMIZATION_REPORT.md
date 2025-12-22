# 성능 최적화 명세서

> 이 문서는 성능 최적화 작업 내역을 기록합니다.
> 각 최적화 항목에 대해 Before/After를 명확히 기록합니다.

---

## 📊 최적화 요약

| 분류 | 항목 | 상태 | 개선 효과 |
|------|------|------|----------|
| 🌐 네트워크 | Promise.all 병렬 호출 | ✅ 완료 | 순차→병렬 실행 |
| 🌐 네트워크 | 중복 API 호출 제거 | ✅ 완료 | 6회→2회 |
| ⚡ JS 성능 | useMemo (filteredLectures) | ⬜ 미완료 | - |
| ⚡ JS 성능 | useMemo (allMajors) | ⬜ 미완료 | - |
| 🎨 렌더링 | React.memo (DraggableSchedule) | ⬜ 미완료 | - |
| 🎨 렌더링 | useCallback (handleDragEnd) | ⬜ 미완료 | - |
| 🎨 렌더링 | 원본 참조 유지 (드롭 시) | ⬜ 미완료 | - |

---

## 🌐 네트워크 성능 최적화

### 1. Promise.all 병렬 호출 + 2. 중복 API 호출 제거

**파일**: `src/SearchDialog.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 문제점 1: await가 Promise.all 내부에 있어서 순차 실행됨
// ❌ 문제점 2: 동일한 API를 6번 중복 호출 (majors 3번, liberalArts 3번)
const fetchAllLectures = async () => await Promise.all([
  (console.log('API Call 1', performance.now()), await fetchMajors()),
  (console.log('API Call 2', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 3', performance.now()), await fetchMajors()),
  (console.log('API Call 4', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 5', performance.now()), await fetchMajors()),
  (console.log('API Call 6', performance.now()), await fetchLiberalArts()),
]);
```

#### After
```typescript
// ✅ 최적화 완료: Promise.all 병렬 호출 + 중복 API 호출 제거
const fetchAllLectures = async () => {
  console.log('API Call 시작 (병렬)', performance.now());
  const results = await Promise.all([
    fetchMajors(),      // 1번만 호출
    fetchLiberalArts(), // 1번만 호출
  ]);
  console.log('API Call 완료 (병렬)', performance.now());
  return results;
};
```

#### 개선 효과
- **실행 방식**: 순차 실행 → 병렬 실행
- **API 호출 횟수**: 6회 → 2회 (66% 감소)
- **예상 시간 개선**: 약 3~6배 빨라짐 (병렬 + 중복 제거)

---

## ⚡ 자바스크립트 성능 최적화

### 3. useMemo - filteredLectures

**파일**: `src/SearchDialog.tsx`

**상태**: ⬜ 미완료

#### Before
```typescript
// 코드 작성 예정
```

#### After
```typescript
// 코드 작성 예정
```

#### 개선 효과
- 불필요한 필터링 연산 방지
- 의존성: `[lectures, searchOptions]`

---

### 4. useMemo - allMajors

**파일**: `src/SearchDialog.tsx`

**상태**: ⬜ 미완료

#### Before
```typescript
// 코드 작성 예정
```

#### After
```typescript
// 코드 작성 예정
```

#### 개선 효과
- 불필요한 Set 연산 방지
- 의존성: `[lectures]`

---

## 🎨 렌더링 성능 최적화

### 5. React.memo - DraggableSchedule

**파일**: `src/ScheduleTable.tsx`

**상태**: ⬜ 미완료

#### Before
```typescript
// 코드 작성 예정
```

#### After
```typescript
// 코드 작성 예정
```

#### 개선 효과
- 드래그 중 불필요한 리렌더링 방지
- React DevTools Profiler 결과: `???`

---

### 6. useCallback - handleDragEnd

**파일**: `src/ScheduleDndProvider.tsx`

**상태**: ⬜ 미완료

#### Before
```typescript
// 코드 작성 예정
```

#### After
```typescript
// 코드 작성 예정
```

#### 개선 효과
- 함수 참조 안정화
- 의존성: `[???]`

---

### 7. 원본 참조 유지 (드롭 시)

**파일**: `src/ScheduleDndProvider.tsx`

**상태**: ⬜ 미완료

#### Before
```typescript
// 코드 작성 예정
```

#### After
```typescript
// 코드 작성 예정
```

#### 개선 효과
- 변경되지 않은 스케줄 객체 재사용
- 불필요한 리렌더링 방지

---

## 📈 Lighthouse 측정 결과

### Before (최적화 전)
| 카테고리 | 점수 |
|----------|------|
| Performance | ???% |
| Accessibility | ???% |
| Best Practices | ???% |
| SEO | ???% |

### After (최적화 후)
| 카테고리 | 점수 |
|----------|------|
| Performance | ???% |
| Accessibility | ???% |
| Best Practices | ???% |
| SEO | ???% |

---

## 📝 작업 로그

| 날짜 | 작업 내용 | 담당 |
|------|----------|------|
| 2024-12-22 | 최적화 명세서 생성 | AI |
| 2024-12-22 | 🌐 API 호출 최적화 완료 (Promise.all 병렬 + 중복 제거) | AI |


