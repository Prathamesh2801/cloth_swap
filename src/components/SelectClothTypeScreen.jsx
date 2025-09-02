import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PageTransitionLoader from "./PageTransitionLoader";
import PageHeader from "./utils/PageHeader";
import MasonryGrid from "./utils/MasonryGrid";
import bannerD from "../assets/img/SelectCloth/bannerD.png";

import { fetchClothByCategoryTypes } from "../api/Device/fetchDeviceClothes";
import FallbackScreen from "./ui/FallbackScreen";
import { ShirtIcon } from "lucide-react";


export default function SelectClothTypeScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const categoryId = location.state
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextAction, setNextAction] = useState(null); // { type: "forward", path, state } or { type: "back" }
  const [clothTypes, setClothTypes] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);


  async function getTypeClothes(categoryID) {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await fetchClothByCategoryTypes(categoryID);
      const formatted = response.Data.map((item) => ({
        id: item.Type_ID,
        name: item.Type_Title,
        image: item.Image_URL,
        description: item.Type_Description
      }))
      setClothTypes(formatted)
    } catch (error) {
      console.error("Error fetching clothes:", error);
      setHasError(true);

    } finally {
      setIsLoading(false);
    }

  }
  useEffect(() => {
    getTypeClothes(categoryId)
  }, [])


  const handleItemClick = (item) => {
    setNextAction({
      type: "forward",
      path: `/camera`,
      state: { categoryId, typeId: item.id },
    });
    setIsTransitioning(true);
  };


  const handleBack = () => {
    setNextAction({ type: "back" });
    setIsTransitioning(true);
  };



  const handleRetry = () => {
    getTypeClothes(categoryId)

  };


  const renderContent = () => {
    if (isLoading) {
      return (
        <FallbackScreen
          title="Loading..."
          subtitle="We're fetching your clothing options"
          icon={ShirtIcon}
          showAction={false}
          theme="amber"
        />
      );
    }

    if (hasError) {
      return (
        <FallbackScreen
          title="Something went wrong"
          subtitle="We couldn't load the clothing categories. Please try again."
          icon={ShirtIcon}
          actionText="Retry"
          onAction={handleRetry}
          theme="amber"
        />
      );
    }

    if (clothTypes.length === 0) {
      return (
        <FallbackScreen
          title="No Clothes Available"
          subtitle="We don't have any clothing items for this category at the moment."
          icon={ShirtIcon}
          actionText="Refresh"
          onAction={handleRetry}
          theme="amber"
        />
      );
    }

    return (
      <MasonryGrid
        items={clothTypes}
        onItemClick={handleItemClick}
        className="pb-8"
      />
    );
  };

  return (
    <>
      <PageTransitionLoader
        isTransitioning={isTransitioning}
        fromPage="Categories"
        toPage={nextAction?.type === "back" ? "Wardrobe" : "Camera Section"}
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-br from-[#f3ecd2] via-[#f8f3e8] to-[#e6d7b8]"
      >
        <div className="container mx-auto py-6">
          <PageHeader
            // title={`Select ${clothTypes.Type_Title  } Type`}
            title={`Select  Type`}
            subtitle="Choose your preferred style"
            onBack={handleBack}
            bannerImage={bannerD}
            className="mx-4"
          />

          {renderContent()}
        </div>
      </motion.div>
    </>
  );
}
