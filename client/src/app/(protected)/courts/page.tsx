"use client";
import { getNearbyCourts } from "@/actions/courts/getNearbyCourts";
import { Breadcrumbs } from "@/components/breadcrumbs";
import NavigationButton from "@/components/buttons/navigation-button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import Court from "@/types/court";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { MapPinned } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CourtMarkers } from "./CourtMarkers";

const breadcrumbItems = [
  { title: "Dashboard", link: "/dashboard" },
  { title: "Court Locator", link: "/courts" }
];

type SelectedLocation = {
  lat: number;
  lng: number;
};

export default function CourtLocator() {
  const { toast } = useToast();
  const { data: session } = useSession();

  const location = session?.user?.location;
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const [courts, setCourts] = useState<Court[]>([]);

  console.log("Selected location:", selectedLocation);
  console.log("Courts:", courts);

  const isDefaultLocation =
    selectedLocation?.lat === 0 && selectedLocation?.lng === 0;

  useEffect(() => {
    // Function to handle success of geolocation request
    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      setSelectedLocation({ lat: latitude, lng: longitude });
    };

    // Function to handle error of geolocation request
    const handleError = (error: GeolocationPositionError) => {
      toast({
        variant: "destructive",
        title: "Error getting geolocation. Using saved location.",
        description: error.message
      });
      setSelectedLocation({
        lat: location?.coordinates[1] ?? 0,
        lng: location?.coordinates[0] ?? 0
      });
    };

    // Ask for user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      toast({
        variant: "destructive",
        title: "Error getting geolocation",
        description: "Geolocation is not supported by your browser."
      });
      setSelectedLocation({
        lat: location?.coordinates[1] ?? 0,
        lng: location?.coordinates[0] ?? 0
      });
    }
  }, []);

  // Fetch nearby courts based on location
  const handleGetNearbyCourts = async () => {
    if (selectedLocation) {
      const result = await getNearbyCourts({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        radius: 5000
      });
      if (result?.error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error
        });
      } else {
        setCourts(result?.courts);
        console.log("Nearby courts:", result?.courts);
      }
    }
  };

  useEffect(() => {
    handleGetNearbyCourts();
  }, [selectedLocation]);

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="flex items-start justify-between">
        <Heading
          title="Court Locator"
          description="Explore and review nearby badminton courts!"
        />
        <NavigationButton link="/courts/all-courts" variant="secondary">
          <MapPinned className="mr-2 h-4 w-4" />
          All Courts
        </NavigationButton>
      </div>

      <Separator />

      {selectedLocation && !isDefaultLocation ? (
        <APIProvider
          apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}
          onLoad={() => console.log("Maps API has loaded.")}
        >
          <Map
            style={{ width: "fullWidth", height: "100vh" }}
            defaultCenter={{
              lat: selectedLocation.lat,
              lng: selectedLocation.lng
            }}
            defaultZoom={13}
            minZoom={12}
            mapId={"7016da22acbb5540"}
            gestureHandling={"cooperative"}
          >
            <CourtMarkers courts={courts} />
          </Map>
        </APIProvider>
      ) : (
        <div className="flex h-96 w-full items-center justify-center">
          <p className="text-muted-foreground">
            No courts found. Try allow the location access or{" "}
            <Link href={"/profile/edit"} className="cursor-pointer underline">
              update your location
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
