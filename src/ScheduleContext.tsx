import {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useCallback,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedules: (tableId: string, schedules: Schedule[]) => void;
  getSchedules: (tableId: string) => Schedule[];
  addTable: (tableId: string, schedules: Schedule[]) => void;
  removeTable: (tableId: string) => void;
  getAllTableIds: () => string[];
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  // 각 시간표를 독립적으로 관리하기 위해 Map을 사용
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // 특정 시간표의 schedules만 업데이트하는 함수
  const setSchedules = useCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => {
      // 해당 시간표만 업데이트하고, 다른 시간표는 참조 유지
      if (prev[tableId] === schedules) {
        return prev; // 참조가 같으면 업데이트하지 않음
      }
      return {
        ...prev,
        [tableId]: schedules,
      };
    });
  }, []);

  // 특정 시간표의 schedules를 가져오는 함수
  // useCallback을 제거하여 매번 새로운 함수를 반환하지 않도록 함
  // 대신 각 컴포넌트에서 직접 schedulesMap을 구독하도록 함
  const getSchedules = (tableId: string) => {
    return schedulesMap[tableId] || [];
  };

  // 새 시간표 추가
  const addTable = useCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: schedules,
    }));
  }, []);

  // 시간표 삭제
  const removeTable = useCallback((tableId: string) => {
    setSchedulesMap((prev) => {
      const newMap = { ...prev };
      delete newMap[tableId];
      return newMap;
    });
  }, []);

  // 모든 시간표 ID 가져오기
  const getAllTableIds = useCallback(() => {
    return Object.keys(schedulesMap);
  }, [schedulesMap]);

  return (
    <ScheduleContext.Provider
      value={{
        schedulesMap,
        setSchedules,
        getSchedules,
        addTable,
        removeTable,
        getAllTableIds,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};
