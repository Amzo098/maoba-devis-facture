# Casanova Beauty Salon & Spa — Site vitrine

Site vitrine du salon **Casanova Beauty Salon & Spa** (Conakry, Guinée),
construit avec **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**
et **Framer Motion**. Tous les commentaires du code sont en français.

Ce projet vit actuellement dans un sous-dossier du dépôt
`amzo098/maoba-devis-facture` (contrainte technique de la session qui l'a
créé) mais est **entièrement autonome** : c'est un projet Next.js complet et
indépendant, prêt à être déplacé dans son propre dépôt GitHub.

## Démarrer en local

```bash
npm install
npm run dev
```

Le site est accessible sur `http://localhost:3000`.

```bash
npm run build   # build de production
npm run lint     # vérification ESLint
```

## Structure du projet

```
app/                 # Pages (App Router) : layout, page d'accueil, styles globaux
components/          # Sections du site (Header, Hero, Services, Témoignages, etc.)
lib/donnees-salon.ts # Toutes les données modifiables : adresses, services, prix, avis
public/images/       # Vraies photos du salon (logo, prestations, avant/après, ambiance)
```

Pour changer un prix, un texte de service, une adresse ou un témoignage,
il suffit de modifier `lib/donnees-salon.ts` — aucun composant n'a besoin
d'être touché.

## Déployer sur Vercel

1. Créez un dépôt GitHub dédié, par exemple `casanova-beauty-spa-website`
   (voir section suivante pour migrer ce dossier).
2. Sur [vercel.com](https://vercel.com), cliquez sur **Add New → Project**
   et importez le dépôt GitHub.
3. Vercel détecte automatiquement Next.js — aucune configuration
   supplémentaire n'est nécessaire (build command `next build`, output géré
   automatiquement).
4. Cliquez sur **Deploy**. Le site est en ligne en quelques minutes, avec un
   nom de domaine `*.vercel.app` (un domaine personnalisé peut être ajouté
   ensuite dans les réglages du projet Vercel).
5. Chaque nouveau `git push` sur la branche principale redéploie
   automatiquement le site.

## Migrer ce dossier vers son propre dépôt GitHub

Depuis votre machine (le token de cette session ne permet pas de créer un
nouveau dépôt) :

```bash
# 1. Créez un nouveau dépôt vide sur GitHub, nommé par ex. casanova-beauty-spa-website
#    (ne PAS l'initialiser avec un README/gitignore)

# 2. Copiez uniquement ce dossier dans un nouvel emplacement
cp -r casanova-beauty-spa-website ../casanova-beauty-spa-website-standalone
cd ../casanova-beauty-spa-website-standalone

# 3. Initialisez un nouveau dépôt git et poussez
git init
git add .
git commit -m "Premiere version du site Casanova Beauty & Spa"
git branch -M main
git remote add origin https://github.com/<votre-compte>/casanova-beauty-spa-website.git
git push -u origin main
```

## Contenu à finaliser avec le client

Certains éléments du cahier des charges nécessitent des accès ou des
fichiers que le client seul peut fournir :

- **Vidéo de fond 4K** pour le hero (actuellement une vraie photo du salon
  est utilisée à la place).
- **Flux Instagram en direct** (nécessite un token d'API Meta/Instagram
  Graph API) — la galerie actuelle utilise de vraies photos du salon en
  statique.
- **Paiement Mobile Money** — aucune intégration de paiement n'est
  branchée ; les réservations se font via WhatsApp comme demandé dans le
  cahier des charges.
- **Compteurs de créneaux en temps réel** — nécessitent un système de
  réservation/backend ; non inclus dans cette première version statique.

## Charte graphique

| Élément      | Valeur                                     |
|--------------|---------------------------------------------|
| Or           | `#FFD700`                                   |
| Noir         | `#1A1A1A`                                   |
| Blanc cassé  | `#F5F5F5`                                   |
| Rose vif     | `#FF69B4`                                   |
| Titres       | Playfair Display                            |
| Texte        | Montserrat                                  |
