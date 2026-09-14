# TP - Plan d'adressage IP

*Rattaché au cours [Cours 1 - Bases des réseaux, Module 3 : L'adressage IPv4](../../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md).*

## Contexte

Une petite entreprise dispose du réseau `192.168.10.0/24` et souhaite le découper en 4 sous-réseaux pour séparer : Administration, Production, Invités et Serveurs.

## Objectifs

- Découper `192.168.10.0/24` en 4 sous-réseaux de taille égale.
- Identifier, pour chaque sous-réseau : adresse réseau, plage utilisable, adresse de broadcast.
- Attribuer les sous-réseaux aux 4 services.

## Étapes

1. Détermine combien de bits emprunter à la partie hôte pour obtenir 4 sous-réseaux (`2^n ≥ 4`).
2. Calcule le nouveau masque de sous-réseau.
3. Liste les 4 sous-réseaux obtenus avec leur plage d'adresses utilisables.
4. Attribue un sous-réseau à chaque service et justifie ton choix.

!!! question "Correction"
    Complète cette section une fois que tu as fait le TP par toi-même, pour t'auto-corriger plus tard.
