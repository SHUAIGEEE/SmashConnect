"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NavigationButton({
  link,
  text = "View all",
  variant = "outline",
  children
}: {
  link: string;
  text?: string;
  variant?:
    | "link"
    | "outline"
    | "default"
    | "destructive"
    | "secondary"
    | "ghost"
    | null
    | undefined;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  return (
    <Button
      variant={variant}
      onClick={() => {
        router.push(link);
      }}
    >
      {children || text}
    </Button>
  );
}
