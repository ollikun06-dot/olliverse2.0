import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const url = searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://mangadex.org/",
        Accept: "image/webp,image/avif,image/png,image/jpeg,*/*",
      },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: "Image fetch failed" },
        { status: res.status }
      )
    }

    const contentType = res.headers.get("content-type") || "image/jpeg"
    const buffer = await res.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
        "Content-Length": String(buffer.byteLength),
      },
    })
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500 }
    )
  }
}
