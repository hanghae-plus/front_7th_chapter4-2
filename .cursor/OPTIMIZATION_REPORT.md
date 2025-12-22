# 성능 최적화 명세서

> 이 문서는 성능 최적화 작업 내역을 기록합니다.
> 각 최적화 항목에 대해 Before/After를 명확히 기록합니다.

---

## 📊 최적화 요약

| 분류 | 항목 | 상태 | 개선 효과 |
|------|------|------|----------|
| 🌐 네트워크 | Promise.all 병렬 호출 | ✅ 완료 | 순차→병렬 실행 |
| 🌐 네트워크 | 중복 API 호출 제거 | ✅ 완료 | 6회→2회 |
| ⚡ JS 성능 | useMemo (filteredLectures) | ✅ 완료 | 의존성 변경 시에만 재계산 |
| ⚡ JS 성능 | useMemo (allMajors) | ✅ 완료 | lectures 변경 시에만 재계산 |
| ⚡ JS 성능 | useMemo (colorMap) | ✅ 완료 | schedules 변경 시에만 재계산 |
| 🎨 렌더링 | React.memo (DraggableSchedule) | ✅ 완료 | props 변경 시에만 리렌더링 |
| 🎨 렌더링 | React.memo (ScheduleTable) | ✅ 완료 | props 변경 시에만 리렌더링 |
| 🎨 렌더링 | useCallback (handleDragEnd) | ✅ 완료 | 함수 참조 안정화 |
| 🎨 렌더링 | useCallback (ScheduleTables 콜백) | ✅ 완료 | 함수 참조 안정화 |
| 🎨 렌더링 | useCallback (SearchDialog 콜백) | ✅ 완료 | 함수 참조 안정화 |
| 🎨 렌더링 | 원본 참조 유지 (드롭 시) | ✅ 완료 | 변경 안 된 스케줄 원본 유지 |
| 📦 번들 | SearchDialog 지연 로딩 (lazy) | ✅ 완료 | 초기 번들 크기 감소 |

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

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 매 렌더마다 필터링 연산 실행
const getFilteredLectures = () => {
  const { query = '', credits, grades, days, times, majors } = searchOptions;
  return lectures
    .filter(lecture => ...)
    .filter(lecture => ...)
    // ... 여러 filter 체이닝
};

const filteredLectures = getFilteredLectures(); // 매번 호출
```

#### After
```typescript
// ✅ useMemo로 의존성이 변경될 때만 재계산
const filteredLectures = useMemo(() => {
  const { query = '', credits, grades, days, times, majors } = searchOptions;
  return lectures
    .filter(lecture => ...)
    .filter(lecture => ...)
    // ... 여러 filter 체이닝
}, [lectures, searchOptions]);
```

#### 개선 효과
- 불필요한 필터링 연산 방지
- 의존성: `[lectures, searchOptions]`
- `page` 변경 시 재계산 안 함 (이전에는 매번 실행)

---

### 4. useMemo - allMajors

**파일**: `src/SearchDialog.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 매 렌더마다 Set 연산 실행
const allMajors = [...new Set(lectures.map(lecture => lecture.major))];
```

#### After
```typescript
// ✅ useMemo로 lectures가 변경될 때만 재계산
const allMajors = useMemo(() => 
  [...new Set(lectures.map(lecture => lecture.major))],
  [lectures]
);
```

#### 개선 효과
- 불필요한 Set 연산 방지
- 의존성: `[lectures]`
- searchOptions, page 변경 시 재계산 안 함

---

## 🎨 렌더링 성능 최적화

### 5. React.memo - DraggableSchedule

**파일**: `src/ScheduleTable.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 부모가 리렌더링되면 항상 리렌더링
const DraggableSchedule = ({ id, data, bg, onDeleteButtonClick }) => {
  // ...
}
```

#### After
```typescript
// ✅ React.memo로 props가 변경될 때만 리렌더링
const DraggableSchedule = memo(({ id, data, bg, onDeleteButtonClick }) => {
  // ...
})
```

#### 개선 효과
- 드래그 중 다른 스케줄 블록 리렌더링 방지
- props가 변경된 컴포넌트만 리렌더링

---

### 6. useCallback - handleDragEnd

**파일**: `src/ScheduleDndProvider.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 매 렌더마다 새 함수 생성
const handleDragEnd = (event: any) => {
  // schedulesMap을 직접 참조
  setSchedulesMap({
    ...schedulesMap,
    // ...
  })
};
```

#### After
```typescript
// ✅ useCallback + 함수형 업데이트로 의존성 최소화
const handleDragEnd = useCallback((event: any) => {
  setSchedulesMap(prev => {
    // prev를 사용하여 schedulesMap 의존성 제거
    // ...
  });
}, [setSchedulesMap]); // 안정적인 의존성만 사용
```

#### 개선 효과
- 함수 참조 안정화
- 의존성: `[setSchedulesMap]` (Context의 setter는 안정적)

---

### 7. 원본 참조 유지 (드롭 시)

**파일**: `src/ScheduleDndProvider.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 변경 안 된 스케줄도 새 객체로 복사
schedulesMap[tableId].map((targetSchedule, targetIndex) => {
  if (targetIndex !== Number(index)) {
    return { ...targetSchedule } // 불필요한 복사!
  }
  // ...
})
```

#### After
```typescript
// ✅ 변경 안 된 스케줄은 원본 참조 유지
prev[tableId].map((targetSchedule, targetIndex) => {
  if (targetIndex !== Number(index)) {
    return targetSchedule; // 원본 반환!
  }
  // ...
})

// ✅ 이동 없으면 원본 state 반환
if (moveDayIndex === 0 && moveTimeIndex === 0) {
  return prev;
}
```

#### 개선 효과
- 변경되지 않은 스케줄 객체 재사용
- React.memo와 함께 사용 시 불필요한 리렌더링 방지
- 이동 없으면 state 변경 안 함

---

## 🎨 추가 렌더링 최적화 (과제 범위 외)

### 8. React.memo - ScheduleTable + useMemo - colorMap

**파일**: `src/ScheduleTable.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 부모가 리렌더링되면 항상 리렌더링
const ScheduleTable = ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
  // ❌ 매 렌더마다 Set 연산 수행
  const getColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return colors[lectures.indexOf(lectureId) % colors.length];
  };
  // ...
};
```

#### After
```typescript
// ✅ React.memo로 props 변경 시에만 리렌더링
const ScheduleTable = memo(({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
  // ✅ useMemo로 schedules 변경 시에만 colorMap 재생성
  const colorMap = useMemo(() => {
    const lectureIds = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    return Object.fromEntries(
      lectureIds.map((id, index) => [id, colors[index % colors.length]])
    );
  }, [schedules]);
  // ...
});
```

#### 개선 효과
- ScheduleTable: props 동일하면 리렌더링 스킵
- colorMap: O(n) Set 연산을 schedules 변경 시에만 수행
- 드래그 중 다른 테이블 리렌더링 방지

---

### 9. useCallback - ScheduleTables 콜백

**파일**: `src/ScheduleTables.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 매 렌더마다 새 함수 생성
const duplicate = (targetId: string) => { ... };
const remove = (targetId: string) => { ... };

// ❌ 인라인 콜백 - 매 렌더마다 새 함수
<ScheduleTable
  onScheduleTimeClick={(timeInfo) => setSearchInfo({ tableId, ...timeInfo })}
  onDeleteButtonClick={({ day, time }) => setSchedulesMap(...)}
/>
```

#### After
```typescript
// ✅ useCallback으로 함수 참조 안정화
const duplicate = useCallback((targetId: string) => { ... }, [setSchedulesMap]);
const remove = useCallback((targetId: string) => { ... }, [setSchedulesMap]);
const handleScheduleTimeClick = useCallback((tableId, timeInfo) => { ... }, []);
const handleDeleteButtonClick = useCallback((tableId, day, time) => { ... }, [setSchedulesMap]);

<ScheduleTable
  onScheduleTimeClick={(timeInfo) => handleScheduleTimeClick(tableId, timeInfo)}
  onDeleteButtonClick={({ day, time }) => handleDeleteButtonClick(tableId, day, time)}
/>
```

#### 개선 효과
- 콜백 함수 참조 안정화
- ScheduleTable memo와 함께 사용 시 리렌더링 방지

---

### 10. useCallback - SearchDialog 콜백

**파일**: `src/SearchDialog.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 매 렌더마다 새 함수 생성
const changeSearchOption = (field, value) => {
  setPage(1);
  setSearchOptions(({ ...searchOptions, [field]: value })); // 이전 state 직접 참조
  loaderWrapperRef.current?.scrollTo(0, 0);
};

const addSchedule = (lecture) => { ... };
```

#### After
```typescript
// ✅ useCallback + 함수형 업데이트
const changeSearchOption = useCallback((field, value) => {
  setPage(1);
  setSearchOptions(prev => ({ ...prev, [field]: value })); // 함수형 업데이트
  loaderWrapperRef.current?.scrollTo(0, 0);
}, []);

const addSchedule = useCallback((lecture) => { ... }, [searchInfo, setSchedulesMap, onClose]);
```

#### 개선 효과
- 콜백 함수 참조 안정화
- changeSearchOption: 의존성 최소화 (빈 배열)
- 함수형 업데이트로 최신 state 보장

---

### 11. SearchDialog 지연 로딩 (lazy)

**파일**: `src/ScheduleTables.tsx`

**상태**: ✅ 완료

#### Before
```typescript
// ❌ 초기 로드 시 SearchDialog도 함께 로드
import SearchDialog from "./SearchDialog.tsx";
```

#### After
```typescript
// ✅ 지연 로딩으로 초기 번들 크기 감소
const SearchDialog = lazy(() => import("./SearchDialog.tsx"));

// Suspense로 감싸기
<Suspense fallback={null}>
  <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
</Suspense>
```

#### 개선 효과
- 초기 번들 크기 감소
- SearchDialog는 필요할 때만 로드
- 첫 페이지 로드 시간 개선

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
| 2024-12-22 | ⚡ useMemo 최적화 완료 (filteredLectures, allMajors) | AI |
| 2024-12-22 | 🎨 렌더링 최적화 완료 (React.memo, useCallback, 원본 참조 유지) | AI |
| 2024-12-22 | 🎨 추가 최적화: ScheduleTable memo + colorMap useMemo | AI |
| 2024-12-22 | 🎨 추가 최적화: ScheduleTables 콜백 useCallback | AI |
| 2024-12-22 | 🎨 추가 최적화: SearchDialog 콜백 useCallback | AI |
| 2024-12-22 | 📦 추가 최적화: SearchDialog 지연 로딩 (lazy) | AI |


