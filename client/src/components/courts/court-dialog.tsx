import ReviewsPanel from "@/components/reviews/reviews-panel";
import StarRating from "@/components/reviews/star-rating";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import Court from "@/types/court";
import Review from "@/types/review";
import { gql, TypedDocumentNode, useSuspenseQuery } from "@apollo/client";
import { Globe, Map, Phone } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

interface CourtDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  court: Court;
}

export default function CourtDialog({
  open,
  setOpen,
  court
}: CourtDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <ScrollArea className="h-[400px] p-4 sm:p-6">
          <div className="grid gap-6">
            <div className="grid gap-2">
              <DialogTitle className="text-2xl font-bold">
                {court.name}
              </DialogTitle>
              <DialogDescription className="hidden" />
              <p className="text-muted-foreground">{court.address}</p>
              {court.phoneNumber && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <p>{court.phoneNumber}</p>
                </div>
              )}
            </div>
            {court.openingHours && court.openingHours.length > 0 && (
              <div className="grid gap-2">
                <h3 className="text-lg font-medium">Hours</h3>
                <div className="grid items-center gap-1">
                  {court.openingHours.map((hour, index) => (
                    <p key={index}>{hour}</p>
                  ))}
                </div>
              </div>
            )}
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Ratings</h3>
              <div className="flex items-center gap-2">
                <StarRating rating={court.averageRating} />
                <p className="text-lg font-medium">
                  {court.averageRating.toFixed(1)}
                </p>
                <p className="text-muted-foreground">
                  ({court.userRatingsTotal})
                </p>
              </div>
            </div>
            <div className="grid gap-2">
              <h3 className="text-lg font-medium">Links</h3>
              <div className="grid gap-2">
                {court.websiteUri && (
                  <Link
                    href={court.websiteUri}
                    className="flex items-center gap-2 text-primary hover:underline"
                    prefetch={false}
                  >
                    <Globe className="h-5 w-5" />
                    <p>Website</p>
                  </Link>
                )}
                <Link
                  href={court.googleMapsUri}
                  className="flex items-center gap-2 text-primary hover:underline"
                  prefetch={false}
                >
                  <Map className="h-5 w-5" />
                  <p>Directions</p>
                </Link>
              </div>
            </div>
          </div>
          <CourtReviewsPanel court={court} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface Data {
  entityReviews: Review[];
}

interface Variables {
  id: string;
  reviewType: string;
}

const GET_COURT_REVIEWS: TypedDocumentNode<Data, Variables> = gql`
  query GET_COURT_REVIEWS($id: ID!, $reviewType: String!) {
    entityReviews(entityId: $id, reviewType: $reviewType) {
      _id
      user {
        _id
        username
        picture
      }
      rating
      comment
    }
  }
`;

const CourtReviewsPanel = ({ court }: { court: Court }) => {
  const { data } = useSuspenseQuery(GET_COURT_REVIEWS, {
    variables: { id: court._id, reviewType: "Court" }
  });

  return (
    <Suspense
      fallback={
        <div className="grid">
          <Spinner />
          Loading...
        </div>
      }
    >
      <div className="mt-6">
        <ReviewsPanel
          entityId={court._id}
          reviews={data.entityReviews}
          type="Court"
        />
      </div>
    </Suspense>
  );
};
