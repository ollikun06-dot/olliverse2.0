"use client"

import { use, useState } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getCategoryUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { motion } from "framer-motion"
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/"
              className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.bg}`}>
                <Icon className={`h-5 w-5 ${meta.color}`} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  {meta.label}
                </h1>
                <p className="text-sm text-muted-foreground">{meta.description}</p>
              </div>
            </div>

            {/* Category switcher */}
            <div className="mt-6 flex flex-wrap gap-2">
              {Object.entries(categoryMeta).map(([key, val]) => {
                const isActive = key === category
                const CatIcon = val.icon
                return (
                  <Link
                    key={key}
                    href={`/category/${key}`}
                    className="relative flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-colors"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="cat-page-tab"
                        className={`absolute inset-0 rounded-xl ${val.bg} ring-1 ring-border`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                )
              })}
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <MangaGridSkeleton count={20} />
          ) : data?.results?.length ? (
            <MangaGrid manga={data.results} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card py-20">
              <Icon className="mb-3 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">No titles found.</p>
            </div>
          )}

          {/* Pagination */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </motion.button>
            <span className="rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Page {page}
            </span>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPage((p) => p + 1)}
              disabled={!data?.hasNextPage}
              className="flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-40"
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
