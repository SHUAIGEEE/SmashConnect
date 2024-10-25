"use server";
import { signIn } from "@/../auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/../routes";
import { LoginFormValue } from "@/schemas";
import { AuthError } from "next-auth";

export async function login(
  credentials: LoginFormValue,
  callbackUrl: string | null
) {
  try {
    await signIn("credentials", {
      ...credentials,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
    });
  } catch (error: unknown) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CallbackRouteError":
        case "CredentialsSignin":
          return { error: "Invalid credentials!" };
        default:
          return { error: "Something went wrong!" };
      }
    }
    throw error;
  }
}
