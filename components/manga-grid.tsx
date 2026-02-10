"use client"

import { motion } from "framer-motion"
import type { MangaResult } from "@/lib/manga-api"
import { MangaCard } from "./manga-card"

interface MangaGridProps {
  manga: MangaResult[]
  title?: string
  subtitle?: string
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
}

export function MangaGrid({ manga, title, subtitle }: MangaGridProps) {
  return (
    <section>
      {(title || subtitle) && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
        </motion.div>
      )}
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
      >
        {manga.map((item, index) => (
          <MangaCard key={item.id} manga={item} index={index} />
        ))}
      </motion.div>
    </section>
  )
}
