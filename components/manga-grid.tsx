"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import type { MangaResult } from "@/lib/manga-api"
import { MangaCard } from "./manga-card"

interface MangaGridProps {
  manga: MangaResult[]
  title?: string
  subtitle?: string
}

export function MangaGrid({ manga, title, subtitle }: MangaGridProps) {
  const headerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(headerRef, { once: true, margin: "-80px" })

  return (
    <section>
      {(title || subtitle) && (
        <div ref={headerRef} className="mb-6 perspective-1000">
          <motion.div
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={
              isInView
                ? { opacity: 1, y: 0, rotateX: 0 }
                : { opacity: 0, y: 30, rotateX: 10 }
            }
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {title && (
              <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            )}
            {/* Animated accent line under title */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-3 h-0.5 w-20 origin-left rounded-full bg-gradient-to-r from-primary to-primary/0"
            />
          </motion.div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {manga.map((item, index) => (
          <MangaCard key={item.id} manga={item} index={index} />
        ))}
      </div>
    </section>
  )
}
