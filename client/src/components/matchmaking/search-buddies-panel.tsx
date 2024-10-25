"use client";
import { searchGameBuddy } from "@/actions/matchmaking/searchGameBuddy";
import BuddiesResultPanel from "@/components/matchmaking/buddies-result-panel";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { days, playingStyles, skillLevels, timeSlots } from "@/constants/data";
import { GameBuddyFormValues, GameBuddySchema } from "@/schemas";
import FriendRequest from "@/types/friendRequest";
import User from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useFieldArray, useForm } from "react-hook-form";

interface SearchBuddiesPanelProps {
  friendRequests: FriendRequest[];
}

export default function SearchBuddiesPanel({
  friendRequests
}: SearchBuddiesPanelProps) {
  const { toast } = useToast();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isResultPanelOpen, setIsResultPanelOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const form = useForm<GameBuddyFormValues>({
    resolver: zodResolver(GameBuddySchema)
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

  const onSubmit = async (data: GameBuddyFormValues) => {
    // Clean up the data
    data.skillLevel = data.skillLevel === "default" ? "" : data.skillLevel;
    data.playingStyle =
      data.playingStyle === "default" ? "" : data.playingStyle;

    const result = await searchGameBuddy(data);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    } else {
      setIsResultPanelOpen(true);
      setSearchResults(result.users);
    }
  };

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleResultPanel = () => {
    setIsResultPanelOpen((prev) => !prev);
  };

  return (
    <div className="mb-2 rounded-xl border bg-background shadow-lg">
      <div
        className={`flex cursor-pointer items-center justify-between px-6 py-4 ${
          isExpanded
            ? "bg-primary text-primary-foreground"
            : "bg-card text-card-foreground"
        }`}
        onClick={toggleExpansion}
      >
        <h2 className="text-xl font-bold">Search Game Buddies</h2>
        <Button
          variant={isExpanded ? "ghost" : "outline"}
          size="icon"
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <ChevronsUpDownIcon className="h-5 w-5" />
        </Button>
      </div>
      {isExpanded && (
        <div className="px-6">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-8 py-4">
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
                            <SelectValue placeholder="Select skill level" />
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
                            <SelectValue placeholder="Select playing style" />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="col-span-2 flex-col space-y-2">
                  <FormLabel>Availability</FormLabel>
                  {availabilityFields.map((field, index) => (
                    <div key={field.id} className="flex gap-2">
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
                          className="flex gap-2"
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
                </div>
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
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={pending} className="self-end">
                  Search
                </Button>
              </div>
            </form>
          </Form>
          <Separator className="mt-4" />
          <div
            className={
              "flex cursor-pointer items-center justify-between bg-card px-6 py-4 text-card-foreground"
            }
            onClick={toggleResultPanel}
          >
            <h2 className="text-xl font-bold">Search Results</h2>
            <Button
              variant={isResultPanelOpen ? "ghost" : "outline"}
              size="icon"
              className={`transition-transform ${isResultPanelOpen ? "rotate-180" : ""}`}
            >
              <ChevronsUpDownIcon className="h-5 w-5" />
            </Button>
          </div>
          {isResultPanelOpen && (
            <BuddiesResultPanel
              users={searchResults}
              friendRequests={friendRequests}
            />
          )}
        </div>
      )}
    </div>
  );
}
