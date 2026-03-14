import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LOGOS.ai - 영상→블로그 AI 변환",
  description: "유튜브 쇼츠·인스타 릴스를 블로그 글로 자동 변환",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body
        className="safe-area-top safe-area-bottom"
        style={{
          display: 'flex',
          justifyContent: 'center',
          background: '#FFFFFF',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 480,
            minHeight: '100dvh',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
