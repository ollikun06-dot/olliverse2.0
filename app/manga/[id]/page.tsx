"use client"

import { use } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { AnimeBackground } from "@/components/anime-background"
import { fetcher, getMangaInfoUrl, proxyImage } from "@/lib/manga-api"
import type { MangaInfo } from "@/lib/manga-api"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, ArrowLeft, Calendar, Tag, ChevronRight, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { useMouseParallax } from "@/hooks/use-parallax"

export default function MangaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const { data: manga, isLoading, error } = useSWR<MangaInfo>(
    getMangaInfoUrl(id),
    fetcher
  )
  const [showAllChapters, setShowAllChapters] = useState(false)
  const mouse = useMouseParallax(0.01)
  const coverRef = useRef<HTMLDivElement>(null)
  const [coverRotateX, setCoverRotateX] = useState(0)
  const [coverRotateY, setCoverRotateY] = useState(0)
  const [coverHovered, setCoverHovered] = useState(false)

  function handleCoverMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!coverRef.current) return
    const rect = coverRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    setCoverRotateX(-(e.clientY - centerY) / 15)
    setCoverRotateY((e.clientX - centerX) / 15)
  }

  const imageUrl = manga?.image ? proxyImage(manga.image) : ""
  const visibleChapters = showAllChapters
    ? manga?.chapters
    : manga?.chapters?.slice(0, 20)

  return (
    <div className="min-h-screen">
      <AnimeBackground />
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 lg:px-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </motion.div>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center py-32"
          >
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading manga details...</p>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <p className="text-lg text-muted-foreground">
              Failed to load manga details. Please try again.
            </p>
          </motion.div>
        )}

        {manga && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            {/* Hero section with cover - 3D parallax */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative mb-10 overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-sm"
            >
              {/* Background blur with parallax */}
              {imageUrl && (
                <motion.div
                  animate={{ x: mouse.x * 0.5, y: mouse.y * 0.5 }}
                  transition={{ type: "spring", stiffness: 40, damping: 30 }}
                  className="absolute inset-0 overflow-hidden"
                >
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt=""
                    className="h-full w-full scale-125 object-cover opacity-[0.08] blur-3xl"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-card via-card/85 to-card" />
                </motion.div>
              )}

              <div className="relative flex flex-col gap-8 p-6 md:flex-row md:p-10">
                {/* Cover image with 3D tilt */}
                <motion.div
                  ref={coverRef}
                  onMouseMove={handleCoverMouseMove}
                  onMouseEnter={() => setCoverHovered(true)}
                  onMouseLeave={() => {
                    setCoverHovered(false)
                    setCoverRotateX(0)
                    setCoverRotateY(0)
                  }}
                  initial={{ opacity: 0, y: 20, rotateY: -10 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0 perspective-1000"
                >
                  <motion.div
                    animate={{
                      rotateX: coverRotateX,
                      rotateY: coverRotateY,
                      scale: coverHovered ? 1.03 : 1,
                    }}
                    transition={{ type: "spring", stiffness: 200, damping: 25 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative mx-auto w-48 overflow-hidden rounded-xl border border-border shadow-2xl shadow-primary/10 md:w-56"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={manga.title}
                        className="aspect-[3/4] w-full object-cover"
                        loading="eager"
                        fetchPriority="high"
                        decoding="sync"
                        referrerPolicy="no-referrer"
                        style={{ imageRendering: "auto" }}
                      />
                    ) : (
                      <div className="flex aspect-[3/4] w-full items-center justify-center bg-secondary">
                        <BookOpen className="h-12 w-12 text-muted-foreground/30" />
                      </div>
                    )}
                    {/* Shine effect */}
                    <motion.div
                      animate={{ opacity: coverHovered ? 0.2 : 0 }}
                      className="absolute inset-0 bg-gradient-to-tr from-transparent via-foreground/10 to-transparent"
                    />
                    {/* Border glow */}
                    <motion.div
                      animate={{
                        opacity: coverHovered ? 1 : 0,
                        boxShadow: coverHovered
                          ? "0 0 30px hsl(185 100% 55% / 0.2), inset 0 0 20px hsl(185 100% 55% / 0.05)"
                          : "none",
                      }}
                      className="pointer-events-none absolute inset-0 rounded-xl border border-primary/30"
                    />
                  </motion.div>
                </motion.div>

                {/* Info with stagger animations */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1"
                >
                  <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                    {manga.title}
                  </h1>

                  {manga.altTitles && manga.altTitles.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 text-sm text-muted-foreground"
                    >
                      {manga.altTitles.slice(0, 3).join(" / ")}
                    </motion.p>
                  )}

                  {/* Genres with stagger */}
                  {manga.genres && manga.genres.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {manga.genres.map((genre, i) => (
                        <motion.span
                          key={genre}
                          initial={{ opacity: 0, scale: 0.9, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ delay: 0.3 + i * 0.03, duration: 0.3 }}
                          whileHover={{ scale: 1.06, y: -1 }}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          <Tag className="h-3 w-3" />
                          {genre}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Meta info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
                  >
                    {manga.chapters && manga.chapters.length > 0 && (
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {manga.chapters.length} chapters
                      </span>
                    )}
                    {manga.chapters && manga.chapters.length === 0 && (
                      <span className="flex items-center gap-1.5 text-muted-foreground/60">
                        <BookOpen className="h-4 w-4" />
                        No chapters yet
                      </span>
                    )}
                    {manga.status && (
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium capitalize text-primary">
                        {manga.status}
                      </span>
                    )}
                    {manga.year && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4" />
                        {manga.year}
                      </span>
                    )}
                  </motion.div>

                  {manga.description && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.45 }}
                      className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground"
                    >
                      {manga.description}
                    </motion.p>
                  )}

                  {/* Read first chapter button */}
                  {manga.chapters && manga.chapters.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55, duration: 0.4 }}
                      className="mt-6"
                    >
                      <motion.div
                        whileHover={{ scale: 1.04, y: -2 }}
                        whileTap={{ scale: 0.96 }}
                      >
                        <Link
                          href={`/read/${manga.chapters[0].id}?mangaId=${manga.id}&mangaTitle=${encodeURIComponent(manga.title)}&mangaImage=${encodeURIComponent(manga.image || "")}`}
                          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
                        >
                          <BookOpen className="h-5 w-5" />
                          Start Reading
                        </Link>
                      </motion.div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>

            {/* No chapters message */}
            {manga.chapters && manga.chapters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="rounded-xl border border-border bg-card/80 p-8 text-center backdrop-blur-sm"
              >
                <BookOpen className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  No chapters available yet. Check back later or visit{" "}
                  <a
                    href={`https://mangadex.org/title/${manga.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2 hover:brightness-110"
                  >
                    MangaDex
                  </a>{" "}
                  for more info.
                </p>
              </motion.div>
            )}

            {/* Chapters list */}
            {manga.chapters && manga.chapters.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  Chapters
                </h2>
                <div className="overflow-hidden rounded-xl border border-border backdrop-blur-sm">
                  <AnimatePresence>
                    {visibleChapters?.map((chapter, index) => (
                      <motion.div
                        key={chapter.id}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.35 }}
                      >
                        <Link
                          href={`/read/${chapter.id}?mangaId=${manga.id}&mangaTitle=${encodeURIComponent(manga.title)}&mangaImage=${encodeURIComponent(manga.image || "")}`}
                          className="group flex items-center justify-between border-b border-border bg-card/70 px-4 py-3 transition-all last:border-b-0 hover:bg-primary/5"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                              {chapter.title || `Chapter ${index + 1}`}
                            </p>
                            {chapter.releaseDate && (
                              <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {new Date(chapter.releaseDate).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            )}
                          </div>
                          <motion.div
                            whileHover={{ x: 3 }}
                            className="text-muted-foreground transition-colors group-hover:text-primary"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {manga.chapters.length > 20 && !showAllChapters && (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setShowAllChapters(true)}
                    className="mt-4 w-full rounded-xl border border-border bg-card/70 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary backdrop-blur-sm"
                  >
                    Show all {manga.chapters.length} chapters
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
