import User from "@/types/user";

export default interface Event {
  _id: string;
  name: string;
  description: string;
  locationName: string;
  location: {
    coordinates: [number, number];
  };
  date: Date;
  access: "public" | "private";
  level: "competitive" | "casual";
  participants: User[];
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}
