import { Flex, Grid, GridItem, Text } from "@chakra-ui/react";
import { memo } from "react";
import { CellSize, DAY_LABELS } from "../../constants.ts";

export const ScheduleGridHeader = memo(() => {
  return (
    <Grid
      templateColumns={`120px repeat(${DAY_LABELS.length}, ${CellSize.WIDTH}px)`}
      templateRows="40px"
      bg="white"
      fontSize="sm"
      textAlign="center"
      outline="1px solid"
      outlineColor="gray.300"
    >
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
    </Grid>
  );
});

ScheduleGridHeader.displayName = "ScheduleGridHeader";
