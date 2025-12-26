import { Flex, useCallbackRef } from "@chakra-ui/react";
import { useState } from "react";
import { SearchInfo } from "../../types";
import { ScheduleTableContainer } from "./ScheduleTableContainer";
import {
  useScheduleCommandContext,
  useScheduleQueryContext,
} from "../../ScheduleContext";
import { SearchDialog } from "../SearchDialog";

export const ScheduleTables = () => {
  const setSchedulesMap = useScheduleCommandContext();
  const schedulesMap = useScheduleQueryContext();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const add = useCallbackRef((tableId: string) => setSearchInfo({ tableId }));

  const duplicate = useCallbackRef((targetId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]],
    }));
  });

  const remove = useCallbackRef((targetId: string) => {
    setSchedulesMap((prev) => {
      delete prev[targetId];
      return { ...prev };
    });
  });

  const deleteSchedule = useCallbackRef(
    ({ tableId, day, time }: Required<SearchInfo>) =>
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time)
        ),
      }))
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableContainer
            key={tableId}
            index={index}
            tableId={tableId}
            schedules={schedules}
            disabledRemoveButton={disabledRemoveButton}
            onScheduleTimeClick={setSearchInfo}
            onDeleteButtonClick={deleteSchedule}
            onAddButtonClick={add}
            onDeleteTableButtonClick={remove}
            onDuplicateButtonClick={duplicate}
          />
        ))}
      </Flex>

      {!!searchInfo && (
        <SearchDialog
          searchInfo={searchInfo}
          onDialogClose={() => setSearchInfo(null)}
        />
      )}
    </>
  );
};
