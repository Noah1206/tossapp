import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5분 타임아웃

// 백그라운드 변환 처리 (서버 사이드, 클라이언트 연결 무관)
async function processConversion(id: string, body: { url: string; tone?: string }) {
  try {
    const res = await fetch(`${FASTAPI_URL}/api/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "unknown error");
      throw new Error(`FastAPI error: ${errText}`);
    }

    const data = await res.json();
    const structure = data.blog_structure;

    await prisma.conversion.update({
      where: { id },
      data: {
        status: "completed",
        title: structure?.title || null,
        preview: structure?.introduction?.slice(0, 100) || null,
        resultJson: data,
      },
    });
  } catch (e) {
    console.error(`[background] conversion ${id} failed:`, e);
    await prisma.conversion.update({
      where: { id },
      data: { status: "failed" },
    }).catch(() => {});
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, tone, userId } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "url required" }, { status: 400 });
    }

    const platform = url.includes("instagram") ? "instagram" : "youtube";

    // DB에 processing 레코드 즉시 생성
    const conversion = await prisma.conversion.create({
      data: {
        userId: userId || "anonymous",
        platform,
        sourceUrl: url,
        status: "processing",
      },
    });

    // 서버 사이드 백그라운드 처리 (fire-and-forget)
    // Node.js에서는 클라이언트가 연결을 끊어도 Promise가 계속 실행됨
    processConversion(conversion.id, { url, tone: tone || undefined }).catch(console.error);

    return NextResponse.json({ id: conversion.id });
  } catch (e) {
    console.error("[background POST]", e);
    return NextResponse.json({ error: "Failed to start conversion" }, { status: 500 });
  }
}
