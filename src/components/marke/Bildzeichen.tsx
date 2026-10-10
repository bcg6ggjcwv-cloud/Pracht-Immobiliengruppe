import { farben } from "./farben";

type Props = {
  variante?: "hell" | "dunkel";
  className?: string;
};

/** Kursives P in einem doppelt umrandeten Schild (Favicon, App-Icon, Signatur). */
export function Bildzeichen({ variante = "hell", className }: Props) {
  const vordergrund = variante === "hell" ? farben.gruen : farben.beige;
  const flaeche = variante === "hell" ? farben.beige : farben.gruen;

  return (
    <svg
      viewBox="0 0 100 120"
      role="img"
      aria-label="Pracht"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 6 H92 V60 C92 89 72 105 50 115 C28 105 8 89 8 60 Z"
        fill={flaeche}
        stroke={vordergrund}
        strokeWidth="2"
      />
      <path
        d="M15 13 H85 V60 C85 84 67 98 50 107 C33 98 15 84 15 60 Z"
        fill="none"
        stroke={vordergrund}
        strokeWidth="1"
      />
      <text
        x="51"
        y="78"
        textAnchor="middle"
        fill={vordergrund}
        fontSize="62"
        fontStyle="italic"
        style={{ fontFamily: "var(--font-garamond)" }}
      >
        P
      </text>
    </svg>
  );
}
