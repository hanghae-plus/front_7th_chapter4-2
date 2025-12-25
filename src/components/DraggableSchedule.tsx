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
import React, { useCallback } from "react";
import { CellSize, DAY_LABELS } from "../constants.ts";
import { useScheduleStore } from "../store";
import { CSS } from "@dnd-kit/utilities";
import { useDraggable } from "@dnd-kit/core";
import { Schedule } from "../types.ts";

const ScheduleContent = React.memo(
  ({
    lectureTitle,
    lectureRoom,
    onDelete,
  }: {
    lectureTitle: string;
    lectureRoom: string;
    onDelete: () => void;
  }) => {
    return (
      <Popover isLazy>
        <PopoverTrigger>
          <Box width="full" height="full">
            <Text fontSize="sm" fontWeight="bold">
              {lectureTitle}
            </Text>
            <Text fontSize="xs">{lectureRoom}</Text>
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
    );
  }
);

export const DraggableSchedule = React.memo(
  ({
    id,
    data,
    getColor,
  }: {
    id: string;
    data: Schedule;
    getColor: (lectureId: string) => string;
  }) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners, transform } = useDraggable({
      id,
    });
    const bg = getColor(lecture.id);
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

    const removeSchedule = useScheduleStore((state) => state.removeSchedule);
    const handleDeleteButtonClick = useCallback(() => {
      const [tableId] = id.split(":");
      removeSchedule(tableId, day, range[0]);
    }, [removeSchedule, id, day, range]);

    return (
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
        <ScheduleContent
          lectureTitle={lecture.title}
          lectureRoom={room ?? "미정"}
          onDelete={handleDeleteButtonClick}
        />
      </Box>
    );
  }
);
