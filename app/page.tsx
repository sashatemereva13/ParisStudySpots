import Link from "next/link";
import { getSpots } from "@/lib/data";

export default async function HomePage() {
  const featuredSpots = (await getSpots()).slice(0, 3);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <section className="rounded-2xl bg-stone-100 px-8 py-12 sm:px-12">
        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
          Study Spots Paris
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
          Find your next favorite place to study.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-stone-600">
          A student-made guide to libraries, cafés, and coworking spaces in
          Paris, with ratings for Wi-Fi, outlets, noise, and comfort.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/spots"
            className="rounded-md bg-stone-900 px-5 py-3 font-medium text-white hover:bg-stone-700"
          >
            Browse all spots
          </Link>
          <Link
            href="/search"
            className="rounded-md border border-stone-300 bg-white px-5 py-3 font-medium text-stone-900 hover:bg-stone-50"
          >
            Search
          </Link>
        </div>
      </section>

      <section className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-stone-900">
              Featured spots
            </h2>
            <p className="mt-2 text-stone-600">
              A few places to get you started.
            </p>
          </div>
          <Link
            href="/spots"
            className="text-sm font-medium text-stone-700 underline underline-offset-4"
          >
            View all
          </Link>
        </div>

        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {featuredSpots.map((spot) => (
            <li key={spot.id}>
              <Link
                href={`/spots/${spot.slug}`}
                className="block h-full rounded-xl border border-stone-200 p-5 hover:border-stone-400"
              >
                <p className="text-sm capitalize text-stone-500">{spot.type}</p>
                <h3 className="mt-2 font-semibold text-stone-900">
                  {spot.name}
                </h3>
                <p className="mt-2 text-sm text-stone-600">{spot.address}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-2xl font-bold text-stone-900">Suggest a spot</h2>
        <p className="mt-2 text-stone-600">
          Know a good place to study? Help other students find it.
        </p>
        <Link
          href="/spots/new"
          className="mt-4 inline-block font-medium text-stone-700 underline underline-offset-4"
        >
          Suggest a place
        </Link>
      </section>
    </main>
  );
}
