# Module 5 : DNS résolveur

*Cours : [Cours 9 - Les services réseau en environnement Linux](../index.md)*

## 🎯 Objectif du module

Ce module détaille le fonctionnement du service **DNS** (résolution de noms, structure arborescente, requêtes itératives/récursives), le rôle spécifique d'un **DNS résolveur**, puis la mise en place concrète d'un serveur DNS résolveur complet avec **Bind9** sous Linux.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Fonctionnement du service DNS

### 1.1 Rôle du service DNS

Le service **DNS** (*Domain Name System*) assure la correspondance entre un **FQDN** (nom de domaine) et une **adresse IP**, et inversement (résolution inverse). Il permet également d'obtenir d'autres informations liées à un domaine — par exemple les serveurs de messagerie associés.

Le DNS est un protocole **standardisé et mis à jour par l'IETF**, et constitue l'un des services essentiels au fonctionnement d'Internet : sans DNS, il n'y a pas d'Internet utilisable au quotidien. Toute machine connectée à Internet (poste client, serveur, mobile) interroge des serveurs DNS dès qu'elle a besoin d'accéder à une ressource.

```text
Client                                   Serveur DNS
   |---- @IP de www.baidu.com . ? -------->|
   |<--- @IP de www.baidu.com . = 103.235.46.39 ---|
```

### 1.2 Structure arborescente du DNS

Le DNS repose sur une **structure arborescente** : plusieurs niveaux de serveurs DNS répondent chacun à un type de requête différent. Une URL se lit **de la droite vers la gauche** pour décrire la descente dans cette arborescence ; chaque point (`.`) correspond à un niveau supplémentaire.

Exemple avec `https://www.indiatimes.com.` :

| Élément | Rôle |
|---|---|
| `.` (racine, en fin d'URL) | Représente la **racine de l'espace de noms DNS** (point implicite, ajouté automatiquement par le navigateur) |
| `com.` | Nom de domaine, sous-domaine du domaine racine — c'est le **TLD** (*Top Level Domain*) |
| `.` (séparateur) | Sépare les domaines entre eux |
| `indiatimes.com.` | Nom de domaine, sous-domaine du `.com.` |
| `.` (séparateur) | Sépare le nom de domaine du nom d'hôte |
| `www.indiatimes.com.` | Nom d'hôte **pleinement qualifié** (FQDN) |

📌 Les domaines TLD (`.com`, `.fr`...) sont gérés par l'**IANA**, l'organisme responsable de l'attribution de ces domaines.

### 1.3 La résolution DNS étape par étape

La résolution complète d'un nom se fait par une série de **requêtes itératives**, orchestrées par le serveur DNS local (qui reçoit lui la requête initiale du client sous forme **récursive**) :

```text
1. Requête récursive du client :   www.documentation.mondomaine.fr
        ↓ (vers le serveur DNS local)
2. Requête itérative → Serveur racine (.)
3. Réponse : NS pour .fr
4. Requête itérative → Serveur TLD (.fr)
5. Réponse : NS pour mondomaine.fr
6. Requête itérative → Serveur autoritaire (mondomaine.fr)
7. Réponse : NS pour documentation.mondomaine.fr
8. Requête itérative → Serveur autoritaire (documentation.mondomaine.fr)
9. Réponse : IP de www
        ↓
10. Réponse finale renvoyée au client : adresse IP
```

Chaque niveau de serveur (racine → TLD → domaine → sous-domaine) fournit l'adresse du niveau suivant à interroger, jusqu'à obtenir l'adresse IP finale — ce n'est qu'à ce moment que le client peut atteindre le serveur hébergeant le service demandé.

### 1.4 Domaines internes et domaines externes

Le protocole DNS peut être utilisé aussi bien pour des domaines **publics** (résolvables sur Internet) que pour des domaines **internes** (non résolvables publiquement, propres à un réseau local d'entreprise) :

| Domaine | Utilité |
|---|---|
| `masuperentreprise.bzh` | Nom de domaine **public**, utilisé pour référencer les services de l'entreprise accessibles depuis Internet (TLD réellement routable) |
| `enigmes.corp` | Nom de domaine **interne**, propre à l'entreprise, dans lequel sont référencées les ressources hébergées et accessibles uniquement en local |

Le fonctionnement du service DNS est identique, que le domaine soit interne ou externe.

### 1.5 Deux types de résolution

Un serveur DNS peut assurer deux rôles, non exclusifs l'un de l'autre :

- une **résolution DNS complète** (résolveur) ;
- la gestion d'un ou plusieurs **domaines particuliers** (serveur faisant autorité).

---

## 2. Le DNS résolveur

### 2.1 Principe

Un serveur **DNS résolveur** complet doit répondre à toutes les requêtes de ses clients. Il n'est pas lui-même la source de l'information : il interroge, via des **requêtes itératives**, successivement les serveurs racines, les serveurs faisant autorité sur le TLD, puis les serveurs faisant autorité sur le domaine — jusqu'à obtenir l'adresse IP demandée par le client.

### 2.2 Redirecteurs (forwarders)

Plutôt que d'effectuer lui-même l'ensemble de ces requêtes itératives, un serveur DNS peut être configuré pour **rediriger** les requêtes vers un autre serveur DNS, qui se chargera d'interroger les serveurs racines et suivants à sa place. C'est une configuration très courante pour un serveur DNS interne d'entreprise, souvent redirigé vers le serveur DNS du FAI.

| Type de redirecteur | Description |
|---|---|
| **Redirecteur inconditionnel** | Toutes les requêtes des clients, quelles qu'elles soient, sont redirigées de façon récursive vers un même serveur |
| **Redirecteur conditionnel** | Pour un espace de noms donné, les requêtes sont redirigées vers un serveur DNS particulier |

📌 Ces deux configurations sont complémentaires : il est possible de définir un redirecteur inconditionnel pour l'ensemble des domaines, tout en redirigeant les requêtes d'un domaine spécifique vers un autre serveur DNS.

Exemple de contexte : un réseau local redirige ses requêtes DNS vers le serveur public **Quad9** (`9.9.9.9`) au travers d'un firewall :

```text
Postes clients (réseau local) --requête DNS--> Firewall/pare-feu --redirection--> Serveur DNS Quad9 (9.9.9.9)
Postes clients <--retour IP-- Firewall/pare-feu <--réponse IP-- Serveur DNS Quad9
```

### 2.3 Le cache DNS

Une fois la réponse obtenue, le serveur DNS la conserve en **cache** pendant un certain temps, ce qui accélère les requêtes suivantes pour la même information. La durée de conservation (TTL) est définie par les serveurs faisant autorité sur l'enregistrement concerné.

---

## 3. Mise en place d'un serveur DNS (Bind9)

### 3.1 Installation et fichiers de configuration

Le service DNS le plus utilisé sous Linux est **Bind9** (paquet `bind9`). Son fichier de configuration principal est `/etc/bind/named.conf`, qui est — sous Debian — découpé en plusieurs fichiers inclus (`include`) plutôt que centralisé en un seul.

L'ordre d'inclusion dans `named.conf` est important :

```text
1. include /etc/bind/named.conf.options ;        # options générales de bind
2. include /etc/bind/named.conf.local ;           # zones hébergées localement
3. include /etc/bind/named.conf.default-zones ;   # zones par défaut (à ne pas modifier)
```

D'autres fichiers peuvent être inclus à la suite, chacun précédé du mot-clé `include` suivi du chemin complet.

⚠️ Bind9 est **très strict** sur la syntaxe de sa configuration : chaque ligne/option doit se terminer par un `;`. Un point-virgule oublié empêche le service de démarrer.

### 3.2 Gestion du service et commandes utiles

| Commande | Rôle |
|---|---|
| `systemctl restart bind9` / `systemctl status bind9` | Redémarrer / vérifier l'état du service |
| `named-checkconf` | Vérifie la syntaxe de la configuration |
| `named-checkzone` | Teste la configuration d'une zone particulière |
| `rndc` | Recharge la configuration à chaud, selon les besoins |

📌 Toutes les informations de journalisation du service se trouvent dans `/var/log/syslog` — c'est le premier réflexe en cas de problème de démarrage.

### 3.3 Exemple de fichier `named.conf` avec ACL

```text
// rsxclts = réseaux des postes clients de l'entreprise
acl rsxclts { 127.0.0.0/8; 192.168.53.0/24; 192.168.1.0/24; };

include /etc/bind/named.conf.options ;
include /etc/bind/named.conf.local;
include /etc/bind/named.conf.default-zones ;
```

Une **ACL** (*Access Control List*) permet de définir, sous un mot-clé donné, un ensemble de paramètres réutilisables (ici, une liste de réseaux) — évitant d'avoir à ressaisir ces réseaux dans chaque fichier de configuration. L'ACL doit être définie **avant** le chargement des autres options (donc avant les `include`) pour pouvoir être utilisée ensuite dans les fichiers inclus.

⚠️ Attention à la syntaxe : un `;` après chaque réseau, une accolade fermante, puis un `;` final.

### 3.4 Exemple de fichier `named.conf.options`

```text
options {
        // Répertoire de travail de Bind9
        directory "/var/cache/bind";

        // Redirection exclusive (pas d'appel aux racines en cas d'indisponibilité)
        // vers les serveurs Quad9
        forward only;
        forwarders { 9.9.9.9; };

        // Restriction des hôtes auxquels répond le serveur
        allow-query { rsxclts; };

        // Restriction des hôtes autorisés à adresser des requêtes récursives
        allow-recursion { rsxclts; };

        // Communication DNSSEC désactivée
        dnssec-enable no;
        dnssec-validation no;

        // Information de version non communiquée
        version none;
};
```

Détail des paramètres :

| Paramètre | Rôle |
|---|---|
| `directory` | Répertoire de travail de Bind9 |
| `forward only;` + `forwarders { 9.9.9.9; };` | Redirige toutes les requêtes vers le serveur indiqué (ici Quad9, `9.9.9.9`) — remplaçable par un serveur DNS local ou celui du FAI |
| `allow-query { rsxclts; };` | Limite les requêtes DNS acceptées aux réseaux définis dans l'ACL `rsxclts` |
| `allow-recursion { rsxclts; };` | Limite les requêtes récursives acceptées aux mêmes réseaux |
| `dnssec-enable no;` / `dnssec-validation no;` | Désactive la couche de sécurité DNSSEC |
| `version none;` | Masque le numéro de version de Bind9 dans les réponses, par mesure de sécurité (le serveur peut être exposé publiquement si l'entreprise gère un domaine public) |

📌 D'autres options peuvent apparaître selon les configurations, comme l'activation ou non de l'IPv6.

### 3.5 Pointer la machine vers son propre serveur DNS

Une fois Bind9 configuré, le fichier `/etc/resolv.conf` de la machine doit être mis à jour pour pointer vers l'adresse locale `127.0.0.1` (le serveur DNS que l'on vient de configurer sur cette même machine).

Les fichiers `named.conf.default-zones` (zones par défaut, adresses des serveurs racines) ne doivent pas être modifiés. Le fichier `named.conf.local` sert quant à lui à définir les zones gérées localement par ce serveur (abordé dans une partie suivante du cours).

### 3.6 Vérification avec `dig`

La commande `dig` permet d'observer le déroulement d'une requête DNS. En fin de sortie, elle indique quel serveur DNS a répondu à la requête (normalement `127.0.0.1`, si la machine interroge bien son propre serveur DNS local).

```bash
dig www.exemple.fr
```

## ✅ Points clés à retenir

- Le DNS assure la correspondance nom de domaine ↔ adresse IP (et inversement), selon une structure **arborescente** lue de droite à gauche (racine → TLD → domaine → sous-domaine/FQDN), les TLD étant gérés par l'IANA.
- La résolution complète combine une **requête récursive** initiale (client → serveur DNS local) et des **requêtes itératives** successives (racine → TLD → domaine faisant autorité) jusqu'à obtenir l'IP finale.
- Un domaine peut être **public** (résolvable sur Internet) ou **interne** (propre à un réseau d'entreprise, non résolvable publiquement) — le fonctionnement du DNS reste identique dans les deux cas.
- Un serveur DNS résolveur peut interroger directement la hiérarchie DNS, ou **rediriger** ses requêtes (redirecteur inconditionnel ou conditionnel) vers un autre serveur DNS (souvent celui du FAI) ; les réponses obtenues sont mises en **cache** pour une durée définie par les serveurs faisant autorité.
- La mise en place d'un serveur DNS résolveur repose sur **Bind9**, configuré via `/etc/bind/named.conf` (et ses fichiers inclus `named.conf.options`, `named.conf.local`, `named.conf.default-zones`), avec une syntaxe stricte (`;` obligatoire) vérifiable via `named-checkconf` ; les ACL simplifient la restriction des accès (`allow-query`, `allow-recursion`) et les forwarders permettent de déléguer la résolution à un serveur externe.
- Une fois le serveur configuré, `/etc/resolv.conf` de la machine doit pointer vers `127.0.0.1`, et la commande `dig` permet de vérifier quel serveur répond effectivement aux requêtes.


## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-5-dns-resolveur"></div>

<script type="application/json" id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-5-dns-resolveur-data">
[
  {
    "question": "Quelle est la fonction principale du service DNS décrite dans le module ?",
    "options": ["Faire correspondre un FQDN à une adresse IP, et inversement retrouver un nom de domaine à partir d'une IP", "Attribuer dynamiquement des adresses IP aux machines du réseau", "Chiffrer les communications entre un client et un serveur", "Router les paquets entre deux réseaux distincts"],
    "correctIndex": 0,
    "explanation": "Le service DNS permet de faire correspondre un FQDN à une adresse IP, et inversement, à partir d'une adresse IP, de retrouver le nom de domaine correspondant."
  },
  {
    "question": "Outre la résolution nom/IP, quel autre type d'information le module cite-t-il comme accessible via une requête DNS ?",
    "options": ["La liste des utilisateurs connectés à un domaine", "Les serveurs de messagerie associés à un nom de domaine", "Le mot de passe administrateur du serveur", "La charge processeur du serveur DNS"],
    "correctIndex": 1,
    "explanation": "Le module donne l'exemple d'une requête DNS permettant de connaître les serveurs de messagerie associés à un nom de domaine donné."
  },
  {
    "question": "Par quel type d'organisme le protocole DNS est-il standardisé et mis à jour ?",
    "options": ["L'ICANN uniquement", "Le W3C", "L'IETF", "L'ISO"],
    "correctIndex": 2,
    "explanation": "Le module précise que le DNS est un protocole standardisé et mis à jour par l'IETF."
  },
  {
    "question": "Comment qualifie-t-on la structure du DNS décrite dans le module ?",
    "options": ["Une structure en anneau", "Une structure purement centralisée sur un seul serveur mondial", "Une structure maillée sans hiérarchie", "Une structure arborescente, avec plusieurs niveaux de serveurs répondant à différentes requêtes"],
    "correctIndex": 3,
    "explanation": "Le DNS repose sur une structure arborescente : plusieurs niveaux de serveurs DNS se répartissent la responsabilité de répondre aux différentes requêtes selon leur position dans l'arborescence."
  },
  {
    "question": "Dans quel sens doit-on lire une URL pour décrire la descente dans l'arborescence DNS ?",
    "options": ["De la droite vers la gauche", "De la gauche vers la droite", "Cela dépend uniquement du navigateur utilisé", "L'ordre de lecture n'a aucune importance pour le DNS"],
    "correctIndex": 0,
    "explanation": "Le module précise qu'une URL se lit de la droite vers la gauche pour décrire la descente dans l'arborescence du DNS, chaque point marquant le passage à un niveau inférieur."
  },
  {
    "question": "Qui gère les domaines de premier niveau (TLD), comme les .com ou les .fr ?",
    "options": ["L'IETF", "L'IANA", "Chaque fournisseur d'accès Internet individuellement", "Le serveur DNS résolveur local de l'entreprise"],
    "correctIndex": 1,
    "explanation": "Les domaines TLD (Top Level Domain), comme les .com ou les .fr, sont gérés par l'IANA, organisme responsable de la gestion de ces domaines."
  },
  {
    "question": "Que représente le point final invisible à la fin d'une URL, complété automatiquement par le navigateur ?",
    "options": ["Il ne représente rien, c'est une erreur de frappe historique", "Il indique que le domaine est un domaine interne non routable", "Il représente les serveurs racines, premiers serveurs interrogés lors de la résolution", "Il correspond au serveur DNS du fournisseur d'accès Internet"],
    "correctIndex": 2,
    "explanation": "Le point final, presque jamais saisi mais toujours complété par le navigateur, représente les serveurs racines : ce sont eux qui sont interrogés en premier lors d'une résolution DNS complète."
  },
  {
    "question": "Dans le processus de résolution DNS complet décrit dans le module, après les serveurs racines, quel niveau de serveurs est interrogé ?",
    "options": ["Directement les serveurs faisant autorité sur le domaine final", "Le serveur DNS du fournisseur d'accès Internet uniquement", "Le cache local du poste client uniquement", "Les serveurs gérant le TLD (par exemple le .com)"],
    "correctIndex": 3,
    "explanation": "Après avoir interrogé les serveurs racines, la résolution continue vers les serveurs gérant le TLD concerné (par exemple les serveurs du .com), qui indiquent ensuite les adresses des serveurs faisant autorité sur le domaine."
  },
  {
    "question": "Un domaine interne comme \"enigmes.corp\", cité en exemple dans le module, est-il résolvable publiquement sur Internet ?",
    "options": ["Non, il s'agit d'un domaine interne géré uniquement par un serveur DNS configuré en interne dans l'entreprise", "Oui, comme tout domaine, il est automatiquement résolvable sur Internet", "Oui, mais uniquement via les serveurs racines publics", "Non, ce type de domaine ne peut jamais fonctionner, même en interne"],
    "correctIndex": 0,
    "explanation": "Le module oppose un domaine public comme le .bzh, routable sur Internet, à un domaine interne comme enigmes.corp, qui n'existe pas publiquement mais peut être géré par un serveur DNS configuré en interne dans l'entreprise."
  },
  {
    "question": "Quelle est la différence entre un serveur DNS faisant une résolution complète et un serveur DNS ne gérant qu'un ou plusieurs domaines particuliers ?",
    "options": ["Il n'y a aucune différence, tous les serveurs DNS fonctionnent de manière identique", "Le premier peut répondre à n'importe quelle requête en interrogeant d'autres serveurs, le second répond uniquement pour les domaines dont il a la charge", "Le premier fonctionne uniquement en IPv6, le second en IPv4", "Le premier nécessite obligatoirement bind9, le second non"],
    "correctIndex": 1,
    "explanation": "Un serveur DNS résolveur complet doit pouvoir répondre à n'importe quelle requête client en interrogeant d'autres serveurs DNS, tandis qu'un serveur ne gérant qu'un ou plusieurs domaines répond uniquement pour les zones dont il a la charge (même si un même serveur peut combiner les deux rôles)."
  },
  {
    "question": "Que désigne le terme \"requêtes itératives\" utilisé dans le module pour décrire le fonctionnement d'un résolveur DNS ?",
    "options": ["Des requêtes envoyées en boucle vers le même serveur jusqu'à obtenir une réponse", "Des requêtes chiffrées échangées uniquement entre serveurs DNS internes", "Le fait d'interroger successivement les serveurs racines, puis les serveurs du TLD, puis les serveurs faisant autorité sur le domaine", "Des requêtes envoyées simultanément à tous les serveurs DNS connus"],
    "correctIndex": 2,
    "explanation": "Les requêtes itératives désignent le fait, pour le résolveur, d'interroger successivement les serveurs racines, puis les serveurs faisant autorité sur le TLD, puis ceux faisant autorité sur le domaine, jusqu'à obtenir l'adresse IP recherchée."
  },
  {
    "question": "Qu'est-ce qu'un redirecteur (forwarder) \"inconditionnel\" dans une configuration de serveur DNS ?",
    "options": ["Un serveur qui ne répond jamais aux requêtes des clients", "Un serveur utilisé uniquement pour les domaines internes de l'entreprise", "Un serveur qui bloque systématiquement les requêtes DNS externes", "Un serveur adressé de façon récursive pour résoudre toutes les requêtes des clients, quel que soit le domaine demandé"],
    "correctIndex": 3,
    "explanation": "Un redirecteur inconditionnel est un serveur DNS adressé de façon récursive pour résoudre l'ensemble des requêtes des clients, sans distinction de domaine."
  },
  {
    "question": "À quoi sert un redirecteur \"conditionnel\" dans la configuration d'un serveur DNS ?",
    "options": ["À indiquer, pour un espace de nom (domaine) donné, un serveur spécifique vers lequel adresser la résolution récursive", "À rediriger toutes les requêtes vers le même serveur, sans exception", "À désactiver complètement la résolution DNS pour certains clients", "À forcer l'utilisation exclusive d'IPv6 pour un domaine donné"],
    "correctIndex": 0,
    "explanation": "Un redirecteur conditionnel permet de définir, pour un espace de nom (domaine) particulier, un serveur DNS spécifique vers lequel adresser la résolution récursive, plutôt que d'utiliser le redirecteur par défaut."
  },
  {
    "question": "Qui définit la durée pendant laquelle un serveur DNS conserve une réponse en cache ?",
    "options": ["Le serveur DNS résolveur lui-même, de façon totalement libre", "Les serveurs faisant autorité sur l'enregistrement concerné", "Le client qui a émis la requête", "L'IANA, de manière fixe pour tous les enregistrements"],
    "correctIndex": 1,
    "explanation": "La durée de conservation en cache d'une information DNS (le TTL) est définie par les serveurs qui font autorité sur l'enregistrement concerné, ce qui permet ensuite d'accélérer les requêtes suivantes."
  },
  {
    "question": "Quel est le service (et le paquet correspondant) le plus utilisé pour mettre en place un serveur DNS résolveur complet, d'après le module ?",
    "options": ["dnsmasq", "unbound", "bind9", "PowerDNS"],
    "correctIndex": 2,
    "explanation": "Le module indique que bind9 est le service DNS le plus utilisé, et que c'est le paquet à installer sur la machine destinée à faire office de serveur DNS."
  },
  {
    "question": "Quel fichier de configuration principal bind9 utilise-t-il pour démarrer ?",
    "options": ["/etc/dns.conf", "/etc/network/interfaces", "/etc/resolv.conf", "/etc/bind/named.conf"],
    "correctIndex": 3,
    "explanation": "Bind9 utilise le fichier de configuration /etc/bind/named.conf pour démarrer, ce fichier incluant ensuite plusieurs autres fichiers de configuration via des directives include."
  },
  {
    "question": "Quelle commande permet de vérifier la syntaxe de la configuration de bind9 avant de l'appliquer ?",
    "options": ["named-checkconf", "named-checkzone", "rndc", "dig"],
    "correctIndex": 0,
    "explanation": "La commande named-checkconf permet de vérifier la syntaxe de la configuration de bind9, qui est particulièrement stricte (chaque ligne/option doit se terminer par un point-virgule)."
  },
  {
    "question": "Parmi les trois fichiers inclus par défaut dans /etc/bind/named.conf, lequel contient la configuration des zones hébergées localement ?",
    "options": ["named.conf.options", "named.conf.local", "named.conf.default-zones", "resolv.conf"],
    "correctIndex": 1,
    "explanation": "Le fichier named.conf.local contient la configuration des zones hébergées localement, à distinguer de named.conf.options (options générales) et named.conf.default-zones (zones par défaut, généralement non modifiées)."
  },
  {
    "question": "Dans l'exemple de configuration du module, à quelle adresse IP le forwarder (redirecteur) est-il configuré, correspondant au service public Quad9 ?",
    "options": ["8.8.8.8", "1.1.1.1", "9.9.9.9", "127.0.0.1"],
    "correctIndex": 2,
    "explanation": "Le module configure le forwarder vers l'adresse 9.9.9.9, correspondant au service DNS public Quad9, qui recevra toutes les requêtes transmises par le serveur DNS local."
  },
  {
    "question": "Une fois le serveur bind9 configuré et fonctionnel sur la machine locale, quelle adresse doit-on renseigner dans /etc/resolv.conf de cette même machine pour utiliser son propre serveur DNS ?",
    "options": ["9.9.9.9", "192.168.1.1", "0.0.0.0", "127.0.0.1"],
    "correctIndex": 3,
    "explanation": "Une fois bind9 configuré sur la machine, il faut modifier /etc/resolv.conf pour pointer vers l'adresse locale 127.0.0.1, c'est-à-dire utiliser le serveur DNS local nouvellement configuré."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-5-dns-resolveur",
      dataId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-5-dns-resolveur-data",
    });
  });
</script>
