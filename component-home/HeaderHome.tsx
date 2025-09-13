"use client";

import React, { useState, useEffect, useRef } from "react";
import { FiSearch, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence, type Variants } from "framer-motion";

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);

    // Fermer le menu si on clique à l'extérieur
    const handleClickOutside = (event: MouseEvent) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Recherche:", searchQuery);
    // Ajoutez ici votre logique de recherche
  };

  // Variantes d'animation
  const mobileMenuVariants = {
    hidden: {
      x: "100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
  };

  return (
    <nav className=" fixed flex items-center md:justify-between w-[100vw] p-3 xl:max-w-7xl z-[1000] bg-white ">
      <div className="flex items-center justify-between w-full">
        {/* Logo */}
        <div className="text-3xl mr-[30px] ">
          <a href="/" className="hover:text-[#db4444] ">
            MonShop
          </a>
        </div>

        {/* Menu principal (desktop) */}

        <>
          <div className=" items-center gap-[60px] sm:gap-[100px] text-xl  mx-auto hidden md:flex">
            <a
              href="/"
              className="hover:text-[#db4444] transition-colors duration-500 "
            >
              Accueil
            </a>
            <a
              href="/about"
              className="hover:text-[#db4444] transition-colors duration-500 "
            >
              À propos
            </a>
            <a
              href="/contact"
              className="hover:text-[#db4444]  transition-colors duration-500 "
            >
              Contact
            </a>
          </div>

          <form
            onSubmit={handleSearch}
            className=" relative hidden md:inline-block"
          >
            <input
              type="text"
              placeholder="Que cherchez vous?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-[170px] md:w-[200px] lg:w-[250px] border-1 border-solid border-[#b6b6b6] focus:border-[#db4444] outline-none p-2 pr-8 "
            />
            <button
              type="submit"
              className="absolute top-3 right-2 z-10 cursor-pointer"
            >
              <FiSearch />
            </button>
          </form>
        </>

        {/* Bouton menu mobile */}
        <button
          className=" md:hidden inline-block cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Menu mobile avec animation */}

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="relative mobile-menu"
            ref={mobileMenuRef}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={mobileMenuVariants as Variants}
          >
            <button
              className="close-menu-button absolute top-4 right-4 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Fermer le menu"
            >
              <FiX size={24} />
            </button>

            <div className="mobile-menu-content">
              <a href="/" onClick={() => setIsMobileMenuOpen(false)}>
                Accueil
              </a>
              <a href="/about" onClick={() => setIsMobileMenuOpen(false)}>
                À propos
              </a>
              <a href="/contact" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </a>

              <form onSubmit={handleSearch} className="mobile-search">
                <input
                  type="text"
                  placeholder="Que cherchez vous?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">
                  <FiSearch />
                  Rechercher
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Header;
