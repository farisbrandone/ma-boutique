import { useEffect, useRef, useState } from "react";

export const useScrollHand = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftStart, setScrollLeftStart] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.clientX);
    setScrollLeftStart(scrollContainerRef.current.scrollLeft);

    // Change cursor to grabbing
    scrollContainerRef.current.style.cursor = "grabbing";
    scrollContainerRef.current.style.userSelect = "none";
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.clientX;
    const walk = (x - startX) * 1.5; // Adjust multiplier for scroll speed

    scrollContainerRef.current.scrollLeft = scrollLeftStart - walk;
  };

  const handleMouseUp = () => {
    if (!scrollContainerRef.current) return;

    setIsDragging(false);
    scrollContainerRef.current.style.cursor = "grab";
    scrollContainerRef.current.style.removeProperty("user-select");
  };

  // Add event listeners to document for better dragging experience
  useEffect(() => {
    const handleMouseUpOutside = () => {
      if (isDragging) {
        handleMouseUp();
      }
    };

    document.addEventListener("mouseup", handleMouseUpOutside);
    return () => {
      document.removeEventListener("mouseup", handleMouseUpOutside);
    };
  }, [isDragging]);

  return {
    scrollContainerRef,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
  };
};
