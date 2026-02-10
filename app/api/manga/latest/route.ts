import { NextRequest, NextResponse } from "next/server"
import { getLatestUpdates } from "@/lib/manga-api"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const page = parseInt(searchParams.get("page") || "1", 10)
  const limit = 20
  const offset = (page - 1) * limit

  try {
    const data = await getLatestUpdates(limit, offset)
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    })
  } catch (error) {
    console.error("Latest error:", error)
    return NextResponse.json({ error: "Failed to get latest manga" }, { status: 500 })
  }
}
