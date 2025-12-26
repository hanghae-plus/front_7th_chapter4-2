import { useScheduleCommandContext } from "../ScheduleContext.tsx";
import { Lecture } from "../types.ts";
import { parseSchedule } from "../utils.ts";
import { useCallbackRef } from "@chakra-ui/react";

interface UseAddScheduleProps {
  tableId?: string;
  onComplete?: () => void;
}

export const useAddSchedule = (props: UseAddScheduleProps) => {
  const { tableId, onComplete } = props;

  const setSchedulesMap = useScheduleCommandContext();

  return useCallbackRef((lecture: Lecture) => {
    if (!tableId) {
      return;
    }

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));

    onComplete?.();
  });
};
