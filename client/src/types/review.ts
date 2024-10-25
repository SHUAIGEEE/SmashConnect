import User from "@/types/user";

export default interface Review {
  _id: string;
  user: User; // Reference to User
  rating: number;
  comment: string;
  reviewType: "Court" | "Equipment";
  entityId: string; // Reference to Court or Equipment
  entityName: string;
  createdAt: string;
  updatedAt: string;
}
