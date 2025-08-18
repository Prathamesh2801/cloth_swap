import React from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { motion } from 'framer-motion';
import { BASE_URL } from '../../../config';

const MasonryGrid = ({
  items,
  onItemClick,
  className = "",
  itemClassName = ""
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={`px-6 ${className}`}
    >
      <ResponsiveMasonry
        columnsCountBreakPoints={{
          300: 2,
          500: 2,
          700: 3,
          900: 4,
          1200: 5
        }}
      >
        <Masonry gutter="16px">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              variants={itemVariants}
              whileHover={{
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onItemClick && onItemClick(item)}
              className={`
                relative group cursor-pointer
                bg-white rounded-2xl shadow-lg
                border border-[#d4b896]/20
                overflow-hidden
                hover:shadow-xl hover:border-[#8b4513]/30
                transition-all duration-300
                ${itemClassName}
              `}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={BASE_URL + '/' + item.image}
                  alt={BASE_URL + '/' + item.name}
                  className="w-full h-auto object-cover 
                           group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-gradient-to-t 
                               from-[#2d1810]/20 to-transparent
                               opacity-0 group-hover:opacity-100
                               transition-opacity duration-300" />
              </div>

              {/* Content */}
              {item.name && (
                <div className="p-4  text-center">
                  <h3 className="text-[#2d1810] bungee-regular tracking-wider font-semibold text-sm sm:text-base
                               group-hover:text-[#8b4513] transition-colors duration-200">
                    {item.name}
                  </h3>
                  {item.description && (
                    <p className="text-[#2d1810]/70 open-sans-medium  text-xs sm:text-sm mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </Masonry>
      </ResponsiveMasonry>
    </motion.div>
  );
};

export default MasonryGrid;
