import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Fraunces, Inter } from "next/font/google";

import { MobileShell } from "@/components/templates/MobileShell";
import { getCurrentUser, isOperator } from "@/services/session.service";

// Sans body font → exposed as `--font-inter` (Tailwind `font-sans`).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Display font → exposed as `--font-fraunces` (Tailwind `font-display`).
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Farmacia Atenas",
  description: "Tu farmacia de confianza",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Farmacia Atenas",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A5C46",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The operator nav entry is only shown to the configured operator.
  const user = await getCurrentUser();
  const operator = isOperator(user);

  return (
    <html
      lang="es"
      className={`${inter.variable} ${fraunces.variable} antialiased`}
    >
      <body>
        <MobileShell isOperator={operator} userName={user?.name ?? null}>
          {children}
        </MobileShell>
      </body>
    </html>
  );
}
