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
import {
  DndContext,
  Modifier,
  PointerSensor,
  useDndContext,
  useDraggable,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ComponentProps, Fragment, memo, useCallback, useMemo } from "react";
// Context에서 직접 Dispatch를 가져오기 위해 import
import { useScheduleDispatch } from "./ScheduleContext.tsx";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (
    tableId: string,
    timeInfo: { day: string; time: number }
  ) => void;
  onDeleteButtonClick?: (
    tableId: string,
    timeInfo: { day: string; time: number }
  ) => void;
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

// [DraggableSchedule]
const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      onDeleteButtonClick: () => void;
    }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

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
              {lecture?.title}
            </Text>
            <Text fontSize="xs">{room}</Text>
          </Box>
        </PopoverTrigger>
        <PopoverContent onClick={(event) => event.stopPropagation()}>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Text>강의를 삭제하시겠습니까?</Text>
            <Button colorScheme="red" size="xs" onClick={onDeleteButtonClick}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.data === nextProps.data &&
      prevProps.bg === nextProps.bg
    );
  }
);

// [GridBackground]
const GridBackground = memo(
  ({
    tableId,
    onScheduleTimeClick,
  }: {
    tableId: string;
    onScheduleTimeClick?: (
      tableId: string,
      timeInfo: { day: string; time: number }
    ) => void;
  }) => {
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
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
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
              <GridItem
                key={`${day}-${timeIndex + 2}`}
                borderWidth="1px 0 0 1px"
                borderColor="gray.300"
                bg={timeIndex > 17 ? "gray.100" : "white"}
                cursor="pointer"
                _hover={{ bg: "yellow.100" }}
                onClick={() =>
                  onScheduleTimeClick?.(tableId, {
                    day,
                    time: timeIndex + 1,
                  })
                }
              />
            ))}
          </Fragment>
        ))}
      </>
    );
  }
);

// [ScheduleTableGrid]
const ScheduleTableGrid = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const getColor = (lectureId: string): string => {
      const lectures = [
        ...new Set(schedules.map(({ lecture }) => lecture?.id)),
      ];
      const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
      return colors[lectures.indexOf(lectureId) % colors.length];
    };

    const gridBackground = useMemo(() => (
      <GridBackground
        tableId={tableId}
        onScheduleTimeClick={onScheduleTimeClick}
      />
    ), [tableId, onScheduleTimeClick]);

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
        {gridBackground}

        {schedules.map((schedule, index) => {
          if (!schedule.lecture) return null;
          return (
            <DraggableSchedule
              key={`${schedule.lecture.title}-${index}`}
              id={`${tableId}:${index}`}
              data={schedule}
              bg={getColor(schedule.lecture.id)}
              onDeleteButtonClick={() =>
                onDeleteButtonClick?.(tableId, {
                  day: schedule.day,
                  time: schedule.range[0],
                })
              }
            />
          );
        })}
      </Grid>
    );
  }
);

const ScheduleTableContent = ({
  tableId,
  schedules,
  onScheduleTimeClick,
  onDeleteButtonClick,
}: Props) => {
  const { active } = useDndContext();
  const activeId = active?.id;
  const isActive = !!activeId;

  return (
    <Box
      position="relative"
      outline={isActive ? "5px dashed" : undefined}
      outlineColor="blue.300"
    >
      <ScheduleTableGrid
        tableId={tableId}
        schedules={schedules}
        onScheduleTimeClick={onScheduleTimeClick}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    </Box>
  );
};

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

    return {
      ...transform,
      x: Math.min(
        Math.max(
          Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH,
          minX
        ),
        maxX
      ),
      y: Math.min(
        Math.max(
          Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT,
          minY
        ),
        maxY
      ),
    };
  };
}

const modifiers = [createSnapModifier()];

// 🌟 [핵심] ScheduleTable Main Component
// 여기서 두 번째 인자(비교 함수)를 사용하여 불필요한 렌더링을 강제로 막습니다.
export const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    // Context에서 Dispatch 가져오기
    const { setSchedulesMap } = useScheduleDispatch();

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      })
    );

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        const { active, delta } = event;
        const { x, y } = delta;
        const [, indexStr] = String(active.id).split(":");
        const index = Number(indexStr);

        const schedule = schedules[index];
        const nowDayIndex = DAY_LABELS.indexOf(
          schedule.day as (typeof DAY_LABELS)[number]
        );
        const moveDayIndex = Math.floor(x / 80);
        const moveTimeIndex = Math.floor(y / 30);

        setSchedulesMap((prev) => ({
          ...prev,
          [tableId]: prev[tableId].map((targetSchedule, targetIndex) => {
            if (targetIndex !== index) {
              return targetSchedule;
            }
            return {
              ...targetSchedule,
              day: DAY_LABELS[nowDayIndex + moveDayIndex],
              range: targetSchedule.range.map((time) => time + moveTimeIndex),
            };
          }),
        }));
      },
      [schedules, setSchedulesMap, tableId]
    );

    return (
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
        modifiers={modifiers}
      >
        <ScheduleTableContent
          tableId={tableId}
          schedules={schedules}
          onScheduleTimeClick={onScheduleTimeClick}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      </DndContext>
    );
  },
  // 이전 Props와 다음 Props를 비교하여, 
  // 1) tableId가 같고
  // 2) schedules 참조가 같고 (내용이 안 변했으면)
  // 3) 핸들러들도 같다면
  // => "true"를 반환하여 리렌더링을 차단합니다.
  (prevProps, nextProps) => {
    return (
      prevProps.tableId === nextProps.tableId &&
      prevProps.schedules === nextProps.schedules &&
      prevProps.onScheduleTimeClick === nextProps.onScheduleTimeClick &&
      prevProps.onDeleteButtonClick === nextProps.onDeleteButtonClick
    );
  }
);