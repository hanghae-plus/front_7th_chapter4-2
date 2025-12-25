import { memo, Fragment } from "react";
import { Flex, GridItem, Text } from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants.ts";
import { fill2 } from "../../utils.ts";
import { ScheduleCell } from "./ScheduleCell.tsx";

interface TimeBlockProps {
  time: string;
  timeIndex: number;
  onCellClick: (day: string, time: number) => void;
}

/**
 * 시간 블럭을 별도 컴포넌트로 분리하여 메모이제이션
 */
export const TimeBlock = memo(
  ({ time, timeIndex, onCellClick }: TimeBlockProps) => {
    return (
      <Fragment>
        <GridItem
          borderTop="1px solid"
          borderColor="gray.300"
          bg={timeIndex > 17 ? "gray.200" : "gray.100"}
        >
          <Flex justifyContent="center" alignItems="center" h="full">
            <Text fontSize="xs">
              {fill2(timeIndex + 1)} ({time})
            </Text>
          </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
          <ScheduleCell
            key={`${day}-${timeIndex + 2}`}
            day={day}
            timeIndex={timeIndex}
            onClick={onCellClick}
          />
        ))}
      </Fragment>
    );
  },
  (prevProps, nextProps) => {
    // time과 timeIndex만 비교하여 onCellClick 참조 변경은 무시
    return (
      prevProps.time === nextProps.time &&
      prevProps.timeIndex === nextProps.timeIndex
    );
  }
);

