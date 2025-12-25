import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { lazy, Suspense, useCallback, useState } from 'react';

import { useScheduleContext, useScheduleCommand } from '@/contexts/schedule';
import ScheduleTable from './ScheduleTable';

const SearchDialog = lazy(() => import('@/components/search/SearchDialog'));

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleContext();
  const setSchedulesMap = useScheduleCommand();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const handleDuplicate = useCallback((targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  }, [setSchedulesMap]);

  const handleRemove = useCallback((targetId: string) => {
    setSchedulesMap((prev) => {
      const { [targetId]: _removed, ...rest } = prev;
      void _removed;
      return rest;
    });
  }, [setSchedulesMap]);

  const handleSearchOpen = useCallback((tableId: string) => {
    setSearchInfo({ tableId });
  }, []);

  const handleScheduleTimeClick = useCallback(
    (tableId: string, timeInfo: { day: string; time: number }) => {
      setSearchInfo({ tableId, ...timeInfo });
    },
    []
  );

  const handleDeleteButtonClick = useCallback(
    (tableId: string, { day, time }: { day: string; time: number }) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        ),
      }));
    },
    [setSchedulesMap]
  );

  const handleScheduleUpdate = useCallback(
    (tableId: string, index: number, newDay: string, newRange: number[]) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].map((schedule, i) =>
          i === index
            ? { ...schedule, day: newDay, range: newRange }
            : schedule
        ),
      }));
    },
    [setSchedulesMap]
  );

  const handleClose = useCallback(() => {
    setSearchInfo(null);
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <ButtonGroup size="sm" isAttached>
                <Button
                  colorScheme="green"
                  onClick={() => handleSearchOpen(tableId)}
                >
                  시간표 추가
                </Button>
                <Button
                  colorScheme="green"
                  mx="1px"
                  onClick={() => handleDuplicate(tableId)}
                >
                  복제
                </Button>
                <Button
                  colorScheme="green"
                  isDisabled={disabledRemoveButton}
                  onClick={() => handleRemove(tableId)}
                >
                  삭제
                </Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTable
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={handleScheduleTimeClick}
              onDeleteButtonClick={handleDeleteButtonClick}
              onScheduleUpdate={handleScheduleUpdate}
            />
          </Stack>
        ))}
      </Flex>
      {searchInfo && (
        <Suspense fallback={null}>
          <SearchDialog searchInfo={searchInfo} onClose={handleClose} />
        </Suspense>
      )}
    </>
  );
};
