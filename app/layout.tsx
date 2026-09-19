import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Aula Control | I.E.D. La Victoria",
  description: "Sistema de gestión y seguimiento de excusas escolares.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
