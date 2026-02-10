import { NextRequest, NextResponse } from "next/server"
import { searchManga } from "@/lib/manga-api"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get("q")
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = 20
  const offset = (page - 1) * limit

  if (!query) {
    return NextResponse.json({ results: [], total: 0, hasNextPage: false })
  }

  try {
    const data = await searchManga(query, limit, offset)
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=120",
      },
    })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "Failed to search manga" }, { status: 500 })
  }
}
