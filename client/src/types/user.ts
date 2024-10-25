export default interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  phone: string;
  picture: string;
  friends: string[];
  locationName: string;
  location: {
    coordinates: [number, number];
  };
  skillLevel:
    | "default"
    | "beginner"
    | "lower_intermediate"
    | "intermediate"
    | "upper_intermediate"
    | "advanced"
    | "elite";
  playingStyle: "default" | "aggressive" | "defensive" | "balanced";
  availability: {
    day: string;
    timeSlots: {
      start: string;
      end: string;
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
}
