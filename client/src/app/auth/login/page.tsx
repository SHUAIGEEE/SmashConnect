import UserAuthForm from "@/components/users/user-auth-form";
import { Earth } from "lucide-react";
import Link from "next/link";

export default function AuthenticationPage() {
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Earth className="mr-2 h-6 w-6" />
          <Link href={"/"}>SmashConnect</Link>
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Welcome Back! Your Badminton Community Awaits.&rdquo;
            </p>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Login to your account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password below to login
            </p>
          </div>
          <UserAuthForm />
          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              href="/auth/register"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign Up here
            </Link>{" "}
          </p>
        </div>
      </div>
    </div>
  );
}