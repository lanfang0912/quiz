import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "悠藍電子報管理系統",
  description: "Landing Page 後台管理系統",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
