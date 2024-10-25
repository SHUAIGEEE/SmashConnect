"use client";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import EquipmentSearch from "@/components/equipment/equipment-search";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Equipment from "@/types/equipment";
import { ChevronsUpDownIcon, Filter } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

export type FilterType = {
  name: string;
  type: string;
  brand: string;
  priceFrom: number;
  priceTo: number;
  playerStyle: string;
  playerLevel: string;
  flexibility: string;
  frame: string;
  shaft: string;
  weightGrip: string;
  stringTension: string;
  balance: string;
  gauge: string;
  length: string;
  coreMaterial: string;
  outerMaterial: string;
  coating: string;
  durability: number;
  repulsionPower: number;
  control: number;
  hittingSound: number;
  upperMaterial: string;
  midsoleMaterial: string;
  outsoleMaterial: string;
  technology: string;
};

export const defaultFilters: FilterType = {
  name: "",
  type: "",
  brand: "",
  priceFrom: -1,
  priceTo: 1000,
  playerStyle: "",
  playerLevel: "",
  flexibility: "",
  frame: "",
  shaft: "",
  weightGrip: "",
  stringTension: "",
  balance: "",
  gauge: "",
  length: "",
  coreMaterial: "",
  outerMaterial: "",
  coating: "",
  durability: -1,
  repulsionPower: -1,
  control: -1,
  hittingSound: -1,
  upperMaterial: "",
  midsoleMaterial: "",
  outsoleMaterial: "",
  technology: ""
};

interface SearchEquipmentPanelProps {
  equipments: Equipment[];
}

export default function SearchEquipmentPanel({
  equipments
}: SearchEquipmentPanelProps) {
  const { toast } = useToast();

  const [filteredEquipment, setFilteredEquipment] =
    useState<Equipment[]>(equipments);

  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (filters: FilterType) => {
    const allEquipment = [...equipments];
    const result = allEquipment.filter((item) => {
      return (
        // General filters
        (filters.name === "" ||
          item.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.type === "" || item.type === filters.type) &&
        (filters.brand === "" ||
          item.brand.toLowerCase().includes(filters.brand.toLowerCase())) &&
        (filters.priceFrom === -1 || item.price >= filters.priceFrom) &&
        (filters.priceTo === 1000 || item.price <= filters.priceTo) &&
        (filters.playerStyle === "" ||
          item.playerStyle === filters.playerStyle) &&
        (filters.playerLevel === "" ||
          item.playerLevel === filters.playerLevel) &&
        // Racquet filters
        (filters.flexibility === "" ||
          item.flexibility === filters.flexibility) &&
        (filters.frame === "" ||
          item.frame.toLowerCase().includes(filters.frame.toLowerCase())) &&
        (filters.shaft === "" ||
          item.shaft.toLowerCase().includes(filters.shaft.toLowerCase())) &&
        (filters.weightGrip === "" ||
          item.weightGrip.includes(filters.weightGrip)) &&
        (filters.stringTension === "" ||
          item.stringTension.includes(filters.stringTension)) &&
        (filters.balance === "" || item.balance === filters.balance) &&
        // String filters
        (filters.gauge === "" ||
          item.gauge.toLowerCase().includes(filters.gauge.toLowerCase())) &&
        (filters.length === "" ||
          item.length.toLowerCase().includes(filters.length.toLowerCase())) &&
        (filters.coreMaterial === "" ||
          item.coreMaterial
            .toLowerCase()
            .includes(filters.coreMaterial.toLowerCase())) &&
        (filters.outerMaterial === "" ||
          item.outerMaterial
            .toLowerCase()
            .includes(filters.outerMaterial.toLowerCase())) &&
        (filters.coating === "" ||
          item.coating.toLowerCase().includes(filters.coating.toLowerCase())) &&
        (filters.durability === -1 || item.durability === filters.durability) &&
        (filters.repulsionPower === -1 ||
          item.repulsionPower === filters.repulsionPower) &&
        (filters.control === -1 || item.control === filters.control) &&
        (filters.hittingSound === -1 ||
          item.hittingSound === filters.hittingSound) &&
        // Shoe filters
        (filters.upperMaterial === "" ||
          item.upperMaterial
            .toLowerCase()
            .includes(filters.upperMaterial.toLowerCase())) &&
        (filters.midsoleMaterial === "" ||
          item.midsoleMaterial
            .toLowerCase()
            .includes(filters.midsoleMaterial.toLowerCase())) &&
        (filters.outsoleMaterial === "" ||
          item.outsoleMaterial
            .toLowerCase()
            .includes(filters.outsoleMaterial.toLowerCase())) &&
        (filters.technology === "" ||
          item.technology
            .toLowerCase()
            .includes(filters.technology.toLowerCase()))
      );
    });
    setFilteredEquipment(result);
    toast({
      title: "Search completed",
      description: `Found ${result.length} equipment`
    });
  };

  const toggleExpansion = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      <div className="mt-3 space-y-1">
        <h2 className="text-xl font-semibold tracking-tight">
          Filter and Search
        </h2>
        <p className="text-sm text-muted-foreground">
          Narrow down your choices to find exactly what you need
        </p>
      </div>

      <Separator className="my-4" />

      <div className="space-y-4">
        <div
          className={`flex cursor-pointer items-center justify-between rounded-xl border px-6 pb-6 pt-4 ${
            isExpanded
              ? "bg-primary text-primary-foreground"
              : "bg-card text-card-foreground"
          }`}
          onClick={toggleExpansion}
        >
          <h2 className="flex items-center text-lg font-bold">
            <Filter className="mr-2 h-6 w-6" />
            Change Filter
          </h2>
          <Button
            variant={isExpanded ? "ghost" : "outline"}
            size="icon"
            className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
          >
            <ChevronsUpDownIcon className="h-5 w-5" />
          </Button>
        </div>
        {isExpanded && <EquipmentSearch onSearch={handleSearch} />}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Equipment:</h3>
            <Separator className="my-2" />
          </div>
        </div>
        <ScrollArea className="h-96 w-full rounded-md border">
          <div className="mt-2 grid grid-cols-2 justify-items-center gap-y-6 sm:grid-cols-4 md:grid-cols-4">
            {filteredEquipment.map((equipment) => (
              <EquipmentCard
                key={equipment._id}
                equipment={equipment}
                className="w-[150px]"
                aspectRatio="portrait"
                width={150}
                height={200}
              />
            ))}
          </div>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </>
  );
}
