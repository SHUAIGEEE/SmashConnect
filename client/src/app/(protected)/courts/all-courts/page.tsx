import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import { getClient } from "@/lib/nextApolloClient";
import Court from "@/types/court";
import { gql } from "@apollo/client";
import { columns } from "./columns";
import { DataTable } from "./data-table";

const getAllCourts = async () => {
  const query = gql`
    query GET_ALL_COURTS {
      courts {
        _id
        name
        address
        location {
          coordinates
        }
        googlePlaceId
        phoneNumber
        openingHours
        googleMapsUri
        websiteUri
        averageRating
        userRatingsTotal
      }
    }
  `;

  try {
    const { data } = await getClient().query({ query });

    return data.courts;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Court Locator", link: "/courts" },
  { title: "All Courts", link: "/courts" }
];

export default async function AllCourts() {
  const courts: Court[] = await getAllCourts();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="All Courts"
          description="Explore more courts by changing your location and discovering new places to play."
        />
      </div>

      <Separator />
      <ScrollArea className="h-full w-full">
        {courts && <DataTable columns={columns} data={courts} />}
      </ScrollArea>
    </div>
  );
}
