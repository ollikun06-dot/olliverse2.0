"use client"

import { use } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { fetcher, getMangaInfoUrl, proxyImage } from "@/lib/manga-api"
import type { MangaInfo } from "@/lib/manga-api"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, ArrowLeft, Calendar, Tag, ChevronRight, Loader2 } from "lucide-react"
import { useState } from "react"

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

  const imageUrl = manga?.image ? proxyImage(manga.image) : ""
  const visibleChapters = showAllChapters
    ? manga?.chapters
    : manga?.chapters?.slice(0, 20)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 lg:px-8">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
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
          <div className="flex items-center justify-center py-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="text-lg text-muted-foreground">
              Failed to load manga details. Please try again.
            </p>
          </div>
        )}

        {manga && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero section with cover */}
            <div className="relative mb-10 overflow-hidden rounded-2xl border border-border bg-card">
              {/* Background blur */}
              {imageUrl && (
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt=""
                    className="h-full w-full scale-110 object-cover opacity-10 blur-3xl"
                    loading="eager"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card" />
                </div>
              )}

              <div className="relative flex flex-col gap-8 p-6 md:flex-row md:p-10">
                {/* Cover image */}
                <motion.div
                  initial={{ opacity: 0, y: 16, rotateY: -8 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-shrink-0 perspective-1000"
                >
                  <div className="relative mx-auto w-48 overflow-hidden rounded-xl border border-border shadow-2xl shadow-primary/10 md:w-56">
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
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-foreground/5 to-transparent" />
                  </div>
                </motion.div>

                {/* Info */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex-1"
                >
                  <h1 className="text-balance text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl">
                    {manga.title}
                  </h1>

                  {manga.altTitles && manga.altTitles.length > 0 && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      {manga.altTitles.slice(0, 3).join(" / ")}
                    </p>
                  )}

                  {/* Genres */}
                  {manga.genres && manga.genres.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {manga.genres.map((genre) => (
                        <span
                          key={genre}
                          className="inline-flex items-center gap-1 rounded-lg border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground"
                        >
                          <Tag className="h-3 w-3" />
                          {genre}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta info */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    {manga.chapters && (
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-4 w-4" />
                        {manga.chapters.length} chapters
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
                  </div>

                  {/* Description */}
                  {manga.description && (
                    <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
                      {manga.description}
                    </p>
                  )}

                  {/* Read first chapter button */}
                  {manga.chapters && manga.chapters.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                      className="mt-6"
                    >
                      <Link
                        href={`/read/${manga.chapters[0].id}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40 hover:brightness-110"
                      >
                        <BookOpen className="h-5 w-5" />
                        Start Reading
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* No chapters message */}
            {manga.chapters && manga.chapters.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="rounded-xl border border-border bg-card p-8 text-center"
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h2 className="mb-4 text-xl font-bold text-foreground">
                  Chapters
                </h2>
                <div className="overflow-hidden rounded-xl border border-border">
                  <AnimatePresence>
                    {visibleChapters?.map((chapter, index) => (
                      <motion.div
                        key={chapter.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02, duration: 0.3 }}
                      >
                        <Link
                          href={`/read/${chapter.id}`}
                          className="group flex items-center justify-between border-b border-border bg-card px-4 py-3 transition-colors last:border-b-0 hover:bg-secondary"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
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
                          <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                        </Link>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {manga.chapters.length > 20 && !showAllChapters && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAllChapters(true)}
                    className="mt-4 w-full rounded-xl border border-border bg-card py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
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
