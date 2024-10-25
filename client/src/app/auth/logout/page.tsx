"use client";
import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { Loader } from "lucide-react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: "/auth/login" });
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <Loader className="mx-auto h-12 w-12 animate-spin text-primary" />
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Logging You Out
        </h1>
        <p className="mt-4 text-muted-foreground">
          Your session expired. Please wait while we log you out of the system.
        </p>
      </div>
    </div>
  );
}
