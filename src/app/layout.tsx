import type { Metadata } from "next";
import localFont from "next/font/local";
import ToasterProvider from "@/components/providers/toaster-provider";
import QueryProvider from "@/components/providers/query-provider";
import AuthProvider from "@/components/providers/auth-provider";
import "./globals.css";

const copernicus = localFont({
  src: "./fonts/CopernicusTrial-Book-BF66160450c2e92.ttf",
  variable: "--font-copernicus",
  weight: "400",
});

export const metadata: Metadata = {
  title: "9 sign",
  description: "9 sign is a platform for creating and managing users",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <QueryProvider>
          <body className={`${copernicus.variable} antialiased`}>
            {children}
            <ToasterProvider />
          </body>
        </QueryProvider>
      </AuthProvider>
    </html>
  );
}
