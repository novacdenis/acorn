import { useState, useRef, useCallback } from "react";

interface Dimensions {
  width: number | null;
  height: number | null;
}

type UseMeasureHook = [(node: HTMLElement | null) => void, Dimensions];

export function useMeasure(): UseMeasureHook {
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: null,
    height: null,
  });

  const previousObserver = useRef<ResizeObserver | null>(null);

  const customRef = useCallback((node: HTMLElement | null) => {
    if (previousObserver.current) {
      previousObserver.current.disconnect();
      previousObserver.current = null;
    }

    if (node?.nodeType === Node.ELEMENT_NODE) {
      const observer = new ResizeObserver(([entry]) => {
        if (entry && entry.borderBoxSize) {
          const { inlineSize: width, blockSize: height } = entry.borderBoxSize[0];

          setDimensions({ width, height });
        }
      });

      observer.observe(node);
      previousObserver.current = observer;
    }
  }, []);

  return [customRef, dimensions];
}
