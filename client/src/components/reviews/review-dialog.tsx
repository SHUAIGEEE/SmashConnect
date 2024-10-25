"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
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
import { reviewRatings } from "@/constants/data";
import { ReviewFormValues, ReviewSchema } from "@/schemas";
import Review from "@/types/review";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormStatus } from "react-dom";
import { useForm } from "react-hook-form";

interface ReviewDialogProps {
  title: string;
  review?: Review;
  onSubmit: (values: ReviewFormValues) => void;
}

export default function ReviewDialog({
  title,
  review,
  onSubmit
}: ReviewDialogProps) {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(ReviewSchema)
  });

  const { handleSubmit } = form;

  const { pending } = useFormStatus();

  return (
    <>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Make changes to your review here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid items-center px-4">
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="pb-2">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rating: {field.value}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={
                          review?.rating
                            ? review?.rating.toString()
                            : field.value
                        }
                        disabled={pending}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {reviewRatings.map((rating) => (
                            <SelectItem key={rating.value} value={rating.value}>
                              {rating.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="py-2">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Comment</FormLabel>
                      <Input
                        {...field}
                        id="comment"
                        type="text"
                        placeholder="Write your review here..."
                        disabled={pending}
                        defaultValue={review?.comment}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogClose asChild>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={pending}>
                    Save changes
                  </Button>
                </div>
              </DialogClose>
            </form>
          </Form>
        </div>
      </DialogContent>
    </>
  );
}
