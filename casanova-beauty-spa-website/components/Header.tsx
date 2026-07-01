"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import BoutonWhatsApp from "./BoutonWhatsApp";

const liens = [
  { href: "#accueil", label: "Accueil" },
  { href: "#histoire", label: "Notre Histoire" },
  { href: "#services", label: "Services" },
  { href: "#resultats", label: "Résultats" },
  { href: "#avis", label: "Avis" },
  { href: "#galerie", label: "Galerie" },
  { href: "#contact", label: "Contact" },
];

// En-tete fixe : devient opaque au scroll, menu mobile en plein ecran, CTA reservation toujours visible
export default function Header() {
  const [defile, setDefile] = useState(false);
  const [menuOuvert, setMenuOuvert] = useState(false);

  useEffect(() => {
    const auScroll = () => setDefile(window.scrollY > 20);
    window.addEventListener("scroll", auScroll);
    return () => window.removeEventListener("scroll", auScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        defile ? "bg-casanova-black/95 shadow-lg backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <a href="#accueil" className="flex items-center gap-2">
          <Image
            src="/images/logo-casanova.jpg"
            alt="Casanova Beauty Salon & Spa"
            width={44}
            height={44}
            className="rounded-full"
            priority
          />
          <span className="font-display text-lg font-bold text-casanova-white">
            Casanova
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {liens.map((lien) => (
            <a
              key={lien.href}
              href={lien.href}
              className="font-body text-sm font-medium text-casanova-white/90 transition-colors hover:text-casanova-gold"
            >
              {lien.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <BoutonWhatsApp texte="Réserver" className="px-5 py-2.5 text-sm" />
        </div>

        <button
          aria-label="Ouvrir le menu"
          className="text-casanova-white lg:hidden"
          onClick={() => setMenuOuvert(true)}
        >
          <Menu className="h-7 w-7" />
        </button>
      </div>

      {/* Menu mobile plein ecran */}
      {menuOuvert && (
        <div className="fixed inset-0 z-50 flex flex-col bg-casanova-black px-6 py-6 lg:hidden">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-casanova-white">
              Casanova
            </span>
            <button
              aria-label="Fermer le menu"
              className="text-casanova-white"
              onClick={() => setMenuOuvert(false)}
            >
              <X className="h-7 w-7" />
            </button>
          </div>
          <nav className="mt-10 flex flex-col gap-6">
            {liens.map((lien) => (
              <a
                key={lien.href}
                href={lien.href}
                onClick={() => setMenuOuvert(false)}
                className="font-display text-2xl font-semibold text-casanova-white"
              >
                {lien.label}
              </a>
            ))}
          </nav>
          <div className="mt-auto pt-10">
            <BoutonWhatsApp className="w-full" />
          </div>
        </div>
      )}
    </header>
  );
}
