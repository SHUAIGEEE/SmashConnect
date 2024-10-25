"use client";
import { updateEvent } from "@/actions/events/updateEvent";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "@/components/ui/datetime-picker";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { eventAccesses, eventLevels } from "@/constants/data";
import { EventUpdateFormValues, EventUpdateSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";
import Event from "@/types/event";

export default function EventUpdateForm({ event }: { event: Event }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  console.log("Event: ", event);
  const form = useForm<EventUpdateFormValues>({
    resolver: zodResolver(EventUpdateSchema),
    defaultValues: {
      name: event.name,
      description: event.description,
      locationName: event.locationName,
      date: new Date(Number(event.date)),
      access: event.access,
      level: event.level
    }
  });

  const { handleSubmit } = form;

  const { pending } = useFormStatus();

  const onSubmit = async (data: EventUpdateFormValues) => {
    // Call submit review API
    const result = await updateEvent({ id: event._id, details: data });
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result?.error
      });
    } else {
      setOpen(false);
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  };

  return (
    <div className="grid gap-2">
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button variant="ghost">
            <Pencil className="mr-2 h-4 w-4" />
            Update
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Update Event</DrawerTitle>
            <DrawerDescription>
              Update your event here. Click save when you're done.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid items-center px-4">
            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <ScrollArea className="p-3 sm:h-[500px] md:h-[250px]">
                  <div className="grid grid-cols-1 gap-4 px-2 pb-2 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <Input
                            {...field}
                            id="name"
                            type="text"
                            placeholder="Give your event a name"
                            disabled={pending}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <Input
                            {...field}
                            id="description"
                            type="text"
                            placeholder="Describe your event"
                            disabled={pending}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="locationName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <Input
                            {...field}
                            id="locationName"
                            type="text"
                            placeholder="Where is your event?"
                            disabled={pending}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col gap-2">
                          <FormLabel htmlFor="date">Date time</FormLabel>
                          <FormControl>
                            <DateTimePicker
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="access"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={event.access}
                            disabled={pending}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a access" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventAccesses.map((access) => (
                                <SelectItem
                                  key={access.value}
                                  value={access.value}
                                >
                                  {access.label}
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
                      name="level"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={event.level}
                            disabled={pending}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {eventLevels.map((level) => (
                                <SelectItem
                                  key={level.value}
                                  value={level.value}
                                >
                                  {level.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ScrollArea>
                <div className="grid items-start pt-2">
                  <Button type="submit" disabled={pending}>
                    Save changes
                  </Button>
                </div>
              </form>
            </Form>
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
