import type { Metadata, Viewport } from "next";
import { EB_Garamond, Jost, Libre_Caslon_Text } from "next/font/google";
import { Fusszeile } from "@/components/layout/Fusszeile";
import { Kopfzeile } from "@/components/layout/Kopfzeile";
import { portalname } from "@/components/marke/farben";
import "./globals.css";

const caslon = Libre_Caslon_Text({
  variable: "--font-caslon",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
});

const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
});

const garamond = EB_Garamond({
  variable: "--font-eb-garamond",
  style: ["italic"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: portalname, template: `%s · ${portalname}` },
  description: "Digitale WEG-Verwaltung der Pracht Immobiliengruppe, Stuttgart",
};

export const viewport: Viewport = {
  themeColor: "#1E3A2F",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${caslon.variable} ${jost.variable} ${garamond.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <Kopfzeile />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 py-10 sm:px-8 sm:py-16">{children}</main>
        <Fusszeile />
      </body>
    </html>
  );
}
