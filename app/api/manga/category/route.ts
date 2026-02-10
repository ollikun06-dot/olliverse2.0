import { NextRequest, NextResponse } from "next/server"
import { getMangaByCategory } from "@/lib/manga-api"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const category = searchParams.get("category") as "manga" | "manhwa" | "nsfw"
  const page = parseInt(searchParams.get("page") || "1", 10)

  if (!category || !["manga", "manhwa", "nsfw"].includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 })
  }

  try {
    const limit = 20
    const offset = (page - 1) * limit
    const data = await getMangaByCategory(category, limit, offset)
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
