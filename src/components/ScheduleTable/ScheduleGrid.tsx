import { memo } from "react";
import { Grid } from "@chakra-ui/react";
import { CellSize, DAY_LABELS } from "../../constants.ts";
import { generateTimeSlots } from "../../utils/timeUtils.ts";
import { DayHeader } from "./DayHeader.tsx";
import { TimeBlock } from "./TimeBlock.tsx";

interface ScheduleGridProps {
  onCellClick: (day: string, time: number) => void;
}

const TIMES = generateTimeSlots();

/**
 * Grid를 별도 컴포넌트로 분리하여 드래그 중 불필요한 리렌더링 방지
 */
export const ScheduleGrid = memo(
  ({ onCellClick }: ScheduleGridProps) => {
    return (
      <Grid
        templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
        templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
        bg="white"
        fontSize="sm"
        textAlign="center"
        outline="1px solid"
        outlineColor="gray.300"
      >
        <DayHeader />
        {TIMES.map((time, timeIndex) => (
          <TimeBlock
            key={`시간-${timeIndex + 1}`}
            time={time}
            timeIndex={timeIndex}
            onCellClick={onCellClick}
          />
        ))}
      </Grid>
    );
  },
  () => {
    // onCellClick 참조 변경을 무시하여 불필요한 리렌더링 방지
    // handleCellClick이 안정적이므로 onCellClick이 변경되어도 리렌더링할 필요 없음
    return true; // 항상 리렌더링하지 않음 (onCellClick은 useRef로 안정화됨)
  }
);

