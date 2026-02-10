// ---- Types ----

export interface MangaResult {
  id: string
  title: string
  image: string
  description?: string
  genres?: string[]
  status?: string
}

export interface MangaSearchResponse {
  results: MangaResult[]
  total: number
  hasNextPage: boolean
}

export interface MangaChapter {
  id: string
  title: string
  chapter: string | null
  volume: string | null
  releaseDate: string | null
}

export interface MangaInfo {
  id: string
  title: string
  altTitles?: string[]
  genres?: string[]
  image: string
  description?: string
  status?: string
  year?: number
  chapters: MangaChapter[]
}

export interface ChapterPage {
  page: number
  img: string
}

// ---- Helpers ----

const MANGADEX = "https://api.mangadex.org"

function getCoverUrl(mangaId: string, fileName: string, size?: "256" | "512"): string {
  if (size) {
    return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}.${size}.jpg`
  }
  // Original full-resolution cover
  return `https://uploads.mangadex.org/covers/${mangaId}/${fileName}`
}

function getTitle(attributes: Record<string, unknown>): string {
  const titleMap = attributes.title as Record<string, string> | undefined
  if (!titleMap) return "Unknown"
  // Prefer English title, then romanised Japanese, then first available
  return titleMap.en || titleMap["ja-ro"] || titleMap["ko-ro"] || Object.values(titleMap)[0] || "Unknown"
}

function getDescription(attributes: Record<string, unknown>): string {
  const descMap = attributes.description as Record<string, string> | undefined
  if (!descMap) return ""
  return descMap.en || Object.values(descMap)[0] || ""
}

function extractCoverFileName(relationships: Array<{ type: string; attributes?: Record<string, unknown> }>): string {
  const cover = relationships.find((r) => r.type === "cover_art")
  if (!cover?.attributes?.fileName) return ""
  return cover.attributes.fileName as string
}

interface MangaDexMangaData {
  id: string
  attributes: Record<string, unknown>
  relationships: Array<{ type: string; id: string; attributes?: Record<string, unknown> }>
}

function transformMangaData(manga: MangaDexMangaData): MangaResult {
  const coverFile = extractCoverFileName(manga.relationships)
  const tags = manga.attributes.tags as Array<{ attributes: { name: Record<string, string> } }> | undefined
  return {
    id: manga.id,
    title: getTitle(manga.attributes),
    image: coverFile ? getCoverUrl(manga.id, coverFile) : "",
    description: getDescription(manga.attributes),
    genres: tags?.map((t) => t.attributes.name.en).filter(Boolean) || [],
    status: (manga.attributes.status as string) || undefined,
  }
}

// ---- API functions (called from API routes on server) ----

export async function searchManga(query: string, limit = 20, offset = 0): Promise<MangaSearchResponse> {
  const params = new URLSearchParams()
  params.append("title", query)
  params.append("limit", String(limit))
  params.append("offset", String(offset))
  params.append("includes[]", "cover_art")
  params.append("contentRating[]", "safe")
  params.append("contentRating[]", "suggestive")
  params.append("availableTranslatedLanguage[]", "en")
  params.append("order[relevance]", "desc")
  const res = await fetch(`${MANGADEX}/manga?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`)
  const json = await res.json()
  return {
    results: json.data.map(transformMangaData),
    total: json.total,
    hasNextPage: offset + limit < json.total,
  }
}

export async function getPopularManga(limit = 20, offset = 0): Promise<MangaSearchResponse> {
  const params = new URLSearchParams()
  params.append("limit", String(limit))
  params.append("offset", String(offset))
  params.append("includes[]", "cover_art")
  params.append("contentRating[]", "safe")
  params.append("contentRating[]", "suggestive")
  params.append("availableTranslatedLanguage[]", "en")
  params.append("order[followedCount]", "desc")
  const res = await fetch(`${MANGADEX}/manga?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`)
  const json = await res.json()
  return {
    results: json.data.map(transformMangaData),
    total: json.total,
    hasNextPage: offset + limit < json.total,
  }
}

export async function getLatestUpdates(limit = 20, offset = 0): Promise<MangaSearchResponse> {
  const params = new URLSearchParams()
  params.append("limit", String(limit))
  params.append("offset", String(offset))
  params.append("includes[]", "cover_art")
  params.append("contentRating[]", "safe")
  params.append("contentRating[]", "suggestive")
  params.append("availableTranslatedLanguage[]", "en")
  params.append("order[latestUploadedChapter]", "desc")
  const res = await fetch(`${MANGADEX}/manga?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`)
  const json = await res.json()
  return {
    results: json.data.map(transformMangaData),
    total: json.total,
    hasNextPage: offset + limit < json.total,
  }
}

export async function getRecentManga(limit = 20, offset = 0): Promise<MangaSearchResponse> {
  const params = new URLSearchParams()
  params.append("limit", String(limit))
  params.append("offset", String(offset))
  params.append("includes[]", "cover_art")
  params.append("contentRating[]", "safe")
  params.append("contentRating[]", "suggestive")
  params.append("availableTranslatedLanguage[]", "en")
  params.append("order[createdAt]", "desc")
  const res = await fetch(`${MANGADEX}/manga?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`)
  const json = await res.json()
  return {
    results: json.data.map(transformMangaData),
    total: json.total,
    hasNextPage: offset + limit < json.total,
  }
}

export async function getMangaInfo(id: string): Promise<MangaInfo> {
  const res = await fetch(`${MANGADEX}/manga/${id}?includes[]=cover_art&includes[]=author&includes[]=artist`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`)
  const json = await res.json()
  const manga = json.data
  const coverFile = extractCoverFileName(manga.relationships)
  const tags = manga.attributes.tags as Array<{ attributes: { name: Record<string, string> } }> | undefined
  const altTitlesList = manga.attributes.altTitles as Array<Record<string, string>> | undefined

  // Fetch all English chapters with pagination
  const allChapData: Array<{ id: string; attributes: { title: string | null; chapter: string | null; volume: string | null; publishAt: string | null } }> = []
  let chapOffset = 0
  const chapLimit = 96
  let hasMore = true

  while (hasMore) {
    const chapParams = new URLSearchParams()
    chapParams.append("manga", id)
    chapParams.append("limit", String(chapLimit))
    chapParams.append("offset", String(chapOffset))
    chapParams.append("translatedLanguage[]", "en")
    chapParams.append("order[chapter]", "asc")
    chapParams.append("contentRating[]", "safe")
    chapParams.append("contentRating[]", "suggestive")
    chapParams.append("includes[]", "scanlation_group")
    const chapRes = await fetch(`${MANGADEX}/chapter?${chapParams}`, { next: { revalidate: 60 } })
    const chapJson = chapRes.ok ? await chapRes.json() : { data: [], total: 0 }
    allChapData.push(...chapJson.data)
    chapOffset += chapLimit
    hasMore = chapOffset < (chapJson.total || 0)
  }

  const chapters: MangaChapter[] = allChapData.map(
    (ch) => ({
      id: ch.id,
      title: ch.attributes.title || `Chapter ${ch.attributes.chapter || "?"}`,
      chapter: ch.attributes.chapter,
      volume: ch.attributes.volume,
      releaseDate: ch.attributes.publishAt,
    })
  )

  return {
    id: manga.id,
    title: getTitle(manga.attributes),
    altTitles: altTitlesList?.map((t) => Object.values(t)[0]).filter(Boolean) || [],
    genres: tags?.map((t) => t.attributes.name.en).filter(Boolean) || [],
    image: coverFile ? getCoverUrl(manga.id, coverFile) : "",
    description: getDescription(manga.attributes),
    status: manga.attributes.status || undefined,
    year: manga.attributes.year || undefined,
    chapters,
  }
}

// ---- Category-specific fetchers ----

export async function getMangaByCategory(
  category: "manga" | "manhwa" | "nsfw",
  limit = 20,
  offset = 0
): Promise<MangaSearchResponse> {
  const params = new URLSearchParams()
  params.append("limit", String(limit))
  params.append("offset", String(offset))
  params.append("includes[]", "cover_art")
  params.append("order[followedCount]", "desc")

  params.append("availableTranslatedLanguage[]", "en")

  if (category === "manga") {
    params.append("originalLanguage[]", "ja")
    params.append("contentRating[]", "safe")
    params.append("contentRating[]", "suggestive")
  } else if (category === "manhwa") {
    params.append("originalLanguage[]", "ko")
    params.append("contentRating[]", "safe")
    params.append("contentRating[]", "suggestive")
  } else if (category === "nsfw") {
    params.append("contentRating[]", "erotica")
    params.append("contentRating[]", "pornographic")
  }

  const res = await fetch(`${MANGADEX}/manga?${params}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`)
  const json = await res.json()
  return {
    results: json.data.map(transformMangaData),
    total: json.total,
    hasNextPage: offset + limit < json.total,
  }
}

export async function getChapterPages(chapterId: string): Promise<ChapterPage[]> {
  const res = await fetch(`${MANGADEX}/at-home/server/${chapterId}`, { next: { revalidate: 300 } })
  if (!res.ok) throw new Error(`MangaDex API error: ${res.status}`)
  const json = await res.json()
  const baseUrl = json.baseUrl
  const hash = json.chapter.hash
  const pages: string[] = json.chapter.data

  return pages.map((filename: string, i: number) => ({
    page: i + 1,
    img: `${baseUrl}/data/${hash}/${filename}`,
  }))
}

// ---- Image proxy (routes external images through our server) ----

export function proxyImage(url: string): string {
  if (!url) return ""
  return `/api/manga/image?url=${encodeURIComponent(url)}`
}

// ---- SWR helpers (client-side, point to our API routes) ----

export const fetcher = (url: string) =>
  fetch(url).then((r) => {
    if (!r.ok) throw new Error(`Fetch error: ${r.status}`)
    return r.json()
  })

export const getSearchUrl = (query: string, page = 1) =>
  `/api/manga/search?q=${encodeURIComponent(query)}&page=${page}`

export const getPopularUrl = (page = 1) => `/api/manga/popular?page=${page}`

export const getLatestUrl = (page = 1) => `/api/manga/latest?page=${page}`

export const getRecentUrl = (page = 1) => `/api/manga/recent?page=${page}`

export const getMangaInfoUrl = (id: string) => `/api/manga/info?id=${encodeURIComponent(id)}`

export const getChapterPagesUrl = (chapterId: string) => `/api/manga/read?id=${encodeURIComponent(chapterId)}`

export const getCategoryUrl = (category: "manga" | "manhwa" | "nsfw", page = 1) =>
  `/api/manga/category?category=${category}&page=${page}`
