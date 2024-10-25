import User from "@/types/user";

export default interface FriendRequest {
  _id: string;
  sender: User; // Reference to User
  recipient: User; // Reference to User
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}
