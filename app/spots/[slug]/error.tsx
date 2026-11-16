"use client";

export default function SpotError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12">
      <div role="alert">
        <h1 className="text-2xl font-bold text-stone-900">
          This spot could not be loaded
        </h1>
        <p className="mt-2 text-stone-600">{error.message}</p>
      </div>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-4 rounded border border-stone-300 px-4 py-2"
      >
        Try again
      </button>
    </main>
  );
}
