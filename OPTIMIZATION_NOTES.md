# 성능 최적화 기록

## 1. API 호출 최적화 - 직렬 실행 문제 해결

### 문제점

기존 코드에서 `Promise.all`을 사용했지만 실제로는 직렬 실행(Sequential Execution)이 발생하고 있음

#### 직렬 실행 vs 병렬 실행

**직렬 실행 (Sequential Execution)**
- 작업들이 하나씩 순차적으로 실행됨
- 이전 작업이 완료된 후 다음 작업이 시작됨
- 총 실행 시간 = 각 작업 시간의 합

```
작업1 완료 → 작업2 시작 → 작업2 완료 → 작업3 시작 → ...
```

**병렬 실행 (Parallel Execution)**
- 여러 작업이 동시에 시작되고 실행됨
- 모든 작업이 함께 실행됨
- 총 실행 시간 = 가장 오래 걸리는 작업의 시간

```
작업1 시작 ┐
작업2 시작 ├─ 동시에 실행
작업3 시작 ┘
```

#### 기존 코드의 문제

```typescript
const fetchAllLectures = async () => await Promise.all([
  (console.log('API Call 1', performance.now()), await fetchMajors()),
  (console.log('API Call 2', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 3', performance.now()), await fetchMajors()),
  (console.log('API Call 4', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 5', performance.now()), await fetchMajors()),
  (console.log('API Call 6', performance.now()), await fetchLiberalArts()),
]);
```

**문제점:**
1. `Promise.all` 내부에서 `await`를 사용하여 직렬 실행됨
   - 배열의 각 요소가 평가될 때 `await`로 인해 완료를 기다림
   - 다음 요소는 이전 요소가 완료된 후에 평가됨

2. 실행 순서가 직렬로 진행됨
   ```
   API Call 1 시작 → 완료 (100ms)
     ↓
   API Call 2 시작 → 완료 (100ms)
     ↓
   API Call 3 시작 → 완료 (100ms)
     ...
   ```
   - 총 소요 시간: 약 600ms (100ms × 6개)

3. 콘솔 로그를 확인하면 시간 간격이 발생
   ```
   API Call 1 100.5
   API Call 2 201.2  ← 100ms 후
   API Call 3 301.8  ← 200ms 후
   API Call 4 402.1  ← 300ms 후
   ...
   ```

4. 중복 API 호출 발생 (별도 단계에서 해결 예정)
   - `fetchMajors()`: 3번 호출
   - `fetchLiberalArts()`: 3번 호출
   - *참고: 중복 호출 문제는 다음 단계에서 캐시 메커니즘을 통해 해결할 예정*

### Promise와 Promise.all 이해하기

#### Promise란?

Promise는 JavaScript에서 비동기 작업의 최종 완료(또는 실패)와 그 결과 값을 나타내는 객체입니다.

```typescript
const promise = fetchMajors();
// fetchMajors()는 즉시 Promise 객체를 반환합니다
// 실제 네트워크 요청은 백그라운드에서 실행됩니다
```

**중요한 개념:**
- Promise 객체는 즉시 생성됩니다 (비동기 작업 시작)
- 실제 비동기 작업(네트워크 요청 등)은 백그라운드에서 실행됩니다
- Promise 객체를 받은 후에도 다른 코드를 계속 실행할 수 있습니다

#### Promise.all이란?

`Promise.all`은 여러 Promise를 받아서 모두 완료될 때까지 기다리는 메서드입니다.

```typescript
Promise.all([promise1, promise2, promise3])
  .then(results => {
    // 모든 Promise가 완료된 후 실행
    // results는 [result1, result2, result3] 형태
  });
```

**동작 원리:**
1. 배열의 각 요소를 평가하여 Promise 객체를 모두 생성
2. 모든 Promise가 시작되고 실행되기를 기다림
3. 모든 Promise가 완료될 때까지 대기
4. 모두 완료되면 결과 배열을 반환

#### await를 사용하면 왜 직렬 실행이 되는가?

```typescript
// ❌ 잘못된 방법 - 직렬 실행
Promise.all([
  await fetchMajors(),      // 1. fetchMajors() 실행
                            // 2. await 때문에 완료될 때까지 대기 (예: 100ms)
                            // 3. 완료 후 다음 요소로 이동
  await fetchLiberalArts(), // 4. 이제 fetchLiberalArts() 실행
                            // 5. await 때문에 완료될 때까지 대기
]);
```

**문제점:**
- 배열의 각 요소가 평가될 때 `await`가 있으면 완료를 기다립니다
- 다음 요소는 이전 요소가 완료된 후에 평가됩니다
- 결과적으로 순차 실행이 됩니다

**실행 순서:**
```
t=0ms:   fetchMajors() 시작
t=100ms: fetchMajors() 완료 → 다음 요소로 이동
t=100ms: fetchLiberalArts() 시작
t=200ms: fetchLiberalArts() 완료
총 시간: 200ms
```

#### await 없이 Promise 객체를 직접 전달하면?

```typescript
// ✅ 올바른 방법 - 병렬 실행
Promise.all([
  fetchMajors(),      // 1. fetchMajors() 호출 → Promise 객체 즉시 반환
                      //    (네트워크 요청은 백그라운드에서 시작됨)
  fetchLiberalArts(), // 2. fetchLiberalArts() 호출 → Promise 객체 즉시 반환
                      //    (네트워크 요청은 백그라운드에서 시작됨)
]);
// 3. Promise.all이 모든 Promise 객체를 받음
// 4. 모든 Promise의 완료를 기다림
```

**동작 원리:**
- 배열의 각 요소가 평가될 때 Promise 객체가 즉시 반환됩니다
- 모든 Promise 객체가 빠르게 생성됩니다 (대기 없음)
- 각 Promise의 네트워크 요청이 백그라운드에서 동시에 진행됩니다
- `Promise.all`은 모든 Promise가 완료될 때까지 기다립니다

**실행 순서:**
```
t=0ms:   fetchMajors() 호출 → Promise 객체 반환 (즉시)
t=0ms:   fetchLiberalArts() 호출 → Promise 객체 반환 (즉시)
t=0ms:   두 네트워크 요청이 백그라운드에서 동시 시작
t=100ms: fetchMajors() 완료
t=100ms: fetchLiberalArts() 완료
t=100ms: Promise.all 완료 (모두 완료)
총 시간: 100ms
```

### 해결 방법

이번 단계에서는 직렬 실행 문제만 해결합니다. `await`를 제거하고 Promise 객체를 직접 전달하여 병렬 실행되도록 수정:

```typescript
const fetchAllLectures = async () => {
  return Promise.all([
    fetchMajors(),        // Promise 객체를 직접 전달 (await 없음)
    fetchLiberalArts(),   
    fetchMajors(),        // 여전히 중복 호출이지만 병렬 실행됨
    fetchLiberalArts(),   
    fetchMajors(),        
    fetchLiberalArts(),   
  ]);
};
```

**실행 순서:**
```
API Call 1 시작 ┐
API Call 2 시작 ├─
API Call 3 시작 ├─
API Call 4 시작 ├─ 모든 호출이 동시에 시작!
API Call 5 시작 ├─
API Call 6 시작 ┘

→ 약 100ms 후 모두 완료
```

**주의사항:**
- 중복 API 호출 문제는 아직 해결되지 않았음 (다음 단계에서 캐시로 해결 예정)
- 하지만 모든 호출이 병렬로 실행되므로 실행 시간은 크게 단축됨

### 개선 효과

#### 실제 측정 결과

**기존 (직렬 실행):**
```
API Call 1: 339.4
API Call 2: 395.2  ← 55.8ms 후 (첫 번째 완료 후 시작)
API Call 3: 403.9  ← 8.7ms 후
API Call 4: 406.9  ← 3ms 후
API Call 5: 409    ← 2.1ms 후
API Call 6: 411.3  ← 2.3ms 후
총 소요 시간: 75.5ms
```
- 첫 번째 API 호출 완료 후 다음 호출이 시작됨 (직렬 실행 확인)

**개선 후 (병렬 실행):**
```
API Call 1: 1173278.6
API Call 2: 1173279.1  ← 0.5ms 후 (거의 동시 시작)
API Call 3: 1173279.5  ← 0.4ms 후 (거의 동시 시작)
API Call 4: 1173279.9  ← 0.4ms 후 (거의 동시 시작)
API Call 5: 1173280.3  ← 0.4ms 후 (거의 동시 시작)
API Call 6: 1173280.6  ← 0.3ms 후 (거의 동시 시작)
총 소요 시간: 70.6ms
```
- 모든 API 호출이 거의 동시에 시작됨 (병렬 실행 확인)
- **약 5ms (6.5%) 성능 개선**

#### 성능 개선이 작게 나타난 이유

1. **로컬 환경의 빠른 응답 속도**
   - 개발 환경에서는 각 API 응답 시간이 10-15ms 정도로 매우 짧음
   - 실제 프로덕션 환경(느린 네트워크, 높은 지연)에서는 차이가 더 클 수 있음

2. **브라우저의 HTTP/2 멀티플렉싱**
   - 같은 도메인에 대한 여러 요청을 브라우저가 어느 정도 병렬 처리
   - 하지만 코드 레벨에서의 직렬 실행은 여전히 비효율적

3. **코드 구조상의 개선**
   - 직렬 실행 → 병렬 실행으로 코드 구조가 올바르게 개선됨
   - 비록 로컬 환경에서는 차이가 작지만, 올바른 패턴으로 작성됨

**참고:**
- 네트워크 요청 수는 아직 6개 (중복 호출 문제 미해결)
- 다음 단계에서 캐시를 통해 네트워크 요청 수를 2개로 줄일 예정
- 실제 네트워크가 느린 환경에서는 병렬 실행의 효과가 더 크게 나타남

### 학습 내용

1. **Promise의 동작 원리**
   - Promise 객체는 즉시 생성됨 (비동기 작업은 백그라운드에서 실행)
   - Promise 객체를 받은 후에도 다른 코드를 계속 실행 가능

2. **Promise.all의 올바른 사용법**
   - `Promise.all`에 Promise 객체를 직접 전달해야 병렬 실행됨
   - 내부에서 `await`를 사용하면 직렬 실행이 됨
   - 배열의 각 요소가 평가될 때 `await`가 있으면 완료를 기다리게 되어 순차 실행됨

3. **await의 역할**
   - `await`는 Promise가 완료될 때까지 함수 실행을 멈춤
   - `Promise.all` 내부에서 `await`를 사용하면 각 요소가 순차적으로 평가됨
   - Promise 객체를 직접 전달하면 모든 Promise가 즉시 생성되어 병렬 실행됨

4. **비동기 처리 최적화**
   - 불필요한 대기 시간 제거
   - 동시 실행을 통한 전체 실행 시간 단축
   - 병렬 실행만으로도 실행 시간을 크게 단축할 수 있음