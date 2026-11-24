"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Area, SpotType } from "@/lib/types";

export function NewSpotForm({ areas }: { areas: Area[] }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(null); setBusy(true);
    const form = new FormData(event.currentTarget);
    const rawPrice = String(form.get("coffeePrice") || "").trim();
    const body = { name: String(form.get("name") || ""), areaId: Number(form.get("areaId")), type: String(form.get("type")) as SpotType, address: String(form.get("address") || ""), openingHours: String(form.get("openingHours") || ""), coffeePrice: rawPrice ? Number(rawPrice) : null };
    try {
      const response = await fetch("/api/spots", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
      router.push(`/spots/${data.slug}`);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not suggest this spot."); }
    finally { setBusy(false); }
  }
  const field = "rounded-md border border-stone-300 px-3 py-2";
  return <form onSubmit={submit} className="mt-6 grid gap-4">
    <label className="grid gap-1">Name<input name="name" required minLength={2} maxLength={100} className={field} /></label>
    <label className="grid gap-1">Area<select name="areaId" required className={field}>{areas.map((area) => <option key={area.id} value={area.id}>{area.name}</option>)}</select></label>
    <label className="grid gap-1">Type<select name="type" className={field}><option value="library">Library</option><option value="cafe">Café</option><option value="coworking">Coworking</option><option value="other">Other</option></select></label>
    <label className="grid gap-1">Address<input name="address" required minLength={5} maxLength={200} className={field} /></label>
    <label className="grid gap-1">Opening hours<input name="openingHours" required maxLength={200} placeholder="For example, Mon–Fri 9:00–18:00" className={field} /></label>
    <label className="grid gap-1">Coffee price in euros (optional)<input name="coffeePrice" type="number" min="0" max="1000" step="0.1" className={field} /></label>
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
    <button disabled={busy} className="w-fit rounded-md bg-stone-900 px-5 py-3 font-medium text-white disabled:opacity-50">{busy ? "Submitting…" : "Suggest this spot"}</button>
  </form>;
}
