# Module 5 : La listes des contrôles d'accès

*Cours : [Cours 7 - Les infrastructures réseau](../index.md)*

## 🎯 Objectif du module

Ce module présente les listes de contrôle d'accès (ACL) sur routeur Cisco : leur principe général, la notion de matrice de flux nécessaire à leur conception, puis la mise en œuvre concrète des ACL standard (filtrage sur l'adresse IP source) et des ACL étendues (filtrage sur source, destination, protocole et port), y compris leur usage pour sécuriser l'accès administratif et leur variante avec suivi d'état (`established`).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Les listes de contrôle d'accès (ACL) : principes généraux

Une **ACL** (*Access Control List*) est une fonctionnalité des routeurs Cisco qui permet de filtrer le trafic réseau entre une source et une destination, d'appliquer de la translation d'adresse sur une partie du trafic, de contrôler l'accès administratif à l'équipement, ou de classer certains trafics dans le cadre de la qualité de service.

### 1.1 ACE et traitement d'une ACL

Une ACL est une **liste** contenant une ou plusieurs entrées, les **ACE** (*Access Control Entries*). Les ACE sont comparées au trafic **dans l'ordre**, jusqu'à ce que l'une d'elles corresponde. 📌 Si aucune ACE ne correspond, une ACE implicite de type **deny** (refus) s'applique toujours en fin de liste.

⚠️ Par défaut, un routeur sorti du carton ne possède **aucune ACL**, ni sur les interfaces ni sur l'administration.

### 1.2 ACL standard et ACL étendues

| Type | Filtre sur | Niveau |
| --- | --- | --- |
| **ACL standard** | Adresse IP **source** uniquement | Couche 3 |
| **ACL étendue** | Source, destination, protocole, ports **TCP/UDP** | Couches 3 et 4 |

⚠️ Il s'agit d'un filtrage relativement basique (niveau 3/4) : les ACL n'offrent pas les capacités d'un pare-feu applicatif.

### 1.3 Placement d'une ACL sur une interface

Une ACL peut être appliquée en **entrée** (in) ou en **sortie** (out) d'une interface :

- une ACL **entrante** filtre le paquet avant qu'il n'entre dans le routeur — utile quand il existe **plusieurs chemins de sortie possibles** pour ce paquet ;
- une ACL **sortante** filtre le paquet en sortie — utile quand la source du trafic peut provenir de **plusieurs interfaces d'entrée**, ce qui évite de dupliquer la même ACL sur chacune d'elles.

### 1.4 Traitement d'une ACL standard

Une ACL standard compare uniquement l'**adresse IP source** du paquet à chaque ACE, dans l'ordre, et applique **permit** (autorise) ou **deny** (bloque) selon la première correspondance trouvée. En l'absence de correspondance, le **refus implicite** s'applique.

⚠️ Piège classique : créer une ACL vide et l'appliquer sur une interface bloque **tout** le trafic (équivalent d'un `deny all`). 📌 Il est donc conseillé de toujours démarrer avec un `permit` explicite avant d'affiner les règles nécessaires.

### 1.5 Les commandes access-list et ip access-list

| Commande | ACL standard | ACL étendue | Identification |
| --- | --- | --- | --- |
| `access-list` | ✅ | ✅ (avec un numéro dédié) | Numéro uniquement |
| `ip access-list` | ✅ | ✅ | Numéro **ou** nom |

📌 `ip access-list` est arrivée plus tard et est recommandée : elle est **interactive** (comme la configuration d'une interface, on entre dans un sous-mode puis on ajoute des `permit`/`deny`), permet de nommer une ACL de façon explicite (ex. « BLOQUER_ICMP » plutôt que « ACL 49 »), et simplifie l'insertion d'une ligne au milieu d'une liste existante.

### 1.6 Le masque inversé (wildcard mask)

Les ACL Cisco n'utilisent pas les masques classiques, mais un **masque inversé** (*wildcard mask*), historiquement plus efficace pour le traitement matériel des ACL.

📌 Calcul du masque inversé : on inverse chaque bit du masque standard (0 devient 1, 1 devient 0), ou plus simplement, on soustrait le masque à `255.255.255.255`. Par exemple, `255.255.255.0` (/24) devient `0.0.0.255`.

⚠️ Cas particuliers : `0.0.0.0` correspond en réalité à un masque **/32** (une seule adresse), et `255.255.255.255` correspond à un masque **/0** (toutes les adresses) — l'inverse de ce que l'on pourrait intuitivement penser.

Deux mots-clés simplifient l'écriture :

| Mot-clé | Équivalent |
| --- | --- |
| `host <IP>` | Une seule adresse IP (masque /32) |
| `any` | Toutes les adresses IP (`0.0.0.0 255.255.255.255`) |

## 2. La matrice de flux

Avant de mettre en œuvre des ACL, il est indispensable d'identifier les **flux** à autoriser ou bloquer.

### 2.1 Qu'est-ce qu'un flux ?

Un **flux** est une conversation entre un client et un serveur, identifiée de façon unique par cinq critères : l'**adresse IP source**, l'**adresse IP destination**, le **protocole**, le **port source** et le **port destination**. 📌 Ces cinq critères permettent de rattacher tous les paquets échangés (dans les deux sens) à la même conversation.

### 2.2 La notion de socket

Un **socket** est une connexion réseau, définie par une adresse IP, un protocole de couche 4 (TCP ou UDP) et un port. On distingue :

- le **socket client** : port choisi dynamiquement, selon la RFC, dans la plage **49152–65535** ;
- le **socket serveur** : port réservé à l'application concernée (ex. 443 pour HTTPS).

⚠️ Une même machine peut être à la fois **client** et **serveur** — cette notion s'entend toujours **à l'échelle d'une conversation** (un serveur de fichiers, par exemple, est serveur pour ses clients mais aussi client lorsqu'il télécharge ses propres mises à jour).

### 2.3 La matrice de flux

Une fois les flux identifiés, on les consigne dans une **matrice de flux** (ou diagramme de flux) : un tableau ou un schéma répertoriant l'ensemble des flux, souvent par application. Cette matrice permet de déterminer quel filtrage implémenter, où et comment, sur les éléments réseau concernés (routeurs, pare-feu).

📌 L'outil **draw.io** (open source) est recommandé pour construire ce type de diagramme.

## 3. Les ACL standard

Les ACL standard, bien que limitées à la source, permettent : filtrer du trafic réseau, mettre en place de la translation d'adresse, filtrer l'accès administratif au routeur, ou classer du trafic pour la qualité de service.

### 3.1 Où placer une ACL standard ?

📌 Une ACL standard doit être placée **au plus près possible de la destination**. Pourquoi ? Parce qu'elle ne filtre que sur la source, et que les chemins possibles depuis une même source peuvent être multiples : en la plaçant près de la destination, une seule ACL suffit à couvrir toutes les sources à bloquer ou autoriser, quel que soit le chemin emprunté.

### 3.2 Création d'une ACL standard

**ACL numérotée** :

```
Router(config)# access-list 5 remark Bloquer trafic reseau X vers reseau Y
Router(config)# access-list 5 deny 192.168.10.0 0.0.0.255
Router(config)# access-list 5 remark Autoriser le reste
Router(config)# access-list 5 permit any
```

**ACL nommée** :

```
Router(config)# ip access-list standard LAN20
Router(config-std-nacl)# remark Bloquer trafic reseau X vers reseau Y
Router(config-std-nacl)# deny 192.168.10.0 0.0.0.255
Router(config-std-nacl)# permit any
```

📌 Il est conseillé de systématiquement nommer les ACL de façon explicite et d'y ajouter des remarques (`remark`) : une configuration d'ACL évolue peu dans le temps, et ces commentaires facilitent grandement sa relecture des années plus tard.

### 3.3 Application de l'ACL sur une interface

```
Router(config)# interface gigabitEthernet 0/0/2
Router(config-if)# ip access-group 5 out
```

(ou `ip access-group LAN20 out` pour une ACL nommée)

### 3.4 Vérification et exploitation

```
show access-list
show ip interface gigabitEthernet 0/0/2
clear access-list counters
```

`show access-list` affiche les compteurs de correspondance (*matches*) par ACE — utile pour diagnostiquer une erreur de masque ou d'adresse si le comportement observé n'est pas celui attendu. `show ip interface <interface>` indique quelle ACL est appliquée, en entrée ou en sortie. `clear access-list counters` réinitialise les compteurs.

### 3.5 Modifier une ACL numérotée

Les ACE d'une ACL numérotée sont identifiées par un numéro de ligne incrémental (10, 20, etc.), ce qui permet de les manipuler individuellement :

```
Router(config)# ip access-list standard 5
Router(config-std-nacl)# no 10
Router(config-std-nacl)# 10 permit host 192.168.10.5
```

Pour insérer une nouvelle ACE entre deux lignes existantes (par exemple entre les lignes 10 et 20), il suffit d'utiliser un numéro intermédiaire disponible (ex. 15) :

```
Router(config-std-nacl)# 15 permit 192.168.11.0 0.0.0.255
```

📌 Cela est utile car les ACE sont analysées dans l'ordre et l'analyse s'arrête à la première correspondance : ajouter un `permit` au-dessus d'un `deny` existant permet d'autoriser un sous-ensemble avant que la règle plus large ne s'applique.

### 3.6 Supprimer une ACL

Avant de supprimer une ACL, il faut vérifier qu'elle n'est plus utilisée sur aucune interface (`show running-config` ou `show access-list <n>`), puis la détacher avant de la supprimer :

```
Router(config-if)# no ip access-group 5 out
Router(config)# no access-list 5
```

## 4. Sécuriser l'accès administratif avec une ACL

Une ACL standard peut être utilisée pour restreindre l'accès administratif à un équipement, en l'appliquant en entrée sur les **lignes VTY** (les connexions à distance).

```
Router(config)# ip access-list standard ADMIN
Router(config-std-nacl)# permit host 192.168.10.5

Router(config)# line vty 0 15
Router(config-line)# access-class ADMIN in
```

📌 Bonne pratique : un routeur n'a, a priori, pas besoin d'être administré depuis n'importe quel réseau. Il est recommandé de restreindre l'administration à quelques machines identifiées (postes des administrateurs, machine de supervision).

⚠️ Le `deny all` implicite s'applique également ici, sans qu'on en voie les correspondances (*matches*) dans `show access-list` : ajouter un `deny` explicite en fin de liste permet d'observer les tentatives bloquées.

Une tentative de connexion refusée affiche un message explicite (« *Connection refused by remote host* ») — 📌 il est conseillé de toujours bien lire les messages d'erreur, qui contiennent des informations utiles au diagnostic.

## 5. Les ACL étendues

### 5.1 Numérotation et création

| Plage de numéros | Type |
| --- | --- |
| 1 – 99 | ACL standard |
| 100 – 199 | ACL étendue |
| 1300 – 1999 | ACL standard (plage étendue) |
| 2000 – 2699 | ACL étendue (plage étendue) |

⚠️ Avec `ip access-list extended`, un numéro inférieur à 100 est refusé par Cisco IOS.

📌 Les ACL étendues acceptent des mots-clés pour désigner un protocole ou un service courant (`tcp`, `ip`, `telnet`, `www` pour HTTP, etc.), traduits automatiquement par Cisco IOS vers le numéro de port standard correspondant, sans avoir à s'en souvenir.

### 5.2 Où placer une ACL étendue ?

Contrairement à l'ACL standard, une ACL étendue peut filtrer sur la **source**, la **destination**, le **protocole** et le **port**. 📌 Elle est donc placée **au plus près de la source**, afin de bloquer le trafic indésirable le plus tôt possible et éviter de surcharger inutilement les routeurs suivants avec du trafic qui, de toute façon, sera rejeté plus loin.

### 5.3 Création et syntaxe

**ACL étendue numérotée** :

```
Router(config)# access-list 105 remark Bloquer HTTP de B vers S2
Router(config)# access-list 105 deny tcp 192.168.20.0 0.0.0.255 192.168.30.0 0.0.0.255 eq 80
Router(config)# access-list 105 permit ip any any
```

**ACL étendue nommée** :

```
Router(config)# ip access-list extended BLOQUER_HTTP
Router(config-ext-nacl)# deny tcp 192.168.20.0 0.0.0.255 192.168.30.0 0.0.0.255 eq 80
Router(config-ext-nacl)# permit ip any any
```

Ordre des paramètres d'une ACE étendue : `deny`/`permit` → protocole de couche 4 (TCP, UDP, ICMP, etc.) → adresse réseau source + masque inversé → adresse réseau destination + masque inversé → port (`eq` pour « equal », ou une plage).

### 5.4 Application et vérification

```
Router(config)# interface gigabitEthernet 0/0/2
Router(config-if)# ip access-group 105 in
```

```
show access-list
```

`show access-list` permet de vérifier les correspondances par ACE, et confirme que l'ACL est bien accrochée en entrée sur l'interface concernée.

## 6. Les ACL étendues avec état (established)

### 6.1 Pourquoi suivre l'état d'une connexion ?

Une matrice de flux implique généralement d'autoriser à la fois le **trafic aller** (requête du client vers le serveur) et le **trafic retour** (réponse du serveur). Avec des ACL classiques, cela nécessiterait de créer systématiquement deux ACL distinctes (une par sens), ce qui est fastidieux.

📌 Les routeurs Cisco peuvent se comporter comme un pare-feu **avec état** (*stateful*) : ils enregistrent l'état des connexions. En autorisant explicitement le trafic aller, on peut demander au routeur d'autoriser automatiquement toute réponse correspondant à une requête déjà autorisée, et de bloquer tout autre trafic non sollicité.

### 6.2 Le mot-clé established

```
Router(config)# access-list 150 permit tcp 192.168.10.0 0.0.0.255 any eq 80
Router(config)# access-list 160 permit tcp any 192.168.10.0 0.0.0.255 established

Router(config)# interface gigabitEthernet 0/0/1
Router(config-if)# ip access-group 150 in
Router(config-if)# ip access-group 160 out
```

Dans cet exemple : l'ACL **150**, en entrée, autorise le trafic de la machine A (et de son réseau) vers Internet sur le port 80 (navigation web). L'ACL **160**, en sortie sur la même interface, autorise tout trafic revenant d'Internet **à condition** qu'il corresponde à une connexion déjà établie (`established`) — c'est-à-dire les retours des conversations initiées depuis le réseau interne.

📌 Résultat : le trafic initié depuis le réseau interne (A vers Internet) fonctionne dans les deux sens grâce à ces deux ACL complémentaires, alors qu'une tentative de connexion initiée **depuis Internet** vers une machine interne (ex. depuis un routeur externe R5 vers la machine A) est bloquée, puisqu'elle ne correspond à aucune connexion déjà établie.

## ✅ Points clés à retenir

_À compléter._

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-5-la-listes-des-controles-d-acces"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-4-les-reseaux-sans-fil-data">
[
  {
    "question": "Que permet la norme IEEE 802.11 ?",
    "options": [
      "Chiffrer nativement tout le trafic Ethernet filaire",
      "Remplacer entièrement le protocole ARP",
      "Déployer des technologies Wi-Fi normalisées, interopérables entre constructeurs",
      "Garantir un débit fixe identique sur tous les équipements"
    ],
    "correctIndex": 2,
    "explanation": "802.11 est la norme qui a permis de déployer massivement des technologies Wi-Fi de façon normalisée, avec une bonne interopérabilité entre les différents constructeurs."
  },
  {
    "question": "Que représentent les appellations « Wi-Fi 5 », « Wi-Fi 6 » par rapport aux normes 802.11ac, 802.11ax ?",
    "options": [
      "Une numérotation plus simple introduite par la Wi-Fi Alliance pour désigner ces mêmes normes",
      "Des normes totalement indépendantes de 802.11",
      "Des générations de matériel non compatibles entre elles",
      "Des protocoles de sécurité remplaçant WPA"
    ],
    "correctIndex": 0,
    "explanation": "La Wi-Fi Alliance a simplifié la communication autour des normes techniques (802.11ac, 802.11ax...) en les renommant Wi-Fi 5, Wi-Fi 6, etc."
  },
  {
    "question": "À quoi sert un contrôleur de points d'accès ?",
    "options": [
      "À remplacer le rôle du routeur dans le réseau filaire",
      "À chiffrer uniquement le trafic invité",
      "À servir exclusivement d'antenne relais 4G/5G",
      "À configurer et gérer plusieurs points d'accès simultanément, sans les configurer individuellement"
    ],
    "correctIndex": 3,
    "explanation": "Quand on dispose de nombreux points d'accès, un contrôleur évite d'avoir à les configurer un par un et ajoute des fonctionnalités de gestion centralisée."
  },
  {
    "question": "Le mode ad hoc en Wi-Fi correspond à quelle situation typique ?",
    "options": [
      "Un réseau avec plusieurs points d'accès reliés par un contrôleur",
      "Deux terminaux qui se connectent directement l'un à l'autre, comme un partage de connexion",
      "Un réseau d'entreprise avec authentification 802.1x",
      "Un réseau utilisant exclusivement le protocole CSMA/CD"
    ],
    "correctIndex": 1,
    "explanation": "Le mode ad hoc, illustré par le partage de connexion d'un smartphone, connecte directement deux terminaux, avec un nombre d'équipements et une portée limités."
  },
  {
    "question": "Quels sont les trois paramètres qui définissent un IBSS ?",
    "options": [
      "L'adresse IP, le masque de sous-réseau et la passerelle",
      "Le BSSID, le protocole de routage et la métrique",
      "Le nom du fabricant, le modèle et la version du firmware",
      "Le SSID, les paramètres de sécurité et la fréquence du canal radio"
    ],
    "correctIndex": 3,
    "explanation": "Ces trois paramètres permettent d'identifier de façon unique le service Wi-Fi rendu dans une infrastructure Wi-Fi de base de type IBSS."
  },
  {
    "question": "Que désigne un BSSID ?",
    "options": [
      "L'adresse MAC du point d'accès, identifiant unique de son BSS",
      "Le nom du réseau Wi-Fi affiché aux utilisateurs",
      "L'adresse IP publique du contrôleur Wi-Fi",
      "Le numéro de canal radio utilisé par le point d'accès"
    ],
    "correctIndex": 0,
    "explanation": "Dans un ESS, l'adresse MAC du point d'accès sans fil sert à identifier de manière unique chaque BSS, d'où l'acronyme BSSID (Basic Service Set Identifier)."
  },
  {
    "question": "Que faut-il pour qu'un utilisateur puisse passer d'un point d'accès à un autre sans perdre la connexion (roaming) ?",
    "options": [
      "Que les deux points d'accès utilisent des SSID différents",
      "Que les deux points d'accès soient reliés en mode ad hoc",
      "Un chevauchement entre les zones de couverture (BSA) des deux points d'accès",
      "Que l'utilisateur redémarre manuellement sa connexion Wi-Fi"
    ],
    "correctIndex": 2,
    "explanation": "Sans chevauchement des BSA, l'utilisateur traverserait une zone sans couverture (un trou noir) et perdrait la connexion en se déplaçant d'un point d'accès à l'autre."
  },
  {
    "question": "Qu'est-ce qui caractérise un ESS (Extended Service Set) ?",
    "options": [
      "Un unique point d'accès diffusant plusieurs SSID différents",
      "Plusieurs points d'accès partageant le même SSID, les mêmes paramètres de sécurité et reliés au même réseau filaire",
      "Un réseau Wi-Fi fonctionnant uniquement en mode ad hoc",
      "Un point d'accès sans connexion au réseau filaire de l'entreprise"
    ],
    "correctIndex": 1,
    "explanation": "Un ESS étend la couverture d'un même service Wi-Fi en réunissant plusieurs BSS partageant SSID et sécurité, reliés sur le même réseau filaire, ce qui permet le roaming."
  },
  {
    "question": "Un même point d'accès peut-il diffuser plusieurs SSID (par exemple un pour les employés, un pour les invités) ?",
    "options": [
      "Oui, un point d'accès peut porter un ou plusieurs SSID",
      "Non, un point d'accès ne peut diffuser qu'un seul SSID",
      "Oui, mais seulement s'il est en mode ad hoc",
      "Non, cela nécessiterait un contrôleur dédié à chaque SSID"
    ],
    "correctIndex": 0,
    "explanation": "C'est un cas d'usage classique en entreprise : un même point d'accès peut tout à fait diffuser plusieurs SSID distincts, par exemple un pour les employés et un pour les invités."
  },
  {
    "question": "Quelle est la première étape lorsqu'un terminal essaie de se connecter à un réseau sans fil ?",
    "options": [
      "L'échange de la clé de chiffrement WPA3",
      "L'attribution d'une adresse IP par DHCP",
      "La négociation du mode duplex avec le point d'accès",
      "La détection : vérifier qu'un point d'accès diffuse le SSID recherché dans la zone"
    ],
    "correctIndex": 3,
    "explanation": "L'association nécessite d'abord une phase de détection, pour savoir si un point d'accès diffusant le SSID recherché est présent dans la zone, avant l'éventuelle authentification et la connexion."
  },
  {
    "question": "Comment qualifie-t-on le mode de communication utilisé sur un réseau Wi-Fi ?",
    "options": [
      "Du full-duplex intégral, sans aucune limitation",
      "Du half-duplex alterné, où les équipements parlent chacun leur tour",
      "Du half-duplex simultané pour tous les équipements",
      "Un mode propre au Wi-Fi, sans lien avec le duplex"
    ],
    "correctIndex": 1,
    "explanation": "Comme le média radio est partagé, les équipements Wi-Fi (bornes et terminaux) doivent parler tour à tour, ce qui correspond à du half-duplex alterné."
  },
  {
    "question": "Quelle méthode le Wi-Fi utilise-t-il pour éviter les collisions sur le média partagé ?",
    "options": [
      "CSMA/CD (Carrier Sense Multiple Access with Collision Detection)",
      "STP (Spanning Tree Protocol)",
      "CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance)",
      "ARP (Address Resolution Protocol)"
    ],
    "correctIndex": 2,
    "explanation": "Contrairement au filaire qui détecte les collisions (CSMA/CD), le Wi-Fi les anticipe et les évite grâce à CSMA/CA, en demandant la parole avant d'émettre."
  },
  {
    "question": "Dans le mécanisme CSMA/CA, à quoi correspond l'échange RTS/CTS ?",
    "options": [
      "Le terminal demande la parole (RTS) et le point d'accès l'autorise à émettre (CTS)",
      "Le terminal chiffre puis déchiffre ses données",
      "Le point d'accès diffuse en boucle son SSID",
      "Le terminal change automatiquement de canal radio"
    ],
    "correctIndex": 0,
    "explanation": "RTS (Ready To Send) est un peu l'équivalent de lever la main pour demander la parole ; le point d'accès répond par un CTS (Clear To Send) pour autoriser l'émission, évitant ainsi les collisions."
  },
  {
    "question": "Comment un client Wi-Fi sait-il qu'une trame qu'il a envoyée a été correctement reçue ?",
    "options": [
      "Il n'existe aucun mécanisme d'accusé de réception en Wi-Fi",
      "Le point d'accès envoie un rapport hebdomadaire de transmission",
      "Le client vérifie l'adresse IP de destination uniquement",
      "Grâce à un accusé de réception ; son absence laisse supposer une collision et déclenche une retransmission"
    ],
    "correctIndex": 3,
    "explanation": "Toutes les transmissions Wi-Fi sont soumises à des accusés de réception ; en leur absence, l'émetteur suppose une collision et retransmet l'information."
  },
  {
    "question": "Que faut-il retenir de la suite de sécurité WEP pour le Wi-Fi ?",
    "options": [
      "Elle reste recommandée pour les petits réseaux domestiques",
      "Elle est aujourd'hui facilement cassable et ne doit surtout plus être utilisée",
      "Elle est plus récente et plus sécurisée que WPA2",
      "Elle n'utilise pas de mot de passe partagé (Pre-Shared Key)"
    ],
    "correctIndex": 1,
    "explanation": "Le WEP, basé sur une authentification par clé pré-partagée, est aujourd'hui facilement cassable avec des outils disponibles sur Internet ; il ne faut donc surtout plus l'utiliser."
  },
  {
    "question": "Parmi WPA, WPA2 et WPA3, laquelle de ces suites de sécurité ne fait aujourd'hui pas l'objet de failles facilement exploitables, tout en étant largement compatible avec le matériel existant ?",
    "options": [
      "WPA",
      "WEP",
      "WPA2",
      "Aucune, toutes ces suites sont aujourd'hui cassées"
    ],
    "correctIndex": 2,
    "explanation": "WPA a été cassé comme WEP ; WPA2, sorti en 2004, ne présente pas encore de faille facilement exploitable et bénéficie d'une large compatibilité, contrairement à WPA3 qui n'est pas encore supporté par tous les terminaux."
  },
  {
    "question": "Pourquoi faut-il être prudent avant de déployer WPA3 en entreprise ?",
    "options": [
      "Parce que WPA3 est moins sécurisé que WPA2",
      "Parce que WPA3 ne fonctionne qu'en mode ad hoc",
      "Parce que WPA3 nécessite obligatoirement un contrôleur de points d'accès",
      "Parce que tous les équipements terminaux ne sont pas encore compatibles avec cette norme"
    ],
    "correctIndex": 3,
    "explanation": "Comme toute nouvelle norme, WPA3 met du temps à se déployer complètement ; il faut donc vérifier la compatibilité de l'ensemble du parc avant de l'activer."
  },
  {
    "question": "Quel organisme est cité comme source de recommandations pour sécuriser les accès Wi-Fi ?",
    "options": [
      "L'IEEE",
      "L'ANSSI",
      "La Wi-Fi Alliance",
      "L'ICANN"
    ],
    "correctIndex": 1,
    "explanation": "L'ANSSI propose 23 mesures pour sécuriser les accès Wi-Fi, à adapter selon le contexte propre à chaque entreprise."
  },
  {
    "question": "Où se trouve le plus souvent la carte réseau sans fil d'un smartphone ou d'un ordinateur portable ?",
    "options": [
      "Toujours ajoutée sous forme de clé USB externe",
      "Placée exclusivement dans le point d'accès",
      "Intégrée dans le socle de l'appareil, généralement invisible pour l'utilisateur",
      "Uniquement disponible en option payante"
    ],
    "correctIndex": 2,
    "explanation": "La carte réseau sans fil est la plupart du temps intégrée directement dans l'appareil, sans que l'utilisateur ne la voie."
  },
  {
    "question": "Que retenir du canal radio utilisé par un SSID ?",
    "options": [
      "Le point d'accès diffuse ce SSID sur un seul canal, mais le terminal ne mémorise pas ce canal en dur",
      "Le terminal doit configurer manuellement le canal à chaque connexion",
      "Un SSID ne peut jamais changer de canal une fois configuré",
      "Le canal radio est identique pour tous les SSID d'une entreprise"
    ],
    "correctIndex": 0,
    "explanation": "Le canal utilisé est structurant pour le point d'accès, mais le terminal ne le retient pas de façon figée puisqu'il peut se connecter à plusieurs bornes différentes qui n'utilisent pas forcément le même canal."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-07-les-infrastructures-reseau-module-5-la-listes-des-controles-d-acces",
      dataId: "quiz-cours-07-les-infrastructures-reseau-module-5-la-listes-des-controles-d-acces-data",
    });
  });
</script>
