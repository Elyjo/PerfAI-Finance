import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PerfAI Finance",
  description: "Une plateforme d'intelligence décisionnelle financière.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      data-scroll-behavior="smooth"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
