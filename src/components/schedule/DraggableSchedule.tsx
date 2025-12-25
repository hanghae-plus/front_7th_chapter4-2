import { memo } from 'react';
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
  useDisclosure,
} from '@chakra-ui/react';
import { DraggableAttributes, useDraggable } from '@dnd-kit/core';
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities';
import { CSS } from '@dnd-kit/utilities';
import { Schedule } from '../../types';
import { CellSize, DAY_LABELS } from '../../constants';
import useAutoCallback from '../../hooks/useAutoCallback';

interface DraggableScheduleProps {
  id: string;
  schedule: Schedule;
  bg: string;
  day: string;
  time: number;
  onDelete: (day: string, time: number) => void;
}

// 과목 Box만 담당하는 순수 컴포넌트
interface ScheduleBoxProps {
  lecture: { title: string };
  room?: string;
  bg: string;
  left: number;
  top: number;
  width: number;
  height: number;
  setNodeRef: (node: HTMLElement | null) => void;
  transform: string | undefined;
  listeners: SyntheticListenerMap | undefined;
  attributes: DraggableAttributes;
  onClick: () => void;
}

const ScheduleBox = memo(
  ({
    lecture,
    room,
    bg,
    left,
    top,
    width,
    height,
    setNodeRef,
    transform,
    listeners,
    attributes,
    onClick,
  }: ScheduleBoxProps) => (
    <Box
      position="absolute"
      left={`${left}px`}
      top={`${top}px`}
      width={`${width}px`}
      height={`${height}px`}
      bg={bg}
      p={1}
      boxSizing="border-box"
      cursor="pointer"
      ref={setNodeRef}
      transform={transform}
      onClick={onClick}
      {...listeners}
      {...attributes}
    >
      <Text fontSize="sm" fontWeight="bold">
        {lecture.title}
      </Text>
      <Text fontSize="xs">{room}</Text>
    </Box>
  ),
  (prev, next) => {
    return (
      prev.lecture.title === next.lecture.title &&
      prev.room === next.room &&
      prev.bg === next.bg &&
      prev.left === next.left &&
      prev.top === next.top &&
      prev.width === next.width &&
      prev.height === next.height &&
      prev.transform === next.transform
    );
  },
);

const DraggableSchedule = memo(
  ({ id, schedule, bg, day, time, onDelete }: DraggableScheduleProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { range, room, lecture } = schedule;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });

    const handleDelete = useAutoCallback(() => {
      onDelete(day, time);
      onClose();
    });

    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    // 위치/크기 계산
    const left = 120 + CellSize.WIDTH * leftIndex + 1;
    const top = 40 + topIndex * CellSize.HEIGHT + 1;
    const width = CellSize.WIDTH - 1;
    const height = CellSize.HEIGHT * size - 1;

    return (
      <>
        <ScheduleBox
          lecture={lecture}
          room={room}
          bg={bg}
          left={left}
          top={top}
          width={width}
          height={height}
          setNodeRef={setNodeRef}
          transform={CSS.Translate.toString(transform)}
          listeners={listeners}
          attributes={attributes}
          onClick={onOpen}
        />
        {isOpen && (
          <Popover isOpen onClose={onClose} closeOnBlur>
            <PopoverTrigger>
              <Box
                position="absolute"
                left={`${left}px`}
                top={`${top}px`}
                width={`${width}px`}
                height={`${height}px`}
                pointerEvents="none"
              />
            </PopoverTrigger>
            <PopoverContent onClick={(e) => e.stopPropagation()}>
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
        )}
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.bg === nextProps.bg &&
      prevProps.day === nextProps.day &&
      prevProps.time === nextProps.time &&
      prevProps.schedule.lecture.id === nextProps.schedule.lecture.id &&
      prevProps.schedule.range.length === nextProps.schedule.range.length
    );
  },
);

export default DraggableSchedule;
