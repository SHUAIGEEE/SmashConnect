"use client";
import StarRating from "@/components/reviews/star-rating";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  equipmentPlayerStyles,
  equipmentSkillLevels,
  equipmentTypes,
  racquetBalances,
  racquetFlexibilities
} from "@/constants/data";
import Equipment from "@/types/equipment";
import Image from "next/image";
import Link from "next/link";

interface EquipmentDetailsPanelProps {
  equipment: Equipment;
}

const RacquetSpecs = (equipment: Equipment) => {
  return (
    <Table className="text-left">
      <TableCaption>Racquet Specs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Characteristics</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Flexibility</TableCell>
          <TableCell>
            {
              racquetFlexibilities.find(
                (flexibility) => flexibility.value === equipment.flexibility
              )?.label
            }
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Frame</TableCell>
          <TableCell>{equipment.frame}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Shaft</TableCell>
          <TableCell>{equipment.shaft}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Weight / Grip</TableCell>
          <TableCell>{equipment.weightGrip}g</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">String Tension</TableCell>
          <TableCell>{equipment.stringTension}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Balance</TableCell>
          <TableCell>
            {
              racquetBalances.find(
                (balance) => balance.value === equipment.balance
              )?.label
            }
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Colors</TableCell>
          <TableCell>
            {equipment.colors.map((color, index) => (
              <p className="pb-1" key={index}>
                {color}
              </p>
            ))}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Player Style</TableCell>
          <TableCell>
            {
              equipmentPlayerStyles.find(
                (style) => style.value === equipment.playerStyle
              )?.label
            }
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Player Level</TableCell>
          <TableCell>
            {
              equipmentSkillLevels.find(
                (level) => level.value === equipment.playerLevel
              )?.label
            }
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const StringSpecs = (equipment: Equipment) => {
  return (
    <Table className="text-left">
      <TableCaption>String Specs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Characteristics</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Gauge</TableCell>
          <TableCell>{equipment.gauge}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Length</TableCell>
          <TableCell>{equipment.length}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Core Material</TableCell>
          <TableCell>{equipment.coreMaterial}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Outer Material</TableCell>
          <TableCell>{equipment.outerMaterial}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Coating</TableCell>
          <TableCell>{equipment.coating}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Durability</TableCell>
          <TableCell>{equipment.durability}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Repulsion Power</TableCell>
          <TableCell>{equipment.repulsionPower}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Control</TableCell>
          <TableCell>{equipment.control}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Hitting Sound</TableCell>
          <TableCell>{equipment.hittingSound}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Colors</TableCell>
          <TableCell>
            {equipment.colors.map((color, index) => (
              <p className="pb-1" key={index}>
                {color}
              </p>
            ))}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Player Style</TableCell>
          <TableCell>
            {
              equipmentPlayerStyles.find(
                (style) => style.value === equipment.playerStyle
              )?.label
            }
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Player Level</TableCell>
          <TableCell>
            {
              equipmentSkillLevels.find(
                (level) => level.value === equipment.playerLevel
              )?.label
            }
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

const ShoeSpecs = (equipment: Equipment) => {
  return (
    <Table className="text-left">
      <TableCaption>Shoe Specs.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Characteristics</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">Upper Material</TableCell>
          <TableCell>{equipment.upperMaterial}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Midsole Material</TableCell>
          <TableCell>{equipment.midsoleMaterial}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Outsole Material</TableCell>
          <TableCell>{equipment.outsoleMaterial}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Technology</TableCell>
          <TableCell>{equipment.technology}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">Colors</TableCell>
          <TableCell>
            {equipment.colors.map((color, index) => (
              <p className="pb-1" key={index}>
                {color}
              </p>
            ))}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default function EquipmentDetailsPanel({
  equipment
}: EquipmentDetailsPanelProps) {
  return (
    <>
      <div className="grid items-start gap-4 md:gap-10">
        <div className="items-start md:flex">
          <div className="grid gap-4">
            <Link
              className="text-3xl font-bold underline lg:text-4xl"
              href={equipment.link}
            >
              {equipment.name}
            </Link>
            <div>
              <p>
                {equipment.brand} -{" "}
                {
                  equipmentTypes.find((type) => type.value === equipment.type)
                    ?.label
                }
              </p>
            </div>
            <div className="flex items-center gap-4">
              <StarRating rating={equipment.averageRating} />
              <span className="text-lg font-medium">
                {equipment.averageRating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({equipment.userRatingsTotal})
              </span>
            </div>
            {equipment.price && (
              <div className="text-4xl font-bold">
                RM{equipment.price.toFixed(2)}
              </div>
            )}

            <Separator />

            <div className="grid space-y-2">
              <h3 className="text-xl font-bold">Description</h3>
              {equipment.type === "racquets" && <RacquetSpecs {...equipment} />}
              {equipment.type === "strings" && <StringSpecs {...equipment} />}
              {equipment.type === "shoes" && <ShoeSpecs {...equipment} />}
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Image
          src={
            equipment.picture
              ? `${process.env.NEXT_PUBLIC_API_URL}/${equipment.picture}`
              : ""
          }
          alt={equipment.name}
          width={600}
          height={600}
          className={
            "portrait h-auto w-auto object-cover transition-all hover:scale-105"
          }
        />
      </div>
    </>
  );
}
