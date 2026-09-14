# Module 4 : Le routage

*Cours : [Cours 8 - Les services réseau en environnement Microsoft](../index.md)*

## 🎯 Objectif du module

Ce module explique le mécanisme du routage : la communication au sein d'un même réseau logique, la communication entre réseaux logiques différents (via un routeur), le fonctionnement du routeur, et le mécanisme de traduction d'adresse (NAT). Il se termine par deux démonstrations pratiques avec pfSense.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Le mécanisme du routage

Le **routage** permet la communication entre différents **réseaux logiques** — un réseau logique étant un ensemble d'adresses IP partageant le même masque de sous-réseau. Tant que deux postes sont sur le même réseau logique, ils communiquent directement via leurs adresses MAC. Dès que ce n'est plus le cas, il faut passer par un routeur, capable de faire le lien entre les réseaux.

### Les 3 éléments d'une route

1. **Adresse de réseau de destination** — où envoyer les données.
2. **Masque de sous-réseau** — permet de déterminer à quel réseau logique appartient une adresse.
3. **Adresse de passerelle** — la porte d'entrée à contacter pour atteindre le réseau cible.

### Statique vs dynamique

| Type | Fonctionnement |
|---|---|
| **Statique** | Route configurée manuellement, conservée après redémarrage. Simple, mais demande une intervention à chaque changement de topologie. |
| **Dynamique** | S'actualise automatiquement selon l'état du réseau. Plus complexe à mettre en place, mais plus résilient face aux pannes ou changements. |

---

## 2. Communication au sein d'un même réseau logique

Exemple : A (192.168.1.10) ping B (192.168.1.20), masque 255.255.255.0.

1. **Adresse locale ?** Non → on continue (sinon, ping vers `127.0.0.1`).
2. **Adresse réseau de A** : 192.168.1.10 & 255.255.255.0 → **192.168.1.0**
3. **Adresse réseau de B** : 192.168.1.20 & 255.255.255.0 → **192.168.1.0**
4. **Comparaison** : identiques → A et B sont sur le même réseau, pas besoin de routeur. *(Si différentes : erreur ICMP, ou passage par la passerelle si elle est configurée.)*
5. **Table ARP** : A doit connaître l'adresse **MAC** de B pour lui parler physiquement.
   - Connue → le ping part directement.
   - Inconnue → le ping est mis en attente, une requête ARP est envoyée pour résoudre l'adresse MAC, puis la table est mise à jour.

Cette logique (adresse locale → calcul réseau → comparaison → ARP) est la base de tout le raisonnement du module.

---

## 3. Communication entre réseaux logiques différents

### Mise en situation

4 postes (A, B, C, D), 2 domaines de diffusion, reliés par un routeur avec une patte dans chaque domaine (1R et 2R). Pour que A joigne D, A doit avoir une **passerelle par défaut** configurée — sans elle, aucune communication inter-réseaux n'est possible.

### Exemple chiffré

| Poste | Adresse IP | Masque | Passerelle |
|---|---|---|---|
| A | 192.168.1.10 | /24 | 192.168.1.254 |
| D | 192.168.2.140 | /26 | 192.168.2.254 |

A ping D (192.168.2.140) :

1. **Adresse locale ?** Non.
2. **Réseau de A** : 192.168.1.10 & /24 → **192.168.1.0**
3. **Réseau de D** : 192.168.2.140 & /26 → **192.168.2.128** *(le /26 découpe en blocs de 64 adresses ; 140 tombe dans le bloc débutant à 128)*
4. **Comparaison** : différentes → passage par la passerelle nécessaire.
5. **Passerelle configurée pour A ?** Oui (192.168.1.254) → on vérifie que A est bien sur le même réseau que sa passerelle (oui, logiquement).
6. **Table ARP** : cette fois pour l'adresse MAC **de la passerelle** (pas de D directement). Connue → envoi au routeur ; inconnue → requête ARP puis mise à jour.

### Sur le routeur

1. **Désencapsulation jusqu'à la couche 3** (OSI) pour lire l'IP de destination.
2. **Réseau connu dans la table de routage ?**
   - Non → erreur ICMP, paquet détruit.
   - Oui → est-ce un réseau **directement connecté** à une interface du routeur ?
     - Non → transmis au **routeur suivant**.
     - Oui → nouvelle vérification de la table ARP, cette fois pour l'adresse MAC du **destinataire final**.
3. MAC connue → en-tête mis à jour, transmission directe. MAC inconnue → attente + requête ARP.

📌 Chaque paquet est traité **indépendamment à chaque saut** : le routeur ne connaît que le prochain maillon, jamais l'itinéraire complet.

---

## 4. Le fonctionnement du routeur

À chaque paquet reçu, le routeur consulte l'**adresse IP de destination** et sa **table de routage**, puis prend l'une de ces 3 décisions :

| Décision | Quand ? | Résultat |
|---|---|---|
| **Transférer** | Réseau connu mais non directement connecté | Envoi au routeur suivant |
| **Abandonner** | Réseau inconnu de la table de routage | Paquet détruit |
| **Transmettre** | Réseau directement connecté | Livraison à l'hôte final |

---

## 5. Le NAT (Network Address Translation)

Une adresse IP **privée** (ex. 192.168.x.x) n'est **pas routable sur Internet** — aucun équipement public ne sait lui répondre directement.

### Scénario

| Élément | Adresse |
|---|---|
| Poste local | 192.168.20.13 |
| Routeur (LAN / pare-feu) | 192.168.20.254 |
| Routeur (adresse publique) | 90.83.178.224 |
| Serveur web distant | 80.87.128.67:80 |

**Sans NAT** : le serveur web tente de répondre directement à 192.168.20.13 — adresse privée non routable → la réponse est jetée, la communication échoue.

**Avec NAT** : le routeur remplace l'adresse source privée par sa propre **adresse publique** avant l'envoi. Le serveur distant répond donc à cette adresse publique. Le routeur utilise ensuite le **port** de la connexion initiale pour savoir vers quel poste local renvoyer la réponse.

📌 Le NAT est donc indispensable dès qu'une adresse privée doit dialoguer avec Internet.

---

## 6. Démonstration – Configuration initiale du pare-feu (pfSense)

**pfSense** : solution de routage/pare-feu libre, basée sur un noyau Linux.

**Installation** : lancer la VM → accepter la licence → Installer pfSense → clavier France → installation guidée en auto UFS → ne pas ouvrir le shell manuel, redémarrer → pas de VLAN → attribuer les cartes réseau aux interfaces **WAN** et **LAN**.

**Configuration réseau** :
- **WAN** : adresse récupérée en DHCP.
- **LAN** : par défaut 192.168.1.1, modifié ici en **192.168.1.254** (/24) pour éviter un conflit avec un autre serveur. Serveur DHCP désactivé sur le LAN dans cet exemple.

**Accès web** : HTTPS via l'adresse LAN, identifiants par défaut **admin / pfsense** (à changer immédiatement), puis assistant de configuration (fuseau horaire, réseau).

**Sécurité** : désactiver **« Block Private Networks »** (pour autoriser la communication entre réseaux privés) ; ajouter une règle WAN Source *Any* / Destination *Any* pour autoriser le trafic entrant dans le cadre de la démo.

---

## 7. Démonstration – Routage entre deux LAN (pfSense)

Objectif : faire communiquer deux infrastructures distinctes, chacune avec son pfSense et son client — comme deux sites d'entreprise à interconnecter.

**Configuration matérielle** : 2 cartes réseau par VM (Bridge = WAN, VMnet dédié = LAN), 2 CPU, 2 Go RAM.

**Adressage** :

| Interface | Adresse |
|---|---|
| WAN | 10.0.105.54 |
| LAN | 192.168.3.254 *(fixe, sans DHCP)* |

**Route statique** (pour joindre le LAN distant 192.168.2.0/24) :
```
Destination : 192.168.2.0/24
Gateway     : 10.0.105.38
```

Vérifier aussi qu'aucune **règle de pare-feu** ne bloque le trafic ICMP — un oubli fréquent.

**Test** :
```
ping 192.168.2.10
```
En cas d'échec : vérifier la **route statique** (destination/passerelle) et les **règles de pare-feu** sur les deux pfSense (chacun applique ses propres règles indépendamment).

---

## ✅ Points clés à retenir

- Une **route** = adresse réseau de destination + masque + passerelle.
- Deux postes communiquent directement uniquement s'ils partagent la **même adresse réseau** (calcul IP & masque) — c'est la base de tout le module.
- Sans **passerelle par défaut**, aucune communication n'est possible vers un réseau logique différent.
- Le routeur ne fait que 3 choses : **transférer**, **abandonner**, ou **transmettre** — décision prise indépendamment à chaque saut.
- Le **NAT** est indispensable pour qu'une adresse **privée** communique avec Internet (traduction via l'adresse publique + port).
- **pfSense** : solution libre de routage/pare-feu (Linux) ; les **routes statiques** y suivent exactement la même logique que la théorie (destination + passerelle).

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-4-le-routage"></div>

<script type="application/json" id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-4-le-routage-data">
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
      containerId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-4-le-routage",
      dataId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-4-le-routage-data",
    });
  });
</script>
