"use client";

export default function SpotError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="mx-auto w-full max-w-3xl px-6 py-12"><h1 className="text-xl font-semibold">Could not load this study spot.</h1><button onClick={reset} className="mt-4 rounded border px-4 py-2">Try again</button></main>;
}
