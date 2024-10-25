"use client";
import { useMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useState } from "react";
import CourtDialog from "@/components/courts/court-dialog";
import Court from "@/types/court";

export const CourtMarkers = ({ courts }: { courts: Court[] }) => {
  const map = useMap();
  const [open, setOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<Court | null>(null);

  const handleClickPin = (ev: google.maps.MapMouseEvent, court: Court) => {
    if (!map) return;
    if (!ev.latLng) return;
    console.log("marker clicked:", ev.latLng.toString());
    console.log("court:", court);
    map.panTo(ev.latLng);
    setSelectedCourt(court);
    setOpen(true);
  };

  return (
    <>
      {selectedCourt && (
        <CourtDialog open={open} setOpen={setOpen} court={selectedCourt} />
      )}
      {courts.map((court) => (
        <AdvancedMarker
          key={court._id}
          position={{
            lat: court.location.coordinates[1],
            lng: court.location.coordinates[0]
          }}
          clickable={true}
          onClick={(ev) => handleClickPin(ev, court)}
        >
          <Pin />
        </AdvancedMarker>
      ))}
    </>
  );
};
