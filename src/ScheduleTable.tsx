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
} from '@chakra-ui/react';
import { CellSize, DAY_LABELS, 분 } from './constants.ts';
import { Schedule } from './types.ts';
import { fill2, parseHnM } from './utils.ts';
import { useDndContext, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ComponentProps, Fragment, memo, useCallback, useMemo } from 'react';
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

// 정적 그리드 - 스케줄 데이터와 무관하게 항상 동일하므로 memo로 분리
interface GridProps {
  onCellClick?: (info: { day: string; time: number }) => void;
}

// 드래그 중인 테이블 하이라이트를 위한 래퍼 컴포넌트
interface OutlineWrapperProps {
  tableId: string;
  children: React.ReactNode;
}

const DragHighlightWrapper = memo(
  ({ tableId, children }: OutlineWrapperProps) => {
    const { active } = useDndContext();

    const isCurrentTableDragging = useMemo(() => {
      if (!active?.id) return false;
      const [draggedTableId] = String(active.id).split(':');
      return draggedTableId === tableId;
    }, [active?.id, tableId]);

    return (
      <Box
        position="relative"
        outline={isCurrentTableDragging ? '5px dashed' : undefined}
        outlineColor="blue.300"
      >
        {children}
      </Box>
    );
  }
);

const StaticTableGrid = memo(({ onCellClick }: GridProps) => (
  <Grid
    templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
    templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
    bg="white"
    fontSize="sm"
    textAlign="center"
    outline="1px solid"
    outlineColor="gray.300"
  >
    <GridItem borderColor="gray.300" bg="gray.100">
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
    {TIMES.map((time, idx) => (
      <Fragment key={`row-${idx}`}>
        <GridItem
          borderTop="1px solid"
          borderColor="gray.300"
          bg={idx >= 18 ? 'gray.200' : 'gray.100'}
        >
          <Flex justifyContent="center" alignItems="center" h="full">
            <Text fontSize="xs">
              {fill2(idx + 1)} ({time})
            </Text>
          </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
          <GridItem
            key={`${day}-${idx}`}
            borderWidth="1px 0 0 1px"
            borderColor="gray.300"
            bg={idx >= 18 ? 'gray.100' : 'white'}
            cursor="pointer"
            _hover={{ bg: 'yellow.100' }}
            onClick={() => onCellClick?.({ day, time: idx + 1 })}
          />
        ))}
      </Fragment>
    ))}
  </Grid>
));

// 메인 ScheduleTable 컴포넌트 - memo로 래핑하여 불필요한 리렌더링 방지
const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    // 강의 ID별 색상 맵 생성
    const colorByLectureId = useMemo(() => {
      const uniqueIds = [...new Set(schedules.map((s) => s.lecture.id))];
      const palette = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
      const mapping: Record<string, string> = {};
      uniqueIds.forEach((id, i) => {
        mapping[id] = palette[i % palette.length];
      });
      return mapping;
    }, [schedules]);

    const resolveColor = useCallback(
      (lectureId: string) => colorByLectureId[lectureId] ?? '#fff',
      [colorByLectureId]
    );

    return (
      <DragHighlightWrapper tableId={tableId}>
        <StaticTableGrid onCellClick={onScheduleTimeClick} />

        {schedules.map((schedule, idx) => (
          <DraggableSchedule
            key={`${schedule.lecture.id}-${idx}`}
            id={`${tableId}:${idx}`}
            data={schedule}
            bg={resolveColor(schedule.lecture.id)}
            onDeleteButtonClick={onDeleteButtonClick}
          />
        ))}
      </DragHighlightWrapper>
    );
  }
);

// React.memo로 메모이제이션하여 드래그 시 불필요한 리렌더링 방지
const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
    }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    // 삭제 핸들러를 useCallback으로 메모이제이션
    const handleDelete = useCallback(() => {
      onDeleteButtonClick?.({ day, time: range[0] });
    }, [onDeleteButtonClick, day, range]);

    return (
      <Popover>
        <PopoverTrigger>
          <Box
            position="absolute"
            left={`${120 + CellSize.WIDTH * leftIndex + 1}px`}
            top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
            width={CellSize.WIDTH - 1 + 'px'}
            height={CellSize.HEIGHT * size - 1 + 'px'}
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
            <Button colorScheme="red" size="xs" onClick={handleDelete}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  }
);

export default ScheduleTable;
