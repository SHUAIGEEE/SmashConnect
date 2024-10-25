import FriendRequest from "@/types/friendRequest";
import MatchRequest from "@/types/matchRequest";
import Event from "@/types/event";
import Post from "@/types/post";
import Comment from "@/types/comment";
import Thread from "@/types/thread";

export default interface Notification {
  _id: string;
  user: string; // Reference to User
  type:
    | "friend_request"
    | "match_request"
    | "event"
    | "thread"
    | "post"
    | "comment";
  message: string;
  read: boolean;
  // Reference to related event, request, post, etc.
  // relatedId: FriendRequest | MatchRequest | Event | Thread | Post | Comment;
  relatedId: string;
  createdAt: string;
  updatedAt: string;
}
