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

- Une ACL est une liste d'ACE, évaluées **dans l'ordre**, avec un **refus implicite** systématique en fin de liste. ⚠️ Un routeur sorti du carton n'a aucune ACL configurée par défaut.
- ACL **standard** = filtrage sur l'adresse IP **source** uniquement (couche 3) ; ACL **étendue** = filtrage sur source, destination, protocole et ports (couches 3 et 4).
- ⚠️ Piège classique : une ACL vide appliquée à une interface bloque tout le trafic (deny implicite) ; toujours démarrer par un `permit` explicite puis affiner.
- 📌 `ip access-list` (nommée ou numérotée, interactive) est recommandée face à `access-list` (uniquement numérotée pour les ACL standard) : plus lisible et plus simple à modifier.
- Les ACL Cisco utilisent un **masque inversé** (wildcard mask) ; `host` remplace un masque /32, `any` remplace `0.0.0.0 255.255.255.255`.
- Une **ACL standard** se place au plus près de la **destination** (elle ne filtre que sur la source) ; une **ACL étendue** se place au plus près de la **source** (elle peut filtrer sur destination/port, donc bloquer le trafic le plus tôt possible).
- La **matrice de flux** (5 critères : IP source, IP destination, protocole, port source, port destination) est un préalable indispensable à la conception d'un filtrage cohérent.
- Le mot-clé **established** permet de faire fonctionner un routeur Cisco comme un pare-feu avec état (*stateful*), en autorisant automatiquement le retour d'une connexion déjà initiée, sans avoir à créer une ACL symétrique complète dans les deux sens.
- Commandes de vérification essentielles : `show access-list` (compteurs de correspondance), `show ip interface <interface>` (ACL appliquée in/out), `clear access-list counters` (remise à zéro des compteurs).

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-5-la-listes-des-controles-d-acces"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-5-les-listes-de-controle-d-acces-data">
[
  {
    "question": "Qu'est-ce qu'une ACE dans une ACL Cisco ?",
    "options": [
      "Le nom donné obligatoirement à chaque ACL",
      "Un compteur de paquets bloqués",
      "Une entrée de contrôle d'accès, une ligne de la liste",
      "Le protocole utilisé pour transporter l'ACL"
    ],
    "correctIndex": 2,
    "explanation": "Une ACL est une liste qui contient une ou plusieurs entrées de contrôle d'accès, appelées ACE, comparées au trafic dans l'ordre jusqu'à ce que l'une d'elles corresponde."
  },
  {
    "question": "Que se passe-t-il si un paquet ne correspond à aucune ACE explicite d'une ACL ?",
    "options": [
      "Il est rejeté, car il existe toujours un deny implicite par défaut",
      "Il est automatiquement autorisé par défaut",
      "Il est mis en attente jusqu'à ce qu'une règle soit ajoutée",
      "Il est redirigé vers l'administrateur pour validation"
    ],
    "correctIndex": 0,
    "explanation": "Chaque ACL se termine par une ACE implicite de type deny, qui rejette tout paquet ne correspondant à aucune règle explicite - il faut donc bien penser à autoriser ce qui doit l'être."
  },
  {
    "question": "Par défaut, quand un routeur Cisco sort du carton, combien d'ACL sont configurées ?",
    "options": [
      "Une ACL standard bloquant tout le trafic entrant",
      "Une ACL par interface autorisant tout le trafic",
      "Une ACL par défaut pour les lignes VTY uniquement",
      "Aucune, ni sur les interfaces ni sur l'administration"
    ],
    "correctIndex": 3,
    "explanation": "Un routeur neuf ne comporte aucune ACL, ni pour le filtrage du trafic, ni pour l'accès administratif ; il faut les créer explicitement."
  },
  {
    "question": "Quelle est la principale limite d'une ACL standard par rapport à une ACL étendue ?",
    "options": [
      "Elle ne peut être appliquée qu'en sortie d'interface",
      "Elle ne peut filtrer que sur l'adresse IP source",
      "Elle ne peut contenir qu'une seule ACE",
      "Elle ne peut pas utiliser le mot-clé deny"
    ],
    "correctIndex": 1,
    "explanation": "Les ACL standard travaillent uniquement au niveau 3 et ne filtrent que sur l'adresse IP source, contrairement aux ACL étendues qui peuvent aussi filtrer sur la destination et des critères de couche 4."
  },
  {
    "question": "Où doit-on de préférence placer une ACL standard destinée à bloquer un trafic donné ?",
    "options": [
      "Au plus près de la source",
      "Sur l'interface la plus rapide du réseau",
      "Peu importe, cela n'a pas d'impact",
      "Au plus près de la destination"
    ],
    "correctIndex": 3,
    "explanation": "Comme une ACL standard ne filtre que sur la source, et que les chemins depuis la source peuvent être multiples, la placer près de la destination permet de n'utiliser qu'une seule ACL pour couvrir tous les chemins possibles."
  },
  {
    "question": "Où doit-on de préférence placer une ACL étendue destinée à bloquer un trafic donné ?",
    "options": [
      "Au plus près de la source",
      "Au plus près de la destination",
      "Toujours sur le routeur de bordure Internet",
      "Sur l'interface configurée en VLAN natif"
    ],
    "correctIndex": 0,
    "explanation": "Une ACL étendue pouvant filtrer sur la source, la destination et le port, il est préférable de bloquer le trafic indésirable le plus tôt possible, près de la source, pour éviter de charger inutilement les routeurs intermédiaires."
  },
  {
    "question": "Quelle est la différence principale entre la commande access-list et la commande ip access-list ?",
    "options": [
      "access-list est plus récente et remplace ip access-list",
      "ip access-list ne fonctionne que sur les commutateurs de couche 3",
      "ip access-list permet de créer des ACL standard ou étendues, numérotées ou nommées, et est interactive",
      "access-list permet de nommer les ACL, contrairement à ip access-list"
    ],
    "correctIndex": 2,
    "explanation": "Contrairement à access-list qui ne crée que des ACL standard numérotées, ip access-list permet de créer des ACL standard ou étendues, avec un numéro ou un nom explicite, et fonctionne en mode de configuration interactif."
  },
  {
    "question": "Comment calcule-t-on un masque inversé (wildcard mask) à partir d'un masque standard ?",
    "options": [
      "En inversant uniquement le premier octet du masque",
      "En soustrayant le masque standard au masque complet 255.255.255.255",
      "En multipliant le masque standard par 2",
      "En additionnant le masque standard à l'adresse IP"
    ],
    "correctIndex": 1,
    "explanation": "On obtient le masque inversé en soustrayant le masque à convertir (par exemple 255.255.255.0) au masque complet 255.255.255.255, ce qui donne ici 0.0.0.255."
  },
  {
    "question": "Que signifie le mot-clé host dans une ACL Cisco ?",
    "options": [
      "Il désigne une seule adresse IP précise, équivalent à un masque /32",
      "Il désigne l'ensemble des adresses IP possibles",
      "Il désigne uniquement les adresses du réseau local",
      "Il active le suivi d'état (stateful) de la connexion"
    ],
    "correctIndex": 0,
    "explanation": "host suivi d'une adresse IP est un raccourci pour n'autoriser ou interdire que cette adresse précise, équivalent à un masque inversé de 0.0.0.0 (donc /32)."
  },
  {
    "question": "Que signifie le mot-clé any dans une ACL Cisco ?",
    "options": [
      "Il désigne uniquement l'adresse de diffusion",
      "Il autorise seulement les machines internes du réseau",
      "Il correspond à un masque /32 comme host",
      "Il autorise ou interdit toutes les adresses IP, équivalent à 0.0.0.0 255.255.255.255"
    ],
    "correctIndex": 3,
    "explanation": "any est un raccourci pratique pour désigner l'ensemble des adresses IP, évitant d'avoir à écrire 0.0.0.0 255.255.255.255."
  },
  {
    "question": "Qu'est-ce qu'une matrice de flux ?",
    "options": [
      "La table de routage complète d'un routeur",
      "Un tableau ou schéma répertoriant l'ensemble des flux réseau à autoriser, souvent par application",
      "La liste des adresses MAC apprises par un commutateur",
      "Un protocole de routage dynamique basé sur les flux"
    ],
    "correctIndex": 1,
    "explanation": "La matrice de flux permet de savoir précisément quel filtrage implémenter, au bon endroit et de la bonne façon, avant de mettre en place des ACL ou des règles de pare-feu."
  },
  {
    "question": "Quels sont les cinq critères qui identifient de façon unique un flux réseau ?",
    "options": [
      "Adresse MAC source, adresse MAC destination, VLAN, port, vitesse",
      "Nom d'utilisateur, mot de passe, adresse IP, port, date",
      "Adresse IP source, adresse IP destination, protocole, port source, port destination",
      "Adresse IP source, masque, passerelle, DNS, protocole"
    ],
    "correctIndex": 2,
    "explanation": "Ces cinq critères permettent d'identifier une conversation unique entre un client et un serveur, quel que soit le nombre de paquets échangés dans chaque sens."
  },
  {
    "question": "Dans quelle plage de ports un client choisit-il typiquement son port source dynamique ?",
    "options": [
      "Entre 49152 et 65535",
      "Entre 1 et 1023",
      "Entre 0 et 100",
      "Entre 20000 et 30000"
    ],
    "correctIndex": 0,
    "explanation": "Selon la RFC citée dans le cours, les ports dynamiques utilisés côté client doivent être choisis entre 49152 et 65535."
  },
  {
    "question": "Dans quelle plage de numéros se trouvent les ACL standard numérotées classiques ?",
    "options": [
      "Entre 100 et 199",
      "Entre 200 et 299",
      "Entre 2000 et 2699 uniquement",
      "Entre 1 et 99"
    ],
    "correctIndex": 3,
    "explanation": "Les numéros d'ACL standard vont classiquement de 1 à 99, tandis que les ACL étendues utilisent la plage 100-199 (ou 2000-2699 en complément)."
  },
  {
    "question": "À quoi sert le mot-clé established dans une ACL étendue ?",
    "options": [
      "À forcer l'utilisation exclusive du protocole TCP",
      "À autoriser automatiquement le trafic retour correspondant à une connexion déjà établie",
      "À chiffrer le trafic autorisé par l'ACL",
      "À limiter le débit du trafic autorisé"
    ],
    "correctIndex": 1,
    "explanation": "established permet au routeur de faire office de pare-feu avec état (stateful) : il autorise le trafic retour d'une conversation dont l'aller a déjà été autorisé, sans avoir à écrire une ACL symétrique complète."
  },
  {
    "question": "Comment sécuriser l'accès administratif à distance (VTY) d'un routeur avec une ACL ?",
    "options": [
      "En appliquant une ACL étendue en sortie sur l'interface WAN uniquement",
      "Il est impossible de filtrer l'accès VTY avec une ACL",
      "En appliquant une ACL standard en entrée sur les lignes VTY, n'autorisant que certaines machines",
      "En désactivant totalement les lignes VTY"
    ],
    "correctIndex": 2,
    "explanation": "C'est une bonne pratique d'administration : appliquer une ACL standard en entrée sur les lignes VTY permet de n'autoriser l'administration à distance que depuis certaines machines identifiées, comme celles des administrateurs."
  },
  {
    "question": "Quelle commande permet d'afficher les compteurs de correspondance (matchs) de chaque ACE d'une ACL ?",
    "options": [
      "show ip route",
      "show running-config only",
      "debug access-list",
      "show access-list"
    ],
    "correctIndex": 3,
    "explanation": "show access-list affiche, pour chaque ACE, le nombre de paquets qui ont correspondu à cette règle, ce qui aide à diagnostiquer un mauvais fonctionnement, par exemple un masque mal calculé."
  },
  {
    "question": "Quelle commande permet de remettre à zéro les compteurs d'une ACL ?",
    "options": [
      "reset access-list",
      "clear access-list counters",
      "no access-list counters",
      "erase access-list"
    ],
    "correctIndex": 1,
    "explanation": "Cette commande réinitialise les compteurs de correspondance associés aux ACE d'une ACL, pratique pour repartir d'une mesure propre lors d'un test."
  },
  {
    "question": "Avant de supprimer une ACL encore appliquée sur une interface, que faut-il faire ?",
    "options": [
      "La supprimer directement avec no access-list, l'interface se met à jour automatiquement",
      "Désactiver totalement l'interface avec shutdown",
      "Retirer d'abord l'ACL de l'interface avec no ip access-group, puis la supprimer avec no access-list",
      "Redémarrer le routeur pour libérer l'ACL"
    ],
    "correctIndex": 2,
    "explanation": "Il faut d'abord libérer l'ACL de l'interface où elle est appliquée (no ip access-group) avant de pouvoir la supprimer complètement avec no access-list."
  },
  {
    "question": "Pour insérer une nouvelle ACE entre les entrées numérotées 10 et 20 d'une ACL, que doit-on faire ?",
    "options": [
      "Utiliser un numéro intermédiaire disponible, par exemple 15",
      "Supprimer entièrement l'ACL et la recréer dans le bon ordre",
      "Ce n'est pas possible avec les ACL numérotées",
      "Ajouter la nouvelle ACE obligatoirement à la fin de la liste"
    ],
    "correctIndex": 0,
    "explanation": "Comme les ACE sont analysées dans l'ordre de leur numéro, utiliser un numéro intermédiaire (comme 15 entre 10 et 20) permet d'insérer précisément une nouvelle règle au bon endroit dans la liste."
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
