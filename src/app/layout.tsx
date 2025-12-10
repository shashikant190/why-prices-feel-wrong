import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Why Does This Price Feel Wrong?",
  description: "Understand why prices feel expensive or unfair to you."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  );
}
