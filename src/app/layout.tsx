import type { Metadata } from "next";
import localFont from "next/font/local";
import QueryProvider from "@/components/providers/query-provider";
import AuthProvider from "@/components/providers/auth-provider";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import React from "react";
// Load custom font
const copernicus = localFont({
  src: "./Fonts/CopernicusTrial-Book-BF66160450c2e92.ttf", // Updated path to ensure it resolves correctly
  variable: "--font-copernicus",
  weight: "400",
});

// Define metadata for the application
export const metadata: Metadata = {
  title: "9 Sign Infra",
  description: "9 sign-infra admin panel",
  icons: {
    icon: "/logo_white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${copernicus.variable} antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <React.Suspense fallback={<div>Loading...</div>}>
              {children}
              <Toaster />
            </React.Suspense>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
