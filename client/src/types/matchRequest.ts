import User from "@/types/user";
import Event from "@/types/event";

export default interface MatchRequest {
  _id: string;
  sender: User; // Reference to User
  recipient: User; // Reference to User
  event: Event; // Reference to Event
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}
