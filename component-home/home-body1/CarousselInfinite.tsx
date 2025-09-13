"use client";

import {
  CarouselSlide,
  fetchCarouselSlides,
} from "@/app/actions/dashboard/carouselAPI/route";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";

interface Slide {
  id: number;
  imageUrl: string;
  altText: string;
}

const CarouselInfinite = ({ slides }: { slides: CarouselSlide[] }) => {
  /*  const slides: Slide[] = [
    {
      id: 1,
      imageUrl: "/image/scroll1.jpg",
      altText: "Slide 1",
    },
    {
      id: 2,
      imageUrl: "/image/scroll2.jpg",
      altText: "Slide 2",
    },
    {
      id: 3,
      imageUrl: "/image/scroll3.jpg",
      altText: "Slide 3",
    },
    {
      id: 4,
      imageUrl: "/image/scroll4.jpg",
      altText: "Slide 4",
    },
  ]; */

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>(null);
  const [slidesImages, setSlidesImages] = useState<CarouselSlide[]>([]);
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    resetAutoPlay();
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    resetAutoPlay();
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    resetAutoPlay();
  };

  const resetAutoPlay = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
  };

  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isAutoPlaying]);

  useEffect(() => {
    const getImageSlide = async () => {
      const imageSlide: CarouselSlide[] = await fetchCarouselSlides();

      setSlidesImages([...imageSlide]);
    };
    getImageSlide();
  }, []);

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    if (!isAutoPlaying) {
      resetAutoPlay();
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  };

  return (
    <div className="carousel-container" ref={carouselRef}>
      <div className="carousel-slides">
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`carousel-slide ${
              index === currentSlide ? "active" : ""
            }`}
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.altText}
              className="object-contain"
              fill
            />
          </div>
        ))}
      </div>

      <button className="carousel-control prev" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="carousel-control next" onClick={nextSlide}>
        &#10095;
      </button>

      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`indicator ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>

      <button className="auto-play-toggle" onClick={toggleAutoPlay}>
        {isAutoPlaying ? "❚❚" : "▶"}
      </button>
    </div>
  );
};

export default CarouselInfinite;
