"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavAndFooter = pathname !== "/" && pathname !== "/login";

  return (
    <div className={`flex flex-col min-h-[100dvh] ${showNavAndFooter ? "pt-[72px]" : ""}`}>
      {showNavAndFooter && <TopNav />}
      <div className="flex-1 flex flex-col relative">
        {children}
      </div>
      {showNavAndFooter && <Footer />}
    </div>
  );
}
