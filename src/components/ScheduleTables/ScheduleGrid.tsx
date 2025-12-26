import { Fragment, memo } from "react";
import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { fill2 } from "../../utils.ts";
import { SearchInfo } from "../../types.ts";
import { DAY_LABELS, CellSize, TIMES } from "../../constants.ts";

interface ScheduleGridProps {
  onClick: (timeInfo: Required<Omit<SearchInfo, "tableId">>) => void;
}

export const ScheduleGrid = memo(({ onClick }: ScheduleGridProps) => (
  <Grid
    templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
    templateRows={`40px repeat(${TIMES.length}, ${CellSize.HEIGHT}px)`}
    bg="white"
    fontSize="sm"
    textAlign="center"
    outline="1px solid"
    outlineColor="gray.300"
  >
    <GridItem key="교시" borderColor="gray.300" bg="gray.100">
      <Flex justifyContent="center" alignItems="center" h="full" w="full">
        <Text fontWeight="bold">교시</Text>
      </Flex>
    </GridItem>
    {DAY_LABELS.map((day) => (
      <GridItem key={day} borderLeft="1px" borderColor="gray.300" bg="gray.100">
        <Flex justifyContent="center" alignItems="center" h="full">
          <Text fontWeight="bold">{day}</Text>
        </Flex>
      </GridItem>
    ))}
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
            onClick={() => onClick({ day, time: timeIndex + 1 })}
          />
        ))}
      </Fragment>
    ))}
  </Grid>
));

ScheduleGrid.displayName = "ScheduleGrid";
