"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { Button } from "../../button";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      url: "/images/hero1.jpg",
      title: "Play. bet. Win.",
      description:
        "Professional game developers collaborating around a strategic planning table",
    },
    {
      url: "/images/hero2.jpg",
      title: "Play. bet. Win.",
      description:
        "Stylized illustration of game characters in a neon-lit environment",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 10000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  return (
    <div className=" w-full h-screen overflow-hidden">
      {/* Carousel Container */}
      <div className="relative h-full w-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Image */}
            <div className="absolute inset-0 z-10 rounded-lg" />
            <Image
              src={slide?.url}
              alt={slide?.title}
              className="w-full h-full blur-sm rounded-lg object-cover md:object-fill"
              height={960}
              width={1920}
            />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 text-white pb-20">
              <h1 className="text-3xl font-bold mb-2 shadow-black">
                {slide.title}
              </h1>
              <Button className="bg-yellow-300 font-bold">Play games</Button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="hidden md:block">
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 z-30 transition-all"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 rounded-full p-2 z-30 transition-all"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 space-x-2 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
