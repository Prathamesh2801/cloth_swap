
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"

const ImageModal = ({
  isOpen,
  onClose,
  imageSrc,
  imageTitle,
  imageAlt = "Modal image",
  showTitle = true,
  overlayOpacity = 0.75,
  maxWidth = "4xl",
  className = "",
}) => {
  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!imageSrc) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0  bg-black flex items-center justify-center z-50 p-2 sm:p-4 ${className}`}
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className={`relative w-full max-w-${maxWidth} max-h-full flex flex-col`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <motion.button
              onClick={onClose}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm sm:text-base font-bold shadow-lg transition-colors"
              style={{
                backgroundColor: "#f7f2e5",
                color: "#333",
              }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "#e8dabe",
              }}
              whileTap={{ scale: 0.9 }}
              aria-label="Close modal"
            >
              ✕
            </motion.button>

            {/* Image container */}
            <div className="relative flex-1 flex items-center justify-center">
              <img
                src={imageSrc || "/placeholder.svg"}
                alt={imageAlt}
                className="max-w-full max-h-[85vh] sm:max-h-[90vh] object-contain rounded-lg shadow-2xl"
                style={{ backgroundColor: "#f7f2e5" }}
                loading="lazy"
              />
            </div>

            {/* Title overlay */}
            {showTitle && imageTitle && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 rounded-b-lg"
                style={{
                  backgroundColor: "rgba(232, 218, 190, 0.95)",
                  backdropFilter: "blur(8px)",
                }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-sm sm:text-lg font-medium text-gray-800 text-center truncate">{imageTitle}</h3>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ImageModal
