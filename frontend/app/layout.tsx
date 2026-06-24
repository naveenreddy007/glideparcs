import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat, Playfair_Display } from "next/font/google";
import "./globals.css";
import SplashWrapper from "./components/SplashWrapper";
import { ThemeProvider } from "./components/ThemeProvider";
import { AppShell } from "./components/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Glideparcs Staff Portal | Premium Parking",
  description: "Internal staff portal for Glideparcs — Premium Parking operations, support, onboarding, assets, and approvals.",
  icons: {
    icon: "/next.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-[#F5F5F4] dark:bg-[#0B1724] text-slate-700 dark:text-slate-300 flex flex-col transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SplashWrapper>
            <AppShell>{children}</AppShell>
          </SplashWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
