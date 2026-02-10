"use client"

import { useState } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getLatestUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { motion } from "framer-motion"
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                Latest Updates
              </h1>
              <p className="text-sm text-muted-foreground">
                Recently updated manga chapters
              </p>
            </div>
          </div>

          {isLoading ? (
            <MangaGridSkeleton count={18} />
          ) : data?.results?.length ? (
            <MangaGrid manga={data.results} />
          ) : (
            <p className="py-20 text-center text-muted-foreground">
              No manga found.
            </p>
          )}

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </motion.button>
            <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Page {page}
            </span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.hasNextPage}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
