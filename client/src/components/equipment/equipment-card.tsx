"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Equipment from "@/types/equipment";
import { useRouter } from "next/navigation";

interface EquipmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  equipment: Equipment;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
}

export function EquipmentCard({
  equipment,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: EquipmentCardProps) {
  const router = useRouter();

  // Navigate to equipment details page
  const handleClick = () => {
    router.push(`/equipment/${equipment._id}`);
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div className="overflow-hidden rounded-md">
        <span>
          <Image
            src={
              equipment.picture
                ? `${process.env.NEXT_PUBLIC_API_URL}/${equipment.picture}`
                : ""
            }
            alt={equipment.name}
            width={width}
            height={height}
            className={cn(
              "h-auto w-auto object-cover transition-all hover:scale-105 hover:cursor-pointer",
              aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square"
            )}
            onClick={handleClick}
          />
        </span>
      </div>
      <div className="space-y-1 text-sm">
        <h3 className="font-medium leading-none">{equipment.name}</h3>
        <p className="text-xs text-muted-foreground">{equipment.brand}</p>
      </div>
    </div>
  );
}
