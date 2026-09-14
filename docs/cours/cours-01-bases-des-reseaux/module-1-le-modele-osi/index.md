# Module 1 : Le modèle OSI

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

_À compléter._

## 🖼️ Résumé visuel

Le modèle OSI découpe une communication en **sept responsabilités complémentaires**. À l’émission, chaque couche prépare les données pour la couche inférieure ; à la réception, le traitement se fait dans l’ordre inverse.

<figure class="tssr-figure">
  <div class="tssr-figure__canvas">
    <div class="tssr-osi-stack" role="img" aria-label="Les sept couches du modèle OSI avec leurs rôles, exemples et unités de données">
      <div class="tssr-osi-layer" style="--layer-color:#7c5bc4"><span class="tssr-osi-layer__number">7</span><strong>Application</strong><span>Services visibles : HTTP, DNS, SMTP</span><small>Données</small></div>
      <div class="tssr-osi-layer" style="--layer-color:#8b5fc7"><span class="tssr-osi-layer__number">6</span><strong>Présentation</strong><span>Format, chiffrement TLS, compression</span><small>Données</small></div>
      <div class="tssr-osi-layer" style="--layer-color:#7568cf"><span class="tssr-osi-layer__number">5</span><strong>Session</strong><span>Ouverture, maintien et reprise du dialogue</span><small>Données</small></div>
      <div class="tssr-osi-layer" style="--layer-color:#c47a18"><span class="tssr-osi-layer__number">4</span><strong>Transport</strong><span>TCP/UDP, fiabilité et numéros de port</span><small>Segment</small></div>
      <div class="tssr-osi-layer" style="--layer-color:#3978c5"><span class="tssr-osi-layer__number">3</span><strong>Réseau</strong><span>IPv4/IPv6, choix du chemin, routeur</span><small>Paquet</small></div>
      <div class="tssr-osi-layer" style="--layer-color:#159574"><span class="tssr-osi-layer__number">2</span><strong>Liaison</strong><span>Ethernet, adresse MAC, commutateur</span><small>Trame</small></div>
      <div class="tssr-osi-layer" style="--layer-color:#596675"><span class="tssr-osi-layer__number">1</span><strong>Physique</strong><span>Câble, fibre, radio et signaux</span><small>Bits</small></div>
    </div>
  </div>
  <figcaption>Lecture de haut en bas à l’émission : des données applicatives jusqu’aux bits transportés sur le support.</figcaption>
</figure>

## 📖 Cours consolidé

_À compléter._

## ✅ Points clés à retenir

_À compléter._

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi-data">
[
  {
    "question": "Exemple de question à remplacer",
    "options": ["Réponse A", "Réponse B", "Réponse C"],
    "correctIndex": 0,
    "explanation": "Explique ici pourquoi cette réponse est correcte."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi",
      dataId: "quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi-data",
    });
  });
</script>
