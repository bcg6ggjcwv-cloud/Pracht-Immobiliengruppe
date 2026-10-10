import type { ComponentProps, ReactNode } from "react";

export function Feld({ label, hinweis, ...props }: { label: string; hinweis?: ReactNode } & ComponentProps<"input">) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm">{label}</span>
      <input
        {...props}
        className="w-full border border-linie bg-white/60 px-3 py-2.5 text-base outline-none focus:border-gruen"
      />
      {hinweis && <span className="block text-xs text-text-leise">{hinweis}</span>}
    </label>
  );
}

export function Knopf({ children, variante = "voll", ...props }: { variante?: "voll" | "rahmen" } & ComponentProps<"button">) {
  const stil =
    variante === "voll"
      ? "bg-gruen text-beige hover:bg-gruen/90"
      : "border border-gruen text-gruen hover:bg-gruen hover:text-beige";
  return (
    <button
      {...props}
      className={`w-full px-5 py-3 text-sm tracking-[0.18em] uppercase disabled:opacity-60 ${stil} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

export function Meldung({ art = "info", children }: { art?: "info" | "fehler" | "erfolg"; children: ReactNode }) {
  if (!children) return null;
  const farbe = art === "fehler" ? "border-fehler text-fehler" : "border-linie text-text";
  return (
    <p role={art === "fehler" ? "alert" : "status"} className={`border-l-2 bg-creme px-4 py-3 text-sm ${farbe}`}>
      {children}
    </p>
  );
}

export function Karte({ children }: { children: ReactNode }) {
  return <div className="space-y-5 border border-linie bg-creme p-6">{children}</div>;
}

export function Seitenkopf({ titel, text, icon }: { titel: string; text?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {icon}
      <h1 className="text-2xl">{titel}</h1>
      {text && <p className="text-sm text-text-leise">{text}</p>}
    </div>
  );
}
