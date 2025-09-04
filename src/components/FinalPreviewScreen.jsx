import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  ShareIcon,
  ArrowDownCircleIcon,
  AdjustmentsHorizontalIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

import PageHeader from "./utils/PageHeader";
import PageTransitionLoader from "./PageTransitionLoader";
import { useLocation, useNavigate } from "react-router-dom";

import bannerD from "../assets/img/SelectCloth/bannerD.png";

import FinalMasonaryGrid from "./utils/FinalMasonaryGrid";
import CarouselComponent from "./utils/CarouselComponent";

import { fetchAllFinalClothes } from "../api/Device/fetchDeviceClothes";
import { startSSEProcess } from "../api/Device/finalClothSwap";
import FinalLoadingScreen from "./ui/FinalLoadingScreen";

// Size options for the filter
const SIZE_OPTIONS = [
  { value: null, label: "All Sizes" },
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "XXL" },
];

export default function FinalPreviewScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const carouselRef = useRef(null);
  const { gender, typeId, capturedImage, categoryId } = location.state || {};
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextAction, setNextAction] = useState(null);
  const [isSwapping, setIsSwapping] = useState(false); // for SSE swap overlay
  const [isClothesLoading, setIsClothesLoading] = useState(false); // for fetching clothes
  const [loadingMessage, setLoadingMessage] = useState("Finding your perfect swap...");
  const [finalImage, setFinalImage] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [swapAttempt, setSwapAttempt] = useState(0);


  // NEW: Enhanced loading states
  const [apiCompleted, setApiCompleted] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);

  // Clothes and selection state
  const [clothes, setClothes] = useState([]);
  const [currentSelection, setCurrentSelection] = useState({
    category: null,
    type: null,
    typeId: typeId || null
  });

  // New state for size filtering
  const [selectedSize, setSelectedSize] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Convert capturedImage (File or URL) to previewUrl
  useEffect(() => {
    if (capturedImage instanceof File) {
      const url = URL.createObjectURL(capturedImage);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // cleanup
    } else {
      setPreviewUrl(capturedImage);
    }
  }, [capturedImage]);

  // Load initial clothes if typeId is provided
  useEffect(() => {
    const id = currentSelection.typeId || typeId;
    if (id) {
      loadTypeClothes(id, selectedSize);
    }
  }, [currentSelection.typeId, typeId, selectedSize]);




  // Enhanced function to fetch clothes with size filter
  async function loadTypeClothes(typeId, clothSize) {
    setIsClothesLoading(true);
    try {
      const response = await fetchAllFinalClothes(typeId, clothSize);
      if (response?.Status && Array.isArray(response.Data)) {
        setClothes(response.Data);
      } else {
        setClothes([]); // ensure empty array so UI shows "No results"
      }
    } catch (err) {
      console.error("Error fetching final clothes", err);
      setClothes([]); // keep UI responsive
    } finally {
      setIsClothesLoading(false);
    }
  }

  const handleBack = () => {
    setNextAction({ type: "back" });
    setIsTransitioning(true);
  };

  const handleDownload = async () => {
    try {
      const downloadUrl = finalImage || previewUrl;
      if (!downloadUrl) {
        alert("No image available to download!");
        return;
      }

      // Fetch the image data
      const response = await fetch(downloadUrl, { mode: "cors" });
      const blob = await response.blob();

      // Create a temporary object URL
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "swapped-image.png"; // ✅ force file download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup memory
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed", err);
      alert("Failed to download image. Please try again.");
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = finalImage || previewUrl; // ✅ prioritize finalImage
      if (!shareUrl) {
        alert("No image available to share!");
        return;
      }

      // Fetch the image and turn into blob
      const response = await fetch(shareUrl);
      const blob = await response.blob();
      const file = new File([blob], "swapped-image.png", { type: blob.type });

      // Check if file sharing is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "Shared Image",
          files: [file], // ✅ Direct image share
        });
      } else if (navigator.share) {
        await navigator.share({
          title: "Shared Image",
          url: shareUrl, // fallback: share link
        });
      } else {
        navigator.clipboard.writeText(shareUrl);
        alert("Image URL copied to clipboard!");
      }
    } catch (err) {
      console.log("Share cancelled or failed", err);
    }
  };

  const handleSwipeUp = () => {
    setIsFilterModalOpen(true);
  };

  // Handle size filter selection
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  // Toggle filter panel
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle type selection from FinalMasonaryGrid
  const handleTypeSelected = (selectionData) => {
    const { typeId, clothes, category, type } = selectionData;
    setCurrentSelection({ category, type, typeId });
    setClothes(clothes);
    setIsFilterModalOpen(false); // Close modal after selection
  };

  // Handle going back in the masonry grid
  const handleMasonryBack = () => {
    // If we're at the root level, close the modal
    setIsFilterModalOpen(false);
  };

  // NEW: Handle completion animation end
  const handleCompletionAnimationEnd = () => {
    console.log("Completion animation ended, hiding loading screen");
    setShowLoadingScreen(false);
    setIsSwapping(false);
    setApiCompleted(false); // Reset for next swap
  };



  const handleClothClick = async (cloth) => {
    console.log("Cloth clicked:", cloth);

    // 🔑 increase attempt count (forces fresh FinalLoadingScreen per swap)
    setSwapAttempt((prev) => prev + 1);
    // Reset states for new swap
    setApiCompleted(false);
    setShowLoadingScreen(true);
    setIsSwapping(true);
    setLoadingMessage("Starting swap...");

    await startSSEProcess(
      capturedImage, // person
      cloth.id, // clothId
      (eventType, data) => {
        console.log("SSE event received:", eventType, data);

        // update messages
        if (data?.data && typeof data.data === "string") {
          setLoadingMessage(data.data);
        } else if (data?.data && typeof data.data === "object") {
          setLoadingMessage(data.data?.message ?? JSON.stringify(data.data));
        } else if (data?.status) {
          setLoadingMessage(data.status);
        }

        // completed -> update finalImage
        if (eventType === "completed") {
          const url = data?.data?.data?.[0]?.fileUrl;
          if (url) {
            setFinalImage(url);
            console.log("Final swapped image:", url);
          }
        }

        // done -> mark API as completed (don't hide loading screen yet)
        if (eventType === "done") {
          console.log("API completed, starting completion animation");
          setApiCompleted(true); // This will trigger the completion animation
          // Note: Don't set setIsSwapping(false) here anymore
        }
      },
      (err) => {
        console.error("SSE error:", err);
        setLoadingMessage("Swap failed. Please try again.");
        setShowLoadingScreen(false);
        setIsSwapping(false);
        setApiCompleted(false);
      },
      (parsedDone) => {
        console.log("SSE onComplete:", parsedDone);
      }
    );
  };

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

      <FinalLoadingScreen
        // 🔑 force remount on each swap
        key={swapAttempt}
        isLoading={showLoadingScreen}
        isCompleted={apiCompleted}
        primaryColor="#D97706"
        secondaryColor="#92400E"
        estimatedTime={180000} // 3 minutes
        onCompletionAnimationEnd={handleCompletionAnimationEnd}
      />

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
              <div className="w-full h-[60vh] sm:h-[70vh] flex items-center justify-center bg-gray-100">
                {finalImage || previewUrl ? (
                  <img
                    src={finalImage || previewUrl}
                    alt="Final Style"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <p className="text-gray-500 font-medium text-center px-4">
                    No image available. Please capture or swap an image to preview.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleShare}
                  title="Share Image"
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                >
                  <ShareIcon className="w-5 h-5 text-[#8b4513]" />
                </motion.button>
                <motion.button
                  onClick={handleDownload}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Download Image"
                  className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg"
                >
                  <ArrowDownCircleIcon className="w-5 h-5 text-[#8b4513]" />
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

            {/* Collection header + filter toggle should always be visible */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-3xl font-bold text-[#2d1810] mb-5 ml-5 bebas-neue-regular tracking-wide">
                {currentSelection.type?.name
                  ? `${currentSelection.type.name} Collection`
                  : "Recommended for You"
                }

                {selectedSize && (
                  <span className="ml-2 text-sm font-normal text-[#8b4513] bg-white px-2 py-1 rounded-full">
                    Size: {selectedSize}
                  </span>
                )}
              </h3>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleFilters}
                className="flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg border border-[#d4b896]/20"
              >
                <AdjustmentsHorizontalIcon className="w-4 h-4 text-[#8b4513]" />
                <span className="text-[#8b4513] text-sm font-medium">Filters</span>
              </motion.button>
            </div>

            {/* Filter Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#d4b896]/20 overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-[#2d1810]">Size Filter</h4>
                      {selectedSize && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSizeSelect(null)}
                          className="text-xs text-[#8b4513] hover:text-[#2d1810] underline"
                        >
                          Clear
                        </motion.button>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-6">
                      {SIZE_OPTIONS.map((option) => (
                        <motion.button
                          key={option.label}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSizeSelect(option.value)}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSize === option.value
                            ? "bg-[#8b4513] text-white shadow-lg"
                            : "bg-gray-100 text-[#645b58] hover:bg-gray-200"
                            }`}
                        >
                          {option.label}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Carousel or states */}
            {isClothesLoading ? (
              <div className="mb-8 px-4 text-[#8b4513]">Loading fits…</div>
            ) : clothes.length > 0 ? (
              <CarouselComponent
                items={clothes.map((c) => ({
                  id: c.Cloth_ID,
                  name: c.Cloth_Title,
                  image: c.Image_URL,
                  size: c.Cloth_Size,
                  swap_type: c.Cloth_Swap_Type,
                }))}
                onItemClick={handleClothClick}
              />
            ) : (
              <div className="mb-8 px-4 text-center text-[#8b4513]">
                No items found for {selectedSize || "All Sizes"}.
                <button
                  onClick={() => handleSizeSelect(null)}
                  className="ml-2 underline"
                >
                  Clear size
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Modal with FinalMasonaryGrid */}
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
                <FinalMasonaryGrid
                  gender={gender}
                  initialCategoryId={categoryId}
                  initialTypeId={currentSelection.typeId}
                  selectedSize={selectedSize}
                  onTypeSelected={handleTypeSelected}
                  onBack={handleMasonryBack}
                  className="flex-1 overflow-hidden"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}