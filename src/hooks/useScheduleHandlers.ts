import { useMemo } from "react";
import { Schedule } from "../types.ts";
import { useScheduleContext } from "../ScheduleContext.tsx";
import { filterScheduleByTime } from "../utils/scheduleUtils.ts";

interface UseScheduleHandlersProps {
  tableIds: string[];
  schedulesMap: Record<string, Schedule[]>;
}

interface UseScheduleHandlersResult {
  deleteHandlers: Record<
    string,
    (timeInfo: { day: string; time: number }) => void
  >;
}

/**
 * 시간표 관련 핸들러를 관리하는 훅
 */
export const useScheduleHandlers = ({
  tableIds,
  schedulesMap,
}: UseScheduleHandlersProps): UseScheduleHandlersResult => {
  const { setSchedules } = useScheduleContext();

  // 각 시간표별 삭제 핸들러를 메모이제이션하여 안정화
  const deleteHandlers = useMemo(() => {
    const handlers: Record<
      string,
      (timeInfo: { day: string; time: number }) => void
    > = {};

    tableIds.forEach((tableId) => {
      handlers[tableId] = ({ day, time }: { day: string; time: number }) => {
        // 해당 시간표만 독립적으로 업데이트
        const currentSchedules = schedulesMap[tableId] || [];
        const newSchedules = filterScheduleByTime(currentSchedules, day, time);

        // 필터링 결과가 같으면 업데이트하지 않음
        if (newSchedules.length !== currentSchedules.length) {
          setSchedules(tableId, newSchedules);
        }
      };
    });

    return handlers;
  }, [tableIds, schedulesMap, setSchedules]);

  return { deleteHandlers };
};
