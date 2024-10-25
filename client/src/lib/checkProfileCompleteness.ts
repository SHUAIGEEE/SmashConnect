import User from "@/types/user";

/**
 * Check if user has all the required fields
 * Default values:
 * empty string for phone, picture, locationName
 * "default" for skillLevel and playingStyle
 * empty array for availability
 * If any of these fields are missing, return false
 * Otherwise, return true
 * @param user
 * @returns boolean
 */
export const isProfileComplete = (user: User): Boolean => {
  return (
    user.phone !== "" &&
    user.picture !== "" &&
    user.locationName !== "" &&
    user.skillLevel !== "default" &&
    user.playingStyle !== "default" &&
    user.availability?.length > 0
  );
};
