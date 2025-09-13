import React, { useState, useEffect, useRef } from "react";

interface AnimatedNumberProps {
  start: number;
  end: number;
  duration?: number; // in milliseconds
  easing?: (t: number) => number; // easing function
  format?: (value: number) => string; // formatting function
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  start,
  end,
  duration = 1000,
  easing = (t) => t, // linear by default
  format = (value) => Math.round(value).toString(),
}) => {
  const [value, setValue] = useState(start);
  const requestRef = useRef<number>(null);
  const startTimeRef = useRef<number>(null);
  const isMountedRef = useRef(false);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easing(progress);
    const currentValue = start + (end - start) * easedProgress;
    setValue(currentValue);

    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [start, end, duration]); // Only re-run if these values change

  return (
    <p className="text-center font-[900] text-[20px] w-full ">
      {format(value)}K
    </p>
  );
};

/* // Example usage:
const App: React.FC = () => {
  return (
    <div>
      <h1>Animated Number Example</h1>
      <p>
        Counting up: <AnimatedNumber start={0} end={1000} duration={2000} />
      </p>
      <p>
        Counting down: <AnimatedNumber start={500} end={100} duration={1500} />
      </p>
      <p>
        With formatting:
        <AnimatedNumber
          start={0}
          end={1234567}
          duration={2500}
          format={(value) => new Intl.NumberFormat().format(Math.round(value))}
        />
      </p>
      <p>
        With easing:
        <AnimatedNumber
          start={0}
          end={100}
          duration={1000}
          easing={(t) => t * t} // quadratic easing
        />
      </p>
    </div>
  );
}; */
