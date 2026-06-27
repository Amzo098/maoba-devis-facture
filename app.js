/* ============================================================
   Logique de l'outil de devis / facture Maoba.
   Tout fonctionne côté navigateur : aucune installation, aucun
   compte. Les données restent sur le téléphone (localStorage) ;
   seul le couple "nom entreprise + téléphone" est envoyé une fois
   à Maoba (Supabase) au premier lancement, pour la prise de contact.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- Configuration Supabase (capture de contacts) ---------- */
  // Clé publique "anon" : elle ne donne le droit que d'INSÉRER un contact
  // (voir la politique RLS côté base). Aucune donnée n'est lisible côté client.
  var SUPABASE_URL = "https://mllunncdtvapylmgtwec.supabase.co";
  var SUPABASE_KEY = "sb_publishable_OP0mdP-MxZZMoH__BIAEMg_QDX5rJFO";

  // Numéro WhatsApp de l'agence Maoba, affiché sur chaque PDF (pub gratuite).
  var MAOBA_WHATSAPP = "+224 626 16 95 87";

  /* ---------- Clés de sauvegarde locale ---------- */
  var CLE_ENTREPRISE = "maoba_entreprise";
  var CLE_COMPTEUR = "maoba_compteur";
  var CLE_HISTORIQUE = "maoba_historique";
  var CLE_CONFIG_FAITE = "maoba_config_faite";
  var CLE_CONTACT_PENDING = "maoba_contact_en_attente"; // contact non encore envoyé à Maoba

  /* ---------- État du document en cours ---------- */
  // On garde un objet simple en mémoire ; il est reconstruit depuis le DOM
  // au moment de générer le PDF, donc pas besoin de tout synchroniser.
  var typeDocument = "devis"; // "devis" ou "facture"
  var logoDataUrl = "";       // image du logo encodée (ou vide)
  var remiseType = "pct";     // "pct" ou "gnf"
  var acompteType = "pct";

  /* ---------- Petits utilitaires ---------- */
  function $(id) { return document.getElementById(id); }

  // Formate un nombre en GNF avec séparateurs de milliers : 1250000 -> "1 250 000 GNF"
  function gnf(n) {
    n = Math.round(Number(n) || 0);
    return n.toLocaleString("fr-FR").replace(/ /g, " ") + " GNF";
  }

  // Ne garde que les chiffres d'une saisie ("1 250 000", "1.250.000 GNF"...) -> 1250000.
  function nombreDepuisTexte(str) {
    var chiffres = String(str == null ? "" : str).replace(/\D/g, "");
    return chiffres ? parseInt(chiffres, 10) : 0;
  }

  // Affiche un nombre avec des espaces tous les 3 chiffres : 1250000 -> "1 250 000".
  function formaterMilliers(n) {
    return (Number(n) || 0).toLocaleString("fr-FR");
  }

  function toast(message) {
    var t = $("toast");
    t.textContent = message;
    t.hidden = false;
    clearTimeout(t._minuteur);
    t._minuteur = setTimeout(function () { t.hidden = true; }, 2600);
  }

  // Boîte de confirmation réutilisable. Affiche un texte et deux boutons clairs ;
  // appelle "onOui" seulement si l'utilisateur confirme. Évite le window.confirm()
  // (peu personnalisable et parfois mal rendu sur mobile).
  function confirmer(texte, onOui) {
    $("confirmation-texte").textContent = texte;
    $("confirmation").hidden = false;
    function fermer() {
      $("confirmation").hidden = true;
      $("confirmation-oui").removeEventListener("click", oui);
      $("confirmation-non").removeEventListener("click", non);
    }
    function oui() { fermer(); onOui(); }
    function non() { fermer(); }
    $("confirmation-oui").addEventListener("click", oui);
    $("confirmation-non").addEventListener("click", non);
  }

  /* ========================================================
     1) PREMIÈRE UTILISATION : écran d'accueil + capture contact
     ======================================================== */
  function configFaite() {
    return localStorage.getItem(CLE_CONFIG_FAITE) === "oui";
  }

  function afficherAccueilSiBesoin() {
    if (!configFaite()) {
      $("accueil").hidden = false;
    }
  }

  $("acc-valider").addEventListener("click", function () {
    var nom = $("acc-nom").value.trim();
    var tel = $("acc-tel").value.trim();
    if (!nom || !tel) {
      $("acc-erreur").hidden = false;
      return;
    }
    // On pré-remplit la fiche entreprise avec ces infos.
    var ent = chargerEntreprise();
    ent.nom = nom;
    ent.tel = tel;
    sauverEntreprise(ent);
    remplirChampsEntreprise(ent);

    localStorage.setItem(CLE_CONFIG_FAITE, "oui");
    $("accueil").hidden = true;

    // Envoi discret du contact à Maoba (n'empêche jamais l'utilisation).
    envoyerContactMaoba(nom, tel, "");
    toast("Bienvenue ! Tout est prêt 🎉");
  });

  // Envoie le contact à Supabase. En cas d'échec (pas de réseau), on n'embête JAMAIS
  // l'utilisateur ; on mémorise simplement le contact "en attente" et on réessaiera
  // tout seul au prochain démarrage, jusqu'à ce que l'envoi réussisse une fois (A6).
  function envoyerContactMaoba(nom, tel, ville) {
    var contact = { nom_entreprise: nom, telephone: tel, ville: ville || null };
    // On note l'envoi comme "en attente" tant qu'il n'a pas réussi.
    localStorage.setItem(CLE_CONTACT_PENDING, JSON.stringify(contact));
    try {
      fetch(SUPABASE_URL + "/rest/v1/maoba_devis_contacts", {
        method: "POST",
        headers: {
          "apikey": SUPABASE_KEY,
          "Authorization": "Bearer " + SUPABASE_KEY,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify(contact)
      }).then(function (rep) {
        // Réussi : on retire l'attente pour ne pas renvoyer en double.
        if (rep && rep.ok) localStorage.removeItem(CLE_CONTACT_PENDING);
      }).catch(function () { /* hors-ligne : on réessaiera au prochain démarrage */ });
    } catch (e) { /* on réessaiera au prochain démarrage */ }
  }

  // Au démarrage : s'il reste un contact non envoyé, on retente discrètement.
  function reessayerContactEnAttente() {
    var enAttente = localStorage.getItem(CLE_CONTACT_PENDING);
    if (!enAttente) return;
    try {
      var c = JSON.parse(enAttente);
      envoyerContactMaoba(c.nom_entreprise, c.telephone, c.ville);
    } catch (e) { /* donnée corrompue : on ignore */ }
  }

  /* ========================================================
     2) FICHE ENTREPRISE (sauvegardée automatiquement)
     ======================================================== */
  function chargerEntreprise() {
    try {
      return JSON.parse(localStorage.getItem(CLE_ENTREPRISE)) || {};
    } catch (e) { return {}; }
  }

  function sauverEntreprise(ent) {
    localStorage.setItem(CLE_ENTREPRISE, JSON.stringify(ent));
  }

  function remplirChampsEntreprise(ent) {
    $("ent-nom").value = ent.nom || "";
    $("ent-tel").value = ent.tel || "";
    $("ent-adresse").value = ent.adresse || "";
    if (ent.logo) {
      logoDataUrl = ent.logo;
      $("apercu-logo").src = ent.logo;
      $("apercu-logo").hidden = false;
      $("retirer-logo").hidden = false;
    }
  }

  // À chaque modification d'un champ entreprise, on enregistre tout de suite.
  function brancherSauvegardeEntreprise() {
    ["ent-nom", "ent-tel", "ent-adresse"].forEach(function (id) {
      $(id).addEventListener("input", function () {
        var ent = chargerEntreprise();
        ent.nom = $("ent-nom").value;
        ent.tel = $("ent-tel").value;
        ent.adresse = $("ent-adresse").value;
        ent.logo = logoDataUrl;
        sauverEntreprise(ent);
      });
    });
  }

  // Upload du logo : on lit l'image, puis on la REDIMENSIONNE et la compresse côté
  // navigateur (largeur max 500px) avant de la stocker. Une photo de logo prise au
  // téléphone fait souvent plusieurs Mo : sans cette étape, elle ralentirait l'app
  // et pourrait casser la génération du PDF. Tout cela est invisible pour l'utilisateur.
  $("ent-logo").addEventListener("change", function (e) {
    var fichier = e.target.files[0];
    if (!fichier) return;
    var lecteur = new FileReader();
    lecteur.onload = function (ev) {
      var img = new Image();
      img.onload = function () {
        var maxLargeur = 500;
        var ratio = Math.min(1, maxLargeur / img.width);
        var l = Math.round(img.width * ratio);
        var h = Math.round(img.height * ratio);
        var canvas = document.createElement("canvas");
        canvas.width = l;
        canvas.height = h;
        var ctx = canvas.getContext("2d");
        // Fond blanc : les logos transparents (PNG) restent nets sur le papier blanc du PDF.
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, l, h);
        ctx.drawImage(img, 0, 0, l, h);
        // JPEG qualité 0.85 : bon compromis netteté / poids.
        logoDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        $("apercu-logo").src = logoDataUrl;
        $("apercu-logo").hidden = false;
        $("retirer-logo").hidden = false;
        var ent = chargerEntreprise();
        ent.logo = logoDataUrl;
        sauverEntreprise(ent);
      };
      // Si l'image est illisible, on garde la donnée brute par sécurité.
      img.onerror = function () {
        logoDataUrl = ev.target.result;
        $("apercu-logo").src = logoDataUrl;
        $("apercu-logo").hidden = false;
        $("retirer-logo").hidden = false;
        var ent = chargerEntreprise();
        ent.logo = logoDataUrl;
        sauverEntreprise(ent);
      };
      img.src = ev.target.result;
    };
    lecteur.readAsDataURL(fichier);
  });

  $("retirer-logo").addEventListener("click", function () {
    logoDataUrl = "";
    $("ent-logo").value = "";
    $("apercu-logo").hidden = true;
    $("retirer-logo").hidden = true;
    var ent = chargerEntreprise();
    ent.logo = "";
    sauverEntreprise(ent);
  });

  /* ========================================================
     3) NUMÉRO DE DOCUMENT (auto-incrémenté) ET DATE
     ======================================================== */
  function prochainNumero() {
    var n = parseInt(localStorage.getItem(CLE_COMPTEUR) || "0", 10) + 1;
    var prefixe = typeDocument === "facture" ? "FACTURE" : "DEVIS";
    return prefixe + "-" + String(n).padStart(3, "0");
  }

  function incrementerCompteur() {
    var n = parseInt(localStorage.getItem(CLE_COMPTEUR) || "0", 10) + 1;
    localStorage.setItem(CLE_COMPTEUR, String(n));
  }

  function dateDuJourISO() {
    var d = new Date();
    var mois = String(d.getMonth() + 1).padStart(2, "0");
    var jour = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mois + "-" + jour;
  }

  function dateLisible(iso) {
    if (!iso) return "";
    var p = iso.split("-");
    return p[2] + "/" + p[1] + "/" + p[0]; // jj/mm/aaaa
  }

  /* ========================================================
     4) BASCULE Devis / Facture
     ======================================================== */
  function appliquerType(nouveau) {
    typeDocument = nouveau;
    var estDevis = nouveau === "devis";
    $("type-devis").classList.toggle("actif", estDevis);
    $("type-facture").classList.toggle("actif", !estDevis);
    $("lbl-numero").textContent = estDevis ? "N° du devis" : "N° de la facture";
    // On régénère le numéro proposé selon le type, s'il n'a pas été modifié à la main.
    if (!$("doc-numero")._modifie) {
      $("doc-numero").value = prochainNumero();
    }
  }

  $("type-devis").addEventListener("click", function () { appliquerType("devis"); });
  $("type-facture").addEventListener("click", function () { appliquerType("facture"); });
  $("doc-numero").addEventListener("input", function () { this._modifie = true; });

  /* ========================================================
     5) ARTICLES
     ======================================================== */
  var listeArticles = $("liste-articles");

  function creerLigneArticle(donnees) {
    donnees = donnees || {};
    var div = document.createElement("div");
    div.className = "article";
    div.innerHTML =
      '<label>Description</label>' +
      '<input class="desc" type="text" placeholder="Ex : Sac de ciment 50kg" />' +
      '<div class="article-qte-prix">' +
        '<div><label>Quantité</label>' +
          '<input class="qte" type="number" inputmode="numeric" min="0" value="1" /></div>' +
        '<div><label>Prix unitaire (GNF)</label>' +
          // Champ texte (et non "number") pour pouvoir afficher les milliers avec
          // des espaces pendant la frappe : 1 250 000, plus lisible et moins d'erreurs.
          '<input class="prix" type="text" inputmode="numeric" placeholder="0" /></div>' +
      '</div>' +
      '<div class="categorie">' +
        '<button type="button" class="cat-btn" data-cat="Matériaux">Matériaux</button>' +
        '<button type="button" class="cat-btn" data-cat="Main d\'œuvre">Main d\'œuvre</button>' +
      '</div>' +
      '<div class="article-bas">' +
        '<span class="article-total">0 GNF</span>' +
        '<button type="button" class="btn-retirer">🗑️ Retirer</button>' +
      '</div>';

    // Pré-remplissage (utile pour la duplication depuis l'historique).
    div.querySelector(".desc").value = donnees.desc || "";
    div.querySelector(".qte").value = donnees.qte != null ? donnees.qte : 1;
    div.querySelector(".prix").value = donnees.prix ? formaterMilliers(donnees.prix) : "";
    if (donnees.categorie) {
      div.querySelectorAll(".cat-btn").forEach(function (b) {
        if (b.dataset.cat === donnees.categorie) b.classList.add("actif");
      });
    }

    // Recalcul à chaque frappe.
    div.querySelector(".qte").addEventListener("input", function () { majLigne(div); });
    // Pour le prix : on reformate la saisie avec des espaces (milliers) en gardant
    // le curseur à la fin, puis on recalcule.
    div.querySelector(".prix").addEventListener("input", function () {
      var champ = this;
      var n = nombreDepuisTexte(champ.value);
      champ.value = n ? formaterMilliers(n) : "";
      majLigne(div);
    });

    // Catégorie facultative : on peut activer / désactiver d'un clic.
    div.querySelectorAll(".cat-btn").forEach(function (b) {
      b.addEventListener("click", function () {
        var dejaActif = b.classList.contains("actif");
        div.querySelectorAll(".cat-btn").forEach(function (x) { x.classList.remove("actif"); });
        if (!dejaActif) b.classList.add("actif");
      });
    });

    div.querySelector(".btn-retirer").addEventListener("click", function () {
      div.remove();
      majTotaux();
    });

    listeArticles.appendChild(div);
    majLigne(div);
    return div;
  }

  function majLigne(div) {
    var qte = Number(div.querySelector(".qte").value) || 0;
    var prix = nombreDepuisTexte(div.querySelector(".prix").value);
    div.querySelector(".article-total").textContent = gnf(qte * prix);
    majTotaux();
  }

  // Parcourt toutes les lignes et renvoie un tableau d'articles propres.
  function lireArticles() {
    var res = [];
    listeArticles.querySelectorAll(".article").forEach(function (div) {
      var desc = div.querySelector(".desc").value.trim();
      var qte = Number(div.querySelector(".qte").value) || 0;
      var prix = nombreDepuisTexte(div.querySelector(".prix").value);
      var catBtn = div.querySelector(".cat-btn.actif");
      if (desc === "" && prix === 0) return; // on ignore les lignes vides
      res.push({
        desc: desc || "Article",
        qte: qte,
        prix: prix,
        total: qte * prix,
        categorie: catBtn ? catBtn.dataset.cat : ""
      });
    });
    return res;
  }

  $("ajouter-article").addEventListener("click", function () {
    var div = creerLigneArticle();
    div.querySelector(".desc").focus();
  });

  /* ========================================================
     6) TOTAUX (sous-total, remise, total, acompte)
     ======================================================== */
  function calculer() {
    var articles = lireArticles();
    var sousTotal = articles.reduce(function (s, a) { return s + a.total; }, 0);

    var remiseVal = Number($("remise-valeur").value) || 0;
    var remise = remiseType === "pct" ? sousTotal * remiseVal / 100 : remiseVal;
    if (remise > sousTotal) remise = sousTotal;

    var total = sousTotal - remise;

    var acompteVal = Number($("acompte-valeur").value) || 0;
    var acompte = acompteType === "pct" ? total * acompteVal / 100 : acompteVal;
    if (acompte > total) acompte = total;

    return { articles: articles, sousTotal: sousTotal, remise: remise, total: total, acompte: acompte };
  }

  function majTotaux() {
    var c = calculer();
    $("affiche-soustotal").textContent = gnf(c.sousTotal);
    $("affiche-total").textContent = gnf(c.total);

    $("ligne-remise-affiche").hidden = c.remise <= 0;
    $("affiche-remise").textContent = "- " + gnf(c.remise);

    $("ligne-acompte-affiche").hidden = c.acompte <= 0;
    $("affiche-acompte").textContent = gnf(c.acompte);
  }

  ["remise-valeur", "acompte-valeur"].forEach(function (id) {
    $(id).addEventListener("input", majTotaux);
  });

  // Bascules % / GNF pour remise et acompte.
  function brancherBasculeMontant(btnPct, btnGnf, set) {
    $(btnPct).addEventListener("click", function () {
      set("pct"); $(btnPct).classList.add("actif"); $(btnGnf).classList.remove("actif"); majTotaux();
    });
    $(btnGnf).addEventListener("click", function () {
      set("gnf"); $(btnGnf).classList.add("actif"); $(btnPct).classList.remove("actif"); majTotaux();
    });
  }
  brancherBasculeMontant("remise-pct", "remise-gnf", function (v) { remiseType = v; });
  brancherBasculeMontant("acompte-pct", "acompte-gnf", function (v) { acompteType = v; });

  /* ========================================================
     7) CONDITIONS PAR DÉFAUT
     ======================================================== */
  function conditionsParDefaut() {
    if (!$("cond-validite").value) $("cond-validite").value = "Ce devis est valable 30 jours.";
    if (!$("cond-paiement").value) $("cond-paiement").value = "Paiement à la commande / à la livraison.";
    if (!$("cond-delai").value) $("cond-delai").value = "Délai à convenir avec le client.";
  }

  /* ========================================================
     8) RASSEMBLER LE DOCUMENT (pour PDF + historique)
     ======================================================== */
  function rassemblerDocument() {
    var c = calculer();
    return {
      type: typeDocument,
      numero: $("doc-numero").value.trim() || prochainNumero(),
      date: $("doc-date").value || dateDuJourISO(),
      entreprise: {
        nom: $("ent-nom").value.trim(),
        tel: $("ent-tel").value.trim(),
        adresse: $("ent-adresse").value.trim(),
        logo: logoDataUrl
      },
      client: {
        nom: $("cli-nom").value.trim(),
        tel: $("cli-tel").value.trim(),
        adresse: $("cli-adresse").value.trim()
      },
      articles: c.articles,
      sousTotal: c.sousTotal,
      remise: c.remise,
      total: c.total,
      acompte: c.acompte,
      conditions: {
        validite: $("cond-validite").value.trim(),
        paiement: $("cond-paiement").value.trim(),
        delai: $("cond-delai").value.trim()
      }
    };
  }

  /* ========================================================
     9) GÉNÉRATION DU PDF (mise en page manuelle = rendu net)
     ======================================================== */
  function genererPdf(doc) {
    var jsPDF = window.jspdf.jsPDF;
    var pdf = new jsPDF({ unit: "mm", format: "a4" });
    var L = 15;            // marge gauche
    var R = 195;           // marge droite (210 - 15)
    var y = 18;
    var vert = [10, 125, 90];
    var gris = [110, 124, 119];

    // --- Logo (optionnel) ---
    if (doc.entreprise.logo) {
      try {
        // On calcule la largeur réelle pour garder les proportions, hauteur fixée à 22mm.
        var props = pdf.getImageProperties(doc.entreprise.logo);
        var hLogo = 22;
        var lLogo = props.width * (hLogo / props.height);
        if (lLogo > 60) { lLogo = 60; hLogo = props.height * (lLogo / props.width); }
        pdf.addImage(doc.entreprise.logo, L, y - 4, lLogo, hLogo);
      } catch (e) { /* format d'image non géré : on continue sans */ }
    }

    // --- En-tête entreprise (à droite) ---
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.setTextColor(28, 43, 39);
    pdf.text(doc.entreprise.nom || "Mon entreprise", R, y, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(gris[0], gris[1], gris[2]);
    var yEnt = y + 6;
    if (doc.entreprise.tel) { pdf.text("Tél : " + doc.entreprise.tel, R, yEnt, { align: "right" }); yEnt += 5; }
    if (doc.entreprise.adresse) { pdf.text(doc.entreprise.adresse, R, yEnt, { align: "right" }); yEnt += 5; }

    y = Math.max(yEnt, y + 24) + 6;

    // --- Bandeau titre (DEVIS / FACTURE) ---
    pdf.setFillColor(vert[0], vert[1], vert[2]);
    pdf.rect(L, y, R - L, 14, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text(doc.type === "facture" ? "FACTURE" : "DEVIS", L + 4, y + 9.5);
    pdf.setFontSize(11);
    pdf.text(doc.numero, R - 4, y + 6, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.text("Date : " + dateLisible(doc.date), R - 4, y + 11, { align: "right" });
    y += 22;

    // --- Bloc client ---
    pdf.setTextColor(28, 43, 39);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("Adressé à :", L, y);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    y += 6;
    pdf.text(doc.client.nom || "—", L, y); y += 5;
    if (doc.client.tel) { pdf.text("Tél : " + doc.client.tel, L, y); y += 5; }
    if (doc.client.adresse) { pdf.text(doc.client.adresse, L, y); y += 5; }
    y += 4;

    // --- Tableau des articles : en-tête ---
    var colDesc = L + 2;
    var colQte = 120;
    var colPrix = 145;
    var colTot = R - 2;
    pdf.setFillColor(230, 244, 238);
    pdf.rect(L, y, R - L, 9, "F");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(9.5);
    pdf.setTextColor(7, 92, 66);
    pdf.text("Description", colDesc, y + 6);
    pdf.text("Qté", colQte, y + 6, { align: "right" });
    pdf.text("Prix unit.", colPrix, y + 6, { align: "right" });
    pdf.text("Total", colTot, y + 6, { align: "right" });
    y += 9;

    // --- Lignes ---
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor(28, 43, 39);
    pdf.setFontSize(9.5);
    doc.articles.forEach(function (a) {
      // Saut de page si on arrive en bas.
      if (y > 250) { pdf.addPage(); y = 20; }
      var libelle = a.desc + (a.categorie ? "  (" + a.categorie + ")" : "");
      var lignes = pdf.splitTextToSize(libelle, colQte - colDesc - 4);
      var hauteur = Math.max(7, lignes.length * 5 + 2);
      pdf.text(lignes, colDesc, y + 5);
      pdf.text(String(a.qte), colQte, y + 5, { align: "right" });
      pdf.text(gnf(a.prix).replace(" GNF", ""), colPrix, y + 5, { align: "right" });
      pdf.text(gnf(a.total).replace(" GNF", ""), colTot, y + 5, { align: "right" });
      y += hauteur;
      pdf.setDrawColor(212, 221, 217);
      pdf.line(L, y, R, y);
    });
    y += 6;

    // --- Totaux (alignés à droite) ---
    function ligneTotal(libelle, valeur, gras, taille) {
      pdf.setFont("helvetica", gras ? "bold" : "normal");
      pdf.setFontSize(taille || 10);
      pdf.text(libelle, 130, y, { align: "right" });
      pdf.text(valeur, colTot, y, { align: "right" });
      y += gras ? 8 : 6;
    }
    ligneTotal("Sous-total :", gnf(doc.sousTotal), false);
    if (doc.remise > 0) ligneTotal("Remise :", "- " + gnf(doc.remise), false);
    pdf.setTextColor(7, 92, 66);
    ligneTotal("TOTAL :", gnf(doc.total), true, 13);
    pdf.setTextColor(28, 43, 39);
    if (doc.acompte > 0) ligneTotal("Acompte demandé :", gnf(doc.acompte), false);
    y += 4;

    // --- Conditions ---
    if (y > 250) { pdf.addPage(); y = 20; }
    pdf.setDrawColor(212, 221, 217);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text("Conditions", L, y); y += 6;
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(gris[0], gris[1], gris[2]);
    [["Validité", doc.conditions.validite],
     ["Paiement", doc.conditions.paiement],
     ["Délai", doc.conditions.delai]].forEach(function (c) {
      if (!c[1]) return;
      var t = pdf.splitTextToSize(c[0] + " : " + c[1], R - L);
      pdf.text(t, L, y);
      y += t.length * 5;
    });

    // --- Pied de page Maoba (pub gratuite) sur chaque page ---
    var total = pdf.internal.getNumberOfPages();
    for (var p = 1; p <= total; p++) {
      pdf.setPage(p);
      pdf.setDrawColor(212, 221, 217);
      pdf.line(L, 284, R, 284);
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(8);
      pdf.setTextColor(gris[0], gris[1], gris[2]);
      pdf.text("Devis généré avec l'outil gratuit Maoba Marketing Digital — WhatsApp " + MAOBA_WHATSAPP,
        105, 289, { align: "center" });
    }

    return pdf;
  }

  function nomFichier(doc) {
    var base = (doc.type === "facture" ? "Facture" : "Devis") + "_" +
      (doc.client.nom || "client").replace(/[^a-zA-Z0-9]+/g, "-");
    return base + ".pdf";
  }

  /* ========================================================
     10) BOUTONS PDF / WHATSAPP
     ======================================================== */
  function documentValide(doc) {
    if (doc.articles.length === 0) {
      toast("Ajoutez au moins un article avant de générer le document.");
      return false;
    }
    return true;
  }

  $("btn-pdf").addEventListener("click", function () {
    var doc = rassemblerDocument();
    if (!documentValide(doc)) return;
    var btn = $("btn-pdf");
    if (btn.disabled) return;             // évite les double-clics
    var libelle = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Génération en cours…";
    // setTimeout : laisse le navigateur afficher l'état "en cours" avant le travail.
    setTimeout(function () {
      try {
        var pdf = genererPdf(doc);
        pdf.save(nomFichier(doc));
        finaliserDocument(doc);
        toast("PDF téléchargé ✅");
      } finally {
        btn.disabled = false;
        btn.textContent = libelle;
      }
    }, 30);
  });

  // Vérifie le numéro du client avant l'envoi WhatsApp.
  // Renvoie "vide", "invalide" ou "ok".
  function validerTelClient(tel) {
    var brut = (tel || "").trim();
    if (!brut) return "vide";
    if (/[a-zA-Z]/.test(brut)) return "invalide";
    var chiffres = brut.replace(/\D/g, "");
    if (chiffres.length < 8) return "invalide"; // un mobile guinéen fait 9 chiffres
    return "ok";
  }

  // Construit le lien wa.me vers le client (préfixe pays Guinée 224 si absent).
  function lienWhatsAppClient(doc) {
    var chiffres = (doc.client.tel || "").replace(/\D/g, "");
    if (chiffres.indexOf("224") !== 0) chiffres = "224" + chiffres;
    return "https://wa.me/" + chiffres + "?text=" + encodeURIComponent(resumeWhatsApp(doc));
  }

  $("btn-whatsapp").addEventListener("click", function () {
    var doc = rassemblerDocument();
    if (!documentValide(doc)) return;

    // A3 : on a besoin d'un numéro de client valide pour pouvoir lui envoyer.
    var etatTel = validerTelClient(doc.client.tel);
    if (etatTel === "vide") {
      toast("Ajoutez le numéro du client pour pouvoir lui envoyer directement.");
      $("cli-tel").focus();
      return;
    }
    if (etatTel === "invalide") {
      toast("Le numéro du client semble incorrect. Vérifiez-le.");
      $("cli-tel").focus();
      return;
    }

    var pdf = genererPdf(doc);
    var fichier = new File([pdf.output("blob")], nomFichier(doc), { type: "application/pdf" });

    // Cas idéal : le téléphone sait partager un fichier (Android récent).
    // On partage le PDF directement, l'utilisateur choisit WhatsApp dans la liste.
    if (navigator.canShare && navigator.canShare({ files: [fichier] })) {
      navigator.share({
        files: [fichier],
        title: doc.numero,
        text: resumeWhatsApp(doc)
      }).then(function () {
        finaliserDocument(doc);
      }).catch(function () { /* annulé par l'utilisateur : on ne fait rien */ });
      return;
    }

    // A2 : solution de repli expliquée pas à pas pour un débutant.
    // On télécharge le PDF, on montre les étapes, puis on ouvre la discussion du client.
    pdf.save(nomFichier(doc));
    finaliserDocument(doc);
    var url = lienWhatsAppClient(doc);
    $("whatsapp-aide").hidden = false;
    $("whatsapp-continuer").onclick = function () {
      $("whatsapp-aide").hidden = true;
      window.open(url, "_blank");
    };
    $("whatsapp-fermer").onclick = function () { $("whatsapp-aide").hidden = true; };
  });

  function resumeWhatsApp(doc) {
    var titre = doc.type === "facture" ? "Facture" : "Devis";
    return titre + " " + doc.numero + "\n" +
      (doc.entreprise.nom || "") + "\n" +
      "Montant total : " + gnf(doc.total) +
      (doc.acompte > 0 ? "\nAcompte : " + gnf(doc.acompte) : "");
  }

  // Après génération réussie : on incrémente le compteur, on enregistre dans
  // l'historique, et on prépare un nouveau numéro.
  function finaliserDocument(doc) {
    incrementerCompteur();
    ajouterHistorique(doc);
    $("doc-numero")._modifie = false;
    $("doc-numero").value = prochainNumero();
  }

  /* ========================================================
     11) HISTORIQUE "MES DEVIS"
     ======================================================== */
  function chargerHistorique() {
    try { return JSON.parse(localStorage.getItem(CLE_HISTORIQUE)) || []; }
    catch (e) { return []; }
  }

  function ajouterHistorique(doc) {
    var histo = chargerHistorique();
    histo.unshift({
      id: Date.now(),
      doc: doc,
      apercu: {
        type: doc.type,
        numero: doc.numero,
        client: doc.client.nom,
        date: doc.date,
        total: doc.total
      }
    });
    // On garde les 50 derniers pour ne pas saturer le stockage du téléphone.
    if (histo.length > 50) histo = histo.slice(0, 50);
    localStorage.setItem(CLE_HISTORIQUE, JSON.stringify(histo));
  }

  function afficherHistorique() {
    var histo = chargerHistorique();
    var c = $("liste-historique");
    if (histo.length === 0) {
      c.innerHTML = '<p class="histo-vide">Aucun document pour le moment.<br>Créez votre premier devis !</p>';
    } else {
      c.innerHTML = "";
      histo.forEach(function (item) {
        var a = item.apercu;
        var div = document.createElement("div");
        div.className = "ligne-histo";
        div.innerHTML =
          '<div class="h-titre">' + (a.type === "facture" ? "Facture" : "Devis") +
            " " + a.numero + '</div>' +
          '<div class="h-info">' + (a.client || "Client") + " · " +
            dateLisible(a.date) + " · " + gnf(a.total) + '</div>' +
          '<div class="h-actions">' +
            '<button data-act="pdf">⬇️ PDF</button>' +
            '<button data-act="ouvrir">✏️ Modifier</button>' +
            '<button data-act="dupliquer">📄 Dupliquer</button>' +
          '</div>';
        div.querySelector('[data-act="pdf"]').addEventListener("click", function () {
          genererPdf(item.doc).save(nomFichier(item.doc));
          toast("PDF téléchargé ✅");
        });
        div.querySelector('[data-act="ouvrir"]').addEventListener("click", function () {
          chargerDansFormulaire(item.doc, true);
          fermerHistorique();
        });
        div.querySelector('[data-act="dupliquer"]').addEventListener("click", function () {
          chargerDansFormulaire(item.doc, false);
          fermerHistorique();
        });
        c.appendChild(div);
      });
    }
    $("panneau-historique").hidden = false;
  }

  function fermerHistorique() { $("panneau-historique").hidden = true; }

  $("btn-mes-devis").addEventListener("click", afficherHistorique);
  $("fermer-historique").addEventListener("click", fermerHistorique);

  // Recharge un document dans le formulaire. "memeNumero" = true pour modifier,
  // false pour dupliquer (nouveau numéro).
  function chargerDansFormulaire(doc, memeNumero) {
    appliquerType(doc.type);
    $("cli-nom").value = doc.client.nom || "";
    $("cli-tel").value = doc.client.tel || "";
    $("cli-adresse").value = doc.client.adresse || "";
    $("doc-date").value = memeNumero ? doc.date : dateDuJourISO();
    if (memeNumero) { $("doc-numero").value = doc.numero; $("doc-numero")._modifie = true; }
    else { $("doc-numero")._modifie = false; $("doc-numero").value = prochainNumero(); }

    $("cond-validite").value = doc.conditions.validite || "";
    $("cond-paiement").value = doc.conditions.paiement || "";
    $("cond-delai").value = doc.conditions.delai || "";

    $("remise-valeur").value = "";
    $("acompte-valeur").value = "";

    listeArticles.innerHTML = "";
    doc.articles.forEach(function (a) { creerLigneArticle(a); });
    if (doc.articles.length === 0) creerLigneArticle();

    majTotaux();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast(memeNumero ? "Document ouvert ✏️" : "Document dupliqué 📄");
  }

  /* ========================================================
     12) NOUVEAU DOCUMENT (vider le client, garder l'entreprise)
     ======================================================== */
  function viderDocumentEnCours() {
    ["cli-nom", "cli-tel", "cli-adresse", "remise-valeur", "acompte-valeur"].forEach(function (id) {
      $(id).value = "";
    });
    listeArticles.innerHTML = "";
    creerLigneArticle();
    $("doc-numero")._modifie = false;
    $("doc-numero").value = prochainNumero();
    $("doc-date").value = dateDuJourISO();
    majTotaux();
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Nouveau document prêt 🆕");
  }

  // Y a-t-il quelque chose à perdre ? (client renseigné, ou un article avec un prix)
  function documentEnCoursRempli() {
    if ($("cli-nom").value.trim() || $("cli-tel").value.trim() || $("cli-adresse").value.trim()) return true;
    return lireArticles().some(function (a) { return a.prix > 0; });
  }

  $("btn-nouveau").addEventListener("click", function () {
    // On ne dérange l'utilisateur avec une confirmation que s'il a déjà saisi des infos.
    if (documentEnCoursRempli()) {
      confirmer("Effacer ce document en cours ? Vos infos d'entreprise seront gardées.", viderDocumentEnCours);
    } else {
      viderDocumentEnCours();
    }
  });

  /* ========================================================
     13) THÈME CLAIR / SOMBRE (préférence gardée sur le téléphone)
     ======================================================== */
  var CLE_THEME = "maoba_theme";

  function appliquerTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      $("btn-theme").textContent = "☀️"; // proposer de revenir au clair
    } else {
      document.documentElement.removeAttribute("data-theme");
      $("btn-theme").textContent = "🌙"; // proposer de passer au sombre
    }
    localStorage.setItem(CLE_THEME, theme);
  }

  $("btn-theme").addEventListener("click", function () {
    var actuel = localStorage.getItem(CLE_THEME) === "dark" ? "dark" : "clair";
    appliquerTheme(actuel === "dark" ? "clair" : "dark");
  });

  function chargerTheme() {
    var enregistre = localStorage.getItem(CLE_THEME);
    if (enregistre) {
      appliquerTheme(enregistre);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      // Premier lancement : on respecte le réglage du téléphone.
      appliquerTheme("dark");
    } else {
      appliquerTheme("clair");
    }
  }

  /* ========================================================
     14) DÉMARRAGE
     ======================================================== */
  function demarrer() {
    chargerTheme();
    remplirChampsEntreprise(chargerEntreprise());
    brancherSauvegardeEntreprise();
    conditionsParDefaut();
    $("doc-date").value = dateDuJourISO();
    $("doc-numero").value = prochainNumero();
    creerLigneArticle(); // une première ligne vide prête à l'emploi
    majTotaux();
    afficherAccueilSiBesoin();
    reessayerContactEnAttente(); // A6 : renvoi silencieux d'un contact resté en attente
  }

  demarrer();
})();
