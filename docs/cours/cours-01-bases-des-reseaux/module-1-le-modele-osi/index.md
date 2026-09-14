# Module 1 : Le modèle OSI

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

_À compléter._

## 🖼️ Résumé visuel

Le modèle OSI découpe une communication en **sept responsabilités complémentaires**. À l’émission, chaque couche prépare les données pour la couche inférieure ; à la réception, le traitement se fait dans l’ordre inverse.

<div class="tssr-layers">
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">7</span>
    <span class="tssr-layer-name">Application</span>
    <span class="tssr-layer-desc">Services visibles : HTTP, DNS, SMTP</span>
    <span class="tssr-layer-tag">Données</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">6</span>
    <span class="tssr-layer-name">Présentation</span>
    <span class="tssr-layer-desc">Format, chiffrement TLS, compression</span>
    <span class="tssr-layer-tag">Données</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#8b5cf6;">
    <span class="tssr-layer-num">5</span>
    <span class="tssr-layer-name">Session</span>
    <span class="tssr-layer-desc">Ouverture, maintien et reprise du dialogue</span>
    <span class="tssr-layer-tag">Données</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#f59e0b;">
    <span class="tssr-layer-num">4</span>
    <span class="tssr-layer-name">Transport</span>
    <span class="tssr-layer-desc">TCP/UDP, fiabilité et numéros de port</span>
    <span class="tssr-layer-tag">Segment</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#3b82f6;">
    <span class="tssr-layer-num">3</span>
    <span class="tssr-layer-name">Réseau</span>
    <span class="tssr-layer-desc">IPv4/IPv6, choix du chemin, routeur</span>
    <span class="tssr-layer-tag">Paquet</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#10b981;">
    <span class="tssr-layer-num">2</span>
    <span class="tssr-layer-name">Liaison</span>
    <span class="tssr-layer-desc">Ethernet, adresse MAC, commutateur</span>
    <span class="tssr-layer-tag">Trame</span>
  </div>
  <div class="tssr-layer" style="--layer-color:#6b7280;">
    <span class="tssr-layer-num">1</span>
    <span class="tssr-layer-name">Physique</span>
    <span class="tssr-layer-desc">Câble, fibre, radio et signaux</span>
    <span class="tssr-layer-tag">Bits</span>
  </div>
</div>

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
