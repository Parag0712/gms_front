import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif } from "next/font/google";
import AuthProvider from "@/context/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-ibm-plex-serif",
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
        <body
          className={`${inter.variable} ${ibmPlexSerif.variable} antialiased`}
        >
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
