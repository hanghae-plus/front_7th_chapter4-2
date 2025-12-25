import { memo, useMemo } from 'react';
import { Box } from '@chakra-ui/react';
import { useDndContext } from '@dnd-kit/core';
import { Schedule } from '../../types';
import useAutoCallback from '../../hooks/useAutoCallback';
import ScheduleGrid from './ScheduleGrid';
import DraggableSchedule from './DraggableSchedule';

// 색상 팔레트
const COLORS = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];

// Presenter - memo 보호, Context 없음
interface PresenterProps {
  tableId: string;
  schedules: Schedule[];
  colorMap: Map<string, string>;
  isDragging: boolean;
  onCellClick: (day: string, time: number) => void;
  onDelete: (day: string, time: number) => void;
}

const ScheduleTablePresenter = memo(
  ({
    tableId,
    schedules,
    colorMap,
    isDragging,
    onCellClick,
    onDelete,
  }: PresenterProps) => {
    return (
      <Box
        position="relative"
        outline={isDragging ? '5px dashed' : undefined}
        outlineColor="blue.300"
      >
        <ScheduleGrid onCellClick={onCellClick} />

        {schedules.map((schedule, index) => (
          <DraggableSchedule
            key={`${schedule.lecture.id}-${schedule.day}-${schedule.range[0]}`}
            id={`${tableId}:${index}`}
            schedule={schedule}
            bg={colorMap.get(schedule.lecture.id) || COLORS[0]}
            onDelete={onDelete}
            day={schedule.day}
            time={schedule.range[0]}
          />
        ))}
      </Box>
    );
  },
  (prev, next) => {
    if (prev.tableId !== next.tableId) return false;
    if (prev.isDragging !== next.isDragging) return false;
    // 참조 비교 우선 - 배열 참조가 같으면 내용도 같음
    if (prev.schedules === next.schedules && prev.colorMap === next.colorMap) {
      return true;
    }
    // 참조가 다르면 내용 비교
    if (prev.colorMap !== next.colorMap) return false;
    if (prev.schedules.length !== next.schedules.length) return false;
    return prev.schedules.every((s, i) => s === next.schedules[i]);
  },
);

// Wrapper - Context 구독 담당
interface ScheduleTableProps {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick: (day: string, time: number) => void;
  onDeleteButtonClick: (day: string, time: number) => void;
}

const ScheduleTable = memo(
  ({
    tableId,
    schedules,
    onScheduleTimeClick,
    onDeleteButtonClick,
  }: ScheduleTableProps) => {
    const { active } = useDndContext();
    const isDragging = active !== null;

    // 색상 맵 메모이제이션
    const colorMap = useMemo(() => {
      const lectureIds = [...new Set(schedules.map((s) => s.lecture.id))];
      return new Map(
        lectureIds.map((id, i) => [id, COLORS[i % COLORS.length]]),
      );
    }, [schedules]);

    // 핸들러
    const handleCellClick = useAutoCallback((day: string, time: number) => {
      onScheduleTimeClick(day, time);
    });

    const handleDelete = useAutoCallback((day: string, time: number) => {
      onDeleteButtonClick(day, time);
    });

    return (
      <ScheduleTablePresenter
        tableId={tableId}
        schedules={schedules}
        colorMap={colorMap}
        isDragging={isDragging}
        onCellClick={handleCellClick}
        onDelete={handleDelete}
      />
    );
  },
  (prev, next) => {
    // 참조 비교 우선!
    return prev.tableId === next.tableId && prev.schedules === next.schedules;
  },
);

export default ScheduleTable;
