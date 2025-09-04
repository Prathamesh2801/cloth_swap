import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import Lottie from "lottie-react";
import { clothingTips } from "../../helper/dummyTips";

import cargoDelivery from '../../assets/animations/cargo-delivery.json';
import clothingStores from '../../assets/animations/clothing-stores.json';
import deliveryTruck from '../../assets/animations/delivery-truck.json';
import foldingTrolley from '../../assets/animations/folding-trolley.json';
import hangingClothe from '../../assets/animations/hanging-clothe.json';
import industrialProcesses from '../../assets/animations/industrial-processes.json';
import orderTracking from '../../assets/animations/order-tracking.json';
import packageDelivery from '../../assets/animations/package-delivery.json';
import reportList from '../../assets/animations/report-list.json';
import selectProduct from '../../assets/animations/select-product.json';
import servingCart from '../../assets/animations/serving-cart.json';
import sewingMachine from '../../assets/animations/sewing-machine.json';
import warehouse from '../../assets/animations/warehouse.json';

// Scene configurations with animations and messages
const loadingScenes = [
    {
        id: 'browsing',
        animation: clothingStores,
        title: "Browsing Virtual Wardrobe",
        duration: 12000,
        bgColor: "#F3ECD2"
    },
    {
        id: 'selecting',
        animation: selectProduct,
        title: "Selecting Perfect Items",
        duration: 12000,
        bgColor: "#FEF3C7"
    },
    {
        id: 'organizing',
        animation: foldingTrolley,
        title: "Organizing Your Choices",
        duration: 12000,
        bgColor: "#ECFDF5"
    },
    {
        id: 'hanging',
        animation: hangingClothe,
        title: "Preparing Garments",
        duration: 12000,
        bgColor: "#FDF2F8"
    },
    {
        id: 'sewing',
        animation: sewingMachine,
        title: "Customizing Perfect Fit",
        duration: 12000,
        bgColor: "#F0F9FF"
    },
    {
        id: 'processing',
        animation: industrialProcesses,
        title: "Processing Virtual Model",
        duration: 12000,
        bgColor: "#FAF5FF"
    },
    {
        id: 'warehouse',
        animation: warehouse,
        title: "Accessing Fashion Database",
        duration: 12000,
        bgColor: "#FFFBEB"
    },
    {
        id: 'cart',
        animation: servingCart,
        title: "Preparing Your Selections",
        duration: 12000,
        bgColor: "#F0FDF4"
    },
    {
        id: 'tracking',
        animation: orderTracking,
        title: "Tracking Progress",
        duration: 12000,
        bgColor: "#FEFCE8"
    },
    {
        id: 'reporting',
        animation: reportList,
        title: "Generating Results",
        duration: 12000,
        bgColor: "#F8FAFC"
    },
    {
        id: 'cargo',
        animation: cargoDelivery,
        title: "Loading Virtual Experience",
        duration: 12000,
        bgColor: "#FDF4FF"
    },
    {
        id: 'delivery',
        animation: deliveryTruck,
        title: "Delivering Perfect Matches",
        duration: 12000,
        bgColor: "#F0F9FF"
    },
    {
        id: 'final',
        animation: packageDelivery,
        title: "Almost Ready!",
        duration: 12000,
        bgColor: "#ECFEF0"
    }
];

export default function FinalLoadingScreen({
    isLoading = true,
    primaryColor = "#D97706",
    secondaryColor = "#92400E",
    estimatedTime = 180000,
    isCompleted = false, // NEW: Add completion flag
    onCompletionAnimationEnd = null // NEW: Callback when completion animation ends
}) {
    const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loadingText, setLoadingText] = useState("");
    const [dots, setDots] = useState("");
    const [tipIndex, setTipIndex] = useState(0);
    const [isCompletionPhase, setIsCompletionPhase] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const sceneRef = useRef(null);
    const progressRef = useRef(null);
    const tipRef = useRef(null);
    const startTimeRef = useRef(Date.now());
    const progressIntervalRef = useRef(null);
    const sceneTimerRef = useRef(null);

    const currentScene = loadingScenes[currentSceneIndex];

    // Normal progress tracking
    useEffect(() => {
        if (!isLoading || isCompletionPhase) return;

        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }

        progressIntervalRef.current = setInterval(() => {
            const elapsed = Date.now() - startTimeRef.current;
            const newProgress = Math.min((elapsed / estimatedTime) * 100, 95); // Cap at 95% until completion
            setProgress(newProgress);
        }, 100);

        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
        };
    }, [isLoading, estimatedTime, isCompletionPhase]);

    // Handle completion phase
    useEffect(() => {
        if (!isCompleted || isCompletionPhase) return;

        console.log("Starting completion phase...");
        setIsCompletionPhase(true);

        // Clear any existing intervals/timers
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
        }
        if (sceneTimerRef.current) {
            clearTimeout(sceneTimerRef.current);
        }

        // Animate progress to 100% over 3 seconds
        const startProgress = progress;
        const progressDuration = 3000;
        const progressStart = Date.now();

        const completeProgress = () => {
            const elapsed = Date.now() - progressStart;
            const progressPercent = Math.min(elapsed / progressDuration, 1);
            const currentProgress = startProgress + (100 - startProgress) * progressPercent;

            setProgress(currentProgress);

            if (progressPercent < 1) {
                requestAnimationFrame(completeProgress);
            } else {
                // Progress complete, show success animation
                setShowSuccessMessage(true);
                setLoadingText("Perfect! Your style is ready");

                // Final completion after success animation
                setTimeout(() => {
                    if (onCompletionAnimationEnd) {
                        onCompletionAnimationEnd();
                    }
                }, 2000);
            }
        };

        // Speed up scene transitions during completion
        const fastSceneInterval = setInterval(() => {
            setCurrentSceneIndex(prev => (prev + 1) % loadingScenes.length);
        }, 500);

        completeProgress();

        return () => {
            clearInterval(fastSceneInterval);
        };
    }, [isCompleted, progress, onCompletionAnimationEnd, isCompletionPhase]);

    // Scene transitions (only during normal loading)
    useEffect(() => {
        if (!isLoading || isCompletionPhase) return;

        if (sceneTimerRef.current) {
            clearTimeout(sceneTimerRef.current);
        }

        if (currentSceneIndex < loadingScenes.length - 1) {
            sceneTimerRef.current = setTimeout(() => {
                // Animate scene transition
                if (sceneRef.current) {
                    gsap.to(sceneRef.current, {
                        scale: 0.9,
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            setCurrentSceneIndex(prev => prev + 1);
                            gsap.fromTo(sceneRef.current,
                                { scale: 1.1, opacity: 0 },
                                { scale: 1, opacity: 1, duration: 0.6 }
                            );
                        }
                    });
                }
            }, currentScene.duration);
        } else {
            // Loop back to first scene if we reach the end
            sceneTimerRef.current = setTimeout(() => {
                if (sceneRef.current) {
                    gsap.to(sceneRef.current, {
                        scale: 0.9,
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            setCurrentSceneIndex(0);
                            gsap.fromTo(sceneRef.current,
                                { scale: 1.1, opacity: 0 },
                                { scale: 1, opacity: 1, duration: 0.6 }
                            );
                        }
                    });
                }
            }, currentScene.duration);
        }

        return () => {
            if (sceneTimerRef.current) {
                clearTimeout(sceneTimerRef.current);
            }
        };
    }, [currentSceneIndex, isLoading, currentScene.duration, isCompletionPhase]);

    // Animated loading text effect
    useEffect(() => {
        if (!isLoading) return;

        const fullText = isCompletionPhase && showSuccessMessage ?
            "Perfect! Your style is ready" :
            currentScene.title;
        let currentIndex = 0;
        setLoadingText("");

        const typeInterval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setLoadingText(fullText.slice(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(typeInterval);
            }
        }, isCompletionPhase ? 40 : 80); // Faster typing during completion

        return () => clearInterval(typeInterval);
    }, [currentScene.title, isLoading, isCompletionPhase, showSuccessMessage]);

    // Animated dots effect
    useEffect(() => {
        if (!isLoading || showSuccessMessage) return;

        const dotsInterval = setInterval(() => {
            setDots((prev) => {
                if (prev.length >= 3) return "";
                return prev + ".";
            });
        }, isCompletionPhase ? 200 : 500); // Faster dots during completion

        return () => clearInterval(dotsInterval);
    }, [isLoading, isCompletionPhase, showSuccessMessage]);

    // Tips rotation
    useEffect(() => {
        if (!isLoading || isCompletionPhase) return;

        const tipTimer = setInterval(() => {
            setTipIndex((prev) => {
                const next = (prev + 1) % clothingTips.length;
                if (tipRef.current) {
                    gsap.fromTo(tipRef.current,
                        { y: 10, opacity: 0 },
                        { y: 0, opacity: 1, duration: 0.5 }
                    );
                }
                return next;
            });
        }, 4000);

        return () => clearInterval(tipTimer);
    }, [isLoading, isCompletionPhase]);

    if (!isLoading) {
        return null;
    }

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        backgroundColor: showSuccessMessage ? "#10B981" : currentScene.bgColor
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.95,
                        transition: { duration: 0.8 }
                    }}
                    transition={{
                        opacity: { duration: 0.3 },
                        backgroundColor: { duration: 0.2 }
                    }}
                    className="fixed inset-0 z-50 flex items-center justify-center transition-colors duration-1000"
                >
                    {/* Success Confetti Effect */}
                    {showSuccessMessage && (
                        <div className="absolute inset-0 overflow-hidden pointer-events-none">
                            {[...Array(20)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    className="absolute w-2 h-2 bg-white rounded-full"
                                    style={{
                                        left: `${Math.random() * 100}%`,
                                        top: `${Math.random() * 100}%`,
                                    }}
                                    animate={{
                                        y: [0, -100, 100],
                                        x: [0, Math.random() * 50 - 25],
                                        opacity: [0, 1, 0],
                                        scale: [0, 1.5, 0]
                                    }}
                                    transition={{
                                        duration: 2,
                                        delay: i * 0.1,
                                        ease: "easeOut"
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {/* Floating background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {[...Array(8)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="absolute opacity-5"
                                style={{
                                    left: `${10 + i * 11}%`,
                                    top: `${5 + i * 11}%`,
                                }}
                                animate={{
                                    x: [0, 20, -10, 0],
                                    y: [0, -15, 10, 0],
                                    rotate: [0, 10, -5, 0],
                                    scale: [1, 1.1, 0.9, 1]
                                }}
                                transition={{
                                    duration: isCompletionPhase ? 2 : 8 + i * 0.5,
                                    repeat: Infinity,
                                    delay: i * 0.2
                                }}
                            >
                                <svg
                                    className="w-8 h-8 md:w-12 md:h-12"
                                    fill="currentColor"
                                    style={{ color: i % 2 === 0 ? primaryColor : secondaryColor }}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M16 4l.5-2h-9L8 4H5.5L3 10v11h18V10l-2.5-6H16zM12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
                                </svg>
                            </motion.div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">

                        {/* Main Scene Animation */}
                        <motion.div
                            ref={sceneRef}
                            className="mb-8"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{
                                scale: showSuccessMessage ? 1.1 : 1,
                                opacity: 1
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="w-48 h-48 md:w-64 md:h-64 mx-auto mb-6 relative">
                                {/* Animated border */}
                                <motion.div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: showSuccessMessage ?
                                            `conic-gradient(from 0deg, #10B981, #059669, #10B981)` :
                                            `conic-gradient(from 0deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})`
                                    }}
                                    animate={{ rotate: 360 }}
                                    transition={{
                                        duration: isCompletionPhase ? 2 : 8,
                                        repeat: Infinity
                                    }}
                                />

                                {/* Success checkmark */}
                                {showSuccessMessage && (
                                    <motion.div
                                        className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ duration: 1, type: "spring" }}
                                    >
                                        <motion.svg
                                            className="w-24 h-24 text-green-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        >
                                            <motion.path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </motion.svg>
                                    </motion.div>
                                )}

                                {/* Animation container */}
                                {!showSuccessMessage && (
                                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-32 h-32 md:w-48 md:h-48">
                                            <Lottie
                                                animationData={currentScene.animation}
                                                loop={true}
                                                autoplay={true}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    filter: `drop-shadow(0 4px 8px ${primaryColor}30)`
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Scene Title and Subtitle */}
                        <motion.div
                            key={`${currentSceneIndex}-${showSuccessMessage}`}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="mb-6"
                        >
                            <h2
                                className="text-2xl md:text-4xl font-bold mb-2"
                                style={{ color: showSuccessMessage ? "white" : secondaryColor }}
                            >
                                {loadingText}
                                {!showSuccessMessage && (
                                    <span className="inline-block w-8 text-left">{dots}</span>
                                )}
                            </h2>
                        </motion.div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: showSuccessMessage ? "white" : secondaryColor }}
                                >
                                    Progress
                                </span>
                                <span
                                    className="text-sm font-medium"
                                    style={{ color: showSuccessMessage ? "white" : secondaryColor }}
                                >
                                    {Math.round(progress)}%
                                </span>
                            </div>

                            <div
                                className="w-full h-3 rounded-full overflow-hidden shadow-inner"
                                style={{ backgroundColor: showSuccessMessage ? "rgba(255,255,255,0.2)" : `${primaryColor}15` }}
                            >
                                <motion.div
                                    className="h-full rounded-full relative overflow-hidden"
                                    style={{
                                        background: showSuccessMessage ?
                                            "linear-gradient(90deg, #10B981, #059669)" :
                                            `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`
                                    }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: isCompletionPhase ? 0.1 : 0.5 }}
                                >
                                    {/* Shimmer effect */}
                                    <motion.div
                                        className="absolute inset-0 -skew-x-12"
                                        style={{
                                            background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`
                                        }}
                                        animate={{ x: ["-100%", "200%"] }}
                                        transition={{
                                            duration: isCompletionPhase ? 0.5 : 2,
                                            repeat: Infinity,
                                            repeatDelay: isCompletionPhase ? 0 : 1
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </div>

                        {/* Scene Indicators */}
                        {!showSuccessMessage && (
                            <div className="flex justify-center space-x-2 mb-6">
                                {loadingScenes.map((scene, index) => (
                                    <motion.div
                                        key={scene.id}
                                        className="w-2 h-2 rounded-full"
                                        style={{
                                            backgroundColor: index <= currentSceneIndex ? primaryColor : `${primaryColor}30`
                                        }}
                                        animate={{
                                            scale: index === currentSceneIndex ? 1.2 : 1
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Tips Section */}
                        {!showSuccessMessage && (
                            <motion.div
                                className="px-6 py-3 bg-white/90 rounded-2xl shadow-lg max-w-md mx-auto"
                                style={{ backdropFilter: 'blur(10px)' }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="flex items-center space-x-3">
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{
                                            duration: isCompletionPhase ? 2 : 8,
                                            repeat: Infinity
                                        }}
                                    >
                                        <svg
                                            className="w-5 h-5"
                                            fill="currentColor"
                                            style={{ color: primaryColor }}
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                        </svg>
                                    </motion.div>

                                    <div ref={tipRef} className="text-sm font-medium" style={{ color: secondaryColor }}>
                                        <span className="opacity-60">💡 Tip: </span>
                                        {clothingTips[tipIndex]}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Success Message */}
                        {showSuccessMessage && (
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-lg text-white font-medium"
                            >
                                🎉 Your virtual fitting is complete!
                            </motion.p>
                        )}

                        {/* Processing message */}
                        {/* {!showSuccessMessage && (
                            <motion.p
                                className="text-xs opacity-50 mt-4"
                                style={{ color: secondaryColor }}
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                AI is working hard to create your perfect virtual fitting experience...
                            </motion.p>
                        )} */}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}