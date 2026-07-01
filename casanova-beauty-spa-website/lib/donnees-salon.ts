// Donnees centralisees du salon : coordonnees, services, avis, reseaux sociaux.
// Regroupees ici pour etre modifiees facilement sans toucher aux composants.

export const identite = {
  nom: "Casanova Beauty Salon & Spa",
  slogan: "L'art de la beauté et du bien-être, réinventé pour vous.",
  description:
    "Salon de coiffure et spa haut de gamme a Conakry, specialise en coiffure, spa et esthetique.",
};

export type Succursale = {
  id: string;
  nom: string;
  adresse: string;
  telephone: string;
  whatsapp: string;
  email: string;
};

export const succursales: Succursale[] = [
  {
    id: "nongo-taady",
    nom: "Casanova Nongo Taady",
    adresse: "Résidence KPC, Nongo Taady, Conakry",
    telephone: "+224 624 77 77 78",
    whatsapp: "https://wa.me/224624777778",
    email: "contact@casanovabeautyspa.gn",
  },
  {
    id: "spa",
    nom: "Casanova Spa",
    adresse: "Résidence KPC, Nongo Taady, Conakry (même adresse)",
    telephone: "+224 627 48 84 84",
    whatsapp: "https://wa.me/224627488484",
    email: "spa@casanovabeautyspa.gn",
  },
  {
    id: "manquepas",
    nom: "Casanova En Ville Manquepas",
    adresse: "G74Q+R3G, En Ville Manquepas, Conakry",
    telephone: "+224 656 80 00 00",
    whatsapp: "https://wa.me/224656800000",
    email: "reservation@casanovabeautyspa.gn",
  },
];

export const reseauxSociaux = {
  facebook: {
    url: "https://www.facebook.com/p/Casanova-beauty-Salon-Spa-100063482772805/",
    abonnes: "166 927",
    label: "likes Facebook",
  },
  instagram: {
    url: "https://www.instagram.com/salon_casanova1/",
    abonnes: "46K",
    label: "abonnés Instagram",
  },
  tiktok: {
    url: "https://www.tiktok.com/@salon.casanova",
    label: "TikTok",
  },
};

export type Service = {
  id: string;
  categorie: "Coiffure" | "Spa" | "Esthétique";
  nom: string;
  description: string;
  duree: string;
  prix: number;
  image: string;
};

// Prix en Francs Guineens (GNF)
export const services: Service[] = [
  {
    id: "balayage",
    categorie: "Coiffure",
    nom: "Balayage Lumineux",
    description: "Reflets naturels pour illuminer votre visage.",
    duree: "2h30",
    prix: 300000,
    image: "/images/service-coiffure-lissage.jpg",
  },
  {
    id: "coupe",
    categorie: "Coiffure",
    nom: "Coupe Personnalisée",
    description: "Adaptée à votre morphologie et vos envies.",
    duree: "1h",
    prix: 150000,
    image: "/images/service-coiffure-tresses.jpg",
  },
  {
    id: "soin-capillaire",
    categorie: "Coiffure",
    nom: "Soin Capillaire Profond",
    description: "Hydratation et réparation intense.",
    duree: "1h30",
    prix: 200000,
    image: "/images/hero-bienvenue.jpg",
  },
  {
    id: "coiffure-mariage",
    categorie: "Coiffure",
    nom: "Coiffure Mariage",
    description: "Pour votre grand jour.",
    duree: "3h",
    prix: 500000,
    image: "/images/ambiance-client.jpg",
  },
  {
    id: "massage",
    categorie: "Spa",
    nom: "Massage Relaxant",
    description: "Détendez-vous avec un massage complet.",
    duree: "1h30",
    prix: 250000,
    image: "/images/service-soin-visage.jpg",
  },
  {
    id: "hammam",
    categorie: "Spa",
    nom: "Hammam + Gommage",
    description: "Purifiez votre peau avec notre rituel traditionnel.",
    duree: "2h",
    prix: 350000,
    image: "/images/service-led-masque.jpg",
  },
  {
    id: "sauna",
    categorie: "Spa",
    nom: "Sauna",
    description: "Purification et détente profonde.",
    duree: "1h",
    prix: 200000,
    image: "/images/service-sauna.jpg",
  },
  {
    id: "photomodulation",
    categorie: "Spa",
    nom: "Photomodulation LED",
    description: "Soin du visage par lumière LED pour une peau eclatante.",
    duree: "45min",
    prix: 180000,
    image: "/images/service-photomodulation.jpg",
  },
  {
    id: "microblading",
    categorie: "Esthétique",
    nom: "Microblading",
    description: "Sourcils parfaits et naturels pendant 1–2 ans.",
    duree: "2h",
    prix: 400000,
    image: "/images/avant-apres-microblading.jpg",
  },
  {
    id: "manucure",
    categorie: "Esthétique",
    nom: "Manucure / Pédicure",
    description: "Soins complets pour des ongles sublimes.",
    duree: "1h",
    prix: 150000,
    image: "/images/service-manucure.jpg",
  },
  {
    id: "blanchiment",
    categorie: "Esthétique",
    nom: "Blanchiment Dentaire",
    description: "Un sourire éclatant et des dents visiblement plus blanches.",
    duree: "1h",
    prix: 250000,
    image: "/images/avant-apres-blanchiment-1.jpg",
  },
];

export type Forfait = {
  id: string;
  nom: string;
  description: string;
  prix: number;
};

export const forfaits: Forfait[] = [
  {
    id: "forfait-mariage",
    nom: "Forfait Mariage",
    description: "Coiffure + Maquillage + Massage",
    prix: 800000,
  },
  {
    id: "journee-detente",
    nom: "Journée Détente",
    description: "Hammam + Sauna + Massage",
    prix: 500000,
  },
];

export type Temoignage = {
  nom: string;
  age: number;
  citation: string;
  note: number;
};

export const temoignages: Temoignage[] = [
  {
    nom: "Aïcha D.",
    age: 34,
    citation: "Le meilleur brushing de ma vie ! Plus de douleur, juste du plaisir.",
    note: 5,
  },
  {
    nom: "Fatoumata S.",
    age: 28,
    citation: "Un massage incroyable, je me suis endormie !",
    note: 5,
  },
  {
    nom: "Mamadou T.",
    age: 40,
    citation: "Le salon le plus pro de Conakry. Je recommande à 100% !",
    note: 5,
  },
];

// Formate un montant en Francs Guineens, ex: 300000 -> "300 000 GNF"
export function formaterPrix(montant: number): string {
  return `${montant.toLocaleString("fr-FR").replace(/,/g, " ")} GNF`;
}
