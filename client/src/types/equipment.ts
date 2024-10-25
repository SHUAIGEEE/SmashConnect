export default interface Equipment {
  _id: string;
  name: string;
  type: "racquets" | "strings" | "shoes";
  brand: string;
  price: number;
  picture: string;
  link: string;
  flexibility:
    | "default"
    | "extra-stiff"
    | "stiff"
    | "medium"
    | "flexible"
    | "extra-flexible";
  frame: string;
  shaft: string;
  weightGrip: string;
  stringTension: string;
  balance:
    | "default"
    | "extra-head-heavy"
    | "head-heavy"
    | "even-balance"
    | "head-light"
    | "extra-head-light";
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
  colors: string[];
  playerStyle:
    | "default"
    | "aggressive"
    | "defensive"
    | "balanced"
    | "all-suite";
  playerLevel:
    | "default"
    | "beginner"
    | "intermediate"
    | "advanced"
    | "all-suite";
  averageRating: number;
  userRatingsTotal: number;
  createdAt: string;
  updatedAt: string;
}
