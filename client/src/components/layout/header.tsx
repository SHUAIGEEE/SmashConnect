import { auth } from "@/../auth";
import RefreshButton from "@/components/buttons/refresh-button";
import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { userNavItems } from "@/constants/data";
import { cn } from "@/lib/utils";
import { Earth } from "lucide-react";
import Link from "next/link";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";

export default async function Header() {
  const session = await auth();

  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link href={"/dashboard"} className="flex">
            <Earth className="mr-2 h-6 w-6" />
            SmashConnect
          </Link>
        </div>
        <div className={cn("block lg:!hidden")}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          {session && <UserNav items={userNavItems} session={session} />}
          {session && <RefreshButton session={session} />}
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
