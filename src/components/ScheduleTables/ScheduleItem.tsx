import { ComponentPropsWithRef, memo } from "react";
import { Box } from "@chakra-ui/react";
import { Schedule } from "../../types";
import { DAY_LABELS, CellSize } from "../../constants";

export const ScheduleItem = memo(
  ({
    data,
    bg,
    ref,
    ...props
  }: { data: Schedule } & ComponentPropsWithRef<typeof Box>) => {
    const { day, range, room, lecture } = data;
    const leftIndex = DAY_LABELS.indexOf(day as (typeof DAY_LABELS)[number]);
    const topIndex = range[0] - 1;
    const size = range.length;

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
        ref={ref}
        {...props}
      >
        <p className="title">{lecture.title}</p>
        <p className="room">{room}</p>
      </Box>
    );
  }
);

ScheduleItem.displayName = "ScheduleItem";
