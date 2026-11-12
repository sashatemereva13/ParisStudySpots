import Link from "next/link";
import { getSpots } from "@/lib/data";

export default async function SpotsPage() {
  const spots = await getSpots();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">
        Study spots in Paris
      </h1>
      <p className="mt-3 text-stone-600">
        Browse libraries, cafés, and coworking spaces where you can study.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {spots.map((spot) => (
          <li key={spot.id}>
            <Link
              href={`/spots/${spot.slug}`}
              className="block rounded-xl border border-stone-200 p-5 hover:border-stone-400"
            >
              <h2 className="text-lg font-semibold text-stone-900">
                {spot.name}
              </h2>
              <p className="mt-2 text-sm text-stone-600">{spot.address}</p>
              <p className="mt-2 text-sm capitalize text-stone-500">
                {spot.type}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
