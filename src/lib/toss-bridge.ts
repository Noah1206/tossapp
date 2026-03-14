/**
 * Toss Mini App Bridge
 * 토스 앱과의 네이티브 통신을 위한 브릿지 유틸리티
 */

declare global {
  interface Window {
    TossApp?: {
      postMessage: (message: string) => void;
    };
    webkit?: {
      messageHandlers?: {
        TossApp?: {
          postMessage: (message: string) => void;
        };
      };
    };
  }
}

// 토스앱 WebView 환경인지 확인
export function isTossApp(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("tossapp") || ua.includes("apps-in-toss");
}

// 토스 브릿지로 메시지 전송
export function sendTossBridge(action: string, data?: Record<string, unknown>) {
  const message = JSON.stringify({ action, data });

  if (typeof window === "undefined") return;

  // Android
  if (window.TossApp?.postMessage) {
    window.TossApp.postMessage(message);
    return;
  }

  // iOS
  if (window.webkit?.messageHandlers?.TossApp?.postMessage) {
    window.webkit.messageHandlers.TossApp.postMessage(message);
    return;
  }

  console.log("[TossBridge] Not in Toss WebView:", action, data);
}

// 뒤로가기
export function goBack() {
  if (isTossApp()) {
    sendTossBridge("back");
  } else {
    window.history.back();
  }
}

// 공유하기
export function share(title: string, text: string, url?: string) {
  if (isTossApp()) {
    sendTossBridge("share", { title, text, url });
  } else if (navigator.share) {
    navigator.share({ title, text, url });
  }
}

// 클립보드 복사
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback for older browsers
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand("copy");
      return true;
    } catch {
      return false;
    } finally {
      document.body.removeChild(textarea);
    }
  }
}

// 토스 결제 호출 (토스페이먼츠)
export function requestTossPayment(options: {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
}) {
  if (isTossApp()) {
    sendTossBridge("payment", options);
  } else {
    // 웹 환경에서는 토스페이먼츠 SDK 사용
    console.log("[TossPayment] Web payment:", options);
  }
}
