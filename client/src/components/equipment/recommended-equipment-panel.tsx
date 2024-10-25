"use client";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Equipment from "@/types/equipment";
import { ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface RecommendedEquipmentPanelProps {
  suitableRacquets: Equipment[];
  suitableStrings: Equipment[];
}

export default function RecommendedEquipmentPanel({
  suitableStrings,
  suitableRacquets
}: RecommendedEquipmentPanelProps) {
  const [randomSuitableEquipment, setRandomSuitableEquipment] = useState<
    Equipment[]
  >([]);

  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  useEffect(() => {
    if (suitableRacquets && suitableStrings) {
      // Combine and shuffle suitable racquets and strings
      const combined = [...suitableRacquets, ...suitableStrings];
      combined.sort(() => Math.random() - 0.5); // Shuffle the combined array

      // Ensure there are always some strings in the result
      const selectedStrings = combined.filter((item) =>
        suitableStrings.includes(item)
      );
      const selectedRacquets = combined.filter((item) =>
        suitableRacquets.includes(item)
      );

      let result = selectedStrings.slice(
        0,
        Math.min(5, selectedStrings.length)
      );
      result = result.concat(selectedRacquets.slice(0, 20 - result.length));

      result.sort(() => Math.random() - 0.5); // Shuffle the result array

      setRandomSuitableEquipment(result);
    }
  }, [suitableRacquets, suitableStrings]);

  return (
    <>
      <div
        className="flex cursor-pointer items-center justify-between"
        onClick={toggleExpansion}
      >
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            Recommended Equipment
          </h2>
          <p className="text-sm text-muted-foreground">
            Top picks for you. Suited for your skill level and playing style.
          </p>
        </div>
        <Button
          variant={isExpanded ? "ghost" : "outline"}
          size="icon"
          className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
        >
          <ChevronsUpDownIcon className="h-5 w-5" />
        </Button>
      </div>
      <Separator className="my-4" />
      {isExpanded && (
        <div className="relative">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {randomSuitableEquipment.map((equipment) => (
                <EquipmentCard
                  key={equipment.name}
                  equipment={equipment}
                  className="w-[250px]"
                  aspectRatio="portrait"
                  width={250}
                  height={330}
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </>
  );
}
