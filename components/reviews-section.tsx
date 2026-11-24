"use client";

import { useEffect, useState } from "react";
import type { PublicReview } from "@/lib/types";

type ReviewForm = Pick<PublicReview, "nickname" | "wifi" | "outlets" | "noise" | "comfort" | "comment">;
const emptyForm: ReviewForm = { nickname: "", wifi: 3, outlets: 3, noise: 3, comfort: 3, comment: "" };

async function responseError(response: Response) {
  const data = await response.json().catch(() => null);
  return data?.error || `Request failed (${response.status})`;
}

export function ReviewsSection({ slug }: { slug: string }) {
  const [reviews, setReviews] = useState<PublicReview[] | null>(null);
  const [form, setForm] = useState<ReviewForm>(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const getTokens = () => JSON.parse(localStorage.getItem("study-spot-review-tokens") || "{}") as Record<string, string>;

  useEffect(() => {
    let active = true;
    fetch(`/api/spots/${slug}/reviews`)
      .then(async (response) => {
        if (!response.ok) throw new Error(await responseError(response));
        return response.json() as Promise<PublicReview[]>;
      })
      .then((items) => { if (active) setReviews(items); })
      .catch((err: Error) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [slug]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError(null); setNotice(null);
    try {
      const response = await fetch(`/api/spots/${slug}/reviews`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!response.ok) throw new Error(await responseError(response));
      const data: { review: PublicReview; editToken: string } = await response.json();
      const next = { ...getTokens(), [data.review.id]: data.editToken };
      localStorage.setItem("study-spot-review-tokens", JSON.stringify(next));
      setReviews((current) => [data.review, ...(current || [])]); setForm(emptyForm); setNotice("Your review was added.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not submit your review."); }
    finally { setBusy(false); }
  }

  async function edit(review: PublicReview) {
    const token = getTokens()[review.id];
    if (!token) return;
    const nickname = window.prompt("Nickname", review.nickname); if (nickname === null) return;
    const comment = window.prompt("Comment", review.comment); if (comment === null) return;
    setBusy(true); setError(null); setNotice(null);
    try {
      const response = await fetch(`/api/reviews/${review.id}`, { method: "PATCH", headers: { "Content-Type": "application/json", "x-edit-token": token }, body: JSON.stringify({ ...review, nickname, comment }) });
      if (!response.ok) throw new Error(await responseError(response));
      const updated: PublicReview = await response.json();
      setReviews((current) => current?.map((item) => item.id === updated.id ? updated : item) ?? null); setNotice("Your review was updated.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not update your review."); }
    finally { setBusy(false); }
  }

  async function remove(review: PublicReview) {
    const token = getTokens()[review.id];
    if (!token || !window.confirm("Delete your review?")) return;
    setBusy(true); setError(null); setNotice(null);
    try {
      const response = await fetch(`/api/reviews/${review.id}`, { method: "DELETE", headers: { "x-edit-token": token } });
      if (!response.ok) throw new Error(await responseError(response));
      const next = getTokens(); delete next[review.id]; localStorage.setItem("study-spot-review-tokens", JSON.stringify(next));
      setReviews((current) => current?.filter((item) => item.id !== review.id) ?? null); setNotice("Your review was deleted.");
    } catch (err) { setError(err instanceof Error ? err.message : "Could not delete your review."); }
    finally { setBusy(false); }
  }

  return <section className="mt-10">
    <h2 className="text-xl font-semibold text-stone-900">Student reviews</h2>
    {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    {notice && <p role="status" className="mt-3 text-sm text-green-800">{notice}</p>}
    {reviews === null ? <p className="mt-3 text-stone-600">Loading reviews…</p> : reviews.length === 0 ? <p className="mt-3 text-stone-600">No reviews yet.</p> : <ul className="mt-4 space-y-4">{reviews.map((review) => <li key={review.id} className="rounded-xl border border-stone-200 p-5">
      <p className="font-medium text-stone-900">{review.nickname}</p><p className="mt-2 text-sm text-stone-600">Wi-Fi: {review.wifi}/5 · Outlets: {review.outlets}/5 · Noise: {review.noise}/5 · Comfort: {review.comfort}/5</p><p className="mt-3 text-stone-700">{review.comment}</p>
      {getTokens()[review.id] && <div className="mt-3 flex gap-3"><button disabled={busy} onClick={() => edit(review)} className="text-sm underline">Edit</button><button disabled={busy} onClick={() => remove(review)} className="text-sm text-red-700 underline">Delete</button></div>}
    </li>)}</ul>}
    <form onSubmit={submit} className="mt-6 grid gap-3 rounded-xl border border-stone-200 p-5">
      <h3 className="font-semibold">Add a review</h3>
      <label className="grid gap-1 text-sm">Nickname<input required maxLength={40} value={form.nickname} onChange={(e) => setForm({ ...form, nickname: e.target.value })} className="rounded border p-2" /></label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{(["wifi", "outlets", "noise", "comfort"] as const).map((key) => <label key={key} className="grid gap-1 text-sm capitalize">{key}<select value={form[key]} onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })} className="rounded border p-2">{[1,2,3,4,5].map((n) => <option key={n} value={n}>{n}/5</option>)}</select></label>)}</div>
      <label className="grid gap-1 text-sm">Comment<textarea maxLength={500} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} className="rounded border p-2" rows={3} /></label>
      <button disabled={busy} className="w-fit rounded bg-stone-900 px-4 py-2 text-white disabled:opacity-50">{busy ? "Sending…" : "Submit review"}</button>
    </form>
  </section>;
}
