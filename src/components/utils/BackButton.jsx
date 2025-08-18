import React from 'react';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const BackButton = ({ onClick, className = "" }) => {
  return (
    <motion.button
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 
        bg-white/80 backdrop-blur-sm
        border border-[#d4b896]/30
        rounded-full shadow-lg
        text-[#2d1810] font-medium
        hover:bg-[#e6d7b8]/50 hover:border-[#8b4513]/40
        transition-all duration-300
        ${className}
      `}
    >
      <ArrowLeftIcon className="w-5 h-5" />
      Back
    </motion.button>
  );
};

export default BackButton;
