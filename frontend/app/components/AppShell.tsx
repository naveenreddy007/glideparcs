"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = pathname !== "/" && pathname !== "/login";

  return (
    <div className={`flex flex-col min-h-screen ${showNav ? "pt-[72px]" : ""}`}>
      {showNav && <TopNav />}
      <div className="flex-1 flex flex-col relative">
        {children}
      </div>
      <Footer />
    </div>
  );
}
