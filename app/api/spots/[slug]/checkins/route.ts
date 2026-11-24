import { NextResponse } from "next/server";
import { createCheckIn, getSpotBySlug } from "@/lib/data";
import { validateCheckIn } from "@/lib/validation";

type Context = { params: Promise<{ slug: string }> };

export async function POST(request: Request, { params }: Context) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const error = validateCheckIn(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const spot = await getSpotBySlug(slug);
  if (!spot) return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  const checkIn = await createCheckIn(spot.id, (body as { crowd: "quiet" | "busy" | "full" }).crowd);
  return NextResponse.json(checkIn, { status: 201 });
}
