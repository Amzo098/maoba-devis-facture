"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { temoignages } from "@/lib/donnees-salon";

// Carrousel automatique d'avis clients, avec navigation manuelle par points
export default function Temoignages() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const intervalle = setInterval(() => {
      setIndex((i) => (i + 1) % temoignages.length);
    }, 5000);
    return () => clearInterval(intervalle);
  }, []);

  const avis = temoignages[index];

  return (
    <section id="avis" className="bg-casanova-black py-24">
      <div className="mx-auto max-w-3xl px-6 text-center md:px-8">
        <span className="font-body text-sm font-semibold uppercase tracking-widest text-casanova-gold">
          Ils nous font confiance
        </span>
        <h2 className="mt-3 font-display text-3xl font-bold text-casanova-white md:text-4xl">
          Ce que disent nos client·e·s
        </h2>

        <div className="relative mt-12 min-h-[220px]">
          <Quote className="mx-auto h-10 w-10 text-casanova-gold/40" />
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
            >
              <p className="mt-4 font-display text-xl italic text-casanova-white md:text-2xl">
                « {avis.citation} »
              </p>
              <div className="mt-5 flex justify-center gap-1">
                {Array.from({ length: avis.note }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-casanova-gold text-casanova-gold" />
                ))}
              </div>
              <p className="mt-3 font-body text-sm text-casanova-white/60">
                {avis.nom}, {avis.age} ans
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {temoignages.map((_, i) => (
            <button
              key={i}
              aria-label={`Voir l'avis ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2.5 rounded-full transition-all ${
                i === index ? "w-8 bg-casanova-gold" : "w-2.5 bg-casanova-white/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
