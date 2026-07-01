"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// Section storytelling : fait rever le visiteur avant de lui vendre quoi que ce soit
export default function Histoire() {
  return (
    <section id="histoire" className="bg-casanova-white py-24">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-2 md:items-center md:px-8">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl shadow-gold"
        >
          <Image
            src="/images/ambiance-equipe.jpg"
            alt="L'équipe Casanova Beauty & Spa"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 font-body text-sm font-semibold uppercase tracking-widest text-casanova-pink">
            <Sparkles className="h-4 w-4" /> Notre histoire
          </span>

          <h2 className="mt-4 font-display text-3xl font-bold text-casanova-black md:text-4xl">
            Vous méritez une pause où{" "}
            <span className="text-gold-gradient">vous êtes la priorité absolue</span>.
          </h2>

          <p className="mt-6 font-body text-lg leading-relaxed text-casanova-black/75">
            Vos cheveux méritent l&apos;expertise de professionnels passionnés. Votre
            peau mérite des soins à la hauteur de votre exigence. Chez Casanova,
            nous sublimons votre beauté naturelle dans un cadre luxueux et apaisant,
            pensé pour votre bien-être du premier au dernier instant.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-casanova-black/10 pt-8">
            <div>
              <p className="font-display text-3xl font-bold text-casanova-black">
                166 927+
              </p>
              <p className="font-body text-sm text-casanova-black/60">
                Clients satisfaits sur Facebook
              </p>
            </div>
            <div>
              <p className="font-display text-3xl font-bold text-casanova-black">
                4.8/5
              </p>
              <p className="font-body text-sm text-casanova-black/60">
                Note moyenne de nos clients
              </p>
            </div>
          </div>

          <p className="mt-8 font-display text-xl font-semibold italic text-casanova-black">
            « Offrez-vous ce moment dès aujourd&apos;hui — nos créneaux partent vite. »
          </p>
        </motion.div>
      </div>
    </section>
  );
}
