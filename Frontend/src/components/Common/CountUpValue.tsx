import { useState, useEffect } from "react";

export default function CountUpValue({ value, shouldStart }: { value: string; shouldStart: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!shouldStart) {
      return;
    }

    const match = value.match(/(\d+(?:\.\d+)?)/);
    if (!match) {
      return;
    }

    const target = Number(match[1]);
    const duration = 1400;
    const startTime = performance.now();
    let frameId = 0;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(target * eased);

      if (progress < 1) {
        frameId = window.requestAnimationFrame(step);
      }
    };

    frameId = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(frameId);
  }, [shouldStart, value]);

  const suffix = value.replace(/\d+(?:\.\d+)?/, "");
  const formattedValue = Number.isInteger(displayValue) ? displayValue.toString() : displayValue.toFixed(1);

  return <span>{`${formattedValue}${suffix}`}</span>;
}
