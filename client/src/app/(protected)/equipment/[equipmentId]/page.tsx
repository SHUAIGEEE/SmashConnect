import { Breadcrumbs } from "@/components/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import EquipmentDetailsPanel from "@/components/equipment/equipment-details";
import { gql } from "@apollo/client";
import Equipment from "@/types/equipment";
import { getClient } from "@/lib/nextApolloClient";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import Review from "@/types/review";
import ReviewsPanel from "@/components/reviews/reviews-panel";

const getEquipmentDetailsAndReviews = async (id: string) => {
  const racquetSpecificFields = `
    flexibility
    frame
    shaft
    weightGrip
    stringTension
    balance
  `;

  const stringSpecificFields = `
    gauge
    length
    coreMaterial
    outerMaterial
    coating
    durability
    repulsionPower
    control
    hittingSound
  `;

  const shoeSpecificFields = `
    upperMaterial
    midsoleMaterial
    outsoleMaterial
    technology
  `;

  const query = gql`
    query GET_EQUIPMENT_DETAILS_AND_REVIEWS($id: ID!, $reviewType: String!) {
      equipment(id: $id) {
        _id
        name
        type
        brand
        picture
        link

        ${racquetSpecificFields}
        ${stringSpecificFields}
        ${shoeSpecificFields}

        colors
        playerStyle
        playerLevel
        averageRating
        userRatingsTotal
      }
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

  try {
    const { data } = await getClient().query({
      query,
      variables: { id, reviewType: "Equipment" }
    });

    return data;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Equipment Hub", link: "/equipment" },
  { title: "Equipment Details", link: "/equipment" }
];

type EquipmentData = {
  equipment: Equipment;
  entityReviews: Review[];
};

export default async function EquipmentDetails({
  params
}: {
  params: { equipmentId: string };
}) {
  const data: EquipmentData = await getEquipmentDetailsAndReviews(
    params.equipmentId
  );

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Equipment Details"
          description="Discover, review, and share your experience with badminton gear!"
        />
      </div>

      <Separator />

      <div className="mx-auto grid max-w-6xl items-start gap-6 px-4 py-6 md:grid-cols-2 lg:gap-12">
        <EquipmentDetailsPanel equipment={data?.equipment} />
        <ReviewsPanel
          entityId={params.equipmentId}
          reviews={data?.entityReviews}
          type="Equipment"
        />
      </div>
    </div>
  );
}
