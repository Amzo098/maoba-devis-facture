"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { reseauxSociaux } from "@/lib/donnees-salon";

const photosGalerie = [
  "/images/service-coiffure-tresses.jpg",
  "/images/service-pedicure.jpg",
  "/images/service-manucure.jpg",
  "/images/service-led-masque.jpg",
  "/images/ambiance-equipe.jpg",
  "/images/service-sauna.jpg",
  "/images/service-soin-visage.jpg",
  "/images/ambiance-client.jpg",
];

// Galerie type "feed" + barre de reseaux sociaux, pour la preuve sociale
export default function Galerie() {
  return (
    <section id="galerie" className="bg-casanova-white py-24">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="font-body text-sm font-semibold uppercase tracking-widest text-casanova-pink">
            Ambiance Casanova
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-casanova-black md:text-4xl">
            Plongez dans notre univers
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {photosGalerie.map((src, i) => (
            <motion.div
              key={src}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.08 }}
              className="card-hover relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={src}
                alt="Ambiance du salon Casanova Beauty & Spa"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </motion.div>
          ))}
        </div>

        {/* Barre de preuve sociale en temps reel */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-8 rounded-2xl bg-casanova-black px-8 py-8">
          <a
            href={reseauxSociaux.facebook.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-casanova-white"
          >
            <Facebook className="h-7 w-7 text-casanova-gold" />
            <span className="font-body">
              <span className="font-display text-lg font-bold">
                {reseauxSociaux.facebook.abonnes}
              </span>{" "}
              {reseauxSociaux.facebook.label}
            </span>
          </a>
          <a
            href={reseauxSociaux.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-casanova-white"
          >
            <Instagram className="h-7 w-7 text-casanova-gold" />
            <span className="font-body">
              <span className="font-display text-lg font-bold">
                {reseauxSociaux.instagram.abonnes}
              </span>{" "}
              {reseauxSociaux.instagram.label}
            </span>
          </a>
          <a
            href={reseauxSociaux.tiktok.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 text-casanova-white"
          >
            <Music2 className="h-7 w-7 text-casanova-gold" />
            <span className="font-body font-semibold">Suivez-nous sur TikTok</span>
          </a>
        </div>
      </div>
    </section>
  );
}
