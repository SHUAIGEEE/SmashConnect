import { Breadcrumbs } from "@/components/breadcrumbs";
import RecommendedEquipmentPanel from "@/components/equipment/recommended-equipment-panel";
import SearchEquipmentPanel from "@/components/equipment/search-equipment-panel";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { getClient } from "@/lib/nextApolloClient";
import logoutIfTokenInvalid from "@/lib/logoutIfTokenInvalid";
import Equipment from "@/types/equipment";
import { gql } from "@apollo/client";

const getEquipmentHubData = async () => {
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
    query GET_EQUIPMENT_HUB {
      equipments {
        _id
        name
        type
        brand
        picture

        ${racquetSpecificFields}
        ${stringSpecificFields}
        ${shoeSpecificFields}

        colors
        playerStyle
        playerLevel
      }
      suitableRacquets {
        _id
        name
        brand
        picture
      }
      suitableStrings {
        _id
        name
        brand
        picture
      }
    }
  `;

  try {
    const { data } = await getClient().query({ query });

    return data;
  } catch (error) {
    logoutIfTokenInvalid(error);
  }
  return null;
};

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Equipment Hub", link: "/equipment" }
];

type EquipmentHubData = {
  equipments: Equipment[];
  suitableRacquets: Equipment[];
  suitableStrings: Equipment[];
};

export default async function EquipmentHub() {
  const data: EquipmentHubData = await getEquipmentHubData();

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Equipment Hub"
          description="Explore and review badminton equipment!"
        />
      </div>

      <Separator />

      <RecommendedEquipmentPanel
        suitableRacquets={data?.suitableRacquets}
        suitableStrings={data?.suitableStrings}
      />

      <SearchEquipmentPanel equipments={data?.equipments} />
    </div>
  );
}
