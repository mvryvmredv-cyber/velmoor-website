import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const fileUrl = searchParams.get("url");

    if (!fileUrl) {
      return NextResponse.json(
        {
          success: false,
          message: "File URL is required.",
        },
        { status: 400 },
      );
    }

    const url = new URL(fileUrl);

    // السماح فقط بملفات Supabase Storage الخاصة بالمشروع
    if (!url.hostname.endsWith(".supabase.co")) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file source.",
        },
        { status: 403 },
      );
    }

    // السماح فقط بالـ buckets الخاصة بالعقارات
    const isAllowedBucket =
      url.pathname.includes("/storage/v1/object/public/property-images/") ||
      url.pathname.includes("/storage/v1/object/public/property-videos/");

    if (!isAllowedBucket) {
      return NextResponse.json(
        {
          success: false,
          message: "File source is not allowed.",
        },
        { status: 403 },
      );
    }

    const response = await fetch(fileUrl);

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch file.",
        },
        { status: 500 },
      );
    }

    const contentType =
      response.headers.get("content-type") || "application/octet-stream";

    const pathname = decodeURIComponent(url.pathname);

    const fileName = pathname.split("/").pop() || `property-file-${Date.now()}`;

    const fileBuffer = await response.arrayBuffer();

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(
          fileName,
        )}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("❌ Download error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Failed to download file.",
      },
      { status: 500 },
    );
  }
}
