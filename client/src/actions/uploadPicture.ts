import { getErrorMessage } from "@/lib/utils";
import { Session } from "next-auth";

export async function uploadPicture(
  session: Session,
  file: File,
  type: "profile" | "post",
  postId?: string
) {
  try {
    const formData = new FormData();
    formData.append("image", file);
    if (type === "post" && postId) {
      formData.append("postId", postId);
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/upload/${type}`,
      {
        method: "POST",
        body: formData,
        headers: {
          authorization: `Bearer ${(session as any)?.accessToken}`
        }
      }
    );

    if (!response.ok) {
      return { error: "Failed to upload picture" };
    }

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    return { error: getErrorMessage(error) };
  }
}
