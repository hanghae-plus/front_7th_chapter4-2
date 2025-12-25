import { Box, Text } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";

import { CellSize } from "@/constants";
import { ScheduleDragData } from "@/types";

function DragOverlayContent() {
  const { active } = useDndContext();

  if (!active?.data.current) return null;

  const { schedule, bg } = active.data.current as ScheduleDragData;
  const size = schedule.range.length;

  return (
    <Box
      width={`${CellSize.WIDTH - 1}px`}
      height={`${CellSize.HEIGHT * size - 1}px`}
      bg={bg}
      p={1}
      boxSizing="border-box"
      cursor="grabbing"
      boxShadow="lg"
    >
      <Text fontSize="sm" fontWeight="bold">
        {schedule.lecture.title}
      </Text>
      <Text fontSize="xs">{schedule.room}</Text>
    </Box>
  );
}

export default DragOverlayContent;
