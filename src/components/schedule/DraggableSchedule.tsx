import { memo, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";

import { Schedule } from "@/types";
import { calculateSchedulePosition } from "@/lib/schedule-grid";
import ScheduleItem from "./ScheduleItem";

interface Props {
  id: string;
  data: Schedule;
  bg: string;
  tableId: string;
  onDelete?: (tableId: string, timeInfo: { day: string; time: number }) => void;
}

const DraggableSchedule = memo(
  ({ id, data, bg, tableId, onDelete }: Props) => {
    const { day, range, room, lecture } = data;
    const { attributes, setNodeRef, listeners } = useDraggable({
      id,
      data: { schedule: data, bg },
    });

    const { left, top, width, height } = calculateSchedulePosition(day, range);

    const handleDelete = useCallback(() => {
      onDelete?.(tableId, { day, time: range[0] });
    }, [onDelete, tableId, day, range]);

    return (
      <ScheduleItem
        scheduleId={id}
        left={left}
        top={top}
        width={width}
        height={height}
        bg={bg}
        title={lecture.title}
        room={room}
        onDelete={handleDelete}
        setNodeRef={setNodeRef}
        listeners={listeners}
        attributes={attributes}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.bg === nextProps.bg &&
      prevProps.data.day === nextProps.data.day &&
      prevProps.data.range[0] === nextProps.data.range[0] &&
      prevProps.data.range.length === nextProps.data.range.length &&
      prevProps.data.lecture.id === nextProps.data.lecture.id
    );
  }
);

DraggableSchedule.displayName = "DraggableSchedule";

export default DraggableSchedule;
