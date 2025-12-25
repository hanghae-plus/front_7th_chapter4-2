import { memo, useCallback, useRef, useEffect } from "react";
import { GridItem } from "@chakra-ui/react";

interface ScheduleCellProps {
  day: string;
  timeIndex: number;
  onClick: (day: string, time: number) => void;
}

/**
 * 각 셀을 별도 컴포넌트로 분리하여 메모이제이션
 * 드롭 후에도 변경되지 않은 셀은 리렌더링되지 않도록 최적화
 */
export const ScheduleCell = memo(
  ({ day, timeIndex, onClick }: ScheduleCellProps) => {
    // onClick을 useRef로 저장하여 항상 같은 참조를 유지
    const onClickRef = useRef(onClick);
    useEffect(() => {
      onClickRef.current = onClick;
    }, [onClick]);

    const handleClick = useCallback(() => {
      onClickRef.current(day, timeIndex + 1);
    }, [day, timeIndex]);

    return (
      <GridItem
        borderWidth="1px 0 0 1px"
        borderColor="gray.300"
        bg={timeIndex > 17 ? "gray.100" : "white"}
        cursor="pointer"
        _hover={{ bg: "yellow.100" }}
        onClick={handleClick}
      />
    );
  },
  (prevProps, nextProps) => {
    // day와 timeIndex만 비교하여 onClick 참조 변경은 무시
    return (
      prevProps.day === nextProps.day &&
      prevProps.timeIndex === nextProps.timeIndex
    );
  }
);

