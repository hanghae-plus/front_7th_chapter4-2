import { memo, Fragment } from 'react';
import { Flex, Grid, GridItem, Text } from '@chakra-ui/react';
import { CellSize, DAY_LABELS, 분 } from '../../constants';
import { fill2, parseHnM } from '../../utils';

interface ScheduleGridProps {
  onCellClick: (day: string, time: number) => void;
}

const TIMES = [
  ...Array(18)
    .fill(0)
    .map((v, k) => v + k * 30 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 30 * 분)}`),

  ...Array(6)
    .fill(18 * 30 * 분)
    .map((v, k) => v + k * 55 * 분)
    .map((v) => `${parseHnM(v)}~${parseHnM(v + 50 * 분)}`),
] as const;

const ScheduleGrid = memo(
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
        {/* 헤더 행 */}
        <GridItem borderColor="gray.300" bg="gray.100">
          <Flex justifyContent="center" alignItems="center" h="full" w="full">
            <Text fontWeight="bold">교시</Text>
          </Flex>
        </GridItem>
        {DAY_LABELS.map((day) => (
          <GridItem
            key={day}
            borderLeft="1px"
            borderColor="gray.300"
            bg="gray.100"
          >
            <Flex justifyContent="center" alignItems="center" h="full">
              <Text fontWeight="bold">{day}</Text>
            </Flex>
          </GridItem>
        ))}

        {/* 시간 행들 */}
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
            <GridItem
              borderTop="1px solid"
              borderColor="gray.300"
              bg={timeIndex > 17 ? 'gray.200' : 'gray.100'}
            >
              <Flex justifyContent="center" alignItems="center" h="full">
                <Text fontSize="xs">
                  {fill2(timeIndex + 1)} ({time})
                </Text>
              </Flex>
            </GridItem>
            {DAY_LABELS.map((day) => (
              <GridItem
                key={`${day}-${timeIndex + 2}`}
                borderWidth="1px 0 0 1px"
                borderColor="gray.300"
                bg={timeIndex > 17 ? 'gray.100' : 'white'}
                cursor="pointer"
                _hover={{ bg: 'yellow.100' }}
                onClick={() => onCellClick(day, timeIndex + 1)}
              />
            ))}
          </Fragment>
        ))}
      </Grid>
    );
  },
  () => true, // 정적 그리드 - onCellClick은 useAutoCallback으로 안정화
);

export default ScheduleGrid;
