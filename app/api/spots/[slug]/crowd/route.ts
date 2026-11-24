import { NextResponse } from "next/server";
import { getCrowd, getSpotBySlug } from "@/lib/data";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Context) {
  const spot = await getSpotBySlug((await params).slug);
  if (!spot) return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  return NextResponse.json(await getCrowd(spot.id));
}
