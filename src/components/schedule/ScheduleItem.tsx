import { memo } from "react";
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

interface Props {
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
  listeners?: ReturnType<typeof useDraggable>["listeners"];
  attributes?: ReturnType<typeof useDraggable>["attributes"];
}

const ScheduleItem = memo(
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
  }: Props) => {
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
        <Popover isLazy>
          <PopoverTrigger>
            <Box as="span" display="block" w="full" h="full">
              <Text fontSize="sm" fontWeight="bold">
                {title}
              </Text>
              <Text fontSize="xs">{room}</Text>
            </Box>
          </PopoverTrigger>
          <PopoverContent onClick={(event) => event.stopPropagation()}>
            <PopoverArrow />
            <PopoverCloseButton />
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

ScheduleItem.displayName = "ScheduleItem";

export default ScheduleItem;
