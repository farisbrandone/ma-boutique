import { useState, useEffect, useCallback } from "react";

const useIsMobile = (breakpoint = 768): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const checkIfMobile = useCallback(() => {
    setIsMobile(window.innerWidth < breakpoint);
  }, [breakpoint]);

  useEffect(() => {
    // Initial check
    checkIfMobile();

    // Debounced resize handler
    const debouncedHandleResize = debounce(checkIfMobile, 100);

    window.addEventListener("resize", debouncedHandleResize);

    return () => {
      window.removeEventListener("resize", debouncedHandleResize);
    };
  }, [breakpoint, checkIfMobile]);

  return isMobile;
};

// Simple debounce function
function debounce(fn: () => void, ms: number) {
  let timer: NodeJS.Timeout;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn();
    }, ms);
  };
}

export default useIsMobile;
