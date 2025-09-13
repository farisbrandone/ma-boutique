import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const categoriesCards = [
  {
    title: "vêtements Femmes",
    icon: (
      <span className="icon-[fluent-emoji-high-contrast--dress] text-3xl "></span>
    ),
  },
  {
    title: "vêtements Hommes",
    icon: <span className="icon-[lucide-lab--jacket] text-3xl "></span>,
  },
  {
    title: "Electronics",
    icon: <span className="icon-[whh--iphone] text-3xl "></span>,
  },
  {
    title: "Maison et confort",
    icon: <span className="icon-[solar--home-wifi-outline] text-3xl "></span>,
  },
  {
    title: "Sport",
    icon: (
      <span className="icon-[fluent--sport-soccer-16-regular]  text-3xl  "></span>
    ),
  },
  {
    title: "Jouets pour enfant",
    icon: <span className="icon-[whh--teddybear] text-3xl "></span>,
  },
  {
    title: "Sacs",
    icon: <span className="icon-[emojione-v1--handbag]  text-3xl "></span>,
  },
  {
    title: "Sous vetement",
    icon: <span className="icon-[lucide-lab--lingerie] text-3xl  "></span>,
  },
];

export default function HomeBody3() {
  const [activeIndex, setActiveIndex] = useState(0);
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

  return (
    <div className="w-full p-2  max-w-[100vw] xl:max-w-7xl">
      <p className="mb-[20px] text-[18px] md:text-2xl font-bold ">
        Parcourir par catégorie
      </p>
      <div
        ref={scrollContainerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="w-full overflow-x-auto flex items-center gap-4 scrollbar-hide cursor-grab "
      >
        {categoriesCards.map((val, index) => (
          <div
            className={`w-[120px] h-[120px] rounded-md shrink-0 border-solid border border-[#6e6d6d94] flex items-center justify-center cursor-pointer  ${
              activeIndex === index
                ? "bg-[#bd4444] text-white"
                : "bg-white text-black"
            }`}
            onClick={() => setActiveIndex(index)}
            key={index}
          >
            <div className="flex flex-col items-center gap-2">
              {/* <Image
                alt=""
                width={60}
                height={60}
                className="object-cover"
                src={val.icon}
              />*/}
              {val.icon}

              <p className="text-[16px] sm:text-[20px] text-center ">
                {" "}
                {val.title}{" "}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
