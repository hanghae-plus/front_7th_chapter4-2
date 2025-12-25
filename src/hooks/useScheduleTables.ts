import { useCallback, useMemo, useState } from "react";
import { useScheduleContext } from "../ScheduleContext.tsx";
import { generateTableId } from "../utils/scheduleUtils.ts";

interface UseScheduleTablesResult {
  tableIds: string[];
  disabledRemoveButton: boolean;
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  duplicate: (targetId: string) => void;
  remove: (targetId: string) => void;
  handleSearchInfoChange: (timeInfo: {
    tableId: string;
    day?: string;
    time?: number;
  }) => void;
  handleCloseSearchDialog: () => void;
}

/**
 * 시간표 목록 관리 비즈니스 로직을 담당하는 훅
 */
export const useScheduleTables = (): UseScheduleTablesResult => {
  const { schedulesMap, getAllTableIds, addTable, removeTable } =
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
      addTable(generateTableId(), [...targetSchedules]);
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

  return {
    tableIds,
    disabledRemoveButton,
    searchInfo,
    duplicate,
    remove,
    handleSearchInfoChange,
    handleCloseSearchDialog,
  };
};

