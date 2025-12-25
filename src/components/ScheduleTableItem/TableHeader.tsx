import { Flex, Heading } from "@chakra-ui/react";
import { ActionButtons } from "./ActionButtons.tsx";

interface TableHeaderProps {
  index: number;
  tableId: string;
  disabledRemoveButton: boolean;
  onSearchInfoChange: (tableId: string) => void;
  onDuplicate: (tableId: string) => void;
  onRemove: (tableId: string) => void;
}

/**
 * 시간표 헤더 컴포넌트
 */
export const TableHeader = ({
  index,
  tableId,
  disabledRemoveButton,
  onSearchInfoChange,
  onDuplicate,
  onRemove,
}: TableHeaderProps) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Heading as="h3" fontSize="lg">
        시간표 {index + 1}
      </Heading>
      <ActionButtons
        tableId={tableId}
        disabledRemoveButton={disabledRemoveButton}
        onSearchInfoChange={onSearchInfoChange}
        onDuplicate={onDuplicate}
        onRemove={onRemove}
      />
    </Flex>
  );
};

