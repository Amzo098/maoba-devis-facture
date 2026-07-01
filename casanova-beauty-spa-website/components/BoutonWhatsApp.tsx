"use client";

import { MessageCircle } from "lucide-react";
import { succursales } from "@/lib/donnees-salon";

// "or" = fond degrade dore (defaut, pour fonds sombres) / "sombre" = fond noir (pour la banniere doree)
const stylesVariante = {
  or: "bg-gold-gradient text-casanova-black shadow-gold",
  sombre: "bg-casanova-black text-casanova-gold",
};

// Bouton d'appel a l'action reutilisable, pointe vers le WhatsApp de la succursale principale
export default function BoutonWhatsApp({
  texte = "Réserver sur WhatsApp",
  className = "",
  whatsapp = succursales[0].whatsapp,
  variante = "or",
}: {
  texte?: string;
  className?: string;
  whatsapp?: string;
  variante?: keyof typeof stylesVariante;
}) {
  return (
    <a
      href={whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 font-body font-semibold transition-transform duration-300 hover:scale-105 active:scale-95 ${stylesVariante[variante]} ${className}`}
    >
      <MessageCircle className="h-5 w-5 transition-transform group-hover:rotate-12" />
      {texte}
    </a>
  );
}
