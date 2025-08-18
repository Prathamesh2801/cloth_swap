import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBagIcon,
  TagIcon,
  CameraIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export default function PageTransitionLoader({
  isTransitioning = false,
  fromPage = "Home",
  toPage = "Profile",
  duration = 800,
  onTransitionComplete = () => {},
  theme = "amber", // amber, blue, pink, green
}) {
  const [progress, setProgress] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);

  const themes = {
    amber: {
      primary: "#F59E0B",
      secondary: "#D97706",
      background: "rgba(251, 191, 36, 0.95)",
      text: "#92400E",
    },
    blue: {
      primary: "#3B82F6",
      secondary: "#1D4ED8",
      background: "rgba(59, 130, 246, 0.95)",
      text: "#1E3A8A",
    },
    pink: {
      primary: "#EC4899",
      secondary: "#BE185D",
      background: "rgba(236, 72, 153, 0.95)",
      text: "#831843",
    },
    green: {
      primary: "#10B981",
      secondary: "#047857",
      background: "rgba(16, 185, 129, 0.95)",
      text: "#064E3B",
    },
  };

  const currentTheme = themes[theme];

  // Quick icons for different pages
  const pageIcons = {
    Home: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
      </svg>
    ),
    Profile: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
    ),
    Wardrobe: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z" />
      </svg>
    ),
    Swap: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
      </svg>
    ),
    Chat: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2z" />
      </svg>
    ),
    Settings: (
      <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.82,11.69,4.82,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z" />
      </svg>
    ),
    SelectCloth: <ShoppingBagIcon className="w-full h-full" />,

    Categories: <TagIcon className="w-full h-full" />,

    "Camera Section": <CameraIcon className="w-full h-full" />,

    "Final Result": <PhotoIcon className="w-full h-full" />,
  };

  // Progress animation
  useEffect(() => {
    if (!isTransitioning) {
      setProgress(0);
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(onTransitionComplete, 100);
          return 100;
        }
        return prev + 100 / (duration / 50);
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [isTransitioning, duration, onTransitionComplete]);

  // Icon rotation effect
  useEffect(() => {
    if (!isTransitioning) return;

    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => (prev + 1) % 3);
    }, 200);

    return () => clearInterval(iconInterval);
  }, [isTransitioning]);

  return (
    <AnimatePresence>
      {isTransitioning && (
        <>
          {/* Slide-in overlay */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{
              duration: duration / 1000,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="fixed inset-0 z-[999] flex items-center justify-center"
            style={{ background: currentTheme.background }}
          >
            {/* Animated background pattern */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full opacity-20"
                  style={{
                    backgroundColor: currentTheme.primary,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.6, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            {/* Main content */}
            <div className="relative z-10 text-center">
              {/* Icon transition area */}
              <div className="flex items-center justify-center mb-6">
                {/* From page icon */}
                <motion.div
                  className="w-12 h-12 text-white"
                  animate={{
                    scale: [1, 0.8, 1],
                    rotate: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  {pageIcons[fromPage] || pageIcons["Home"]}
                </motion.div>

                {/* Arrow animation */}
                <motion.div
                  className="mx-4 text-white"
                  animate={{ x: [0, 10, 0] }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </motion.div>

                {/* To page icon */}
                <motion.div
                  className="w-12 h-12 text-white"
                  animate={{
                    scale: [0.8, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.3,
                  }}
                >
                  {pageIcons[toPage] || pageIcons["Profile"]}
                </motion.div>
              </div>

              {/* Loading text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-white text-lg font-semibold mb-2">
                  Going to {toPage}
                </h3>
                <div className="flex items-center justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-white rounded-full"
                      animate={{
                        scale: currentIcon === i ? [1, 1.5, 1] : 1,
                        opacity: currentIcon === i ? [0.5, 1, 0.5] : 0.5,
                      }}
                      transition={{ duration: 0.2 }}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Quick progress bar */}
              <motion.div
                className="mt-6 w-32 h-1 bg-white bg-opacity-30 rounded-full overflow-hidden mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.1 }}
              >
                <motion.div
                  className="h-full bg-white rounded-full"
                  style={{ width: `${progress}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Quick flash effect */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.3, 0],
            }}
            transition={{
              duration: 0.4,
              times: [0, 0.5, 1],
              delay: duration / 1000 - 0.4,
            }}
            className="fixed inset-0 z-40 bg-white pointer-events-none"
          />
        </>
      )}
    </AnimatePresence>
  );
}

// Demo component showing different transitions
// const PageTransitionDemo = () => {
//   const [isTransitioning, setIsTransitioning] = useState(false);
//   const [currentTransition, setCurrentTransition] = useState({
//     from: 'Home',
//     to: 'Profile',
//     theme: 'amber'
//   });

//   const transitions = [
//     { from: 'Home', to: 'Profile', theme: 'amber' },
//     { from: 'Profile', to: 'Wardrobe', theme: 'blue' },
//     { from: 'Wardrobe', to: 'Swap', theme: 'pink' },
//     { from: 'Swap', to: 'Chat', theme: 'green' },
//     { from: 'Chat', to: 'Settings', theme: 'amber' },
//     { from: 'Settings', to: 'Home', theme: 'blue' }
//   ];

//   const [transitionIndex, setTransitionIndex] = useState(0);

//   const handleTransition = () => {
//     setCurrentTransition(transitions[transitionIndex]);
//     setIsTransitioning(true);
//   };

//   const handleTransitionComplete = () => {
//     setIsTransitioning(false);
//     setTransitionIndex((prev) => (prev + 1) % transitions.length);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-8">
//       <PageTransitionLoader
//         isTransitioning={isTransitioning}
//         fromPage={currentTransition.from}
//         toPage={currentTransition.to}
//         theme={currentTransition.theme}
//         duration={800}
//         onTransitionComplete={handleTransitionComplete}
//       />

//       <div className="text-center bg-white rounded-2xl p-8 shadow-lg max-w-md">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">
//           Page Transition Loader
//         </h1>
//         <p className="text-gray-600 mb-8">
//           Quick and sleek transitions for page changes in your cloth swap app.
//         </p>

//         <div className="space-y-4">
//           <div className="text-sm text-gray-500">
//             Next transition: <span className="font-semibold">{transitions[transitionIndex].from}</span> → <span className="font-semibold">{transitions[transitionIndex].to}</span>
//           </div>

//           <button
//             onClick={handleTransition}
//             disabled={isTransitioning}
//             className="w-full px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//           >
//             {isTransitioning ? 'Transitioning...' : 'Start Page Transition'}
//           </button>

//           <div className="text-xs text-gray-400">
//             Duration: 800ms • Interactive • Themed
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PageTransitionDemo;
