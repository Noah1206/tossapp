/**
 * Toss Mini App Bridge
 * 토스 앱 WebView와의 네이티브 통신 브릿지
 *
 * 토스 미니앱(앱인토스)은 토스 앱 내 WebView에서 동작합니다.
 * appLogin은 네이티브 SDK(@apps-in-toss/framework) 전용이므로,
 * WebView에서는 브릿지 메시지를 통해 로그인을 요청합니다.
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

// ── 사용자 타입 ──

export interface TossUser {
  id: string;
  name: string;
  profileImage?: string;
}

// ── 환경 감지 ──

export function isTossApp(): boolean {
  if (typeof window === "undefined") return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("tossapp") || ua.includes("apps-in-toss");
}

// ── 브릿지 통신 ──

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

// ── 네비게이션 ──

export function goBack() {
  if (isTossApp()) {
    sendTossBridge("back");
  } else {
    window.history.back();
  }
}

// ── 공유 ──

export function share(title: string, text: string, url?: string) {
  if (isTossApp()) {
    sendTossBridge("share", { title, text, url });
  } else if (navigator.share) {
    navigator.share({ title, text, url });
  }
}

// ── 클립보드 ──

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
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

// ── 결제 ──

export function requestTossPayment(options: {
  amount: number;
  orderId: string;
  orderName: string;
  customerName?: string;
}) {
  if (isTossApp()) {
    sendTossBridge("payment", options);
  } else {
    console.log("[TossPayment] Web payment:", options);
  }
}

// ── 로그인 ──

/**
 * 토스 로그인 요청
 *
 * 토스 앱 환경: 네이티브 브릿지로 로그인 동의 화면 호출 → 결과 수신
 * 웹 환경: 데모용 게스트 로그인 즉시 반환
 */
export function requestTossLogin(): Promise<TossUser | null> {
  return new Promise((resolve) => {
    if (isTossApp()) {
      // 네이티브에서 로그인 결과를 message 이벤트로 수신
      const handler = (event: MessageEvent) => {
        try {
          const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
          if (data.action === "loginResult") {
            window.removeEventListener("message", handler);
            if (data.success && data.user) {
              resolve({
                id: data.user.id || data.user.userKey,
                name: data.user.name,
                profileImage: data.user.profileImage,
              });
            } else {
              resolve(null);
            }
          }
        } catch {
          // ignore
        }
      };
      window.addEventListener("message", handler);

      // 토스 네이티브에 로그인 요청
      sendTossBridge("appLogin", { scope: ["profile", "name"] });

      // 60초 타임아웃 (사용자가 동의 화면에서 오래 머물 수 있음)
      setTimeout(() => {
        window.removeEventListener("message", handler);
        resolve(null);
      }, 60000);
    } else {
      // 웹 환경: 즉시 게스트 로그인
      resolve({
        id: "guest_" + Date.now(),
        name: "게스트",
      });
    }
  });
}
