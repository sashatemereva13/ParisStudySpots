import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreaBySlug, getSpotsByArea } from "@/lib/data";

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = await getAreaBySlug(slug);

  if (!area) {
    notFound();
  }

  const spots = await getSpotsByArea(area.id);

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-12">
      <Link
        href="/spots"
        className="text-sm text-stone-600 hover:text-stone-900"
      >
        ← All spots
      </Link>

      <h1 className="mt-6 text-3xl font-bold text-stone-900">
        Study spots in {area.name}
      </h1>

      {spots.length === 0 ? (
        <p className="mt-4 text-stone-600">
          No study spots are listed in this area yet.
        </p>
      ) : (
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
      )}
    </main>
  );
}
