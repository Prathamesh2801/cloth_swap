import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  XMarkIcon,
  HeartIcon,
  ShareIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import PageHeader from "./utils/PageHeader";
import PageTransitionLoader from "./PageTransitionLoader";
import { useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "./LoadingScreen";
import finalModalPreview from "../assets/img/FinalSection/final_preview.jpg";
import Sample1 from "../assets/img/FinalSection/s1.png";
import Sample2 from "../assets/img/FinalSection/s2.png";
import Sample3 from "../assets/img/FinalSection/s3.png";
import Sample4 from "../assets/img/FinalSection/s4.png";
import Sample5 from "../assets/img/FinalSection/s5.png";
import Sample6 from "../assets/img/FinalSection/s6.png";
import Sample7 from "../assets/img/FinalSection/s7.png";
import Sample8 from "../assets/img/FinalSection/s8.png";
import Sample9 from "../assets/img/FinalSection/s9.png";
import bannerD from "../assets/img/SelectCloth/bannerD.png";

import MasonryGrid from "./utils/MasonryGrid";
import CarouselComponent from "./utils/CarouselComponent";

import { startSSEProcess } from "../api/finalClothSwap";
import { fetchCategoryClothes, fetchTypeClothes } from "../api/fetchClothes";


export default function FinalPreviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);

  const { clothCategory,
    clothType,
    swapCloth,
    capturedImage } = location.state || {};

  console.log("Final Preview Data:", { clothCategory, clothType, swapCloth, capturedImage });

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextAction, setNextAction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState("Finding your perfect swap...");
  const [finalImage, setFinalImage] = useState('');

  const [favorites, setFavorites] = useState(new Set());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [clothTypes, setClothTypes] = useState([])
  const [categoryClothes, setCategoryClothes] = useState([])


  async function getTypeClothes(category, type) {

    const response = await fetchTypeClothes(category, type);
    const formatted = response.Items.map((item) => ({
      id: item.ID,
      name: item.Name,
      image: item.Image,
      description: item.Description
    }))
    setClothTypes(formatted)
  }
  useEffect(() => {
    getTypeClothes(clothCategory, clothType)
  }, [])

  async function getCategoriesClothes(category) {
    const response = await fetchCategoryClothes(category);
   const formatted = response.map((item) => ({
      id: item.ID,
      name: item.Name,
      image: item.Image,
      description: item.Description
    }))
    setCategoryClothes(formatted);
  }
  useEffect(() => {
    getCategoriesClothes(clothCategory)
  }, [])


  // Dummy data for recommendations
  const recommendations = [
    { image: Sample1, text: "Vintage Denim" },
    { image: Sample2, text: "Floral Summer" },
    { image: Sample3, text: "Cozy Knit" },
    { image: Sample4, text: "Plain subtle" },
    { image: Sample1, text: "Casual Amber Shirt" },
    { image: Sample6, text: "Elegant Snowlight" },
    { image: Sample1, text: "Vintage Denim" },
    { image: Sample2, text: "Floral Summer" },
    { image: Sample3, text: "Cozy Knit" },
    { image: Sample4, text: "Plain subtle" },
    { image: Sample2, text: "Casual Amber Shirt" },
    { image: Sample6, text: "Elegant Snowlight" },
  ];




  const handleBack = () => {
    setNextAction({ type: "back" });
    setIsTransitioning(true);
  };

  const handleSlideChange = (direction) => {
    if (direction === "next") {
      if (currentSlide < recommendations.length - 1) {
        setCurrentSlide(currentSlide + 1);
      }
    } else {
      if (currentSlide > 0) {
        setCurrentSlide(currentSlide - 1);
      }
    }
  };
  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter);
    setIsFilterModalOpen(true);
  };

  const handleSwipeUp = () => {
    setIsFilterModalOpen(true);
  };

  // Measure total scrollable width once recommendations change
  useEffect(() => {
    const el = carouselRef.current;
    if (el) {
      setMaxDrag(el.scrollWidth - el.offsetWidth);
    }
  }, [recommendations]);


  useEffect(() => {
    startSSEProcess(
      capturedImage,
      clothCategory,
      clothType,
      swapCloth,
      (eventType, data) => {
        console.log("SSE event received:", eventType, data);

        // Prefer string message locations
        if (data?.data && typeof data.data === "string") {
          setLoadingMessage(data.data);
        } else if (data?.data && typeof data.data === "object") {
          // step events often have data.message
          const maybeMsg = data.data?.message ?? JSON.stringify(data.data);
          setLoadingMessage(maybeMsg);
        } else if (data?.status && typeof data.status === "string") {
          setLoadingMessage(data.data ?? data.status);
        }

        // completed -> set final image (backend includes fileUrl in completed.data.data[0].fileUrl)
        if (eventType === "completed") {
          const url = data?.data?.data?.[0]?.fileUrl;
          if (url) {
            setFinalImage(url);
            console.log("final image URL set:", url);
          } else {
            console.log("completed received but no fileUrl:", data);
          }
        }

        // done -> stop loader
        if (eventType === "done") {
          console.log("SSE done received - stopping loader");
          setIsLoading(false);
        }
      },
      (err) => {
        console.error("SSE error:", err);
        setLoadingMessage("Something went wrong. Please try again.");
        setIsLoading(false);
      },
      (parsedDone) => {
        // optional final callback when 'done' is processed by helper
        console.log("onComplete (done) callback:", parsedDone);
      }
    );
  }, []);



  return (
    <>
      <PageTransitionLoader
        isTransitioning={isTransitioning}
        fromPage="Final Result"
        toPage={nextAction?.type === "back" ? "Camera Section" : "SelectClothType"}
        theme="green"
        duration={800}
        onTransitionComplete={() => {
          setIsTransitioning(false);
          if (nextAction) {
            if (nextAction.type === "back") {
              navigate(-1);
            } else {
              navigate(nextAction.path, { state: nextAction.state });
            }
            setNextAction(null);
          }
        }}
      />

      {isLoading ? (
        <LoadingScreen
          isLoading={isLoading}
          message={loadingMessage}
          backgroundColor="#F3ECD2"
          primaryColor="#D97706"
          secondaryColor="#92400E"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-gradient-to-br from-[#f3ecd2] via-[#f8f3e8] to-[#e6d7b8]"
        >
          <div className="container mx-auto py-6">
            <PageHeader
              title="Swap & Style Instantly"
              subtitle="See yourself in different styles before you decide."
              onBack={handleBack}
              className="mx-4"
              bannerImage={bannerD}
            />

            {/* Main Preview */}
            <div className="px-4 mt-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative bg-white lg:w-1/3 lg:mx-auto flex flex-col items-center justify-center rounded-3xl shadow-xl border border-[#d4b896]/20 overflow-hidden mb-8"
              >
                {finalImage ? (
                  <img
                    src={finalImage}
                    alt="Final Style"
                    className="w-full h-[60vh] sm:h-[70vh] object-contain"
                  />
                ) : (
                  <p className="p-4 text-center text-gray-500">No final image received</p>
                )}

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                  >
                    <ShareIcon className="w-5 h-5 text-[#8b4513]" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                  >
                    <ShoppingBagIcon className="w-5 h-5 text-[#8b4513]" />
                  </motion.button>
                </div>

                {/* Swipe Up Indicator */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer"
                  onClick={handleSwipeUp}
                >
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                    <p className="text-[#8b4513] text-sm font-medium">
                      Click for More Fits
                    </p>
                    <div className="w-8 h-1 bg-[#8b4513] rounded-full mx-auto mt-1" />
                  </div>
                </motion.div>
              </motion.div>

              <CarouselComponent items={clothTypes} />
            </div>
          </div>

          {/* Filter Modal */}
          <AnimatePresence>
            {isFilterModalOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={() => setIsFilterModalOpen(false)}
              >
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-br from-[#f3ecd2] via-[#f8f3e8] to-[#e6d7b8] rounded-t-3xl max-h-[80vh] flex flex-col"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="sticky top-0 bg-white/90 backdrop-blur-sm border-b border-[#d4b896]/20 p-4 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#2d1810]">Style Filters</h3>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsFilterModalOpen(false)}
                      className="p-2 bg-white rounded-full shadow-lg"
                    >
                      <XMarkIcon className="w-5 h-5 text-[#8b4513]" />
                    </motion.button>
                  </div>
                  <div className="p-4 overflow-y-auto flex-1">
                    <p className="text-[#2d1810]/70 text-sm mb-6">
                      Try different styles and see how they look on you!
                    </p>
                    <MasonryGrid
                      items={categoryClothes}
                      onItemClick={(filter) => {
                        setIsFilterModalOpen(false);
                      }}
                      className="pb-6"
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </>
  );
}