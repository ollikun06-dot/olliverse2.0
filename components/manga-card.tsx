"use client"

import React from "react"
import Link from "next/link"
import { motion, useInView } from "framer-motion"
import { useState, useRef } from "react"
import type { MangaResult } from "@/lib/manga-api"
import { proxyImage } from "@/lib/manga-api"

interface MangaCardProps {
  manga: MangaResult
  index?: number
}

export function MangaCard({ manga, index = 0 }: MangaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const inViewRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(inViewRef, { once: true, margin: "-50px" })
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
    const maxRotate = 15
    setRotateX((-mouseY / (rect.height / 2)) * maxRotate)
    setRotateY((mouseX / (rect.width / 2)) * maxRotate)
    setGlarePos({
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

  // Stagger delay based on grid position
  const row = Math.floor(index / 6)
  const col = index % 6
  const staggerDelay = row * 0.08 + col * 0.04

  return (
    <div ref={inViewRef}>
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 12, scale: 0.9 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, rotateX: 0, scale: 1 }
            : { opacity: 0, y: 40, rotateX: 12, scale: 0.9 }
        }
        transition={{
          delay: staggerDelay,
          duration: 0.6,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="gpu-accelerated perspective-1000"
      >
        <Link href={`/manga/${manga.id}`} className="block">
          <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="group relative"
          >
            <motion.div
              animate={{
                rotateX,
                rotateY,
                scale: isHovered ? 1.05 : 1,
                z: isHovered ? 30 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 250,
                damping: 20,
                mass: 0.6,
              }}
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

                {/* 3D Holographic glare */}
                <motion.div
                  animate={{ opacity: isHovered ? 0.15 : 0 }}
                  className="absolute inset-0"
                  style={{
                    background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, hsl(185 100% 80% / 0.4), transparent 60%)`,
                  }}
                />

                {/* Anime power line effect */}
                <motion.div
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scaleY: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-accent/10"
                />

                {/* XP accent bar */}
                <motion.div
                  animate={{ scaleX: isHovered ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-gradient-to-r from-primary via-[hsl(200,100%,65%)] to-accent"
                />
              </div>

              {/* Title - floating above card in 3D */}
              <div
                className="relative p-3"
                style={{ transform: "translateZ(25px)" }}
              >
                <h3 className="line-clamp-2 text-sm font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
                  {manga.title}
                </h3>
              </div>

              {/* Neon border glow */}
              <motion.div
                animate={{
                  opacity: isHovered ? 1 : 0,
                  boxShadow: isHovered
                    ? "0 0 30px hsl(185 100% 55% / 0.15), 0 0 60px hsl(185 100% 55% / 0.05), inset 0 0 30px hsl(185 100% 55% / 0.03)"
                    : "none",
                }}
                className="pointer-events-none absolute inset-0 rounded-2xl border border-primary/30"
              />

              {/* Corner accent */}
              <motion.div
                animate={{ opacity: isHovered ? 0.6 : 0 }}
                className="pointer-events-none absolute right-2 top-2 h-3 w-3 rounded-full bg-primary blur-sm"
              />
            </motion.div>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
