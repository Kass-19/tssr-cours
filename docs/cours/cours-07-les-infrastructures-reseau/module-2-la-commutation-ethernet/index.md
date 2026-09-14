# Module 2 : La commutation Ethernet

*Cours : [Cours 7 - Les infrastructures réseau](../index.md)*

## 🎯 Objectif du module

Ce module explique les principes de la commutation Ethernet : structure d'une trame, rôle du commutateur, domaines de collision et de diffusion, mode duplex et fonctionnement de la table d'adresses MAC. Il aborde ensuite la mise en œuvre des VLAN et du trunking (802.1Q), l'administration à distance d'un commutateur via une SVI et SSH, ainsi que les principales bonnes pratiques de sécurisation d'un réseau commuté (désactivation des ports inutilisés, Port Security).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La commutation Ethernet : principes de base

### 1.1 La trame Ethernet et le rôle d'Ethernet

Une trame Ethernet contient, dans l'ordre : une **adresse MAC de destination**, une **adresse MAC source**, des informations propres à la trame, la **charge utile** (le paquet du protocole supérieur, en général un paquet IP) et un **contrôle d'erreur** en fin de trame.

Ethernet assure les fonctionnalités de la **couche 2** du modèle OSI : son rôle est de transporter les paquets IP jusqu'au prochain nœud Ethernet, en assurant un contrôle d'erreur. Pour cela, il encapsule le paquet IP en ajoutant sa propre en-tête, afin de déterminer l'adresse MAC de la machine destinataire. Ethernet s'appuie pour cela sur le protocole **ARP**.

### 1.2 Le rôle du commutateur

Le protocole Ethernet s'appuie sur des équipements appelés **commutateurs**, qui interconnectent des terminaux pouvant fonctionner à des vitesses différentes, grâce à leurs nombreuses interfaces.

Pour savoir sur quel port envoyer une trame, le commutateur s'appuie sur sa **table d'adresses MAC** (ou *forwarding table*), qui lui indique sur quelle interface se trouve chaque adresse MAC connue.

📌 Le rôle principal du commutateur est de **diviser le domaine de collision**.

### 1.3 Domaine de collision et méthodes d'accès au média

Une **collision** se produit lorsque deux machines émettent en même temps sur le même média — de la même façon que deux personnes qui parlent en même temps et s'empêchent mutuellement de se comprendre. Le **domaine de collision** représente l'ensemble des machines susceptibles de parler en même temps sur le même média.

Pour limiter les collisions, deux méthodes sont utilisées selon le type de média :

| Méthode | Principe | Utilisée sur |
| --- | --- | --- |
| **CSMA/CD** (Collision Detection) | Détecte quand deux machines parlent en même temps ; les machines attendent alors un temps aléatoire avant de réémettre | Réseaux filaires |
| **CSMA/CA** (Collision Avoidance) | Anticipe qui doit parler, pour éviter la collision plutôt que de la détecter après coup | Réseaux sans fil (Wi-Fi) |

Ces deux méthodes limitent les collisions, mais la méthode la plus efficace reste celle du commutateur : en réduisant le domaine de collision **à un seul port**, chaque machine connectée se retrouve dans son propre domaine de collision et peut émettre sans se soucier des autres — c'est le commutateur qui se charge ensuite de retransmettre l'information sur les autres ports sans provoquer de collision.

### 1.4 Le domaine de diffusion

Une trame envoyée à l'**adresse de diffusion** (`FF:FF:FF:FF:FF:FF`) est reçue par toutes les machines du **domaine de diffusion** — l'équivalent de crier dans une salle : tout le monde dans la salle entend.

- En l'absence de VLAN, un ensemble de commutateurs interconnectés forme un **domaine de diffusion unique**.
- Avec des VLAN, chaque VLAN correspond à son propre domaine de diffusion.

| Équipement | Ce qu'il segmente |
| --- | --- |
| Commutateur | Le domaine de collision (un domaine par port) |
| Routeur | Le domaine de diffusion (un domaine par réseau/VLAN interconnecté) |

### 1.5 Le mode duplex

Le mode duplex détermine si deux équipements peuvent parler simultanément dans les deux sens :

| Mode | Fonctionnement |
| --- | --- |
| **Half duplex** | Communication bidirectionnelle mais non simultanée (mêmes fils utilisés dans les deux sens) |
| **Full duplex** | Communication simultanée dans les deux sens (fils différents), sans collision possible |

⚠️ Sur les réseaux modernes, on ne devrait trouver que du full duplex. Du half duplex signale généralement un problème de configuration ou un câble défectueux.

La configuration se fait au niveau de l'interface, avec la commande `duplex` (`auto`, `full` ou `half`) et la commande `speed` pour forcer une vitesse (10, 100, voire 1000 Mbit/s selon le commutateur).

📌 Le mode **auto** (autonégociation) est recommandé dans la grande majorité des cas : il est le plus souple et évite d'avoir à reconfigurer les équipements en cas de changement de câble ou d'équipement en face.

Le résultat de la négociation s'observe avec :

```
show interfaces fastEthernet 0/5
```

### 1.6 La table d'adresses MAC et l'algorithme de transmission

La table d'adresses MAC s'affiche avec :

```
show mac-address-table
```

Elle indique, pour un VLAN donné, quelle adresse MAC se trouve derrière quel port.

Lorsqu'il reçoit une trame, le commutateur applique l'algorithme suivant :

1. **Apprentissage de la source** : il récupère l'adresse MAC source de la trame. Si elle est inconnue, il l'ajoute à sa table avec le port d'entrée ; si elle est déjà connue, il actualise un compteur de dernière activité (utilisé pour le vieillissement : par défaut, une entrée inactive depuis 5 minutes est supprimée) ; si elle est connue sur un port différent, il met à jour l'information (cas d'une machine déplacée).
2. **Traitement de la destination** : si la destination est une adresse **unicast** connue dans la table, la trame est envoyée uniquement sur le port correspondant ; si elle est inconnue, la trame est envoyée sur l'ensemble des ports (diffusion), pour maximiser les chances qu'elle atteigne sa destination.

⚠️ Il est possible que la machine ait été déconnectée sans que le commutateur le sache : le trafic à son intention continue alors d'être diffusé sur tous les ports pendant quelques secondes.

**Exemple** : sur un commutateur avec quatre machines A, B, C, D connectées, et une table contenant déjà B (port 16) et D (port 22) :

- Si **B** envoie une trame à **D** : le commutateur trouve la correspondance dans sa table et envoie directement sur le port 22.
- Si **A** envoie une trame à **C** (toutes deux inconnues) : le commutateur apprend l'adresse de A (port 14) et diffuse la trame sur tous les ports, faute de connaître le port de C.
- Si **D** envoie une trame à l'adresse de diffusion (ex. une requête ARP), le commutateur diffuse sur tous les ports ; seule la machine destinataire répondra.

## 2. Les VLAN

### 2.1 Principe et intérêts des VLAN

Un **VLAN** (réseau local virtuel) correspond à la fois à un domaine de diffusion de couche 2 et à un réseau logique distinct, avec sa propre adresse IP. Les VLAN permettent de segmenter le réseau afin d'éviter que toutes les machines se retrouvent dans le même réseau IP et, par défaut, avec le même niveau d'accès.

Intérêts principaux :

- **réduction du trafic de diffusion** : sans segmentation, un trafic de diffusion émis par une machine est reçu par toutes les machines du (grand) domaine de diffusion, ce qui dégrade les performances ;
- **amélioration des performances** du réseau ;
- **renforcement de la sécurité**, puisque des règles différentes peuvent être appliquées d'un VLAN à l'autre.

Sans VLAN, des machines dans des réseaux IP différents mais dans le même domaine de diffusion ne peuvent pas communiquer en IP, mais reçoivent malgré tout le trafic de diffusion des unes des autres (ex. requêtes ARP), ce qui n'est pas performant. En créant un VLAN par groupe de machines cohérent avec le plan d'adressage IP, le trafic de diffusion d'un VLAN reste confiné aux ports de ce VLAN.

### 2.2 Le VLAN par défaut

La commande pour afficher la liste des VLAN et les ports associés :

```
show vlan brief
```

📌 Tous les équipements Cisco de type commutateur possèdent par défaut le **VLAN 1**, auquel sont affectés tous les ports. Le VLAN 1 ne peut être ni renommé ni supprimé.

⚠️ Cisco recommande de ne jamais utiliser le VLAN 1 en production : dès qu'un port est configuré, il doit être sorti du VLAN 1.

Cette information est stockée dans un fichier séparé de la running-config, appelé **vlan.dat**, présent sur la mémoire Flash de l'équipement.

Par défaut, un port ne peut appartenir qu'à un seul VLAN (des mécanismes permettant d'en associer plusieurs — trunk, voice VLAN — sont vus plus loin dans ce module).

### 2.3 Créer et affecter des VLAN

Création d'un VLAN en mode de configuration globale (ID compris entre 1 et 4095, 1 étant déjà utilisé) :

```
Switch(config)# vlan 10
Switch(config-vlan)# name VLAN_10
Switch(config)# vlan 20
Switch(config-vlan)# name VLAN_20
```

Pour affecter plusieurs interfaces au même VLAN en une seule commande, on utilise `interface range` :

```
Switch(config)# interface range fastEthernet 0/5 - 6
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10

Switch(config)# interface range fastEthernet 0/10 - 11
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 20
```

Le mode `access` correspond à la configuration utilisée lorsqu'un seul équipement (typiquement un ordinateur) est connecté sur le port.

Après cette configuration, `show vlan brief` confirme les VLAN créés et les interfaces affectées. Une machine du VLAN 10 peut alors joindre une autre machine du VLAN 10, mais pas une machine du VLAN 20 : les VLAN sont dans des plans d'adressage IP différents et rien ne permet encore de les faire communiquer entre eux (ce sera l'objet du routage inter-VLAN, module 3).

## 3. Le trunking

### 3.1 Principe du lien trunk

Les liens **trunk** permettent au trafic de plusieurs VLAN de circuler d'un commutateur à l'autre sur un seul lien physique. Pour cela, le commutateur ajoute à la trame une **balise** (tag) supplémentaire contenant notamment le **VLAN ID**, qui indique au commutateur récepteur dans quel VLAN la trame doit être traitée. Le commutateur recalcule également le **FCS** (contrôle d'erreur), puisque la trame a été modifiée.

### 3.2 Fonctionnement entre deux commutateurs

Dans une topologie à deux commutateurs S1 et S2, reliés par un port trunk, les mêmes VLAN (par exemple VLAN 10 et VLAN 20) existent des deux côtés. Lorsqu'une machine A (VLAN 10, port access sur S1) envoie du trafic vers une machine E (VLAN 10 sur S2) : S1 reconnaît que le trafic vient du VLAN 10 et ajoute l'ID 10 lors de l'envoi sur le port trunk ; S2 reçoit la trame avec cet ID et sait qu'elle doit être traitée dans le VLAN 10. Le mécanisme est identique dans l'autre sens.

📌 La table d'adresses MAC contient alors une information supplémentaire : le VLAN dans lequel chaque adresse a été vue.

### 3.3 Configuration d'un trunk

Sur S2, on crée d'abord les VLAN 10 et 20.

⚠️ Astuce/piège : déclarer une interface en `access` dans un VLAN qui n'existe pas encore le crée automatiquement, mais **sans nom** — il est dommage de ne pas le nommer explicitement ensuite.

On configure ensuite le port trunk, en y ajoutant un VLAN natif dédié (ici VLAN 100) et la liste des VLAN autorisés :

```
Switch(config)# interface gigabitEthernet 0/2
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk native vlan 100
Switch(config-if)# switchport trunk allowed vlan 10,20,100
```

⚠️ La configuration du port trunk doit être **rigoureusement identique** sur les deux commutateurs. Une incohérence peut être détectée et signalée par **CDP** (*Cisco Discovery Protocol*), un protocole propriétaire Cisco qui permet notamment de repérer les erreurs de configuration VLAN entre deux équipements voisins.

Commandes de vérification :

```
show interface trunk
show interface gigabitEthernet 0/2 switchport
```

`show interface trunk` liste les trunks configurés (état, VLAN natif, VLAN autorisés). `show interface ... switchport` affiche le mode opérationnel (trunk), l'encapsulation (`dot1Q`, c'est-à-dire 802.1Q) et le VLAN natif.

⚠️ Une fois un port passé en trunk, il n'apparaît plus dans `show vlan brief` — c'est normal, puisqu'il ne porte plus un seul VLAN en mode access.

### 3.4 Le VLAN natif

Le **VLAN natif** est un concept défini par la norme **802.1Q** (la norme de trunking) : il permet à un commutateur de traiter, sur un port trunk, du trafic qui n'est pas tagué avec un VLAN ID. Par défaut, chez Cisco, le VLAN natif est le **VLAN 1**.

📌 Il est conseillé de systématiquement changer le VLAN natif et de ne jamais le laisser sur le VLAN 1.

Pourquoi ? Parce que tous les ports non configurés se retrouvent automatiquement dans le VLAN 1 : laisser le VLAN 1 comme VLAN natif exposerait donc le trunk à du trafic non tagué et non désiré. En isolant le trafic non tagué dans un VLAN dédié (ici VLAN 100), dans lequel on ne s'attend à ne jamais avoir de trafic légitime, on limite ce risque.

### 3.5 Le Voice VLAN

Le trafic de téléphonie sur IP (ToIP) est très sensible à la latence : la voix nécessite un temps de traversée du réseau le plus stable possible. On met donc en œuvre de la **qualité de service (QoS)** pour prioriser ce trafic.

Par ailleurs, les téléphones IP disposent souvent de deux ports Ethernet et intègrent un mini-commutateur : l'ordinateur de l'utilisateur se connecte au téléphone, qui se connecte lui-même au commutateur. Le trafic de l'ordinateur doit alors arriver **non tagué**, tandis que le trafic voix arrive **tagué**.

C'est le rôle du **Voice VLAN**, une fonctionnalité Cisco proche du VLAN natif mais dédiée à la voix, à laquelle on peut associer une politique de QoS pour prioriser ce trafic dans le commutateur.

```
Switch(config)# interface range fastEthernet 0/5 - 6
Switch(config-if-range)# switchport mode access
Switch(config-if-range)# switchport access vlan 10
Switch(config-if-range)# switchport voice vlan 30
```

Avec cette configuration, un PC connecté directement se retrouve dans le VLAN 10 (mode access), tandis que le trafic voix tagué avec le VLAN 30 est traité comme trafic voix. Le port se retrouve alors associé aux deux VLAN (10 et 30) : le Voice VLAN implique nécessairement un trafic tagué, comme sur un trunk.

## 4. Administration à distance du commutateur

### 4.1 La SVI (Switch Virtual Interface)

Un commutateur dispose de nombreux ports, mais **aucun d'entre eux ne porte d'adresse IP en propre**. Pour administrer le commutateur, il faut créer une interface virtuelle appelée **SVI** (*Switching Virtual Interface*), sur laquelle une adresse IP (la *gateway*) pourra être configurée.

📌 Dans de nombreuses organisations, le VLAN d'administration des commutateurs est complètement séparé des VLAN utilisateurs, ce qui permet d'y ajouter de la sécurité.

Étapes de configuration (exemple avec le VLAN 60, adresse `172.18.60.252/24`) :

```
Switch(config)# vlan 60
Switch(config-vlan)# name ADMIN

Switch(config)# interface vlan 60
Switch(config-if)# ip address 172.18.60.252 255.255.255.0
Switch(config-if)# no shutdown

Switch(config)# ip default-gateway 172.18.60.254
```

L'ID de l'interface VLAN étant le même que l'ID du VLAN, l'interface `vlan 60` répond automatiquement dans le VLAN 60. La *gateway* configurée en dernier lieu permet au commutateur d'être administrable depuis d'autres VLAN.

### 4.2 Configuration de SSH

SSH s'active via les commandes `crypto`, disponibles uniquement sur les versions d'IOS incluant la suite cryptographique (versions dites **K9**).

```
Switch(config)# hostname SW1
SW1(config)# ip domain-name formation.local
SW1(config)# crypto key generate rsa
SW1(config)# ip ssh version 2

SW1(config)# username admin secret MonMotDePasse

SW1(config)# line vty 0 15
SW1(config-line)# no password
SW1(config-line)# login local
SW1(config-line)# transport input ssh

SW1(config)# end
SW1# copy running-config startup-config
```

Le `domain-name` est nécessaire à la génération des clés cryptographiques. 📌 La version 2 de SSH est à privilégier systématiquement, car plus sécurisée que la version 1. Sur les lignes VTY, on supprime le mot de passe spécifique à la ligne (`no password`) pour ne conserver que l'authentification par comptes locaux (`login local`), et on force l'accès en SSH uniquement avec `transport input ssh`.

### 4.3 Vérification de SSH

```
show ip ssh
show users
```

`show ip ssh` confirme la version utilisée. `show users` liste les connexions distantes ouvertes sur l'équipement.

Une fois la configuration validée, la connectivité peut être testée par un `ping` vers l'adresse du commutateur, puis une connexion en SSH depuis une machine du même VLAN, via la commande `ssh` (nativement disponible sous Linux et Windows) ou via **PuTTY**, également compatible avec le protocole SSH.

## 5. Sécurisation d'un réseau commuté

### 5.1 Désactiver les ports inutilisés

📌 Première bonne pratique : désactiver systématiquement les ports non utilisés, avec la commande `shutdown`. Cela évite que des machines connectées par erreur (ou volontairement) se retrouvent dans le VLAN par défaut et puissent communiquer sans que cela soit souhaité.

La méthode recommandée consiste à désactiver l'ensemble des ports, puis à réactiver individuellement, avec `no shutdown`, uniquement les ports réellement utilisés.

⚠️ Il ne faut pas se limiter à la sécurité de couche 3 (pare-feu) : des attaques sont également possibles au niveau de la couche 2, d'où l'intérêt des fonctionnalités présentées ci-dessous.

### 5.2 Port Security

La fonctionnalité **Port Security** permet de figer les équipements autorisés à se connecter derrière un port donné.

```
show port-security
show port-security address
```

Paramètres principaux :

| Paramètre | Rôle |
| --- | --- |
| `maximum` | Nombre maximal d'adresses MAC autorisées sur le port |
| Adresse MAC statique | Fige manuellement une adresse MAC précise sur le port |
| Mode **sticky** | Apprend dynamiquement la première adresse MAC vue sur le port et la mémorise |
| Mode de violation | Comportement du port en cas d'adresse MAC non autorisée |

Par défaut, un port en mode access accueille directement un ordinateur : on peut donc mettre `maximum` à 1 pour n'autoriser qu'une seule adresse MAC (ce qui empêche, par exemple, qu'un utilisateur branche un commutateur non autorisé pour connecter plusieurs postes). ⚠️ Si le port dessert un téléphone IP avec un PC connecté derrière, il faut mettre ce paramètre à 2.

Figer une adresse MAC manuellement suppose de la connaître et qu'elle ne change jamais ; le mode **sticky** est plus souple (apprentissage automatique de la première adresse vue), au prix d'un niveau de sécurité légèrement inférieur — le choix dépend de la politique de sécurité de l'entreprise.

En cas de détection d'une adresse MAC non autorisée sur le port, une **violation** se produit. Trois modes de réaction sont possibles :

| Mode de violation | Comportement |
| --- | --- |
| **shutdown** (par défaut) | Coupe le port (rejette tout le trafic, légitime ou non), envoie un message syslog, incrémente le compteur de violations — le mode le plus restrictif |
| **restrict** | Rejette uniquement le trafic illégitime, notifie via syslog et incrémente le compteur, mais laisse le trafic légitime continuer à passer |
| **protect** | Rejette le trafic illégitime, sans notification |

Le nombre de violations constatées est visible via le compteur **Security Violation Count**.

⚠️ En mode `shutdown`, une fois la violation détectée, le port passe en **secure shutdown** : il faut le réinitialiser manuellement pour le rendre à nouveau disponible :

```
Switch(config-if)# shutdown
Switch(config-if)# no shutdown
```

## ✅ Points clés à retenir

- Le commutateur divise le **domaine de collision** (un domaine par port), le routeur divise le **domaine de diffusion** (un domaine par VLAN/réseau).
- CSMA/CD (détection de collision) est utilisé sur les réseaux filaires ; CSMA/CA (évitement de collision) sur les réseaux sans fil.
- ⚠️ En full duplex, aucune collision n'est possible ; du half duplex sur un réseau moderne trahit généralement un problème de configuration ou de câble. Le mode `auto` (duplex et vitesse) est à privilégier dans la grande majorité des cas.
- La table d'adresses MAC s'apprend dynamiquement (adresse source) et expire par défaut après 5 minutes d'inactivité ; un unicast inconnu ou une adresse de diffusion est envoyé sur tous les ports.
- 📌 Le VLAN 1 est le VLAN par défaut sur tout commutateur Cisco : il ne peut être ni renommé ni supprimé, mais ne doit jamais être utilisé en production ; la base des VLAN est stockée dans le fichier `vlan.dat`, distinct de la running-config.
- Le trunking (802.1Q) fait circuler plusieurs VLAN sur un même lien en taguant chaque trame avec un VLAN ID ; la configuration du port trunk doit être identique des deux côtés.
- ⚠️ Le VLAN natif par défaut est le VLAN 1 chez Cisco : il est recommandé de le changer pour un VLAN dédié, car tout port non configuré tombe automatiquement dans le VLAN 1.
- Le Voice VLAN permet de faire cohabiter, sur le même port, le trafic PC non tagué (VLAN access) et le trafic voix tagué, avec une priorité de qualité de service pour la voix.
- L'administration à distance d'un commutateur nécessite une **SVI** portant une adresse IP (les ports physiques n'en ont pas) ; SSH (version 2, recommandée) requiert une image IOS **K9** et se configure via `crypto key generate rsa`, `ip ssh version 2`, des comptes locaux et `transport input ssh` sur les lignes VTY.
- Bonnes pratiques de sécurisation de couche 2 : désactiver systématiquement les ports inutilisés (`shutdown`) et n'activer que les ports nécessaires (`no shutdown`) ; utiliser **Port Security** pour limiter/figer les adresses MAC autorisées par port, avec un mode de violation adapté (shutdown, restrict ou protect).
- ⚠️ Après une violation en mode `shutdown`, le port reste bloqué (*secure shutdown*) tant qu'il n'a pas été manuellement réactivé avec `shutdown` puis `no shutdown`.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-2-la-commutation-ethernet"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-2-la-commutation-ethernet-data">
[
  {
    "question": "Dans une trame Ethernet, que contient la charge utile (payload) ?",
    "options": [
      "Uniquement l'adresse MAC de destination",
      "Le contrôle d'erreur de la trame",
      "Le paquet provenant du protocole supérieur (par exemple un paquet IP)",
      "L'adresse IP source et destination en clair"
    ],
    "correctIndex": 2,
    "explanation": "La trame encapsule le paquet du protocole supérieur (couche 3, typiquement IP) entre son en-tête et son contrôle d'erreur."
  },
  {
    "question": "Quel protocole permet à Ethernet de déterminer l'adresse MAC de la machine devant recevoir la trame ?",
    "options": [
      "ARP",
      "DHCP",
      "DNS",
      "ICMP"
    ],
    "correctIndex": 0,
    "explanation": "Ethernet encapsule les paquets IP en s'appuyant sur ARP pour connaître l'adresse MAC associée à l'adresse IP de destination."
  },
  {
    "question": "Que se passe-t-il, en Ethernet, quand deux machines émettent en même temps sur le même média ?",
    "options": [
      "Le commutateur fusionne automatiquement les deux trames",
      "Les deux trames sont mises en cache jusqu'à résolution",
      "Rien, Ethernet gère nativement les émissions simultanées",
      "Il y a une collision, les trames deviennent incompréhensibles"
    ],
    "correctIndex": 3,
    "explanation": "Une collision se produit quand deux machines émettent en même temps sur un même média partagé, rendant les informations incompréhensibles, comme deux personnes qui parlent en même temps."
  },
  {
    "question": "Quel est le rôle principal d'un commutateur (switch) vis-à-vis du domaine de collision ?",
    "options": [
      "Il fusionne tous les domaines de collision en un seul",
      "Il divise le domaine de collision, chaque port formant son propre domaine",
      "Il supprime totalement la nécessité d'un protocole CSMA",
      "Il agrandit le domaine de collision pour couvrir tout le réseau"
    ],
    "correctIndex": 1,
    "explanation": "Chaque port de commutateur constitue son propre domaine de collision, ce qui fait que deux machines connectées à des ports différents n'ont jamais à se soucier de parler en même temps."
  },
  {
    "question": "Quelle méthode est utilisée sur les réseaux Ethernet filaires pour gérer les collisions ?",
    "options": [
      "CSMA/CA (évitement de collision)",
      "STP (Spanning Tree Protocol)",
      "TCP (contrôle de flux)",
      "CSMA/CD (détection de collision)"
    ],
    "correctIndex": 3,
    "explanation": "Sur les réseaux filaires on utilise la détection de collision (CSMA/CD) ; le Wi-Fi utilise plutôt l'évitement de collision (CSMA/CA), qui anticipe qui doit parler."
  },
  {
    "question": "À quoi sert la table d'adresses MAC (forwarding table) d'un commutateur ?",
    "options": [
      "À savoir sur quelle interface envoyer une trame en fonction de l'adresse MAC de destination",
      "À stocker les adresses IP des machines connectées",
      "À chiffrer le trafic qui traverse le commutateur",
      "À définir les règles de qualité de service"
    ],
    "correctIndex": 0,
    "explanation": "Le commutateur consulte cette table pour savoir sur quel port se trouve l'adresse MAC de destination et n'envoyer la trame que sur ce port-là."
  },
  {
    "question": "Que représente le domaine de diffusion ?",
    "options": [
      "L'ensemble des machines connectées sur un même port de commutateur",
      "L'ensemble des routeurs reliés entre eux dans l'entreprise",
      "L'ensemble des machines qui reçoivent une trame envoyée à l'adresse de diffusion (broadcast)",
      "L'ensemble des VLAN configurés sur un seul commutateur"
    ],
    "correctIndex": 2,
    "explanation": "C'est l'équivalent de crier dans une salle : toutes les machines du même domaine de diffusion reçoivent la trame, comme toutes les personnes présentes dans la salle entendent qui crie."
  },
  {
    "question": "Sans VLAN, un ensemble de commutateurs interconnectés constitue…",
    "options": [
      "Autant de domaines de diffusion que de commutateurs",
      "Un seul et même domaine de diffusion",
      "Autant de domaines de diffusion que de ports actifs",
      "Aucun domaine de diffusion, celui-ci n'existant qu'avec des VLAN"
    ],
    "correctIndex": 1,
    "explanation": "En l'absence de VLAN, l'ensemble des commutateurs interconnectés forme un domaine de diffusion unique ; c'est justement ce que les VLAN permettent de segmenter."
  },
  {
    "question": "Quelle est la différence entre le mode half duplex et le mode full duplex ?",
    "options": [
      "En half duplex la communication est bidirectionnelle mais non simultanée, en full duplex elle l'est",
      "En half duplex on utilise deux câbles, en full duplex un seul",
      "En full duplex il peut y avoir des collisions, en half duplex jamais",
      "Le half duplex est uniquement utilisé en Wi-Fi, le full duplex uniquement en filaire"
    ],
    "correctIndex": 0,
    "explanation": "En half duplex, les deux extrémités utilisent les mêmes fils et doivent donc parler chacune à leur tour, alors qu'en full duplex des fils distincts permettent de parler simultanément sans collision."
  },
  {
    "question": "Quel mode de configuration duplex/vitesse est généralement recommandé sur les interfaces Cisco ?",
    "options": [
      "Forcer systématiquement le mode full duplex",
      "Forcer systématiquement le mode half duplex",
      "Désactiver toute négociation pour figer la configuration",
      "Le mode auto (autonégociation)"
    ],
    "correctIndex": 3,
    "explanation": "Le mode auto laisse les équipements négocier automatiquement vitesse et duplex, ce qui est plus souple, notamment en cas de débranchement/rebranchement des équipements."
  },
  {
    "question": "Lorsqu'un commutateur reçoit une trame, que fait-il si l'adresse MAC source n'existe pas encore dans sa table d'adresses MAC ?",
    "options": [
      "Il rejette la trame car l'adresse est inconnue",
      "Il l'ajoute à sa table, en l'associant au port sur lequel la trame est arrivée",
      "Il envoie une requête ARP pour vérifier l'adresse",
      "Il bascule automatiquement cette adresse dans le VLAN natif"
    ],
    "correctIndex": 1,
    "explanation": "Le commutateur alimente en permanence sa table d'adresses MAC à partir de l'adresse source des trames qu'il reçoit, ce qui lui permet ensuite de savoir sur quel port réémettre le trafic à destination de cette machine."
  },
  {
    "question": "Que fait un commutateur lorsqu'il ne connaît pas le port associé à l'adresse MAC de destination d'une trame ?",
    "options": [
      "Il détruit la trame immédiatement",
      "Il la met en attente jusqu'à apprentissage de l'adresse",
      "Il envoie la trame sur l'ensemble des ports (diffusion)",
      "Il renvoie la trame uniquement vers la passerelle par défaut"
    ],
    "correctIndex": 2,
    "explanation": "Faute de correspondance dans sa table d'adresses MAC, le commutateur diffuse la trame sur tous les ports pour lui donner une chance d'atteindre la bonne destination."
  },
  {
    "question": "À quoi correspond un VLAN sur le plan logique ?",
    "options": [
      "À un domaine de diffusion de couche 2 avec son propre réseau IP",
      "À un domaine de collision unique regroupant tous les ports",
      "À une simple étiquette de qualité de service sans impact réseau",
      "À un protocole de routage dynamique entre commutateurs"
    ],
    "correctIndex": 0,
    "explanation": "Chaque VLAN segmente le réseau en un domaine de diffusion distinct, généralement associé à son propre plan d'adressage IP, ce qui améliore performance et sécurité."
  },
  {
    "question": "Que dit la préconisation Cisco concernant le VLAN 1 ?",
    "options": [
      "Il doit être utilisé pour tous les ports d'administration",
      "Il faut le supprimer dès la première configuration",
      "Il est réservé exclusivement au trafic voix",
      "Il ne faut pas l'utiliser en production, même s'il ne peut être ni renommé ni supprimé"
    ],
    "correctIndex": 3,
    "explanation": "Le VLAN 1 est le VLAN par défaut de tous les ports non configurés ; Cisco recommande de sortir les ports de ce VLAN et de ne jamais l'utiliser en production, bien qu'il ne puisse ni être renommé ni supprimé."
  },
  {
    "question": "Où est stockée la base de données des VLAN sur un commutateur Cisco ?",
    "options": [
      "Directement dans la running-config",
      "Dans un fichier séparé, vlan.dat, sur la mémoire Flash",
      "Dans la NVRAM avec la startup-config",
      "Sur un serveur TFTP distant par défaut"
    ],
    "correctIndex": 1,
    "explanation": "Contrairement au reste de la configuration, les informations de VLAN sont stockées dans un fichier à part, vlan.dat, présent sur la Flash de l'équipement."
  },
  {
    "question": "Quelle commande permet de configurer plusieurs interfaces avec exactement la même configuration en une seule fois ?",
    "options": [
      "interface group",
      "vlan range",
      "interface range",
      "switchport batch"
    ],
    "correctIndex": 2,
    "explanation": "interface range permet d'appliquer une même configuration (par exemple switchport mode access et l'appartenance à un VLAN) à une plage d'interfaces sans les configurer une par une."
  },
  {
    "question": "À quoi sert un port configuré en mode trunk entre deux commutateurs ?",
    "options": [
      "À limiter le trafic à un seul VLAN pour plus de sécurité",
      "À interconnecter uniquement des téléphones IP",
      "À remplacer la nécessité de créer des VLAN sur le commutateur",
      "À faire passer le trafic de plusieurs VLAN en ajoutant une balise indiquant le VLAN d'origine"
    ],
    "correctIndex": 3,
    "explanation": "Le port trunk ajoute une balise contenant notamment l'ID de VLAN dans la trame, ce qui permet au commutateur récepteur de savoir dans quel VLAN traiter cette trame, et il recalcule la FCS en conséquence."
  },
  {
    "question": "Quel est le rôle du VLAN natif sur un port trunk ?",
    "options": [
      "Il transporte prioritairement le trafic voix (Voice VLAN)",
      "Il prend en charge le trafic qui arrive sans balise de VLAN (non tagué)",
      "Il sert uniquement à l'administration à distance du commutateur",
      "Il double automatiquement la bande passante du lien trunk"
    ],
    "correctIndex": 1,
    "explanation": "La norme 802.1Q définit le VLAN natif pour le trafic non tagué ; il est recommandé de ne pas le laisser sur le VLAN 1 par défaut, afin d'éviter la circulation de trafic non désiré."
  },
  {
    "question": "Pour activer SSH sur un commutateur Cisco, quelle condition logicielle est nécessaire ?",
    "options": [
      "Disposer d'un commutateur de couche 3 uniquement",
      "Avoir désactivé le VLAN 1 au préalable",
      "Disposer d'une version d'IOS incluant la suite cryptographique K9",
      "Avoir configuré au moins un port en mode trunk"
    ],
    "correctIndex": 2,
    "explanation": "La commande crypto, nécessaire à la génération des clés SSH, n'est disponible que sur les versions IOS intégrant la suite cryptographique, identifiables par le suffixe K9."
  },
  {
    "question": "Avec la fonctionnalité Port Security en mode sticky, comment le commutateur détermine-t-il l'adresse MAC autorisée sur un port ?",
    "options": [
      "Il apprend automatiquement la première adresse MAC vue sur ce port et la mémorise",
      "L'administrateur doit obligatoirement la saisir manuellement",
      "Il autorise systématiquement toutes les adresses MAC détectées",
      "Il interroge un serveur RADIUS pour valider l'adresse"
    ],
    "correctIndex": 0,
    "explanation": "Le mode sticky est un mode dynamique : la première adresse MAC apprise sur le port est mémorisée et devient la seule autorisée, ce qui est plus souple à administrer qu'une adresse figée manuellement."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-07-les-infrastructures-reseau-module-2-la-commutation-ethernet",
      dataId: "quiz-cours-07-les-infrastructures-reseau-module-2-la-commutation-ethernet-data",
    });
  });
</script>
