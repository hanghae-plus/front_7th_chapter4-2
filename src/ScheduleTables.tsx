import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import ScheduleTable from './components/schedule-table';
import SearchDialog from './components/search-dialog';
import { memo, useCallback, useState } from 'react';
import ScheduleDndProvider from './ScheduleDndProvider.tsx';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { tableIdsAtom, getScheduleAtom, addTableAtom, removeTableAtom } from './store/scheduleAtoms';

interface ScheduleTableItemProps {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  onSearchClick: (tableId: string, day?: string, time?: number) => void;
}

const ScheduleTableItem = memo(({ tableId, index, disabledRemoveButton, onSearchClick }: ScheduleTableItemProps) => {
  const [schedules, setSchedules] = useAtom(getScheduleAtom(tableId));
  const addTable = useSetAtom(addTableAtom);
  const removeTable = useSetAtom(removeTableAtom);

  const handleScheduleTimeClick = useCallback(
    (timeInfo: { day: string; time: number }) => onSearchClick(tableId, timeInfo.day, timeInfo.time),
    [tableId, onSearchClick],
  );

  const handleDeleteButtonClick = useCallback(
    ({ day, time }: { day: string; time: number }) => {
      setSchedules((prev) => prev.filter((schedule) => schedule.day !== day || !schedule.range.includes(time)));
    },
    [setSchedules],
  );

  return (
    <Stack width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">
          시간표 {index + 1}
        </Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => onSearchClick(tableId)}>
            시간표 추가
          </Button>
          <Button colorScheme="green" mx="1px" onClick={() => addTable(tableId)}>
            복제
          </Button>
          <Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={() => removeTable(tableId)}>
            삭제
          </Button>
        </ButtonGroup>
      </Flex>
      <ScheduleDndProvider tableId={tableId}>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={handleScheduleTimeClick}
          onDeleteButtonClick={handleDeleteButtonClick}
        />
      </ScheduleDndProvider>
    </Stack>
  );
});

export const ScheduleTables = () => {
  const tableIds = useAtomValue(tableIdsAtom);
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = tableIds.length === 1;

  const handleSearchClick = useCallback(
    (tableId: string, day?: string, time?: number) => setSearchInfo({ tableId, day, time }),
    [],
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTableItem
            key={tableId}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onSearchClick={handleSearchClick}
          />
        ))}
      </Flex>
      {searchInfo && <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />}
    </>
  );
};
