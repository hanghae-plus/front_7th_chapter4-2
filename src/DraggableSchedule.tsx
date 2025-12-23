import React from "react";
import { Box, Button, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverTrigger, Text } from "@chakra-ui/react";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { Schedule } from "./types.ts";

interface Props {
  id: string;
  data: Schedule;
  bg?: string;
  onDeleteButtonClick: () => void;
}

const DraggableScheduleInner = ({ id, data, bg, onDeleteButtonClick }: Props) => {
  const { day, range, room, lecture } = data;
  const { attributes, setNodeRef, listeners, transform } = useDraggable({ id });
  const leftIndex = DAY_LABELS.indexOf(day as typeof DAY_LABELS[number]);
  const topIndex = range[0] - 1;
  const size = range.length;

  return (
    <Popover>
      <PopoverTrigger>
        <Box
          position="absolute"
          left={`${120 + (CellSize.WIDTH * leftIndex) + 1}px`}
          top={`${40 + (topIndex * CellSize.HEIGHT + 1)}px`}
          width={(CellSize.WIDTH - 1) + "px"}
          height={(CellSize.HEIGHT * size - 1) + "px"}
          bg={bg}
          p={1}
          boxSizing="border-box"
          cursor="pointer"
          ref={setNodeRef}
          transform={transform ? CSS.Translate.toString(transform) : undefined}
          {...listeners}
          {...attributes}
        >
          <Text fontSize="sm" fontWeight="bold">{lecture.title}</Text>
          <Text fontSize="xs">{room}</Text>
        </Box>
      </PopoverTrigger>
      <PopoverContent onClick={event => event.stopPropagation()}>
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
};

// memoize to avoid re-renders unless props identity changes
export default React.memo(DraggableScheduleInner, (prev, next) => {
  return prev.id === next.id && prev.data === next.data && prev.bg === next.bg && prev.onDeleteButtonClick === next.onDeleteButtonClick;
});
