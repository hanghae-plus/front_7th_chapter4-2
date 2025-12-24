import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

type SchedulesMap = Record<string, Schedule[]>;

interface ScheduleStateContextType {
  schedulesMap: SchedulesMap;
}

interface ScheduleActionsContextType {
  setSchedulesMap: React.Dispatch<React.SetStateAction<SchedulesMap>>;
  duplicate: (targetId: string) => void;
  remove: (targetId: string) => void;
  update: (targetId: string, updater: (prev: Schedule[]) => Schedule[]) => void;
}

const ScheduleStateContext = createContext<ScheduleStateContextType | undefined>(undefined);
const ScheduleActionsContext = createContext<ScheduleActionsContextType | undefined>(undefined);

const useScheduleState = () => {
  const context = useContext(ScheduleStateContext);
  if (context === undefined) {
    throw new Error("useScheduleState must be used within a ScheduleProvider");
  }
  return context;
};

const useScheduleActions = () => {
  const context = useContext(ScheduleActionsContext);
  if (context === undefined) {
    throw new Error(
        "useScheduleActions must be used within a ScheduleProvider"
    );
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
      useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const duplicate = useCallback((tableId: string) => {
    setSchedulesMap((prev) => ({
      ...prev,
      ["schedule-" + Date.now()]: [...(prev[tableId] ?? [])],
    }));
  }, []);

  const remove = useCallback((tableId: string) => {
    setSchedulesMap((prev) => {
      const copy = { ...prev } as SchedulesMap;
      delete copy[tableId];
      return copy;
    });
  }, []);

  const update = useCallback(
      (tableId: string, updater: (prev: Schedule[]) => Schedule[]) => {
        setSchedulesMap((prev) => ({
          ...prev,
          [tableId]: updater(prev[tableId] ?? []),
        }));
      },
      []
  );

  const stateValue = useMemo<ScheduleStateContextType>(() => ({ schedulesMap }), [schedulesMap]);
  const actionsValue = useMemo<ScheduleActionsContextType>(() => ({ setSchedulesMap, duplicate, remove, update }), [duplicate, remove, update]);

  return (
      <ScheduleStateContext.Provider value={stateValue}>
        <ScheduleActionsContext.Provider value={actionsValue}>
          {children}
        </ScheduleActionsContext.Provider>
      </ScheduleStateContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export { useScheduleState, useScheduleActions };