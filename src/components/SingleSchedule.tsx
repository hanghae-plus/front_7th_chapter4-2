import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import { memo, useCallback, useMemo } from "react";
import ScheduleDndProvider from "../ScheduleDndProvider.tsx";
import ScheduleTable from "./ScheduleTable.tsx";
import { Schedule } from "../types.ts";
import { useScheduleActions } from "../ScheduleContext.tsx";
import { SearchInfo } from "../ScheduleTables.tsx";

interface Props {
    tableId: string;
    schedules: Schedule[];
    index: number;
    setSearchInfo: (searchInfo: SearchInfo) => void;
}

const SingleSchedule = ({
                             tableId,
                             schedules,
                             index,
                             setSearchInfo,
                         }: Props) => {
    const { duplicate, remove, update } = useScheduleActions();

    const disabledRemoveButton = useMemo(
        () => Object.keys(schedules).length === 1,
        [schedules]
    );

    const handleDeleteButtonClick = useCallback(
        ({ day, time }: { day: string; time: number }) =>
            update(tableId, (prev) =>
                prev.filter(
                    (schedule) => schedule.day !== day || !schedule.range.includes(time)
                )
            ),
        [update, tableId]
    );

    const handleScheduleTimeClick = useCallback(
        (timeInfo: { day: string; time: number }) =>
            setSearchInfo({ tableId, ...timeInfo }),
        [setSearchInfo, tableId]
    );

    return (
        <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
                <Heading as="h3" fontSize="lg">
                    시간표 {index + 1}
                </Heading>
                <ButtonGroup size="sm" isAttached>
                    <Button
                        colorScheme="green"
                        onClick={() => setSearchInfo({ tableId })}
                    >
                        시간표 추가
                    </Button>
                    <Button
                        colorScheme="green"
                        mx="1px"
                        onClick={() => duplicate(tableId)}
                    >
                        복제
                    </Button>
                    <Button
                        colorScheme="green"
                        isDisabled={disabledRemoveButton}
                        onClick={() => remove(tableId)}
                    >
                        삭제
                    </Button>
                </ButtonGroup>
            </Flex>
            <ScheduleDndProvider>
                <ScheduleTable
                    key={`schedule-table-${index}`}
                    schedules={schedules}
                    tableId={tableId}
                    onScheduleTimeClick={handleScheduleTimeClick}
                    onDeleteButtonClick={handleDeleteButtonClick}
                />
            </ScheduleDndProvider>
        </Stack>
    );
};

export default memo(SingleSchedule);