import Link from "next/link";
import { Logo } from "@/components/marke/Logo";

export function Kopfzeile() {
  return (
    <header className="border-b border-linie bg-beige">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4 sm:px-8">
        <Link href="/" aria-label="Startseite">
          <Logo className="h-14 w-auto sm:h-16" />
        </Link>
        <Link
          href="/anmelden"
          className="border border-gruen px-4 py-2 text-xs tracking-[0.18em] uppercase hover:bg-gruen hover:text-beige"
        >
          Anmelden
        </Link>
      </div>
    </header>
  );
}
