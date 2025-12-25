import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { PropsWithChildren } from "react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { createSnapModifier, updateScheduleOnDragEnd } from "./utils/dndUtils.ts";

const modifiers = [createSnapModifier()];

interface ScheduleDndProviderProps extends PropsWithChildren {
  tableId: string;
}

/**
 * 각 시간표별로 독립적인 DnD Context를 제공하는 Provider
 * 한 테이블에서 드래그할 때 다른 테이블은 리렌더링되지 않도록 최적화
 */
export default function ScheduleDndProvider({
  children,
  tableId,
}: ScheduleDndProviderProps) {
  const { getSchedules, setSchedules } = useScheduleContext();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const currentSchedules = getSchedules(tableId);
    const newSchedules = updateScheduleOnDragEnd(event, currentSchedules);
    // 해당 시간표만 업데이트 (다른 시간표는 전혀 영향 없음)
    setSchedules(tableId, newSchedules);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
      modifiers={modifiers}
    >
      {children}
    </DndContext>
  );
}
