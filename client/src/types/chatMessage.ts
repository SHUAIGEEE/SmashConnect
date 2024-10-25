import User from "@/types/user";

export interface ChatMessage {
  _id: string;
  sender: User;
  recipient: User;
  content: string;
  createdAt: string;
  updatedAt: string;
}
