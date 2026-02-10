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
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    setRotateX(-mouseY / 10)
    setRotateY(mouseX / 10)
    setGlowPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  function handleMouseLeave() {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const imageUrl = manga.image ? proxyImage(manga.image) : ""

  const cardVariant = {
    hidden: { opacity: 0, y: 24, scale: 0.92, filter: "blur(8px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <motion.div
      variants={cardVariant}
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
            }}
            transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.6 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card transition-colors group-hover:border-primary/30"
          >
            {/* Image container */}
            <div className="relative aspect-[3/4] overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={manga.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  style={{ imageRendering: "auto" }}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-secondary">
                  <span className="text-4xl font-extrabold text-muted-foreground/20">
                    {manga.title?.charAt(0) || "?"}
                  </span>
                </div>
              )}

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent opacity-60 transition-opacity group-hover:opacity-90" />

              {/* Dynamic glow that follows cursor */}
              <motion.div
                animate={{ opacity: isHovered ? 0.6 : 0 }}
                className="absolute inset-0 transition-opacity"
                style={{
                  background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, hsl(185 100% 55% / 0.15), transparent 60%)`,
                }}
              />

              {/* Anime-style shine sweep on hover */}
              <motion.div
                animate={{ x: isHovered ? "150%" : "-150%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-foreground/[0.08] to-transparent"
                style={{ width: "50%", transform: "skewX(-20deg)" }}
              />

              {/* XP-like accent bar */}
              <motion.div
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-primary"
                style={{ boxShadow: "0 0 8px hsl(185 100% 55% / 0.5)" }}
              />
            </div>

            {/* Title with 3D pop effect */}
            <div className="relative p-3" style={{ transform: "translateZ(30px)" }}>
              <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                {manga.title}
              </h3>
            </div>

            {/* Neon border glow on hover */}
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0,
                boxShadow: isHovered
                  ? "0 0 25px hsl(185 100% 55% / 0.15), inset 0 0 25px hsl(185 100% 55% / 0.05)"
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
