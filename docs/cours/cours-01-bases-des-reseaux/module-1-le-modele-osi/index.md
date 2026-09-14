# Module 1 : Le modèle OSI

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

Ce module présente le modèle OSI : sa logique en 7 couches, le vocabulaire de l'encapsulation (PDU, SDU, PCI), le rôle, les protocoles et les équipements associés à chaque couche, ainsi que le déroulé concret de l'encapsulation/désencapsulation à travers l'exemple d'un envoi d'email.

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

## 1. Présentation générale du modèle OSI

Le modèle **OSI** (*Open Systems Interconnection*) est une norme qui définit comment les communications se font entre deux systèmes sur un réseau. C'est un modèle **théorique**, divisé en **7 couches distinctes** : chaque couche a une fonction précise et ne communique qu'avec celles situées directement au-dessus et en dessous d'elle.

Pourquoi découper la communication réseau en 7 couches plutôt que de la traiter comme un tout ? Cette segmentation permet de **structurer** les processus réseau, et surtout de **faciliter le développement et le débogage** des protocoles : chaque couche peut évoluer ou être corrigée indépendamment des autres, tant que l'interface avec ses voisines reste respectée.

---

## 2. Le vocabulaire de l'encapsulation : PDU, SDU, PCI

Avant de détailler chaque couche, il faut comprendre trois notions qui reviennent à chaque échange de données entre couches :

| Terme | Définition |
|---|---|
| **PDU** (*Protocol Data Unit*) | L'unité de données échangée par une couche donnée. Elle contient à la fois les données utilisateur et les informations de contrôle ajoutées par cette couche. Chaque couche a son propre PDU (voir tableau en section 3). |
| **SDU** (*Service Data Unit*) | Les données brutes fournies par la couche N+1 à la couche N, **avant** que cette dernière n'y ajoute ses propres informations. |
| **PCI** (*Protocol Control Information*) | Les informations de contrôle qu'une couche ajoute (adresses, numéros de séquence, contrôle d'erreur...). C'est l'ajout du PCI à un SDU qui forme un nouveau PDU. |

**Le mécanisme, en résumé** : quand la couche N+1 termine son travail, son PDU devient le **SDU** de la couche N. Cette dernière y ajoute son **PCI** (c'est l'étape d'**encapsulation**), ce qui forme un **nouveau PDU**, transmis à son tour à la couche N-1 — et ainsi de suite jusqu'à la couche Physique, où les données sont converties en signaux et transmises sur le réseau.

**Exemple concret (couche Transport → couche Réseau)** :
1. La couche Transport prépare un **segment TCP** (son PDU), contenant les données applicatives + ses infos de contrôle (ports, numéro de séquence...).
2. Ce segment devient le **SDU** de la couche Réseau.
3. La couche Réseau ajoute son **PCI** (adresses IP source/destination...).
4. Le résultat est un nouveau PDU : le **paquet IP**.

À l'arrivée, le processus s'inverse : chaque couche **désencapsule** le PDU reçu (elle retire son en-tête) jusqu'à reconstituer les données d'origine, livrées à l'application finale.

---

## 3. Les 7 couches du modèle OSI

Pour chaque couche : son rôle, le nom de son PDU, ses protocoles principaux, ses équipements associés et, si pertinent, les ports qu'elle utilise.

### Vue d'ensemble

| N° | Couche | PDU (nom) | Équipements typiques |
|---|---|---|---|
| 7 | Application | APDU | — (logiciel uniquement) |
| 6 | Présentation | PPDU | — (logiciel uniquement) |
| 5 | Session | SPDU | — (logiciel uniquement) |
| 4 | Transport | TPDU / **Segment** | Firewalls (filtrage par port) |
| 3 | Réseau | RPDU / **Paquet** | Routeurs, passerelles |
| 2 | Liaison de données | LPDU / **Trame** | Commutateurs (switches), ponts (bridges) |
| 1 | Physique | Bits | Câbles, connecteurs, hubs, répéteurs, modems |

---

### 3.1 Couche Physique (couche 1)

**Rôle** : transmettre les données brutes sous forme de **signaux** (électriques, optiques ou radio) à travers un support physique (câbles, fibre, ondes). Elle encode et synchronise les bits, contrôle le débit de transmission, définit la topologie physique du réseau (étoile, bus, anneau, maillé), et gère l'établissement/la coupure des connexions physiques.

📌 Elle **ne gère ni les erreurs ni la vérification de destination** — elle se limite strictement au transport des bits, sans s'en soucier du contenu. C'est pourquoi elle dépend entièrement des couches supérieures pour le reste.

*Analogie* : la couche Physique, c'est la route — elle fournit le chemin, sans se soucier du contenu des voitures (données) qui y circulent.

**Protocoles/normes** : pas de protocoles au sens classique, mais des normes physiques — **Ethernet** (IEEE 802.3), **Wi-Fi** (IEEE 802.11), Bluetooth.

**Équipements** : câbles (Ethernet, fibre, coaxial), connecteurs (RJ45...), émetteurs/récepteurs radio, hubs et répéteurs, modems.

#### Focus pratique : les câbles à paires torsadées

Le câble à paires torsadées (fils de cuivre torsadés pour réduire les interférences) est le plus utilisé en Ethernet (catégories CAT5e, CAT6, CAT6a, jusqu'à 10 Gbps, portée max 100 m). Deux variantes : **UTP** (sans blindage, léger et économique) et **STP** (blindé, plus cher, mieux protégé des interférences).

On distingue aussi deux façons de câbler ces paires, selon les appareils à relier :

| Type | Usage | Principe |
|---|---|---|
| **Câble droit** | Relier des appareils de **types différents** (PC ↔ switch, PC ↔ routeur, switch ↔ routeur) | Même ordre de fils aux deux extrémités (ex. standard T568B des deux côtés) |
| **Câble croisé** | Relier des appareils de **même type** directement (2 PC, 2 switches, 2 routeurs) | Un côté en T568A, l'autre en T568B → croise les fils TX/RX pour que l'émission d'un appareil arrive sur la réception de l'autre |

📌 Les équipements modernes intègrent souvent la fonction **Auto MDI-X**, qui détecte automatiquement le type de câble nécessaire — un câble droit peut alors être utilisé même entre deux appareils de même type.

---

### 3.2 Couche Liaison de données (couche 2)

**Rôle** : assurer un transfert **fiable** des données entre deux équipements **adjacents sur le même réseau local** — elle détecte (et parfois corrige) les erreurs de transmission, et structure les données en **trames**.

Elle se divise en 2 sous-couches :

| Sous-couche | Rôle |
|---|---|
| **LLC** (*Logical Link Control*) | Gère les connexions logiques, permet à plusieurs protocoles réseau (IP, IPX...) de partager un même support |
| **MAC** (*Media Access Control*) | Contrôle l'accès au support physique (ex. CSMA/CD en Ethernet) et gère l'**adressage physique** (adresses MAC) |

*Analogie* : un centre de tri postal local — la lettre est identifiée et vérifiée (contrôle d'erreur), puis acheminée localement, sans se soucier des étapes plus lointaines (qui relèvent de la couche Réseau).

**Protocoles** : Ethernet (IEEE 802.3), Wi-Fi (IEEE 802.11), PPP, HDLC.

**Équipements** : commutateurs (switches), ponts (bridges) — tous deux fonctionnent via les adresses MAC.

⚠️ La couche Liaison est limitée à la communication **au sein d'un même réseau local** ; pour joindre un autre réseau, elle dépend de la couche Réseau.

---

### 3.3 Couche Réseau (couche 3)

**Rôle** : acheminer les données (sous forme de **paquets**) à travers **différents réseaux**, via des **adresses logiques** (IP). Elle détermine le meilleur chemin (routage), gère l'adressage, et peut fragmenter/réassembler les paquets trop volumineux.

*Analogie* : le système postal international — il détermine le meilleur itinéraire pour un colis, en tenant compte des modes de transport et de l'adresse du destinataire.

**Fonctions principales** :
- **Routage** : détermination du chemin optimal (distance, bande passante, congestion).
- **Adressage** : via les adresses IP — contrairement aux adresses MAC (physiques, fixes), les IP peuvent être dynamiques (DHCP) ou statiques.
- **Fragmentation/réassemblage** des paquets trop volumineux.
- **Contrôle de congestion** et détection de certaines erreurs (même si ce rôle revient surtout à la couche Liaison).

**Protocoles** : **IP** (IPv4 sur 32 bits, IPv6 sur 128 bits), **ICMP** (diagnostic, ping), **ARP** (traduit IP ↔ MAC), protocoles de routage (**OSPF**, **RIP**).

**Équipements** : routeurs, passerelles.

⚠️ La couche Réseau ne s'occupe **ni de la transmission physique** (couches 1-2), **ni de la garantie de livraison** des paquets (rôle de la couche Transport) — elle se contente d'acheminer.

---

### 3.4 Couche Transport (couche 4)

**Rôle** : assurer une transmission **fiable et efficace de bout en bout** entre deux hôtes, via la **segmentation** des données et un **numérotage** qui permet leur réassemblage dans le bon ordre à l'arrivée.

**Fonctions principales** :

| Fonction | Description |
|---|---|
| **Segmentation/réassemblage** | Découpage des données en segments numérotés, réassemblés dans l'ordre à réception |
| **Contrôle de flux** | Ajuste la vitesse d'envoi pour ne pas saturer le récepteur |
| **Contrôle d'erreur** | Vérifie l'intégrité des segments, redemande un renvoi si besoin |
| **Gestion des connexions** | Établit, maintient et termine les connexions logiques entre applications |
| **Multiplexage** | Permet à plusieurs applications de partager la même connexion réseau, via les **ports** |

**Protocoles** :

| Protocole | Caractéristiques |
|---|---|
| **TCP** | Orienté connexion, fiable (ordre + intégrité garantis), mais plus lent — idéal pour le transfert de fichiers, le web |
| **UDP** | Sans connexion, plus léger et rapide, mais sans garantie d'ordre ni d'intégrité — utilisé pour le streaming, la VoIP, où la rapidité prime sur la fiabilité |

**Les ports** : identifiants numériques qui permettent à plusieurs applications de communiquer simultanément sans conflit. Quelques ports à connaître :

| Port | Service |
|---|---|
| 22 | SSH |
| 25 | SMTP (envoi d'email) |
| 53 | DNS |
| 67 / 68 | DHCP |
| 80 | HTTP |
| 443 | HTTPS |
| 143 | IMAP |
| 389 | LDAP |
| 3389 | RDP |
| 161 / 162 | SNMP (requêtes / notifications) |

**Équipements** : la couche Transport est essentiellement **logicielle** (systèmes d'exploitation, applications), mais les **firewalls** s'appuient sur ses numéros de port pour filtrer le trafic.

---

### 3.5 Couche Session (couche 5)

**Rôle** : établir, gérer et terminer les **sessions** de communication entre deux applications, en assurant la synchronisation des échanges et la reprise en cas d'interruption.

**Protocoles** : **RPC** (*Remote Procedure Call*, exécution de procédures à distance), **NetBIOS** (gestion des connexions/échanges sur un réseau local).

---

### 3.6 Couche Présentation (couche 6)

**Rôle** : la « traductrice de données ». Elle convertit les données dans un format compréhensible par l'application, et gère la **compression** et le **chiffrement**.

**Protocoles** : **SSL/TLS** (chiffrement des communications, base du HTTPS), **JPEG**, **MPEG** (codage des données multimédia).

---

### 3.7 Couche Application (couche 7)

**Rôle** : la couche la plus élevée, celle où se trouvent les applications utilisées au quotidien (navigateur, messagerie...). Elle fournit les services directement à l'utilisateur final.

**Protocoles** : **HTTP/HTTPS** (web), **FTP** (transfert de fichiers), **SMTP** (envoi d'emails), **DNS** (résolution de noms).

---

## 4. Le processus d'encapsulation / désencapsulation — exemple d'un envoi d'email

Cet exemple permet de visualiser concrètement la traversée des 7 couches, dans les deux sens, en utilisant les noms de PDU vus en section 3.

### À l'envoi (encapsulation) — de la couche 7 à la couche 1

| Couche | Action | PDU résultant |
|---|---|---|
| **7 – Application** | L'utilisateur compose un email, envoyé via **SMTP** | **APDU** |
| **6 – Présentation** | Mise en forme standardisée, chiffrement éventuel (SSL/TLS) | **PPDU** |
| **5 – Session** | Gestion de la session entre client et serveur de messagerie | **SPDU** |
| **4 – Transport** | Ajout du port (ex. **port 25** pour SMTP), numéro de séquence, contrôle d'erreur (TCP) | **TPDU / Segment** |
| **3 – Réseau** | Ajout des adresses IP source et destination | **RPDU / Paquet** |
| **2 – Liaison** | Ajout des adresses MAC source et destination | **LPDU / Trame** |
| **1 – Physique** | Conversion en **bits**, transmission sur le support (câble, Wi-Fi...) | Bits |

### À la réception (désencapsulation) — de la couche 1 à la couche 7

Le processus est exactement l'inverse : à chaque couche, l'en-tête ajouté à l'envoi est analysé puis retiré, jusqu'à reconstituer les données d'origine.

| Couche | Action |
|---|---|
| **1 – Physique** | Réception des bits, transmis tels quels à la couche 2 |
| **2 – Liaison** | Vérification de l'adresse MAC de destination → en-tête retiré → il reste le **paquet (RPDU)** |
| **3 – Réseau** | Vérification de l'adresse IP de destination → en-tête retiré → il reste le **segment (TPDU)** |
| **4 – Transport** | Vérification du port de destination et des numéros de séquence → en-tête retiré → il reste le **SPDU** |
| **5 – Session** | En-tête de session retiré → il reste le **PPDU** |
| **6 – Présentation** | Déchiffrement/décompression si nécessaire → il reste l'**APDU** |
| **7 – Application** | L'email complet est reconstitué et affiché dans le client de messagerie |

📌 **À retenir** : à chaque couche, la vérification porte sur **l'information ajoutée par cette couche à l'envoi** (adresse MAC en couche 2, adresse IP en couche 3, port en couche 4...) — c'est ce qui permet à chaque couche de savoir si les données lui sont bien destinées, ou si elles doivent continuer leur chemin.

## ✅ Points clés à retenir

- Le modèle OSI structure la communication réseau en **7 couches indépendantes**, chacune ne dialoguant qu'avec ses voisines directes.
- **PDU** = unité de données d'une couche ; **SDU** = ce qu'elle reçoit de la couche du dessus ; **PCI** = ce qu'elle y ajoute (encapsulation).
- Chaque couche a un nom de PDU spécifique : **Segment** (Transport), **Paquet** (Réseau), **Trame** (Liaison), **bits** (Physique).
- Les couches 5, 6, 7 (Session, Présentation, Application) sont **logicielles** ; les couches 1 à 4 impliquent des équipements matériels (câbles, switches, routeurs, firewalls).
- La couche **Transport** utilise les **ports** pour permettre à plusieurs applications de communiquer simultanément (TCP = fiable, UDP = rapide mais non garanti).
- L'**encapsulation** se fait à l'envoi (couche 7 → 1), la **désencapsulation** à la réception (couche 1 → 7) — chaque couche ne retire que l'information qu'elle avait elle-même ajoutée côté émetteur.
- **Câble droit** = appareils de types différents ; **câble croisé** = appareils de même type (sauf Auto MDI-X, qui rend cette distinction automatique aujourd'hui).


## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-1-le-modele-osi-data">
[
  {
    "question": "Que signifie l'acronyme PDU dans le modèle OSI ?",
    "options": ["Protocol Data Unit", "Physical Data Unit", "Packet Distribution Unit", "Protocol Description Unit"],
    "correctIndex": 0,
    "explanation": "PDU signifie « Protocol Data Unit » : c'est l'unité de données échangée entre deux entités réseau à une couche donnée du modèle OSI, comprenant les données utilisateur et les informations de contrôle ajoutées par le protocole de cette couche."
  },
  {
    "question": "Dans le passage d'une couche N+1 à une couche N, comment est appelée la donnée brute que la couche N+1 transmet à la couche N avant tout traitement ?",
    "options": ["Un PCI (Protocol Control Information)", "Un SDU (Service Data Unit)", "Un PDU (Protocol Data Unit)", "Un en-tête de couche"],
    "correctIndex": 1,
    "explanation": "Le SDU est la donnée fournie par la couche N+1 à la couche N sous forme brute, sans information spécifique à la couche N. La couche N y ajoute ensuite son PCI pour former un nouveau PDU."
  },
  {
    "question": "Dans l'exemple d'encapsulation d'un email à travers les couches OSI, comment est nommé le PDU au niveau de la couche Application ?",
    "options": ["PPDU (Presentation Protocol Data Unit)", "SPDU (Session Protocol Data Unit)", "APDU (Application Protocol Data Unit)", "TPDU (Transport Protocol Data Unit)"],
    "correctIndex": 2,
    "explanation": "Au niveau de la couche Application, les données brutes de l'email (texte et pièces jointes) sont appelées APDU. Cet APDU est ensuite encapsulé en PPDU par la couche Présentation, puis en SPDU par la couche Session, et ainsi de suite."
  },
  {
    "question": "Combien de couches compte le modèle OSI ?",
    "options": ["4", "5", "9", "7"],
    "correctIndex": 3,
    "explanation": "Le modèle OSI est structuré en 7 couches distinctes, chacune ayant une fonction spécifique et communiquant uniquement avec les couches directement adjacentes."
  },
  {
    "question": "Quelle couche du modèle OSI est directement responsable de la transmission des bits sous forme de signaux électriques, optiques ou radio ?",
    "options": ["La couche Physique", "La couche Liaison de données", "La couche Réseau", "La couche Transport"],
    "correctIndex": 0,
    "explanation": "La couche Physique transforme les données en impulsions électriques, signaux lumineux ou ondes radio et les transmet sur le support physique (câbles, fibres, ondes)."
  },
  {
    "question": "Quel type de câble à paires torsadées utilise le même schéma de câblage (par exemple T568B) aux deux extrémités ?",
    "options": ["Le câble croisé (crossover)", "Le câble droit (straight-through)", "Le câble coaxial", "Le câble à fibre optique"],
    "correctIndex": 1,
    "explanation": "Un câble droit conserve le même ordre de connexion des fils aux deux extrémités ; il sert à relier des équipements de types différents, comme un ordinateur à un commutateur."
  },
  {
    "question": "Pour relier directement deux ordinateurs entre eux sans passer par un commutateur (en l'absence d'Auto MDI-X), quel type de câble à paires torsadées faut-il utiliser ?",
    "options": ["Le câble droit", "Le câble STP simple", "Le câble croisé", "Le câble RJ11"],
    "correctIndex": 2,
    "explanation": "Le câble croisé inverse les fils de transmission et de réception entre les deux extrémités (une extrémité en T568A, l'autre en T568B), ce qui permet à deux appareils de même type de communiquer directement."
  },
  {
    "question": "Quelle est la principale différence entre un câble UTP et un câble STP ?",
    "options": ["L'UTP transmet uniquement en fibre optique", "Le STP fonctionne uniquement en réseau sans fil", "L'UTP ne peut pas dépasser 10 mètres de longueur", "Le STP dispose d'un blindage contre les interférences électromagnétiques, contrairement à l'UTP"],
    "correctIndex": 3,
    "explanation": "STP (Shielded Twisted Pair) intègre un blindage qui protège mieux contre les interférences électromagnétiques, mais il est plus coûteux ; UTP (Unshielded Twisted Pair) est plus léger et économique mais plus sensible aux interférences."
  },
  {
    "question": "Quelles sont les deux sous-couches qui composent la couche Liaison de données ?",
    "options": ["LLC (Logical Link Control) et MAC (Media Access Control)", "TCP et UDP", "IP et ICMP", "SSL et TLS"],
    "correctIndex": 0,
    "explanation": "La couche Liaison de données se subdivise en sous-couche LLC, qui gère les connexions logiques et le multiplexage des protocoles, et en sous-couche MAC, qui contrôle l'accès au support physique et l'adressage physique."
  },
  {
    "question": "Quel type d'adresse est utilisé par la sous-couche MAC pour identifier de façon unique chaque appareil sur un réseau local ?",
    "options": ["L'adresse IP", "L'adresse MAC", "Le numéro de port", "L'adresse logique de session"],
    "correctIndex": 1,
    "explanation": "La sous-couche MAC gère l'adressage physique : chaque trame comporte une adresse MAC source et une adresse MAC de destination permettant d'identifier les équipements sur le réseau local."
  },
  {
    "question": "Quel équipement fonctionne typiquement au niveau de la couche Liaison de données en utilisant les adresses MAC pour transférer les trames ?",
    "options": ["Le routeur", "Le modem", "Le commutateur (switch)", "Le pare-feu applicatif"],
    "correctIndex": 2,
    "explanation": "Les commutateurs opèrent au niveau de la couche Liaison de données et utilisent les adresses MAC pour acheminer les trames entre les dispositifs d'un même réseau local."
  },
  {
    "question": "Quelle est la fonction principale de la couche Réseau dans le modèle OSI ?",
    "options": ["Transmettre les bits sous forme de signaux physiques", "Chiffrer et compresser les données", "Gérer les sessions entre applications", "Acheminer les paquets entre différents réseaux via le routage et l'adressage logique (IP)"],
    "correctIndex": 3,
    "explanation": "La couche Réseau détermine le chemin optimal pour acheminer les paquets d'un réseau à un autre, en s'appuyant sur des adresses logiques comme les adresses IP."
  },
  {
    "question": "Quel protocole de la couche Réseau est utilisé pour envoyer des messages de diagnostic tels que le ping ?",
    "options": ["ICMP (Internet Control Message Protocol)", "ARP (Address Resolution Protocol)", "OSPF (Open Shortest Path First)", "TCP (Transmission Control Protocol)"],
    "correctIndex": 0,
    "explanation": "ICMP est utilisé pour les messages de contrôle et de diagnostic sur le réseau, comme les erreurs de routage ou les requêtes ping, qui permettent de vérifier la connectivité entre deux hôtes."
  },
  {
    "question": "Quel équipement de la couche Réseau prend des décisions d'acheminement basées sur les adresses IP et les tables de routage ?",
    "options": ["Le commutateur", "Le routeur", "Le hub", "Le répéteur"],
    "correctIndex": 1,
    "explanation": "Les routeurs acheminent les paquets entre différents réseaux en s'appuyant sur les adresses IP de destination et leurs tables de routage."
  },
  {
    "question": "Quelle unité de données, spécifique à la couche Transport, est numérotée pour permettre son réassemblage dans le bon ordre à l'arrivée ?",
    "options": ["La trame", "Le paquet", "Le segment", "Le bit"],
    "correctIndex": 2,
    "explanation": "La couche Transport découpe les données en segments numérotés, ce qui permet à la couche Transport du récepteur de les réassembler dans le bon ordre, même si le réseau introduit des pertes ou des variations de débit."
  },
  {
    "question": "Quel protocole de la couche Transport garantit la livraison des segments dans le bon ordre et sans erreur, au prix d'une latence potentiellement plus élevée ?",
    "options": ["UDP (User Datagram Protocol)", "IP (Internet Protocol)", "ARP (Address Resolution Protocol)", "TCP (Transmission Control Protocol)"],
    "correctIndex": 3,
    "explanation": "TCP est un protocole orienté connexion qui assure la fiabilité de la transmission (ordre, absence d'erreurs) grâce à des mécanismes de contrôle et de retransmission, ce qui peut introduire de la latence par rapport à UDP."
  },
  {
    "question": "Pourquoi UDP est-il souvent préféré à TCP pour des applications comme le streaming vidéo ou la VoIP ?",
    "options": ["Parce qu'il est plus rapide et sans vérification systématique de la réception des segments, ce qui convient aux flux temps réel tolérant quelques pertes", "Parce qu'il chiffre systématiquement les données transmises", "Parce qu'il garantit l'ordre et l'intégrité de chaque paquet", "Parce qu'il fonctionne uniquement sur le port 443"],
    "correctIndex": 0,
    "explanation": "UDP est un protocole sans connexion, plus léger que TCP car il n'implémente pas de contrôle d'ordre ni de vérification systématique de la réception, ce qui le rend adapté aux applications temps réel où la rapidité prime sur la fiabilité totale."
  },
  {
    "question": "À quoi servent les numéros de port utilisés par la couche Transport ?",
    "options": ["À identifier de façon unique chaque carte réseau sur le marché", "À identifier les différentes applications qui communiquent sur un même appareil (multiplexage)", "À définir la topologie physique du réseau", "À chiffrer les échanges entre deux couches Session"],
    "correctIndex": 1,
    "explanation": "Les ports permettent à plusieurs applications de partager la même connexion réseau en distinguant leurs flux de données respectifs ; par exemple, le port 80 est associé au HTTP et le port 443 au HTTPS."
  },
  {
    "question": "Quelle couche du modèle OSI est chargée d'établir, gérer et terminer les sessions de communication entre deux applications, notamment en assurant leur synchronisation ?",
    "options": ["La couche Présentation", "La couche Application", "La couche Session", "La couche Transport"],
    "correctIndex": 2,
    "explanation": "La couche Session établit, gère et termine les sessions entre applications communicantes et assure la synchronisation des échanges, permettant une reprise en cas d'interruption."
  },
  {
    "question": "Quel est le rôle principal de la couche Présentation dans le modèle OSI ?",
    "options": ["Acheminer les paquets entre réseaux différents", "Gérer l'adressage physique des équipements", "Détecter les collisions sur le support physique partagé", "Convertir les données dans un format compréhensible par l'application, en gérant compression et chiffrement"],
    "correctIndex": 3,
    "explanation": "La couche Présentation agit comme une « traductrice de données » : elle convertit les données dans un format exploitable par l'application et prend en charge la compression ainsi que la cryptographie, par exemple via SSL/TLS."
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
