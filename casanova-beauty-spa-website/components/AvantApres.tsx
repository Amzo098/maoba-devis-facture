"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const transformations = [
  {
    titre: "Microblading Sourcils",
    image: "/images/avant-apres-microblading.jpg",
  },
  {
    titre: "Blanchiment Dentaire",
    image: "/images/avant-apres-blanchiment-1.jpg",
  },
  {
    titre: "Blanchiment Dentaire",
    image: "/images/avant-apres-blanchiment-2.jpg",
  },
  {
    titre: "Blanchiment Dentaire",
    image: "/images/avant-apres-blanchiment-3.jpg",
  },
  {
    titre: "Nettoyage & Éclat des Dents",
    image: "/images/avant-apres-nettoyage-1.jpg",
  },
  {
    titre: "Nettoyage & Éclat des Dents",
    image: "/images/avant-apres-nettoyage-2.jpg",
  },
];

// Preuve visuelle la plus forte du site : vraies transformations de vrais clients
export default function AvantApres() {
  return (
    <section id="resultats" className="bg-casanova-white py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-casanova-pink">
            Preuves par l&apos;image
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-casanova-black md:text-4xl">
            Des résultats qui parlent d&apos;eux-mêmes
          </h2>
          <p className="mt-4 font-body text-casanova-black/65">
            Aucune retouche, aucun filtre — uniquement de vraies transformations
            réalisées par nos experts.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {transformations.map((t, i) => (
            <motion.figure
              key={t.image}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="card-hover overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-casanova-black/5"
            >
              <div className="relative aspect-square w-full">
                <Image
                  src={t.image}
                  alt={`Avant / après — ${t.titre}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <figcaption className="p-4 text-center font-body text-sm font-semibold text-casanova-black">
                {t.titre}
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
