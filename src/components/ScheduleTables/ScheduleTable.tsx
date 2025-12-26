import { Box, useCallbackRef } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { useCallback, useMemo } from "react";
import { Schedule } from "../../types";
import { ScheduleGrid } from "./ScheduleGrid";
import { SCHEDULE_COLORS } from "../../constants";
import { DraggableSchedule } from "./DraggableSchedule";

interface ScheduleTableProps {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = (props: ScheduleTableProps) => {
  const { tableId, schedules, onScheduleTimeClick, onDeleteButtonClick } =
    props;

  const getScheduleColor = (lectureId: string): string => {
    const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
    return SCHEDULE_COLORS[
      lectures.indexOf(lectureId) % SCHEDULE_COLORS.length
    ];
  };

  const dndContext = useDndContext();

  const activeTableId = useMemo(() => {
    const activeId = dndContext.active?.id;

    if (activeId) {
      return String(activeId).split(":")[0];
    }

    return null;
  }, [dndContext.active]);

  const handleDeleteButtonClick = useCallback(
    (schedule: Schedule) => {
      onDeleteButtonClick?.({
        day: schedule.day,
        time: schedule.range[0],
      });
    },
    [onDeleteButtonClick]
  );

  return (
    <Box
      position="relative"
      outline={activeTableId === tableId ? "5px dashed" : undefined}
      outlineColor="blue.300"
    >
      <ScheduleGrid onClick={useCallbackRef(onScheduleTimeClick)} />
      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getScheduleColor(schedule.lecture.id)}
          onDeleteButtonClick={() => handleDeleteButtonClick(schedule)}
        />
      ))}
    </Box>
  );
};

export default ScheduleTable;
