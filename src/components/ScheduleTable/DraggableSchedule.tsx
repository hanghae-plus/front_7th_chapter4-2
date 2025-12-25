import { memo, useCallback, useRef, useEffect } from "react";
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
} from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CellSize, DAY_LABELS } from "../../constants.ts";
import { Schedule } from "../../types.ts";

interface DraggableScheduleProps {
  id: string;
  data: Schedule;
  bg: string;
  onDeleteButtonClick: () => void;
}

/**
 * 드래그 가능한 스케줄 블록 컴포넌트
 */
export const DraggableSchedule = memo(
  ({ id, data, bg, onDeleteButtonClick }: DraggableScheduleProps) => {
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
    return (
      prevProps.id === nextProps.id &&
      prevProps.data === nextProps.data &&
      prevProps.bg === nextProps.bg
    );
  }
);
