import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { cn } from "@/utils";

import "@/styles/index.css";

export const metadata: Metadata = {
  title: "Acorn",
  description: "Acorn: Track your spending and take control of your finances.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable, "dark")}
      style={{ colorScheme: "dark" }}
    >
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/manifest/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/manifest/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/manifest/favicon-16x16.png" />
        <link rel="manifest" href="/manifest/site.webmanifest" />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="black" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="white" />
        <meta name="background-color" media="(prefers-color-scheme: light)" content="white" />
        <meta name="background-color" media="(prefers-color-scheme: dark)" content="black" />
      </head>
      <body className="dark">
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
