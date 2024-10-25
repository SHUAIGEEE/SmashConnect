"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";
import { ToastAction } from "../ui/toast";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { NavItem } from "@/types";
import { useSession } from "next-auth/react";

interface UserNavProps {
  items: NavItem[];
  session: Session;
}

export function UserNav({ items, session }: UserNavProps) {
  const { data } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (session && !session.isProfileComplete) {
      console.log("Profile is incomplete");
      toast({
        title: "Complete Your Profile",
        description: "Please complete your profile for a better experience.",
        action: (
          <ToastAction
            altText="Try again"
            onClick={() => router.push("/profile/edit")}
          >
            Go to Profile
          </ToastAction>
        )
      });
    }
  }, [session]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={
                data?.user.picture
                  ? `${process.env.NEXT_PUBLIC_API_URL}${data?.user.picture}`
                  : `${process.env.NEXT_PUBLIC_API_URL}${session.user.picture}`
              }
              alt={session.user.username ?? ""}
            />
            <AvatarFallback>
              {session.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {session.user?.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {items.map((item, index) => {
            const Icon = Icons[item.icon || "arrowRight"];
            return item.title === "Logout" ? (
              <div key={index}>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  key={index}
                  onClick={() =>
                    signOut({
                      callbackUrl: item.href || "/auth/login"
                    })
                  }
                >
                  <Icon className="mr-2 size-5" />
                  {item.title}
                </DropdownMenuItem>
              </div>
            ) : (
              <DropdownMenuItem
                key={index}
                onClick={() => {
                  let href = "/dashboard";
                  item.title === "Profile" &&
                    (href = "/profile/" + session.user?._id);
                  item.title === "Notifications" && (href = "/notifications");
                  router.push(href);
                }}
              >
                <Icon className="mr-2 size-5" />
                {item.title}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
