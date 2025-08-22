import React, { useState, useEffect } from 'react'
import { X, ZoomIn, ZoomOut, RotateCw, Download, Share2 } from 'lucide-react'

// Enhanced Image Modal Component
export default function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  imageTitle,
  imageAlt = "Modal image",
  showTitle = true,
  showControls = true,
  className = "",
}) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // Close modal on escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    } else {
      // Reset transformations when modal closes
      setScale(1)
      setRotation(0)
      setIsImageLoaded(false)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.5, 3))
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.5, 0.5))
  const handleRotate = () => setRotation(prev => prev + 90)

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = imageSrc
    link.download = imageTitle || 'image'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: imageTitle || 'Shared Image',
          url: imageSrc
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(imageSrc)
      alert('Image URL copied to clipboard!')
    }
  }

  if (!isOpen || !imageSrc) return null

  return (
    <div className={`fixed inset-0 z-50 ${className}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border-b border-slate-700/50">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            {showTitle && imageTitle && (
              <h2 className="text-white font-medium text-sm sm:text-base ml-4 truncate max-w-xs sm:max-w-md">
                {imageTitle}
              </h2>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image Container */}
        <div className="flex-1 flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {!isImageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded-lg z-10">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}

            <img
              src={imageSrc}
              alt={imageAlt}
              className="rounded-lg shadow-2xl transition-transform duration-300 ease-out"
              style={{
                maxWidth: `${100 / scale}%`,
                maxHeight: `${100 / scale}%`,
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.5))'
              }}
              onLoad={() => setIsImageLoaded(true)}
              onError={() => setIsImageLoaded(true)}
            />
          </div>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="p-4 bg-gradient-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-md border-t border-slate-700/50">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              {/* Zoom Controls */}
              <div className="flex items-center space-x-1 bg-slate-700/50 rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  disabled={scale <= 0.5}
                  className="p-2 rounded-md hover:bg-slate-600/50 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Zoom out"
                >
                  <ZoomOut size={18} />
                </button>
                <span className="text-white text-sm font-medium px-2 min-w-[3rem] text-center">
                  {Math.round(scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  disabled={scale >= 3}
                  className="p-2 rounded-md hover:bg-slate-600/50 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  aria-label="Zoom in"
                >
                  <ZoomIn size={18} />
                </button>
              </div>

              {/* Rotate Button */}
              <button
                onClick={handleRotate}
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-white transition-colors duration-200"
                aria-label="Rotate image"
              >
                <RotateCw size={18} />
              </button>

              {/* Action Buttons */}
              <div className="flex space-x-1">
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-lg bg-blue-600/80 hover:bg-blue-500/80 text-white transition-colors duration-200"
                  aria-label="Download image"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-lg bg-green-600/80 hover:bg-green-500/80 text-white transition-colors duration-200"
                  aria-label="Share image"
                >
                  <Share2 size={18} />
                </button>
              </div>
            </div>

            {/* Mobile-friendly zoom slider */}
            <div className="mt-3 sm:hidden">
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

