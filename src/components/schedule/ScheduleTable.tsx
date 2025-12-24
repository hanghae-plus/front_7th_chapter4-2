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
import { DndContext, DragOverlay, Modifier, PointerSensor, useDraggable, useSensor, useSensors } from "@dnd-kit/core";

import { CellSize, DAY_LABELS, 분 } from "@/constants";
import { Schedule } from "@/types";
import { fill2, parseHnM } from "@/lib/utils";
import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (tableId: string, timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (tableId: string, timeInfo: { day: string; time: number }) => void;
  onScheduleUpdate?: (tableId: string, index: number, newDay: string, newRange: number[]) => void;
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

const COLORS = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];

// 스냅 모디파이어
function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + 120 + 1;
    const minY = containerTop - top + 40 + 1;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;

    return ({
      ...transform,
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
    });
  };
}

const modifiers = [createSnapModifier()];

// ScheduleItemUI - 순수 UI 컴포넌트
interface ScheduleItemUIProps {
  scheduleId: string;
  left: number;
  top: number;
  width: number;
  height: number;
  bg: string;
  title: string;
  room?: string;
  onDelete: () => void;
  setNodeRef: (element: HTMLElement | null) => void;
  listeners?: ReturnType<typeof useDraggable>['listeners'];
  attributes?: ReturnType<typeof useDraggable>['attributes'];
}

const ScheduleItemUI = memo(
  ({
    scheduleId,
    left,
    top,
    width,
    height,
    bg,
    title,
    room,
    onDelete,
    setNodeRef,
    listeners,
    attributes,
  }: ScheduleItemUIProps) => {
    console.log(`[ScheduleItemUI] 렌더링: ${title}`);
    return (
      <Box
        data-schedule-id={scheduleId}
        position="absolute"
        left={`${left}px`}
        top={`${top}px`}
        width={`${width}px`}
        height={`${height}px`}
        bg={bg}
        p={1}
        boxSizing="border-box"
        cursor="grab"
        ref={setNodeRef}
        {...listeners}
        {...attributes}
      >
        <Popover>
          <PopoverTrigger>
            <Box as="span" display="block" w="full" h="full">
              <Text fontSize="sm" fontWeight="bold">{title}</Text>
              <Text fontSize="xs">{room}</Text>
            </Box>
          </PopoverTrigger>
          <PopoverContent onClick={event => event.stopPropagation()}>
            <PopoverArrow/>
            <PopoverCloseButton/>
            <PopoverBody>
              <Text>강의를 삭제하시겠습니까?</Text>
              <Button colorScheme="red" size="xs" onClick={onDelete}>
                삭제
              </Button>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.scheduleId === nextProps.scheduleId &&
      prevProps.left === nextProps.left &&
      prevProps.top === nextProps.top &&
      prevProps.width === nextProps.width &&
      prevProps.height === nextProps.height &&
      prevProps.bg === nextProps.bg &&
      prevProps.title === nextProps.title &&
      prevProps.room === nextProps.room
    );
  }
);

ScheduleItemUI.displayName = 'ScheduleItemUI';

// DraggableSchedule - dnd 로직 담당 (memo로 최적화)
const DraggableSchedule = memo(({
  id,
  data,
  bg,
  tableId,
  onDelete
}: {
  id: string;
  data: Schedule;
  bg: string;
  tableId: string;
  onDelete?: (tableId: string, timeInfo: { day: string; time: number }) => void;
}) => {
  console.log(`[DraggableSchedule] 렌더링: ${id}`);
  const { day, range, room, lecture } = data;
  const { attributes, setNodeRef, listeners } = useDraggable({
    id,
    data: { schedule: data, bg },
  });

  const leftIndex = DAY_LABELS.indexOf(day as typeof DAY_LABELS[number]);
  const topIndex = range[0] - 1;
  const size = range.length;

  const left = 120 + (CellSize.WIDTH * leftIndex) + 1;
  const top = 40 + (topIndex * CellSize.HEIGHT + 1);
  const width = CellSize.WIDTH - 1;
  const height = CellSize.HEIGHT * size - 1;

  const handleDelete = useCallback(() => {
    onDelete?.(tableId, { day, time: range[0] });
  }, [onDelete, tableId, day, range]);

  return (
    <ScheduleItemUI
      scheduleId={id}
      left={left}
      top={top}
      width={width}
      height={height}
      bg={bg}
      title={lecture.title}
      room={room}
      onDelete={handleDelete}
      setNodeRef={setNodeRef}
      listeners={listeners}
      attributes={attributes}
    />
  );
}, (prevProps, nextProps) => {
  // schedule 데이터가 같으면 리렌더링 방지
  return (
    prevProps.id === nextProps.id &&
    prevProps.bg === nextProps.bg &&
    prevProps.data.day === nextProps.data.day &&
    prevProps.data.range[0] === nextProps.data.range[0] &&
    prevProps.data.range.length === nextProps.data.range.length &&
    prevProps.data.lecture.id === nextProps.data.lecture.id
  );
});

DraggableSchedule.displayName = 'DraggableSchedule';

// Grid를 별도 컴포넌트로 분리
const ScheduleGrid = memo(({
  tableId,
  onScheduleTimeClick
}: {
  tableId: string;
  onScheduleTimeClick?: (tableId: string, timeInfo: { day: string; time: number }) => void;
}) => {
  console.log(`[ScheduleGrid] 렌더링: ${tableId}`);
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
      <GridItem key="교시" borderColor="gray.300" bg="gray.100">
        <Flex justifyContent="center" alignItems="center" h="full" w="full">
          <Text fontWeight="bold">교시</Text>
        </Flex>
      </GridItem>
      {DAY_LABELS.map((day) => (
        <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
          <Flex justifyContent="center" alignItems="center" h="full">
            <Text fontWeight="bold">{day}</Text>
          </Flex>
        </GridItem>
      ))}
      {TIMES.map((time, timeIndex) => (
        <Fragment key={`시간-${timeIndex + 1}`}>
          <GridItem
            borderTop="1px solid"
            borderColor="gray.300"
            bg={timeIndex > 17 ? 'gray.200' : 'gray.100'}
          >
            <Flex justifyContent="center" alignItems="center" h="full">
              <Text fontSize="xs">{fill2(timeIndex + 1)} ({time})</Text>
            </Flex>
          </GridItem>
          {DAY_LABELS.map((day) => (
            <GridItem
              key={`${day}-${timeIndex + 2}`}
              borderWidth="1px 0 0 1px"
              borderColor="gray.300"
              bg={timeIndex > 17 ? 'gray.100' : 'white'}
              cursor="pointer"
              _hover={{ bg: 'yellow.100' }}
              onClick={() => onScheduleTimeClick?.(tableId, { day, time: timeIndex + 1 })}
            />
          ))}
        </Fragment>
      ))}
    </Grid>
  );
});

ScheduleGrid.displayName = 'ScheduleGrid';

// DragOverlay 컨텐츠
const DragOverlayContent = memo(({ schedule, bg }: { schedule: Schedule; bg: string }) => {
  const size = schedule.range.length;
  return (
    <Box
      width={`${CellSize.WIDTH - 1}px`}
      height={`${CellSize.HEIGHT * size - 1}px`}
      bg={bg}
      p={1}
      boxSizing="border-box"
      cursor="grabbing"
      boxShadow="lg"
    >
      <Text fontSize="sm" fontWeight="bold">{schedule.lecture.title}</Text>
      <Text fontSize="xs">{schedule.room}</Text>
    </Box>
  );
});

DragOverlayContent.displayName = 'DragOverlayContent';

// ScheduleTable - 각 테이블이 독립적인 DndContext를 가짐
const ScheduleTable = memo(({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick, onScheduleUpdate }: Props) => {
  console.log(`[ScheduleTable] 렌더링: ${tableId}`);

  // activeData만 상태로 관리 (DragOverlay용)
  const [activeData, setActiveData] = useState<{ schedule: Schedule; bg: string } | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);
  const activeIdRef = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const colorMap = useMemo(() => {
    const lectureIds = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    return Object.fromEntries(
      lectureIds.map((id, index) => [id, COLORS[index % COLORS.length]])
    );
  }, [schedules]);

  // CSS로 드래그 중인 아이템 숨기기 (React 상태 변경 없이)
  const injectDragStyle = useCallback((id: string) => {
    if (styleRef.current) {
      document.head.removeChild(styleRef.current);
    }
    const style = document.createElement('style');
    style.textContent = `[data-schedule-id="${id}"] { visibility: hidden !important; }`;
    document.head.appendChild(style);
    styleRef.current = style;
  }, []);

  const removeDragStyle = useCallback(() => {
    if (styleRef.current) {
      document.head.removeChild(styleRef.current);
      styleRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 스타일 정리
  useEffect(() => {
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragStart = useCallback((event: any) => {
    const { active } = event;
    const id = String(active.id);
    activeIdRef.current = id;
    injectDragStyle(id);
    setActiveData(active.data.current as { schedule: Schedule; bg: string });
  }, [injectDragStyle]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = useCallback((event: any) => {
    removeDragStyle();
    setActiveData(null);
    activeIdRef.current = null;

    const { active, delta } = event;
    const { x, y } = delta;
    const [, indexStr] = String(active.id).split(':');
    const index = Number(indexStr);
    const moveDayIndex = Math.floor(x / CellSize.WIDTH);
    const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

    if (moveDayIndex === 0 && moveTimeIndex === 0) return;

    const schedule = schedules[index];
    const nowDayIndex = DAY_LABELS.indexOf(schedule.day as typeof DAY_LABELS[number]);
    const newDay = DAY_LABELS[nowDayIndex + moveDayIndex];
    const newRange = schedule.range.map(time => time + moveTimeIndex);

    onScheduleUpdate?.(tableId, index, newDay, newRange);
  }, [schedules, tableId, onScheduleUpdate, removeDragStyle]);

  const handleDragCancel = useCallback(() => {
    removeDragStyle();
    setActiveData(null);
    activeIdRef.current = null;
  }, [removeDragStyle]);

  return (
    <DndContext
      sensors={sensors}
      modifiers={modifiers}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <Box position="relative">
        <ScheduleGrid tableId={tableId} onScheduleTimeClick={onScheduleTimeClick} />

        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={colorMap[schedule.lecture.id]}
            tableId={tableId}
            onDelete={onDeleteButtonClick}
          />
        ))}
      </Box>

      <DragOverlay modifiers={modifiers}>
        {activeData ? <DragOverlayContent schedule={activeData.schedule} bg={activeData.bg} /> : null}
      </DragOverlay>
    </DndContext>
  );
});

ScheduleTable.displayName = 'ScheduleTable';

export default ScheduleTable;
