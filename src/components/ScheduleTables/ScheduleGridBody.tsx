import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { Fragment, memo } from "react";
import { CellSize, DAY_LABELS, TIMES } from "../../constants.ts";
import { fill2 } from "../../utils.ts";

interface ScheduleGridBodyProps {
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
}

export const ScheduleGridBody = memo(
  ({ onScheduleTimeClick }: ScheduleGridBodyProps) => {
    return (
      <Grid
        templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
        templateRows={`repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
        bg="white"
        fontSize="sm"
        textAlign="center"
      >
        {TIMES.map((time, timeIndex) => (
          <Fragment key={`시간-${timeIndex + 1}`}>
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
              <GridItem
                key={`${day}-${timeIndex + 2}`}
                borderWidth="1px 0 0 1px"
                borderColor="gray.300"
                bg={timeIndex > 17 ? "gray.100" : "white"}
                cursor="pointer"
                _hover={{ bg: "yellow.100" }}
                onClick={() =>
                  onScheduleTimeClick?.({ day, time: timeIndex + 1 })
                }
              />
            ))}
          </Fragment>
        ))}
      </Grid>
    );
  }
);

ScheduleGridBody.displayName = "ScheduleGridBody";
