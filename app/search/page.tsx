"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { AnimeBackground } from "@/components/anime-background"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getSearchUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { motion } from "framer-motion"
import { Search, AlertCircle } from "lucide-react"

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const { data, isLoading, error } = useSWR<MangaSearchResponse>(
    query ? getSearchUrl(query) : null,
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
            className="mb-8"
          >
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
              >
                <Search className="h-5 w-5 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  {query ? `Results for "${query}"` : "Search Manga"}
                </h1>
                {data?.results && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-sm text-muted-foreground"
                  >
                    Found {data.results.length} results
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {!query && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Search className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <p className="text-lg text-muted-foreground">
                Enter a search term to find manga
              </p>
            </motion.div>
          )}

          {isLoading && <MangaGridSkeleton count={18} />}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <AlertCircle className="mb-4 h-16 w-16 text-destructive/50" />
              <p className="text-lg text-muted-foreground">
                Something went wrong. Please try again.
              </p>
            </motion.div>
          )}

          {data?.results?.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Search className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <p className="text-lg text-muted-foreground">
                No results found for &quot;{query}&quot;
              </p>
            </motion.div>
          )}

          {data?.results && data.results.length > 0 && (
            <MangaGrid manga={data.results} />
          )}
        </motion.div>
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen">
          <Navbar />
          <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 lg:px-8">
            <MangaGridSkeleton count={18} />
          </main>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
