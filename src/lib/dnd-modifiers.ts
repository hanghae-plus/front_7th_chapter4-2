import { Modifier } from "@dnd-kit/core";
import { CellSize, GRID_HEADER_HEIGHT, TIME_COLUMN_WIDTH, GRID_BORDER_WIDTH } from "@/constants";

/**
 * 그리드 셀에 스냅되는 드래그 모디파이어 생성
 */
export function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + TIME_COLUMN_WIDTH + GRID_BORDER_WIDTH;
    const minY = containerTop - top + GRID_HEADER_HEIGHT + GRID_BORDER_WIDTH;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;

    return {
      ...transform,
      x: Math.min(Math.max(Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH, minX), maxX),
      y: Math.min(Math.max(Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT, minY), maxY),
    };
  };
}

export const snapModifiers = [createSnapModifier()];
