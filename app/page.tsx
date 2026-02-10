"use client"

import useSWR from "swr"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MangaGrid } from "@/components/manga-grid"
import { MangaGridSkeleton } from "@/components/manga-skeleton"
import { fetcher, getPopularUrl, getLatestUrl, getRecentUrl } from "@/lib/manga-api"
import type { MangaSearchResponse } from "@/lib/manga-api"
import { CategorySection } from "@/components/category-section"
import { AnimeBackground } from "@/components/anime-background"
import { ScrollSection } from "@/components/scroll-section"

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
      {/* Persistent anime particle background with parallax */}
      <AnimeBackground />

      {/* Content layer */}
      <div className="relative z-10">
        <Navbar />

        <HeroSection />

        {/* Category Browse Section */}
        <ScrollSection className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
          <CategorySection />
        </ScrollSection>

        {/* Popular Section */}
        <ScrollSection delay={0.1} className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
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
        </ScrollSection>

        {/* Latest Updates Section */}
        <ScrollSection delay={0.1} className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
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
        </ScrollSection>

        {/* Recently Added Section */}
        <ScrollSection delay={0.1} className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
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
        </ScrollSection>

        {/* Footer */}
        <footer className="relative border-t border-border bg-background/80 py-12 backdrop-blur-xl">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 text-center lg:px-8">
            <p className="text-lg font-bold text-foreground">
              Olli<span className="text-primary neon-text">Verse</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Powered by MangaDex. All manga content belongs to their respective creators.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}
