import { memo } from "react";
import { Box } from "@chakra-ui/react";
import { useDndContext } from "@dnd-kit/core";

/**
 * 드래그 중 outline 표시를 위한 컴포넌트
 * useDndContext를 구독하여 드래그 중에만 리렌더링되도록 최적화
 */
export const DragOutline = memo(() => {
  const dndContext = useDndContext();
  const isDragging = dndContext.active !== null;

  if (!isDragging) return null;

  return (
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      outline="5px dashed"
      outlineColor="blue.300"
      pointerEvents="none"
      zIndex={1}
    />
  );
});

