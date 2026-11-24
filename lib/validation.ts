import type { SpotType } from "@/lib/types";

type ReviewInput = {
  nickname: string;
  wifi: number;
  outlets: number;
  noise: number;
  comfort: number;
  comment: string;
};

export function validateReview(value: unknown): string | null {
  if (!value || typeof value !== "object") return "A review is required.";
  const body = value as Partial<ReviewInput>;
  if (typeof body.nickname !== "string" || body.nickname.trim().length < 1 || body.nickname.trim().length > 40) return "Nickname must be 1–40 characters.";
  for (const key of ["wifi", "outlets", "noise", "comfort"] as const) {
    if (!Number.isInteger(body[key]) || body[key]! < 1 || body[key]! > 5) return `${key} must be an integer from 1 to 5.`;
  }
  if (typeof body.comment !== "string" || body.comment.trim().length > 500) return "Comment must be at most 500 characters.";
  return null;
}

export function validateSpot(value: unknown): string | null {
  if (!value || typeof value !== "object") return "A spot is required.";
  const body = value as Record<string, unknown>;
  if (typeof body.name !== "string" || body.name.trim().length < 2 || body.name.trim().length > 100) return "Name must be 2–100 characters.";
  if (typeof body.address !== "string" || body.address.trim().length < 5 || body.address.trim().length > 200) return "Address must be 5–200 characters.";
  if (typeof body.openingHours !== "string" || body.openingHours.trim().length < 1 || body.openingHours.trim().length > 200) return "Opening hours are required (up to 200 characters).";
  if (!Number.isInteger(body.areaId) || typeof body.areaId !== "number") return "Choose a valid area.";
  if (!["library", "cafe", "coworking", "other"].includes(body.type as SpotType)) return "Choose a valid spot type.";
  if (body.coffeePrice !== null && body.coffeePrice !== undefined && (typeof body.coffeePrice !== "number" || body.coffeePrice < 0 || body.coffeePrice > 1000)) return "Coffee price must be a nonnegative number.";
  return null;
}

export function validateCheckIn(value: unknown): string | null {
  if (!value || typeof value !== "object" || !["quiet", "busy", "full"].includes((value as { crowd?: string }).crowd ?? "")) return "Crowd must be quiet, busy, or full.";
  return null;
}
