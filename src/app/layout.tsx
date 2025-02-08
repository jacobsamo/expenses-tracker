import type { Metadata } from "next";
import "@/styles/globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "A simple expense tracker app built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-screen">
      <body className="w-full h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
