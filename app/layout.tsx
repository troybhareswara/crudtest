import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crud Test",
  description: "A simple CRUD application built with Next.js 13, TypeScript, and MySQL.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
        {/* Critical inline CSS — ensures render before globals.css hydrates */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --bg: #FFFFFF;
            --surface: #F8F8F8;
            --border: #E0E0E0;
            --border-strong: #000000;
            --text-primary: #000000;
            --text-secondary: #6B6B6B;
            --text-muted: #ABABAB;
            --accent: #000000;
            --accent-inverse: #FFFFFF;
            --hover-bg: #F0F0F0;
          }
          @media (prefers-color-scheme: dark) {
            :root {
              --bg: #0A0A0A;
              --surface: #141414;
              --border: #2A2A2A;
              --border-strong: #FFFFFF;
              --text-primary: #FFFFFF;
              --text-secondary: #8A8A8A;
              --text-muted: #4A4A4A;
              --accent: #FFFFFF;
              --accent-inverse: #000000;
              --hover-bg: #1E1E1E;
            }
          }
          *, *::before, *::after { box-sizing: border-box; }
          html { scroll-behavior: smooth; }
          body {
            background-color: var(--bg);
            color: var(--text-primary);
            font-family: 'Space Grotesk', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            overflow-x: hidden;
            margin: 0;
            min-height: 100vh;
          }
        `}} />
      </head>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
