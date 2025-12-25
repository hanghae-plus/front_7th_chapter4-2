import { Button, ButtonGroup } from '@chakra-ui/react';
import { memo } from 'react';

interface ScheduleControlsProps {
  tableId: string;
  onOpenSearchDialog: (tableId: string) => void;
  onDuplicateBoard: (tableId: string) => void;
  onRemoveBoard: (tableId: string) => void;
  isRemoveDisabled: boolean;
}

const ScheduleControls = memo(
  ({
    tableId,
    onOpenSearchDialog,
    onDuplicateBoard,
    onRemoveBoard,
    isRemoveDisabled,
  }: ScheduleControlsProps) => {
    return (
      <ButtonGroup size="sm" isAttached>
        <Button colorScheme="green" onClick={() => onOpenSearchDialog(tableId)}>
          시간표 추가
        </Button>
        <Button colorScheme="green" mx="1px" onClick={() => onDuplicateBoard(tableId)}>
          복제
        </Button>
        <Button
          colorScheme="green"
          isDisabled={isRemoveDisabled}
          onClick={() => onRemoveBoard(tableId)}
        >
          삭제
        </Button>
      </ButtonGroup>
    );
  },
);

export default ScheduleControls;
