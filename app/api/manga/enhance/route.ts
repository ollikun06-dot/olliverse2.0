import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const url = searchParams.get("url")
  const scaleParam = parseInt(searchParams.get("scale") || "2", 10)
  const scale = Math.min(scaleParam, 3)

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 })
  }

  try {
    // Dynamically import sharp
    const sharpModule = await import("sharp")
    const sharp = sharpModule.default

    // Fetch the original image
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

    const buffer = Buffer.from(await res.arrayBuffer())

    // Get image metadata
    const metadata = await sharp(buffer).metadata()
    const originalWidth = metadata.width || 800
    const originalHeight = metadata.height || 1200

    // AI-like enhancement pipeline:
    // 1. Upscale using Lanczos (highest quality) resampling
    // 2. Apply sharpening to recover detail
    // 3. Adjust contrast and levels for manga/manhwa
    // 4. Apply subtle noise reduction
    const enhanced = await sharp(buffer)
      .resize(
        Math.min(originalWidth * scale, 4096),
        Math.min(originalHeight * scale, 6144),
        {
          kernel: sharp.kernel.lanczos3,
          fit: "inside",
          withoutEnlargement: false,
        }
      )
      .sharpen({
        sigma: 0.8,
      })
      .modulate({
        brightness: 1.02,
        saturation: 1.1,
      })
      .normalize()
      .webp({ quality: 88, effort: 4 })
      .toBuffer()

    return new NextResponse(enhanced, {
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control":
          "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
        "Content-Length": String(enhanced.byteLength),
        "X-Enhanced": "true",
        "X-Scale": String(scale),
      },
    })
  } catch (error) {
    console.error("Enhancement error:", error)
    // Fallback: proxy the original image without enhancement
    try {
      const fallbackRes = await fetch(url, {
        headers: {
          Referer: "https://mangadex.org/",
          Accept: "image/webp,image/avif,image/png,image/jpeg,*/*",
        },
      })
      if (fallbackRes.ok) {
        const contentType =
          fallbackRes.headers.get("content-type") || "image/jpeg"
        const fallbackBuffer = await fallbackRes.arrayBuffer()
        return new NextResponse(fallbackBuffer, {
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=604800, s-maxage=604800",
            "Content-Length": String(fallbackBuffer.byteLength),
            "X-Enhanced": "false",
          },
        })
      }
    } catch {
      // Final fallback
    }
    return NextResponse.json(
      { error: "Failed to enhance image" },
      { status: 500 }
    )
  }
}
