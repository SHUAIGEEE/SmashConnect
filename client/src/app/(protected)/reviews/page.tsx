import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import Review from "@/types/review";
import { gql } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getUserReviews = async () => {
  const query = gql`
    query GET_USER_REVIEWS {
      userReviews {
        _id
        rating
        comment
        reviewType
        entityName
        entityId
        createdAt
        updatedAt
      }
    }
  `;

  try {
    const { data } = await getClient().query({ query });

    return data.userReviews;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Reviews", link: "/reviews" }
];

export default async function Reviews() {
  const reviews: Review[] = await getUserReviews();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="My Reviews"
          description="See what you've shared with the community!"
        />
      </div>

      <Separator />

      <ScrollArea className="h-full w-full">
        {reviews && <DataTable columns={columns} data={reviews} />}
      </ScrollArea>
    </div>
  );
}
