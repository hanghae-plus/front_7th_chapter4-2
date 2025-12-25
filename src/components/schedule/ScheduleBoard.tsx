import { Flex, Heading, Stack } from '@chakra-ui/react';
import { memo } from 'react';
import ScheduleDndProvider from '../../contexts/ScheduleDndProvider';
import useAutoCallback from '../../hooks/useAutoCallback';
import { Schedule } from '../../types/schedule';
import ScheduleControls from './ScheduleControls';
import ScheduleTable from './ScheduleTable';

interface ScheduleBoardProps {
  index: number;
  tableId: string;
  schedules: Schedule[];
  isRemoveDisabled: boolean;
  onOpenSearchDialog: (tableId: string) => void;
  onDuplicateBoard: (tableId: string) => void;
  onRemoveBoard: (tableId: string) => void;
  onEmptyTimeCellClick: (tableId: string, timeInfo: { day: string; time: number }) => void;
  onScheduleDelete: (tableId: string, timeInfo: { day: string; time: number }) => void;
}

const ScheduleBoard = memo(
  ({
    index,
    tableId,
    schedules,
    isRemoveDisabled,
    onOpenSearchDialog,
    onDuplicateBoard,
    onRemoveBoard,
    onEmptyTimeCellClick,
    onScheduleDelete,
  }: ScheduleBoardProps) => {
    const handleScheduleTimeClick = useAutoCallback((timeInfo: { day: string; time: number }) => {
      onEmptyTimeCellClick(tableId, timeInfo);
    });
    const handleDeleteButtonClick = useAutoCallback((timeInfo: { day: string; time: number }) => {
      onScheduleDelete(tableId, timeInfo);
    });

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ScheduleControls
            tableId={tableId}
            onOpenSearchDialog={onOpenSearchDialog}
            onDuplicateBoard={onDuplicateBoard}
            onRemoveBoard={onRemoveBoard}
            isRemoveDisabled={isRemoveDisabled}
          />
        </Flex>
        <ScheduleDndProvider>
          <ScheduleTable
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  },
);

export default ScheduleBoard;
