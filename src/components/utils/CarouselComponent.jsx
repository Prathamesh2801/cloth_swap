import { ChevronLeftIcon, ChevronRightIcon, HeartIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { BASE_URL } from "../../../config";

const cardWidth = 280; // matches class "w-70"
const gapWidth = 16; // tailwind gap-4 = 1rem = 16px
const fullCardWidth = cardWidth + gapWidth;

export default function Carousel({ items, onItemClick }) {
  console.log("Carousel items:", items);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [maxSlideIndex, setMaxSlideIndex] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const slidesVisible = Math.floor(containerWidth / fullCardWidth);
      setMaxSlideIndex(items.length - slidesVisible);
    }
  }, [items.length]);

  const handleSlideChange = (direction) => {
    setCurrentSlide((prev) => {
      if (direction === "next") {
        return Math.min(prev + 1, maxSlideIndex);
      } else {
        return Math.max(prev - 1, 0);
      }
    });
  };

  
  // Prevent arrow button events from triggering drag or page scroll
  const stopEvent = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="mb-6">
      <h3 className="text-3xl font-bold text-[#2d1810] mb-5 ml-5 bebas-neue-regular tracking-wide">
        Recommended for You
      </h3>
      <div
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        {/* Carousel Slides */}
        <motion.div
          className="flex gap-4 cursor-grab select-none"
          drag="x"
          dragConstraints={{
            left: -(items.length * fullCardWidth - fullCardWidth),
            right: 0,
          }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={(event, info) => {
            setIsDragging(false);
            const threshold = 100;
            if (info.offset.x < -threshold && currentSlide < maxSlideIndex) {
              setCurrentSlide((prev) => prev + 1);
            } else if (info.offset.x > threshold && currentSlide > 0) {
              setCurrentSlide((prev) => prev - 1);
            }
          }}
          animate={isDragging ? false : { x: -currentSlide * fullCardWidth }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        >
          {items.map((item) => (
            <motion.div
              key={item.id}
              className="flex-shrink-0 w-[280px] bg-white rounded-2xl shadow-lg border border-[#d4b896]/20 overflow-hidden"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              onClick={() => onItemClick?.(item)}
            >
              <div className="relative">
                <img
                  src={BASE_URL + '/' + item.image}
                  alt={item.name}
                  className="w-full h-48 object-contain"
                />
                
                {/* Swap Type Badge - Left Side */}
                {item.swap_type && (
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 bg-[#2d1810]/90 text-[#f3ecd2] text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                      {item.swap_type}
                    </span>
                  </div>
                )}

                {/* Size Badge - Right Side */}
                {item.size && (
                  <div className="absolute top-3 right-3">
                    <span className="inline-block px-3 py-1 bg-[#8b4513]/90 text-white text-xs font-semibold rounded-full shadow-lg backdrop-blur-sm">
                      {item.size}
                    </span>
                  </div>
                )}

               
              </div>
              <div className="p-4">
                <h4 className="font-semibold bungee-regular text-center text-[#2d1810] text-sm mb-1">
                  {item.name}
                </h4>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Prev Button */}
        <motion.button
          type="button"
          onMouseDown={stopEvent}
          onTouchStart={stopEvent}
          onClick={() => handleSlideChange("prev")}
          disabled={currentSlide === 0}
          className={`absolute top-1/2 left-2 transform -translate-y-1/2 p-2 bg-[#8b4513] backdrop-blur-sm rounded-full shadow-lg z-10 transition-all ${currentSlide === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <ChevronLeftIcon className="w-6 h-6 text-[#fff]" />
        </motion.button>

        {/* Next Button */}
        <motion.button
          type="button"
          onMouseDown={stopEvent}
          onTouchStart={stopEvent}
          onClick={() => handleSlideChange("next")}
          disabled={currentSlide === maxSlideIndex}
          className={`absolute top-1/2 right-2 transform -translate-y-1/2 p-2 bg-[#8b4513] backdrop-blur-sm rounded-full shadow-lg z-10 transition-all ${currentSlide === maxSlideIndex ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          <ChevronRightIcon className="w-6 h-6 text-[#fff]" />
        </motion.button>
      </div>
    </div>
  );
}