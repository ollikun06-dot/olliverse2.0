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

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    setRotateX(-mouseY / 12)
    setRotateY(mouseX / 12)
  }

  function handleMouseLeave() {
    setRotateX(0)
    setRotateY(0)
    setIsHovered(false)
  }

  const imageUrl = manga.image ? proxyImage(manga.image) : ""

  const cardVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.95, filter: "blur(6px)" },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
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
              scale: isHovered ? 1.03 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 25, mass: 0.8 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card transition-colors group-hover:border-primary/30"
          >
            {/* Image container */}
            <div className="relative aspect-[3/4] overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={manga.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />

              {/* Neon glow on hover */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-accent/10"
              />

              {/* XP-like accent bar */}
              <motion.div
                animate={{ scaleX: isHovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-primary"
              />
            </div>

            {/* Title */}
            <div className="relative p-3" style={{ transform: "translateZ(20px)" }}>
              <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground">
                {manga.title}
              </h3>
            </div>

            {/* Neon border glow */}
            <motion.div
              animate={{
                opacity: isHovered ? 1 : 0,
                boxShadow: isHovered
                  ? "0 0 25px hsl(185 100% 55% / 0.15), inset 0 0 25px hsl(185 100% 55% / 0.05)"
                  : "none",
              }}
              className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/30"
            />
          </motion.div>
        </div>
      </Link>
    </motion.div>
  )
}
