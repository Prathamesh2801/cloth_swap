import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import PageTransitionLoader from "./PageTransitionLoader";
import PageHeader from "./utils/PageHeader";
import bannerD from "../assets/img/SelectCloth/bannerD.png";
import { AnimatedClothPicker } from "./utils/AnimatedClothPicker";
import { fetchCategoryClothes } from "../api/fetchClothes";

export default function SelectClothScreen() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  // { type: "forward", path, state } or { type: "back" }
  const [nextAction, setNextAction] = useState(null);
  const [clothes, setClothes] = useState([])
  const location = useLocation()
  const selectedGender = location.state;

  async function getCategoriesClothes(category) {
    const response = await fetchCategoryClothes(category);
    const formatted = response.map(item => ({
      title: item.Title,
      description: item.Description,
      img: item.Image
    }));

    setClothes(formatted);
  }
  useEffect(() => {
    getCategoriesClothes(selectedGender)
  }, [])

  const handleItemClick = (item) => {

    setNextAction({
      type: "forward",
      path: `/select-cloth-type/${item.title}`,
      state: { clothCategory: selectedGender, clothType: item.title },
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
        fromPage="Wardrobe"
        toPage={nextAction?.type === "back" ? "Home" : "Categories"}
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
            title="Select Your Cloth"
            subtitle="Choose from our premium collection"
            onBack={handleBack}
            onItemClick={handleItemClick}
            bannerImage={bannerD}
            className="mx-4"
          />
          <AnimatedClothPicker
            squareImages={clothes}
            onItemClick={handleItemClick}
          />
        </div>
      </motion.div>
    </>
  );
}
