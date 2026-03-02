import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/items/AuthProvider";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Portfolio Tracker",
  description: "Track and manage your investment portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "rgba(30, 30, 50, 0.95)",
              color: "#ededed",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "12px",
              backdropFilter: "blur(12px)",
            },
            success: {
              iconTheme: { primary: "#34d399", secondary: "#0a0a1a" },
            },
            error: {
              iconTheme: { primary: "#f87171", secondary: "#0a0a1a" },
            },
          }}
        />
      </body>
    </html>
  );
}
