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
import { Fragment, memo, useCallback, useMemo } from "react";
import { useScheduleContext } from "./ScheduleContext.tsx";

interface Props {
  tableId: string;
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

const ActiveTableOutline = memo(({ tableId }: { tableId: string }) => {
  const { active } = useDndContext();
  const activeTableId = active ? String(active.id).split(":")[0] : null;
  const isTargetTable = activeTableId === tableId;

  if (!isTargetTable) return null;

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

const ScheduleTable = memo(
  ({ tableId, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const { schedulesMap } = useScheduleContext();

    const schedules = useMemo(
      () => schedulesMap[tableId] || [],
      [schedulesMap, tableId]
    );

    const lectures = useMemo(
      () => [...new Set(schedules.map(({ lecture }) => lecture.id))],
      [schedules]
    );

    const getColor = useCallback(
      (lectureId: string) => {
        const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
        return colors[lectures.indexOf(lectureId) % colors.length];
      },
      [lectures]
    );

    return (
      <Box position="relative">
        <ActiveTableOutline tableId={tableId} />

        <Grid
          templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
          templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
          bg="white"
          fontSize="sm"
          textAlign="center"
          outline="1px solid"
          outlineColor="gray.300"
        >
          {/* 교시 헤더 */}
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

          {/* 시간표 본문 Grid */}
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
                    onScheduleTimeClick?.({ day, time: timeIndex + 1 })
                  }
                />
              ))}
            </Fragment>
          ))}
        </Grid>

        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.id}-${schedule.day}-${schedule.range[0]}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            onDeleteButtonClick={() =>
              onDeleteButtonClick?.({
                day: schedule.day,
                time: schedule.range[0],
              })
            }
          />
        ))}
      </Box>
    );
  },
  (prev, next) => prev.tableId === next.tableId
);

const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule; bg: string } & {
    onDeleteButtonClick: () => void;
  }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform, isDragging } =
      useDraggable({ id });

    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    const style = {
      transform: CSS.Translate.toString(transform),
      position: "absolute" as const,
      left: `${120 + CellSize.WIDTH * leftIndex + 1}px`,
      top: `${40 + (topIndex * CellSize.HEIGHT + 1)}px`,
      width: `${CellSize.WIDTH - 1}px`,
      height: `${CellSize.HEIGHT * size - 1}px`,
      backgroundColor: bg,
      opacity: isDragging ? 0.5 : 1,
      zIndex: isDragging ? 10 : 1,
      cursor: "grab",
      boxSizing: "border-box" as const,
      padding: "4px",
    };

    return (
      <Popover>
        <PopoverTrigger>
          <Box ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <Text fontSize="sm" fontWeight="bold" noOfLines={1}>
              {lecture.title}
            </Text>
            <Text fontSize="xs" noOfLines={1}>
              {room}
            </Text>
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
  (prev, next) => {
    return (
      prev.id === next.id && prev.bg === next.bg && prev.data === next.data
    );
  }
);

export default ScheduleTable;
