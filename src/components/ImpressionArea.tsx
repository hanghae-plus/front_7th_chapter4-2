import { useEffect, useRef } from "react";

type ImpressionAreaProps = {
  onImpression: () => void;
};

export function ImpressionArea({ onImpression }: ImpressionAreaProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          onImpression();
        }
      });
    });

    setTimeout(() => {
      if (!ref.current) return;
      observer.observe(ref.current);
    }, 1);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} />;
}
