import type { Theme } from "@/types";
import type { Metadata } from "next";

import { cookies } from "next/headers";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import { SessionRefresher } from "@/features/auth";
import { ThemeProvider } from "@/providers";
import { cn } from "@/utils";

import "@/styles/index.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Acorn",
    default: "Acorn",
  },
  description: "Acorn: Track your spending and take control of your finances.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = cookies().get("user_theme")?.value as Theme;
  const resolvedTheme = theme ?? "dark";

  return (
    <html
      lang="en"
      className={cn(GeistSans.variable, GeistMono.variable, resolvedTheme)}
      style={{ colorScheme: resolvedTheme }}
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
      <body>
        <ThemeProvider defaultTheme={resolvedTheme}>{children}</ThemeProvider>
        <SessionRefresher />
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
