import React, { useState } from "react";
import bannerD from "../assets/img/SelectCloth/bannerD.png";
import PageHeader from "./utils/PageHeader";
import { motion } from "framer-motion";
import CameraCapture from "./utils/CameraCapture";
import PageTransitionLoader from "./PageTransitionLoader";
import { useLocation, useNavigate } from "react-router-dom";

export default function CameraSection() {
  const navigate = useNavigate();
  const location = useLocation();
  const {categoryId , typeId} = location.state;
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextAction, setNextAction] = useState(null);


  const handleImageCaptured = (file) => {
    setNextAction({
      type: "forward",
      path: "/final",
      state: {
        typeId: typeId,
        capturedImage: file,
        categoryId: categoryId
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
        fromPage="Camera Section"
        toPage={nextAction?.type === "back" ? "Categories" : "Final Result"}
        theme="amber"
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
            title="Capture Your Photo"
            subtitle="Capture Your Best Moment in Style"
            onBack={handleBack}
            bannerImage={bannerD}
            className="mx-4"
          />


          <CameraCapture
            onImageCaptured={handleImageCaptured}
          />
        </div>
      </motion.div>
    </>
  );
}