import Image from "next/image";
import { Facebook, Instagram, Music2 } from "lucide-react";
import { identite, succursales, reseauxSociaux } from "@/lib/donnees-salon";

// Pied de page : recapitulatif des liens essentiels et mentions
export default function Footer() {
  return (
    <footer className="bg-casanova-black py-14">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <Image
                src="/images/logo-casanova.jpg"
                alt={identite.nom}
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="font-display text-lg font-bold text-casanova-white">
                {identite.nom}
              </span>
            </div>
            <p className="mt-4 font-body text-sm text-casanova-white/60">
              {identite.slogan}
            </p>
          </div>

          <div>
            <h4 className="font-display text-base font-bold text-casanova-white">
              Nos adresses
            </h4>
            <ul className="mt-4 space-y-2 font-body text-sm text-casanova-white/60">
              {succursales.map((s) => (
                <li key={s.id}>
                  {s.nom} — {s.telephone}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-base font-bold text-casanova-white">
              Suivez-nous
            </h4>
            <div className="mt-4 flex gap-4">
              <a
                href={reseauxSociaux.facebook.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-casanova-white/70 hover:text-casanova-gold"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href={reseauxSociaux.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-casanova-white/70 hover:text-casanova-gold"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href={reseauxSociaux.tiktok.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-casanova-white/70 hover:text-casanova-gold"
              >
                <Music2 className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-casanova-white/10 pt-6 text-center font-body text-xs text-casanova-white/40">
          © {new Date().getFullYear()} {identite.nom}. Tous droits réservés. Conakry, Guinée.
        </div>
      </div>
    </footer>
  );
}
