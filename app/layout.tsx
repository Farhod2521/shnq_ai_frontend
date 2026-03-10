import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "SHNQ AI",
  description: "SHNQ AI chat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@200..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100"
      >
        <Providers>{children}</Providers>
        <div className="test-mode-banner" aria-hidden="true">
          <div className="test-mode-track">
            <span>Tizim test rejimida</span>
            <span>Tizim test rejimida</span>
            <span>Tizim test rejimida</span>
            <span>Tizim test rejimida</span>
          </div>
        </div>
      </body>
    </html>
  );
}
