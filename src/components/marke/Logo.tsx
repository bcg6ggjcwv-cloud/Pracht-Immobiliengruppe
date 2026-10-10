import { farben, markenname } from "./farben";

type Props = {
  /** hell = Grün auf Beige, dunkel = Beige auf Grün */
  variante?: "hell" | "dunkel";
  /** Hintergrundfläche mitzeichnen (z. B. für freistehende Verwendung) */
  mitFlaeche?: boolean;
  className?: string;
};

/**
 * Wortmarke PRACHT zwischen zwei feinen Doppellinien,
 * darunter IMMOBILIENGRUPPE klein und weit gesperrt.
 */
export function Logo({ variante = "hell", mitFlaeche = false, className }: Props) {
  const vordergrund = variante === "hell" ? farben.gruen : farben.beige;
  const flaeche = variante === "hell" ? farben.beige : farben.gruen;

  return (
    <svg
      viewBox="0 0 360 132"
      role="img"
      aria-label={markenname}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {mitFlaeche && <rect width="360" height="132" fill={flaeche} />}
      <g stroke={vordergrund} strokeWidth="0.9" fill="none">
        <line x1="44" y1="18" x2="316" y2="18" />
        <line x1="44" y1="22" x2="316" y2="22" />
        <line x1="44" y1="88" x2="316" y2="88" />
        <line x1="44" y1="92" x2="316" y2="92" />
      </g>
      <text
        x="180"
        y="72"
        dx="5.7"
        textAnchor="middle"
        fill={vordergrund}
        fontSize="44"
        letterSpacing="11.4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        PRACHT
      </text>
      <text
        x="180"
        y="118"
        dx="1.9"
        textAnchor="middle"
        fill={vordergrund}
        fontSize="10.5"
        letterSpacing="3.8"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        IMMOBILIENGRUPPE
      </text>
    </svg>
  );
}
