import { useCallback, useEffect, useRef } from "react";

/**
 * 드래그 중인 아이템의 스타일을 CSS 주입으로 제어하는 훅
 * React 상태 변경 없이 시각적 피드백 제공
 */
export function useDragStyle() {
  const styleRef = useRef<HTMLStyleElement | null>(null);

  const injectDragStyle = useCallback((id: string) => {
    if (styleRef.current) {
      document.head.removeChild(styleRef.current);
    }
    const style = document.createElement("style");
    style.textContent = `[data-schedule-id="${id}"] { visibility: hidden !important; }`;
    document.head.appendChild(style);
    styleRef.current = style;
  }, []);

  const removeDragStyle = useCallback(() => {
    if (styleRef.current) {
      document.head.removeChild(styleRef.current);
      styleRef.current = null;
    }
  }, []);

  // 컴포넌트 언마운트 시 스타일 정리
  useEffect(() => {
    return () => {
      if (styleRef.current) {
        document.head.removeChild(styleRef.current);
      }
    };
  }, []);

  return { injectDragStyle, removeDragStyle };
}
