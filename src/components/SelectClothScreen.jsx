import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ShirtIcon } from "lucide-react";
import PageTransitionLoader from "./PageTransitionLoader";
import PageHeader from "./utils/PageHeader";
import bannerD from "../assets/img/SelectCloth/bannerD.png";
import { AnimatedClothPicker } from "./utils/AnimatedClothPicker";
import { fetchClothByCategory } from "../api/Device/fetchDeviceClothes";
import FallbackScreen from "./ui/FallbackScreen";

export default function SelectClothScreen() {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  // { type: "forward", path, state } or { type: "back" }
  const [nextAction, setNextAction] = useState(null);
  const [clothes, setClothes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  const selectedGender = location.state;
  console.log("Selected Gender : ", selectedGender);

  async function getCategoriesClothes(category) {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await fetchClothByCategory(category);
      const formatted = response.Data.map(item => ({
        id: item.Category_ID,
        title: item.Category_Title,
        description: item.Category_Description,
        img: item.Image_URL
      }));

      setClothes(formatted);
    } catch (error) {
      console.error("Error fetching clothes:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {

    getCategoriesClothes(selectedGender);

  }, [selectedGender]);

  const handleItemClick = (item) => {
    console.log("Clicked Item : ", item);
    setNextAction({
      type: "forward",
      path: `/select-cloth-type/${item.title}`,
      state: { selectedGender, categoryId: item.id },
    });
    setIsTransitioning(true);
  };

  const handleBack = () => {
    setNextAction({ type: "back" });
    setIsTransitioning(true);
  };

  const handleRetry = () => {
    getCategoriesClothes(selectedGender);
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

    if (clothes.length === 0) {
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
      <AnimatedClothPicker
        squareImages={clothes}
        onItemClick={handleItemClick}
      />
    );
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
          {renderContent()}
        </div>
      </motion.div>
    </>
  );
}