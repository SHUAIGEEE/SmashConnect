import {
  ArrowRight,
  Bell,
  Box,
  Calendar,
  Contact,
  LayoutDashboardIcon,
  LogOut,
  LucideIcon,
  MapPin,
  MessageCircle,
  MessageSquareQuote,
  User2Icon,
  UserSearch
} from "lucide-react";

export type Icon = LucideIcon;

export const Icons = {
  dashboard: LayoutDashboardIcon,
  matchmaking: UserSearch,
  events: Calendar,
  equipment: Box,
  courts: MapPin,
  notifications: Bell,
  community: MessageCircle,
  friends: Contact,
  reviews: MessageSquareQuote,
  logout: LogOut,
  profile: User2Icon,
  arrowRight: ArrowRight
};
