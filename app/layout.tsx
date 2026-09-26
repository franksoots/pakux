import type { Metadata } from "next";
import "./globals.css";
import "./pakux-ui.css";

export const metadata: Metadata = {
  title: "Pakux — Find who needs what you sell",
  description:
    "Pakux uses AI to discover companies that need what you sell.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}