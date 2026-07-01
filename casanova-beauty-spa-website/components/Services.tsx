"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { services, forfaits, formaterPrix, type Service } from "@/lib/donnees-salon";
import BoutonWhatsApp from "./BoutonWhatsApp";

const categories: Array<Service["categorie"] | "Tous"> = [
  "Tous",
  "Coiffure",
  "Spa",
  "Esthétique",
];

// Grille de services filtrable par categorie, avec vraies photos du salon
export default function Services() {
  const [categorieActive, setCategorieActive] = useState<(typeof categories)[number]>(
    "Tous"
  );

  const servicesAffiches =
    categorieActive === "Tous"
      ? services
      : services.filter((s) => s.categorie === categorieActive);

  return (
    <section id="services" className="bg-casanova-black py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-casanova-gold">
            Nos prestations
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-casanova-white md:text-4xl">
            Des soins pensés pour sublimer chaque détail de vous
          </h2>
        </div>

        {/* Filtres de categorie */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorieActive(cat)}
              className={`rounded-full px-5 py-2 font-body text-sm font-semibold transition-colors ${
                categorieActive === cat
                  ? "bg-gold-gradient text-casanova-black"
                  : "border border-casanova-white/20 text-casanova-white/80 hover:border-casanova-gold hover:text-casanova-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille des cartes de service */}
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {servicesAffiches.map((service, i) => (
            <motion.article
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
              className="card-hover overflow-hidden rounded-2xl bg-casanova-white/5 ring-1 ring-casanova-white/10"
            >
              <div className="relative h-56 w-full">
                <Image
                  src={service.image}
                  alt={service.nom}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <span className="absolute left-3 top-3 rounded-full bg-casanova-black/70 px-3 py-1 font-body text-xs font-semibold text-casanova-gold">
                  {service.categorie}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-bold text-casanova-white">
                  {service.nom}
                </h3>
                <p className="mt-2 font-body text-sm text-casanova-white/65">
                  {service.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-body text-sm text-casanova-white/50">
                    <Clock className="h-4 w-4" /> {service.duree}
                  </span>
                  <span className="font-display text-lg font-bold text-casanova-gold">
                    {formaterPrix(service.prix)}
                  </span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Forfaits */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2">
          {forfaits.map((forfait) => (
            <div
              key={forfait.id}
              className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gold-gradient p-7 sm:flex-row sm:items-center"
            >
              <div>
                <h4 className="font-display text-xl font-bold text-casanova-black">
                  {forfait.nom}
                </h4>
                <p className="font-body text-sm text-casanova-black/70">
                  {forfait.description}
                </p>
              </div>
              <span className="whitespace-nowrap font-display text-2xl font-bold text-casanova-black">
                {formaterPrix(forfait.prix)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-14 flex justify-center">
          <BoutonWhatsApp texte="Réserver mon soin" />
        </div>
      </div>
    </section>
  );
}
