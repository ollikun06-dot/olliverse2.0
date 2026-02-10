"use client"

import { use, useState } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { AnimeBackground } from "@/components/anime-background"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getCategoryUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { motion, AnimatePresence } from "framer-motion"
import { BookOpen, Globe, Flame, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const categoryMeta: Record<
  string,
  { label: string; description: string; icon: typeof BookOpen; color: string; bg: string }
> = {
  manga: {
    label: "Manga",
    description: "Browse popular Japanese manga titles",
    icon: BookOpen,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  manhwa: {
    label: "Manhwa",
    description: "Browse popular Korean manhwa titles",
    icon: Globe,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  nsfw: {
    label: "NSFW / Hentai",
    description: "Browse adult content (18+)",
    icon: Flame,
    color: "text-destructive",
    bg: "bg-destructive/10",
  },
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const [page, setPage] = useState(1)

  const category = (["manga", "manhwa", "nsfw"].includes(slug) ? slug : "manga") as
    | "manga"
    | "manhwa"
    | "nsfw"

  const meta = categoryMeta[category] || categoryMeta.manga
  const Icon = meta.icon

  const { data, isLoading } = useSWR<MangaSearchResponse>(
    getCategoryUrl(category, page),
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
          {/* Header */}
          <div className="mb-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link
                href="/"
                className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex items-center gap-3"
            >
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.bg}`}
              >
                <Icon className={`h-5 w-5 ${meta.color}`} />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  {meta.label}
                </h1>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
              </div>
            </motion.div>

            {/* Category switcher with 3D transitions */}
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(categoryMeta).map(([key, val]) => {
                const isActive = key === category
                const CatIcon = val.icon
                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.04, y: -2 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    <Link
                      href={`/category/${key}`}
                      className="relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors"
                    >
                      {isActive && (
                        <motion.div
                          layoutId="cat-page-tab"
                          className={`absolute inset-0 rounded-xl ${val.bg} ring-1 ring-border`}
                          transition={{ type: "spring", stiffness: 350, damping: 30 }}
                        />
                      )}
                      <span
                        className={`relative z-10 flex items-center gap-2 ${
                          isActive ? val.color : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <CatIcon className="h-4 w-4" />
                        {val.label}
                      </span>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </div>

          {/* Grid with page transition */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${page}`}
              initial={{ opacity: 0, y: 15, rotateX: 3 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -15, rotateX: -3 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="perspective-1000"
            >
              {isLoading ? (
                <MangaGridSkeleton count={20} />
              ) : data?.results?.length ? (
                <MangaGrid manga={data.results} />
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card/70 py-20 backdrop-blur-sm">
                  <Icon className="mb-3 h-10 w-10 text-muted-foreground/30" />
                  <p className="text-muted-foreground">No titles found.</p>
                </div>
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
              className="flex items-center gap-1 rounded-lg border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
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
              className="flex items-center gap-1 rounded-lg border border-border bg-card/70 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
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
