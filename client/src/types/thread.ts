import User from "@/types/user";

export default interface Thread {
  _id: string;
  title: string;
  author: User; // Reference to User
  createdAt: string;
  updatedAt: string;
}
