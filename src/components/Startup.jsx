import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bannerD from "../assets/img/Startup/bannerD.jpg";
import bannerT from "../assets/img/Startup/bannerT.jpg";
import maleIcon from "../assets/img/Startup/maleIcon.png";
import femaleIcon from "../assets/img/Startup/femaleIcon.png";
import LoadingScreen from "./LoadingScreen";
import PageTransitionLoader from "./PageTransitionLoader";
import { useMediaQuery } from "react-responsive";
import Logo from '../assets/img/logo1.png'
export default function Startup() {
  const [selectedGender, setSelectedGender] = useState(null);
  const [isPressed, setIsPressed] = useState({ Male: false, Female: false });
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState(
    "Finding your perfect swap..."
  );
  const [isTransitioning, setIsTransitioning] = useState(false);
  const navigate = useNavigate();
  const isTab = useMediaQuery({ query: "(max-width:1024px)" });
  const bannerImage = isTab ? bannerT : bannerD;

  useEffect(() => {
    const messages = [
      "Finding your perfect swap...",
      "Analyzing your style preferences...",
      "Matching with nearby swappers...",
      "Preparing your personalized feed...",
      "Almost ready!",
    ];
    let idx = 0;

    const msgInterval = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setLoadingMessage(messages[idx]);
    }, 500);

    const finishTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => {
      clearInterval(msgInterval);
      clearTimeout(finishTimeout);
    };
  }, []);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    // Add haptic feedback simulation
    setIsPressed((prev) => ({ ...prev, [gender]: true }));
    setTimeout(() => {
      setIsPressed((prev) => ({ ...prev, [gender]: false }));
      // start page‑transition once the button “press” animation is done
      setIsTransitioning(true);
    }, 150);
  };

  return (
    <>
      <PageTransitionLoader
        isTransitioning={isTransitioning}
        fromPage="Home" // icon for your current screen
        toPage="Wardrobe" // use whatever icon key fits SelectCloth
        theme={selectedGender === "Male" ? "blue" : "pink"}
        duration={800}
        onTransitionComplete={() => {
          setIsTransitioning(false);
          navigate("/select-cloth", {
            state: selectedGender
          });
        }}
      />
      <LoadingScreen
        isLoading={isLoading}
        message={loadingMessage}
        onLoadingComplete={() => setIsLoading(false)}
        backgroundColor="#F3ECD2"
        primaryColor="#D97706"
        secondaryColor="#92400E"
      />
      {!isLoading && (
        <div
          className="min-h-screen flex flex-col items-center justify-center px-6 py-8 relative overflow-hidden"
          style={{ background: `url(${bannerImage}) no-repeat center/cover` }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 left-10 w-32 h-32 border border-amber-800 rounded-full"></div>
            <div className="absolute top-32 right-16 w-24 h-24 border border-amber-800 rounded-full"></div>
            <div className="absolute bottom-20 left-20 w-40 h-40 border border-amber-800 rounded-full"></div>
            <div className="absolute bottom-32 right-12 w-28 h-28 border border-amber-800 rounded-full"></div>
          </div>

          {/* Main Content */}
          <div className="relative z-10 w-full max-w-md mx-auto text-center">
            <div className="d-flex items-center justify-center">
              <img src={Logo} alt="" className="h-36 w-36 mx-auto"/>
            </div>

            {/* Title */}
            <div className="mb-16 animate-fade-in">
              <h1 className="text-3xl md:text-4xl font-bold text-amber-900 mb-4 tracking-tight">
                Choose Your
              </h1>
              <h2 className="text-2xl md:text-3xl font-normal text-amber-800 italic">
                Gender
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-800 mx-auto mt-6 rounded-full"></div>
            </div>
            {/* Gender Buttons */}
            <div className="flex  gap-8 justify-center items-center md:space-x-12">
              {/* Male Button */}

              <div className="flex-col items-center justify-center space-y-6">
                <img src={maleIcon} alt="" className="h-40 w-40" />
                <button
                  onClick={() => handleGenderSelect("Male")}
                  className={`group relative w-40 h-20 sm:w-40 sm:h-20 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${isPressed.male ? "scale-95" : ""
                    } ${selectedGender === "male" ? "ring-4 ring-amber-600" : ""
                    }`}
                  style={{
                    background: "linear-gradient(145deg, #4F46E5, #3730A3)",
                    boxShadow: isPressed.Male
                      ? "inset 8px 8px 16px rgba(0,0,0,0.2), inset -8px -8px 16px rgba(255,255,255,0.1)"
                      : "12px 12px 24px rgba(0,0,0,0.15), -12px -12px 24px rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-indigo-400 to-indigo-600 flex flex-col items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      Male
                    </span>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>

              {/* Female Button */}
              <div className="flex-col space-y-6">
                <img src={femaleIcon} alt="" className="w-40 h-40" />
                <button
                  onClick={() => handleGenderSelect("Female")}
                  className={`group relative w-40 h-20 sm:w-40 sm:h-20 rounded-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 ${isPressed.female ? "scale-95" : ""
                    } ${selectedGender === "female" ? "ring-4 ring-amber-600" : ""
                    }`}
                  style={{
                    background: "linear-gradient(145deg, #EC4899, #BE185D)",
                    boxShadow: isPressed.Female
                      ? "inset 8px 8px 16px rgba(0,0,0,0.2), inset -8px -8px 16px rgba(255,255,255,0.1)"
                      : "12px 12px 24px rgba(0,0,0,0.15), -12px -12px 24px rgba(255,255,255,0.1)",
                  }}
                >
                  <div className="absolute inset-2 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex flex-col items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      Female
                    </span>
                  </div>

                  {/* Shine Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>


          <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
      `}</style>
        </div>
      )}
    </>
  );
}
