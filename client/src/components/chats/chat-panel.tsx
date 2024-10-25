"use client";
import { getChatMessages } from "@/actions/chats/getChatMessages";
import { useSocket } from "@/components/layout/socket-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ChatMessage } from "@/types/chatMessage";
import User from "@/types/user";
import { MoreHorizontal, RotateCw, SendHorizontal, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { removeFriend } from "@/actions/users/removeFriend";

interface ChatPanelProps {
  friend: User;
}

export default function ChatPanel({ friend }: ChatPanelProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { update: sessionUpdate, data: session } = useSession();
  const socket = useSocket();

  const userId = session?.user?._id;

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    const result = await getChatMessages(friend._id);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
      return;
    }
    setChatMessages(result?.messages);
  };

  // Fetch messages on initial render
  useEffect(() => {
    fetchMessages();
    scrollToBottom();
  }, [friend._id]);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: ChatMessage) => {
      // console.log("New message:", message);
      // console.log("Friend:", friend);
      if (
        message.sender._id === friend._id ||
        message.recipient._id === friend._id
      ) {
        setChatMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      }
    };

    socket.on("private_message", handleNewMessage);

    return () => {
      socket.off("private_message", handleNewMessage);
    };
  }, [socket]);

  // Send a message
  const handleSendMessage = () => {
    try {
      if (newMessage.trim() === "") return;

      const messageData = {
        recipientId: friend._id,
        content: newMessage
      };

      socket.emit("private_message", messageData);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      // window.location.reload();
    }
  };

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteFriend = async () => {
    const result = await removeFriend(friend._id);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: `Friend ${friend.username} deleted`
      });
      await sessionUpdate({ updatedUser: result });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <section className="flex w-full flex-col">
      <header className="flex justify-between border-b p-4">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <Avatar
            className="relative h-10 w-10 cursor-pointer overflow-visible"
            onClick={() => router.push(`/profile/${friend._id}`)}
          >
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_API_URL}${friend.picture}`}
              alt={friend.username ?? ""}
            />
            <AvatarFallback>
              {friend.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <Link href={`/profile/${friend._id}`} className="underline">
              {friend.username}
            </Link>
            <span className="block text-xs text-muted-foreground">
              {friend.email}
            </span>
          </div>
        </h2>
        <div>
          <Button
            onClick={() => {
              fetchMessages();
              scrollToBottom();
            }}
            variant="ghost"
          >
            <RotateCw className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleDeleteFriend}
                className="text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                <span>Delete friend</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message._id}
              className={`flex items-end gap-2 ${
                message.sender._id === userId ? "justify-end" : ""
              }`}
            >
              <div
                className={`rounded-lg p-2 ${
                  message.sender._id === userId
                    ? "bg-primary text-primary-contrast"
                    : "bg-secondary text-secondary-contrast"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <span
                  className={`block text-xs ${
                    message.sender._id === userId
                      ? "text-primary-contrast"
                      : "text-zinc-500 dark:text-zinc-400"
                  }`}
                >
                  {new Date(Number(message.createdAt)).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} /> {/* Scroll to this element */}
        </div>
      </main>
      <footer className="border-t p-4 dark:border-zinc-700">
        <div className="flex items-center gap-2">
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage} className="flex gap-1">
            Send
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </section>
  );
}
