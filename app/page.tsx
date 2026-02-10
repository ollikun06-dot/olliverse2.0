"use client"

import dynamic from "next/dynamic"
import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getPopularUrl, getLatestUrl, getRecentUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { CategorySection } from "@/components/category-section"
import { ScrollReveal, SectionDivider } from "@/components/page-transition"
import { motion } from "framer-motion"

const Anime3DBackground = dynamic(
  () => import("@/components/anime-3d-background").then((m) => m.Anime3DBackground),
  { ssr: false }
)

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
    <div className="relative min-h-screen bg-background">
      <Navbar />

      {/* Full-page 3D anime background - fixed behind everything */}
      <div className="fixed inset-0 -z-10">
        <Anime3DBackground />
        {/* Gradient fade so content below hero is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" style={{ top: "60vh" }} />
      </div>

      {/* Hero */}
      <HeroSection />

      {/* Content sections with scroll reveals */}
      <div className="relative z-10 bg-gradient-to-b from-background/80 via-background to-background backdrop-blur-sm">
        {/* Category Browse Section */}
        <ScrollReveal direction="up" delay={0}>
          <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <CategorySection />
          </div>
        </ScrollReveal>

        <SectionDivider />

        {/* Popular Section */}
        <ScrollReveal direction="left" delay={0}>
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
            {loadingPopular ? (
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    className="h-8 w-8 rounded-lg bg-primary/10"
                  />
                  <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                    Popular Manga
                  </h2>
                </div>
                <MangaGridSkeleton />
              </div>
            ) : popular?.results?.length ? (
              <MangaGrid
                manga={popular.results.slice(0, 12)}
                title="Popular Manga"
                subtitle="Trending titles everyone is reading"
              />
            ) : null}
          </div>
        </ScrollReveal>

        <SectionDivider />

        {/* Latest Updates Section */}
        <ScrollReveal direction="right" delay={0}>
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
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
          </div>
        </ScrollReveal>

        <SectionDivider />

        {/* Recently Added Section */}
        <ScrollReveal direction="up" delay={0}>
          <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
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
          </div>
        </ScrollReveal>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative border-t border-primary/10 py-12"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.02] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <p className="text-sm text-muted-foreground">
                OlliVerse - Powered by MangaDex. All manga content belongs to their respective creators.
              </p>
            </motion.div>
          </div>
        </motion.footer>
      </div>
    </div>
  )
}
