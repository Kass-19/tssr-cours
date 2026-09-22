# Module 4 : Administration à distance

*Cours : [Cours 9 - Les services réseau en environnement Linux](../index.md)*

## 🎯 Objectif du module

Ce module présente l'administration à distance sous Linux via **SSH** : le protocole lui-même et les clients disponibles selon le système d'exploitation, le transfert de fichiers sécurisé (`scp`), et enfin la mise en place de l'**authentification par clés SSH** — y compris le cas particulier de la connexion en `root`.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Protocoles et clients

### 1.1 Le protocole SSH

**SSH** (*Secure Shell*) est le protocole par défaut sous Linux pour se connecter à distance à une machine. Son objectif est d'établir une **connexion sécurisée** entre un client et un serveur : le tunnel créé est **chiffré**, ce qui permet aussi bien de se connecter à distance que de transférer des fichiers entre client et serveur (dans les deux sens).

```text
Client ---- SSH SSH SSH SSH SSH (support réseau) ----> Serveur
                  ^
           protocole utilisé
```

### 1.2 Serveur et clients SSH

Le **serveur SSH** s'installe sur les machines Linux via le paquet `openssh-server`.

| Système client | Client SSH disponible |
|---|---|
| **Linux / macOS** | `openssh-client`, installé par défaut → fournit la commande `ssh` |
| **Windows Server** (versions récentes) | Commande `ssh` disponible nativement |
| **Windows** (autres versions) | Outils tiers nécessaires : **PuTTY**, **mRemoteNG**, **MobaXterm** |

Détail des outils Windows :

| Outil | Caractéristiques |
|---|---|
| **PuTTY** | Outil basique, simple, pour se connecter en SSH à une machine distante |
| **mRemoteNG** | Multifenêtre, multiprotocoles — gère le SSH et d'autres protocoles de connexion |
| **MobaXterm** | Multi-onglets, multiprotocoles — permet de gérer plusieurs serveurs depuis une seule application |

---

## 2. Transfert de fichiers

### 2.1 La commande `scp`

Au-delà de la connexion à distance, SSH permet également de **transférer des fichiers** entre machine cliente et serveur, ou entre deux serveurs, via la commande `scp` (*SSH + cp*), intégrée aux outils clients SSH.

- Sous **Linux**, `scp` est directement disponible.
- Sous **Windows**, deux possibilités :
  - **WinSCP** en complément de PuTTY (qui ne gère pas le `scp` nativement), pour une interface graphique de transfert ;
  - **MobaXterm**, qui intègre directement une interface de transfert de fichiers.

L'avantage du `scp` est qu'il transite par le tunnel chiffré SSH entre client et serveur.

```text
[Client SSH] <----SSH SSH SSH (Réseau) SSH SSH----> [Serveur SSH]
   /tmp                                          /etc/eniconf.cfg
```

Récupérer un fichier du serveur vers le client :

```bash
scp user@ip:/etc/eniconf.cfg /tmp
```

Copier un fichier du client vers le serveur (sens inverse) :

```bash
scp /tmp/eniconf.cfg user@ip:/répertoire/cible
```

---

## 3. Accès par clés SSH

### 3.1 Pourquoi utiliser des clés SSH ?

En configuration standard, la connexion SSH se fait par identifiant + mot de passe. Cette approche devient contraignante lorsque :

- on se connecte régulièrement aux mêmes machines ;
- on doit automatiser des transferts de fichiers entre serveurs.

⚠️ Par ailleurs, la connexion directe en SSH avec l'utilisateur **root** via login/mot de passe est **désactivée par défaut** dans la configuration du serveur SSH, pour des raisons de sécurité.

Les **clés SSH** répondent à ces deux besoins : connexion facilitée (sans ressaisir le mot de passe) et automatisation des transferts (`scp`, ou `rsync` pour synchroniser des répertoires).

### 3.2 Génération d'une paire de clés

SSH repose sur un algorithme de **chiffrement asymétrique** : une paire de clés est générée, composée d'une **clé privée** (conservée sur la machine cliente) et d'une **clé publique** (transférée sur les serveurs).

Plusieurs algorithmes existent : **RSA**, **DSA**, **ECDSA** — RSA étant le plus utilisé (et celui illustré ci-dessous).

Générer une paire de clés avec `ssh-keygen` :

```bash
ssh-keygen
```

Exemple de déroulement :

```text
fred@cli-debian:~$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/fred/.ssh/id_rsa):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/fred/.ssh/id_rsa.
Your public key has been saved in /home/fred/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:HZrJ3cZaWa4nrmvHqve4oLVVUgfxcPauRZyBbAA8ip8 fred@cli-debian
```

Sans indication de nom, la paire de clés est stockée dans `~/.ssh/` :

| Fichier | Rôle |
|---|---|
| `id_rsa` | Clé **privée** |
| `id_rsa.pub` | Clé **publique** |

### 3.3 Faut-il protéger la clé par une passphrase ?

Cela dépend du contexte d'usage :

| Contexte | Recommandation |
|---|---|
| Accès sécurisé classique entre un client et un serveur | Mettre une **passphrase** sur la clé (souvent mémorisée côté client, donc pas resaisie à chaque connexion) |
| Synchronisation/transfert **automatique** entre machines (`scp`, `rsync`...) | **Pas de passphrase**, afin que le processus s'exécute sans intervention manuelle |

📌 Il est possible de créer plusieurs paires de clés et d'utiliser la clé adaptée selon le processus (connexion interactive vs automatisation).

### 3.4 Copier la clé publique sur le serveur

Une fois la clé créée, la **clé publique** doit être copiée sur la machine de destination. La commande `ssh-copy-id` facilite cette opération :

```bash
ssh-copy-id admin@192.168.6.66
```

Exemple de déroulement :

```text
fred@cli-debian:~$ ssh-copy-id admin@192.168.6.66
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/admin/.ssh/id_rsa.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
fred@192.168.6.66's password:

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'admin@192.168.6.66'"
and check to make sure that only the key(s) you wanted were added.
```

Le mot de passe de l'utilisateur distant (ici `admin`) doit être saisi une dernière fois pour autoriser la copie. Le contenu de la clé publique est alors ajouté dans le fichier `~/.ssh/authorized_keys` de l'utilisateur cible (répertoire créé automatiquement s'il n'existe pas).

📌 Le fichier `authorized_keys` peut contenir plusieurs lignes : une par clé publique autorisée, pour un ou plusieurs utilisateurs distants.

### 3.5 Cas particulier : connexion en `root` par clé SSH

Bien que la connexion `root` par login/mot de passe soit interdite en SSH, la connexion **par clé SSH** reste possible pour `root` — c'est même l'unique méthode d'accès direct autorisée pour cet utilisateur. Procédure :

```bash
mkdir /root/.ssh
chmod 700 /root/.ssh
cp /home/admin/.ssh/authorized_keys /root/.ssh/
```

⚠️ SSH impose des permissions strictes sur le répertoire `.ssh` : celui-ci doit impérativement être en `700` (accès restreint au seul propriétaire), sous peine de refus de connexion par clé.

Une fois le fichier `authorized_keys` copié dans `/root/.ssh/`, la connexion en `root` depuis le client devient possible via la clé SSH précédemment créée — et uniquement de cette façon.

## ✅ Points clés à retenir

- SSH est le protocole standard de connexion à distance sous Linux (serveur : `openssh-server`) ; côté client, `ssh` est natif sous Linux/macOS, tandis que Windows nécessite PuTTY, mRemoteNG ou MobaXterm (sauf versions récentes de Windows Server).
- La commande `scp` (SSH + cp) permet de transférer des fichiers dans le tunnel chiffré SSH, dans les deux sens (client → serveur ou serveur → client) ; sous Windows, WinSCP ou MobaXterm apportent une interface graphique.
- Les clés SSH (paire clé privée/clé publique, généralement RSA, générée avec `ssh-keygen`) facilitent la connexion et permettent l'automatisation des transferts ; la passphrase se justifie pour un usage interactif sécurisé, mais doit être omise pour une synchronisation automatique.
- `ssh-copy-id` simplifie la copie de la clé publique vers le serveur, qui l'ajoute dans `~/.ssh/authorized_keys` de l'utilisateur cible.
- La connexion `root` par login/mot de passe est désactivée par défaut en SSH ; seule une connexion par clé SSH (avec le répertoire `/root/.ssh` en permissions `700`) permet de s'y connecter directement.


## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-4-administration-a-distance"></div>

<script type="application/json" id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-4-administration-a-distance-data">
[
  {
    "question": "Quel est le protocole par défaut sous Linux pour se connecter à distance à une machine ?",
    "options": ["SSH", "Telnet", "FTP", "RDP"],
    "correctIndex": 0,
    "explanation": "Le module précise que SSH est le protocole par défaut sous Linux pour se connecter à distance à une machine, en établissant un tunnel chiffré entre le client et le serveur."
  },
  {
    "question": "Quel est l'objectif principal du protocole SSH selon le module ?",
    "options": ["Résoudre des noms de domaine en adresses IP", "Mettre en place une connexion sécurisée et chiffrée entre un client et un serveur", "Attribuer automatiquement des adresses IP aux clients", "Synchroniser l'horloge système entre plusieurs machines"],
    "correctIndex": 1,
    "explanation": "L'objectif du protocole SSH est de mettre en place une connexion sécurisée entre un client et un serveur, via un tunnel chiffré permettant de se connecter à distance ou de transférer des fichiers."
  },
  {
    "question": "Quel paquet est installé côté serveur sur les machines Linux pour proposer un service SSH ?",
    "options": ["openssh-client", "ssh-daemon", "openssh-server", "sshd-core"],
    "correctIndex": 2,
    "explanation": "Le module indique que le serveur SSH s'installe via le paquet openssh-server sur les machines Linux destinées à accepter des connexions distantes."
  },
  {
    "question": "Sur une machine Linux ou macOS, quel client SSH fournit la commande ssh par défaut ?",
    "options": ["PuTTY", "MobaXterm", "WinSCP", "openssh-client"],
    "correctIndex": 3,
    "explanation": "Sur Linux ou macOS, le client openssh-client est installé par défaut et fournit la commande ssh permettant de se connecter à un serveur distant."
  },
  {
    "question": "Parmi les outils suivants, lequel est décrit comme multi-onglets et multiprotocoles, permettant de gérer plusieurs serveurs depuis la même application sous Windows ?",
    "options": ["MobaXterm", "PuTTY", "openssh-client", "ssh-keygen"],
    "correctIndex": 0,
    "explanation": "MobaXterm est présenté comme un outil multi-onglets et multiprotocoles permettant de gérer plusieurs serveurs distants depuis une seule application Windows."
  },
  {
    "question": "Quelle commande, intégrée aux outils clients SSH, permet de transférer des fichiers entre une machine cliente et un serveur en passant par le tunnel SSH ?",
    "options": ["rsync uniquement", "scp", "ftp", "curl"],
    "correctIndex": 1,
    "explanation": "La commande scp (SSH + cp) permet de copier des fichiers entre deux machines en passant par le protocole SSH, donc via un tunnel chiffré."
  },
  {
    "question": "Sous Windows, si l'on utilise PuTTY comme client SSH mais que l'on souhaite aussi transférer des fichiers en SCP avec une interface graphique, quel logiciel complémentaire le module recommande-t-il ?",
    "options": ["FileZilla", "Cyberduck", "WinSCP", "Termius"],
    "correctIndex": 2,
    "explanation": "Le module précise que PuTTY seul ne permet pas de faire du scp : il faut ajouter WinSCP, qui offre une interface graphique pour le transfert de fichiers entre un client Windows et un serveur Linux."
  },
  {
    "question": "Dans la commande \"scp user@ip:/etc/eniconf.cfg /tmp\", que se passe-t-il concrètement ?",
    "options": ["Le fichier local /tmp est envoyé vers le serveur distant à l'emplacement /etc/eniconf.cfg", "Une connexion SSH interactive est ouverte vers le serveur distant", "Le répertoire /etc complet du serveur est synchronisé avec /tmp", "Le fichier /etc/eniconf.cfg présent sur le serveur distant est rapatrié dans le répertoire local /tmp"],
    "correctIndex": 3,
    "explanation": "Cette syntaxe scp va chercher le fichier /etc/eniconf.cfg sur le serveur distant (identifié par user@ip) et le rapatrie dans le répertoire /tmp de la machine locale."
  },
  {
    "question": "Pourquoi la mise en place de clés SSH est-elle utile au quotidien, d'après le module ?",
    "options": ["Pour faciliter la connexion régulière aux mêmes machines et automatiser les transferts de fichiers sans ressaisir un mot de passe", "Pour remplacer complètement le protocole SSH par un protocole plus rapide", "Pour chiffrer les données stockées sur le disque dur du serveur", "Pour permettre la connexion à distance sans utiliser le port 22"],
    "correctIndex": 0,
    "explanation": "Les clés SSH évitent d'avoir à ressaisir un login/mot de passe à chaque connexion sur des machines fréquemment utilisées, et facilitent l'automatisation des transferts de fichiers, par exemple avec scp ou rsync."
  },
  {
    "question": "Par défaut, la configuration standard du serveur SSH autorise-t-elle la connexion directe avec l'utilisateur root via login et mot de passe ?",
    "options": ["Oui, c'est même le mode de connexion recommandé", "Non, cette connexion est désactivée par défaut dans la configuration du serveur SSH", "Oui, mais uniquement depuis le réseau local", "Non, root ne peut jamais se connecter en SSH, quelle que soit la méthode"],
    "correctIndex": 1,
    "explanation": "Le module indique que la connexion SSH directe avec l'utilisateur root via login/mot de passe est désactivée par défaut dans la configuration du serveur, pour des raisons de sécurité."
  },
  {
    "question": "Quel est l'algorithme de création de clés SSH le plus utilisé, d'après le module, parmi RSA, DSA et ECDSA ?",
    "options": ["DSA", "ECDSA", "RSA", "Les trois sont utilisés à parts égales"],
    "correctIndex": 2,
    "explanation": "Le module précise que même s'il existe plusieurs algorithmes de création de clés (RSA, DSA, ECDSA), le RSA reste le plus utilisé et sert de base aux exemples présentés."
  },
  {
    "question": "Dans une paire de clés SSH générée avec ssh-keygen, où doit rester la clé privée ?",
    "options": ["Sur le serveur uniquement", "Sur le client et le serveur à la fois", "Elle doit être supprimée après la génération", "Sur la machine cliente uniquement"],
    "correctIndex": 3,
    "explanation": "SSH repose sur un algorithme de chiffrement asymétrique : la clé privée doit rester sur la machine cliente, tandis que la clé publique est transférée vers les serveurs auxquels on souhaite se connecter."
  },
  {
    "question": "Sans préciser de nom particulier, quel est le nom par défaut donné au fichier contenant la clé privée générée par ssh-keygen ?",
    "options": ["id_rsa", "id_rsa.pub", "authorized_keys", "known_hosts"],
    "correctIndex": 0,
    "explanation": "Si aucun nom n'est précisé lors de la génération avec ssh-keygen, la clé privée est enregistrée sous le nom id_rsa (et la clé publique correspondante sous id_rsa.pub) dans le sous-répertoire .ssh de l'utilisateur."
  },
  {
    "question": "Dans quel cas le module recommande-t-il de NE PAS mettre de mot de passe sur une clé SSH ?",
    "options": ["Pour un accès interactif classique d'un administrateur à un serveur", "Lorsqu'on met en place une synchronisation ou un transfert de fichiers automatique entre machines", "Pour la connexion initiale de tout nouvel utilisateur", "Il ne faut jamais mettre de mot de passe sur une clé SSH, quel que soit le contexte"],
    "correctIndex": 1,
    "explanation": "Pour un processus automatisé (synchronisation, transfert de fichiers via scp ou autre) qui doit s'exécuter sans intervention humaine, la clé SSH est créée sans mot de passe afin que le processus se déroule automatiquement."
  },
  {
    "question": "Quelle commande permet de copier facilement sa clé publique SSH vers une machine distante ?",
    "options": ["ssh-keygen", "scp-key", "ssh-copy-id", "ssh-add"],
    "correctIndex": 2,
    "explanation": "La commande ssh-copy-id (par exemple ssh-copy-id admin@192.168.6.66) permet de copier facilement la clé publique par défaut de la machine cliente vers une machine distante, pour un utilisateur donné."
  },
  {
    "question": "Une fois copiée sur la machine distante via ssh-copy-id, dans quel fichier la clé publique est-elle ajoutée ?",
    "options": ["id_rsa.pub", "known_hosts", "sshd_config", "authorized_keys"],
    "correctIndex": 3,
    "explanation": "Le contenu de la clé publique copiée est ajouté dans le fichier authorized_keys, situé dans le répertoire .ssh de l'utilisateur de destination sur la machine distante."
  },
  {
    "question": "Si plusieurs utilisateurs se connectent avec des clés SSH différentes vers une même machine serveur, que retrouve-t-on dans le fichier authorized_keys ?",
    "options": ["Autant de lignes que de clés SSH pour les différents utilisateurs autorisés", "Une seule ligne, la dernière clé copiée écrasant les précédentes", "Uniquement la clé de l'utilisateur root", "Le fichier reste vide tant qu'aucun mot de passe n'est défini"],
    "correctIndex": 0,
    "explanation": "Le fichier authorized_keys peut contenir plusieurs lignes : une par clé publique SSH autorisée, ce qui permet à différents utilisateurs de se connecter chacun avec leur propre clé."
  },
  {
    "question": "Bien que la connexion root par login/mot de passe soit désactivée, comment peut-on malgré tout se connecter en root à une machine distante en SSH ?",
    "options": ["En désactivant totalement l'authentification SSH", "En utilisant une clé SSH placée dans le répertoire .ssh de l'utilisateur root", "En se connectant d'abord en tant qu'utilisateur standard puis en tapant su sans mot de passe", "Ce n'est jamais possible, quelle que soit la méthode utilisée"],
    "correctIndex": 1,
    "explanation": "Il reste possible de se connecter en root via une clé SSH placée dans le répertoire .ssh de l'utilisateur root de la machine distante, même si la connexion root par login/mot de passe est désactivée."
  },
  {
    "question": "Quels droits doit-on appliquer au répertoire .ssh (par exemple avec chmod 700 /root/.ssh) pour que SSH accepte de l'utiliser correctement ?",
    "options": ["777, accès complet pour tout le monde", "644, lecture pour tous et écriture pour le propriétaire", "700, accès restreint uniquement au propriétaire", "Aucune restriction n'est nécessaire sur ce répertoire"],
    "correctIndex": 2,
    "explanation": "Le module précise que SSH est très strict sur les droits d'accès : le répertoire .ssh doit impérativement être en 700, c'est-à-dire accessible uniquement par son propriétaire, sous peine de refus de connexion."
  },
  {
    "question": "Outre scp, quelle autre commande le module mentionne-t-il comme permettant de synchroniser des répertoires entre machines, notamment pour des transferts automatisés ?",
    "options": ["netstat", "traceroute", "iptables", "rsync"],
    "correctIndex": 3,
    "explanation": "Le module mentionne, en plus de scp, la commande de synchronisation de répertoires entre machines (rsync), particulièrement utile pour automatiser les transferts de fichiers via des clés SSH sans mot de passe."
  }
]
</script>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-4-administration-a-distance",
      dataId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-4-administration-a-distance-data",
    });
  });
</script>
