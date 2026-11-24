import Link from "next/link";
import type { Metadata } from "next";
import { searchSpots } from "@/lib/data";

export const metadata: Metadata = {
  title: "Search study spots | Study Spots Paris",
  description: "Search for places to study in Paris.",
};

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    type?: string;
  }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = "", type = "" } = await searchParams;
  const results = await searchSpots(q, type || undefined);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">Search study spots</h1>

      <form action="/search" className="mt-6 flex flex-wrap gap-3">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Search by name or address"
          className="min-w-64 rounded-md border border-stone-300 px-4 py-2"
        />

        <select
          name="type"
          defaultValue={type}
          className="rounded-md border border-stone-300 px-4 py-2"
        >
          <option value="">All types</option>
          <option value="library">Library</option>
          <option value="cafe">Café</option>
          <option value="coworking">Coworking</option>
          <option value="other">Other</option>
        </select>

        <button
          type="submit"
          className="rounded-md bg-stone-900 px-5 py-2 font-medium text-white"
        >
          Search
        </button>
      </form>

      <p className="mt-6 text-stone-600">
        {results.length} {results.length === 1 ? "spot" : "spots"} found
      </p>

      {results.length === 0 ? (
        <p className="mt-4 text-stone-600">No spots match your search.</p>
      ) : (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {results.map((spot) => (
            <li key={spot.id}>
              <Link
                href={`/spots/${spot.slug}`}
                className="block rounded-xl border border-stone-200 p-5 hover:border-stone-400"
              >
                <h2 className="font-semibold text-stone-900">{spot.name}</h2>
                <p className="mt-2 text-sm text-stone-600">{spot.address}</p>
                <p className="mt-2 text-sm capitalize text-stone-500">
                  {spot.type}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
