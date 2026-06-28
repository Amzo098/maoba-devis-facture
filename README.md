# Mes Devis & Factures — Outil gratuit Maoba

Un outil **gratuit et ultra-simple** pour créer des **devis** et **factures**
professionnels en quelques minutes, pensé pour les artisans, entreprises BTP et
petits commerçants de Guinée. Offert par **Maoba Marketing Digital**.

> Objectif : qu'une personne qui n'a **jamais** utilisé ce genre d'outil réussisse
> à créer et envoyer un devis, seule, du premier coup, en moins de 3 minutes —
> directement depuis son téléphone Android.

## Ce que l'outil permet de faire

- 🏢 Enregistrer **une seule fois** les infos de son entreprise (nom, logo, téléphone, ville).
  Elles se remettent toutes seules sur chaque nouveau document.
- 👤 Saisir le client, avec **numéro de devis automatique** (DEVIS-001, 002…) et **date du jour** pré-remplie.
- 🧱 Ajouter des **articles / prestations** (description, quantité, prix en GNF) avec **calcul automatique**.
  Option facultative « Matériaux / Main d'œuvre » utile en BTP.
- 🧮 **Totaux automatiques** : sous-total, remise (% ou montant), total en gros, acompte demandé.
- 📝 **Conditions** pré-remplies et modifiables (validité, paiement, délai).
- ⬇️ **Télécharger un PDF propre et professionnel** avec le logo en en-tête.
- 📲 **Envoyer sur WhatsApp** en un clic.
- 🔄 Basculer entre **Devis** et **Facture** sans tout recommencer.
- 📂 Retrouver ses anciens documents dans **« Mes devis »** (rouvrir, modifier, dupliquer, re-télécharger).
- ☁️ **Sauvegarde en ligne optionnelle** (connexion par email) : les 5 premiers documents
  fonctionnent sans connexion ; au-delà, l'utilisateur se connecte gratuitement avec son
  email pour ne jamais rien perdre et retrouver ses devis sur n'importe quel téléphone.
- 🌙 **Mode clair / sombre** au choix.

Chaque PDF porte en bas une petite mention « Outil gratuit Maoba Marketing Digital »
avec le numéro WhatsApp de l'agence : chaque devis envoyé fait de la publicité pour Maoba.

## Comment l'utiliser

1. Ouvrir le lien du site sur le téléphone.
2. Au premier lancement, indiquer le nom de l'entreprise et un numéro de téléphone.
3. Remplir le client, ajouter les articles, vérifier le total.
4. Appuyer sur **Télécharger le PDF** ou **Envoyer sur WhatsApp**. C'est tout.

Astuce : ajouter la page à l'écran d'accueil du téléphone (« Ajouter à l'écran d'accueil »)
pour l'ouvrir comme une vraie application.

## Choix techniques (et pourquoi)

- **Site 100 % statique (HTML + CSS + JavaScript), sans framework et sans étape de build.**
  C'est le plus **léger** et le plus **rapide à charger** sur une connexion lente — priorité du projet.
- **Génération du PDF côté navigateur avec [jsPDF](https://github.com/parallax/jsPDF)**
  (la librairie est embarquée dans `vendor/` pour fonctionner même hors-ligne).
  La mise en page est dessinée à la main → texte **net et vectoriel**, pas une capture d'écran floue.
- **Sauvegarde locale (`localStorage`)** : les infos entreprise et l'historique des devis
  restent sur le téléphone de l'utilisateur. Pas de compte, pas de serveur, ça marche hors-ligne.
- **Supabase** sert à deux choses :
  1. enregistrer, au premier lancement, le **nom de l'entreprise + téléphone** (prise de contact pour Maoba) ;
  2. la **connexion en ligne optionnelle** (Supabase Auth, code par email / lien magique) qui sauvegarde
     la fiche entreprise et les documents par utilisateur, avec des règles de sécurité (RLS) garantissant
     qu'un utilisateur n'accède jamais aux données d'un autre.
  Si le réseau est absent, l'outil reste utilisable hors-ligne (les données locales suffisent).
- **Pas de variable d'environnement secrète à configurer** : seule la **clé publique** Supabase est utilisée
  côté navigateur (elle est conçue pour être exposée ; la sécurité repose sur les politiques RLS).

### À propos du code de connexion par email
La connexion utilise **Supabase Auth** avec un **code à 6 chiffres** (OTP). Ce choix est volontaire :
le code ne dépend d'aucun réglage de « Redirect URL » et fonctionne donc partout immédiatement, alors
qu'un lien magique nécessiterait d'autoriser l'URL du site dans le tableau de bord Supabase.

**Réglage à faire une seule fois** pour que le code apparaisse dans l'email : dans le tableau de bord
Supabase → **Authentication → Emails → modèle « Magic Link »**, ajouter une ligne contenant la variable
`{{ .Token }}`, par exemple :

```
Votre code de connexion Maoba est : {{ .Token }}
```

Tant que ce réglage n'est pas fait, l'email par défaut ne montre que le lien (inutilisé) et pas le code.
- **Hébergement GitHub Pages** (gratuit), déployé automatiquement à chaque mise à jour poussée
  sur la branche `master`. Site en ligne : **https://amzo098.github.io/maoba-devis-facture/**
  (un fichier `netlify.toml` est aussi fourni pour héberger sur Netlify si souhaité).

## Lancer en local

Aucune installation n'est nécessaire. Il suffit d'ouvrir `index.html` dans un navigateur,
ou de servir le dossier :

```bash
npx serve .
# ou
python -m http.server 8000
```

## Structure du projet

```
index.html   → l'écran de l'application
style.css    → mise en forme mobile-first
app.js       → toute la logique (calculs, sauvegarde, PDF, WhatsApp, historique)
vendor/      → librairie jsPDF embarquée
netlify.toml → configuration du déploiement
```

---

Outil offert par **Maoba Marketing Digital** — sites web, publicité, cartes Visa virtuelles.
WhatsApp : **+224 626 16 95 87**
