import * as z from "zod";
import { checkDefaultStringFieldDirty } from "@/lib/utils";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address" }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 8 characters long" })
    .max(100, { message: "Password must be at most 100 characters long" })
});

export type LoginFormValue = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: "Username must be at least 6 characters long" })
      .max(20, {
        message: "Username must be at most 20 characters long"
      }),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .max(100, {
        message: "Password must be at most 100 characters long"
      }),
    confirmPassword: z.string()
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  });

export type RegisterFormValue = z.infer<typeof RegisterSchema>;

export const ProfileSchema = z.object({
  username: z
    .string()
    .min(6, { message: "Username must be at least 6 characters long" })
    .max(20, {
      message: "Username must be at most 20 characters long"
    }),
  email: z.string().email({ message: "Enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Enter a valid phone number" })
    .optional()
    .or(z.literal("")),
  locationName: z
    .string()
    .min(1, { message: "Please select a location" })
    .optional()
    .or(z.literal("")),
  skillLevel: z.string().min(1, { message: "Please select a skill level" }),
  playingStyle: z.string().min(1, { message: "Please select a playing style" }),
  availability: z
    .array(
      z.object({
        day: z.string().min(1, { message: "Please select a day" }),
        timeSlots: z.array(
          z
            .object({
              start: z.string().min(1, { message: "Please select a time" }),
              end: z.string().min(1, { message: "Please select a time" })
            })
            .refine(
              (data) =>
                new Date(`1970-01-01T${data.end}:00Z`) >
                new Date(`1970-01-01T${data.start}:00Z`),
              {
                message: "End time must be greater than start time",
                path: ["end"] // This specifies that the error message should be associated with the 'end' field
              }
            )
        )
      })
    )
    .optional()
});

export type ProfileFormValues = z.infer<typeof ProfileSchema>;

export const GameBuddySchema = z
  .object({
    skillLevel: z
      .string()
      .min(1, { message: "Please select a skill level" })
      .optional(),
    playingStyle: z
      .string()
      .min(1, { message: "Please select a playing style" })
      .optional(),
    locationName: z
      .string()
      .min(1, { message: "Please select a location" })
      .optional()
      .or(z.literal("")),
    availability: z
      .array(
        z.object({
          day: z.string().min(1, { message: "Please select a day" }),
          timeSlots: z.array(
            z
              .object({
                start: z.string().min(1, { message: "Please select a time" }),
                end: z.string().min(1, { message: "Please select a time" })
              })
              .refine(
                (data) =>
                  new Date(`1970-01-01T${data.end}:00Z`) >
                  new Date(`1970-01-01T${data.start}:00Z`),
                {
                  message: "End time must be greater than start time",
                  path: ["end"] // This specifies that the error message should be associated with the 'end' field
                }
              )
          )
        })
      )
      .optional()
  })
  .refine(
    (data) =>
      checkDefaultStringFieldDirty(data.skillLevel) ||
      checkDefaultStringFieldDirty(data.playingStyle) ||
      data.locationName ||
      (data.availability && data.availability?.length > 0),
    {
      message: "Please select at least one field to search for a game buddy",
      path: ["skillLevel"]
    }
  );

export type GameBuddyFormValues = z.infer<typeof GameBuddySchema>;

export const ReviewSchema = z.object({
  rating: z.string().min(1, { message: "Please select a rating" }).optional(),
  comment: z
    .string()
    .min(1, { message: "Please enter a comment" })
    .optional()
    .or(z.literal(""))
});

export type ReviewFormValues = z.infer<typeof ReviewSchema>;

export const EventCreateSchema = z.object({
  name: z.string().min(1, { message: "Please enter a name" }),
  description: z.string().min(1, { message: "Please enter a description" }),
  locationName: z.string().min(1, { message: "Please enter a location" }),
  date: z
    .date({ required_error: "Please select a date" })
    .min(new Date(), "Please select a future date"),
  access: z.string().min(1, { message: "Please select an access" }),
  level: z.string().min(1, { message: "Please select a level" })
});

export type EventCreateFormValues = z.infer<typeof EventCreateSchema>;

export const EventUpdateSchema = z
  .object({
    name: z.string().min(1, { message: "Please enter a name" }).optional(),
    description: z
      .string()
      .min(1, { message: "Please enter a description" })
      .optional(),
    locationName: z
      .string()
      .min(1, { message: "Please enter a location" })
      .optional(),
    date: z.date().min(new Date(), "Please select a future date").optional(),
    access: z
      .string()
      .min(1, { message: "Please select an access" })
      .optional(),
    level: z.string().min(1, { message: "Please select a level" }).optional()
  })
  .refine(
    (data) =>
      data.name ||
      data.description ||
      data.locationName ||
      data.date ||
      data.access ||
      data.level,
    {
      message: "Please change at least one field to update"
    }
  );

export type EventUpdateFormValues = z.infer<typeof EventUpdateSchema>;
