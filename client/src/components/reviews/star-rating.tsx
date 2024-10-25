import { Star } from "lucide-react";

export default function StarRating({ rating }: { rating: number }) {
  const getStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <Star key={`full-${index}`} className="h-5 w-5 fill-primary" />
        ))}
        {hasHalfStar && (
          <Star
            key="half"
            className="fill-primary-half stroke-primary-half h-5 w-5"
          />
        )}
        {[...Array(emptyStars)].map((_, index) => (
          <Star
            key={`empty-${index}`}
            className="h-5 w-5 fill-muted stroke-muted-foreground"
          />
        ))}
      </>
    );
  };

  return <div className="flex items-center gap-0.5">{getStars(rating)}</div>;
}
