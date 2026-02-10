"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Loader2, ZoomIn, RotateCcw, X } from "lucide-react"

interface ImageEnhancerProps {
  src: string
  alt: string
  className?: string
  loading?: "eager" | "lazy"
  fetchPriority?: "high" | "low" | "auto"
}

function applyEnhancement(
  sourceCanvas: HTMLCanvasElement,
  targetCanvas: HTMLCanvasElement,
  scale: number
) {
  const sw = sourceCanvas.width
  const sh = sourceCanvas.height
  const tw = Math.round(sw * scale)
  const th = Math.round(sh * scale)

  targetCanvas.width = tw
  targetCanvas.height = th

  const sourceCtx = sourceCanvas.getContext("2d", { willReadFrequently: true })
  const targetCtx = targetCanvas.getContext("2d", { willReadFrequently: true })
  if (!sourceCtx || !targetCtx) return

  // Step 1: High-quality upscale using browser's bicubic interpolation
  targetCtx.imageSmoothingEnabled = true
  targetCtx.imageSmoothingQuality = "high"
  targetCtx.drawImage(sourceCanvas, 0, 0, tw, th)

  // Step 2: Apply sharpening via unsharp mask
  const imageData = targetCtx.getImageData(0, 0, tw, th)
  const data = imageData.data

  // Create blurred copy for unsharp mask
  const blurCanvas = document.createElement("canvas")
  blurCanvas.width = tw
  blurCanvas.height = th
  const blurCtx = blurCanvas.getContext("2d")
  if (!blurCtx) return

  blurCtx.filter = "blur(1px)"
  blurCtx.drawImage(targetCanvas, 0, 0)
  const blurData = blurCtx.getImageData(0, 0, tw, th).data

  // Unsharp mask: original + strength * (original - blurred)
  const strength = 0.6
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + strength * (data[i] - blurData[i])))
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + strength * (data[i + 1] - blurData[i + 1])))
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + strength * (data[i + 2] - blurData[i + 2])))
  }

  // Step 3: Slight contrast boost
  const contrastFactor = 1.08
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, ((data[i] / 255 - 0.5) * contrastFactor + 0.5) * 255))
    data[i + 1] = Math.min(255, Math.max(0, ((data[i + 1] / 255 - 0.5) * contrastFactor + 0.5) * 255))
    data[i + 2] = Math.min(255, Math.max(0, ((data[i + 2] / 255 - 0.5) * contrastFactor + 0.5) * 255))
  }

  // Step 4: Adaptive noise reduction for smooth areas
  // Simple bilateral-like filter for manga line art
  const cleanData = new Uint8ClampedArray(data)
  const kernel = 1
  for (let y = kernel; y < th - kernel; y++) {
    for (let x = kernel; x < tw - kernel; x++) {
      const idx = (y * tw + x) * 4
      let rSum = 0, gSum = 0, bSum = 0, wSum = 0

      for (let ky = -kernel; ky <= kernel; ky++) {
        for (let kx = -kernel; kx <= kernel; kx++) {
          const nIdx = ((y + ky) * tw + (x + kx)) * 4
          const diff = Math.abs(data[idx] - data[nIdx]) +
                       Math.abs(data[idx + 1] - data[nIdx + 1]) +
                       Math.abs(data[idx + 2] - data[nIdx + 2])
          // Only blend similar pixels (preserve edges/lines)
          const w = diff < 30 ? 1 : 0.1
          rSum += data[nIdx] * w
          gSum += data[nIdx + 1] * w
          bSum += data[nIdx + 2] * w
          wSum += w
        }
      }

      cleanData[idx] = rSum / wSum
      cleanData[idx + 1] = gSum / wSum
      cleanData[idx + 2] = bSum / wSum
    }
  }

  targetCtx.putImageData(new ImageData(cleanData, tw, th), 0, 0)
}

export function EnhancedImage({
  src,
  alt,
  className = "",
  loading = "lazy",
  fetchPriority = "auto",
}: ImageEnhancerProps) {
  const [enhanced, setEnhanced] = useState(false)
  const [enhancing, setEnhancing] = useState(false)
  const [enhancedSrc, setEnhancedSrc] = useState<string | null>(null)
  const [showCompare, setShowCompare] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  const enhance = useCallback(async () => {
    if (!imgRef.current || enhancing) return
    setEnhancing(true)

    try {
      // Wait a tick for UI to update
      await new Promise((r) => setTimeout(r, 50))

      const img = imgRef.current
      const sourceCanvas = document.createElement("canvas")
      sourceCanvas.width = img.naturalWidth
      sourceCanvas.height = img.naturalHeight
      const sourceCtx = sourceCanvas.getContext("2d")
      if (!sourceCtx) return

      sourceCtx.drawImage(img, 0, 0)

      const targetCanvas = document.createElement("canvas")
      const scale = 2 // 2x upscale
      applyEnhancement(sourceCanvas, targetCanvas, scale)

      const dataUrl = targetCanvas.toDataURL("image/png")
      setEnhancedSrc(dataUrl)
      setEnhanced(true)
    } catch (err) {
      console.error("Enhancement failed:", err)
    } finally {
      setEnhancing(false)
    }
  }, [enhancing])

  const reset = useCallback(() => {
    setEnhanced(false)
    setEnhancedSrc(null)
    setShowCompare(false)
  }, [])

  return (
    <div className="group relative">
      <img
        ref={imgRef}
        src={enhanced && enhancedSrc ? enhancedSrc : src}
        alt={alt}
        className={className}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        style={{ imageRendering: enhanced ? "auto" : "auto" }}
      />

      {/* Enhancement controls overlay */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="absolute right-2 top-2 flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {!enhanced && !enhancing && (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); enhance() }}
              className="flex items-center gap-1.5 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg shadow-primary/30 backdrop-blur-sm transition-all hover:bg-primary"
              title="AI Enhance & Upscale"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Enhance</span>
            </motion.button>
          )}

          {enhancing && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-1.5 rounded-lg bg-primary/90 px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-lg backdrop-blur-sm"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Enhancing...</span>
            </motion.div>
          )}

          {enhanced && (
            <div className="flex items-center gap-1">
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowCompare(!showCompare) }}
                className="flex items-center gap-1 rounded-lg bg-secondary/90 px-2 py-1.5 text-xs font-bold text-foreground shadow-lg backdrop-blur-sm"
                title="Compare"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </motion.button>
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); reset() }}
                className="flex items-center gap-1 rounded-lg bg-secondary/90 px-2 py-1.5 text-xs font-bold text-foreground shadow-lg backdrop-blur-sm"
                title="Reset to original"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </motion.button>
              <div className="flex items-center gap-1 rounded-lg bg-chart-3/20 px-2 py-1.5 text-xs font-bold text-chart-3 backdrop-blur-sm">
                <Sparkles className="h-3 w-3" />
                2x Enhanced
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Before/After compare overlay */}
      <AnimatePresence>
        {showCompare && (
          <CompareOverlay originalSrc={src} enhancedSrc={enhancedSrc!} onClose={() => setShowCompare(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function CompareOverlay({
  originalSrc,
  enhancedSrc,
  onClose,
}: {
  originalSrc: string
  enhancedSrc: string
  onClose: () => void
}) {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((clientX - rect.left) / rect.width) * 100
      setSliderPos(Math.max(0, Math.min(100, x)))
    },
    []
  )

  useEffect(() => {
    if (!isDragging) return
    const onMove = (e: MouseEvent) => handleMove(e.clientX)
    const onUp = () => setIsDragging(false)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", onUp)
    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", onUp)
    }
  }, [isDragging, handleMove])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.button
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </motion.button>

      <div className="flex flex-col items-center gap-4 px-4">
        <div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
          <span>Original</span>
          <span className="text-primary">AI Enhanced 2x</span>
        </div>

        <div
          ref={containerRef}
          className="relative max-h-[80vh] max-w-[90vw] cursor-col-resize overflow-hidden rounded-xl border border-border"
          onMouseDown={(e) => { e.stopPropagation(); setIsDragging(true); handleMove(e.clientX) }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Enhanced image (full) */}
          <img
            src={enhancedSrc}
            alt="Enhanced"
            className="block max-h-[80vh] w-auto"
            draggable={false}
          />

          {/* Original image (clipped) */}
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: `${sliderPos}%` }}
          >
            <img
              src={originalSrc}
              alt="Original"
              className="block max-h-[80vh] w-auto"
              style={{ maxWidth: "none", width: containerRef.current?.scrollWidth }}
              draggable={false}
            />
          </div>

          {/* Slider line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg"
            style={{ left: `${sliderPos}%` }}
          >
            <div className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
