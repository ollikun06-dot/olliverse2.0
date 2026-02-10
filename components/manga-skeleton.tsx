"use client"

import { motion } from "framer-motion"

export function MangaCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{
        delay: index * 0.03,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-sm"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <div
          className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-muted-foreground/5 to-transparent"
          style={{ backgroundSize: "200% 100%" }}
        />
      </div>
      <div className="p-3">
        <div className="h-4 w-3/4 rounded bg-secondary" />
        <div className="mt-1.5 h-3 w-1/2 rounded bg-secondary" />
      </div>
    </motion.div>
  )
}

export function MangaGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <MangaCardSkeleton key={i} index={i} />
      ))}
    </div>
  )
}
