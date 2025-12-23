import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { useCallback, useMemo, useState, memo } from "react";
import { Schedule } from "./types.ts";

export const ScheduleTables = () => {
  const { schedulesMap, getAllTableIds, addTable, removeTable, setSchedules } =
    useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  // tableIds를 메모이제이션하여 schedulesMap이 변경되어도 키가 같으면 재생성하지 않음
  const tableIds = useMemo(() => getAllTableIds(), [getAllTableIds]);
  const disabledRemoveButton = tableIds.length === 1;

  const duplicate = useCallback(
    (targetId: string) => {
      const targetSchedules = schedulesMap[targetId] || [];
      addTable(`schedule-${Date.now()}`, [...targetSchedules]);
    },
    [schedulesMap, addTable]
  );

  const remove = useCallback(
    (targetId: string) => {
      removeTable(targetId);
    },
    [removeTable]
  );

  const handleSearchInfoChange = useCallback(
    (timeInfo: { tableId: string; day?: string; time?: number }) => {
      setSearchInfo(timeInfo);
    },
    []
  );

  const handleCloseSearchDialog = useCallback(() => {
    setSearchInfo(null);
  }, []);

  // 각 시간표별 삭제 핸들러를 메모이제이션하여 안정화
  const deleteHandlers = useMemo(() => {
    const handlers: Record<
      string,
      (timeInfo: { day: string; time: number }) => void
    > = {};

    tableIds.forEach((tableId) => {
      handlers[tableId] = ({ day, time }: { day: string; time: number }) => {
        // 해당 시간표만 독립적으로 업데이트
        const currentSchedules = schedulesMap[tableId] || [];
        const newSchedules = currentSchedules.filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        );

        // 필터링 결과가 같으면 업데이트하지 않음
        if (newSchedules.length !== currentSchedules.length) {
          setSchedules(tableId, newSchedules);
        }
      };
    });

    return handlers;
  }, [tableIds, schedulesMap, setSchedules]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => {
          // 각 테이블의 schedules를 직접 참조
          // schedulesMap 객체가 변경되어도 schedules 배열 참조가 같으면 리렌더링되지 않음
          const schedules = schedulesMap[tableId] || [];
          return (
            <ScheduleTableItem
              key={tableId}
              tableId={tableId}
              index={index}
              schedules={schedules}
              disabledRemoveButton={disabledRemoveButton}
              onSearchInfoChange={setSearchInfo}
              onDuplicate={duplicate}
              onRemove={remove}
              onDeleteButtonClick={deleteHandlers[tableId]}
            />
          );
        })}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleCloseSearchDialog} />
    </>
  );
};

// 각 시간표를 완전히 독립적인 컴포넌트로 분리
// 각 컴포넌트가 자신의 schedules만 구독하도록 함
const ScheduleTableItem = memo(
  ({
    tableId,
    index,
    schedules,
    disabledRemoveButton,
    onSearchInfoChange,
    onDuplicate,
    onRemove,
    onDeleteButtonClick,
  }: {
    tableId: string;
    index: number;
    schedules: Schedule[];
    disabledRemoveButton: boolean;
    onSearchInfoChange: (timeInfo: {
      tableId: string;
      day?: string;
      time?: number;
    }) => void;
    onDuplicate: (tableId: string) => void;
    onRemove: (tableId: string) => void;
    onDeleteButtonClick: (timeInfo: { day: string; time: number }) => void;
  }) => {
    const handleSearchInfoChange = useCallback(
      (timeInfo: { day: string; time: number }) => {
        onSearchInfoChange({ tableId, ...timeInfo });
      },
      [tableId, onSearchInfoChange]
    );

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button
              colorScheme="green"
              onClick={() => onSearchInfoChange({ tableId })}
            >
              시간표 추가
            </Button>
            <Button
              colorScheme="green"
              mx="1px"
              onClick={() => onDuplicate(tableId)}
            >
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
        <ScheduleDndProvider tableId={tableId}>
          <ScheduleTable
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={handleSearchInfoChange}
            onDeleteButtonClick={onDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  },
  (prevProps, nextProps) => {
    // schedules 배열 참조가 같고 disabledRemoveButton이 같으면 리렌더링하지 않음
    // 핸들러와 다른 props는 변경되어도 schedules가 같으면 리렌더링할 필요 없음
    return (
      prevProps.tableId === nextProps.tableId &&
      prevProps.schedules === nextProps.schedules &&
      prevProps.disabledRemoveButton === nextProps.disabledRemoveButton
    );
  }
);
