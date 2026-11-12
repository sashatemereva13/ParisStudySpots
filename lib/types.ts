export type SpotType = "library" | "cafe" | "coworking" | "other";

export type Area = {
  id: number;
  slug: string;
  name: string;
};

export type Spot = {
  id: number;
  slug: string;
  name: string;
  areaId: number;
  type: SpotType;
  address: string;
  openingHours: string;
  coffeePrice: number | null;
};

export type Review = {
  id: number;
  spotId: number;
  nickname: string;
  wifi: number;
  outlets: number;
  noise: number;
  comfort: number;
  comment: string;
  editToken: string;
  createdAt: string;
  updatedAt: string;
};

export type CheckIn = {
  id: number;
  spotId: number;
  crowd: "quiet" | "busy" | "full";
  createdAt: string;
};
