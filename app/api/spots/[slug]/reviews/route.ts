import { NextResponse } from "next/server";
import { createReview, getPublicReviews, getSpotBySlug } from "@/lib/data";
import { validateReview } from "@/lib/validation";

type Context = { params: Promise<{ slug: string }> };

export async function GET(_request: Request, { params }: Context) {
  const { slug } = await params;
  const spot = await getSpotBySlug(slug);
  if (!spot) return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  return NextResponse.json(await getPublicReviews(spot.id));
}

export async function POST(request: Request, { params }: Context) {
  const { slug } = await params;
  const body = await request.json().catch(() => null);
  const error = validateReview(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const spot = await getSpotBySlug(slug);
  if (!spot) return NextResponse.json({ error: "Spot not found" }, { status: 404 });
  const review = await createReview({ ...(body as { nickname: string; wifi: number; outlets: number; noise: number; comfort: number; comment: string }), spotId: spot.id });
  const { editToken, ...publicReview } = review;
  return NextResponse.json({ review: publicReview, editToken }, { status: 201 });
}
