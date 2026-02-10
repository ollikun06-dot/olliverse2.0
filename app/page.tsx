"use client"

import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getPopularUrl, getLatestUrl, getRecentUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { CategorySection } from "@/components/category-section"
import { RecentlyWatched } from "@/components/recently-watched"
import { AnimeBackground } from "@/components/anime-background"
import { motion } from "framer-motion"

const sectionVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function HomePage() {
  const { data: popular, isLoading: loadingPopular } = useSWR<MangaSearchResponse>(
    getPopularUrl(),
    fetcher
  )
  const { data: latest, isLoading: loadingLatest } = useSWR<MangaSearchResponse>(
    getLatestUrl(),
    fetcher
  )
  const { data: recent, isLoading: loadingRecent } = useSWR<MangaSearchResponse>(
    getRecentUrl(),
    fetcher
  )

  return (
    <div className="relative min-h-screen">
      <AnimeBackground />
      <Navbar />
      <HeroSection />

      {/* Recently Watched Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl px-4 py-12 lg:px-8"
      >
        <RecentlyWatched />
      </motion.div>

      {/* Category Browse Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl px-4 py-12 lg:px-8"
      >
        <CategorySection />
      </motion.div>

      {/* Popular Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl px-4 py-12 lg:px-8"
      >
        {loadingPopular ? (
          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Popular Manga
            </h2>
            <MangaGridSkeleton />
          </div>
        ) : popular?.results?.length ? (
          <MangaGrid
            manga={popular.results.slice(0, 12)}
            title="Popular Manga"
            subtitle="Trending titles everyone is reading"
          />
        ) : null}
      </motion.div>

      {/* Latest Updates Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl px-4 py-12 lg:px-8"
      >
        {loadingLatest ? (
          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Latest Updates
            </h2>
            <MangaGridSkeleton />
          </div>
        ) : latest?.results?.length ? (
          <MangaGrid
            manga={latest.results.slice(0, 12)}
            title="Latest Updates"
            subtitle="Recently updated chapters"
          />
        ) : null}
      </motion.div>

      {/* Recently Added Section */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto max-w-7xl px-4 py-12 lg:px-8"
      >
        {loadingRecent ? (
          <div>
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Recently Added
            </h2>
            <MangaGridSkeleton />
          </div>
        ) : recent?.results?.length ? (
          <MangaGrid
            manga={recent.results.slice(0, 12)}
            title="Recently Added"
            subtitle="Fresh new titles just for you"
          />
        ) : null}
      </motion.div>

      {/* Footer */}
      <footer className="relative border-t border-border bg-card/30 py-10 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            OlliVerse - Powered by MangaDex. All manga content belongs to their respective creators.
          </motion.p>
        </div>
      </footer>
    </div>
  )
}
