"use client"

import type { MangaResult } from "@/lib/manga-api"
import { MangaCard } from "./manga-card"

interface MangaGridProps {
  manga: MangaResult[]
  title?: string
  subtitle?: string
}

export function MangaGrid({ manga, title, subtitle }: MangaGridProps) {
  return (
    <section>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h2 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          )}
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
