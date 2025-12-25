import { Modifier } from "@dnd-kit/core";
import {
  CellSize,
  DAY_LABELS,
  TIME_SLOTS,
  TIME_COLUMN_WIDTH,
  GRID_HEADER_HEIGHT,
} from "@/constants";

/**
 * 그리드 영역 내로 드래그를 제한하는 모디파이어
 * 교시 열과 요일 헤더를 제외한 실제 스케줄 영역 내에서만 이동 가능
 */
export function createGridBoundaryModifier(): Modifier {
  return ({ transform, draggingNodeRect, containerNodeRect }) => {
    if (!draggingNodeRect || !containerNodeRect) {
      return transform;
    }

    // 그리드 영역 경계 계산
    const gridLeft = TIME_COLUMN_WIDTH;
    const gridTop = GRID_HEADER_HEIGHT;
    const gridRight = TIME_COLUMN_WIDTH + DAY_LABELS.length * CellSize.WIDTH;
    const gridBottom = GRID_HEADER_HEIGHT + TIME_SLOTS.length * CellSize.HEIGHT;

    // 현재 드래그 중인 요소의 위치
    const currentLeft = draggingNodeRect.left - containerNodeRect.left;
    const currentTop = draggingNodeRect.top - containerNodeRect.top;
    const currentRight = currentLeft + draggingNodeRect.width;
    const currentBottom = currentTop + draggingNodeRect.height;

    let { x, y } = transform;

    // 왼쪽 경계 (교시 열 침범 방지)
    if (currentLeft + x < gridLeft) {
      x = gridLeft - currentLeft;
    }
    // 오른쪽 경계
    if (currentRight + x > gridRight) {
      x = gridRight - currentRight;
    }
    // 상단 경계 (헤더 침범 방지)
    if (currentTop + y < gridTop) {
      y = gridTop - currentTop;
    }
    // 하단 경계
    if (currentBottom + y > gridBottom) {
      y = gridBottom - currentBottom;
    }

    return { ...transform, x, y };
  };
}

/**
 * 그리드 셀에 스냅되는 드래그 모디파이어
 * transform을 셀 크기 단위로 스냅
 */
export function createSnapModifier(): Modifier {
  return ({ transform }) => {
    return {
      ...transform,
      x: Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH,
      y: Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT,
    };
  };
}

export const snapModifiers = [createGridBoundaryModifier(), createSnapModifier()];
