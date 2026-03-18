import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// GET: 히스토리 조회
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // 단일 조회: /api/history?id=xxx
    const id = searchParams.get("id");
    if (id) {
      const item = await prisma.conversion.findUnique({
        where: { id },
        select: {
          id: true,
          platform: true,
          sourceUrl: true,
          title: true,
          preview: true,
          status: true,
          resultJson: true,
          createdAt: true,
        },
      });
      if (!item) {
        return NextResponse.json({ error: "not found" }, { status: 404 });
      }
      return NextResponse.json({ data: item });
    }

    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const sort = searchParams.get("sort") || "newest"; // "newest" | "oldest" | "alpha"
    const limit = Math.min(parseInt(searchParams.get("limit") || "30"), 50);

    let orderBy: Record<string, string>;
    switch (sort) {
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
      case "alpha":
        orderBy = { title: "asc" };
        break;
      default:
        orderBy = { createdAt: "desc" };
    }

    const data = await prisma.conversion.findMany({
      where: { userId, status: "completed" },
      orderBy,
      take: limit,
      select: {
        id: true,
        platform: true,
        sourceUrl: true,
        title: true,
        preview: true,
        status: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ data });
  } catch (e) {
    console.error("[history GET]", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET by ID: 단일 히스토리 조회 (resultJson 포함)
// /api/history?id=xxx
// (위 GET 핸들러에서 id 파라미터 분기)

// POST: 변환 결과 저장
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, platform, sourceUrl, title, preview, resultJson } = body;

    if (!userId || !sourceUrl) {
      return NextResponse.json({ error: "userId and sourceUrl required" }, { status: 400 });
    }

    const conversion = await prisma.conversion.create({
      data: {
        userId,
        platform: platform || "youtube",
        sourceUrl,
        title: title || null,
        preview: preview || null,
        resultJson: resultJson || null,
      },
    });

    return NextResponse.json({ data: conversion });
  } catch (e) {
    console.error("[history POST]", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
