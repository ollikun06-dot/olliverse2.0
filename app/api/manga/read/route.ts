import { NextRequest, NextResponse } from "next/server"
import { getChapterPages } from "@/lib/manga-api"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing chapter ID" }, { status: 400 })
  }

  try {
    const data = await getChapterPages(id)
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    })
  } catch (error) {
    console.error("Read error:", error)
    return NextResponse.json({ error: "Failed to get chapter pages" }, { status: 500 })
  }
}
