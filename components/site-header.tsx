import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4"
      >
        <Link href="/" className="text-lg font-bold text-stone-900">
          Study Spots Paris
        </Link>

        <div className="flex flex-wrap items-center gap-5 text-sm text-stone-700">
          <Link href="/">Home</Link>
          <Link href="/spots">All spots</Link>
          <Link href="/search">Search</Link>
          <Link href="/spots/new">Suggest a spot</Link>
        </div>
      </nav>
    </header>
  );
}
