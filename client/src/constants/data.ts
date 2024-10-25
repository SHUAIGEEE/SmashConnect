import { NavItem } from "@/types";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Box,
  Calendar,
  CheckCheck,
  CheckCircle,
  Clock,
  Coffee,
  Crown,
  ExternalLink,
  FileText,
  Handshake,
  MailWarning,
  MapPin,
  MessageCircle,
  MessageSquare,
  Trophy,
  UserPlus,
  XCircle,
  Users,
  Shield,
  Bell
} from "lucide-react";

export const landingPageKeyFeatures = [
  {
    title: "Game Buddy Matchmaking",
    description: "Find Your Perfect Game Buddy!",
    icon: Users
  },
  {
    title: "Court Locator",
    description: "Explore Nearby Badminton Courts!",
    icon: MapPin
  },
  {
    title: "Secure Access",
    description: "Log in, Log out, and Register Securely!",
    icon: Shield
  },
  {
    title: "Equipment Hub",
    description: "Find and Review the Best Equipment!",
    icon: MessageCircle
  },
  {
    title: "Real-Time Notifications",
    description: "Stay Updated with Instant Alerts!",
    icon: Bell
  },
  {
    title: "Event Management",
    description: "Join, Leave, and Manage Badminton Events!",
    icon: Calendar
  }
];

export const landingPageTestimonials = [
  {
    avatar: "JD",
    name: "John Doe",
    title: "Badminton Enthusiast",
    quote:
      '"SmashConnect has completely transformed the way I find and' +
      "connect with game buddies. The matchmaking feature is" +
      'incredible!"'
  },
  {
    avatar: "SM",
    name: "Sarah Miller",
    title: "Badminton Analyst",
    quote:
      '"As a badminton analyst, I rely on SmashConnect for its' +
      "comprehensive event management and real-time notifications." +
      "It's a game-changer!\""
  },
  {
    avatar: "MJ",
    name: "Michael Johnson",
    title: "Sports Fan",
    quote:
      "\"I've tried other apps, but SmashConnect is by far the best." +
      "The user experience is top-notch, and the court locator" +
      'feature is fantastic."'
  }
];

export const dashboardCards = [
  {
    title: "Profile Hub",
    href: "/profile/edit",
    description: "Customize Your Profile and Connect!",
    icon: "profile",
    action: "Edit Profile"
  },
  {
    title: "Game Buddy Matchmaking",
    href: "/matchmaking",
    description: "Find Your Perfect Game Buddy!",
    icon: "matchmaking",
    action: "Find a Buddy"
  },
  {
    title: "Friends Connect",
    href: "/friends",
    description: "Chat and Bond with Fellow Players!",
    icon: "friends",
    action: "Manage Friends"
  },
  {
    title: "Exciting Events",
    href: "/events",
    description: "Join and Manage Exciting Badminton Events!",
    icon: "events",
    action: "Explore Events"
  },
  {
    title: "Court Finder",
    href: "/courts",
    description: "Discover the Best Courts Near You!",
    icon: "courts",
    action: "Find Courts"
  },
  {
    title: "Gear Up",
    href: "/equipment",
    description: "Find the Best Equipment for You!",
    icon: "equipment",
    action: "Browse Equipment"
  },
  {
    title: "Share Your Reviews",
    href: "/reviews",
    description: "Share Your Thoughts and Experiences!",
    icon: "reviews",
    action: "View Reviews"
  },
  {
    title: "Real-Time Notifications",
    href: "/notifications",
    description: "Stay Updated with Instant Alerts!",
    icon: "notifications",
    action: "Check Notifications"
  }
];

export const userNavItems: NavItem[] = [
  {
    title: "Profile",
    icon: "profile"
  },
  {
    title: "Notifications",
    icon: "notifications"
  },
  {
    title: "Logout",
    icon: "logout"
  }
];

export const sidebarNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
    label: "Dashboard"
  },
  {
    title: "Matchmaking",
    href: "/matchmaking",
    icon: "matchmaking",
    label: "matchmaking"
  },
  {
    title: "Friends",
    href: "/friends",
    icon: "friends",
    label: "friends"
  },
  {
    title: "Events",
    href: "/events",
    icon: "events",
    label: "events"
  },
  {
    title: "Courts",
    href: "/courts",
    icon: "courts",
    label: "courts"
  },
  {
    title: "Equipment",
    href: "/equipment",
    icon: "equipment",
    label: "equipment"
  },
  {
    title: "Reviews",
    href: "/reviews",
    icon: "reviews",
    label: "reviews"
  },
  {
    title: "Community",
    href: "/community",
    icon: "community",
    label: "community"
    // disabled: true
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: "notifications",
    label: "notifications"
  }
];

export const skillLevels = [
  {
    value: "default",
    label: "Select Skill Level",
    description: "Choose your current skill level in badminton."
  },
  {
    value: "beginner",
    label: "Beginner",
    description:
      "You are new to badminton and are learning the basics of the game."
  },
  {
    value: "lower_intermediate",
    label: "Lower Intermediate",
    description:
      "You have some experience and can play basic rallies and shots."
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description:
      "You are comfortable playing most shots and can engage in longer rallies."
  },
  {
    value: "upper_intermediate",
    label: "Upper Intermediate",
    description:
      "You have significant experience, strong skills, and can handle competitive matches."
  },
  {
    value: "advanced",
    label: "Advanced",
    description:
      "You are highly skilled with a deep understanding of strategies and techniques."
  },
  {
    value: "elite",
    label: "Elite",
    description:
      "You play at a professional level, with exceptional skill and competitive experience."
  }
];

export const playingStyles = [
  {
    value: "default",
    label: "Select Playing Style",
    description: "Choose your preferred style of play."
  },
  {
    value: "aggressive",
    label: "Aggressive",
    description: "You favor powerful smashes and quick, offensive play."
  },
  {
    value: "defensive",
    label: "Defensive",
    description:
      "You prioritize long rallies and counter-attacking your opponent's shots."
  },
  {
    value: "balanced",
    label: "Balanced",
    description:
      "You blend offensive and defensive strategies for a versatile game."
  }
];

export const days = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" }
];

export const timeSlots = [
  {
    value: "00:00",
    label: "12:00 AM"
  },
  {
    value: "01:00",
    label: "1:00 AM"
  },
  {
    value: "02:00",
    label: "2:00 AM"
  },
  {
    value: "03:00",
    label: "3:00 AM"
  },
  {
    value: "04:00",
    label: "4:00 AM"
  },
  {
    value: "05:00",
    label: "5:00 AM"
  },
  {
    value: "06:00",
    label: "6:00 AM"
  },
  {
    value: "07:00",
    label: "7:00 AM"
  },
  {
    value: "08:00",
    label: "8:00 AM"
  },
  {
    value: "09:00",
    label: "9:00 AM"
  },
  {
    value: "10:00",
    label: "10:00 AM"
  },
  {
    value: "11:00",
    label: "11:00 AM"
  },
  {
    value: "12:00",
    label: "12:00 PM"
  },
  {
    value: "13:00",
    label: "1:00 PM"
  },
  {
    value: "14:00",
    label: "2:00 PM"
  },
  {
    value: "15:00",
    label: "3:00 PM"
  },
  {
    value: "16:00",
    label: "4:00 PM"
  },
  {
    value: "17:00",
    label: "5:00 PM"
  },
  {
    value: "18:00",
    label: "6:00 PM"
  },
  {
    value: "19:00",
    label: "7:00 PM"
  },
  {
    value: "20:00",
    label: "8:00 PM"
  },
  {
    value: "21:00",
    label: "9:00 PM"
  },
  {
    value: "22:00",
    label: "10:00 PM"
  },
  {
    value: "23:00",
    label: "11:00 PM"
  }
];

export const messageTemplates = [
  "Hi, I'd love to play a game with you! Are you available?",
  "Hello, let's schedule a match at the upcoming event.",
  "Hey, I saw your profile and thought we could have a great game. Let's play!",
  "Hi, looking forward to a fun and competitive match with you!"
];

export const requestStatuses = [
  {
    value: "pending",
    label: "Pending",
    icon: Clock
  },
  {
    value: "accepted",
    label: "Accepted",
    icon: CheckCircle
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle
  }
];

export const requestTypes = [
  {
    value: "sent",
    label: "Sent",
    icon: ArrowUpCircle
  },
  {
    value: "received",
    label: "Received",
    icon: ArrowDownCircle
  }
];

export const equipmentTypes = [
  { value: "racquets", label: "Racquets" },
  { value: "strings", label: "Strings" },
  { value: "shoes", label: "Shoes" }
];

export const racquetFlexibilities = [
  { value: "extra-stiff", label: "Extra Stiff" },
  { value: "stiff", label: "Stiff" },
  { value: "medium", label: "Medium" },
  { value: "flexible", label: "Flexible" },
  { value: "extra-flexible", label: "Extra Flexible" }
];

export const racquetBalances = [
  { value: "extra-head-light", label: "Extra Head Light" },
  { value: "head-light", label: "Head Light" },
  { value: "even", label: "Even" },
  { value: "head-heavy", label: "Head Heavy" },
  { value: "extra-head-heavy", label: "Extra Head Heavy" }
];

export const equipmentPlayerStyles = [
  { value: "aggressive", label: "Aggressive" },
  { value: "defensive", label: "Defensive" },
  { value: "balanced", label: "Balanced" },
  { value: "all_suite", label: "All Suite" }
];

export const equipmentSkillLevels = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "all_suite", label: "All Suite" }
];

export const reviewRatings = [
  { value: "1", label: "1 - Poor" },
  { value: "2", label: "2 - Fair" },
  { value: "3", label: "3 - Good" },
  { value: "4", label: "4 - Very good" },
  { value: "5", label: "5 - Excellent" }
];

export const reviewTypes = [
  {
    value: "Equipment",
    label: "Equipment",
    icon: Box
  },
  {
    value: "Court",
    label: "Court",
    icon: MapPin
  }
];

export const eventLevels = [
  { value: "competitive", label: "Competitive", icon: Trophy },
  { value: "casual", label: "Casual", icon: Coffee }
];

export const eventAccesses = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" }
];

export const eventHosts = [
  { value: "self", label: "Self", icon: Crown },
  { value: "other", label: "Other", icon: ExternalLink }
];

export const notificationTypes = [
  {
    value: "friend_request",
    label: "Friend Request",
    icon: UserPlus,
    href: "/friends/friend-requests"
  },
  {
    value: "match_request",
    label: "Match Request",
    icon: Handshake,
    href: "/matchmaking/match-requests"
  },
  { value: "event", label: "Event", icon: Calendar, href: "/events/my-events" },
  { value: "thread", label: "Thread", icon: MessageSquare, href: "/community" },
  { value: "post", label: "Post", icon: FileText, href: "/community" },
  {
    value: "comment",
    label: "Comment",
    icon: MessageCircle,
    href: "/community"
  }
];

export const notificationReadStatuses = [
  { value: "Unread", label: "Unread", icon: MailWarning },
  { value: "Read", label: "Read", icon: CheckCheck }
];
