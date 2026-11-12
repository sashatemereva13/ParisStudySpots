import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
        404
      </p>
      <h1 className="mt-3 text-3xl font-bold text-stone-900">
        We couldn’t find that page
      </h1>
      <p className="mt-4 text-stone-600">
        The spot or page you requested may have moved or doesn’t exist.
      </p>
      <Link
        href="/spots"
        className="mt-8 inline-block rounded-md bg-stone-900 px-5 py-3 text-white hover:bg-stone-700"
      >
        Browse all spots
      </Link>
    </main>
  );
}
