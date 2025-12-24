import { useSetAtom } from 'jotai';
import { memo, useCallback } from 'react';
import { addTableAtom, getScheduleAtom, removeTableAtom } from '../../store/scheduleAtoms';
import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import ScheduleDndProvider from '../../ScheduleDndProvider';
import ScheduleTable from '.';

interface ScheduleTableLayoutProps {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  onSearchClick: (tableId: string, day?: string, time?: number) => void;
}

export const ScheduleTableLayout = memo(
  ({ tableId, index, disabledRemoveButton, onSearchClick }: ScheduleTableLayoutProps) => {
    const setSchedules = useSetAtom(getScheduleAtom(tableId));
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
            tableId={tableId}
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  },
);
