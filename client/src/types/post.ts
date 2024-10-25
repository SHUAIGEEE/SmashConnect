import Thread from "@/types/thread";
import User from "@/types/user";
import Event from "@/types/event";
import Equipment from "@/types/equipment";
import Court from "@/types/court";

export default interface Post {
  _id: string;
  author: string; // Reference to User
  title: string;
  content: string;
  thread: Thread; // Reference to Thread
  likes: User[]; // References to User
  linkedUser: User[]; // References to User
  linkedEvent: Event[]; // References to Event
  linkedEquipment: Equipment[]; // References to Equipment
  linkedCourt: Court[]; // References to Court
  isEdited: boolean;
  picture: string;
  createdAt: string;
  updatedAt: string;
}
