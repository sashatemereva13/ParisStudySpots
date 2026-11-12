import Link from "next/link";
import { notFound } from "next/navigation";
import { getAreaById, getReviews, getSpotBySlug } from "@/lib/data";

export default async function SpotPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const spot = await getSpotBySlug(slug);

  if (!spot) {
    notFound();
  }

  const [area, reviews] = await Promise.all([
    getAreaById(spot.areaId),
    getReviews(spot.id),
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <Link
        href="/spots"
        className="text-sm text-stone-600 hover:text-stone-900"
      >
        ← All spots
      </Link>

      <p className="mt-8 text-sm font-medium capitalize text-stone-500">
        {spot.type}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-stone-900">{spot.name}</h1>
      <p className="mt-3 text-stone-600">{spot.address}</p>

      <dl className="mt-8 grid gap-4 rounded-xl border border-stone-200 p-5 sm:grid-cols-2">
        <div>
          <dt className="text-sm text-stone-500">Area</dt>
          <dd className="mt-1 font-medium text-stone-900">
            {area ? (
              <Link
                href={`/areas/${area.slug}`}
                className="underline underline-offset-4"
              >
                {area.name}
              </Link>
            ) : (
              "Unknown area"
            )}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Opening hours</dt>
          <dd className="mt-1 font-medium text-stone-900">
            {spot.openingHours}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-stone-500">Coffee price</dt>
          <dd className="mt-1 font-medium text-stone-900">
            {spot.coffeePrice === null
              ? "Not available"
              : `€${spot.coffeePrice}`}
          </dd>
        </div>
      </dl>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-stone-900">
          Student reviews
        </h2>
        {reviews.length === 0 ? (
          <p className="mt-3 text-stone-600">No reviews yet.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-stone-200 p-5"
              >
                <p className="font-medium text-stone-900">{review.nickname}</p>
                <p className="mt-2 text-sm text-stone-600">
                  Wi-Fi: {review.wifi}/5 · Outlets: {review.outlets}/5 · Noise:{" "}
                  {review.noise}/5 · Comfort: {review.comfort}/5
                </p>
                <p className="mt-3 text-stone-700">{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
