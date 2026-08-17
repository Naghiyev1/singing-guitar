import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Singing Guitar — Free Electric Guitar Course",
  description: "A free 30-week performance course in blues, jazz and neo-soul electric guitar.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "./favicon.svg",
    shortcut: "./favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
