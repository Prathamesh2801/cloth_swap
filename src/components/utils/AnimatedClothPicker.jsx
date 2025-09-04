import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../../config";

export const AnimatedClothPicker = ({
  autoplay = false,
  squareImages,
  onItemClick,
}) => {
  const [active, setActive] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % squareImages.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + squareImages.length) % squareImages.length);
  };

  const isActive = (index) => {
    return index === active;
  };

  const handleSelect = () => {
    if (onItemClick && !isDragging) {
      onItemClick(squareImages[active]);
    }
  };

  // Handle swipe gestures
  const handleDragEnd = (event, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      handleNext();
    } else if (swipe > swipeConfidenceThreshold) {
      handlePrev();
    }
    
    // Reset dragging state after a short delay
    setTimeout(() => setIsDragging(false), 100);
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 21) - 10;
  };

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 md:px-8 lg:px-8 py-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-8 xl:gap-16 items-center">
          {/* Image Section with Swipe Support */}
          <div className="flex justify-center">
            <motion.div 
              className="relative w-full max-w-xs sm:max-w-sm md:max-w-md xl:max-w-lg cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              whileDrag={{ cursor: "grabbing" }}
            >
              {/* Image container with proper 3:4 aspect ratio */}
              <div className="relative aspect-[3/4] p-3 md:p-4">
                <AnimatePresence>
                  {squareImages.map((image, index) => (
                    <motion.div
                      key={image.img}
                      initial={{
                        opacity: 0,
                        scale: 0.9,
                        z: -100,
                        rotate: randomRotateY(),
                      }}
                      animate={{
                        opacity: isActive(index) ? 1 : 0.7,
                        scale: isActive(index) ? 1 : 0.95,
                        z: isActive(index) ? 0 : -100,
                        rotate: isActive(index) ? 0 : randomRotateY(),
                        zIndex: isActive(index)
                          ? 900
                          : squareImages.length + 2 - index,
                        y: isActive(index) ? [0, -20, 0] : 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.9,
                        z: 100,
                        rotate: randomRotateY(),
                      }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                      }}
                      className="absolute bg-white rounded-2xl inset-3 md:inset-4 origin-bottom z-0 select-none"
                    >
                      <img
                        src={BASE_URL + "/" + image.img}
                        alt={BASE_URL + "/" + image.img}
                        className="h-full w-full rounded-2xl object-cover object-center shadow-lg pointer-events-none"
                        draggable={false}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
              
              {/* Swipe hint for mobile - only show on touch devices */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 md:hidden">
                <motion.div
                  className="flex items-center space-x-2 bg-black/20 backdrop-blur-sm rounded-full px-3 py-1"
                  initial={{ opacity: 0.7 }}
                  animate={{ opacity: [0.7, 0.3, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <motion.div
                    className="w-2 h-2 bg-white/80 rounded-full"
                    animate={{ x: [-4, 4, -4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span className="text-white/80 text-xs font-medium">Swipe</span>
                  <motion.div
                    className="w-2 h-2 bg-white/80 rounded-full"
                    animate={{ x: [4, -4, 4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-center space-y-8 xl:space-y-12">
            {/* Title */}
            <motion.div
              key={active}
              initial={{
                y: 20,
                opacity: 0,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{
                y: -20,
                opacity: 0,
              }}
              transition={{
                duration: 0.3,
                ease: "easeInOut",
              }}
              className="text-center xl:text-left"
            >
              <motion.h2
                className="text-3xl md:text-4xl xl:text-5xl font-bold mb-4"
                style={{ color: "#2d1810" }}
              >
                {squareImages.length > 0 && squareImages[active]?.title
                  ? squareImages[active].title.split("").map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{
                        filter: "blur(10px)",
                        opacity: 0,
                        y: 5,
                      }}
                      animate={{
                        filter: "blur(0px)",
                        opacity: 1,
                        y: 0,
                      }}
                      transition={{
                        duration: 0.6,
                        ease: "easeInOut",
                        delay: 0.02 * index,
                      }}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))
                  : null}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-lg md:text-xl opacity-80"
                style={{ color: "#2d1810" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 0.2 }}
              >
                {squareImages.length > 0 && squareImages[active]?.description
                  ? squareImages[active].description
                  : "Discover the perfect style for every occasion"}
              </motion.p>
            </motion.div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-16">
              {/* Previous Button */}
              <motion.button
                onClick={handlePrev}
                className="relative group h-16 w-16 md:h-20 md:w-20 flex items-center justify-center transition-all duration-300 hover:scale-110 hexagon-shape"
                style={{ backgroundColor: "#e7d8bb" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 hexagon-shape"
                  style={{ backgroundColor: "#2d1810" }}
                />
                <ArrowLeft
                  className="h-8 w-8 md:h-10 md:w-10 group-hover:-translate-x-1 transition-transform duration-300"
                  style={{ color: "#2d1810" }}
                />
              </motion.button>

              {/* Dots indicator */}
              <div className="flex space-x-2">
                {squareImages.map((_, index) => (
                  <motion.button
                    key={index}
                    className="w-2 h-2 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: isActive(index) ? "#2d1810" : "#e7d8bb",
                    }}
                    onClick={() => setActive(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>

              {/* Next Button */}
              <motion.button
                onClick={handleNext}
                className="relative group h-16 w-16 md:h-20 md:w-20 flex items-center justify-center transition-all duration-300 hover:scale-110 hexagon-shape"
                style={{ backgroundColor: "#e7d8bb" }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"
                  style={{ backgroundColor: "#2d1810" }}
                />
                <ArrowRight
                  className="h-8 w-8 md:h-10 md:w-10 group-hover:translate-x-1 transition-transform duration-300"
                  style={{ color: "#2d1810" }}
                />
              </motion.button>
            </div>

            {/* Action Button */}
            <motion.button
              className="w-full xl:w-auto px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-md border border-[#8b6f4e]/30 shadow-xl"
              style={{
                backgroundColor: "rgba(45, 24, 16, 0.97)", // Dark brown glass
                color: "#f5efdb",
              }}
              onClick={handleSelect}
              whileHover={{
                boxShadow: "0 10px 30px rgba(45, 24, 16, 0.5)",
                backdropFilter: "blur(12px)",
              }}
              whileTap={{ scale: 0.98 }}
            >
              Select This Style
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};