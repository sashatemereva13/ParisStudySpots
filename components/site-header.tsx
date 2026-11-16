import Link from "next/link";
import NavLink from "@/components/nav-link";

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
          <NavLink href="/">Home</NavLink>
          <NavLink href="/spots">All spots</NavLink>
          <NavLink href="/search">Search</NavLink>
          <NavLink href="/spots/new">Suggest a spot</NavLink>
        </div>
      </nav>
    </header>
  );
}
