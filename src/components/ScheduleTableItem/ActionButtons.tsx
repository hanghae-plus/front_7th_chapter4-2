import { Button, ButtonGroup } from "@chakra-ui/react";

interface ActionButtonsProps {
  tableId: string;
  disabledRemoveButton: boolean;
  onSearchInfoChange: (tableId: string) => void;
  onDuplicate: (tableId: string) => void;
  onRemove: (tableId: string) => void;
}

/**
 * 시간표 액션 버튼 그룹 컴포넌트
 */
export const ActionButtons = ({
  tableId,
  disabledRemoveButton,
  onSearchInfoChange,
  onDuplicate,
  onRemove,
}: ActionButtonsProps) => {
  return (
    <ButtonGroup size="sm" isAttached>
      <Button
        colorScheme="blackAlpha"
        bg="blackAlpha.900"
        color="white"
        _hover={{ bg: "blackAlpha.800" }}
        onClick={() => onSearchInfoChange(tableId)}
      >
        시간표 추가
      </Button>
      <Button
        colorScheme="blackAlpha"
        bg="blackAlpha.900"
        color="white"
        _hover={{ bg: "blackAlpha.800" }}
        mx="1px"
        onClick={() => onDuplicate(tableId)}
      >
        복제
      </Button>
      <Button
        colorScheme="blackAlpha"
        bg="blackAlpha.900"
        color="white"
        isDisabled={disabledRemoveButton}
        onClick={() => onRemove(tableId)}
      >
        삭제
      </Button>
    </ButtonGroup>
  );
};
