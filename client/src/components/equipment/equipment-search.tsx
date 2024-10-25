import {
  FilterType,
  defaultFilters
} from "@/components/equipment/search-equipment-panel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  equipmentPlayerStyles,
  equipmentSkillLevels,
  equipmentTypes,
  racquetBalances,
  racquetFlexibilities
} from "@/constants/data";
import { FilterX, Search } from "lucide-react";
import { useState } from "react";

interface RacquetFiltersProps {
  filters: FilterType;
  handleFilterChange: (field: any, value: any) => void;
}

const RacquetFilters = ({
  filters,
  handleFilterChange
}: RacquetFiltersProps) => {
  return (
    <>
      <div>
        <Label htmlFor="flexibility">Flexibility</Label>
        <Select
          value={filters.flexibility}
          onValueChange={(value) => handleFilterChange("flexibility", value)}
        >
          <SelectTrigger id="flexibility">
            <SelectValue placeholder="Select a flexibility" />
          </SelectTrigger>
          <SelectContent>
            {racquetFlexibilities.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="frame">Frame</Label>
        <Input
          id="frame"
          type="text"
          placeholder="e.g. tungsten"
          value={filters.frame}
          onChange={(e) => handleFilterChange("frame", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="shaft">Shaft</Label>
        <Input
          id="shaft"
          type="text"
          placeholder="e.g. pyrofil"
          value={filters.shaft}
          onChange={(e) => handleFilterChange("shaft", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="weightGrip">Weight grip</Label>
        <Input
          id="weightGrip"
          type="text"
          placeholder="e.g. 4U"
          value={filters.weightGrip}
          onChange={(e) => handleFilterChange("weightGrip", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="stringTension">String tension</Label>
        <Input
          id="stringTension"
          type="text"
          placeholder="e.g. 24"
          value={filters.stringTension}
          onChange={(e) => handleFilterChange("stringTension", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="balance">Balance</Label>
        <Select
          value={filters.balance}
          onValueChange={(value) => handleFilterChange("balance", value)}
        >
          <SelectTrigger id="balance">
            <SelectValue placeholder="Select a balance" />
          </SelectTrigger>
          <SelectContent>
            {racquetBalances.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

interface StringsFiltersProps {
  filters: FilterType;
  handleFilterChange: (field: any, value: any) => void;
}

const StringsFilters = ({
  filters,
  handleFilterChange
}: StringsFiltersProps) => {
  return (
    <>
      <div>
        <Label htmlFor="gauge">Gauge</Label>
        <Input
          id="gauge"
          type="text"
          placeholder="e.g. 1.25"
          value={filters.gauge}
          onChange={(e) => handleFilterChange("gauge", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="length">Length</Label>
        <Input
          id="length"
          type="text"
          placeholder="e.g. 200m"
          value={filters.length}
          onChange={(e) => handleFilterChange("length", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="coreMaterial">Core material</Label>
        <Input
          id="coreMaterial"
          type="text"
          placeholder="e.g. nylon"
          value={filters.coreMaterial}
          onChange={(e) => handleFilterChange("coreMaterial", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="outerMaterial">Outer material</Label>
        <Input
          id="outerMaterial"
          type="text"
          placeholder="e.g. fiber"
          value={filters.outerMaterial}
          onChange={(e) => handleFilterChange("outerMaterial", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="coating">Coating</Label>
        <Input
          id="coating"
          type="text"
          placeholder="e.g. elasticity"
          value={filters.coating}
          onChange={(e) => handleFilterChange("coating", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="durability">Durability</Label>
        <Input
          id="durability"
          type="number"
          placeholder="5"
          value={filters.durability}
          onChange={(e) =>
            handleFilterChange("durability", parseInt(e.target.value))
          }
        />
      </div>
      <div>
        <Label htmlFor="repulsionPower">Repulsion power</Label>
        <Input
          id="repulsionPower"
          type="number"
          placeholder="5"
          value={filters.repulsionPower}
          onChange={(e) =>
            handleFilterChange("repulsionPower", parseInt(e.target.value))
          }
        />
      </div>
      <div>
        <Label htmlFor="control">Control</Label>
        <Input
          id="control"
          type="number"
          placeholder="5"
          value={filters.control}
          onChange={(e) =>
            handleFilterChange("control", parseInt(e.target.value))
          }
        />
      </div>
      <div>
        <Label htmlFor="hittingSound">Hitting sound</Label>
        <Input
          id="hittingSound"
          type="number"
          placeholder="5"
          value={filters.hittingSound}
          onChange={(e) =>
            handleFilterChange("hittingSound", parseInt(e.target.value))
          }
        />
      </div>
    </>
  );
};

interface ShoesFiltersProps {
  filters: FilterType;
  handleFilterChange: (field: any, value: any) => void;
}

const ShoesFilters = ({ filters, handleFilterChange }: ShoesFiltersProps) => {
  return (
    <>
      <div>
        <Label htmlFor="upperMaterial">Upper material</Label>
        <Input
          id="upperMaterial"
          type="text"
          placeholder="e.g. fiber"
          value={filters.upperMaterial}
          onChange={(e) => handleFilterChange("upperMaterial", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="midsoleMaterial">Midsole material</Label>
        <Input
          id="midsoleMaterial"
          type="text"
          placeholder="e.g. resin"
          value={filters.midsoleMaterial}
          onChange={(e) =>
            handleFilterChange("midsoleMaterial", e.target.value)
          }
        />
      </div>
      <div>
        <Label htmlFor="outsoleMaterial">Outsole material</Label>
        <Input
          id="outsoleMaterial"
          type="text"
          placeholder="e.g. rubber"
          value={filters.outsoleMaterial}
          onChange={(e) =>
            handleFilterChange("outsoleMaterial", e.target.value)
          }
        />
      </div>
      <div>
        <Label htmlFor="technology">Technology</Label>
        <Input
          id="technology"
          type="text"
          placeholder="e.g. power cushion"
          value={filters.technology}
          onChange={(e) => handleFilterChange("technology", e.target.value)}
        />
      </div>
    </>
  );
};

interface EquipmentSearchProps {
  onSearch: (filters: FilterType) => void;
}

export default function EquipmentSearch({ onSearch }: EquipmentSearchProps) {
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterType>(defaultFilters);

  const handleFilterChange = (field: any, value: any) => {
    console.log("Field: ", field, "Value: ", value);
    setFilters({ ...filters, [field]: value });
  };

  const handleResetFilters = () => {
    setFilters(defaultFilters);
    toast({
      title: "Filters cleared",
      description: "All filters have been reset"
    });
  };

  const handleClickSearch = () => {
    console.log("Search with filters: ", filters);
    onSearch(filters);
  };

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-1 items-end gap-x-8 gap-y-4 rounded-xl border px-6 py-4 sm:grid-cols-2 md:grid-cols-3">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="e.g. 100zz"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
        </div>
        <div>
          <Select
            value={filters.type}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <Label htmlFor="type">Type</Label>
            <SelectTrigger id="type">
              <SelectValue placeholder="Select an equipment type" />
            </SelectTrigger>
            <SelectContent>
              {equipmentTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            type="text"
            placeholder="e.g. Yonex"
            value={filters.brand}
            onChange={(e) => handleFilterChange("brand", e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="priceFrom">Price from</Label>
          <Input
            id="priceFrom"
            type="number"
            placeholder="10"
            value={filters.priceFrom}
            onChange={(e) =>
              handleFilterChange("priceFrom", parseInt(e.target.value))
            }
          />
        </div>
        <div>
          <Label htmlFor="priceTo">Price to</Label>
          <Input
            id="priceTo"
            type="number"
            placeholder="500"
            value={filters.priceTo}
            onChange={(e) =>
              handleFilterChange("priceTo", parseInt(e.target.value))
            }
          />
        </div>
        <div>
          <Select
            value={filters.playerStyle}
            onValueChange={(value) => handleFilterChange("playerStyle", value)}
          >
            <Label htmlFor="playerStyle">Player style</Label>
            <SelectTrigger id="playerStyle">
              <SelectValue placeholder="Select an player style" />
            </SelectTrigger>
            <SelectContent>
              {equipmentPlayerStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={filters.playerLevel}
            onValueChange={(value) => handleFilterChange("playerLevel", value)}
          >
            <Label htmlFor="playerLevel">Player level</Label>
            <SelectTrigger id="playerLevel">
              <SelectValue placeholder="Select an player level" />
            </SelectTrigger>
            <SelectContent>
              {equipmentSkillLevels.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {filters.type === "racquets" && (
          <RacquetFilters
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        )}
        {filters.type === "strings" && (
          <StringsFilters
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        )}
        {filters.type === "shoes" && (
          <ShoesFilters
            filters={filters}
            handleFilterChange={handleFilterChange}
          />
        )}
      </div>
      <div className="space-x-1 justify-self-end">
        <Button variant="destructive" onClick={handleResetFilters}>
          <FilterX className="mr-2 h-4 w-4" /> Clear Filter
        </Button>
        <Button variant="secondary" onClick={handleClickSearch}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
    </div>
  );
}
