import { Flex } from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useScheduleTables } from "./hooks/useScheduleTables.ts";
import { useScheduleHandlers } from "./hooks/useScheduleHandlers.ts";
import { ScheduleTableItem } from "./components/ScheduleTableItem/ScheduleTableItem.tsx";

/**
 * 시간표 목록 컴포넌트
 * 비즈니스 로직은 hooks로 분리
 */
export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleContext();

  const {
    tableIds,
    disabledRemoveButton,
    searchInfo,
    duplicate,
    remove,
    handleSearchInfoChange,
    handleCloseSearchDialog,
  } = useScheduleTables();

  const { deleteHandlers } = useScheduleHandlers({
    tableIds,
    schedulesMap,
  });

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
              onSearchInfoChange={handleSearchInfoChange}
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
