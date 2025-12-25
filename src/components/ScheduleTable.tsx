import { Box } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";

import React, { useCallback, useMemo } from "react";
import { useScheduleStore } from "../store/index.ts";
import { useShallow } from "zustand/react/shallow";
import { TableGrid } from "./TableGrid.tsx";
import { DraggableSchedule } from "./DraggableSchedule.tsx";

interface Props {
  tableId: string;
  onScheduleTimeClick?: ({
    tableId,
    day,
    time,
  }: {
    tableId: string;
    day: string;
    time: number;
  }) => void;
}

export const ScheduleTable = React.memo(
  ({ tableId, onScheduleTimeClick }: Props) => {
    const schedules = useScheduleStore(
      useShallow((state) => state.schedulesMap[tableId])
    );

    const getColor = useCallback(
      (lectureId: string): string => {
        const lectures = [
          ...new Set(schedules.map(({ lecture }) => lecture.id)),
        ];
        const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
        return colors[lectures.indexOf(lectureId) % colors.length];
      },
      [schedules]
    );

    const dndContext = useDndContext();

    const activeTableId = useMemo(() => {
      const activeId = dndContext.active?.id;
      return activeId ? String(activeId).split(":")[0] : null;
    }, [dndContext]);

    const handleScheduleTimeClick = useCallback(
      ({ day, time }: { day: string; time: number }) => {
        onScheduleTimeClick?.({ tableId, day, time });
      },
      [onScheduleTimeClick, tableId]
    );

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? "5px dashed" : undefined}
        outlineColor="blue.300"
      >
        <TableGrid onScheduleTimeClick={handleScheduleTimeClick} />
        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            getColor={getColor}
          />
        ))}
      </Box>
    );
  }
);
