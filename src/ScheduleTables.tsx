import { Flex } from '@chakra-ui/react';
import { useAtomValue } from 'jotai';
import { useCallback, useState } from 'react';
import { ScheduleTableLayout } from './components/schedule-table/ScheduleTableLayout.tsx';
import { tableIdsAtom } from './store/scheduleAtoms';
import SearchDialog from './components/search-dialog/index.tsx';

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
          <ScheduleTableLayout
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
