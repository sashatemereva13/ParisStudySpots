"use client";

import { useCallback, useEffect, useState } from "react";

type CrowdData = { level: "quiet" | "busy" | "full" | null; counts: Record<"quiet" | "busy" | "full", number>; total: number };

export function CrowdIndicator({ slug }: { slug: string }) {
  const [data, setData] = useState<CrowdData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const refresh = useCallback(async () => {
    const response = await fetch(`/api/spots/${slug}/crowd`);
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
    setData(body);
  }, [slug]);
  useEffect(() => {
    let active = true;
    const poll = () => refresh().catch((err: Error) => { if (active) setError(err.message); });
    poll(); const timer = setInterval(poll, 60_000);
    return () => { active = false; clearInterval(timer); };
  }, [refresh]);
  async function checkIn(crowd: "quiet" | "busy" | "full") {
    setBusy(true); setError(null);
    try {
      const response = await fetch(`/api/spots/${slug}/checkins`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ crowd }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
      await refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Could not check in."); }
    finally { setBusy(false); }
  }
  return <section className="mt-8 rounded-xl border border-stone-200 p-5">
    <h2 className="font-semibold text-stone-900">How busy is it right now?</h2>
    {data === null ? <p className="mt-2 text-stone-600">Loading crowd level…</p> : <p className="mt-2 text-stone-600">{data.level ? `${data.level} (${data.total} recent check-ins)` : "No recent check-ins yet."}</p>}
    {error && <p role="alert" className="mt-2 text-sm text-red-700">{error}</p>}
    <div className="mt-3 flex flex-wrap gap-2">{(["quiet", "busy", "full"] as const).map((level) => <button key={level} disabled={busy} onClick={() => checkIn(level)} className="rounded border border-stone-300 px-3 py-2 capitalize disabled:opacity-50">{busy ? "Sending…" : level}</button>)}</div>
  </section>;
}
