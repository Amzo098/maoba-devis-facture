"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, Star } from "lucide-react";
import BoutonWhatsApp from "./BoutonWhatsApp";
import { reseauxSociaux } from "@/lib/donnees-salon";

// Section d'accueil : premiere impression en 3 secondes, doit capter l'attention immediatement
export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-casanova-black"
    >
      {/* Photo de fond reelle du salon, avec voile sombre pour la lisibilite du texte */}
      <Image
        src="/images/hero-bienvenue.jpg"
        alt="Interieur du salon Casanova Beauty & Spa"
        fill
        priority
        className="object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-casanova-black/70 via-casanova-black/50 to-casanova-black" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex items-center gap-2 rounded-full border border-casanova-gold/40 bg-casanova-black/40 px-4 py-1.5 text-sm font-medium text-casanova-gold"
        >
          <Star className="h-4 w-4 fill-casanova-gold" />
          4.8/5 · {reseauxSociaux.facebook.abonnes} likes Facebook · {reseauxSociaux.instagram.abonnes} sur Instagram
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-display text-4xl font-bold leading-tight text-casanova-white sm:text-5xl md:text-6xl"
        >
          Bienvenue chez{" "}
          <span className="text-gold-gradient animate-shimmer">Casanova</span>
          <br />
          Beauty &amp; Spa
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-6 max-w-2xl font-body text-lg text-casanova-white/85 md:text-xl"
        >
          L&apos;art de la beauté et du bien-être, réinventé pour vous.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <BoutonWhatsApp texte="Découvrez notre univers" className="text-base" />
          <a
            href="#services"
            className="font-body text-sm font-semibold text-casanova-white/80 underline-offset-4 hover:text-casanova-gold hover:underline"
          >
            Voir nos services →
          </a>
        </motion.div>
      </div>

      <motion.a
        href="#histoire"
        aria-label="Défiler vers le bas"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-casanova-gold"
      >
        <ChevronDown className="h-8 w-8" />
      </motion.a>
    </section>
  );
}
