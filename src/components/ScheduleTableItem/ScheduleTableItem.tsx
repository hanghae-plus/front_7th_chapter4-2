import { memo, useCallback } from "react";
import { Stack } from "@chakra-ui/react";
import { Schedule } from "../../types.ts";
import ScheduleDndProvider from "../../ScheduleDndProvider.tsx";
import ScheduleTable from "../../ScheduleTable.tsx";
import { TableHeader } from "./TableHeader.tsx";

interface ScheduleTableItemProps {
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
}

/**
 * 각 시간표를 완전히 독립적인 컴포넌트로 분리
 * 각 컴포넌트가 자신의 schedules만 구독하도록 함
 */
export const ScheduleTableItem = memo(
  ({
    tableId,
    index,
    schedules,
    disabledRemoveButton,
    onSearchInfoChange,
    onDuplicate,
    onRemove,
    onDeleteButtonClick,
  }: ScheduleTableItemProps) => {
    const handleSearchInfoChange = useCallback(
      (timeInfo: { day: string; time: number }) => {
        onSearchInfoChange({ tableId, ...timeInfo });
      },
      [tableId, onSearchInfoChange]
    );

    const handleHeaderSearchInfoChange = useCallback(
      (tableId: string) => {
        onSearchInfoChange({ tableId });
      },
      [onSearchInfoChange]
    );

    return (
      <Stack width="600px">
        <TableHeader
          index={index}
          tableId={tableId}
          disabledRemoveButton={disabledRemoveButton}
          onSearchInfoChange={handleHeaderSearchInfoChange}
          onDuplicate={onDuplicate}
          onRemove={onRemove}
        />
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

