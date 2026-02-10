"use client"

import { use } from "react"
import useSWR from "swr"
import Link from "next/link"
import { fetcher, getChapterPagesUrl, proxyImage } from "@/lib/manga-api"
import type { ChapterPage } from "@/lib/manga-api"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, ChevronUp, Loader2, AlertCircle, BookOpen } from "lucide-react"
import { useState, useEffect, useCallback } from "react"

export default function ReaderPage({
  params,
}: {
  params: Promise<{ chapterId: string }>
}) {
  const { chapterId } = use(params)
  const { data: pages, isLoading, error } = useSWR<ChapterPage[]>(
    getChapterPagesUrl(chapterId),
    fetcher
  )
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const handleScroll = useCallback(() => {
    setShowScrollTop(window.scrollY > 500)

    // Track current page based on scroll position
    if (pages?.length) {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      const pageNum = Math.min(
        Math.ceil(scrollPercent * pages.length) || 1,
        pages.length
      )
      setCurrentPage(pageNum)
    }
  }, [pages])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <motion.header
        initial={{ y: -60 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <BookOpen className="h-4 w-4 text-primary" />
            <span className="font-semibold text-foreground">Manga<span className="text-primary">Verse</span></span>
          </Link>

          {pages?.length ? (
            <span className="rounded-lg bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              {currentPage} / {pages.length}
            </span>
          ) : null}
        </div>

        {/* Progress bar */}
        {pages?.length ? (
          <div className="h-0.5 bg-secondary">
            <motion.div
              className="h-full bg-primary"
              style={{ width: `${(currentPage / pages.length) * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        ) : null}
      </motion.header>

      <main className="mx-auto max-w-5xl px-0 pb-16 pt-16 sm:px-4">
        {isLoading && (
          <div className="flex items-center justify-center py-32">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Loading chapter...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <AlertCircle className="mb-4 h-16 w-16 text-destructive/50" />
            <p className="text-lg text-muted-foreground">
              Failed to load chapter. Please try again.
            </p>
            <Link
              href="/"
              className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
            >
              Go Home
            </Link>
          </div>
        )}

        {pages && pages.length > 0 && (
          <div className="flex flex-col">
            {pages.map((page, index) => (
              <motion.div
                key={page.page}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "300px" }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                <img
                  src={proxyImage(page.img) || "/placeholder.svg"}
                  alt={`Page ${page.page}`}
                  className="w-full h-auto"
                  loading={index < 3 ? "eager" : "lazy"}
                  decoding={index < 3 ? "sync" : "async"}
                  fetchPriority={index < 3 ? "high" : "auto"}
                  referrerPolicy="no-referrer"
                  style={{ imageRendering: "auto" }}
                />
              </motion.div>
            ))}

            {/* End of chapter */}
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="text-lg font-semibold text-foreground">
                End of Chapter
              </p>
              <Link
                href="/"
                className="rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-primary/40"
              >
                Browse More Manga
              </Link>
            </div>
          </div>
        )}

        {pages && pages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/30" />
            <p className="text-lg text-muted-foreground">
              No pages found for this chapter.
            </p>
          </div>
        )}
      </main>

      {/* Scroll to top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/25"
            aria-label="Scroll to top"
          >
            <ChevronUp className="h-5 w-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
