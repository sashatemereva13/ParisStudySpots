import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAreaById, getReviews, getSpotBySlug, getSpots } from "@/lib/data";
import { CrowdIndicator } from "@/components/crowd-indicator";
import { ReviewsSection } from "@/components/reviews-section";

export const revalidate = 60;

export async function generateStaticParams() {
  const spots = await getSpots();
  return spots.map((spot) => ({ slug: spot.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const spot = await getSpotBySlug(slug);

  if (!spot) {
    return { title: "Spot not found | Study Spots Paris" };
  }

  const description = `${spot.name} is a ${spot.type} study spot at ${spot.address}.`;

  return {
    title: `${spot.name} | Study Spots Paris`,
    description,
    openGraph: {
      title: spot.name,
      description,
    },
  };
}

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
  const average = reviews.length
    ? reviews.reduce((sum, review) => sum + review.wifi + review.outlets + review.noise + review.comfort, 0) / (reviews.length * 4)
    : null;

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

      <section className="mt-8 rounded-xl border border-stone-200 p-5">
        <h2 className="font-semibold text-stone-900">Student rating</h2>
        <p className="mt-2 text-stone-600">
          {average === null ? "No ratings yet." : `${average.toFixed(1)} / 5 from ${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`}
        </p>
      </section>

      <CrowdIndicator slug={spot.slug} />

      <ReviewsSection slug={spot.slug} />
    </main>
  );
}
