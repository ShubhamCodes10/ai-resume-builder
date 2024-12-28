import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import { ResumeProvider } from "@/context/ResumeContext";

export const metadata: Metadata = {
  title: "BuildMyCv - AI Resume Builder",
  description: "AI Resume Builder that helps you create a professional resume in minutes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow overflow-y-auto">
            <ResumeProvider>
            {children}
            </ResumeProvider>
            <Toaster/>
            </main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
