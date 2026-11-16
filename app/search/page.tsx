import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search study spots | Study Spots Paris",
  description: "Search for places to study in Paris.",
};

export default function SearchPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">Search study spots</h1>
      <p className="mt-3 text-stone-600">
        Search and filters will be added in a later phase.
      </p>
    </main>
  );
}
