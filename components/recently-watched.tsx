"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Clock, Play, X, BookOpen } from "lucide-react"
import { getRecentlyWatched, removeFromRecentlyWatched } from "@/lib/recently-watched"
import type { RecentlyWatchedItem } from "@/lib/recently-watched"
import { proxyImage } from "@/lib/manga-api"

export function RecentlyWatched() {
  const [items, setItems] = useState<RecentlyWatchedItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setItems(getRecentlyWatched())
  }, [])

  function handleRemove(mangaId: string) {
    removeFromRecentlyWatched(mangaId)
    setItems((prev) => prev.filter((i) => i.mangaId !== mangaId))
  }

  if (!mounted || items.length === 0) return null

  return (
    <section>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 flex items-center gap-3"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
          <Clock className="h-4 w-4 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
            Continue Reading
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Pick up where you left off
          </p>
        </div>
      </motion.div>

      <div className="relative">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {items.map((item, index) => (
              <motion.div
                key={item.mangaId}
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: -20 }}
                transition={{
                  delay: index * 0.05,
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                }}
                layout
                className="flex-shrink-0"
              >
                <div className="group relative w-[260px] overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/30 hover:neon-box">
                  <Link href={`/read/${item.chapterId}`} className="flex gap-3 p-3">
                    {/* Cover thumbnail */}
                    <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                      {item.mangaImage ? (
                        <img
                          src={proxyImage(item.mangaImage)}
                          alt={item.mangaTitle}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-secondary">
                          <BookOpen className="h-5 w-5 text-muted-foreground/30" />
                        </div>
                      )}
                      {/* Play overlay */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="absolute inset-0 flex items-center justify-center bg-background/60"
                      >
                        <Play className="h-5 w-5 text-primary" />
                      </motion.div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between overflow-hidden py-0.5">
                      <div>
                        <h3 className="line-clamp-1 text-sm font-bold text-foreground transition-colors group-hover:text-primary">
                          {item.mangaTitle}
                        </h3>
                        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                          {item.chapterTitle}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span>
                            Page {item.page}/{item.totalPages}
                          </span>
                          <span>
                            {Math.round((item.page / item.totalPages) * 100)}%
                          </span>
                        </div>
                        <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: `${(item.page / item.totalPages) * 100}%`,
                            }}
                            transition={{ delay: 0.3 + index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemove(item.mangaId)
                    }}
                    className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-background/80 text-muted-foreground opacity-0 transition-all hover:bg-destructive/20 hover:text-destructive group-hover:opacity-100"
                    aria-label={`Remove ${item.mangaTitle} from recently watched`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Scroll fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-background to-transparent" />
      </div>
    </section>
  )
}
