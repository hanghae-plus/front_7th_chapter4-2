import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useState } from "react";
import { Schedule } from "./types.ts";

// 개별 시간표 아이템 컴포넌트 (메모이제이션으로 불필요한 리렌더링 방지)
const ScheduleTableItem = memo(({
  tableId,
  schedules,
  index,
  disabledRemoveButton,
  onSearchInfoChange,
  onDuplicate,
  onRemove
}: {
  tableId: string;
  schedules: Schedule[];
  index: number;
  disabledRemoveButton: boolean;
  onSearchInfoChange: (info: { tableId: string; day?: string; time?: number } | null) => void;
  onDuplicate: (targetId: string) => void;
  onRemove: (targetId: string) => void;
}) => {
  const { setSchedulesMap } = useScheduleContext();

  // 각 테이블별 콜백을 useCallback으로 메모이제이션
  const handleScheduleTimeClick = useCallback((timeInfo: { day: string; time: number }) => {
    onSearchInfoChange({ tableId, ...timeInfo });
  }, [tableId, onSearchInfoChange]);

  const handleDeleteButtonClick = useCallback(({ day, time }: { day: string; time: number }) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: prev[tableId].filter(
        (schedule) =>
          schedule.day !== day || !schedule.range.includes(time)
      ),
    }));
  }, [tableId, setSchedulesMap]);

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
      <ScheduleTable
        schedules={schedules}
        tableId={tableId}
        onScheduleTimeClick={handleScheduleTimeClick}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
    </Stack>
  );
});

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  // 시간표 복제 함수 (메모이제이션)
  const duplicate = useCallback((targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  }, [setSchedulesMap]);

  // 시간표 삭제 함수 (메모이제이션)
  const remove = useCallback((targetId: string) => {
    setSchedulesMap((prev) => {
      delete prev[targetId];
      return { ...prev };
    });
  }, [setSchedulesMap]);

  // 검색 정보 변경 함수 (메모이제이션)
  const handleSearchInfoChange = useCallback((info: { tableId: string; day?: string; time?: number } | null) => {
    setSearchInfo(info);
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableItem
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onSearchInfoChange={handleSearchInfoChange}
            onDuplicate={duplicate}
            onRemove={remove}
          />
        ))}
      </Flex>
      {searchInfo && (
        <SearchDialog
          searchInfo={searchInfo}
          onClose={() => setSearchInfo(null)}
        />
      )}
    </>
  );
};
