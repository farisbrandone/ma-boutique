"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useState } from "react";

const Sidebar: React.FC = () => {
  var window: Window & typeof globalThis = globalThis as Window &
    typeof globalThis;
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(false);
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  console.log({ category });
  console.log("hohohohohoh");
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

  const classAdd = (item: string) => {
    if (category === item.toLowerCase().replace(/ /g, "-")) {
      return "#bd4444";
    }
    return "";
  };

  console.log({ value: classAdd("vêtements Hommes") });

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
            <Link
              href={`/productPage?category=${category.name
                .toLowerCase()
                .replace(/ /g, "-")}`}
              style={{ color: classAdd(category.name) }}
            >
              {category.icon}
              {!isMobile && <span className="text">{category.name}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
