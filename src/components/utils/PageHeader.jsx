import React from "react";
import { motion } from "framer-motion";
import { Home } from "lucide-react";
import BackButton from "./BackButton";
import Logo from '../../assets/img/logo1.png'

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
      <div className="relative p-6 md:p-8 bebas-neue-regular tracking-widest">
        {/* Desktop Layout - Single row with proper grid layout */}
        <div className="hidden lg:grid md:grid-cols-3 md:items-center md:gap-4">
          {/* Left side - Back Button + Logo */}
          <div className="flex items-center gap-4 justify-start">
            <BackButton onClick={onBack} />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex-shrink-0"
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-24 w-auto object-contain
                          filter drop-shadow-sm hover:drop-shadow-md
                          transition-all duration-300 ease-in-out
                          cursor-pointer hover:scale-105"
                onClick={handleHomeClick}
              />
            </motion.div>
          </div>

          {/* Center - Title + Subtitle */}
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl font-bold text-[#2d1810] mb-1"
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

          {/* Right side - Home Button */}
          <div className="flex justify-end">
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleHomeClick}
              className="flex items-center justify-center w-12 h-12
                        bg-[#2d1810] hover:bg-[#2d1810]/80
                        text-[#f3ecd2] hover:text-white
                       rounded-full shadow-lg hover:shadow-xl
                       transition-all duration-300 ease-in-out
                       focus:outline-none focus:ring-2 focus:ring-[#d4b896] focus:ring-offset-2
                       active:transform active:scale-95"
              aria-label="Go to home"
            >
              <Home
                size={20}
                className="stroke-2"
              />
            </motion.button>
          </div>
        </div>

        {/* Mobile Layout - Two rows as requested */}
        <div className="lg:hidden">
          {/* First Row - Navigation: Back + Logo (center) + Home */}
          <div className="grid grid-cols-3 items-center gap-2 mb-6">
            {/* Left - Back Button */}
            <div className="flex justify-start">
              <BackButton onClick={onBack} />
            </div>

            {/* Center - Logo */}
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex-shrink-0"
              >
                <img
                  src={Logo}
                  alt="Logo"
                  className="h-20 w-auto object-contain
                            filter drop-shadow-sm hover:drop-shadow-md
                            transition-all duration-300 ease-in-out
                            cursor-pointer hover:scale-105"
                  onClick={handleHomeClick}
                />
              </motion.div>
            </div>

            {/* Right - Home Button */}
            <div className="flex justify-end">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleHomeClick}
                className="flex items-center justify-center w-10 h-10
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
                  className="stroke-2"
                />
              </motion.button>
            </div>
          </div>

          {/* Second Row - Title and Subtitle (centered) */}
          <div className="text-center px-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold text-[#2d1810] mb-2"
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-[#2d1810]/70 text-base sm:text-lg leading-relaxed"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PageHeader;