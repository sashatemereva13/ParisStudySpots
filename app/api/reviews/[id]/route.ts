import { NextResponse } from "next/server";
import { deleteReview, updateReview } from "@/lib/data";
import { validateReview } from "@/lib/validation";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Context) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  const token = request.headers.get("x-edit-token");
  if (!token) return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  const body = await request.json().catch(() => null);
  const error = validateReview(body);
  if (error) return NextResponse.json({ error }, { status: 400 });
  const review = await updateReview(id, token, body);
  if (!review) return NextResponse.json({ error: "Review not found or edit token is incorrect" }, { status: 403 });
  const publicReview = { id: review.id, spotId: review.spotId, nickname: review.nickname, wifi: review.wifi, outlets: review.outlets, noise: review.noise, comfort: review.comfort, comment: review.comment, createdAt: review.createdAt, updatedAt: review.updatedAt };
  return NextResponse.json(publicReview);
}

export async function DELETE(request: Request, { params }: Context) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: "Review not found" }, { status: 404 });
  const token = request.headers.get("x-edit-token");
  if (!token) return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  const found = await deleteReview(id, token);
  if (!found) return NextResponse.json({ error: "Review not found or edit token is incorrect" }, { status: 403 });
  return NextResponse.json({ ok: true });
}
