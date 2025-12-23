# Chapter 4-2. 코드 관점의 성능 최적화

## 🎯 **시작하기 전에**

> 이제 적절한 인프라를 갖추는 것이 서비스 성능을 향상하는데 중요함을 인지하였고, CDN 도입을 할 수 있는 능력을 갖췄으니 코드 레벨에서 적용할 수 있는 다양한 최적화 기법으로 주제를 바꿔봅시다.

인프라 레벨의 최적화는 서버 구성, 네트워크 최적화, 캐싱 전략 등 프론트엔드 애플리케이션의 '뒷부분'에서 일어나는 최적화를 의미했습니다. 핵심 지표로는 TTFB(Time to First Byte)가 있었습니다.

**코드 레벨의 최적화**는 JavaScript, CSS, HTML 등 프론트엔드 개발자가 일상에서 쓰는 주요 기술 스택을 사용해 어떻게 앱의 성능을 최적화할 수 있는지를 다루는 영역입니다.

인프라 레벨 최적화 전략도 다양하지만, 코드 레벨 최적화 전략도 셀 수 없이 종류가 많습니다. 프론트엔드는 다양한 프레임워크와 라이브러리가 존재하는 거대한 생태계를 형성하고 있기 때문에 더욱더 그렇습니다.

모든 프레임워크/라이브러리의 성능 개선 방법을 배우기엔 한계가 있습니다. 그래서 우리는 바닐라 JavaScript 프로젝트와 React 프로젝트를 기준으로 성능 최적화 기법을 적용, 적용 이후 어떤 지표가 개선되었는지를 실습하여 실무에서 성능 저하가 있을 때 대응할 수있는 역량을 갖출 예정입니다.

앞으로 소개할 최적화 기법들이 때로는 복잡하게 느껴질 수 있습니다. 하지만 걱정하지 마세요. 모든 기법을 한 번에 완벽하게 적용하는 것이 목표가 아닙니다. 점진적으로 적용하며, 여러분의 프로젝트에 가장 필요한 부분부터 시작하는 것이 중요합니다. 성능 최적화는 결국 사용자에게 더 나은 경험을 제공하기 위한 것임을 항상 기억하세요.

## 💡 **이번 챕터 목표**

```jsx
const 수강생 = {
  프론트엔드_성능_측정_도구를_활용할_수_있음: false,
  코드_레벨_최적화_기법을_이해함: false,
  JavaScript_및_CSS_최적화를_실제로_적용할_수_있음: false,
};

expect(코드_레벨_성능_최적화_학습(수강생)).toEqual({
  프론트엔드_성능_측정_도구를_활용할_수_있음: true,
  코드_레벨_최적화_기법을_이해함: true,
  JavaScript_및_CSS_최적화를_실제로_적용할_수_있음: true,
});
```

## Goal

리액트 어플리케이션에서 불필요한 연산과 불필요한 렌더링이 발생하지 않도록 성능 최적화를 진행해주세요.

### 1. 저장소 파악하기

- 과제로 제시된 저장소에 구현된 요구사항은 다음과 같습니다.
  1. 시간표에서 수업을 검색할 수 있습니다.
  2. 검색에 대한 다양한 조건을 선택할 수 있습니다.
  3. 검색 결과는 인피니티 스크롤을 통해서 가져옵니다.
  4. 등록한 수업을 DnD(Drag and Drop)로 옮길 수 있습니다.
  5. 등록한 수업을 삭제할 수 있습니다.
  6. 시간표를 복제할 수 있습니다.
- 어플리케이션을 직접 실행해봅시다.
- 현재는 다음과 같은 성능 저하 지점이 있습니다.
  1. 수업 검색 모달 내 검색 결과를 보여주는 리스트에서 페이지네이션이 느립니다.
  2. 똑같은 API를 계속 호출합니다.
  3. 시간표에서 드래그/드롭으로 과목에 해당하는 블럭을 옮길 수 있지만 무척 느립니다.
  4. 시간표가 많아질수록 렌더링이 기하급수적으로 느려집니다.

### 2. 성능 개선 목표

- 과제를 통해 개선해야 하는 부분은 다음과 같습니다.
  1. 페이지네이션을 했을 때 발생하는 렌더링 + 불필요한 연산 최소화
  2. 드래그/드롭 시점에 발생하는 렌더링 + 불필요한 연산 최소화

#### (1) 기본과제: SearchDialog.tsx 개선

##### 1) API 호출 부분을 최적화주세요

```jsx
const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json');
const fetchLiberalArts = () => axios.get<Lecture[]>('/schedules-majors.json');

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
const fetchAllLectures = async () => await Promise.all([
  (console.log('API Call 1', performance.now()), await fetchMajors()),
  (console.log('API Call 2', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 3', performance.now()), await fetchMajors()),
  (console.log('API Call 4', performance.now()), await fetchLiberalArts()),
  (console.log('API Call 5', performance.now()), await fetchMajors()),
  (console.log('API Call 6', performance.now()), await fetchLiberalArts()),
]);
```

- Promise.all과 관련된 코드를 보면 병렬로 실행될 것 같지만 실제로 직렬로 실행되고 있습니다.
  (**API Call 6의 호출 시점**과 **모든 API 호출 완료 시점**이 거의 동일)
  정상적으로 동작하도록 변경해주세요. - 병렬로 실행될 경우

          (**API Call 1의 시점**과 **API Call 6의 시점**이 거의 차이가 없음)

- 이미 호출한 API는 다시 호출하지 않도록 시도해보세요. (힌트: 클로저를 이용해서 캐시를 구성하면 됩니다.)
  - API 호출을 캐시할 경우, **대략 20ms 정도 개선된걸 볼 수 있습니다.**

##### 2) 불필요한 연산이 발생하지 않도록 해주세요

```jsx
// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const getFilteredLectures = () => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;
    return lectures
      .filter(lecture =>
        lecture.title.toLowerCase().includes(query.toLowerCase()) ||
        lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter(lecture => grades.length === 0 || grades.includes(lecture.grade))
      .filter(lecture => majors.length === 0 || majors.includes(lecture.major))
      .filter(lecture => !credits || lecture.credits.startsWith(String(credits)))
      .filter(lecture => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some(s => days.includes(s.day));
      })
      .filter(lecture => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some(s => s.range.some(time => times.includes(time)));
      });
  }

  const filteredLectures = getFilteredLectures();
  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);
  const allMajors = [...new Set(lectures.map(lecture => lecture.major))];

  /*뒤의 내용 생략*/
}
```

- 지금은 렌더링을 할 때 마다 (인피니트 스크롤을 할 때 마다) 검색을 다시 하고 있습니다. **최초에 한 번 검색한 이후에는 검색을 다시 하지 않도록 만들어주세요**

##### 3) 불필요한 렌더링 방지

- 렌더링 비용이 많이 발생하는 컴포넌트가 존재합니다. 불필요하게 렌더링이 되지 않도록 개선해주세요.
  - 전공 목록을 조회하는 컴포넌트에서 모든 요소가 리렌더링 되고 있습니다.
    대략 30ms
  - 강의 목록을 조회하는 컴포넌트의 경우, 내부 요소에 대해 전부 렌더링이 실행되고 있습니다. 스크롤을 내리면 내릴수록 렌더링 비용이 많이 발생합니다.
    - 페이지네이션을 통해서 데이터를 가져올 때 마다, 모든 요소를 다시 렌더링 하고 있습니다.
    - 가령, **검색 결과가 대략 3000개이고, 마지막 결과를 조회하기 위해 30페이지까지 갈 경우**, tbody에서만 600ms 정도 소요됩니다.
  - **최적화 후에 프로파일링을 하면 추가되는 컴포넌트에 대해서만 렌더링이 되는 모습을 볼 수 있습니다.**
    6%A8*2024-08-17*%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE_1.29.47.mov)

<aside>
💡 **과제 외적으로 시도해보면 좋은 것**

- 지금은 검색을 할 때, 데이터를 모두 가져온 다음에 렌더링을 하고 있습니다.
  - 가령, 당장 렌더링에 필요한건 100개의 데이터인데 검색을 통해서 수천개의 데이터를 가져옵니다.
- 그렇다면 반대로 렌더링에 필요한 데이터만 가져올 수 있도록 하는 방법은 없을까요? - “지연평가” 라는 키워드를 토대로 찾아보면 알 수 있답니다!
</aside>

#### (2) 심화과제: DnD 시스템 개선

##### 1) 드래그시 렌더링 최적화

- 드래그를 할 때 거의 모든 요소가 리렌더링 되고 있습니다.
  - 상태관리에 대한 부분을 리팩토링 할 경우 해결이 가능합니다.
    - 힌트) useDndContext
  - **메모이제이션을 적절하게 사용**하여 불필요한 렌더링이 발생하지 않도록 해주세요.

##### 2) Drop을 했을 때 렌더링 최적화

- 모든 구간이 schedulesMap을 의존하고 있습니다. 그래서 schedulesMap이 업데이트 되면 모든 컴포넌트가 업데이트 되는 형태입니다. (실제로는 한 개의 Schedule만 업데이트 되고 있지만, 모든 Schedule Data가 업데이트 된것으로 인지하게 됩니다.)

  ```jsx
  // schedulesMap이 큰 덩어리로 관리되고 있고, 이걸 사용할 경우 렌더링이 빈번하게 발생합니다.
  export const ScheduleProvider = ({ children }: PropsWithChildren) => {
    const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

    return (
      <ScheduleContext.Provider value={{ schedulesMap, setSchedulesMap }}>
        {children}
      </ScheduleContext.Provider>
    );
  };
  ```

- 전역상태를 업데이트하거나 가져오는 방식을 개선하고 메모이제이션을 적절하게 사용할 경우, Drop을 했을 때에 불필요한 렌더링을 방지할 수 있습니다.
