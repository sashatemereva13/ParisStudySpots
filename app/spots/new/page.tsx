import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Suggest a spot | Study Spots Paris",
  description: "Suggest a place in Paris where students can study.",
};

export default function NewSpotPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">
        Suggest a study spot
      </h1>
      <p className="mt-3 text-stone-600">
        The suggestion form will be added in a later phase.
      </p>
    </main>
  );
}
