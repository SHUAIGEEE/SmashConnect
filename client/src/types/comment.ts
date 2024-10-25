import User from "@/types/user";
import Post from "@/types/post";

export default interface Comment {
  _id: string;
  author: User; // Reference to User
  content: string;
  post: Post; // Reference to Post
  isEdited: boolean;
  createdAt: string;
  updatedAt: string;
}
