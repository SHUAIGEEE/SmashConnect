"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import Notification from "@/types/notification";
import { ChatMessage } from "@/types/chatMessage";

// Initialize the socket outside of the component to avoid null issues
const socketInstance: Socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
  autoConnect: false,
});

const SocketContext = createContext<any>(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session } = useSession();
  const { toast } = useToast();
  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (session?.accessToken) {
      socketInstance.auth = { token: session.accessToken };
      socketInstance.connect();

      socketInstance.on("connect", () => {
        console.log(`Connected socket: ${socketInstance.id}`);
      });

      socketInstance.on("connect_error", (error: any) => {
        console.log("Connection error", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Connection error"
        });
      });

      socketInstance.on("new_notification", (notification: Notification) => {
        console.log("New notification", notification);
        toast({
          title: "Notification",
          description: notification.message
        });
      });

      socketInstance.on("private_message", (message: ChatMessage) => {
        if (message.sender._id === session.user?._id) return;
        console.log("Private message", message);
        toast({
          title: "New message from " + message.sender.username,
          description: message.content
        });
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected");
      });
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [session?.accessToken]);

  return (
    <SocketContext.Provider value={socketInstance}>
      {children}
    </SocketContext.Provider>
  );
};
