import { NextResponse } from "next/server";
import { createSpot, getAreaById } from "@/lib/data";
import { validateSpot } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const error = validateSpot(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const input = body as { name: string; areaId: number; type: "library" | "cafe" | "coworking" | "other"; address: string; openingHours: string; coffeePrice?: number | null };
  if (!(await getAreaById(input.areaId))) return NextResponse.json({ error: "Area not found" }, { status: 400 });
  const spot = await createSpot({ ...input, coffeePrice: input.coffeePrice ?? null });
  if (!spot) return NextResponse.json({ error: "A spot with that name already exists, or its slug is invalid." }, { status: 400 });
  return NextResponse.json(spot, { status: 201 });
}
