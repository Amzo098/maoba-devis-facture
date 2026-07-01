import type { Metadata, Viewport } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";

// Police des titres : elegante et haut de gamme
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

// Police du texte courant : lisible et moderne
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://casanovabeautyspa.gn"),
  title: "Casanova Beauty Salon & Spa | Coiffure, Spa & Esthétique à Conakry",
  description:
    "L'art de la beauté et du bien-être, réinventé pour vous. Coiffure, spa, hammam, massages et microblading à Conakry, Guinée. Réservez dès maintenant sur WhatsApp.",
  keywords: [
    "salon de coiffure Conakry",
    "spa Conakry",
    "microblading Guinée",
    "hammam Conakry",
    "Casanova Beauty",
  ],
  openGraph: {
    title: "Casanova Beauty Salon & Spa",
    description: "L'art de la beauté et du bien-être, réinventé pour vous.",
    url: "https://casanovabeautyspa.gn",
    siteName: "Casanova Beauty Salon & Spa",
    images: ["/images/logo-casanova.jpg"],
    locale: "fr_FR",
    type: "website",
  },
  icons: {
    icon: "/images/logo-casanova.jpg",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A1A1A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body
        className={`${playfair.variable} ${montserrat.variable} font-body antialiased bg-casanova-white text-casanova-black`}
      >
        {children}
      </body>
    </html>
  );
}
