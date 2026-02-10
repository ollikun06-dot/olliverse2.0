"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getSearchUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { motion } from "framer-motion"
import { Search, AlertCircle } from "lucide-react"

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
}

function SearchContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const { data, isLoading, error } = useSWR<MangaSearchResponse>(
    query ? getSearchUrl(query) : null,
    fetcher
  )

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20"
                style={{ boxShadow: "0 0 20px hsl(185 100% 55% / 0.1)" }}
              >
                <Search className="h-6 w-6 text-primary" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-foreground lg:text-3xl">
                  {query ? `Results for "${query}"` : "Search Manga"}
                </h1>
                {data?.results && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
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
              variants={fadeUp}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Search className="mb-4 h-16 w-16 text-muted-foreground/30" />
              </motion.div>
              <p className="text-lg text-muted-foreground">
                Enter a search term to find manga
              </p>
            </motion.div>
          )}

          {isLoading && (
            <motion.div variants={fadeUp}>
              <MangaGridSkeleton count={18} />
            </motion.div>
          )}

          {error && (
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertCircle className="mb-4 h-16 w-16 text-destructive/50" />
              </motion.div>
              <p className="text-lg text-muted-foreground">
                Something went wrong. Please try again.
              </p>
            </motion.div>
          )}

          {data?.results?.length === 0 && (
            <motion.div
              variants={fadeUp}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <Search className="mb-4 h-16 w-16 text-muted-foreground/30" />
              <p className="text-lg text-muted-foreground">
                No results found for &quot;{query}&quot;
              </p>
            </motion.div>
          )}

          {data?.results && data.results.length > 0 && (
            <motion.div variants={fadeUp}>
              <MangaGrid manga={data.results} />
            </motion.div>
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
        <div className="min-h-screen bg-background">
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
