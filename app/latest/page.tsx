"use client"

import { useState } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getLatestUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, ChevronLeft, ChevronRight } from "lucide-react"

export default function LatestPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useSWR<MangaSearchResponse>(
    getLatestUrl(page),
    fetcher
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-8 flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.15, type: "spring", stiffness: 300 }}
              className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20"
              style={{ boxShadow: "0 0 20px hsl(185 100% 55% / 0.1)" }}
            >
              <Clock className="h-6 w-6 text-primary" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Latest Updates
              </h1>
              <p className="text-sm text-muted-foreground">
                Recently updated manga chapters
              </p>
            </motion.div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
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

          {/* Animated pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.06, x: -3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-secondary hover:border-primary/20 disabled:opacity-40 disabled:cursor-not-allowed anime-hover"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </motion.button>
            <motion.span
              key={page}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-xl bg-primary/10 px-5 py-2.5 text-sm font-bold text-primary ring-1 ring-primary/20"
              style={{ boxShadow: "0 0 15px hsl(185 100% 55% / 0.1)" }}
            >
              Page {page}
            </motion.span>
            <motion.button
              whileHover={{ scale: 1.06, x: 3 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.hasNextPage}
              className="flex items-center gap-1 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-bold text-foreground transition-all hover:bg-secondary hover:border-primary/20 disabled:opacity-40 disabled:cursor-not-allowed anime-hover"
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
