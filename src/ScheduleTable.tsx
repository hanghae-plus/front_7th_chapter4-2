import { memo } from "react";
import { Box } from "@chakra-ui/react";
import { Schedule } from "./types.ts";
import { useScheduleTable } from "./hooks/useScheduleTable.ts";
import { DragOutline } from "./components/ScheduleTable/DragOutline.tsx";
import { ScheduleGrid } from "./components/ScheduleTable/ScheduleGrid.tsx";
import { DraggableSchedule } from "./components/ScheduleTable/DraggableSchedule.tsx";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

/**
 * 시간표 컴포넌트
 * 비즈니스 로직은 useScheduleTable 훅에서 처리
 */
const ScheduleTable = ({
  tableId,
  schedules,
  onScheduleTimeClick,
  onDeleteButtonClick,
}: Props) => {
  const { scheduleBgs, deleteHandlers, handleCellClick } = useScheduleTable({
    schedules,
    onScheduleTimeClick,
    onDeleteButtonClick,
  });

  return (
    <Box position="relative">
      <DragOutline />
      <ScheduleGrid onCellClick={handleCellClick} />

      {schedules.map((schedule, index) => (
        <DraggableSchedule
          key={`${schedule.lecture.title}-${index}`}
          id={`${tableId}:${index}`}
          data={schedule}
          bg={scheduleBgs[index]}
          onDeleteButtonClick={deleteHandlers[index]}
        />
      ))}
    </Box>
  );
};

// React.memo로 컴포넌트 메모이제이션하여 불필요한 리렌더링 방지
// schedules 배열 참조가 같거나, 각 schedule 객체의 참조가 모두 같으면 리렌더링하지 않음
export default memo(ScheduleTable, (prevProps, nextProps) => {
  // tableId가 다르면 리렌더링
  if (prevProps.tableId !== nextProps.tableId) {
    return false;
  }

  // schedules 배열 참조가 같으면 리렌더링 안 함
  if (prevProps.schedules === nextProps.schedules) {
    return true;
  }

  // schedules 배열의 길이가 다르면 리렌더링
  if (prevProps.schedules.length !== nextProps.schedules.length) {
    return false;
  }

  // 각 schedule 객체의 참조를 비교
  // 모든 schedule 객체의 참조가 같으면 리렌더링 안 함
  // (updateScheduleOnDragEnd에서 변경되지 않은 schedule 객체의 참조를 유지하므로)
  for (let i = 0; i < prevProps.schedules.length; i++) {
    if (prevProps.schedules[i] !== nextProps.schedules[i]) {
      // 하나라도 참조가 다르면 리렌더링
      return false;
    }
  }

  // 모든 schedule 객체의 참조가 같으면 리렌더링 안 함
  return true;
});
