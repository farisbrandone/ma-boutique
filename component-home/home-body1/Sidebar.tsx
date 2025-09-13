"use client";

import React, { useState } from "react";

const Sidebar: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    {
      name: "vêtements Femmes",
      icon: (
        <span className="icon-[fluent-emoji-high-contrast--dress] text-xl mr-1 max-sm:text-white "></span>
      ),
    },
    {
      name: "vêtements Hommes",
      icon: (
        <span className="icon-[lucide-lab--jacket] text-xl sm:mr-1 max-sm:text-white "></span>
      ),
    },
    {
      name: "Electronics",
      icon: (
        <span className="icon-[whh--iphone] text-xl sm:mr-1 max-sm:text-white "></span>
      ),
    },
    {
      name: "Maison et Confort",
      icon: (
        <span className="icon-[solar--home-wifi-outline] text-xl sm:mr-1 max-sm:text-white "></span>
      ),
    },
    {
      name: "Sport",
      icon: (
        <span className="icon-[fluent--sport-soccer-16-regular]  text-xl sm:mr-1 max-sm:text-white "></span>
      ),
    },
    {
      name: "Jouets pour enfant",
      icon: (
        <span className="icon-[whh--teddybear] text-xl sm:mr-1 max-sm:text-white"></span>
      ),
    },
  ];

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  React.useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`sidebar ${isMobile ? "mobile" : " "} ${isOpen ? "open" : ""}`}
    >
      {/*  {isMobile && (
        <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      )}
 */}
      {!isMobile && (
        <p className="text-center bg-[#bd4444] text-white p-2 w-full rounded-t-sm ">
          Recherecher
        </p>
      )}
      <ul className="sidebar-list  border-[2px] sm:border-t-[0px] sm:border-solid  border-none   sm:border-[#00000044] rounded-lg sm:rounded-sm sm:rounded-t-[0px]">
        {categories.map((category, index) => (
          <li
            key={index}
            className="sidebar-item max-sm:bg-[#bd4444] text-white"
          >
            <a href={`#${category.name.toLowerCase().replace(/ /g, "-")}`}>
              {category.icon}
              {!isMobile && <span className="text">{category.name}</span>}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
