import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "e-Abhaya | Smart FIR & Citizen Complaint Management System",
  description: "Secure, responsive, and accessible civic safety portal for crime reporting, real-time AI triage, BNS/IPC legal matching, and interactive guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="font-sans min-h-full bg-slate-950 text-slate-100 flex flex-col">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
