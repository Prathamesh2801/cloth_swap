import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { clothingTips } from "../helper/dummyTips";

export default function LoadingScreen({
  isLoading = true,
  message = "Finding your perfect swap...",
  onLoadingComplete = () => { },
  backgroundColor = "#F3ECD2",
  primaryColor = "#D97706",
  secondaryColor = "#92400E",
}) {
  const [loadingText, setLoadingText] = useState("");
  const [dots, setDots] = useState("");
  const circleRefs = useRef([]);
  const tipRef = useRef(null);
  const tipTimerRef = useRef(null);
  const [tipIndex, setTipIndex] = useState(0);



  // Animated loading text effect (re-types whenever message changes)
  useEffect(() => {
    if (!isLoading) return;

    const fullText = message;
    let currentIndex = 0;
    setLoadingText("");

    const typeInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setLoadingText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typeInterval);
      }
    }, 80);

    return () => clearInterval(typeInterval);
  }, [message, isLoading]);

  // Animated dots effect
  useEffect(() => {
    if (!isLoading) return;

    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return "";
        return prev + ".";
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, [isLoading]);

  // GSAP floating animation for cloth elements (replaces CSS animation approach)
  useEffect(() => {
    if (!isLoading) return;

    // create a small GSAP timeline for each floating element
    const tweens = circleRefs.current.map((el, idx) => {
      if (!el) return null;
      return gsap.to(el, {
        y: -15 - idx * 2,
        rotation: 10 + idx * 5,
        duration: 2 + idx * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: idx * 0.15,
      });
    });

    return () => {
      // kill all tweens on cleanup
      tweens.forEach((t) => t && t.kill());
    };
  }, [isLoading]);

  // Tip rotator: advance tipIndex every X seconds and animate via GSAP
  useEffect(() => {
    if (!isLoading) return;

    // animate entry on first render
    if (tipRef.current) {
      gsap.fromTo(
        tipRef.current,
        { y: 10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }

    tipTimerRef.current = setInterval(() => {
      setTipIndex((prev) => {
        const next = (prev + 1) % clothingTips.length;
        // micro-animation for text swap
        if (tipRef.current) {
          const tl = gsap.timeline();
          tl.to(tipRef.current, { y: 6, opacity: 0, duration: 0.25, ease: "power1.in" })
            .call(() => {
              // after fade-out, index will update via setTipIndex's updater return value
            })
            .to(tipRef.current, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
        }
        return next;
      });
    }, 6500); // change tip every 4.5s

    return () => {
      clearInterval(tipTimerRef.current);
      tipTimerRef.current = null;
    };
  }, [isLoading]); // restart rotator if loading resumes

  if (!isLoading) {
    return null;
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating cloth elements */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                ref={(el) => (circleRefs.current[i] = el)}
                className="absolute opacity-10"
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${6 + i * 12}%`,
                  transform: `rotate(${i * 30}deg)`,
                }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 8, -6, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 3 + i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.15,
                  }}
                >
                  {/* T-shirt icon */}
                  <svg
                    className="w-12 h-12 md:w-16 md:h-16"
                    fill="currentColor"
                    style={{
                      color: i % 2 === 0 ? primaryColor : secondaryColor,
                    }}
                    viewBox="0 0 24 24"
                  >
                    <path d="M16 4l.5-2h-9L8 4H5.5L3 10v11h18V10l-2.5-6H16zM12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
                  </svg>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-6 max-w-md mx-auto">
            {/* Main Loading Spinner */}
            <div className="relative mb-8">
              <motion.div
                className="w-24 h-24 mx-auto relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {/* Outer ring */}
                <div
                  className="w-full h-full rounded-full border-4 border-opacity-20"
                  style={{ borderColor: primaryColor }}
                />
                {/* Inner spinning element */}
                <motion.div
                  className="absolute inset-2 rounded-full border-4 border-transparent border-t-current"
                  style={{ color: primaryColor }}
                  animate={{ rotate: -360 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      style={{ color: primaryColor }}
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Loading Text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-4"
            >
              <h2
                className="text-2xl md:text-3xl font-bold mb-2"
                style={{ color: secondaryColor }}
              >
                {loadingText}
                <span className="inline-block w-6 text-left">{dots}</span>
              </h2>
              <p
                className="text-sm md:text-base opacity-80"
                style={{ color: secondaryColor }}
              >
                Hang tight while we prepare your perfect matches
              </p>
            </motion.div>

           

            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 3, ease: "easeOut" }}
              className="w-full max-w-xs mx-auto h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
                }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse",
                }}
              />
            </motion.div>

            {/* Fun Facts (kept) */}
            {/* Tip Area (framer-motion + GSAP micro animations) */}
            <div className="mb-2 mt-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tipIndex}
                  ref={tipRef}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="px-4 py-2 bg-white/90 rounded-full inline-block shadow-sm max-w-xs text-sm"
                  style={{ color: secondaryColor }}
                >
                  {clothingTips[tipIndex]}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
