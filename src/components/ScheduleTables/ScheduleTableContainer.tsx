import { SearchInfo } from "../../types.ts";
import { ComponentProps, memo } from "react";
import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import ScheduleDndProvider from "../../ScheduleDndProvider.tsx";

type TimeInfo = Omit<SearchInfo, "tableId">;

type ScheduleTableContainerProps = Omit<
  ComponentProps<typeof ScheduleTable>,
  "onScheduleTimeClick" | "onDeleteButtonClick"
> & {
  index: number;
  disabledRemoveButton: boolean;
  onAddButtonClick: (tableId: string) => void;
  onDuplicateButtonClick: (tableId: string) => void;
  onDeleteTableButtonClick: (tableId: string) => void;
  onScheduleTimeClick: (value: SearchInfo) => void;
  onDeleteButtonClick: (value: Required<SearchInfo>) => void;
};

export const ScheduleTableContainer = memo(
  (props: ScheduleTableContainerProps) => {
    const {
      index,
      tableId,
      disabledRemoveButton,
      onAddButtonClick,
      onDuplicateButtonClick,
      onScheduleTimeClick,
      onDeleteButtonClick,
      onDeleteTableButtonClick,
      ...restProps
    } = props;

    const handleScheduleTimeClick = (timeInfo: TimeInfo) =>
      onScheduleTimeClick({ tableId, ...timeInfo });
    const handleDeleteButtonClick = (timeInfo: Required<TimeInfo>) =>
      onDeleteButtonClick({ tableId, ...timeInfo });

    return (
      <Stack key={tableId} width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button
              colorScheme="green"
              onClick={() => onAddButtonClick(tableId)}
            >
              시간표 추가
            </Button>
            <Button
              colorScheme="green"
              mx="1px"
              onClick={() => onDuplicateButtonClick(tableId)}
            >
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={() => onDeleteTableButtonClick(tableId)}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleDndProvider>
          <ScheduleTable
            {...restProps}
            tableId={tableId}
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  }
);

ScheduleTableContainer.displayName = "ScheduleTableContainer";
