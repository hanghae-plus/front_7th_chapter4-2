import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import ScheduleTable from './ScheduleTable.tsx';
import SearchDialog from '../search/SearchDialog.tsx';
import { useState } from 'react';
import { useScheduleStore } from './store/scheduleStore.ts';
import { useShallow } from 'zustand/shallow';

export const ScheduleTables = () => {
  const tableIds = useScheduleStore(
    useShallow((state) => Object.keys(state.schedulesMap)),
  );
  const duplicateTable = useScheduleStore((state) => state.duplicateTable);
  const removeTable = useScheduleStore((state) => state.removeTable);

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = tableIds.length === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">
                시간표 {index + 1}
              </Heading>
              <ButtonGroup size="sm" isAttached>
                <Button
                  colorScheme="green"
                  onClick={() => setSearchInfo({ tableId })}
                >
                  시간표 추가
                </Button>
                <Button
                  colorScheme="green"
                  mx="1px"
                  onClick={() => duplicateTable(tableId)}
                >
                  복제
                </Button>
                <Button
                  colorScheme="green"
                  isDisabled={disabledRemoveButton}
                  onClick={() => removeTable(tableId)}
                >
                  삭제
                </Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTable
              tableId={tableId}
              onScheduleTimeClick={(timeInfo) =>
                setSearchInfo({ tableId, ...timeInfo })
              }
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={() => setSearchInfo(null)}
      />
    </>
  );
};
