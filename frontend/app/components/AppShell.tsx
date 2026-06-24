"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "./TopNav";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNav = pathname !== "/" && pathname !== "/login";

  return (
    <div className={showNav ? "min-h-screen pt-[72px]" : "min-h-screen"}>
      {showNav && <TopNav />}
      {children}
    </div>
  );
}
