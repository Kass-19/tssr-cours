# Module 4 : La communication

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

Ce module explique le domaine de diffusion (broadcast), le déroulé pas à pas de la communication entre deux postes (même réseau, puis réseaux différents via un routeur), le fonctionnement du routage (table de routage, types de routage), et le sur-réseau (supernetting).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Le domaine de diffusion (broadcast domain)

Un **domaine de diffusion** est une portion logique du réseau dans laquelle une **trame de diffusion** (broadcast) est transmise à **tous** les appareils connectés.

### La diffusion (broadcast)

Une trame/paquet de diffusion est envoyé avec une **adresse de destination spéciale** :

| Couche | Adresse de broadcast |
|---|---|
| **Couche 2** (Liaison) | Adresse MAC `FF:FF:FF:FF:FF:FF` |
| **Couche 3** (Réseau) | Adresse IP avec tous les bits hôte à 1 (ex. `192.168.1.255` pour un réseau en /24) |

Tous les appareils du domaine reçoivent ce message, même s'il ne leur est pas destiné individuellement. Usages typiques : découverte de machines (**DHCP**), résolution d'adresses (**ARP**).

### Ce qui délimite un domaine de diffusion

| Équipement | Effet sur le domaine de diffusion |
|---|---|
| **Switch (commutateur)** | Transmet la diffusion à tous les ports d'un même VLAN — **n'arrête pas** la diffusion |
| **Routeur** | **Délimite** les domaines de diffusion : il ne transmet **jamais** une trame de diffusion d'un réseau vers un autre |
| **VLAN** | Chaque VLAN = un domaine de diffusion distinct, même sur un switch physique commun |

### Pourquoi c'est important

Un domaine de diffusion trop grand pose un problème de **performance** : chaque appareil doit traiter chaque diffusion, même non destinée. C'est pourquoi les réseaux modernes sont **segmentés** (via routeurs et/ou VLANs), ce qui permet de réduire le trafic inutile, améliorer les performances, et mieux sécuriser la communication entre segments.

**Exemple** : 10 PC connectés au même VLAN appartiennent au même domaine de diffusion — une requête ARP de l'un est reçue par les 9 autres. Avec un routeur ou des VLANs distincts, cette diffusion resterait limitée au sous-réseau d'origine.

---

## 2. La communication entre deux postes du même réseau

Voici l'algorithme suivi lorsqu'un poste **A** (192.168.1.10/24, MAC `...1A`) ping un poste **B** (192.168.1.20/24, MAC `...1B`), tous deux sur le même réseau logique :

```
1. Adresse demandée locale (127.0.0.1) ?
      OUI → ping vers la boucle locale
      NON → continuer

2. Calcul du réseau logique de A  : 192.168.1.10 & 255.255.255.0 → 192.168.1.0
   Calcul du réseau logique de B  : 192.168.1.20 & 255.255.255.0 → 192.168.1.0

3. Les deux réseaux sont-ils identiques ?
      NON → erreur ICMP, ou envoi vers la passerelle (GW) si elle est renseignée
      OUI → continuer (A et B sont sur le même réseau)

4. La table ARP de A connaît-elle déjà l'adresse MAC de B ?
      OUI → le ping est envoyé directement
      NON → une requête ARP est diffusée : « qui a 192.168.1.20 ? », le ping est mis en attente

5. Une réponse ARP est-elle reçue ?
      NON → erreur ICMP
      OUI → la table ARP de A est mise à jour, puis le ping est envoyé à B
```

### Détail des trames échangées (requête/réponse ARP)

| Étape | Destinataire (MAC) | Source (MAC) | Destinataire (IP) | Source (IP) |
|---|---|---|---|---|
| **Requête ARP** (diffusion) | `FF:FF:FF:FF:FF:FF` | MAC de A | 192.168.1.20 | 192.168.1.10 |
| **Réponse ARP** (de B vers A) | MAC de A | MAC de B | 192.168.1.10 | 192.168.1.20 |

Une fois la réponse reçue, la table ARP de A est mise à jour avec la correspondance IP ↔ MAC de B, et le ping peut être envoyé directement.

---

## 3. La communication entre deux postes de réseaux différents

Si le poste **A** (192.168.1.10/24, passerelle 192.168.1.254) veut joindre le poste **D** (192.168.2.140/26, passerelle 192.168.2.254), les deux réseaux sont différents (192.168.1.0 ≠ 192.168.2.128 avec un masque /26) : le ping doit passer par le **routeur**, via la passerelle par défaut de A.

### Côté poste A — avant d'atteindre le routeur

Même logique que la section 2, sauf qu'à l'étape 3 (« réseaux différents »), A envoie le ping vers sa **passerelle** — ce qui implique d'abord de résoudre l'adresse MAC de cette passerelle via ARP, exactement comme pour un poste classique.

### Côté routeur — une fois le ping reçu

```
1. Désencapsulation jusqu'à la couche 3 (lecture de l'IP de destination)

2. Le réseau de destination est-il dans la table de routage du routeur ?
      NON → erreur ICMP, paquet détruit
      OUI → continuer

3. Ce réseau est-il directement connecté à une interface du routeur (réseau local) ?
      NON → le ping est transmis au routeur suivant
      OUI → continuer

4. La table ARP du routeur connaît-elle l'adresse MAC du destinataire final (D) ?
      OUI → les adresses MAC de la trame sont mises à jour, le ping est transmis directement à D
      NON → une requête ARP est diffusée pour trouver l'adresse MAC de D, le ping est mis en attente

5. Une réponse ARP est-elle reçue ?
      NON → erreur ICMP
      OUI → la table ARP du routeur est mise à jour, les adresses MAC de la trame sont changées, le ping est transmis à D
```

📌 **Point clé** : à chaque saut (poste → routeur → routeur suivant → destination), les adresses **MAC** de la trame sont réécrites pour correspondre au prochain segment du trajet, alors que les adresses **IP** source et destination, elles, restent **inchangées** tout au long du parcours.

---

## 4. Le routage

Le **routage** est le processus qui détermine le chemin à emprunter pour qu'un paquet atteigne sa destination, à travers un ou plusieurs réseaux. Il se déroule à la **couche 3 (Réseau)** du modèle OSI.

### Rôle du routage

Contrairement à la communication au sein d'un même réseau local (gérée par les **switches**), le routage est nécessaire dès que les données doivent traverser **plusieurs réseaux**. Il permet de :
- Acheminer les paquets IP vers leur destination.
- Trouver le **chemin optimal** (minimiser le temps de transit, éviter la congestion).
- **Séparer les domaines de diffusion** (voir section 1), limitant ainsi le trafic inutile.

### Le routeur et sa table de routage

Un routeur lit l'adresse IP de destination de chaque paquet, consulte sa **table de routage**, puis décide du meilleur chemin selon des critères comme le nombre de sauts ou la priorité de la route.

| Réseau destination | Masque | Passerelle | Interface sortante |
|---|---|---|---|
| 192.168.1.0 | 255.255.255.0 | 192.168.0.1 | Ethernet 0 |
| 10.0.0.0 | 255.0.0.0 | 192.168.0.2 | Ethernet 1 |

Une table de routage contient donc : les **réseaux connus**, les **passerelles** (routeurs voisins pouvant relayer les paquets), et les **métriques** (coût/efficacité de chaque route : distance, bande passante...).

### Statique vs dynamique

| Type | Fonctionnement | Avantages | Inconvénients |
|---|---|---|---|
| **Routage statique** | Routes configurées manuellement par un administrateur | Simple, contrôle précis | Peu flexible en cas de panne ou de changement de topologie |
| **Routage dynamique** | Routes calculées automatiquement via des protocoles (**RIP**, **OSPF**, **BGP**) | Adaptable, gère automatiquement les pannes | Configuration plus complexe, consomme des ressources |

### Processus de routage, pas à pas

1. Le routeur lit l'adresse IP de destination du paquet.
2. Il consulte sa table de routage.
3. Si aucune route ne correspond, le paquet est envoyé vers la **passerelle par défaut**.
4. Le paquet est transmis au routeur suivant, ou à la destination finale s'il est directement joignable.

**Exemple** : 192.168.1.100/24 envoie des données vers 10.0.0.1. L'ordinateur détecte que la destination n'est pas sur son réseau local → envoi vers la passerelle par défaut (192.168.1.1) → le routeur trouve une route vers 10.0.0.0/8 dans sa table → il transmet le paquet au routeur suivant, ou directement à la destination si elle est atteignable.

**Avantages du routage** : permet la communication entre réseaux différents, optimise le trafic via le meilleur chemin, assure la scalabilité pour des réseaux complexes (Internet en est l'exemple ultime).

---

## 5. Le sur-réseau (supernetting)

Le **sur-réseau** (supernetting) est l'opération **inverse** du sous-réseau (subnetting, vu au Module 3) : il consiste à **regrouper plusieurs sous-réseaux contigus** en un seul réseau plus grand, en utilisant un masque **moins restrictif** (moins de bits à 1). Objectif : réduire la taille des tables de routage et simplifier la gestion des adresses IP dans les grands réseaux (typiquement, Internet).

### Principe

| Sans sur-réseau | Avec sur-réseau |
|---|---|
| 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24, 192.168.3.0/24 → **4 routes distinctes** | 192.168.0.0/**22** → **1 seule route**, qui couvre les 4 plages |

### Comment trouver le bon préfixe : exemple pas à pas

**1. Convertir les adresses réseau en binaire :**
```
192.168.0.0  =  11000000.10101000.00000000.00000000
192.168.1.0  =  11000000.10101000.00000001.00000000
192.168.2.0  =  11000000.10101000.00000010.00000000
192.168.3.0  =  11000000.10101000.00000011.00000000
```

**2. Identifier les bits communs à toutes ces adresses**, en partant de la gauche :
```
11000000.10101000.000000░░.░░░░░░░░
└──────────── 22 bits identiques ────────────┘
```

**3. Le masque correspondant à ces 22 bits communs est donc `/22`** → le sur-réseau est **192.168.0.0/22**, couvrant la totalité de la plage 192.168.0.0 à 192.168.3.255 (soit 1024 adresses, l'équivalent de 4 blocs de 256 adresses regroupés).

### Avantages et limites

| Avantages | Limites |
|---|---|
| Réduit la taille des tables de routage (meilleures performances routeur) | **Perte de granularité** : impossible d'isoler finement un sous-réseau une fois regroupé |
| Simplifie l'administration dans les grandes infrastructures | **Alignement requis** : les plages doivent être contiguës et alignées sur des limites binaires compatibles |
| Très utilisé dans le routage interdomaines (CIDR) à l'échelle d'Internet | **Risque de conflits** en cas de plages mal planifiées |

**Exemple pratique** : un FAI attribuant `192.168.0.0/24`, `.1.0/24`, `.2.0/24` et `.3.0/24` à 4 clients différents peut annoncer une seule route `192.168.0.0/22` sur Internet plutôt que 4 routes distinctes — ce qui allège considérablement les tables de routage des routeurs d'Internet.

---

## ✅ Points clés à retenir

- Un **domaine de diffusion** est délimité par les **routeurs** (jamais par les switches, qui les propagent au contraire) — chaque VLAN forme aussi son propre domaine.
- Communication au sein d'un même réseau : repose sur la **table ARP** (résolution IP ↔ MAC).
- Communication entre réseaux différents : passe obligatoirement par une **passerelle**, puis par un ou plusieurs **routeurs** ; les adresses **MAC changent à chaque saut**, les adresses **IP restent identiques** de bout en bout.
- Un routeur ne fait que consulter sa **table de routage** pour décider où envoyer chaque paquet — **statique** (manuel, simple) vs **dynamique** (automatique via RIP/OSPF/BGP, plus flexible).
- Le **sur-réseau** (supernetting) est l'inverse du sous-réseau : il regroupe plusieurs réseaux contigus sous un masque moins restrictif pour simplifier les tables de routage.
- Pour trouver le préfixe d'un sur-réseau : convertir les adresses en binaire, repérer les bits **communs** à toutes, ce nombre de bits communs devient le nouveau masque.


## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-4-la-communication"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-4-la-communication-data">
[
  {
    "question": "Qu'est-ce qu'un domaine de diffusion (broadcast domain) ?",
    "options": ["Une portion logique du réseau dans laquelle une trame de diffusion est transmise à tous les appareils connectés", "Une zone géographique couverte par un seul point d'accès Wi-Fi", "Un ensemble de règles de pare-feu appliquées à un VLAN", "Une plage d'adresses IP réservée aux serveurs DNS"],
    "correctIndex": 0,
    "explanation": "Un domaine de diffusion est une portion logique du réseau où un message de broadcast est reçu par tous les appareils connectés, même si ce message ne leur est pas explicitement destiné."
  },
  {
    "question": "En IPv4, comment est composée une adresse de broadcast comme 192.168.1.255 pour un réseau /24 ?",
    "options": ["Tous les bits de la partie réseau sont positionnés à 1", "Tous les bits de la partie hôte sont positionnés à 1", "Tous les bits de l'adresse sont positionnés à 0", "Seul le premier octet est positionné à 255"],
    "correctIndex": 1,
    "explanation": "L'adresse de broadcast est obtenue en mettant tous les bits de la partie hôte à 1 ; pour un réseau 192.168.1.0/24, cela donne 192.168.1.255."
  },
  {
    "question": "Quel équipement délimite les domaines de diffusion, empêchant les trames de broadcast de passer d'un réseau à un autre ?",
    "options": ["Le commutateur (switch)", "Le répéteur", "Le routeur", "Le modem"],
    "correctIndex": 2,
    "explanation": "Un routeur ne transmet pas les trames de diffusion d'un réseau vers un autre, ce qui crée une frontière entre domaines de diffusion, contrairement à un commutateur qui les propage à tous les ports d'un même VLAN."
  },
  {
    "question": "Pourquoi la mise en place de VLANs permet-elle de limiter la taille des domaines de diffusion ?",
    "options": ["Parce que les VLANs chiffrent automatiquement le trafic de broadcast", "Parce que les VLANs suppriment tout trafic de diffusion", "Parce que les VLANs remplacent les adresses IP par des adresses MAC", "Parce que chaque VLAN constitue un domaine de diffusion distinct, même sur un même switch physique"],
    "correctIndex": 3,
    "explanation": "Un VLAN segmente logiquement un réseau : chaque VLAN forme un domaine de diffusion indépendant, même si plusieurs VLANs partagent le même commutateur physique."
  },
  {
    "question": "À quelle couche du modèle OSI le domaine de diffusion opère-t-il principalement ?",
    "options": ["La couche 2 (Liaison de données)", "La couche 1 (Physique)", "La couche 3 (Réseau)", "La couche 4 (Transport)"],
    "correctIndex": 0,
    "explanation": "Le domaine de diffusion opère principalement à la couche 2, les diffusions étant transmises à tous les appareils via l'adresse MAC de destination spéciale FF:FF:FF:FF:FF:FF."
  },
  {
    "question": "Quelle adresse MAC de destination est utilisée pour une trame de diffusion ?",
    "options": ["00:00:00:00:00:00", "FF:FF:FF:FF:FF:FF", "192.168.1.255", "AA:AA:AA:AA:AA:AA"],
    "correctIndex": 1,
    "explanation": "Une trame de diffusion utilise l'adresse MAC de destination FF:FF:FF:FF:FF:FF, reconnue par tous les appareils du domaine de diffusion comme une adresse de broadcast."
  },
  {
    "question": "Pourquoi un domaine de diffusion trop grand peut-il poser un problème de performance ?",
    "options": ["Parce que les adresses IP privées s'épuisent plus rapidement", "Parce que le chiffrement des données devient impossible", "Parce que chaque appareil du domaine doit traiter les diffusions, même celles qui ne lui sont pas destinées", "Parce que le nombre de VLANs est automatiquement limité à un seul"],
    "correctIndex": 2,
    "explanation": "Dans un domaine de diffusion étendu, chaque appareil doit traiter toutes les diffusions reçues, ce qui peut surcharger le réseau et les ressources des machines si le domaine n'est pas correctement segmenté."
  },
  {
    "question": "À quelle couche du modèle OSI le processus de routage se déroule-t-il principalement ?",
    "options": ["La couche 2 (Liaison de données)", "La couche 4 (Transport)", "La couche 7 (Application)", "La couche 3 (Réseau)"],
    "correctIndex": 3,
    "explanation": "Le routage est un mécanisme de la couche 3 (Réseau), où les routeurs déterminent le meilleur chemin pour acheminer les paquets à travers un ou plusieurs réseaux."
  },
  {
    "question": "Que consulte un routeur pour décider du meilleur chemin à emprunter pour un paquet ?",
    "options": ["Sa table de routage", "Le cache ARP de l'expéditeur", "Le fichier hosts local", "La table des adresses MAC"],
    "correctIndex": 0,
    "explanation": "La table de routage est une base de données interne au routeur contenant les réseaux connus, les passerelles disponibles et les métriques associées, sur laquelle il s'appuie pour choisir la meilleure route."
  },
  {
    "question": "Quelle est la différence essentielle entre le routage statique et le routage dynamique ?",
    "options": ["Le routage statique utilise uniquement IPv6, tandis que le routage dynamique utilise uniquement IPv4", "Le routage statique est configuré manuellement par un administrateur, tandis que le routage dynamique ajuste les routes automatiquement via des protocoles", "Le routage statique fonctionne uniquement sur les VLANs, tandis que le routage dynamique fonctionne uniquement sur les LAN", "Le routage statique est réservé aux grands réseaux, tandis que le routage dynamique est réservé aux petits réseaux"],
    "correctIndex": 1,
    "explanation": "En routage statique, les routes sont saisies manuellement par un administrateur, ce qui convient aux petits réseaux stables ; en routage dynamique, des protocoles comme RIP, OSPF ou BGP permettent aux routeurs d'échanger automatiquement des informations et de s'adapter aux changements du réseau."
  },
  {
    "question": "Lesquels de ces protocoles sont des protocoles de routage dynamique ?",
    "options": ["DHCP, DNS et ARP", "TCP, UDP et ICMP", "RIP, OSPF et BGP", "HTTP, FTP et SMTP"],
    "correctIndex": 2,
    "explanation": "RIP (Routing Information Protocol), OSPF (Open Shortest Path First) et BGP (Border Gateway Protocol) sont des protocoles de routage dynamique permettant aux routeurs d'échanger automatiquement leurs informations de routage."
  },
  {
    "question": "Que se passe-t-il si un routeur ne trouve aucune route correspondante dans sa table de routage pour un paquet donné ?",
    "options": ["Il détruit systématiquement le paquet sans notification", "Il renvoie le paquet à l'expéditeur avec une erreur ARP", "Il diffuse le paquet à tous les réseaux connus", "Il transmet généralement le paquet à une passerelle par défaut"],
    "correctIndex": 3,
    "explanation": "Lorsqu'aucune route spécifique n'est trouvée dans la table de routage, le routeur transmet le paquet vers sa passerelle par défaut, qui tentera à son tour de l'acheminer vers la destination."
  },
  {
    "question": "Dans l'exemple d'un ordinateur 192.168.1.100/24 envoyant des données vers 10.0.0.1, pourquoi le paquet est-il envoyé à la passerelle par défaut ?",
    "options": ["Parce que l'adresse de destination 10.0.0.1 n'appartient pas au même réseau local que l'expéditeur", "Parce que l'adresse 10.0.0.1 correspond à une adresse de broadcast", "Parce que la passerelle par défaut est toujours la première destination de tout paquet", "Parce que l'adresse IP 10.0.0.1 est une adresse APIPA"],
    "correctIndex": 0,
    "explanation": "L'ordinateur détecte que 10.0.0.1 ne fait pas partie de son réseau local (192.168.1.0/24) ; il transmet donc le paquet à sa passerelle par défaut, qui se chargera de l'acheminer vers le réseau distant via sa table de routage."
  },
  {
    "question": "Qu'est-ce que le sur-réseau (supernetting) ?",
    "options": ["Une technique consistant à diviser un réseau en plusieurs sous-réseaux plus petits", "Une technique consistant à regrouper plusieurs sous-réseaux contigus en un seul réseau plus grand", "Une méthode de chiffrement des adresses IP", "Un protocole permettant d'attribuer automatiquement des adresses IP"],
    "correctIndex": 1,
    "explanation": "Le sur-réseau, ou supernetting, est l'opération inverse du sous-réseautage : il fusionne plusieurs plages d'adresses IP contiguës en une seule, à l'aide d'un masque moins restrictif (moins de bits à 1)."
  },
  {
    "question": "Quel est le principal avantage du sur-réseau pour les routeurs d'Internet ?",
    "options": ["Il augmente automatiquement le nombre d'adresses IP publiques disponibles", "Il supprime la nécessité d'un masque de sous-réseau", "Il réduit la taille des tables de routage en regroupant plusieurs réseaux sous une seule entrée", "Il chiffre systématiquement le trafic entre routeurs"],
    "correctIndex": 2,
    "explanation": "En combinant plusieurs réseaux contigus en une seule route, le sur-réseau simplifie et réduit la taille des tables de routage, ce qui améliore la performance des routeurs, notamment sur Internet."
  },
  {
    "question": "Dans l'exemple des réseaux 192.168.0.0/24, 192.168.1.0/24, 192.168.2.0/24 et 192.168.3.0/24, quel sur-réseau permet de les regrouper en une seule route ?",
    "options": ["192.168.0.0/23", "192.168.0.0/21", "192.168.0.0/16", "192.168.0.0/22"],
    "correctIndex": 3,
    "explanation": "Ces quatre réseaux /24 partagent leurs 22 premiers bits en commun ; ils peuvent donc être regroupés en un seul sur-réseau 192.168.0.0/22, couvrant les adresses de 192.168.0.0 à 192.168.3.255."
  },
  {
    "question": "Pour créer un sur-réseau à partir de plusieurs sous-réseaux, quelle condition ces sous-réseaux doivent-ils remplir ?",
    "options": ["Être contigus et alignés sur des limites binaires compatibles", "Appartenir tous à la même classe d'adresse historique (A, B ou C)", "Utiliser tous le même masque /24 sans exception possible", "Être situés sur des continents différents"],
    "correctIndex": 0,
    "explanation": "Le regroupement en sur-réseau nécessite que les plages d'adresses soient contiguës et alignées sur des limites binaires compatibles, faute de quoi le nouveau préfixe ne pourrait pas représenter fidèlement l'ensemble des sous-réseaux d'origine."
  },
  {
    "question": "Quelle est une limite du sur-réseau mentionnée dans le cours ?",
    "options": ["Une incompatibilité totale avec la notation CIDR", "Une perte de granularité, qui réduit la précision pour identifier ou isoler des plages spécifiques", "Une obligation d'utiliser exclusivement IPv6", "Une interdiction d'utilisation sur les réseaux privés"],
    "correctIndex": 1,
    "explanation": "En regroupant plusieurs réseaux en un seul, le sur-réseau perd en granularité : il devient plus difficile d'identifier ou d'isoler précisément une plage d'adresses spécifique au sein du groupe."
  },
  {
    "question": "Quels usages typiques s'appuient sur les messages de diffusion (broadcast) dans un réseau local ?",
    "options": ["Le chiffrement des échanges HTTPS et la signature des certificats SSL", "Le routage BGP entre fournisseurs d'accès Internet", "La découverte de machines via DHCP et la résolution d'adresses via ARP", "La synchronisation de l'heure via NTP uniquement"],
    "correctIndex": 2,
    "explanation": "Les messages de broadcast servent notamment à des tâches comme la découverte de machines (par exemple lors d'une requête DHCP) ou la résolution d'adresses (par exemple une requête ARP « Who has 192.168.1.10? »)."
  },
  {
    "question": "Quel est l'un des principaux avantages du routage pour un réseau ?",
    "options": ["Il élimine totalement le besoin d'adresses IP", "Il remplace les commutateurs dans tous les réseaux locaux", "Il empêche toute segmentation en sous-réseaux", "Il permet la communication entre différents réseaux tout en optimisant le trafic en choisissant les meilleurs chemins"],
    "correctIndex": 3,
    "explanation": "Le routage permet d'acheminer les paquets entre différents réseaux, d'optimiser le trafic en choisissant le chemin le plus efficace, et d'assurer la scalabilité de réseaux complexes comme Internet."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-01-bases-des-reseaux-module-4-la-communication",
      dataId: "quiz-cours-01-bases-des-reseaux-module-4-la-communication-data",
    });
  });
</script>
