import Link from "next/link";
import { markenname } from "@/components/marke/farben";

export function Fusszeile() {
  return (
    <footer className="border-t border-linie">
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-5 py-6 text-sm text-text-leise sm:flex-row sm:justify-between sm:px-8">
        <span>© {new Date().getFullYear()} {markenname}, Stuttgart</span>
        <nav className="flex gap-6">
          <Link href="/impressum" className="hover:text-gruen">
            Impressum
          </Link>
          <Link href="/datenschutz" className="hover:text-gruen">
            Datenschutz
          </Link>
        </nav>
      </div>
    </footer>
  );
}
