"use client";
import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";

function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show or hide the button based on scroll position
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      {isVisible && (
        <button
          title="Up"
          onClick={scrollToTop}
          className="fixed bottom-[70px] w-[40px] h-[40px] right-3 p-[3px] text-[16px] bg-red-400 text-white  border-none rounded-sm cursor-pointer z-[100000000000000000] flex items-center justify-center"
        >
          <ArrowUpIcon className="w-[25px] h-[25px] text-white " />
        </button>
      )}
    </div>
  );
}

export default ScrollToTopButton;
