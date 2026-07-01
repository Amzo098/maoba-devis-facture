"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import BoutonWhatsApp from "./BoutonWhatsApp";

// Banniere finale : cree un sentiment d'urgence avant la conversion
export default function BanniereUrgence() {
  return (
    <section className="bg-gold-gradient py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.6 }}
        className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-6 text-center"
      >
        <span className="flex items-center gap-2 rounded-full bg-casanova-black/10 px-4 py-1.5 font-body text-sm font-semibold text-casanova-black">
          <Sparkles className="h-4 w-4" /> Offre limitée
        </span>
        <h2 className="font-display text-3xl font-bold text-casanova-black md:text-4xl">
          -20% sur votre première réservation cette semaine
        </h2>
        <p className="font-body text-casanova-black/80">
          Nos client·e·s reviennent 9 fois sur 10 — et nos créneaux partent vite.
          Réservez dès maintenant votre moment de beauté et de bien-être.
        </p>
        <BoutonWhatsApp texte="Je réserve maintenant" variante="sombre" />
      </motion.div>
    </section>
  );
}
