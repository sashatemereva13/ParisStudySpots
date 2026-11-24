import type { Metadata } from "next";
import { getAreas } from "@/lib/data";
import { NewSpotForm } from "@/components/new-spot-form";

export const metadata: Metadata = {
  title: "Suggest a spot | Study Spots Paris",
  description: "Suggest a place in Paris where students can study.",
};

export default async function NewSpotPage() {
  const areas = await getAreas();
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold text-stone-900">
        Suggest a study spot
      </h1>
      <p className="mt-3 text-stone-600">Suggest a place in Paris where students can study.</p>
      <NewSpotForm areas={areas} />
    </main>
  );
}
