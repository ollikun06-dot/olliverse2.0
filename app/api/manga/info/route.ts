import { NextRequest, NextResponse } from "next/server"
import { getMangaInfo } from "@/lib/manga-api"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const id = searchParams.get("id")

  if (!id) {
    return NextResponse.json({ error: "Missing manga ID" }, { status: 400 })
  }

  try {
    const data = await getMangaInfo(id)
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Info error:", error)
    return NextResponse.json({ error: "Failed to get manga info" }, { status: 500 })
  }
}
