"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useRef } from "react"
import type { MangaResult } from "@/lib/manga-api"
import { proxyImage } from "@/lib/manga-api"

interface MangaCardProps {
  manga: MangaResult
  index?: number
}

export function MangaCard({ manga, index = 0 }: MangaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    setRotateX(-mouseY / 10)
    setRotateY(mouseX / 10)
    // Glare position
    const percentX = ((e.clientX - rect.left) / rect.width) * 100
    const percentY = ((e.clientY - rect.top) / rect.height) * 100
    setGlarePos({ x: percentX, y: percentY })
  }

  function handleMouseLeave() {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const imageUrl = manga.image ? proxyImage(manga.image) : ""

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: index * 0.04,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="gpu-accelerated"
    >
      <Link href={`/manga/${manga.id}`} className="block">
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          className="perspective-1000 group relative"
        >
          <motion.div
            animate={{
              rotateX,
              rotateY,
              scale: isHovered ? 1.04 : 1,
              z: isHovered ? 30 : 0,
            }}
            transition={{ type: "spring", stiffness: 250, damping: 22, mass: 0.8 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card transition-colors group-hover:border-primary/30"
          >
            {/* Image container */}
            <div className="relative aspect-[3/4] overflow-hidden">
              {imageUrl ? (
                <motion.img
                  src={imageUrl || "/placeholder.svg"}
                  alt={manga.title}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  style={{ imageRendering: "auto" }}
                  animate={{
                    scale: isHovered ? 1.08 : 1,
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <span className="text-4xl font-extrabold text-muted-foreground/20">
                    {manga.title?.charAt(0) || "?"}
                  </span>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

              {/* Neon glow on hover */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/10"
              />

              {/* Holographic glare effect */}
              <motion.div
                animate={{ opacity: isHovered ? 0.15 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, hsl(185 100% 85% / 0.3), transparent 60%)`,
                }}
              />

              {/* Manga-style accent bar */}
              <motion.div
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-primary via-primary to-accent"
              />

              {/* Corner accent - manga panel style */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                transition={{ duration: 0.3 }}
                className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/90 shadow-lg shadow-primary/40"
                style={{ transform: "translateZ(30px)" }}
              >
                <span className="text-[8px] font-extrabold text-primary-foreground">HD</span>
              </motion.div>
            </div>

            {/* Title with 3D depth */}
            <div className="relative p-3" style={{ transform: "translateZ(20px)" }}>
              <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                {manga.title}
              </h3>
            </div>

            {/* Border glow effect */}
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0,
                boxShadow: isHovered
                  ? "0 0 30px hsl(185 100% 55% / 0.18), inset 0 0 30px hsl(185 100% 55% / 0.05)"
                  : "none",
              }}
              transition={{ duration: 0.3 }}
              className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/30"
            />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}
