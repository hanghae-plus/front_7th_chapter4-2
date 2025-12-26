import { Box } from '@chakra-ui/react';
import { useDndContext } from '@dnd-kit/core';
import { memo, useDeferredValue, useMemo } from 'react';
import { Schedule } from '../../types/schedule.ts';

import { createScheduleColorMap } from '../../utils/schedule.ts';
import ScheduleGrid from './ScheduleGrid.tsx';
import ScheduleItem from './ScheduleItem.tsx';

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick }: Props) => {
    const deferredSchedules = useDeferredValue(schedules);
    const colorsMap = useMemo(() => createScheduleColorMap(deferredSchedules), [deferredSchedules]);
    const getColor = (lectureId: string): string => colorsMap.get(lectureId)!;
    const dndContext = useDndContext();
    const activeTableId = useMemo(() => {
      const activeId = dndContext.active?.id;
      return activeId ? String(activeId).split(':')[0] : null;
    }, [dndContext.active?.id]);

    return (
      <Box
        position="relative"
        outline={activeTableId === tableId ? '5px dashed' : undefined}
        outlineColor="blue.300"
      >
        <ScheduleGrid onScheduleTimeClick={onScheduleTimeClick} />
        {deferredSchedules.map((schedule, index) => (
          <ScheduleItem
            key={`${schedule.lecture.title}-${index}`}
            id={`${tableId}:${index}`}
            data={schedule}
            bg={getColor(schedule.lecture.id)}
            onDeleteButtonClick={onDeleteButtonClick}
          />
        ))}
      </Box>
    );
  },
);

export default ScheduleTable;
