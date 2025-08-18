import React, { useState, useRef } from "react";
import { Camera, Check, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CameraCapture = ({ onImageCaptured }) => {
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedFile, setCapturedFile] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cameraState, setCameraState] = useState("idle"); // idle, preview

  const fileInputRef = useRef(null);

  const handleCaptureClick = () => {
    fileInputRef.current.click(); // Trigger file input
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setError("No file selected. Please choose an image.");
      console.error("No file selected from input.");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Selected file is not an image.");
      console.error("Selected file is not an image:", file.type);
      return;
    }
    setCapturedFile(file);
    setCapturedImage(URL.createObjectURL(file));
    setCameraState("preview");
    setError(null);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setCameraState("idle");
  };
  
  const confirmPhoto = () => {
  if (!capturedFile) {
    setError("No image selected. Please retake your photo.");
    return;
  }

  // Directly send the file object to parent
  if (onImageCaptured) {
    onImageCaptured(capturedFile);
  }
};


  return (
    <div
      className="min-h-[80vh] w-full flex items-center justify-center p-4"
      style={{ backgroundColor: "#f5efdb" }}
    >
      <div className="w-full max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {/* Initial State */}
          {cameraState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <motion.div
                className="w-32 h-32 mx-auto rounded-full flex items-center justify-center shadow-lg"
                style={{ backgroundColor: "#e7d8bb" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Camera size={48} style={{ color: "#2d1810" }} />
              </motion.div>

              <div>
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: "#2d1810" }}
                >
                  Take Your Photo
                </h2>
                <p className="text-lg opacity-80" style={{ color: "#2d1810" }}>
                  Strike a Pose — Make It Perfect
                </p>
              </div>

              <motion.button
                onClick={handleCaptureClick}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 disabled:opacity-50"
                style={{ backgroundColor: "#2d1810", color: "#f5efdb" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={20} />
                    Opening Camera...
                  </div>
                ) : (
                  "Open Camera"
                )}
              </motion.button>

              {/* Hidden input for native camera */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </motion.div>
          )}

          {/* Preview State */}
          {cameraState === "preview" && capturedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2
                  className="text-2xl font-bold mb-2"
                  style={{ color: "#2d1810" }}
                >
                  How does it look?
                </h2>
                <p className="text-lg opacity-80" style={{ color: "#2d1810" }}>
                  Review your photo before uploading
                </p>
              </div>

              <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <img
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-4">
                <motion.button
                  onClick={retakePhoto}
                  disabled={isLoading}
                  className="flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 disabled:opacity-50"
                  style={{ backgroundColor: "#e7d8bb", color: "#2d1810" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Retake
                </motion.button>

                <motion.button
                  onClick={confirmPhoto}
                  disabled={isLoading}
                  className="flex-1 py-4 px-6 rounded-2xl font-semibold text-lg transition-all duration-300 disabled:opacity-50"
                  style={{ backgroundColor: "#2d1810", color: "#f5efdb" }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin" size={20} />
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Check size={20} />
                      Upload
                    </div>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-4 p-4 rounded-xl text-center"
              style={{ backgroundColor: "#e7d8bb", color: "#2d1810" }}
            >
              <p className="font-medium">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm underline opacity-80 hover:opacity-100"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CameraCapture;
