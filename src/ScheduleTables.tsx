import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { ScheduleTable } from "./ScheduleTable.tsx";
import { useScheduleDispatch, useScheduleIds, useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo } from "react";
import { Schedule } from "./types.ts"; 

const ScheduleTableStructure = memo(
  ({
    tableId,
    index,
    schedules,
    disabledRemoveButton,
    onSearch,
    onDuplicate,
    onRemove,
    onScheduleTimeClick,
    onDeleteButtonClick,
  }: {
    tableId: string;
    index: number;
    schedules: Schedule[];
    disabledRemoveButton: boolean;
    onSearch: (id: string) => void;
    onDuplicate: (id: string) => void;
    onRemove: (id: string) => void;
    onScheduleTimeClick: (id: string, time: { day: string; time: number }) => void;
    onDeleteButtonClick: (id: string, time: { day: string; time: number }) => void;
  }) => {
    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={() => onSearch(tableId)}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={() => onDuplicate(tableId)}>
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={() => onRemove(tableId)}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={onScheduleTimeClick}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      </Stack>
    );
  }
);


const ScheduleTableContainer = memo(
  ({ tableId, index }: { tableId: string; index: number }) => {
    // (1) Context 구독 (여기서 리렌더링 발생)
    const { schedulesMap } = useScheduleContext();
    const schedules = schedulesMap[tableId] || [];
    
    // (2) Actions & Helper Data
    const { onSearch, onDuplicate, onRemove, onScheduleTimeClick, onDeleteButtonClick } = useScheduleDispatch();
    const { tableIds } = useScheduleIds();
    const disabledRemoveButton = tableIds.length === 1;

    // (3) 렌더링 위임
    // 여기서 핵심: schedulesMap이 바뀌어 이 컴포넌트가 실행되더라도,
    // table-1의 'schedules' 배열 참조값이 같다면
    // ScheduleTableStructure는 memo 덕분에 리렌더링되지 않습니다.
    return (
      <ScheduleTableStructure
        tableId={tableId}
        index={index}
        schedules={schedules}
        disabledRemoveButton={disabledRemoveButton}
        onSearch={onSearch}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
        onScheduleTimeClick={onScheduleTimeClick}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    );
  }
);

export const ScheduleTables = () => {
  const { tableIds } = useScheduleIds();
  const { searchInfo } = useScheduleContext();
  const { onCloseSearch } = useScheduleDispatch();

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTableContainer
            key={tableId}
            tableId={tableId}
            index={index}
          />
        ))}
      </Flex>
      <SearchDialog
        searchInfo={searchInfo}
        onClose={onCloseSearch}
      />
    </>
  );
};