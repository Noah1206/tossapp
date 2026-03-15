import { NextRequest, NextResponse } from "next/server";

/* 유료화 시 복원 - 크레딧 시스템 API
import { prisma } from "@/lib/prisma";
*/

// GET: 현재 무제한 무료 - 항상 무제한 크레딧 반환
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  return NextResponse.json({
    data: {
      userId,
      credits: 9999,
      plan: "free",
      trial: true,
    },
  });
}

// POST: 현재 무제한 무료 - 크레딧 차감 없이 항상 성공
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId } = body as { userId: string; amount: number; reason: string };

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  return NextResponse.json({
    data: {
      userId,
      credits: 9999,
      plan: "free",
      trial: true,
    },
  });
}

/* 유료화 시 복원 - 기존 크레딧 조회/차감 로직

// GET: 유저 크레딧 조회 (없으면 자동 생성)
export async function GET_ORIGINAL(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const credit = await prisma.userCredit.upsert({
    where: { userId },
    create: { userId, credits: 1, plan: "free" },
    update: {},
  });

  const trial = credit.plan === "free";

  return NextResponse.json({ data: { ...credit, trial } });
}

// POST: 크레딧 차감 또는 충전
export async function POST_ORIGINAL(req: NextRequest) {
  const body = await req.json();
  const { userId, amount, reason } = body as {
    userId: string;
    amount: number;
    reason: string;
  };

  if (!userId || amount === undefined || !reason) {
    return NextResponse.json({ error: "userId, amount, reason required" }, { status: 400 });
  }

  if (amount < 0) {
    const current = await prisma.userCredit.findUnique({ where: { userId } });
    if (current && current.plan === "free") {
      await prisma.creditLog.create({
        data: { userId, amount: 0, reason: "convert_trial" },
      });
      return NextResponse.json({ data: { ...current, trial: true } });
    }
    if (!current || current.credits + amount < 0) {
      return NextResponse.json({ error: "insufficient_credits", message: "크레딧이 부족합니다" }, { status: 402 });
    }
  }

  const planMatch = reason.match(/^plan_(free|starter|pro)$/);
  const newPlan = planMatch ? planMatch[1] : undefined;

  const [credit] = await prisma.$transaction([
    prisma.userCredit.upsert({
      where: { userId },
      create: { userId, credits: Math.max(0, amount), plan: newPlan || "free" },
      update: {
        credits: { increment: amount },
        ...(newPlan ? { plan: newPlan } : {}),
      },
    }),
    prisma.creditLog.create({
      data: { userId, amount, reason },
    }),
  ]);

  return NextResponse.json({ data: credit });
}
*/
