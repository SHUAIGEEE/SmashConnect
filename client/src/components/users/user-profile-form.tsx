"use client";
import { updateUser } from "@/actions/users/updateUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { days, playingStyles, skillLevels, timeSlots } from "@/constants/data";
import { ProfileFormValues, ProfileSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStatus } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadPicture } from "@/actions/uploadPicture";
import { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function UserProfileForm() {
  const { update: sessionUpdate, data: session } = useSession();

  if (!session) {
    window.location.reload();
    window.location.href = "/profile/edit";
  }

  const { toast } = useToast();

  const [file, setFile] = useState<File>();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      username: session?.user.username || "",
      email: session?.user.email || "",
      phone: session?.user.phone || "",
      locationName: session?.user.locationName || "",
      skillLevel: session?.user.skillLevel || "",
      playingStyle: session?.user.playingStyle || "",
      availability: session?.user.availability || [
        { day: "", timeSlots: [{ start: "", end: "" }] }
      ]
    }
  });

  const { handleSubmit, control } = form;

  const {
    fields: availabilityFields,
    append,
    remove
  } = useFieldArray({
    control,
    name: "availability"
  });

  const { pending } = useFormStatus();

  const handleUploadPicture = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a file to upload"
      });
      return;
    }

    if (!session) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Session not found. Please refresh the page."
      });
      return;
    }

    const result = await uploadPicture(session, file, "profile");
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: "You have successfully uploaded your picture!"
      });
      await sessionUpdate({ updatedUser: result });
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    const result = await updateUser(data);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      toast({
        title: "Success",
        description: "You have successfully updated your profile!"
      });
      await sessionUpdate({ updatedUser: result });
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <header className="space-y-2">
        <div className="flex items-center space-x-3">
          <Avatar className="h-24 w-24">
            <AvatarImage
              src={`${process.env.NEXT_PUBLIC_API_URL}${session?.user.picture}`}
              alt={session?.user.username ?? ""}
            />
            <AvatarFallback>
              {session?.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              {session?.user.username || "User"}
            </h1>
            <div className="flex gap-2">
              <Input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0])}
              />
              <Button
                size="lg"
                className="whitespace-nowrap"
                disabled={pending}
                onClick={() => handleUploadPicture()}
              >
                Upload Picture
              </Button>
            </div>
          </div>
        </div>
      </header>
      <ScrollArea className="h-full w-full">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold">Basic Information</h2>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g. appealing_username"
                            disabled={pending}
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public display name. It can be your real
                          name or a pseudonym. You can only change this once
                          every 30 days.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="e.g. smashconnect@example.com"
                            disabled={pending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          This email will be used to log in to your account and
                          receive notifications.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="e.g. 1234567890"
                            disabled={pending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          This phone number will be used to contact you for
                          matches and events.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="locationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g. City Name"
                            disabled={pending}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          This is the city or town where you are currently
                          located. It helps others find you for matches and
                          events.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <h2 className="text-xl font-bold">Badminton Information</h2>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-8">
                  <FormField
                    control={form.control}
                    name="skillLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skill Level</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your skill level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {skillLevels.map((level) => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {
                            skillLevels.find((level) => {
                              return level.value === field.value;
                            })?.description
                          }
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="playingStyle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Playing Style</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your playing style" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {playingStyles.map((style) => (
                              <SelectItem key={style.value} value={style.value}>
                                {style.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {
                            playingStyles.find((style) => {
                              return style.value === field.value;
                            })?.description
                          }
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="col-span-2 flex-col space-y-2">
                    <FormLabel>Availability</FormLabel>
                    {availabilityFields.map((field, index) => (
                      <div
                        key={field.id}
                        className="col-span-2 grid grid-cols-2 gap-2 md:col-span-1"
                      >
                        <FormField
                          control={control}
                          name={`availability.${index}.day`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Day</FormLabel>
                              <FormControl>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                  {...field}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a day" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {days.map((day) => (
                                      <SelectItem
                                        key={day.value}
                                        value={day.value}
                                      >
                                        {day.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {field.timeSlots.map((slot, slotIndex) => (
                          <div
                            key={`${index} - ${slotIndex}`}
                            className="col-span-2 flex gap-2 md:col-span-1"
                          >
                            <FormField
                              control={control}
                              name={`availability.${index}.timeSlots.${slotIndex}.start`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Start Time</FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      {...field}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {timeSlots.map((slot) => (
                                          <SelectItem
                                            key={slot.value}
                                            value={slot.value}
                                          >
                                            {slot.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={control}
                              name={`availability.${index}.timeSlots.${slotIndex}.end`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Time</FormLabel>
                                  <FormControl>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                      {...field}
                                    >
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select a time" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {timeSlots.map((slot) => (
                                          <SelectItem
                                            key={slot.value}
                                            value={slot.value}
                                          >
                                            {slot.label}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <Button
                              type="button"
                              className="flex place-self-end"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </div>
                    ))}
                    <Button
                      type="button"
                      className="flex"
                      onClick={() =>
                        append({
                          day: "",
                          timeSlots: [{ start: "", end: "" }]
                        })
                      }
                    >
                      Add
                    </Button>
                    <FormDescription>
                      Specify the days and time slots you are available to play
                      badminton. This helps others know when you are free for
                      matches and practice sessions.
                    </FormDescription>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="pt-6">
              <p className="mt-2 text-sm text-muted-foreground">
                Make sure to save your changes before leaving the page.
              </p>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}
