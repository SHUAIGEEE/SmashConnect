"use client";
import { addReview } from "@/actions/reviews/addReview";
import { deleteReview } from "@/actions/reviews/deleteReview";
import { updateReview } from "@/actions/reviews/updateReview";
import ReviewDialog from "@/components/reviews/review-dialog";
import StarRating from "@/components/reviews/star-rating";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { ReviewFormValues } from "@/schemas";
import Review from "@/types/review";
import { Edit, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";

interface ReviewsPanelProps {
  entityId: string;
  reviews: Review[];
  type: "Equipment" | "Court";
}

export default function ReviewsPanel({
  entityId,
  reviews,
  type
}: ReviewsPanelProps) {
  const { data: session } = useSession();
  const userId = session?.user._id;

  const { toast } = useToast();
  const [userReview, setUserReview] = useState(
    reviews.find((review) => review.user._id === userId) || null
  );
  const [otherReviews, setOtherReviews] = useState(
    reviews.filter((review) => review.user._id !== userId)
  );
  const noReviews = !userReview && otherReviews.length === 0;

  // console.log("User review:", userReview);
  // console.log("Other reviews:", otherReviews);

  const handleSubmit = async (data: ReviewFormValues) => {
    // Clean up the data
    if (!data.rating) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a rating."
      });
      return;
    }

    const rating = parseInt(data.rating);

    // Call submit review API
    const result = await addReview(entityId, type, rating, data.comment);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result?.error
      });
    } else {
      toast({
        title: "Success",
        description: "Review submitted successfully."
      });
      // Update the UI
      setUserReview(result.review);
    }
  };

  const handleEdit = async (data: ReviewFormValues) => {
    // Don't call API if data is the same
    if (!data.rating && !data.comment && data.comment !== "") {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No changes detected."
      });
      return;
    }

    let rating: number | undefined = undefined;
    if (data.rating) {
      rating = parseInt(data.rating);
    }

    const comment: string | undefined = data.comment;

    const result = await updateReview(userReview!._id, rating, comment);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result?.error
      });
    } else {
      toast({
        title: "Success",
        description: "Review updated successfully."
      });
      // Update the UI
      setUserReview(result.review);
    }
  };

  const handleDelete = async () => {
    const result = await deleteReview(userReview!._id);
    if (result?.error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: result?.error
      });
    } else {
      toast({
        title: "Success",
        description: "Review deleted successfully."
      });
      // Update the UI
      setUserReview(null);
    }
  };

  return (
    <div className="grid items-start gap-4 md:col-span-2 md:gap-10">
      <div className="grid gap-4">
        <h2 className="text-2xl font-bold">User Reviews</h2>
        <ScrollArea className="h-auto w-full">
          <div className="grid gap-4">
            {userReview && (
              <div
                key={userReview._id}
                className="flex items-start gap-4 border-b pb-4"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_URL}${userReview.user.picture}`}
                    alt={userReview.user.username ?? ""}
                  />
                  <AvatarFallback>
                    {userReview.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid w-full gap-2">
                  <div className="flex w-full items-center justify-start gap-4">
                    <StarRating rating={userReview.rating} />
                    <p className="text-sm text-muted-foreground">
                      {userReview.user.username}
                    </p>
                    <div className="justify-self-end">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit review</span>
                          </Button>
                        </DialogTrigger>
                        <ReviewDialog
                          title="Edit Review"
                          review={userReview}
                          onSubmit={handleEdit}
                        />
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="ml-auto"
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete review</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md">
                          <DialogHeader>
                            <DialogTitle>Delete review</DialogTitle>
                            <DialogDescription>
                              Do you sure you want to delete this review?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter className="sm:justify-center">
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                            >
                              Delete
                            </Button>
                            <DialogClose asChild>
                              <Button type="button" variant="secondary">
                                Cancel
                              </Button>
                            </DialogClose>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <p className="text-sm leading-loose">{userReview.comment}</p>
                </div>
              </div>
            )}
            {otherReviews.map((review) => (
              <div
                key={review._id}
                className="flex items-start gap-4 border-b pb-4"
              >
                <Avatar className="h-10 w-10 border">
                  <AvatarImage
                    src={`${process.env.NEXT_PUBLIC_API_URL}${review.user.picture}`}
                    alt={review.user.username ?? ""}
                  />
                  <AvatarFallback>
                    {review.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid gap-2">
                  <div className="flex items-center gap-4">
                    <StarRating rating={review.rating} />
                    <p className="text-sm text-muted-foreground">
                      {review.user.username}
                    </p>
                  </div>
                  <p className="text-sm leading-loose">{review.comment}</p>
                </div>
              </div>
            ))}
            {noReviews && (
              <p className="text-muted-foreground">Be the first to review!</p>
            )}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
        {!userReview && (
          <div className="grid gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Submit a Review</Button>
              </DialogTrigger>
              <ReviewDialog title="Submit Review" onSubmit={handleSubmit} />
            </Dialog>
          </div>
        )}
      </div>
    </div>
  );
}
