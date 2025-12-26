import { Flex } from '@chakra-ui/react';
import { lazy, Suspense, useDeferredValue, useMemo, useState } from 'react';
import { useScheduleContext } from '../../contexts/ScheduleContext.ts';
import useAutoCallback from '../../hooks/useAutoCallback.ts';
import { useScheduleBoard } from '../../hooks/useScheduleBoard.ts';
import ScheduleBoard from './ScheduleBoard.tsx';

const SearchDialog = lazy(() => import('../search/SearchDialog.tsx'));

const SchedulePage = () => {
  const schedulesMap = useScheduleContext();
  const { duplicateBoard, removeBoard, deleteSchedule } = useScheduleBoard();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);
  const deferredSchedulesMap = useDeferredValue(schedulesMap);
  const isRemoveDisabled = useMemo(() => Object.keys(schedulesMap).length === 1, [schedulesMap]);

  const handleOpenSearchDialog = useAutoCallback((tableId: string) => setSearchInfo({ tableId }));
  const handleCloseSearchDialog = useAutoCallback(() => setSearchInfo(null));
  const handleEmptyTimeCellClick = useAutoCallback(
    (tableId: string, timeInfo: { day: string; time: number }) =>
      setSearchInfo({ tableId, ...timeInfo }),
  );
  const handleDuplicateBoard = useAutoCallback(duplicateBoard);
  const handleRemoveBoard = useAutoCallback(removeBoard);
  const handleScheduleDelete = useAutoCallback(deleteSchedule);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(deferredSchedulesMap).map(([tableId, schedules], index) => (
          <ScheduleBoard
            key={tableId}
            index={index}
            tableId={tableId}
            schedules={schedules}
            isRemoveDisabled={isRemoveDisabled}
            onOpenSearchDialog={handleOpenSearchDialog}
            onDuplicateBoard={handleDuplicateBoard}
            onRemoveBoard={handleRemoveBoard}
            onEmptyTimeCellClick={handleEmptyTimeCellClick}
            onScheduleDelete={handleScheduleDelete}
          />
        ))}
      </Flex>
      {searchInfo && (
        <Suspense fallback={null}>
          <SearchDialog searchInfo={searchInfo} onClose={handleCloseSearchDialog} />
        </Suspense>
      )}
    </>
  );
};

export default SchedulePage;
