"use client"

import { useState } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { AnimeBackground } from "@/components/anime-background"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getPopularUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ChevronLeft, ChevronRight } from "lucide-react"

export default function PopularPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useSWR<MangaSearchResponse>(
    getPopularUrl(page),
    fetcher
  )

  return (
    <div className="min-h-screen">
      <AnimeBackground />
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8 flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
            >
              <Sparkles className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Popular Manga
              </h1>
              <p className="text-sm text-muted-foreground">
                The most popular titles on MangaDex
              </p>
            </div>
          </motion.div>

          {/* Grid with page transitions */}
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 15, rotateX: 3 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -15, rotateX: -3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="perspective-1000"
            >
              {isLoading ? (
                <MangaGridSkeleton count={18} />
              ) : data?.results?.length ? (
                <MangaGrid manga={data.results} />
              ) : (
                <p className="py-20 text-center text-muted-foreground">
                  No manga found.
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.04, x: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </motion.button>
            <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Page {page}
            </span>
            <motion.button
              whileHover={{ scale: 1.04, x: 2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.hasNextPage}
              className="flex items-center gap-1 rounded-lg border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}
