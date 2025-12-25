import { Tbody, Tr } from "@chakra-ui/react";
import { ReactNode, useEffect, useRef, useState } from "react";

type VirtualScrollProps = {
  containerHeight: number;
  itemHeight: number;
  children: ReactNode[];
  scrollContainerRef?: React.RefObject<HTMLElement>;
};

const BUFFER_SIZE = 5; // 스크롤 시 미리 로드할 아이템 수

export function VirtualScroll({
  containerHeight,
  itemHeight,
  children,
  scrollContainerRef,
}: VirtualScrollProps) {
  const bodyRef = useRef<HTMLTableSectionElement>(null);

  const [displayingEdges, setDisplayingEdges] = useState<{
    start: number;
    end: number;
  }>({
    start: 0,
    end: 0,
  });

  // 초기값 설정
  useEffect(() => {
    if (displayingEdges.end === 0 && children.length > 0) {
      const initialEnd = Math.min(
        Math.ceil(containerHeight / itemHeight) + BUFFER_SIZE * 2,
        children.length
      );
      setDisplayingEdges({
        start: 0,
        end: initialEnd,
      });
    }
  }, [children.length, containerHeight, itemHeight, displayingEdges.end]);

  useEffect(() => {
    const container =
      scrollContainerRef?.current ||
      (bodyRef.current?.closest('[style*="overflow"]') as HTMLElement);
    if (!container || children.length === 0) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const visibleStart = Math.floor(scrollTop / itemHeight);
      const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);

      const newStart = Math.max(0, visibleStart - BUFFER_SIZE);
      const newEnd = Math.min(children.length, visibleEnd + BUFFER_SIZE);

      setDisplayingEdges((prev) => {
        const startDiff = Math.abs(prev.start - newStart);
        const endDiff = Math.abs(prev.end - newEnd);

        if (
          startDiff > 2 ||
          endDiff > 2 ||
          prev.start === 0 ||
          prev.end === 0 ||
          newStart < prev.start - 1 ||
          newEnd > prev.end + 1
        ) {
          return {
            start: newStart,
            end: newEnd,
          };
        }

        return prev;
      });
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerHeight, itemHeight, children.length, scrollContainerRef]);

  return (
    <Tbody
      ref={bodyRef}
      style={{
        position: "absolute",
        width: "100%",
        top: `${displayingEdges.start * itemHeight}px`,
        height: `${containerHeight}px`,
      }}>
      {children.slice(displayingEdges.start, displayingEdges.end)}
      <Tr
        style={{
          height: `${(children.length - displayingEdges.end) * itemHeight}px`,
        }}
      />
    </Tbody>
  );
}
