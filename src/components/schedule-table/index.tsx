import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from '@chakra-ui/react';
import { useDndContext, useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { ComponentProps, memo, useCallback, useMemo } from 'react';
import { CellSize, DAY_LABELS } from '../../constants/index.ts';
import { Schedule } from '../../types.ts';
import { ScheduleTableStatic } from './ScheduleTableStatic.tsx';
import { useAtomValue } from 'jotai';
import { getScheduleAtom } from '../../store/scheduleAtoms.ts';

interface Props {
  tableId: string;
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(({ tableId, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
  const schedules = useAtomValue(getScheduleAtom(tableId));

  const getColor = useCallback(
    (lectureId: string): string => {
      const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
      const colors = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];
      return colors[lectures.indexOf(lectureId) % colors.length];
    },
    [schedules],
  );

  const dndContext = useDndContext();

  const activeTableId = useMemo(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(':')[0];
    }
    return null;
  }, [dndContext.active?.id]);

  const handleDeleteButtonClick = useCallback(
    (schedule: Schedule) =>
      onDeleteButtonClick?.({
        day: schedule.day,
        time: schedule.range[0],
      }),
    [onDeleteButtonClick],
  );

  return (
    <Box position="relative" outline={activeTableId === tableId ? '5px dashed' : undefined} outlineColor="blue.300">
      <ScheduleTableStatic onClick={onScheduleTimeClick} />

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getColor(schedule.lecture.id)}
          onDeleteButtonClick={handleDeleteButtonClick}
        />
      ))}
    </Box>
  );
});

const DraggableSchedule = memo(
  ({
    id,
    data,
    bg,
    onDeleteButtonClick,
  }: { id: string; data: Schedule } & ComponentProps<typeof Box> & {
      onDeleteButtonClick: (schedule: Schedule) => void;
    }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    return (
      <Popover isLazy>
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
            <Button colorScheme="red" size="xs" onClick={() => onDeleteButtonClick(data)}>
              삭제
            </Button>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    );
  },
);

export default ScheduleTable;
