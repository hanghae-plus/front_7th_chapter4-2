import { Box } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";
import { useCallback, useMemo } from "react";
import { Schedule } from "../../types.ts";
import { ScheduleGridHeader } from "./ScheduleGridHeader.tsx";
import { ScheduleGridBody } from "./ScheduleGridBody.tsx";
import { DraggableScheduleItem } from "./DraggableScheduleItem.tsx";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const SCHEDULE_COLORS = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];

const getScheduleColor = (lectureId: string, schedules: Schedule[]): string => {
  const lectures = [...new Set(schedules.map(({ lecture }) => lecture.id))];
  return SCHEDULE_COLORS[lectures.indexOf(lectureId) % SCHEDULE_COLORS.length];
};

const ScheduleTable = ({
  tableId,
  schedules,
  onScheduleTimeClick,
  onDeleteButtonClick,
}: Props) => {
  const dndContext = useDndContext();

  const activeTableId = useMemo(() => {
    const activeId = dndContext.active?.id;
    if (activeId) {
      return String(activeId).split(":")[0];
    }
    return null;
  }, [dndContext.active?.id]);

  const handleScheduleTimeClick = useCallback(
    (timeInfo: { day: string; time: number }) => {
      onScheduleTimeClick?.(timeInfo);
    },
    [onScheduleTimeClick]
  );

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
      <ScheduleGridHeader />
      <ScheduleGridBody onScheduleTimeClick={handleScheduleTimeClick} />

      {schedules.map((schedule, index) => (
        <DraggableScheduleItem
          key={`${schedule.lecture.id}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={getScheduleColor(schedule.lecture.id, schedules)}
          onDeleteButtonClick={() => handleDeleteButtonClick(schedule)}
        />
      ))}
    </Box>
  );
};

export default ScheduleTable;
