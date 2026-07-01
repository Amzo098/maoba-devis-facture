import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Histoire from "@/components/Histoire";
import Services from "@/components/Services";
import AvantApres from "@/components/AvantApres";
import Temoignages from "@/components/Temoignages";
import Galerie from "@/components/Galerie";
import Localisations from "@/components/Localisations";
import BanniereUrgence from "@/components/BanniereUrgence";
import Footer from "@/components/Footer";

// Assemblage de la page unique : chaque section vend une etape du parcours client
export default function Accueil() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Histoire />
        <Services />
        <AvantApres />
        <Temoignages />
        <Galerie />
        <Localisations />
        <BanniereUrgence />
      </main>
      <Footer />
    </>
  );
}
