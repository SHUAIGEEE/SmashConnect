"use client";
import { getFriends } from "@/actions/users/getFriends";
import { Breadcrumbs } from "@/components/breadcrumbs";
import NavigationButton from "@/components/buttons/navigation-button";
import ChatPanel from "@/components/chats/chat-panel";
import { useSocket } from "@/components/layout/socket-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import User from "@/types/user";
import { MailSearch, MessagesSquare, Search } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Friends", link: "/friends" }
];

export default function Friends() {
  const { toast } = useToast();

  const [friends, setFriends] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedFriend, setSelectedFriend] = useState<User | null>(null);

  useEffect(() => {
    const fetchFriends = async () => {
      const result = await getFriends();
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error
        });
        return;
      }
      setFriends(result.friends);
    };

    fetchFriends();
  }, []);

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFriendClick = (friend: User) => {
    console.log("Friend clicked:", friend._id);
    setSelectedFriend(friend);
  };

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Friends"
          description="Contact and manage your friends!"
        />

        <NavigationButton link="/friends/friend-requests" variant="secondary">
          <MailSearch className="mr-2 h-4 w-4" />
          Friend Requests
        </NavigationButton>
      </div>

      <Separator />

      <div className="flex h-screen rounded-md border-2">
        <aside className="w-80 border-r">
          <div className="flex h-full flex-col space-y-4 p-4">
            <div className="h-fit">
              <Search className="absolute left-2.5 top-3 h-4 w-4" />
              <Input
                className="pl-8"
                placeholder="Search friends..."
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <ScrollArea className="flex-grow">
              <div className="space-y-2 pr-4">
                {filteredFriends.map((friend) => (
                  <Card
                    key={friend._id}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => handleFriendClick(friend)}
                  >
                    <CardContent className="flex items-center gap-4 py-4">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage
                          src={`${process.env.NEXT_PUBLIC_API_URL}${friend.picture}`}
                          alt={friend.username ?? ""}
                        />
                        <AvatarFallback>
                          {friend.username.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-semibold">{friend.username}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>
          </div>
        </aside>
        {selectedFriend ? (
          <ChatPanel friend={selectedFriend} />
        ) : (
          <div className="flex w-full items-center justify-center gap-3">
            <MessagesSquare className="h-8 w-8 text-muted-foreground" />
            <p className="text-lg">Select a friend to start chatting!</p>
          </div>
        )}
      </div>
    </div>
  );
}
