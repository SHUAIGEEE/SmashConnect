import { getErrorMessage } from "@/lib/utils";
import { redirect } from "next/navigation";

export default function logoutIfTokenInvalid(error: unknown) {
  const message = getErrorMessage(error);
  if (
    message === "Invalid Token! Please login again!" ||
    message.includes("Invalid Token")
  ) {
    redirect("/auth/logout");
  }
}
