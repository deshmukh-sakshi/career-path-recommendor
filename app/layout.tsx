import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kiro — AI-Powered Career Navigator",
  description: "Your AI career navigator — trained on the market, built for you.",
  keywords: ["career", "AI", "career path", "job recommendations", "skills", "resume parser"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
