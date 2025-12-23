import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { CellSize, DAY_LABELS, 분 } from "./constants.ts";
import { Schedule } from "./types.ts";
import { fill2, parseHnM } from "./utils.ts";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  ComponentProps,
  Fragment,
  memo,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const TIMES = [
  ...Array(18)
    .fill(0)
    .map((v, k) => v + k * 30 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

  ...Array(6)
    .fill(18 * 30 * 분)
    .map((v, k) => v + k * 55 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;

// 드래그 중 outline 표시를 위한 별도 컴포넌트
// useDndContext를 구독하여 드래그 중에만 리렌더링되도록 최적화
const DragOutline = memo(() => {
  const dndContext = useDndContext();
  const isDragging = dndContext.active !== null;

  if (!isDragging) return null;

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      outline="5px dashed"
      outlineColor="blue.300"
      pointerEvents="none"
      zIndex={1}
    />
  );
});

// 각 셀을 별도 컴포넌트로 분리하여 메모이제이션
// 드롭 후에도 변경되지 않은 셀은 리렌더링되지 않도록 최적화
const ScheduleCell = memo(
  ({
    day,
    timeIndex,
    onClick,
  }: {
    day: string;
    timeIndex: number;
    onClick: (day: string, time: number) => void;
  }) => {
    // onClick을 useRef로 저장하여 항상 같은 참조를 유지
    const onClickRef = useRef(onClick);
    useEffect(() => {
      onClickRef.current = onClick;
    }, [onClick]);

    const handleClick = useCallback(() => {
      onClickRef.current(day, timeIndex + 1);
    }, [day, timeIndex]);

    return (
      <GridItem
        borderWidth="1px 0 0 1px"
        borderColor="gray.300"
        bg={timeIndex > 17 ? "gray.100" : "white"}
        cursor="pointer"
        _hover={{ bg: "yellow.100" }}
        onClick={handleClick}
      />
    );
  },
  (prevProps, nextProps) => {
    // day와 timeIndex만 비교하여 onClick 참조 변경은 무시
    // handleCellClick이 안정적이므로 onClick이 변경되어도 리렌더링할 필요 없음
    return (
      prevProps.day === nextProps.day &&
      prevProps.timeIndex === nextProps.timeIndex
    );
  }
);

// 요일 헤더를 별도 컴포넌트로 분리하여 메모이제이션
const DayHeader = memo(() => {
  return (
    <>
      <GridItem key="교시" borderColor="gray.300" bg="gray.100">
        <Flex justifyContent="center" alignItems="center" h="full" w="full">
          <Text fontWeight="bold">교시</Text>
        </Flex>
      </GridItem>
      {DAY_LABELS.map((day) => (
        <GridItem
          key={day}
          borderLeft="1px"
          borderColor="gray.300"
          bg="gray.100"
        >
          <Flex justifyContent="center" alignItems="center" h="full">
            <Text fontWeight="bold">{day}</Text>
          </Flex>
        </GridItem>
      ))}
    </>
  );
});

// 시간 블럭을 별도 컴포넌트로 분리하여 메모이제이션
const TimeBlock = memo(
  ({
    time,
    timeIndex,
    onCellClick,
  }: {
    time: string;
    timeIndex: number;
    onCellClick: (day: string, time: number) => void;
  }) => {
    return (
      <Fragment>
        <GridItem
          borderTop="1px solid"
          borderColor="gray.300"
          bg={timeIndex > 17 ? "gray.200" : "gray.100"}
        >
          <Flex justifyContent="center" alignItems="center" h="full">
            <Text fontSize="xs">
              {fill2(timeIndex + 1)} ({time})
            </Text>
          </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
          <ScheduleCell
            key={`${day}-${timeIndex + 2}`}
            day={day}
            timeIndex={timeIndex}
            onClick={onCellClick}
          />
        ))}
      </Fragment>
    );
  },
  (prevProps, nextProps) => {
    // time과 timeIndex만 비교하여 onCellClick 참조 변경은 무시
    // handleCellClick이 안정적이므로 onCellClick이 변경되어도 리렌더링할 필요 없음
    return (
      prevProps.time === nextProps.time &&
      prevProps.timeIndex === nextProps.timeIndex
    );
  }
);

// Grid를 별도 컴포넌트로 분리하여 드래그 중 불필요한 리렌더링 방지
const ScheduleGrid = memo(
  ({ onCellClick }: { onCellClick: (day: string, time: number) => void }) => {
    return (
      <Grid
        templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
        templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
        bg="white"
        fontSize="sm"
        textAlign="center"
        outline="1px solid"
        outlineColor="gray.300"
      >
        <DayHeader />
        {TIMES.map((time, timeIndex) => (
          <TimeBlock
            key={`시간-${timeIndex + 1}`}
            time={time}
            timeIndex={timeIndex}
            onCellClick={onCellClick}
          />
        ))}
      </Grid>
    );
  },
  (prevProps, nextProps) => {
    // onCellClick 참조 변경을 무시하여 불필요한 리렌더링 방지
    // handleCellClick이 안정적이므로 onCellClick이 변경되어도 리렌더링할 필요 없음
    return true; // 항상 리렌더링하지 않음 (onCellClick은 useRef로 안정화됨)
  }
);

const ScheduleTable = ({
  tableId,
  schedules,
  onScheduleTimeClick,
  onDeleteButtonClick,
}: Props) => {
  // onScheduleTimeClick을 useRef로 저장하여 항상 같은 참조를 유지
  // 이렇게 하면 handleCellClick의 참조가 변경되지 않아 ScheduleGrid가 리렌더링되지 않음
  const onScheduleTimeClickRef = useRef(onScheduleTimeClick);
  useEffect(() => {
    onScheduleTimeClickRef.current = onScheduleTimeClick;
  }, [onScheduleTimeClick]);

  // onDeleteButtonClick을 useRef로 저장하여 항상 같은 참조를 유지
  // 이렇게 하면 deleteHandlers의 참조가 변경되지 않아 DraggableSchedule이 리렌더링되지 않음
  const onDeleteButtonClickRef = useRef(onDeleteButtonClick);
  useEffect(() => {
    onDeleteButtonClickRef.current = onDeleteButtonClick;
  }, [onDeleteButtonClick]);

  // 고유한 강의 ID 목록을 useMemo로 메모이제이션
  const uniqueLectureIds = useMemo(
    () => [...new Set(schedules.map(({ lecture }) => lecture.id))],
    [schedules]
  );

  // 색상 맵을 useMemo로 메모이제이션
  const colorMap = useMemo(() => {
    const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
    const map = new Map<string, string>();
    uniqueLectureIds.forEach((lectureId, index) => {
      map.set(lectureId, colors[index % colors.length]);
    });
    return map;
  }, [uniqueLectureIds]);

  // getColor 함수를 useCallback으로 메모이제이션
  const getColor = useCallback(
    (lectureId: string): string => {
      return colorMap.get(lectureId) || "#fdd";
    },
    [colorMap]
  );

  // 셀 클릭 핸들러를 useCallback으로 메모이제이션
  // onScheduleTimeClickRef를 사용하여 참조가 변경되지 않도록 함
  const handleCellClick = useCallback((day: string, time: number) => {
    onScheduleTimeClickRef.current?.({ day, time });
  }, []);

  // 각 스케줄별 삭제 핸들러를 메모이제이션하여 안정화
  // schedules 배열이 변경되지 않으면 각 핸들러 참조가 유지됨
  // onDeleteButtonClickRef를 사용하여 참조가 변경되지 않도록 함
  const deleteHandlers = useMemo(() => {
    return schedules.map((schedule) => {
      return () =>
        onDeleteButtonClickRef.current?.({
          day: schedule.day,
          time: schedule.range[0],
        });
    });
  }, [schedules]);

  // 각 스케줄별 bg 값을 메모이제이션하여 안정화
  // schedules 배열과 colorMap이 변경되지 않으면 각 bg 값도 유지됨
  const scheduleBgs = useMemo(() => {
    return schedules.map(
      (schedule) => colorMap.get(schedule.lecture.id) || "#fdd"
    );
  }, [schedules, colorMap]);

  return (
    <Box position="relative">
      <DragOutline />
      <ScheduleGrid onCellClick={handleCellClick} />

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={scheduleBgs[index]}
          onDeleteButtonClick={deleteHandlers[index]}
        />
      ))}
    </Box>
  );
};

const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      onDeleteButtonClick: () => void;
    }) => {
    // onDeleteButtonClick을 useRef로 저장하여 참조 안정화
    const onDeleteButtonClickRef = useRef(onDeleteButtonClick);
    useEffect(() => {
      onDeleteButtonClickRef.current = onDeleteButtonClick;
    }, [onDeleteButtonClick]);

    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    const handleDeleteClick = useCallback(() => {
      onDeleteButtonClickRef.current();
    }, []);

    return (
      <Popover>
        <PopoverTrigger>
          <Box
            position="absolute"
            left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
            top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
            width={CellSize.WIDTH - 1 + "px"}
            height={CellSize.HEIGHT * size - 1 + "px"}
            bg={bg}
            p={1}
            boxSizing="border-box"
            cursor="pointer"
            ref={setNodeRef}
            transform={CSS.Translate.toString(transform)}
            {...listeners}
            {...attributes}
          >
            <Text fontSize="sm" fontWeight="bold">
              {lecture.title}
            </Text>
            <Text fontSize="xs">{room}</Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent onClick={(event) => event.stopPropagation()}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text>강의를 삭제하시겠습니까?</Text>
            <Button colorScheme="red" size="xs" onClick={handleDeleteClick}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
  (prevProps, nextProps) => {
    // data와 bg만 비교하여 onDeleteButtonClick 참조 변경은 무시
    // onDeleteButtonClick이 변경되어도 리렌더링할 필요 없음
    // data 객체의 참조가 같으면 리렌더링하지 않음
    return (
      prevProps.id === nextProps.id &&
      prevProps.data === nextProps.data &&
      prevProps.bg === nextProps.bg
    );
  }
);

// React.memo로 컴포넌트 메모이제이션하여 불필요한 리렌더링 방지
// schedules 배열 참조가 같으면 리렌더링하지 않음 (핸들러 참조 변경은 무시)
export default memo(ScheduleTable, (prevProps, nextProps) => {
  // tableId와 schedules 배열 참조가 변경되지 않았으면 리렌더링 방지
  // 핸들러 함수는 참조가 변경될 수 있지만, schedules가 같으면 리렌더링할 필요 없음
  if (
    prevProps.tableId === nextProps.tableId &&
    prevProps.schedules === nextProps.schedules
  ) {
    return true; // props가 같으면 리렌더링 안 함
  }
  return false; // props가 다르면 리렌더링
});
