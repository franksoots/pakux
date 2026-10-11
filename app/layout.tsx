import type { Metadata } from "next";
import "./globals.css";
import "./pakux-ui.css";
import { LanguageProvider } from "../components/language-provider";

export const metadata: Metadata = {
  title: "Pakux — Leia, kes vajab seda, mida müüd",
  description:
    "Pakux kasutab AI-d, et leida ettevõtted, kes vajavad sinu toodet või teenust.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="et">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}