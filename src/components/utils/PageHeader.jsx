import React from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import BackButton from "./BackButton";

const PageHeader = ({
  title,
  subtitle,
  onBack,
  onHome,
  bannerImage,
  className = "",
}) => {
  const handleHomeClick = () => {
    if (onHome) {
      onHome();
    } else {
      // Default navigation to home
      window.location.href = '/';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative mb-8 ${className}`}
    >
      {/* Banner Background */}
      {bannerImage && (
        <div className="absolute inset-0 overflow-hidden rounded-3xl">
          <img
            src={bannerImage}
            alt="Banner"
            className="w-full h-full object-cover opacity-20"
          />
          <div
            className="absolute inset-0 bg-gradient-to-br 
                         from-[#f3ecd2]/90 to-[#d4b896]/80"
          />
        </div>
      )}

      {/* Content */}
      <div className="relative p-6 sm:p-8 bebas-neue-regular tracking-widest space-y-6">
        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          {/* Back Button */}
          <BackButton onClick={onBack} />

          {/* Home Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleHomeClick}
            className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 
                       bg-[#2d1810] hover:bg-[#2d1810]/80 
                       text-[#f3ecd2] hover:text-white
                       rounded-full shadow-lg hover:shadow-xl
                       transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-[#d4b896] focus:ring-offset-2
                       active:transform active:scale-95"
            aria-label="Go to home"
          >
            <Home 
              size={18} 
              className="sm:w-5 sm:h-5 stroke-2"
            />
          </motion.button>
        </div>

        {/* Title Section */}
        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-3xl sm:text-4xl font-bold text-[#2d1810] mb-2"
          >
            {title}
          </motion.h1>

          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-[#2d1810]/70 text-lg"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;