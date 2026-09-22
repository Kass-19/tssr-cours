# Module 2 : Adressage réseau

*Cours : [Cours 9 - Les services réseau en environnement Linux](../index.md)*

## 🎯 Objectif du module

Ce module explore les méthodes de paramétrage de la configuration réseau d'un serveur Linux. Il couvre :

- l'identification des interfaces réseau ;
- leur configuration (adresses IP, masque de sous-réseau) ;
- la configuration du client DNS ;
- la configuration de la passerelle par défaut ;
- les différentes méthodes de paramétrage réseau (statique vs dynamique) et leurs usages respectifs.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Nommage des cartes réseau et outils de configuration

### 1.1 Le nommage des interfaces réseau

Avec la généralisation de **systemd** sur la quasi-totalité des distributions Linux, le nommage des cartes réseau a évolué :

| Ancien nommage | Nouveau nommage (predictable network interface names) |
|---|---|
| `eth0`, `eth1`, `eth2`... | `ens1`, `ens2`... ou `enp0s1`, `enp0s2`... |

Le nouveau nom dépend du **chipset** *(ensemble de puces électroniques de la carte mère gérant la communication entre processeur, mémoire vive, stockage et périphériques)* de la carte réseau et de l'ordre dans lequel le noyau Linux découvre les interfaces. L'interface de **loopback**, elle, conserve toujours le nom `lo`.

### 1.2 Trois méthodes de configuration

| Méthode | Persistance | Usage typique |
|---|---|---|
| **Commande `ip`** | Non persistante (perdue au redémarrage) | Configuration dynamique, tests, dépannage |
| **Fichier `/etc/network/interfaces`** | Persistante | Configuration statique stable, reprise à chaque démarrage |
| **Network Manager (`nmcli`)** | Persistante | Gestion centralisée, notamment en environnement avec interface graphique |

⚠️ Ces trois méthodes ne doivent pas être mélangées sur une même machine : il faut choisir une approche cohérente (typiquement, soit `/etc/network/interfaces`, soit Network Manager) pour éviter les conflits de configuration.

#### a) Configuration dynamique avec la commande `ip`

La commande `ip` remplace l'ancienne commande `ifconfig`, désormais obsolète. Elle permet de gérer l'adressage réseau, les routes et d'autres paramètres.

Afficher les interfaces réseau et leur configuration :

```bash
ip addr show
```

Exemple de sortie :

```text
$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 16436 qdisc noqueue state UNKNOWN
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: ens33: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP glen 1000
    link/ether 00:0c:29:4d:bc:c2 brd ff:ff:ff:ff:ff:ff
    inet6 fe80::29c:29ff:fe4d:bcc2/64 scope link
       valid_lft forever preferred_lft forever
```

Ajouter une adresse IP à une interface :

```bash
ip addr add 10.11.12.13/24 dev ens33
```

Retirer une adresse IP :

```bash
ip addr del 172.16.0.1/16 dev ens37
```

Réinitialiser (vider) la configuration d'une interface :

```bash
ip addr flush ens33
```

Activer / désactiver une interface :

```bash
ip link set ens33 down
ip link set ens37 up
```

#### b) Configuration statique via le fichier `/etc/network/interfaces`

Cette méthode stabilise la configuration réseau : les paramètres sont repris automatiquement à chaque démarrage.

```text
# L'interface réseau de loopback => il ne faut pas la modifier
auto lo
iface lo inet loopback

# L'interface ens33 est configurée manuellement.
auto ens33
iface ens33 inet static
    address 192.168.66.6
    netmask 255.255.0.0

# L'interface ens37 est quant à elle configurée via DHCP.
auto ens37
iface ens37 inet dhcp
```

Après toute modification de ce fichier, il faut redémarrer le service réseau pour appliquer les changements :

```bash
systemctl restart networking
```

#### c) Configuration avec Network Manager (`nmcli`)

Si Network Manager est installé, il peut être utilisé pour gérer les interfaces. Vérifier son état :

```bash
systemctl status NetworkManager
```

Afficher la configuration réseau actuelle :

```bash
nmcli
```

Exemple de sortie :

```text
$ nmcli
ens33: connecté to Wired connection 1
        "Intel 82545EM"
        ethernet (e1000), 00:0C:29:08:48:4C, hw, mtu 1500
        ip4 default
        inet4 172.16.6.6/24
        route4 172.16.6.0/24
        [...]

lo: non-géré
        "lo"
        loopback (unknown), 00:00:00:00:00:00, sw, mtu 65536

DNS configuration:
        servers: 10.0.0.1
        domains: demo.eni
        interface: ens33
```

Modifier l'adresse IPv4 d'une interface :

```bash
nmcli connection modify "Wired connection 1" ipv4.addresses 192.168.1.100/24
```

Quelques variantes utiles de `nmcli connection modify` :

```bash
# Définir une adresse IP fixe
nmcli connection modify Wired\ connection\ 1 ipv4.addresses 192.168.66.6/24

# Définir l'adresse ET passer la méthode en manuel (statique)
nmcli connection modify Wired\ connection\ 1 ipv4.addresses 192.168.66.6/24 ipv4.method manual

# Ajouter une adresse IP supplémentaire (sans écraser l'existante), avec le préfixe +
nmcli connection modify Wired\ connection\ 1 +ipv4.addresses 192.168.1.1/24
```

📌 Le préfixe `+` devant un paramètre `nmcli` permet d'**ajouter** une valeur (ici une adresse IP supplémentaire) sans écraser la configuration déjà en place.


---

## 2. Passerelle par défaut

La **passerelle par défaut** est le routeur du réseau permettant de sortir vers des réseaux qui ne sont pas définis dans les tables de routage statiques de la machine.

### 2.1 Configuration de la passerelle

| Méthode | Commande / emplacement |
|---|---|
| **Network Manager** | `nmcli connection modify <nom_interface> ipv4.gateway <gateway>` |
| **Fichier `/etc/network/interfaces`** | Ajout de la ligne `gateway <adresse_ip>` à la suite de la configuration de l'interface |
| **Commande `ip`** | `ip route add / change / del default via <adresse_ip>` |

### 2.2 Vérification et gestion via la commande `ip route`

Consulter la table de routage actuelle :

```bash
ip route
```

Une ligne typique de sortie indiquant la passerelle par défaut :

```text
default via 192.168.0.254 dev ens37
```

Cette ligne signifie que la passerelle par défaut est `192.168.0.254`, accessible via l'interface `ens37`.

⚠️ Il ne peut exister **qu'une seule route par défaut** sur une configuration réseau donnée.

Ajouter une route par défaut :

```bash
ip route add default via 10.11.0.254
```

Modifier la route par défaut existante :

```bash
ip route change default via 10.11.255.254
```

Supprimer la route par défaut :

```bash
ip route del default via 192.168.0.254
```

📌 Après toute modification, `ip route` doit être utilisée pour vérifier que la configuration réseau est correcte.


---

## 3. Nom d'hôte

### 3.1 Nom court et FQDN

Le nom d'hôte d'une machine peut être défini sous deux formes :

| Forme | Description |
|---|---|
| **Nom court** | Identifie simplement la machine (ex : `srv-lan`) |
| **FQDN** (*Fully Qualified Domain Name*) | Nom de la machine + nom de domaine sur lequel elle se trouve (ex : `srv-lan.demo.eni`) |

### 3.2 Configuration et résolution du nom d'hôte

Le nom d'hôte se configure dans le fichier `/etc/hostname`, qui ne contient qu'une seule information : le nom de la machine (court ou long).

Pour que le nom d'hôte soit **résolvable localement** (c'est-à-dire qu'il puisse être pingué), il doit être associé à une adresse IP dans le fichier `/etc/hosts` — sans nécessiter de serveur DNS. Exemple d'entrée :

```text
127.0.1.1 srv-lan.demo.eni srv-lan
```

Avec cette entrée, un ping vers `srv-lan.demo.eni` **ou** vers `srv-lan` renverra la même adresse IP (`127.0.1.1`).

Vérifier le nom d'hôte configuré sur la machine :

```bash
hostname
```

---

## 4. Client DNS

Pour accéder aux services réseau de l'infrastructure, la machine doit être configurée avec un client DNS. Deux fichiers interviennent :

| Fichier | Rôle |
|---|---|
| `/etc/hosts` | Association statique IP ↔ nom d'hôte (vu en section 3) |
| `/etc/resolv.conf` | Serveur(s) DNS à interroger |

### 4.1 Ordre d'interprétation : `/etc/nsswitch.conf`

Ce fichier détermine l'ordre de résolution des noms (fichier `hosts` en premier, ou serveur DNS en premier). Dans une configuration standard, on trouve la ligne :

```text
hosts: files dns
```

Ce qui signifie que lors d'une requête de résolution de nom, **`/etc/hosts` est consulté en premier** ; si l'information n'y est pas trouvée, le serveur DNS défini dans `/etc/resolv.conf` est interrogé en second.

Sur une installation Linux avec interface graphique, une ligne plus détaillée peut apparaître, par exemple :

```text
hosts: files mdns4_minimal [NOTFOUND=return] dns myhostname
```

Ordre d'interprétation correspondant :

1. `/etc/hosts` ;
2. **mDNS** (*multicast DNS*), pour la résolution de noms d'hôtes IPv4 en local ;
3. serveur DNS ;
4. résolution des noms locaux du poste (`myhostname`).

### 4.2 Configuration du client DNS

Via Network Manager :

```bash
nmcli connection modify <connection_name> ipv4.dns 192.168.66.1
```

### 4.3 Contenu du fichier `/etc/resolv.conf`

| Ligne | Rôle |
|---|---|
| `search` | Définit les suffixes DNS à ajouter automatiquement à un nom court (ex : `demo.uni`, `ad.campus-uni.fr`) |
| `nameserver` | Liste des serveurs DNS à interroger, dans l'ordre de priorité |

📌 Avec une ligne `search demo.uni ad.campus-uni.fr`, un `ping pc1` tentera d'abord de résoudre `pc1.demo.uni`, puis, en cas d'échec, `pc1.ad.campus-uni.fr`.

⚠️ Si la configuration réseau de la machine est en **DHCP**, c'est le serveur DHCP qui fournit la configuration DNS. Toute modification manuelle de `/etc/resolv.conf` sera **écrasée** au prochain rafraîchissement de bail DHCP.


---

## 5. Démonstration — configuration réseau complète

### 5.1 Contexte

La machine virtuelle de démonstration est connectée directement derrière une box ADSL, sur une adresse IP de réseau ADSL classique. Deux approches sont illustrées : configuration dynamique (commande `ip`) et configuration persistante (fichiers).

### 5.2 Configuration dynamique avec `ip`

Ajouter une adresse IP (avec masque en notation CIDR) à une interface :

```bash
ip a add 192.168.0.25/24 dev ens33
```

Vérifier la configuration appliquée :

```bash
ip a
```

Réinitialiser la configuration de l'interface :

```bash
ip a flush ens33
```

📌 Il est possible d'ajouter plusieurs adresses IP à une même interface.

### 5.3 Configuration persistante via `/etc/network/interfaces`

Comme aucune configuration réseau n'était initialement présente (seul le loopback existait), la configuration suivante est ajoutée :

```text
auto ens33
iface ens33 inet static
    address 192.168.0.25/24
    netmask 255.255.255.0
```

Redémarrer le service réseau pour appliquer :

```bash
systemctl restart networking
```

### 5.4 Passerelle par défaut

Ajout de la ligne de passerelle dans le même fichier de configuration :

```text
gateway 192.168.0.254
```

Après redémarrage du service, vérification du routage :

```bash
ip r
```

### 5.5 Configuration DNS

Le serveur DNS est ici, pour l'exemple, identique à la passerelle par défaut. Création du fichier `/etc/resolv.conf` :

```text
nameserver 192.168.0.254
```

📌 Contrairement aux changements réseau, une modification de la configuration DNS ne nécessite pas de redémarrage du service réseau.

### 5.6 Tests de connectivité

Test de connectivité IP simple :

```bash
ping 9.9.9.9
```

Test de la résolution DNS :

```bash
ping www.eni.fr
```

### 5.7 Changement du nom de machine

Le nom de machine se modifie dans `/etc/hosts` et `/etc/hostname`. Un redémarrage est nécessaire pour que le changement soit pleinement pris en compte :

```bash
reboot
```

## ✅ Points clés à retenir

- Le nommage moderne des interfaces réseau Linux (`ensX`/`enpXsY`) a remplacé l'ancien nommage `ethX` ; trois méthodes de configuration existent (`ip`, `/etc/network/interfaces`, Network Manager) et ne doivent pas être mélangées.
- La passerelle par défaut se configure via `nmcli`, un fichier de configuration, ou `ip route`, et une seule route par défaut peut exister à la fois.
- Le nom d'hôte (court ou FQDN) se définit dans `/etc/hostname` et doit être résolvable localement via `/etc/hosts`.
- Le client DNS repose sur `/etc/hosts` et `/etc/resolv.conf`, dont l'ordre d'interrogation est piloté par `/etc/nsswitch.conf` ; en DHCP, la configuration DNS est automatiquement écrasée à chaque renouvellement de bail.
- Une configuration réseau complète et fonctionnelle combine adressage IP, passerelle, DNS et nom de machine, et peut être testée avec `ping` (connectivité) et la résolution de noms.

## 📝 Fiche de révision


## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-2-adressage-reseau"></div>

<script type="application/json" id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-2-adressage-reseau-data">
[
  {
    "question": "Depuis l'imposition de systemd dans la plupart des distributions Linux, comment sont généralement nommées les interfaces réseau (hors loopback) ?",
    "options": ["Des noms comme ENS1, ENS2 ou ENP0S1, ENP0S2, selon le chipset et l'ordre de découverte par le noyau", "Toujours ETH0, ETH1, ETH2", "Toujours WLAN0, WLAN1", "Des noms attribués aléatoirement à chaque démarrage"],
    "correctIndex": 0,
    "explanation": "Avec systemd, les anciens noms génériques ETH0/ETH1 ont été remplacés par des noms comme ENS1, ENS2 ou ENP0S1, ENP0S2, déterminés selon le chipset de la carte réseau et l'ordre dans lequel le noyau Linux détecte les interfaces."
  },
  {
    "question": "Quelles sont les trois méthodes présentées pour nommer et configurer le réseau sous Linux ?",
    "options": ["systemctl, journalctl et dmesg", "La commande ip (dynamique), le fichier /etc/network/interfaces (statique) et Network Manager", "ifconfig, route et netstat uniquement", "iptables, firewalld et ufw"],
    "correctIndex": 1,
    "explanation": "Le module présente trois approches : la configuration dynamique via la commande ip, la configuration statique via le fichier /etc/network/interfaces, et la configuration via l'outil Network Manager."
  },
  {
    "question": "Quelle commande permet d'ajouter l'adresse IP 10.11.12.13/24 à l'interface ens33 avec la commande ip ?",
    "options": ["ip addr set 10.11.12.13/24 dev ens33", "ifconfig ens33 10.11.12.13/24", "ip addr add 10.11.12.13/24 dev ens33", "ip route add 10.11.12.13/24 dev ens33"],
    "correctIndex": 2,
    "explanation": "La syntaxe présentée dans le module pour ajouter une adresse IP à une interface avec la commande ip est : ip addr add 10.11.12.13/24 dev ens33."
  },
  {
    "question": "Quelle commande permet de réinitialiser (vider) toute la configuration IP d'une interface comme ens33 ?",
    "options": ["ip addr del ens33", "ip link reset ens33", "ip addr clear ens33", "ip addr flush ens33"],
    "correctIndex": 3,
    "explanation": "La commande ip addr flush ens33 permet de réinitialiser la configuration d'adressage IP d'une interface donnée."
  },
  {
    "question": "Comment désactive-t-on une interface réseau avec la commande ip ?",
    "options": ["ip link set ens33 down", "ip addr disable ens33", "ip link ens33 stop", "ip a del ens33 down"],
    "correctIndex": 0,
    "explanation": "Pour désactiver une interface, le module indique la commande ip link set ens33 down (et ip link set ens37 up pour l'activer)."
  },
  {
    "question": "Dans le fichier /etc/network/interfaces, quelle ligne permet de configurer l'interface ens37 en DHCP ?",
    "options": ["iface ens37 dhcp static", "iface ens37 inet dhcp", "auto ens37 dhcp", "iface ens37 inet static dhcp"],
    "correctIndex": 1,
    "explanation": "Pour une configuration en DHCP dans /etc/network/interfaces, le module précise la syntaxe : auto ens37 suivi de iface ens37 inet dhcp."
  },
  {
    "question": "Après avoir modifié le fichier /etc/network/interfaces, quelle commande faut-il exécuter pour appliquer les changements ?",
    "options": ["reboot", "nmcli reload", "systemctl restart networking", "ip route flush"],
    "correctIndex": 2,
    "explanation": "Le module indique qu'après modification du fichier /etc/network/interfaces, il faut redémarrer le service réseau avec systemctl restart networking."
  },
  {
    "question": "Quelle précaution le module mentionne-t-il concernant l'utilisation conjointe de /etc/network/interfaces et de Network Manager ?",
    "options": ["Il faut impérativement utiliser les deux en même temps pour plus de fiabilité", "Network Manager remplace automatiquement le fichier interfaces sans conflit possible", "Le fichier interfaces a toujours la priorité sur Network Manager", "Il ne faut pas mélanger les configurations entre le fichier /etc/network/interfaces et Network Manager"],
    "correctIndex": 3,
    "explanation": "Le module précise explicitement qu'il ne faut pas mélanger les configurations entre le fichier /etc/network/interfaces et l'outil Network Manager."
  },
  {
    "question": "Quelle commande permet de modifier l'adresse IPv4 d'une connexion via Network Manager en ligne de commande ?",
    "options": ["nmcli connection modify \"Wired connection 1\" ipv4.addresses 192.168.1.100/24", "nmcli set ip 192.168.1.100/24", "nmcli addr change 192.168.1.100/24", "systemctl set-ip 192.168.1.100/24"],
    "correctIndex": 0,
    "explanation": "Le module donne l'exemple de la commande nmcli connection modify \"Wired connection 1\" ipv4.addresses 192.168.1.100/24 pour modifier l'adressage IPv4 d'une connexion via Network Manager."
  },
  {
    "question": "Que représente la passerelle par défaut, telle que définie dans le module ?",
    "options": ["Le serveur qui attribue les adresses IP en DHCP", "Le routeur du réseau permettant de sortir vers des réseaux non définis dans les tables de routage statiques", "Le serveur DNS principal du réseau local", "L'adresse de diffusion (broadcast) du sous-réseau"],
    "correctIndex": 1,
    "explanation": "Le module définit la passerelle par défaut comme le routeur du réseau qui permet de sortir vers des réseaux qui ne sont pas définis dans les tables de routage statiques."
  },
  {
    "question": "Quelle commande permet d'afficher la configuration de routage actuelle, notamment la passerelle par défaut ?",
    "options": ["ip addr show", "nmcli device show", "ip route", "cat /etc/resolv.conf"],
    "correctIndex": 2,
    "explanation": "La commande ip route permet de consulter la configuration de routage actuelle, où l'on retrouve typiquement une ligne du type default via <adresse> dev <interface> indiquant la passerelle par défaut."
  },
  {
    "question": "Combien de routes par défaut peut-on avoir simultanément sur une configuration réseau, selon le module ?",
    "options": ["Autant que d'interfaces réseau disponibles", "Deux maximum, une par sous-réseau", "Il n'y a pas de limite", "Une seule"],
    "correctIndex": 3,
    "explanation": "Le module précise qu'il ne peut y avoir qu'une seule route par défaut sur une configuration réseau, ce qui justifie l'usage de la commande ip route change pour la modifier plutôt que d'en ajouter une seconde."
  },
  {
    "question": "Quelle commande permet de modifier une route par défaut déjà existante vers une nouvelle passerelle ?",
    "options": ["ip route change default via 10.11.255.254", "ip route add default via 10.11.255.254", "ip route new default via 10.11.255.254", "ip route set default 10.11.255.254"],
    "correctIndex": 0,
    "explanation": "Pour modifier une route par défaut existante, le module indique la commande ip route change default via 10.11.255.254, à différencier de ip route add utilisée quand aucune route par défaut n'existe encore."
  },
  {
    "question": "Qu'est-ce que le FQDN (Full Qualified Domain Name) mentionné dans le module ?",
    "options": ["Un nom court identifiant uniquement la machine", "Le nom de la machine additionné du nom de domaine sur lequel elle se trouve", "L'adresse IP complète de la machine sous forme décimale", "Le nom du fichier de configuration réseau principal"],
    "correctIndex": 1,
    "explanation": "Le FQDN, ou Full Qualified Domain Name, correspond au nom de la machine auquel s'ajoute le nom de domaine sur lequel elle se trouve, par opposition au nom court qui identifie seulement la machine."
  },
  {
    "question": "Dans quel fichier configure-t-on le nom d'hôte (hostname) de la machine ?",
    "options": ["/etc/hosts", "/etc/resolv.conf", "/etc/hostname", "/etc/nsswitch.conf"],
    "correctIndex": 2,
    "explanation": "Le module précise que le nom d'hôte se configure dans le fichier /etc/hostname, qui contient une seule information : le nom de la machine (court ou long)."
  },
  {
    "question": "À quoi sert le fichier /etc/hosts, en l'absence d'un serveur DNS ?",
    "options": ["À définir la passerelle par défaut du système", "À stocker les règles du pare-feu local", "À lister les interfaces réseau disponibles", "À faire le lien entre une adresse IP et un nom d'hôte pour permettre la résolution locale"],
    "correctIndex": 3,
    "explanation": "Le fichier /etc/hosts permet d'associer une adresse IP à un nom d'hôte, ce qui permet de résoudre ce nom localement sans avoir recours à un serveur DNS."
  },
  {
    "question": "Dans quel fichier définit-on le ou les serveurs DNS que la machine doit interroger pour la résolution de noms ?",
    "options": ["/etc/resolv.conf", "/etc/nsswitch.conf", "/etc/network/interfaces", "/etc/hostname"],
    "correctIndex": 0,
    "explanation": "Le fichier /etc/resolv.conf permet de configurer le ou les serveurs DNS que la machine va utiliser pour la résolution des noms de domaine."
  },
  {
    "question": "Que définit le fichier /etc/nsswitch.conf dans le contexte de la résolution de noms ?",
    "options": ["La liste des interfaces réseau actives", "L'ordre d'interprétation des sources de résolution de noms (par exemple fichier /etc/hosts avant ou après le DNS)", "Les règles de pare-feu appliquées aux requêtes DNS", "La configuration statique de l'adresse IP de la machine"],
    "correctIndex": 1,
    "explanation": "Le fichier /etc/nsswitch.conf définit l'ordre d'interprétation des sources de résolution de noms : par exemple, la ligne hosts: files dns indique que le fichier /etc/hosts est consulté en premier, puis le serveur DNS si l'information n'y est pas trouvée."
  },
  {
    "question": "Que se passe-t-il pour la configuration du fichier /etc/resolv.conf si la machine utilise une configuration réseau en DHCP ?",
    "options": ["Elle reste figée telle qu'on l'a modifiée manuellement, quel que soit le DHCP", "Le fichier est automatiquement supprimé", "Elle est écrasée par la configuration DNS fournie par le DHCP à chaque rafraîchissement", "Le DHCP n'a aucun impact sur ce fichier"],
    "correctIndex": 2,
    "explanation": "Le module précise que si la configuration réseau est en DHCP, c'est le DHCP qui fournit la configuration DNS, et toute modification manuelle du fichier /etc/resolv.conf sera écrasée à chaque rafraîchissement de la configuration DHCP."
  },
  {
    "question": "À quoi sert la ligne \"search\" que l'on peut trouver dans le fichier /etc/resolv.conf ?",
    "options": ["Elle définit l'adresse IP du serveur DNS principal", "Elle indique la passerelle par défaut à utiliser pour les requêtes DNS", "Elle désactive la résolution DNS pour les tests locaux", "Elle définit les suffixes DNS qui complètent automatiquement un nom de machine saisi sans domaine"],
    "correctIndex": 3,
    "explanation": "La ligne search définit les suffixes DNS qui seront automatiquement ajoutés à un nom de machine saisi sans domaine : par exemple, un ping vers \"pc1\" tentera de résoudre pc1.demo.uni, puis pc1.ad.campus-uni.fr si le premier échoue."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-2-adressage-reseau",
      dataId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-2-adressage-reseau-data",
    });
  });
</script>
