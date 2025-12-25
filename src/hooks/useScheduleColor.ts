import { useMemo } from 'react';
import { Schedule } from '../types';
import useAutoCallback from './useAutoCallback';

const COLORS = ['#fdd', '#ffd', '#dff', '#ddf', '#fdf', '#dfd'];

const useScheduleColor = (schedules: Schedule[]) => {
  const colorMap = useMemo(() => {
    const lectureIds = [...new Set(schedules.map((s) => s.lecture.id))];
    return new Map(
      lectureIds.map((id, index) => [id, COLORS[index % COLORS.length]]),
    );
  }, [schedules]);

  const getColor = useAutoCallback((lectureId: string) => {
    return colorMap.get(lectureId) || COLORS[0];
  });

  return getColor;
};

export default useScheduleColor;
