import { memo } from 'react';
import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import { ScheduleDndProvider, useScheduleActions } from '../../context';
import { Schedule } from '../../types';
import useAutoCallback from '../../hooks/useAutoCallback';
import ScheduleTable from './ScheduleTable';

// 1. ScheduleTableTitle - 제목만 (index 변경 시만 리렌더)
interface TitleProps {
  index: number;
}

const ScheduleTableTitle = memo(
  ({ index }: TitleProps) => (
    <Heading as="h3" fontSize="lg">
      시간표 {index + 1}
    </Heading>
  ),
  (prev, next) => prev.index === next.index,
);

// 2. ScheduleTableActions - 버튼 그룹 (disabledRemove 변경 시만 리렌더)
interface ActionsProps {
  disabledRemove: boolean;
  onAddClick: () => void;
  onDuplicateClick: () => void;
  onRemoveClick: () => void;
}

const ScheduleTableActions = memo(
  ({
    disabledRemove,
    onAddClick,
    onDuplicateClick,
    onRemoveClick,
  }: ActionsProps) => (
    <ButtonGroup size="sm" isAttached>
      <Button colorScheme="green" onClick={onAddClick}>
        시간표 추가
      </Button>
      <Button colorScheme="green" mx="1px" onClick={onDuplicateClick}>
        복제
      </Button>
      <Button
        colorScheme="green"
        isDisabled={disabledRemove}
        onClick={onRemoveClick}
      >
        삭제
      </Button>
    </ButtonGroup>
  ),
  (prev, next) => prev.disabledRemove === next.disabledRemove,
);

// ============================================
// 3. ScheduleTableBody - 시간표 본문 (schedules 참조 비교로 리렌더 결정)
// ============================================
interface BodyProps {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick: (day: string, time: number) => void;
  onDeleteButtonClick: (day: string, time: number) => void;
}

const ScheduleTableBody = memo(
  ({
    tableId,
    schedules,
    onScheduleTimeClick,
    onDeleteButtonClick,
  }: BodyProps) => {
    return (
      <ScheduleTable
        tableId={tableId}
        schedules={schedules}
        onScheduleTimeClick={onScheduleTimeClick}
        onDeleteButtonClick={onDeleteButtonClick}
      />
    );
  },
  (prev, next) => {
    return prev.tableId === next.tableId && prev.schedules === next.schedules;
  },
);

// ============================================
// 4. ScheduleTableItem - Wrapper (조합만 담당)
// ============================================
interface ScheduleTableItemProps {
  tableId: string;
  schedules: Schedule[];
  index: number;
  disabledRemove: boolean;
  onOpenSearch: (tableId: string, day?: string, time?: number) => void;
}

const ScheduleTableItem = memo(
  ({
    tableId,
    schedules,
    index,
    disabledRemove,
    onOpenSearch,
  }: ScheduleTableItemProps) => {
    // 액션들 (안정적 참조) - Dispatch Context만 구독!
    const { duplicateTable, removeTable, deleteSchedule } =
      useScheduleActions();

    // 핸들러들 - tableId 바인딩
    const handleAddClick = useAutoCallback(() => {
      onOpenSearch(tableId);
    });

    const handleDuplicateClick = useAutoCallback(() => {
      duplicateTable(tableId);
    });

    const handleRemoveClick = useAutoCallback(() => {
      removeTable(tableId);
    });

    const handleScheduleTimeClick = useAutoCallback(
      (day: string, time: number) => {
        onOpenSearch(tableId, day, time);
      },
    );

    const handleDeleteSchedule = useAutoCallback(
      (day: string, time: number) => {
        deleteSchedule(tableId, day, time);
      },
    );

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <ScheduleTableTitle index={index} />
          <ScheduleTableActions
            disabledRemove={disabledRemove}
            onAddClick={handleAddClick}
            onDuplicateClick={handleDuplicateClick}
            onRemoveClick={handleRemoveClick}
          />
        </Flex>
        <ScheduleDndProvider tableId={tableId}>
          <ScheduleTableBody
            tableId={tableId}
            schedules={schedules}
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteSchedule}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.tableId === nextProps.tableId &&
      prevProps.schedules === nextProps.schedules &&
      prevProps.index === nextProps.index &&
      prevProps.disabledRemove === nextProps.disabledRemove
    );
  },
);

export default ScheduleTableItem;
