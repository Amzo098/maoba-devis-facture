"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { succursales } from "@/lib/donnees-salon";
import BoutonWhatsApp from "./BoutonWhatsApp";

// Coordonnees des deux adresses du salon, chacune avec son propre lien WhatsApp
export default function Localisations() {
  return (
    <section id="contact" className="bg-casanova-black py-24">
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-casanova-gold">
            Nos adresses
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-casanova-white md:text-4xl">
            Venez nous rencontrer à Conakry
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {succursales.map((s, i) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col rounded-2xl bg-casanova-white/5 p-7 ring-1 ring-casanova-white/10"
            >
              <h3 className="font-display text-xl font-bold text-casanova-white">
                {s.nom}
              </h3>

              <div className="mt-5 flex-1 space-y-4">
                <p className="flex items-start gap-3 font-body text-sm text-casanova-white/75">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-casanova-gold" />
                  {s.adresse}
                </p>
                <a
                  href={`tel:${s.telephone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 font-body text-sm text-casanova-white/75 hover:text-casanova-gold"
                >
                  <Phone className="h-5 w-5 shrink-0 text-casanova-gold" />
                  {s.telephone}
                </a>
                <a
                  href={`mailto:${s.email}`}
                  className="flex items-center gap-3 font-body text-sm text-casanova-white/75 hover:text-casanova-gold"
                >
                  <Mail className="h-5 w-5 shrink-0 text-casanova-gold" />
                  {s.email}
                </a>
              </div>

              <BoutonWhatsApp
                texte="Contacter cette succursale"
                whatsapp={s.whatsapp}
                className="mt-6 w-full text-sm"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
