# Module 6 : L'adressage IPv6

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

Ce module présente la structure d'une adresse IPv6, ses règles de simplification, les grandes plages d'adresses réservées, les 3 catégories d'adresses (unicast, multicast, anycast), le détail des adresses lien-local et globales, les adresses de multidiffusion, et une synthèse des adresses qu'un hôte possède réellement.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Présentation générale de l'IPv6

L'**IPv6** (*Internet Protocol version 6*) est la version la plus récente du protocole Internet, conçue pour répondre aux limitations de l'IPv4 — en premier lieu, la pénurie d'adresses disponibles.

### Structure d'une adresse IPv6

Une adresse IPv6 est composée de **128 bits** (contre 32 bits pour IPv4, soit 4 fois plus), représentée sous forme de **8 groupes de 4 chiffres hexadécimaux** (appelés **quartets**), séparés par des `:`. Chaque quartet représente **16 bits**.

```
2001 : 0db8 : 85a3 : 0000 : 0000 : 8a2e : 0370 : 7334
└──── identifiant réseau ────┘         └── identifiant hôte ──┘
```

### Règles de simplification (format comprimé)

| Règle | Exemple |
|---|---|
| **1. Supprimer les zéros initiaux** de chaque quartet | `2001:0db8:0000:0000:8a2e:0370:7334` → `2001:db8:0:0:8a2e:370:7334` |
| **2. Remplacer une série continue de zéros par `::`** — une seule fois dans toute l'adresse | `2001:0db8:0000:0000:0000:ff00:0042:8329` → `2001:db8::ff00:42:8329` |

### Les avantages de l'IPv6

| Avantage | Détail |
|---|---|
| **Espace d'adressage massif** | ≈ 3,4 × 10³⁸ adresses possibles (contre 4,3 milliards en IPv4) — largement suffisant pour les décennies à venir, IoT compris |
| **Suppression du NAT** | Chaque appareil peut avoir sa propre adresse unique, sans besoin de traduction d'adresse |
| **Meilleure gestion des flux** | Prise en charge native de la **QoS** (qualité de service) |
| **Configuration simplifiée** | **Auto-configuration stateless** : un appareil génère automatiquement son adresse à partir du préfixe réseau annoncé |
| **Sécurité intégrée** | Inclut nativement **IPsec** pour le chiffrement et l'authentification des données |

### Compatibilité avec l'IPv4

IPv6 et IPv4 ne sont **pas directement compatibles** (structures différentes). Trois techniques permettent leur coexistence :

| Technique | Principe |
|---|---|
| **Double Stack** | L'appareil utilise les deux protocoles simultanément |
| **Tunneling** | Les paquets IPv6 sont encapsulés dans des paquets IPv4 pour traverser un réseau IPv4 |
| **NAT64** | Traduction d'adresses permettant à un appareil IPv6 de communiquer avec un appareil IPv4 |

---

## 2. Les grandes plages d'adresses IPv6

| Plage | Nom | Description | Équivalent IPv4 |
|---|---|---|---|
| **::/0** | Route par défaut | Représente tous les réseaux | ≈ 0.0.0.0/0 |
| **::/128** | Adresse non spécifiée | Utilisée par un hôte avant d'obtenir une adresse lien-local | — |
| **::1/128** | Boucle locale (loopback) | Test de connectivité locale | ≈ 127.0.0.1 |
| **FE80::/10** | Lien-local | Communication entre appareils du même réseau local, sans configuration | ≈ adresse APIPA |
| **FC00::/8** | Locale unique (*Unique-Local*, ULA) | Non routable sur Internet ; le 8ᵉ bit à 1 donne le préfixe usuel **FD00::/8** | ≈ adresses IPv4 privées |
| **FF00::/8** | Multidiffusion (multicast) | Envoi de paquets à plusieurs destinataires | — (pas d'équivalent direct) |
| **2000::/3** | Monodiffusion globale unique (GUA) | Adresses routables sur Internet | ≈ adresses IPv4 publiques |

---

## 3. Les 3 catégories fonctionnelles d'adresses IPv6

Indépendamment des plages ci-dessus, toute adresse IPv6 appartient à l'une de ces 3 catégories, selon **le nombre de destinataires visés** :

| Catégorie | Destinataires | Usage |
|---|---|---|
| **Unicast** (monodiffusion) | **Un seul** appareil identifié | Communication point à point classique |
| **Multicast** (multidiffusion) | **Un groupe** d'appareils | Remplace en grande partie le broadcast IPv4 (voir section 5) |
| **Anycast** | **Le nœud le plus proche** parmi un groupe partageant la même adresse | Optimisation du chemin réseau (ex. serveurs DNS répartis géographiquement) |

---

## 4. L'adresse de monodiffusion lien-local (FE80::/10)

Une adresse **lien-local** est **créée automatiquement** par chaque hôte pour communiquer avec les autres appareils du **même lien réseau** (même segment physique). Elle n'est **jamais routable**.

### Structure

```
Position :  /0        /10                              /64                /128
Champ    :  │ Préfixe │        54 bits à zéro          │ Identifiant d'interface │
Binaire  :  │1111111010│ 00 0000 0000 .... 0000 0000   │                          │
Hexa     :  │  FE80    │                                │                          │
```

- **Préfixe** : toujours `1111 1110 10` en binaire, soit `FE80` en hexadécimal — défini avec un masque **/10**, mais utilisé en pratique avec un préfixe **/64** (les 54 bits restants du préfixe sont à zéro).
- **Identifiant d'interface** (64 bits) : identifie l'interface réseau elle-même, généralement dérivé de son adresse MAC (format EUI-64) ou généré aléatoirement.

---

## 5. L'adresse de monodiffusion globale unique (GUA)

Les adresses **GUA** (*Global Unicast Addresses*) sont les adresses **routables sur Internet** — l'équivalent IPv6 des adresses publiques IPv4. Chaque appareil avec une GUA peut être directement joint depuis n'importe où dans le monde (sous réserve des règles de routage et de pare-feu en place).

### Structure

| Préfixe global | Identifiant de sous-réseau | Identifiant d'interface |
|---|---|---|
| **48 bits** | **16 bits** | **64 bits** |

| Champ | Rôle |
|---|---|
| **Préfixe global** (48 bits) | Identifie un réseau au niveau mondial — attribué par les registres Internet régionaux (**RIR**, ex. RIPE, ARIN) |
| **Identifiant de sous-réseau** (16 bits) | Permet à une organisation de diviser son réseau global en sous-réseaux |
| **Identifiant d'interface** (64 bits) | Identifie une interface unique, généralement dérivé de l'adresse MAC (EUI-64) ou configuré manuellement |

---

## 6. Les adresses de multidiffusion (FF00::/8)

Une adresse de **multidiffusion** (multicast) permet de livrer un même paquet à **tous les nœuds d'un groupe donné**, en une seule transmission — utile pour optimiser la bande passante quand plusieurs destinataires doivent recevoir le même flux.

### Format d'une adresse multicast

| 8 bits | 4 bits | 4 bits | 112 bits |
|---|---|---|---|
| **Préfixe** (toujours `FF`) | **Flags** | **Scope** (portée) | **Identifiant de groupe** |

- **Préfixe** : toujours `FF`, ce qui signale une adresse multicast.
- **Flags** : propriétés spécifiques de l'adresse.
- **Scope** : portée de la diffusion (lien local, site local, globale...).
- **Identifiant de groupe** : quel groupe de nœuds est visé.

### Exemples courants

| Adresse | Portée (scope) | Groupe visé |
|---|---|---|
| **FF02::1** | Lien local | Tous les nœuds du réseau local |
| **FF02::2** | Lien local | Tous les routeurs du réseau local |
| **FF02::1:2** | Lien local | Tous les serveurs/agents relais DHCP du lien local |
| **FF02::fb** | Lien local | Multidiffusion DNS (mDNS) |
| **FF05::1** | Site local | Tous les nœuds d'un site donné |
| **FF0E::101** | Globale | Multidiffusion spécifique au niveau mondial |

### Utilisations concrètes

- **Streaming audio/vidéo** : diffuser un flux à plusieurs destinataires sans le renvoyer individuellement à chacun.
- **Routage multicast** : des protocoles comme **PIM** (*Protocol Independent Multicast*) gèrent les groupes de diffusion.
- **Découverte de services** : **mDNS**, **SSDP** utilisent le multicast pour découvrir des appareils/services sur le réseau local.
- **Protocoles de routage internes** : **OSPF** utilise des adresses multicast pour échanger des informations entre routeurs.

---

## 7. Synthèse : les adresses IPv6 d'un hôte

En pratique, une seule machine hôte possède **simultanément plusieurs adresses IPv6**, chacune avec un rôle différent :

| Type d'adresse | Exemple | Rôle |
|---|---|---|
| **Boucle locale** | `::1/128` | Test de connectivité vers soi-même |
| **Lien-local** (1 par interface) | `FE80::...` | Communication avec les autres appareils du même segment réseau |
| **Locale unique** (0, 1 ou plusieurs) | `FD00::...` | Communication au sein d'un réseau privé, non routable sur Internet |
| **Globale unique** (0, 1 ou plusieurs) | `2000::...` | Communication routable sur Internet |
| **Multidiffusion** (plusieurs, automatiques) | `FF02::1` (tous les nœuds), adresses de nœud sollicité liées à chaque adresse unicast, adresses des groupes auxquels l'hôte est abonné | Réception de messages destinés à un groupe |

📌 **À retenir** : contrairement à IPv4 où un hôte a généralement **une seule** adresse IP par interface, un hôte IPv6 en a **toujours plusieurs simultanément** — au minimum une adresse de boucle locale et une adresse lien-local par interface, auxquelles s'ajoutent généralement une ou plusieurs adresses globales/locales uniques, plus les adresses multicast auxquelles il répond automatiquement.

---

## ✅ Points clés à retenir

- Une adresse IPv6 = **128 bits**, 8 quartets hexadécimaux de 16 bits chacun.
- Simplification : suppression des zéros initiaux par quartet + **un seul** `::` pour une série de quartets à zéro.
- 3 catégories fonctionnelles : **unicast** (1 destinataire), **multicast** (un groupe), **anycast** (le plus proche du groupe).
- Plages à connaître : `::1/128` (loopback), `FE80::/10` (lien-local, non routable), `FC00::/8` / `FD00::/8` (locale unique, non routable), `2000::/3` (globale, routable sur Internet), `FF00::/8` (multicast).
- L'adresse **lien-local** est créée automatiquement par chaque interface — indispensable même sans aucune configuration IPv6 explicite.
- L'adresse **GUA** est structurée en 3 blocs : préfixe global (48 bits, attribué par un RIR) + sous-réseau (16 bits) + identifiant d'interface (64 bits).
- Un hôte IPv6 possède **toujours plusieurs adresses simultanément** — ce n'est jamais « une seule IP par interface » comme on pourrait le penser en venant d'IPv4.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-6-l-adressage-ipv6"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-6-l-adressage-ipv6-data">
[
  {
    "question": "Sur combien de bits est codée une adresse IPv6 ?",
    "options": ["128 bits", "32 bits", "64 bits", "256 bits"],
    "correctIndex": 0,
    "explanation": "Une adresse IPv6 est codée sur 128 bits, soit quatre fois la taille d'une adresse IPv4 (32 bits), ce qui offre un espace d'adressage considérablement plus vaste."
  },
  {
    "question": "Comment une adresse IPv6 est-elle représentée en notation standard ?",
    "options": ["Quatre groupes de huit chiffres décimaux séparés par des points", "Huit groupes de quatre chiffres hexadécimaux séparés par des deux-points", "Seize groupes de deux chiffres binaires séparés par des tirets", "Six groupes de six chiffres hexadécimaux séparés par des virgules"],
    "correctIndex": 1,
    "explanation": "Une adresse IPv6 s'écrit sous la forme de huit groupes (quartets) de quatre chiffres hexadécimaux, chaque groupe représentant 16 bits, séparés par des deux-points, comme dans 2001:0db8:85a3:0000:0000:8a2e:0370:7334."
  },
  {
    "question": "Dans la simplification d'une adresse IPv6, combien de fois le symbole :: peut-il être utilisé dans une même adresse ?",
    "options": ["Deux fois maximum", "Autant de fois que nécessaire", "Une seule fois", "Uniquement au début de l'adresse"],
    "correctIndex": 2,
    "explanation": "Le symbole :: remplace une ou plusieurs séries continues de groupes à zéro, mais il ne peut apparaître qu'une seule fois dans une adresse, afin d'éviter toute ambiguïté sur le nombre de groupes qu'il représente."
  },
  {
    "question": "Quelle est l'adresse de boucle locale (loopback) en IPv6, équivalente à 127.0.0.1 en IPv4 ?",
    "options": ["::0", "FE80::1", "FF00::1", "::1"],
    "correctIndex": 3,
    "explanation": "L'adresse ::1 est l'équivalent IPv6 de l'adresse de boucle locale 127.0.0.1 en IPv4, utilisée pour tester la connectivité locale d'un appareil avec lui-même."
  },
  {
    "question": "À quelle plage d'adresses correspondent les adresses locales de lien (link-local) en IPv6 ?",
    "options": ["FE80::/10", "2000::/3", "FF00::/8", "::/0"],
    "correctIndex": 0,
    "explanation": "Les adresses locales de lien utilisent la plage FE80::/10 et permettent la communication entre appareils d'un même réseau local sans configuration particulière, un rôle comparable à celui des adresses APIPA en IPv4."
  },
  {
    "question": "Quelle plage d'adresses IPv6 correspond aux adresses globales routables sur Internet ?",
    "options": ["FE80::/10", "2000::/3", "FF00::/8", "::1/128"],
    "correctIndex": 1,
    "explanation": "Les adresses globales, routables sur Internet, appartiennent à la plage 2000::/3, contrairement aux adresses de lien-local ou de multidiffusion qui ont une portée plus restreinte."
  },
  {
    "question": "Pourquoi l'IPv6 permet-il de supprimer le recours au NAT (Network Address Translation) ?",
    "options": ["Parce que le NAT est incompatible avec le protocole ICMP", "Parce que l'IPv6 chiffre automatiquement toutes les communications", "Parce que l'espace d'adressage est suffisamment vaste pour attribuer une adresse unique à chaque appareil", "Parce que l'IPv6 n'utilise pas d'adresses IP pour les hôtes"],
    "correctIndex": 2,
    "explanation": "Grâce à un espace d'adressage bien plus vaste que celui de l'IPv4 (environ 3,4 × 10^38 adresses), chaque appareil peut disposer de sa propre adresse unique, ce qui élimine le besoin de traduire les adresses via le NAT."
  },
  {
    "question": "Quel mécanisme permet à un appareil IPv6 de générer automatiquement son adresse à partir du préfixe réseau, sans intervention manuelle ni serveur DHCP ?",
    "options": ["Le protocole NAT64", "Le tunneling IPv6-dans-IPv4", "La double pile (dual stack)", "L'auto-configuration stateless (SLAAC)"],
    "correctIndex": 3,
    "explanation": "L'auto-configuration stateless permet à un appareil de générer automatiquement son adresse IPv6 à partir du préfixe réseau annoncé, simplifiant considérablement la configuration réseau."
  },
  {
    "question": "Quelle technologie de sécurité est nativement intégrée au protocole IPv6 ?",
    "options": ["IPsec", "SSL/TLS", "WPA2", "Kerberos"],
    "correctIndex": 0,
    "explanation": "L'IPv6 inclut IPsec de façon native, permettant de chiffrer et d'authentifier les données échangées, alors qu'en IPv4 IPsec reste une extension optionnelle."
  },
  {
    "question": "Qu'est-ce que la technique du « Double Stack » pour assurer la coexistence entre IPv4 et IPv6 ?",
    "options": ["Les paquets IPv6 sont encapsulés dans des paquets IPv4", "Les appareils utilisent simultanément les deux protocoles IPv4 et IPv6", "Les adresses IPv6 sont traduites en adresses IPv4 par un routeur dédié", "Les appareils basculent automatiquement d'IPv4 vers IPv6 après un délai fixe"],
    "correctIndex": 1,
    "explanation": "Le Double Stack consiste à faire fonctionner les deux protocoles IPv4 et IPv6 simultanément sur un même appareil, lui permettant de communiquer indifféremment avec des hôtes IPv4 ou IPv6."
  },
  {
    "question": "Que permet la technique NAT64 dans un contexte de coexistence IPv4/IPv6 ?",
    "options": ["Encapsuler des paquets IPv6 à l'intérieur de paquets IPv4", "Faire fonctionner deux piles IPv4 et IPv6 en parallèle sur le même appareil", "Permettre à un appareil IPv6 de communiquer avec un appareil IPv4 grâce à une traduction d'adresses", "Chiffrer automatiquement le trafic entre deux réseaux IPv6"],
    "correctIndex": 2,
    "explanation": "NAT64 traduit les adresses entre IPv6 et IPv4, ce qui permet à un appareil disposant uniquement d'une adresse IPv6 de communiquer avec des services restés en IPv4."
  },
  {
    "question": "Parmi les trois catégories principales d'adresses IPv6, laquelle permet d'envoyer un paquet au nœud le plus proche parmi un groupe d'appareils partageant la même adresse ?",
    "options": ["Les adresses Unicast", "Les adresses Multicast", "Les adresses de boucle locale", "Les adresses Anycast"],
    "correctIndex": 3,
    "explanation": "Une adresse Anycast est partagée par plusieurs nœuds ; un paquet envoyé à cette adresse est délivré uniquement au nœud le plus proche selon les règles de routage, contrairement au multicast qui livre le paquet à tous les membres du groupe."
  },
  {
    "question": "Quel type d'adresse IPv6 remplace en grande partie les adresses de diffusion (broadcast) utilisées en IPv4 ?",
    "options": ["Les adresses Multicast", "Les adresses Unicast", "Les adresses Anycast", "Les adresses de lien-local uniquement"],
    "correctIndex": 0,
    "explanation": "L'IPv6 ne dispose pas d'adresses de diffusion comme l'IPv4 ; les adresses de multidiffusion (multicast) permettent d'envoyer un paquet à un groupe défini de destinataires, un rôle qui remplace en grande partie le broadcast."
  },
  {
    "question": "Dans la structure d'une adresse GUA (Global Unicast Address), combien de bits sont réservés à l'identifiant d'interface ?",
    "options": ["48 bits", "64 bits", "16 bits", "32 bits"],
    "correctIndex": 1,
    "explanation": "Une adresse GUA se divise en un préfixe global (48 bits), un identifiant de sous-réseau (16 bits) et un identifiant d'interface (64 bits), ce dernier étant souvent dérivé de l'adresse MAC via le format EUI-64."
  },
  {
    "question": "Qui attribue le préfixe global (48 bits) d'une adresse GUA au niveau mondial ?",
    "options": ["Le fournisseur d'accès Internet exclusivement", "Le serveur DHCP local de l'entreprise", "Les registres Internet régionaux (RIR), comme RIPE ou ARIN", "L'administrateur système de chaque machine individuellement"],
    "correctIndex": 2,
    "explanation": "Le préfixe global d'une adresse GUA est assigné par les registres Internet régionaux (RIR), tels que RIPE ou ARIN, qui identifient un réseau spécifique au niveau mondial."
  },
  {
    "question": "Quel préfixe commun partagent toutes les adresses de multidiffusion (multicast) en IPv6 ?",
    "options": ["FE80::/10", "2000::/3", "::1/128", "FF00::/8"],
    "correctIndex": 3,
    "explanation": "Toutes les adresses de multidiffusion IPv6 appartiennent à la plage FF00::/8, c'est-à-dire que leurs 8 premiers bits valent toujours FF."
  },
  {
    "question": "Dans la structure d'une adresse de multidiffusion IPv6, à quoi sert le champ « scope » ?",
    "options": ["À définir l'étendue de la diffusion (locale, site, globale, etc.)", "À identifier l'adresse MAC de l'expéditeur", "À indiquer le nombre de destinataires du groupe", "À chiffrer l'identifiant de groupe"],
    "correctIndex": 0,
    "explanation": "Le champ scope d'une adresse de multidiffusion précise la portée de la diffusion, par exemple lien-local, site-local ou globale, déterminant jusqu'où le paquet peut se propager."
  },
  {
    "question": "À quoi correspond l'adresse de multidiffusion FF02::1 ?",
    "options": ["Le groupe contenant tous les routeurs d'un réseau local", "Le groupe contenant tous les nœuds d'un réseau local (scope lien-local)", "Une multidiffusion spécifique au niveau mondial", "L'adresse de boucle locale équivalente à 127.0.0.1"],
    "correctIndex": 1,
    "explanation": "FF02::1 désigne, avec une portée lien-local, le groupe regroupant tous les nœuds présents sur le réseau local, tandis que FF02::2 désigne spécifiquement tous les routeurs de ce même réseau."
  },
  {
    "question": "Quel protocole de routage interne utilise des adresses multicast pour échanger des informations entre routeurs ?",
    "options": ["HTTP (Hypertext Transfer Protocol)", "FTP (File Transfer Protocol)", "OSPF (Open Shortest Path First)", "SMTP (Simple Mail Transfer Protocol)"],
    "correctIndex": 2,
    "explanation": "OSPF utilise des adresses de multidiffusion pour permettre aux routeurs d'échanger efficacement leurs informations de routage au sein d'un réseau interne."
  },
  {
    "question": "Combien d'adresses IPv6 uniques l'espace d'adressage permet-il théoriquement de générer, comparé aux 4,3 milliards d'adresses IPv4 ?",
    "options": ["Environ 4,3 × 10^9 adresses", "Environ 1,8 × 10^19 adresses", "Un nombre illimité d'adresses, sans aucune limite théorique", "Environ 3,4 × 10^38 adresses"],
    "correctIndex": 3,
    "explanation": "Grâce à ses 128 bits, l'espace d'adressage IPv6 permet de générer environ 3,4 × 10^38 adresses, un nombre considérablement plus grand que les 4,3 milliards d'adresses disponibles en IPv4."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-01-bases-des-reseaux-module-6-l-adressage-ipv6",
      dataId: "quiz-cours-01-bases-des-reseaux-module-6-l-adressage-ipv6-data",
    });
  });
</script>
