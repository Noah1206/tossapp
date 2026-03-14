/**
 * API 유틸리티
 * 기존 LOGOS.ai 백엔드와 통신
 */

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://logos.builders";

interface ConvertRequest {
  url: string;
  tone?: string;
  style?: string;
}

interface ConvertResponse {
  success: boolean;
  data?: {
    title: string;
    content: string;
    hashtags: string[];
  };
  error?: string;
}

interface CreditsResponse {
  credits: number;
}

// 영상 → 블로그 변환 API
export async function convertVideo(request: ConvertRequest): Promise<ConvertResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/convert`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      credentials: "include",
    });

    if (!res.ok) {
      const error = await res.json();
      return { success: false, error: error.message || "변환 실패" };
    }

    const data = await res.json();
    return { success: true, data };
  } catch {
    return { success: false, error: "네트워크 오류가 발생했어요" };
  }
}

// 크레딧 조회
export async function getCredits(): Promise<CreditsResponse> {
  try {
    const res = await fetch(`${API_BASE}/api/credits`, {
      credentials: "include",
    });
    if (!res.ok) return { credits: 0 };
    return await res.json();
  } catch {
    return { credits: 0 };
  }
}

// 변환 이력 조회
export async function getHistory() {
  try {
    const res = await fetch(`${API_BASE}/api/history`, {
      credentials: "include",
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}
