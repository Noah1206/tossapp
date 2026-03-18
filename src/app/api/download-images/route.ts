import { NextRequest, NextResponse } from "next/server";
import archiver from "archiver";
import { Readable, PassThrough } from "stream";

export async function POST(req: NextRequest) {
  try {
    const { urls } = (await req.json()) as { urls: string[] };
    if (!urls || urls.length === 0) {
      return NextResponse.json({ error: "urls required" }, { status: 400 });
    }

    const passthrough = new PassThrough();
    const archive = archiver("zip", { zlib: { level: 5 } });
    archive.pipe(passthrough);

    const fetches = urls.map(async (url, i) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return;
        const buffer = Buffer.from(await res.arrayBuffer());
        const ext = (res.headers.get("content-type") ?? "").includes("png")
          ? "png"
          : "jpg";
        archive.append(buffer, { name: `blog_image_${i + 1}.${ext}` });
      } catch {
        // skip failed images
      }
    });

    await Promise.all(fetches);
    await archive.finalize();

    // PassThrough → ReadableStream for NextResponse
    const readable = Readable.toWeb(passthrough) as ReadableStream;

    return new NextResponse(readable, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": 'attachment; filename="blog_images.zip"',
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "zip failed" }, { status: 500 });
  }
}
