# Module 5 : Les premières commandes

*Cours : [Cours 1 - Bases des réseaux](../index.md)*

## 🎯 Objectif du module

Ce module présente les commandes réseau de base pour diagnostiquer et administrer un poste : **ARP**, **IPCONFIG** (Windows) et **IP** (Linux), **PING**, **NETSTAT**, et **TRACERT/TRACEROUTE**. Pour chaque commande : son rôle, sa syntaxe, ses options principales sous forme de tableau, et ses cas d'usage typiques.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La commande ARP

**Rôle** : l'**ARP** (*Address Resolution Protocol*) est un protocole de la couche 2 (Liaison) qui fait correspondre une **adresse IP** (logique) à une **adresse MAC** (physique) au sein d'un réseau local. La commande `arp` permet de consulter, forcer la mise à jour, ou modifier manuellement la **table ARP** (cache) d'une machine.

### Syntaxe et options

| Commande | Système | Effet |
|---|---|---|
| `arp -a` | Windows / Linux | Affiche la table ARP (toutes les associations IP ↔ MAC connues) |
| `arp -s <IP> <MAC>` | Windows / Linux | Ajoute une entrée **statique** liant une IP à une MAC |
| `arp -d *` | Windows | Vide **tout** le cache ARP (pas de suppression ciblée possible sous Windows) |
| `sudo ip neigh flush all` | Linux | Équivalent Linux pour vider le cache ARP |

**Exemple de sortie de `arp -a`** :
```
Interface: 192.168.1.1 --- 0x3
  Adresse Internet      Adresse physique      Type
  192.168.1.100         00-14-22-01-23-45     Dynamique
  192.168.1.101         00-15-5d-8b-12-34     Dynamique
```

### Fonctionnement (résolution ARP)

1. La machine vérifie si l'IP cible est déjà dans sa table ARP.
2. Si non, elle diffuse une **requête ARP broadcast** : *« Qui a l'adresse IP 192.168.1.100 ? Répondez à 192.168.1.1. »*
3. L'appareil correspondant répond avec son adresse MAC.
4. La table ARP de la machine d'origine est mise à jour.

### Problèmes fréquents et limites

| Problème | Description |
|---|---|
| **Entrées erronées** | Empêchent la communication avec certains appareils |
| **ARP Spoofing** | Un attaquant envoie de fausses réponses ARP pour intercepter/rediriger le trafic — signe révélateur : deux IP associées à la même adresse MAC |
| **Cache obsolète** | Des entrées expirées peuvent bloquer la communication |

⚠️ ARP ne fonctionne que sur des réseaux **Ethernet/LAN** — il n'est jamais utilisé pour la communication inter-réseaux (rôle du routage). En **IPv6**, ARP est remplacé par le protocole **NDP** (*Neighbor Discovery Protocol*).

**Cas d'usage** : diagnostic réseau (une IP connue en ARP mais qui ne répond pas indique un problème plus haut dans la pile), détection d'attaques (association IP/MAC anormale), configuration manuelle d'associations dans des environnements critiques.

---

## 2. Les commandes IPCONFIG (Windows) et IP (Linux)

### IPCONFIG (Windows)

**Rôle** : afficher et gérer la configuration réseau des interfaces (IP, masque, passerelle, DNS, DHCP).

| Option | Effet |
|---|---|
| `ipconfig` | Résumé de la configuration réseau de toutes les interfaces actives |
| `ipconfig /all` | Vue exhaustive : adresses MAC, serveurs DNS, mode DHCP/statique, durée du bail DHCP |
| `ipconfig /release` | Libère l'adresse IP attribuée par DHCP |
| `ipconfig /renew` | Demande une nouvelle adresse IP au serveur DHCP |
| `ipconfig /flushdns` | Vide le cache DNS local |
| `ipconfig /displaydns` | Affiche le contenu du cache DNS |
| `ipconfig /registerdns` | Force le renouvellement des enregistrements DNS dynamiques |

**Exemple de sortie (`ipconfig`)** :
```
Carte Ethernet Ethernet :
   Suffixe DNS propre à la connexion. . . : exemple.local
   Adresse IPv4 . . . . . . . . . . . . . : 192.168.1.100
   Masque de sous-réseau . . . . . . . . . : 255.255.255.0
   Passerelle par défaut . . . . . . . . . : 192.168.1.1
```

**Cas pratiques** :
- Une adresse en **169.254.x.x** (APIPA) → problème de serveur DHCP.
- Un site ne se charge pas → `ipconfig /flushdns` pour forcer une résolution DNS fraîche.
- Suspicion de conflit d'adresse → `ipconfig /release` puis `ipconfig /renew`.

⚠️ **Limites** : `ipconfig` est propre à Windows (sous Linux : `ifconfig`, déprécié, ou `ip`), ne permet pas de **configurer** directement les interfaces (contrairement à `ip` ou `netsh`), et ne donne aucune information sur le **trafic** réseau (pour cela : `netstat`, Wireshark).

### IP (Linux)

**Rôle** : outil polyvalent de la suite **iproute2**, qui remplace progressivement `ifconfig`. Permet d'afficher/configurer les interfaces, les adresses IP, les routes, et les voisins ARP.

**Syntaxe générale** : `ip [options] [objet] [action]`

| Options | Effet |
|---|---|
| `-s` | Affiche des statistiques |
| `-4` | N'affiche que les informations IPv4 |
| `-6` | N'affiche que les informations IPv6 |

| Objet | Rôle |
|---|---|
| `link` | Gestion des interfaces réseau |
| `addr` | Gestion des adresses IP |
| `route` | Gestion de la table de routage |
| `neigh` | Gestion de la table ARP/voisinage |

**Commandes courantes par objet** :

| Commande | Effet |
|---|---|
| `ip link` | Liste les interfaces réseau et leur statut |
| `ip link set dev eth0 up` / `down` | Active / désactive une interface |
| `ip addr` (ou `ip -4 addr`) | Affiche les adresses IP des interfaces |
| `ip addr add 192.168.1.200/24 dev eth0` | Ajoute une adresse IP à une interface |
| `ip addr del 192.168.1.200/24 dev eth0` | Supprime une adresse IP |
| `ip route` | Affiche la table de routage |
| `ip route add 192.168.2.0/24 via 192.168.1.1 dev eth0` | Ajoute une route |
| `ip route del 192.168.2.0/24` | Supprime une route |
| `ip neigh` | Affiche les entrées ARP (voisins) |
| `ip neigh add 192.168.1.200 lladdr <MAC> dev eth0` | Ajoute une entrée ARP statique |
| `ip neigh del 192.168.1.200 dev eth0` | Supprime une entrée ARP |

**Exemple de sortie (`ip route`)** :
```
default via 192.168.1.1 dev eth0
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100
```

---

## 3. La commande PING

**Rôle** : tester la connectivité vers un autre appareil (local ou distant) via le protocole **ICMP**, et mesurer la latence (temps aller-retour, ou **RTT**).

**Fonctionnement** :
1. Envoi d'une requête **ICMP Echo Request** vers la cible.
2. Si la cible est joignable, elle renvoie un **ICMP Echo Reply** (sinon, timeout ou erreur).
3. Analyse du **RTT** (Round-Trip Time) et des éventuelles pertes de paquets.

**Syntaxe** : `ping [options] destination`

### Options courantes

| Option | Effet |
|---|---|
| `-c <n>` | Envoie un nombre précis de requêtes (ex. `ping -c 4 www.google.com`) |
| `-s <taille>` | Définit la taille des paquets ICMP |
| `-i <secondes>` | Modifie l'intervalle entre chaque ping (par défaut 1 s) |
| `-q` | N'affiche que les statistiques finales, pas chaque réponse |
| *(aucune option)* | Sous Linux, le ping est **continu** par défaut (Ctrl+C pour arrêter) |

**Exemple de sortie** :
```
PING www.google.com (142.250.74.68): 56 data bytes
64 bytes from 142.250.74.68: icmp_seq=0 ttl=115 time=18.3 ms
64 bytes from 142.250.74.68: icmp_seq=1 ttl=115 time=17.5 ms
64 bytes from 142.250.74.68: icmp_seq=2 ttl=115 time=17.8 ms
--- www.google.com ping statistics ---
3 packets transmitted, 3 packets received, 0% packet loss
round-trip min/avg/max/stddev = 17.5/17.8/18.3/0.3 ms
```

| Élément | Signification |
|---|---|
| `icmp_seq=` | Numéro de la requête ICMP |
| `ttl=` | *Time To Live* : nombre max de sauts avant destruction du paquet |
| `time=` | Temps aller-retour (RTT) en ms |

### Diagnostic à partir des résultats

| Symptôme | Causes possibles |
|---|---|
| **Aucune réponse** (`Request timeout`) | Machine hors ligne, pare-feu bloquant ICMP, erreur de configuration réseau |
| **Latence élevée** | Surcharge réseau, distance importante, routeur/machine peu performant |
| **Pertes de paquets** | Problème de connectivité, mauvaise qualité de liaison, saturation |

**Cas pratiques** : `ping 192.168.1.1` (tester un routeur/machine locale), `ping 8.8.8.8` (tester l'accès Internet via une IP connue), tester par IP directe si un nom de domaine ne résout pas (isole un problème DNS d'un problème de connectivité).

⚠️ **Limites** : certains réseaux bloquent volontairement l'ICMP (ping alors inefficace) ; l'ICMP est parfois traité avec une priorité plus basse par les routeurs (latence biaisée) ; ping **ne mesure pas la bande passante**, seulement la latence et la perte de paquets.

---

## 4. La commande NETSTAT

**Rôle** : afficher les connexions réseau actives, les ports en écoute, et des statistiques réseau. Utile pour le diagnostic réseau et l'analyse de sécurité.

**Syntaxe** : `netstat [options]`

### Options courantes

| Option | Effet |
|---|---|
| `-a` | Toutes les connexions actives (TCP et UDP) + ports d'écoute |
| `-n` | Adresses/ports en format **numérique** (sans résolution de nom) |
| `-t` | Connexions **TCP** uniquement |
| `-u` | Connexions **UDP** uniquement |
| `-l` | Ports en écoute (*listening*) uniquement |
| `-p` | Processus associés à chaque connexion (droits admin requis sous Linux) |
| `-r` | Table de routage du système |
| `-e` | Statistiques détaillées des interfaces (paquets, erreurs...) |

### Les états de connexion TCP

| État | Signification |
|---|---|
| **LISTEN** | Le port attend des connexions entrantes |
| **ESTABLISHED** | Connexion active et opérationnelle |
| **CLOSE_WAIT** | Fermée par l'autre partie, en attente de fermeture locale |
| **TIME_WAIT** | Fermée, en attente pour éviter des collisions |
| **SYN_SENT** | Requête de connexion envoyée, pas encore établie |

**Pourquoi utiliser netstat ?** Diagnostic réseau (connexions suspectes), analyse de performance (ports saturés, erreurs d'interface), sécurité (services en écoute = surface d'attaque potentielle), dépannage applicatif (dépendances réseau d'un processus).

⚠️ **netstat est progressivement remplacé** par des outils plus modernes : `ss` sous Linux, `Get-NetTCPConnection` sous PowerShell.

**Exemples concrets** :
```
netstat -an                # connexions suspectes, tri par IP/port inhabituel
netstat -an | grep :80     # vérifier qu'un service web écoute bien sur le port 80
netstat -p | grep :22      # identifier le processus qui utilise le port 22 (SSH)
```

---

## 5. Les commandes TRACERT et TRACEROUTE

**Rôle** : identifier tous les routeurs (« sauts », *hops*) traversés entre la machine locale et une destination — `tracert` sous Windows, `traceroute` sous Linux.

**Fonctionnement** : la commande utilise l'**ICMP** en augmentant progressivement le **TTL** des paquets envoyés :
- **TTL = 1** → le premier routeur reçoit le paquet, le décrémente à 0, renvoie une erreur ICMP (« TTL exceeded ») → ce routeur est ainsi identifié.
- **TTL = 2** → le second routeur fait de même, et ainsi de suite.

Chaque réponse ICMP révèle donc un routeur intermédiaire supplémentaire, jusqu'à atteindre la destination.

**Syntaxe** : `tracert [options] <adresse-cible>`

### Options courantes (Windows)

| Option | Effet |
|---|---|
| `/d` | N'affiche pas les noms DNS des routeurs (adresses IP seulement — plus rapide) |
| `/h <nombre>` | Nombre maximum de sauts (30 par défaut) |
| `/w <ms>` | Délai d'attente avant de déclarer un routeur injoignable (4000 ms par défaut) |
| `/4` | Force l'utilisation d'IPv4 |
| `/6` | Force l'utilisation d'IPv6 |

**Exemple** : `tracert /d /h 15 /w 1000 www.google.com` → sans résolution DNS, limité à 15 sauts, délai réduit à 1 seconde.

**Exemple de sortie** :
```
1  <1 ms  <1 ms  <1 ms  192.168.1.1
2  12 ms  10 ms  11 ms  10.0.0.1
3  25 ms  23 ms  22 ms  203.0.113.1
4  50 ms  48 ms  49 ms  8.8.8.8
```
Chaque ligne = un routeur traversé, avec 3 temps de réponse mesurés. Des astérisques (`* * *`) indiquent qu'un routeur n'a pas répondu (souvent un filtrage ICMP, pas nécessairement une panne).

### Diagnostic à partir des résultats

| Observation | Interprétation |
|---|---|
| Le premier saut ne répond pas | Problème sur le **réseau local** |
| Les premiers sauts répondent, puis plus rien plus loin | Problème probablement **externe** (FAI ou au-delà) |
| La latence augmente fortement à un saut donné | Point de **congestion** à cet endroit du trajet |

⚠️ **Limites** : le filtrage ICMP par certains pare-feu peut fausser les résultats (lignes d'astérisques) ; avec du **routage dynamique** (BGP, OSPF), le chemin affiché peut changer rapidement d'un test à l'autre ; un routeur simplement lent/surchargé peut aussi ne pas répondre dans le délai imparti, sans que la route soit réellement coupée.

**Sous Linux** :
```bash
sudo apt install traceroute   # Ubuntu/Debian
sudo yum install traceroute   # CentOS/Red Hat

traceroute www.google.com
```

---

## ✅ Points clés à retenir

| Commande | À retenir en un coup d'œil |
|---|---|
| **arp** | Résolution IP ↔ MAC (couche 2). `-a` affiche, `-s` ajoute une entrée statique |
| **ipconfig / ip** | Configuration réseau des interfaces. `ipconfig /all` (Windows) et `ip addr` (Linux) donnent la vue la plus complète |
| **ping** | Teste la connectivité + latence via ICMP — ne mesure **pas** la bande passante |
| **netstat** | Connexions actives et ports en écoute — `-a` pour tout voir, de plus en plus remplacé par `ss`/`Get-NetTCPConnection` |
| **tracert / traceroute** | Identifie chaque routeur traversé grâce à l'incrémentation du **TTL** |

⚠️ À travers toutes ces commandes, une même limite technique revient : le **filtrage ICMP** par certains pare-feu peut fausser aussi bien `ping` que `tracert` — un résultat négatif n'indique pas toujours une vraie panne réseau.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-01-bases-des-reseaux-module-5-les-premieres-commandes"></div>

<script type="application/json" id="quiz-cours-01-bases-des-reseaux-module-5-les-premieres-commandes-data">
[
  {
    "question": "À quoi sert la commande ARP dans un réseau local ?",
    "options": ["À faire correspondre une adresse IP à une adresse MAC", "À résoudre un nom de domaine en adresse IP", "À attribuer dynamiquement une adresse IP à un hôte", "À chiffrer les communications entre deux machines"],
    "correctIndex": 0,
    "explanation": "ARP (Address Resolution Protocol) permet de faire correspondre une adresse IP (couche Réseau) à une adresse MAC (couche Liaison) afin que les données puissent être acheminées correctement au sein du réseau local."
  },
  {
    "question": "Quelle commande permet d'afficher la table ARP locale sous Windows ou Linux ?",
    "options": ["arp -s", "arp -a", "ipconfig /all", "netstat -r"],
    "correctIndex": 1,
    "explanation": "La commande arp -a liste toutes les associations IP/MAC actuellement connues par le système, stockées dans le cache ARP local."
  },
  {
    "question": "Que se passe-t-il lorsqu'une machine ne trouve pas l'adresse MAC correspondant à une IP cible dans sa table ARP ?",
    "options": ["Elle transmet automatiquement le paquet à la passerelle par défaut sans résolution", "Elle interroge un serveur DNS pour obtenir l'adresse MAC", "Elle envoie une requête ARP en broadcast à tous les appareils du réseau local", "Elle abandonne la communication sans autre tentative"],
    "correctIndex": 2,
    "explanation": "Si l'adresse MAC n'est pas connue, la machine envoie une requête ARP broadcast du type « Qui a l'adresse IP X ? », et l'appareil concerné répond avec son adresse MAC."
  },
  {
    "question": "Dans IPv6, quel protocole remplace ARP pour la résolution d'adresses ?",
    "options": ["ICMP (Internet Control Message Protocol)", "DHCP (Dynamic Host Configuration Protocol)", "RIP (Routing Information Protocol)", "NDP (Neighbor Discovery Protocol)"],
    "correctIndex": 3,
    "explanation": "ARP est spécifique à IPv4 ; en IPv6, c'est le protocole NDP (Neighbor Discovery Protocol) qui assure la résolution d'adresses entre voisins."
  },
  {
    "question": "Quelle commande Windows affiche l'adresse IP, le masque de sous-réseau et la passerelle par défaut d'une interface réseau ?",
    "options": ["ipconfig", "arp -a", "tracert", "netstat -e"],
    "correctIndex": 0,
    "explanation": "ipconfig affiche un résumé des configurations réseau des interfaces actives, incluant l'adresse IPv4, le masque de sous-réseau et la passerelle par défaut."
  },
  {
    "question": "Quelle option de ipconfig permet d'obtenir des informations détaillées comme l'adresse MAC et les serveurs DNS utilisés ?",
    "options": ["ipconfig /release", "ipconfig /all", "ipconfig /flushdns", "ipconfig /renew"],
    "correctIndex": 1,
    "explanation": "ipconfig /all fournit une vue exhaustive des paramètres réseau d'une interface, y compris l'adresse physique (MAC), les serveurs DNS et les informations de bail DHCP."
  },
  {
    "question": "Que fait la commande ipconfig /flushdns ?",
    "options": ["Elle libère l'adresse IP attribuée par le serveur DHCP", "Elle affiche la table de routage du système", "Elle efface les entrées obsolètes ou corrompues du cache DNS local", "Elle renouvelle automatiquement l'adresse MAC de la carte réseau"],
    "correctIndex": 2,
    "explanation": "ipconfig /flushdns vide le cache DNS local, ce qui peut résoudre des problèmes liés à la résolution de noms de domaine en forçant le système à récupérer des informations DNS actualisées."
  },
  {
    "question": "Sous Windows, si une machine obtient une adresse commençant par 169.254.x.x via ipconfig, que cela indique-t-il généralement ?",
    "options": ["Une configuration IPv6 correcte", "Une adresse publique attribuée par le FAI", "Une adresse réservée au multicast", "Un problème avec le serveur DHCP : la machine s'est auto-attribué une adresse APIPA"],
    "correctIndex": 3,
    "explanation": "Une adresse dans la plage 169.254.x.x correspond à une adresse APIPA, que la machine s'attribue automatiquement lorsqu'elle ne parvient pas à contacter un serveur DHCP."
  },
  {
    "question": "Sous Linux, quelle commande moderne remplace progressivement ifconfig pour la gestion des interfaces réseau ?",
    "options": ["ip", "netstat", "tracert", "arp"],
    "correctIndex": 0,
    "explanation": "La commande ip, issue de la suite iproute2, remplace progressivement ifconfig sous Linux et offre une gestion plus riche des interfaces, adresses et routes réseau."
  },
  {
    "question": "Quelle commande Linux permet d'afficher la table de routage du système ?",
    "options": ["ip link", "ip route", "ip addr", "ip neigh"],
    "correctIndex": 1,
    "explanation": "La commande ip route affiche la table de routage, incluant la route par défaut et les réseaux directement connectés."
  },
  {
    "question": "Quel protocole est utilisé par la commande ping pour tester la connectivité vers une machine distante ?",
    "options": ["ARP (Address Resolution Protocol)", "TCP (Transmission Control Protocol)", "ICMP (Internet Control Message Protocol)", "DNS (Domain Name System)"],
    "correctIndex": 2,
    "explanation": "ping envoie des paquets ICMP Echo Request à la machine cible et attend un ICMP Echo Reply pour vérifier la connectivité et mesurer la latence."
  },
  {
    "question": "Que mesure le temps affiché (time=) dans le résultat d'une commande ping ?",
    "options": ["La bande passante disponible entre les deux machines", "Le nombre de routeurs traversés par le paquet", "La taille du paquet ICMP envoyé", "Le temps aller-retour (RTT, Round-Trip Time) du paquet entre les deux machines"],
    "correctIndex": 3,
    "explanation": "Le champ time= indique le temps aller-retour (Round-Trip Time) nécessaire pour que le paquet ICMP atteigne la destination et que la réponse revienne."
  },
  {
    "question": "Que signifie le champ ttl= dans le résultat d'un ping ?",
    "options": ["Le nombre maximum de sauts (routeurs) que le paquet peut encore effectuer avant d'être abandonné", "Le temps total écoulé depuis l'envoi de la première requête", "La taille totale du paquet transmis en octets", "Le nombre de paquets perdus pendant le test"],
    "correctIndex": 0,
    "explanation": "Le TTL (Time To Live) limite le nombre de sauts qu'un paquet peut effectuer ; il est décrémenté à chaque routeur traversé, et le paquet est abandonné lorsqu'il atteint 0."
  },
  {
    "question": "La commande ping permet-elle de mesurer la bande passante d'une connexion réseau ?",
    "options": ["Oui, c'est sa fonction principale", "Non, elle mesure uniquement la latence et la perte de paquets", "Oui, mais uniquement avec l'option -s", "Oui, en combinaison avec tracert"],
    "correctIndex": 1,
    "explanation": "ping est limité à la mesure de la latence (RTT) et du taux de perte de paquets ; il ne fournit aucune information sur la bande passante disponible d'une connexion."
  },
  {
    "question": "Quelle commande affiche les connexions réseau actives (TCP/UDP) et les ports d'écoute d'un système ?",
    "options": ["tracert", "arp", "netstat", "ipconfig"],
    "correctIndex": 2,
    "explanation": "netstat (network statistics) fournit des informations détaillées sur les connexions réseau actives, les ports d'écoute et les statistiques d'interface d'un système."
  },
  {
    "question": "Dans les résultats de netstat, que signifie l'état ESTABLISHED pour une connexion TCP ?",
    "options": ["Le port attend des connexions entrantes sans qu'aucune ne soit établie", "La connexion a été fermée par l'autre partie et attend une fermeture locale", "Une requête de connexion a été envoyée mais n'est pas encore établie", "La connexion est active et opérationnelle"],
    "correctIndex": 3,
    "explanation": "L'état ESTABLISHED indique qu'une connexion TCP est pleinement active entre les deux extrémités, contrairement à LISTEN (en attente) ou SYN_SENT (en cours d'établissement)."
  },
  {
    "question": "Quels outils modernes remplacent progressivement netstat ?",
    "options": ["ss sous Linux et Get-NetTCPConnection sous PowerShell", "ping et tracert", "arp et ipconfig", "DHCP et DNS"],
    "correctIndex": 0,
    "explanation": "netstat est progressivement remplacé par des outils plus performants comme ss sous Linux et Get-NetTCPConnection sous PowerShell pour Windows."
  },
  {
    "question": "Quel est le rôle principal de la commande tracert (ou traceroute sous Linux) ?",
    "options": ["Afficher les ports en écoute sur la machine locale", "Identifier tous les routeurs intermédiaires traversés par les paquets jusqu'à une destination donnée", "Attribuer une adresse IP statique à une interface réseau", "Chiffrer les paquets envoyés vers une destination"],
    "correctIndex": 1,
    "explanation": "tracert (ou traceroute) révèle le chemin réseau emprunté par les paquets en identifiant chaque routeur intermédiaire (« hop ») entre la machine locale et la destination."
  },
  {
    "question": "Comment tracert parvient-elle à identifier chaque routeur intermédiaire sur le chemin vers une destination ?",
    "options": ["En interrogeant directement chaque routeur via une requête ARP", "En consultant la table de routage du serveur DNS", "En augmentant progressivement la valeur du TTL des paquets envoyés, ce qui provoque une réponse ICMP « TTL exceeded » à chaque saut", "En demandant au serveur cible de lister les routeurs traversés"],
    "correctIndex": 2,
    "explanation": "tracert envoie des paquets avec un TTL croissant (1, 2, 3...) ; chaque routeur qui décrémente le TTL à 0 renvoie un message ICMP « TTL exceeded », ce qui permet d'identifier les routeurs successifs."
  },
  {
    "question": "Dans un résultat de tracert, que signifie une ligne contenant des astérisques (* * *) ?",
    "options": ["Le paquet a atteint sa destination finale avec succès", "La connexion a été interrompue définitivement", "Le routeur a redirigé le trafic vers un autre chemin", "Le routeur intermédiaire correspondant n'a pas répondu, souvent en raison d'un filtrage ICMP"],
    "correctIndex": 3,
    "explanation": "Des astérisques à la place des temps de réponse indiquent que le routeur à ce saut n'a pas répondu dans le délai imparti, souvent parce qu'il filtre ou bloque les messages ICMP."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-01-bases-des-reseaux-module-5-les-premieres-commandes",
      dataId: "quiz-cours-01-bases-des-reseaux-module-5-les-premieres-commandes-data",
    });
  });
</script>
