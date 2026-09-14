# Module 3 : Le routage

*Cours : [Cours 7 - Les infrastructures réseau](../index.md)*

## 🎯 Objectif du module

Ce module présente les principes du routage IPv4 : rôle du routeur, table de routage, processus de transmission d'un paquet, types de routes, distance administrative et métrique. Il couvre ensuite la configuration initiale d'un routeur Cisco, la mise en œuvre du routage statique puis du routage dynamique (RIP v2), et enfin les trois méthodes de routage inter-VLAN : méthode traditionnelle, Router-on-a-Stick et commutateur de couche 3.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Principes du routage

### 1.1 Le rôle du routeur

Le **routeur** interconnecte différents réseaux (physiques ou virtuels à base de VLAN) et achemine les paquets d'un réseau IP vers un autre. Il **bloque le trafic de diffusion**, qui par définition s'arrête au domaine de diffusion.

Le routeur fonctionne au niveau de la **couche 3**, mais s'appuie sur les couches 1 et 2 sous-jacentes : il désencapsule les trames qui lui sont destinées, consulte sa **table de routage**, puis réencapsule les paquets IP pour les transmettre.

### 1.2 La table de routage

Le routage IPv4 permet de trouver un chemin vers une adresse IP donnée — pas nécessairement le plus court, mais celui choisi par la configuration. Pour cela, le routeur s'appuie sur une **table de routage**, qui liste les destinations qu'il connaît (l'image d'un rond-point dont les panneaux indiqueraient les destinations accessibles derrière chaque rue).

📌 Terminologie : la **route** s'entend à l'échelle d'un seul routeur ; l'**itinéraire** ou le **chemin** s'entend à l'échelle de l'ensemble des routeurs traversés par un paquet.

Pour chaque paquet, le routeur détermine, à partir de l'adresse IP de destination, sur quelle interface l'envoyer :

- soit il connaît **directement** la destination finale et peut y envoyer le paquet ;
- soit il s'appuie sur un **autre routeur**, qui refera le même travail — de proche en proche, jusqu'à la destination.

⚠️ Si le réseau de destination n'est pas connu de la table de routage, le paquet est **supprimé** (l'expéditeur peut en être averti).

### 1.3 Le processus de routage en quatre étapes

1. Le routeur reçoit une **trame Ethernet** et vérifie sa conformité, puis retire l'en-tête Ethernet.
2. Il examine le **paquet IP** contenu dans la trame, en particulier l'**adresse IP de destination**.
3. Il soumet cette adresse à sa **table de routage** pour déterminer s'il sait la joindre.
4. Deux cas de figure :
   - la destination est dans un réseau **directement connecté** : le routeur réencapsule le paquet dans une trame Ethernet, effectue une requête **ARP** sur la destination pour obtenir son adresse MAC, et envoie le paquet directement ;
   - la destination n'est pas directement connue, mais la route indique un **next hop** (un autre routeur) : le routeur construit une trame Ethernet à destination de l'adresse MAC de ce routeur (obtenue elle aussi par ARP), qui se chargera à son tour d'acheminer le paquet.

### 1.4 Lecture d'une table de routage et types de routes

Une entrée de table de routage comporte : la lettre indiquant **comment la route a été apprise**, le **réseau de destination**, la **distance administrative** et la **métrique**, le **next hop** (si la route n'est pas directement connectée) et l'**interface de sortie**.

| Lettre | Type de route | Comment elle est apprise |
| --- | --- | --- |
| **C** | Connected | Une adresse IP a été configurée par l'administrateur dans ce réseau, sur ce routeur |
| **L** | Local | Ajoutée automatiquement avec les routes Connected |
| **S** | Static | Ajoutée manuellement par l'administrateur |
| **R** | RIP | Apprise dynamiquement via le protocole RIP |
| *(autres lettres : OSPF, BGP, etc.)* | — | Apprises via d'autres protocoles de routage dynamique |

Le réseau de destination et son masque définissent une **étendue** d'adresses IP joignables via cette route. 📌 S'il existe plusieurs routes possibles pour une même adresse IP, le routeur choisit toujours **la plus précise (la plus restrictive)**.

Une route particulière, la **route par défaut** (`0.0.0.0/0`), indique : « si je ne connais pas ce réseau par un autre moyen, c'est par là qu'il faut passer » — l'équivalent du panneau « Toutes directions » sur un rond-point.

### 1.5 La distance administrative et la métrique

La **distance administrative** permet de comparer et de prioriser des routes apprises par des moyens différents pour un même réseau : les routes **directement connectées** sont toujours préférées ; viennent ensuite les routes apprises par les protocoles dynamiques (une route apprise via **OSPF** est toujours préférée à la même route apprise via **RIP**, car OSPF a une distance administrative par défaut plus faible).

⚠️ Il doit s'agir de la **même route** (même réseau, même masque) pour que la comparaison des distances administratives s'applique.

Lorsque deux routes vers le même réseau ont la **même distance administrative** (ex. deux routes apprises via OSPF), on utilise la **métrique** pour les départager. Le calcul de la métrique dépend du protocole :

| Protocole | Base de la métrique |
| --- | --- |
| Statique | Configurée manuellement |
| RIP | Nombre de sauts traversés |
| OSPF | Bande passante cumulée des interfaces traversées |

Avec RIP, seul le nombre de sauts compte, indépendamment de la vitesse des interfaces. Avec OSPF, le chemin choisi est celui offrant les meilleures caractéristiques de bande passante (ex. un chemin en Gigabit sera préféré à un chemin plus lent, même avec plus de sauts).

## 2. Configuration initiale d'un routeur

La configuration de base d'un routeur Cisco reprend les mêmes éléments que celle d'un commutateur : nom de l'équipement, bannière, mots de passe (console et connexions à distance).

On configure ensuite les adresses IP sur les interfaces concernées :

```
Router(config)# interface gigabitEthernet 0/0/0
Router(config-if)# ip address 192.168.10.254 255.255.255.0
Router(config-if)# no shutdown

Router(config)# interface gigabitEthernet 0/0/1
Router(config-if)# ip address 192.168.20.254 255.255.255.0
Router(config-if)# no shutdown
```

⚠️ Sur un routeur Cisco, les interfaces sont **désactivées (shutdown) par défaut** : il faut donc systématiquement les activer avec `no shutdown`.

La configuration IP se vérifie avec :

```
show ip interface brief
```

⚠️ Cette commande n'affiche pas les masques. Elle indique en revanche :

| Colonne | Signification |
| --- | --- |
| **Status** | État physique de l'interface (connexion active ou non) |
| **Protocol** | État du protocole de liaison (négociation vitesse/duplex, etc.) |

📌 Le trafic ne peut passer que si **Status** et **Protocol** sont tous les deux à **up**.

La configuration de SSH est strictement identique à celle d'un commutateur (voir module 2) : `hostname`, génération des clés cryptographiques, `ip ssh version 2`, création des utilisateurs, sécurisation des lignes VTY (authentification locale uniquement, transport SSH), puis sauvegarde de la configuration. La vérification se fait également avec `show ip ssh` et `show users`. Une fois configuré, il est possible de se connecter en SSH sur n'importe laquelle des adresses IP configurées sur le routeur.

## 3. Le routage statique

Le routage statique convient bien aux réseaux de **taille moyenne** : simple à mettre en œuvre, peu consommateur de ressources, avec une sécurité maîtrisée. ⚠️ En contrepartie, il doit être configuré **manuellement** : sur des réseaux complexes ou dont la topologie change souvent, il implique un travail d'administration important.

### 3.1 Rappel : le cheminement d'un ping

Lorsqu'un terminal A initie un ping vers un terminal B, il suit ce raisonnement :

1. L'adresse de destination est-elle une **adresse locale** ? Si oui, envoi via la boucle locale (`127.0.0.1`).
2. Sinon, le terminal calcule son **adresse réseau** (à partir de son IP et de son masque) et celle de la destination, pour savoir si elles appartiennent au même réseau.
3. Si elles diffèrent, le terminal vérifie s'il possède une **gateway** (passerelle) : sans gateway, il renvoie une erreur ICMP (« Défaillance générale » sous Windows) signifiant qu'il ne sait pas joindre la destination.
4. S'il possède une gateway, il vérifie qu'elle est bien dans un réseau qu'il peut joindre, récupère (ou demande via **ARP**) son adresse MAC, puis envoie le paquet vers cette gateway — qui constitue le premier saut du chemin vers la destination finale.

Ce même processus se répète à l'intérieur de chaque équipement traversé jusqu'à la destination.

### 3.2 Raisonnement pour configurer le routage statique

Pour chaque réseau, deux questions se posent, **routeur par routeur** :

1. Le routeur connaît-il **nativement** ce réseau, c'est-à-dire y est-il directement connecté ? Si oui, rien à faire de plus.
2. Sinon, il faut ajouter une **route statique** adéquate.

⚠️ Le routage statique se raisonne toujours **routeur par routeur** : chaque routeur doit avoir les routes nécessaires pour joindre tous les réseaux qu'il ne connaît pas nativement.

### 3.3 Exemple de mise en œuvre

Topologie : réseau 10 (machine A, connecté à R1) — réseau 20 (interconnexion R1↔R2) — réseau 30 (machine C, connecté à R2).

Sur **R1** :

```
R1(config)# interface gigabitEthernet 0/0/0
R1(config-if)# ip address <IP> <masque>
R1(config-if)# no shutdown

R1(config)# interface gigabitEthernet 0/0/1
R1(config-if)# ip address <IP> <masque>
R1(config-if)# no shutdown

R1(config)# ip route 192.168.30.0 255.255.255.0 <IP_du_routeur_R2_sur_le_réseau_20>
```

Après configuration des interfaces, R1 connaît nativement les réseaux 10 et 20 (Connected). Il lui manque le réseau 30, ajouté via une route statique passant par R2.

Sur **R2**, on fait l'inverse : une route statique pour joindre le réseau 10 via l'adresse IP de R1 sur le réseau 20.

```
R2(config)# ip route 192.168.10.0 255.255.255.0 <IP_du_routeur_R1_sur_le_réseau_20>
```

Résultat : `show ip route` sur chacun des deux routeurs affiche désormais une route pour chacun des trois réseaux (10, 20 et 30).

## 4. Le routage dynamique

### 4.1 Panorama des protocoles de routage dynamique

| Catégorie | Description |
| --- | --- |
| **IGP** (Interior Gateway Protocol) | Protocoles utilisés à l'intérieur du réseau d'une même entreprise |
| **EGP** (Exterior Gateway Protocol) | Protocoles utilisés pour l'interconnexion entre entreprises |

Parmi les IGP, on distingue :

- les protocoles à **vecteur de distance** (ex. RIP), qui se basent sur le nombre de sauts ;
- les protocoles à **état de lien** (ex. OSPF), qui déterminent le lien le plus performant.

### 4.2 RIP version 2

📌 RIP v2 est étudié ici à titre pédagogique pour comprendre le principe du routage dynamique, mais il est **très peu utilisé en entreprise** aujourd'hui, du fait de ses limitations.

Caractéristiques :

| Caractéristique | RIP v2 |
| --- | --- |
| Type | Vecteur de distance (choisit selon le nombre de sauts) |
| Mise en œuvre | Très simple à configurer et maintenir |
| Fréquence d'annonce | Toutes les 30 secondes |
| Limite | 15 sauts maximum |
| Adressage | Adresse de multidiffusion |
| Compatibilité | IPv4 et IPv6 |

### 4.3 Configuration de RIP v2

```
Router(config)# router rip
Router(config-router)# version 2
Router(config-router)# network 192.168.10.0
Router(config-router)# network 192.168.20.0
```

⚠️ Par défaut, c'est la **version 1** qui s'active : il faut explicitement configurer `version 2`.

Les commandes `network` définissent les réseaux sur lesquels RIP doit fonctionner : à la fois les réseaux sur lesquels RIP doit dialoguer avec d'autres routeurs, et les réseaux qui doivent être annoncés. Dans l'exemple à trois réseaux du point 3.3, R1 s'active sur les réseaux 10 et 20, R2 sur les réseaux 20 et 30 : sur le réseau 20 (commun), les deux routeurs dialoguent, R1 annonçant le réseau 10 et R2 le réseau 30.

Pour diagnostiquer un dysfonctionnement, on peut activer le mode debug de RIP, qui affiche les événements liés à l'émission et la réception des paquets :

```
debug ip rip
undebug all
```

⚠️ Le mode debug consomme beaucoup de ressources sur le routeur : penser à le désactiver avec `undebug all` une fois le diagnostic terminé.

Vérification :

```
show ip route
```

Une route apprise via RIP apparaît avec la lettre **R**, une métrique de 1 (un saut) et une distance administrative de **120**, avec le next-hop et l'interface associés.

## 5. Le routage inter-VLAN

Dans le réseau d'une entreprise, plusieurs VLAN — parfois des dizaines — doivent être interconnectés par du routage, afin que le trafic puisse passer de l'un à l'autre. Trois méthodes existent.

### 5.1 Méthode traditionnelle

⚠️ Cette topologie n'est presque plus utilisée en pratique ; elle reste présentée à des fins pédagogiques pour expliquer les bases du routage inter-VLAN.

Le routeur utilise **une interface physique par VLAN** à router. Le switch, lui, dispose d'interfaces d'accès pour chaque VLAN, plus une interface d'interconnexion avec le routeur pour chacun des VLAN.

Sur le routeur :

```
Router(config)# interface gigabitEthernet 0/0/0
Router(config-if)# ip address <IP_VLAN10> <masque>
Router(config-if)# no shutdown

Router(config)# interface gigabitEthernet 0/0/1
Router(config-if)# ip address <IP_VLAN20> <masque>
Router(config-if)# no shutdown
```

Sur le switch, on crée les VLAN 10 et 20, puis on affecte les ports d'accès et les ports d'interconnexion avec le routeur aux VLAN correspondants.

`show ip route` fait apparaître, sur le routeur, les deux réseaux comme routes directement connectées. Un `tracert` (Windows) confirme deux sauts : le routeur, puis la destination.

### 5.2 Router-on-a-Stick

📌 Méthode largement utilisée en entreprise : plutôt que de multiplier les interfaces physiques sur le routeur, on utilise des **sous-interfaces** sur une seule interface physique configurée en trunk, pour faire remonter l'ensemble des VLAN à router.

Sur le routeur, on crée une sous-interface par VLAN, avec l'encapsulation 802.1Q :

```
Router(config)# interface gigabitEthernet 0/0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address <IP_VLAN10> <masque>

Router(config)# interface gigabitEthernet 0/0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address <IP_VLAN20> <masque>

Router(config)# interface gigabitEthernet 0/0/0
Router(config-if)# no shutdown
```

⚠️ Penser à activer (`no shutdown`) l'interface **physique** sous-jacente, qui peut être désactivée par défaut.

Sur le switch, les étapes sont les mêmes que précédemment, à ceci près que le port relié au routeur est configuré en **trunk** :

```
Switch(config)# interface gigabitEthernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20
```

📌 Si le mode trunk est activé sans liste explicite de VLAN autorisés, tous les VLAN sont autorisés par défaut ; il est cependant de bon usage de restreindre explicitement la liste des VLAN autorisés.

La table de routage reste similaire, avec les sous-interfaces comme interfaces de sortie. Le comportement observé (ping, traceroute) est strictement identique à la méthode traditionnelle : du point de vue des autres machines du réseau, la méthode utilisée par le routeur est totalement transparente.

### 5.3 Commutateur de couche 3

📌 C'est la topologie la plus répandue en entreprise aujourd'hui : un même équipement assure à la fois la commutation et le routage (commutateur de couche 3, ou *L3 switch*).

Étapes de configuration :

1. Connecter les périphériques, créer les VLAN et affecter les ports aux bons VLAN.
2. Créer une **SVI** par VLAN (comme pour l'administration à distance, module 2), portant l'adresse IP de la passerelle du VLAN correspondant.
3. **Activer le routage IP** de façon explicite.

```
Switch(config)# vlan 10
Switch(config-vlan)# name VLAN_10
Switch(config)# vlan 20
Switch(config-vlan)# name VLAN_20

Switch(config)# interface vlan 10
Switch(config-if)# description Passerelle VLAN 10
Switch(config-if)# ip address <IP_VLAN10> <masque>

Switch(config)# interface vlan 20
Switch(config-if)# description Passerelle VLAN 20
Switch(config-if)# ip address <IP_VLAN20> <masque>

Switch(config)# interface fastEthernet 0/5
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10

Switch(config)# interface fastEthernet 0/10
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 20

Switch(config)# ip routing
```

⚠️ Ne pas oublier la commande `ip routing` : contrairement à un routeur, un commutateur ne route pas le trafic par défaut, il faut l'activer explicitement.

`show ip route` fait apparaître les deux sous-réseaux correspondant aux deux VLAN. Comme pour les autres méthodes, la connectivité entre les deux machines et le résultat d'un traceroute sont identiques : la topologie reste transparente pour les autres équipements du réseau.

## ✅ Points clés à retenir

_À compléter._

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-3-le-routage"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-3-le-routage-data">
[
  {
    "question": "Quel est le rôle principal d'un routeur vis-à-vis du trafic de diffusion ?",
    "options": [
      "Il amplifie le trafic de diffusion vers tous les réseaux connectés",
      "Il convertit le trafic de diffusion en trafic unicast automatiquement",
      "Il bloque le trafic de diffusion, qui s'arrête au domaine de diffusion",
      "Il stocke le trafic de diffusion dans sa table de routage"
    ],
    "correctIndex": 2,
    "explanation": "Par définition, le trafic de diffusion s'arrête au domaine de diffusion ; le routeur, en interconnectant des réseaux différents, ne le relaie donc pas d'un réseau à l'autre."
  },
  {
    "question": "Sur quelle couche du modèle OSI un routeur fonctionne-t-il principalement, tout en s'appuyant sur les couches inférieures ?",
    "options": [
      "La couche 3",
      "La couche 2",
      "La couche 4",
      "La couche 7"
    ],
    "correctIndex": 0,
    "explanation": "Le routage est un mécanisme de couche 3, mais celle-ci s'appuie nécessairement sur les couches 2 et 1 pour désencapsuler puis réencapsuler les trames."
  },
  {
    "question": "Sur quoi se base un routeur pour décider par quelle interface envoyer un paquet IP ?",
    "options": [
      "Sur l'adresse MAC source du paquet uniquement",
      "Sur l'ordre d'arrivée des paquets sur ses interfaces",
      "Sur la taille du paquet à transmettre",
      "Sur sa table de routage et l'adresse IP de destination du paquet"
    ],
    "correctIndex": 3,
    "explanation": "Le routeur consulte sa table de routage, qui liste les destinations connues, pour déterminer par quelle interface (et éventuellement vers quel prochain routeur) envoyer le paquet selon son adresse IP de destination."
  },
  {
    "question": "Dans le processus de routage, que fait le routeur si le réseau de destination est directement connecté ?",
    "options": [
      "Il envoie systématiquement le paquet vers la route par défaut",
      "Il fait une requête ARP pour trouver l'adresse MAC et envoie le paquet directement à la machine",
      "Il supprime le paquet car il ne connaît pas de next hop",
      "Il attend une confirmation du protocole de routage dynamique"
    ],
    "correctIndex": 1,
    "explanation": "Quand la destination appartient à un réseau directement connecté, le routeur réencapsule le paquet dans une trame Ethernet après avoir déterminé l'adresse MAC de la machine via une requête ARP."
  },
  {
    "question": "Que se passe-t-il quand un routeur reçoit un paquet à destination d'un réseau totalement inconnu dans sa table de routage ?",
    "options": [
      "Le routeur le retransmet automatiquement sur toutes ses interfaces",
      "Le routeur le met en attente jusqu'à apprentissage de la route",
      "Le routeur le renvoie systématiquement vers Internet",
      "Le routeur jette (supprime) le paquet"
    ],
    "correctIndex": 3,
    "explanation": "Faute de route correspondante, le paquet est supprimé ; l'expéditeur peut éventuellement être averti que la destination n'a pas pu être jointe."
  },
  {
    "question": "Dans la table de routage, que signifie la lettre C devant une route ?",
    "options": [
      "Route Connected : le routeur possède une adresse IP directement dans ce réseau",
      "Route Configurée manuellement via une commande statique",
      "Route apprise via un protocole de routage dynamique",
      "Route Corrompue détectée par le routeur"
    ],
    "correctIndex": 0,
    "explanation": "Une route Connected apparaît automatiquement dès qu'une adresse IP est configurée sur une interface du routeur dans ce réseau, sans besoin de next hop."
  },
  {
    "question": "Que représente la route 0.0.0.0/0 dans une table de routage ?",
    "options": [
      "Une route bloquant tout le trafic entrant",
      "Une erreur de configuration à corriger systématiquement",
      "La route par défaut, utilisée quand aucune autre route plus précise ne correspond",
      "La route utilisée uniquement pour les protocoles de diffusion"
    ],
    "correctIndex": 2,
    "explanation": "C'est l'équivalent du panneau « Toutes directions » sur un rond-point : si aucune route plus spécifique ne correspond à l'adresse de destination, c'est cette route par défaut qui est utilisée."
  },
  {
    "question": "Si plusieurs routes possibles existent pour une même adresse IP de destination, laquelle le routeur choisit-il ?",
    "options": [
      "Toujours la route par défaut",
      "La route la plus précise (le chemin le plus restrictif)",
      "La première route apprise chronologiquement",
      "La route avec le masque le plus court"
    ],
    "correctIndex": 1,
    "explanation": "Le routeur privilégie systématiquement la route la plus spécifique, c'est-à-dire celle dont le préfixe (masque) correspond le plus précisément à l'adresse de destination."
  },
  {
    "question": "À quoi sert la distance administrative dans une table de routage ?",
    "options": [
      "À donner une priorité entre des routes apprises par des méthodes différentes vers le même réseau",
      "À calculer la bande passante disponible sur une interface",
      "À chiffrer les échanges entre protocoles de routage",
      "À limiter le nombre de sauts autorisés dans le réseau"
    ],
    "correctIndex": 0,
    "explanation": "Une route directement connectée sera toujours préférée à une route statique ou dynamique vers le même réseau, et entre deux protocoles dynamiques, celui avec la distance administrative la plus faible (par exemple OSPF face à RIP) l'emporte."
  },
  {
    "question": "Quand deux routes vers le même réseau ont la même distance administrative, quel critère les départage ?",
    "options": [
      "L'ordre alphabétique de l'interface de sortie",
      "L'adresse IP la plus basse du next hop",
      "La date de création de la route",
      "La métrique"
    ],
    "correctIndex": 3,
    "explanation": "À distance administrative égale, c'est la métrique - qui dépend du protocole, par exemple le nombre de sauts pour RIP ou la bande passante cumulée pour OSPF - qui détermine la route choisie."
  },
  {
    "question": "Sur un routeur Cisco, dans quel état sont les interfaces par défaut, et que faut-il faire pour y remédier ?",
    "options": [
      "Elles sont actives par défaut, il faut les désactiver avec shutdown si besoin",
      "Elles sont en shutdown par défaut, il faut les activer avec no shutdown",
      "Elles sont en mode trunk par défaut",
      "Elles nécessitent une licence spécifique pour être activées"
    ],
    "correctIndex": 1,
    "explanation": "Contrairement aux commutateurs, les interfaces d'un routeur Cisco sont désactivées par défaut ; il faut systématiquement penser à les activer avec no shutdown après leur configuration."
  },
  {
    "question": "Dans le résultat de la commande show ip interface brief, que signifie le fait que status et protocol soient tous les deux à up ?",
    "options": [
      "L'interface est en mode half duplex forcé",
      "L'adresse IP de l'interface est erronée",
      "Le trafic peut passer sur cette interface",
      "L'interface attend une confirmation manuelle de l'administrateur"
    ],
    "correctIndex": 2,
    "explanation": "Le status reflète l'état physique de la connexion et le protocol l'état de la négociation de liaison ; les deux doivent être up pour que le trafic circule effectivement."
  },
  {
    "question": "Le routage statique est particulièrement adapté à quel type de réseau ?",
    "options": [
      "Les réseaux de taille moyenne, avec une topologie qui change peu",
      "Les très grands réseaux dont la topologie change en permanence",
      "Uniquement les réseaux utilisant IPv6",
      "Les réseaux ne comportant qu'un seul routeur"
    ],
    "correctIndex": 0,
    "explanation": "Simple à mettre en œuvre et peu gourmand en ressources, le routage statique nécessite en revanche un travail d'administration manuel important si la topologie change souvent, ce qui le rend moins adapté aux réseaux complexes ou changeants."
  },
  {
    "question": "Quand on configure du routage statique, à quelle échelle faut-il raisonner ?",
    "options": [
      "À l'échelle du réseau entier en une seule commande globale",
      "Uniquement sur le routeur de bordure connecté à Internet",
      "À l'échelle de chaque VLAN indépendamment des routeurs",
      "Routeur par routeur : chaque routeur doit connaître les routes vers les réseaux qu'il ne connaît pas nativement"
    ],
    "correctIndex": 3,
    "explanation": "Le routage statique est une réflexion à mener sur chaque routeur individuellement : pour chaque réseau non directement connecté, il faut ajouter la route statique adéquate sur ce routeur précis."
  },
  {
    "question": "Parmi les protocoles de routage dynamique, quelle est la différence entre un IGP et un EGP ?",
    "options": [
      "L'IGP ne fonctionne qu'en IPv6, l'EGP qu'en IPv4",
      "L'IGP s'utilise à l'intérieur d'une même entreprise, l'EGP plutôt entre entreprises",
      "L'IGP est un protocole à état de lien, l'EGP toujours à vecteur de distance",
      "L'IGP nécessite un routeur Cisco, l'EGP fonctionne avec tout constructeur"
    ],
    "correctIndex": 1,
    "explanation": "Les IGP (Interior Gateway Protocols) sont mis en œuvre à l'intérieur du réseau d'une même entreprise, alors que les EGP (Exterior Gateway Protocols) servent plutôt à l'interconnexion entre entreprises ou opérateurs."
  },
  {
    "question": "Sur quoi se base RIP (protocole à vecteur de distance) pour déterminer le meilleur chemin ?",
    "options": [
      "Sur la bande passante cumulée des interfaces traversées",
      "Sur la latence mesurée en temps réel",
      "Sur le nombre de sauts (routeurs traversés)",
      "Sur le nombre de VLAN traversés"
    ],
    "correctIndex": 2,
    "explanation": "RIP est un protocole à vecteur de distance : chaque routeur traversé ajoute un saut, et le chemin avec le moins de sauts est préféré, quelle que soit la vitesse réelle des liens."
  },
  {
    "question": "Quelle caractéristique limite RIP dans les grands réseaux ?",
    "options": [
      "Il ne peut gérer que 2 routeurs au total",
      "Il ne fonctionne qu'avec IPv6",
      "Il nécessite une adresse IP publique sur chaque routeur",
      "Il est limité à 15 sauts maximum"
    ],
    "correctIndex": 3,
    "explanation": "RIP émet un message toutes les 30 secondes et ne peut pas gérer un chemin de plus de 15 sauts, ce qui le rend peu adapté aux grands réseaux malgré sa simplicité."
  },
  {
    "question": "Dans le routage inter-VLAN « Router-on-a-Stick », comment le routeur récupère-t-il le trafic de plusieurs VLAN via une seule interface physique ?",
    "options": [
      "En créant une seule adresse IP partagée par tous les VLAN",
      "En créant des sous-interfaces avec l'encapsulation 802.1Q (dot1Q), une par VLAN",
      "En dupliquant l'interface physique autant de fois que de VLAN",
      "En désactivant le trunk sur le commutateur connecté"
    ],
    "correctIndex": 1,
    "explanation": "Une seule interface physique reçoit le trafic trunké de plusieurs VLAN, et chaque sous-interface (par exemple 0/0/0.10) porte l'encapsulation dot1Q et l'adresse IP correspondant à son VLAN."
  },
  {
    "question": "Dans le routage inter-VLAN via un commutateur de couche 3, quelle commande faut-il impérativement activer, contrairement à un simple commutateur ?",
    "options": [
      "ip forwarding",
      "vlan routing",
      "ip routing",
      "switchport routed"
    ],
    "correctIndex": 2,
    "explanation": "Un commutateur de couche 3 n'active pas le routage IP par défaut ; il faut explicitement taper ip routing pour qu'il route le trafic entre ses SVI, en plus de commuter."
  },
  {
    "question": "Que porte une SVI (Switch Virtual Interface) sur un commutateur de couche 3 utilisé pour le routage inter-VLAN ?",
    "options": [
      "L'adresse IP de passerelle correspondant à un VLAN donné",
      "L'adresse MAC physique du commutateur",
      "La liste des VLAN autorisés sur le port trunk",
      "Le mot de passe d'administration du commutateur"
    ],
    "correctIndex": 0,
    "explanation": "Chaque SVI, créée avec le même identifiant que le VLAN correspondant, porte l'adresse IP qui sert de passerelle pour les machines de ce VLAN."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-07-les-infrastructures-reseau-module-3-le-routage",
      dataId: "quiz-cours-07-les-infrastructures-reseau-module-3-le-routage-data",
    });
  });
</script>
