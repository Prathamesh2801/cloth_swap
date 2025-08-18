import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import PageTransitionLoader from "./PageTransitionLoader";
import PageHeader from "./utils/PageHeader";
import MasonryGrid from "./utils/MasonryGrid";
import bannerD from "../assets/img/SelectCloth/bannerD.png";
import { fetchTypeClothes } from "../api/fetchClothes";

export default function SelectClothTypeScreen() {
  const navigate = useNavigate();

  const location = useLocation();
  const { clothCategory, clothType } = location.state

  const [isTransitioning, setIsTransitioning] = useState(false);
  // { type: "forward", path, state } or { type: "back" }
  const [nextAction, setNextAction] = useState(null);
  const [clothTypes, setClothTypes] = useState([])
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



  const handleItemClick = (item) => {
    setNextAction({
      type: "forward",
      path: `/camera`,
      state: {
        clothCategory: clothCategory,
        clothType: clothType,
        swapCloth: item.id
      },
    });
    setIsTransitioning(true);
  };


  const handleBack = () => {
    setNextAction({ type: "back" });
    setIsTransitioning(true);
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
            title={`Select ${clothType} Type`}
            subtitle="Choose your preferred style"
            onBack={handleBack}
            bannerImage={bannerD}
            className="mx-4"
          />

          <MasonryGrid
            items={clothTypes}
            onItemClick={handleItemClick}
            className="pb-8"
          />
        </div>
      </motion.div>
    </>
  );
}
