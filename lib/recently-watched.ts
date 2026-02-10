export interface RecentlyWatchedItem {
  mangaId: string
  mangaTitle: string
  mangaImage: string
  chapterId: string
  chapterTitle: string
  page: number
  totalPages: number
  timestamp: number
}

const STORAGE_KEY = "olliverse-recently-watched"
const MAX_ITEMS = 20

export function getRecentlyWatched(): RecentlyWatchedItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as RecentlyWatchedItem[]
  } catch {
    return []
  }
}

export function addToRecentlyWatched(item: RecentlyWatchedItem) {
  if (typeof window === "undefined") return
  try {
    const items = getRecentlyWatched()
    // Remove existing entry for same manga
    const filtered = items.filter((i) => i.mangaId !== item.mangaId)
    // Add to front
    filtered.unshift({ ...item, timestamp: Date.now() })
    // Keep only MAX_ITEMS
    const trimmed = filtered.slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch {
    // Silently fail
  }
}

export function updateReadingProgress(
  mangaId: string,
  chapterId: string,
  chapterTitle: string,
  page: number,
  totalPages: number
) {
  if (typeof window === "undefined") return
  try {
    const items = getRecentlyWatched()
    const idx = items.findIndex((i) => i.mangaId === mangaId)
    if (idx >= 0) {
      items[idx].chapterId = chapterId
      items[idx].chapterTitle = chapterTitle
      items[idx].page = page
      items[idx].totalPages = totalPages
      items[idx].timestamp = Date.now()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    }
  } catch {
    // Silently fail
  }
}

export function removeFromRecentlyWatched(mangaId: string) {
  if (typeof window === "undefined") return
  try {
    const items = getRecentlyWatched()
    const filtered = items.filter((i) => i.mangaId !== mangaId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
  } catch {
    // Silently fail
  }
}
