# Module 3 : Routage et traduction d'adresses

*Cours : [Cours 9 - Les services réseau en environnement Linux](../index.md)*

## 🎯 Objectif du module

Ce module aborde la mise en place du **routage** sous Linux — comment transformer une machine Linux classique en routeur et comment définir les routes nécessaires à la communication entre réseaux — ainsi que la **traduction d'adresses (NAT)**, indispensable lorsque le routage seul ne suffit pas à faire communiquer des réseaux privés ou non routables avec Internet.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Routage

### 1.1 Définition et principe

Le **routage** est le processus qui permet la communication entre des hôtes situés sur des réseaux logiques distincts (réseaux locaux ou externes).

Exemple de topologie de référence :

```text
   A (172.16.6.6/255.255.255.0)          C (172.16.2.9)
        |                                      |
   [LAN Brest] --- B (routeur) --- (réseau) --- [LAN Quimper]
```

Le principe de résolution est le suivant :

1. L'hôte **A**, à partir de son adresse IP et de son masque réseau, détermine si l'hôte distant **C** se trouve sur le même réseau logique que lui.
2. **Même réseau** → communication directe entre les deux machines.
3. **Réseau différent** → A doit passer par un intermédiaire : il consulte sa **table de routage** pour savoir quelle machine joindre pour sortir de son réseau (le plus souvent la passerelle, ici le routeur **B**).
4. Cette passerelle dispose des informations nécessaires pour transmettre les paquets de A vers C.

Il faut donc mettre en place l'ensemble des routes nécessaires à la communication, à la fois entre les réseaux internes et vers l'extérieur.

📌 Le routage se configure sur des machines dédiées (les routeurs) : une machine cliente ne détient pas de table de routage complète, elle s'appuie sur le routeur correspondant à son réseau.

### 1.2 Les trois types de routes

| Type de route | Où elle se configure | Rôle |
|---|---|---|
| **Route d'hôte** (peu utilisée) | — | Définit la route à suivre pour atteindre une machine particulière |
| **Route de réseau** | Sur les routeurs | Permet d'adresser les différents réseaux internes de l'infrastructure |
| **Route par défaut** | Sur l'hôte | Utilisée lorsqu'aucune route réseau ne correspond à la requête du poste client |

### 1.3 Gestion des routes avec la commande `ip route`

La commande `ip route` (ou `ip r`) est **dynamique** : les routes définies avec cette commande ne persistent que le temps du fonctionnement de la machine et sont perdues au redémarrage.

Afficher la table de routage actuelle (route par défaut + réseau local) :

```bash
ip route
```

Exemple de sortie :

```text
$ ip route
default via 172.16.6.254 dev ens33 proto dhcp metric 100
172.16.6.0/24 dev ens33 proto kernel scope link src 172.16.6.6 metric 100
```

Ajouter des routes (exemple des trois types de routes) :

```bash
ip route add 10.11.12.3 via 172.16.6.123
ip route add 10.56.0.0/16 via 172.16.6.253
ip route add default via 172.16.6.1
```

Modifier une route déjà définie :

```bash
ip route change default via 10.9.0.200
```

Supprimer une route :

```bash
ip route del 10.56.0.0/16
```

⚠️ Pour rendre ces routes persistantes au redémarrage, il faut soit exporter la commande `ip route`, soit — solution à privilégier — les définir directement dans le fichier `/etc/network/interfaces`.

### 1.4 Transformer une machine Linux en routeur

Par défaut, une machine Linux **ne fait pas routeur** : même si elle est connectée à plusieurs réseaux, elle ne transfère pas les paquets d'un réseau à l'autre, sauf configuration explicite.

Cette capacité s'active dans le fichier `/etc/sysctl.conf`, via le paramètre `net.ipv4.ip_forward` (valeur par défaut : `0`, pas de transfert de paquets) :

```bash
vi /etc/sysctl.conf
```
```text
net.ipv4.ip_forward=1
```

Pour appliquer la configuration sans redémarrer la machine :

```bash
sysctl -p
```

Vérifier que le transfert de paquets est bien actif :

```bash
sysctl net.ipv4.ip_forward
```

Exemple de sortie (transfert **désactivé**, valeur par défaut) :

```text
net.ipv4.ip_forward = 0
```

---

## 2. Traduction d'adresses (NAT)

### 2.1 Pourquoi la traduction d'adresses ?

Les tables de routage ne suffisent pas dans certains cas :

- réseaux non routables ;
- réseaux privés non routables sur Internet ;
- réseaux privés non connus des routeurs (typiquement dans le cadre d'une maquette).

Dans ces situations, il faut permettre aux machines de sortir malgré tout vers Internet : c'est le rôle du **NAT** (*Network Address Translation*, traduction d'adresses réseau).

### 2.2 SNAT et DNAT

| Type | Principe |
|---|---|
| **SNAT** (*Source NAT*) | Une machine dédiée traduit l'adresse IP privée source d'une machine du réseau interne en l'adresse IP publique du réseau, dans les trames sortantes |
| **DNAT** (*Destination NAT*) | Opération inverse : retraduit l'adresse IP de **destination** (utile par exemple pour rediriger un flux entrant vers une machine interne) |

Schéma de principe du SNAT :

```text
[Réseaux non routés] --(adressage source)--> [Passerelle SNAT] --> [Réseaux routés / Internet]
```

La machine du réseau interne (non routé) passe par une machine intermédiaire qui effectue la translation d'adresse. Lorsque les paquets de retour arrivent, les adresses IP sont retraduites afin d'être renvoyées correctement vers la machine du réseau interne.

### 2.3 Outils de mise en œuvre du NAT sous Linux

| Outil / approche | Description |
|---|---|
| **iptables** | Règles natives Linux permettant de gérer directement le NAT (SNAT/DNAT) |
| **Frameworks de règles** (ex. **Shorewall**) | Permettent d'écrire les règles dans un ou plusieurs fichiers, puis de les compiler en règles iptables |
| **Outils avancés de gestion de routage** (ex. **PFSense**) | Solution complète de routage/pare-feu avec interface web, incluant la gestion du NAT entre réseau interne et externe |

📌 PFSense propose une interface web permettant de configurer le NAT (ainsi que d'autres paramètres du firewall) de façon visuelle, sans manipulation directe de règles iptables.


## ✅ Points clés à retenir

- Le routage permet la communication entre réseaux logiques distincts ; une machine détermine, via son IP et son masque, si le destinataire est sur son réseau ou nécessite un passage par un intermédiaire (routeur), identifié via sa table de routage.
- Trois types de routes existent : route d'hôte (rare), route de réseau (sur les routeurs), route par défaut (sur l'hôte, utilisée à défaut d'autre correspondance).
- La commande `ip route` (`ip r`) gère les routes de façon dynamique (perdues au redémarrage) — `add`, `change`, `del` ; pour la persistance, il faut passer par `/etc/network/interfaces`.
- Une machine Linux ne route pas les paquets par défaut : il faut activer `net.ipv4.ip_forward=1` dans `/etc/sysctl.conf` puis recharger avec `sysctl -p`.
- Le NAT (SNAT pour l'adresse source, DNAT pour l'adresse de destination) permet à des réseaux non routables ou privés de communiquer avec l'extérieur, via iptables, un framework de règles (Shorewall) ou un outil avancé comme PFSense.


## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-3-routage-et-traduction-d-adresses"></div>

<script type="application/json" id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-3-routage-et-traduction-d-adresses-data">
[
  {
    "question": "Comment le module définit-il le routage ?",
    "options": ["Le processus qui permet la communication entre des hôtes appartenant à des réseaux logiques distincts", "Le processus de résolution des noms de domaine en adresses IP", "Le processus d'attribution automatique d'adresses IP aux clients", "Le processus de chiffrement des communications entre deux hôtes"],
    "correctIndex": 0,
    "explanation": "Le routage est défini comme le processus qui permet la communication entre les hôtes de réseaux logiques distincts, qu'il s'agisse de réseaux locaux ou externes."
  },
  {
    "question": "Comment un hôte A détermine-t-il si un hôte distant C se trouve sur le même réseau logique que lui ?",
    "options": ["En interrogeant systématiquement un serveur DNS", "Au moyen de sa propre adresse IP et de son masque de réseau", "En envoyant une requête ARP broadcast à tout le réseau", "En consultant la table de routage du routeur distant"],
    "correctIndex": 1,
    "explanation": "Le module précise que l'hôte A, au moyen de son adresse IP et de son masque de réseau, détermine si l'hôte distant C se trouve sur le même réseau logique que lui."
  },
  {
    "question": "Que fait un hôte lorsqu'il constate que la machine distante à joindre se trouve sur un autre réseau que le sien ?",
    "options": ["Il abandonne la communication", "Il communique directement sans passer par un intermédiaire", "Il doit passer par un intermédiaire, généralement la passerelle indiquée dans sa table de routage", "Il diffuse la requête à toutes les machines du réseau local"],
    "correctIndex": 2,
    "explanation": "Si l'hôte distant est sur un autre réseau, l'hôte doit passer par un intermédiaire : il consulte sa table de routage pour savoir quelle machine (souvent la passerelle) joindre afin de sortir de son réseau."
  },
  {
    "question": "Selon le module, qui possède généralement la table de routage complète de l'infrastructure : la machine cliente ou le routeur ?",
    "options": ["La machine cliente possède toujours la table de routage complète", "Aucune des deux, la table de routage est stockée uniquement sur un serveur DNS", "Chaque machine du réseau possède une copie identique de la table de routage du routeur", "Le routage se configure sur des machines dédiées au routage, la machine cliente demandant simplement au routeur de son réseau"],
    "correctIndex": 3,
    "explanation": "Le module précise que ce n'est pas la machine cliente qui dispose de la table de routage complète : le routage se configure sur des machines dédiées, et le client utilise simplement le routeur correspondant à son réseau."
  },
  {
    "question": "Quels sont les trois types de routes définis dans le module ?",
    "options": ["Les routes d'hôtes, les routes de réseaux et les routes par défaut", "Routes statiques, routes dynamiques et routes redondantes", "Routes internes, routes externes et routes de secours", "Routes IPv4, routes IPv6 et routes multicast"],
    "correctIndex": 0,
    "explanation": "Le module distingue trois types de routes : les routes d'hôtes (peu utilisées, vers une machine précise), les routes de réseaux (configurées sur les routeurs) et les routes par défaut (configurées sur l'hôte, utilisées si aucune route réseau ne correspond)."
  },
  {
    "question": "Quand la route par défaut configurée sur un hôte est-elle utilisée ?",
    "options": ["Systématiquement, avant toute autre route", "Lorsqu'aucune route réseau ne correspond à la requête du poste client", "Uniquement lorsque le serveur DHCP est indisponible", "Uniquement pour les communications vers le même réseau logique"],
    "correctIndex": 1,
    "explanation": "La route par défaut, configurée sur l'hôte, est utilisée lorsqu'aucune route réseau plus spécifique ne correspond à la requête émise par le poste client."
  },
  {
    "question": "Pourquoi dit-on que la commande ip route est une commande \"dynamique\" ?",
    "options": ["Parce qu'elle modifie automatiquement les adresses IP des interfaces", "Parce qu'elle nécessite une connexion Internet active pour fonctionner", "Parce que les routes définies avec cette commande sont perdues au redémarrage de la machine", "Parce qu'elle synchronise les routes entre plusieurs machines en temps réel"],
    "correctIndex": 2,
    "explanation": "La commande ip route est qualifiée de dynamique car les routes qu'elle définit ne sont valables que le temps du fonctionnement de la machine : elles sont perdues dès que la machine redémarre."
  },
  {
    "question": "Quelle commande permet d'afficher la table de routage actuelle, incluant la route par défaut ?",
    "options": ["ip addr show", "cat /etc/network/interfaces", "sysctl -p", "ip route (ou ip r)"],
    "correctIndex": 3,
    "explanation": "La commande ip route (ou son raccourci ip r) affiche la table de routage actuelle, avec notamment la route par défaut et le réseau local."
  },
  {
    "question": "Quelle commande permet de modifier une route déjà définie ?",
    "options": ["ip route change", "ip route add", "ip route del", "ip route flush"],
    "correctIndex": 0,
    "explanation": "Le module indique que pour modifier une route déjà existante, on utilise la commande ip route change, à distinguer de ip route add (ajout) et ip route del (suppression)."
  },
  {
    "question": "Pour rendre les routes définies avec ip route persistantes après un redémarrage, quelle solution le module privilégie-t-il ?",
    "options": ["Répéter la commande ip route add manuellement après chaque redémarrage", "Les configurer directement dans le fichier /etc/network/interfaces", "Les stocker dans un script exécuté par cron toutes les 5 minutes", "Utiliser exclusivement Network Manager"],
    "correctIndex": 1,
    "explanation": "Comme la commande ip route est dynamique, le module indique qu'il faut, pour stabiliser les routes, soit exporter la commande, soit (solution à privilégier) les configurer directement dans le fichier /etc/network/interfaces."
  },
  {
    "question": "Une machine Linux transfère-t-elle par défaut les paquets entre les différents réseaux auxquels elle est connectée ?",
    "options": ["Oui, systématiquement dès qu'elle possède plusieurs cartes réseau", "Oui, mais uniquement pour les paquets ICMP", "Non, elle ne le fait pas par défaut, sauf si on active explicitement cette capacité", "Non, cette fonctionnalité n'existe pas sous Linux"],
    "correctIndex": 2,
    "explanation": "Une machine Linux ne fait pas routeur par défaut : même connectée à plusieurs réseaux, elle ne transfère pas les paquets entre eux tant qu'on ne l'a pas explicitement configurée pour le faire."
  },
  {
    "question": "Dans quel fichier active-t-on la fonction de routage (transfert de paquets) d'une machine Linux ?",
    "options": ["/etc/network/interfaces", "/etc/resolv.conf", "/etc/hosts", "/etc/sysctl.conf"],
    "correctIndex": 3,
    "explanation": "L'activation du transfert de paquets entre réseaux se paramètre dans le fichier /etc/sysctl.conf, en positionnant le paramètre concerné à 1 (la valeur par défaut 0 signifiant qu'aucun transfert n'a lieu)."
  },
  {
    "question": "Quelle commande faut-il exécuter après avoir modifié /etc/sysctl.conf pour que la configuration de routage soit prise en compte ?",
    "options": ["sysctl -p", "systemctl restart networking", "ip route reload", "reboot uniquement, aucune autre commande ne fonctionne"],
    "correctIndex": 0,
    "explanation": "Le module indique qu'il faut recharger la configuration avec la commande sysctl -p pour que le paramètre modifié dans /etc/sysctl.conf soit appliqué sans redémarrer la machine."
  },
  {
    "question": "Dans quels cas le module indique-t-il que les tables de routage classiques ne suffisent pas et qu'il faut recourir à la traduction d'adresses (NAT) ?",
    "options": ["Lorsque le débit réseau dépasse 1 Gbit/s", "Lorsque les réseaux utilisés sont des réseaux privés non routables sur Internet ou non connus des routeurs", "Lorsque l'on utilise exclusivement de l'IPv6", "Lorsque le pare-feu est désactivé"],
    "correctIndex": 1,
    "explanation": "Le NAT devient nécessaire lorsque les réseaux utilisés sont des réseaux privés non routables sur Internet ou des réseaux privés non connus des routeurs (par exemple dans une maquette), et que les machines doivent malgré tout pouvoir sortir vers Internet."
  },
  {
    "question": "Qu'est-ce que le SNAT tel que décrit dans le module ?",
    "options": ["Une technique qui retraduit l'adresse IP de destination des paquets entrants", "Un protocole de chiffrement des communications sortantes", "Une technique où l'adresse IP privée de la machine source est remplacée par l'adresse IP publique du réseau", "Un service de résolution de noms utilisé uniquement en interne"],
    "correctIndex": 2,
    "explanation": "Le SNAT (Source NAT) consiste à paramétrer une machine spécifique qui remplace, dans les trames sortantes, l'adresse IP privée de la machine source par l'adresse IP publique du réseau."
  },
  {
    "question": "En quoi le DNAT se distingue-t-il du SNAT ?",
    "options": ["Le DNAT ne concerne que les adresses IPv6", "Le DNAT et le SNAT sont exactement identiques", "Le DNAT s'applique uniquement au trafic UDP", "Le DNAT fait l'inverse du SNAT : il retraduit l'adresse IP de destination"],
    "correctIndex": 3,
    "explanation": "Le module précise que le DNAT (Destination NAT) permet de faire l'inverse du SNAT : il retraduit l'adresse IP de destination des paquets, par exemple pour rediriger un flux entrant vers une machine du réseau interne."
  },
  {
    "question": "Quel outil bas niveau, natif sous Linux, est mentionné pour gérer les règles de traduction d'adresses (NAT) ?",
    "options": ["iptables", "systemd-resolved", "nmcli", "hostname"],
    "correctIndex": 0,
    "explanation": "Le module indique que sous Linux, il est possible d'utiliser des règles iptables pour gérer la problématique de traduction d'adresses."
  },
  {
    "question": "Quel framework est cité comme permettant d'écrire des règles dans des fichiers puis de les compiler en règles iptables ?",
    "options": ["Ansible", "Shorewall", "Docker", "systemd"],
    "correctIndex": 1,
    "explanation": "Le module cite Shorewall comme exemple de framework permettant d'écrire des règles dans un fichier ou un ensemble de fichiers, puis de les compiler automatiquement en règles iptables."
  },
  {
    "question": "Quel outil avancé de gestion de routage et de pare-feu, doté d'une interface web, est cité en exemple dans le module ?",
    "options": ["Wireshark", "GNS3", "pfSense", "Zabbix"],
    "correctIndex": 2,
    "explanation": "Le module cite pfSense comme exemple d'outil avancé de gestion de routage, avec une interface web permettant notamment de configurer le NAT entre le réseau interne et l'externe."
  },
  {
    "question": "Pourquoi le module précise-t-il qu'il faut définir l'ensemble des routes nécessaires, aussi bien pour l'interne que vers l'extérieur ?",
    "options": ["Pour économiser de la bande passante réseau", "Pour éviter d'avoir à configurer un pare-feu", "Parce que cela est obligatoire uniquement en IPv6", "Pour permettre la communication entre les différents réseaux de l'infrastructure et vers l'extérieur"],
    "correctIndex": 3,
    "explanation": "Le module explique qu'il faut mettre en place l'ensemble des routes nécessaires à la communication entre les différents réseaux de l'infrastructure ainsi que vers l'extérieur, en définissant le routage interne et externe."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-3-routage-et-traduction-d-adresses",
      dataId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-3-routage-et-traduction-d-adresses-data",
    });
  });
</script>
