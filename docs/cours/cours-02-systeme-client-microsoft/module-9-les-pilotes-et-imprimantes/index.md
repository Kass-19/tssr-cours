# Module 9 : Les pilotes et imprimantes

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module couvre la gestion des pilotes sous Windows (détection du matériel, gestionnaire de périphériques, fichiers composant un pilote, magasin de pilotes) ainsi que la gestion des imprimantes : définitions précises du vocabulaire associé, configuration et partage d'une imprimante locale, et fonctionnement des imprimantes réseau avec le service spouleur.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Définir un pilote

### 1.1 Comment le matériel est-il pris en charge ?

Le matériel et les périphériques peuvent être pris en charge de deux façons :

| Mode | Description |
|---|---|
| **À chaud (Plug & Play)** | Détection immédiate, via un port USB ou une connectique sans fil |
| **Après redémarrage** | Périphérique interne connecté à un port **PCI** (*Peripheral Component Interconnect*) |

Selon les cas, le périphérique est utilisable automatiquement après branchement, ou doit être détecté/installé manuellement. Une fois pris en charge, il devient configurable via la console **Gestionnaire de périphériques**.

### 1.2 Le Gestionnaire de périphériques

Cette console affiche les périphériques pris en charge et non pris en charge, et permet de :
- mettre à jour un pilote ;
- désactiver ou désinstaller un périphérique ;
- éditer ses propriétés.

Depuis le menu **Propriétés** d'un périphérique, il est possible de vérifier la version du pilote, de **restaurer une version antérieure**, ou d'afficher des informations détaillées.

### 1.3 L'identifiant matériel (VEN_ / DEV_)

Dans les détails d'un périphérique figure son **numéro d'identification**, composé de :

| Partie | Signification |
|---|---|
| `VEN_` | Identifiant du **fabricant** (*vendor*) |
| `DEV_` | Identifiant du **matériel** chez ce fabricant (*device*) |

📌 Cet identifiant fonctionne un peu comme un numéro de série ou une adresse MAC. Il permet parfois de retrouver sur Internet le pilote d'un périphérique non pris en charge — un site comme **pcilookup.com** peut être utile pour sortir d'une situation bloquante.

---

## 2. Windows et les pilotes

### 2.1 Rôle d'un pilote

Un **pilote** (*driver*) agit comme un manuel d'utilisation du périphérique à destination de l'OS : il permet à Windows 10 d'utiliser le matériel dans les meilleures conditions. Les pilotes existent en versions **32 bits** et **64 bits**, selon l'architecture du système.

### 2.2 Pilotes signés

Microsoft privilégie aujourd'hui les **pilotes signés**, accompagnés d'un certificat de conformité garantissant la stabilité du système. Depuis leur généralisation, les écrans bleus (BSOD) sont devenus plus rares — la majorité d'entre eux étant historiquement causés par des pilotes mal conçus ou des périphériques défaillants.

### 2.3 Les fichiers composant un pilote

| Extension | Rôle |
|---|---|
| `.inf` | Définition du pilote, au format texte |
| `.sys` | Le pilote lui-même, compilé et directement utilisable par le système |
| `.cat` | Certificat fourni par Microsoft ou un tiers de confiance |
| `.exe` / `.dll` / `.xml`... | Fichiers complémentaires selon les besoins |

L'installation peut se faire directement par **clic droit → Installer** sur le fichier `.inf`, ou via l'assistant d'installation (`setup.exe`) fourni par le fabricant, qui installe également d'éventuels outils tiers de gestion du périphérique.

Une fois installé, le pilote est mémorisé par le système, ce qui permet :
- sa **prise en charge automatique** lors d'un prochain branchement/démarrage ;
- sa **réinstallation automatique** si besoin.

Emplacements des fichiers :

| Dossier | Contenu |
|---|---|
| `C:\Windows\inf` | Tous les fichiers `.inf` des périphériques |
| `C:\Windows\System32` ou `SysWOW64` | Les autres fichiers du pilote |

### 2.4 Le magasin de pilotes Windows

Le **magasin de pilotes** (*DriverStore*) est l'ensemble des pilotes disponibles dès l'installation du système — aussi appelés **pilotes génériques**. Leur nombre varie selon la version de Windows et les mises à jour Windows Update appliquées.

| Avantage | Limite |
|---|---|
| Permet au système de faire fonctionner un périphérique automatiquement, sans pilote du fabricant — utile quand ce dernier n'est pas disponible en ligne | Seules les fonctionnalités **de base** du périphérique sont utilisables, pas l'ensemble de ses capacités |

Le magasin stocke les pilotes dans :

```text
C:\Windows\System32\DriverStore
```

### 2.5 Commandes de gestion des pilotes

| Commande | Rôle |
|---|---|
| `pnputil` | Gère le magasin de pilotes (ajout, suppression, listing) |
| `msinfo32` | Affiche une fenêtre graphique avec des informations détaillées sur le matériel, les périphériques et le système |
| `driverquery` | Affiche des informations sur les pilotes installés |

```cmd
pnputil
msinfo32
driverquery
```

---

## 3. Windows et les imprimantes

### 3.1 Vocabulaire à bien distinguer

| Terme | Définition |
|---|---|
| **Périphérique d'impression** | Le matériel, le moteur physique qui sort la feuille imprimée |
| **Imprimante** | La partie **logicielle** : elle envoie l'ordre d'impression au périphérique d'impression (regroupe le pilote, la configuration, la file d'attente, le port d'impression) |
| **File d'attente d'impression** (service **spouleur**) | Convertit le document (texte/image) en langage brut électronique interprétable par le périphérique d'impression, et traite les travaux un par un vers le port d'impression |
| **Imprimante locale** | Périphérique d'impression relié directement à l'ordinateur (ex. port USB) |
| **Imprimante partagée** | Imprimante locale rendue accessible sur le réseau via l'OS de l'ordinateur qui l'héberge — nécessite que cet ordinateur soit **allumé** |
| **Imprimante réseau** | Imprimante indépendante, possédant son propre OS, une interface réseau et un service web de configuration |

⚠️ Dans le langage courant, le terme « imprimante » est souvent employé à tort pour désigner le périphérique d'impression lui-même, alors qu'il désigne en réalité la couche logicielle qui le pilote.

---

## 4. Les imprimantes : utilisation et configuration

### 4.1 Reconnaissance et pilotes

Une imprimante locale peut être reconnue directement par le système si un pilote générique est disponible dans le magasin de pilotes. Il reste possible d'installer le pilote signé du constructeur pour bénéficier de l'ensemble des fonctionnalités du périphérique, ce que le pilote générique ne permet pas toujours.

### 4.2 Sécurité NTFS sur une imprimante

Une imprimante dispose de ses propres paramètres de sécurité NTFS, permettant d'autoriser ou de refuser certaines actions :

| Action | Description |
|---|---|
| **Impression** | Simple envoi de travaux d'impression |
| **Gestion des documents** | Gérer la file d'attente (suppression de travaux, etc.) |
| **Gestion de l'imprimante** | Déléguer le contrôle complet de l'imprimante, y compris à un utilisateur non technicien/administrateur |

### 4.3 Gestion depuis le panneau de configuration

Depuis le panneau de configuration, il est possible de :
- visualiser la **file d'attente** d'impression ;
- choisir une **imprimante par défaut** ;
- éditer les **propriétés** (nom, emplacement physique — utile pour intervenir physiquement sur un grand site géographique) ;
- configurer des **options avancées**, comme des plages horaires d'utilisation.

### 4.4 Partager une imprimante

Le partage s'effectue depuis l'onglet **Partage** des propriétés de l'imprimante. Elle devient alors accessible via le réseau — à condition que l'ordinateur qui l'héberge soit allumé et disponible.

L'accès à une imprimante partagée se fait, comme pour tout partage, via son **chemin UNC**.

---

## 5. Les imprimantes et le réseau

### 5.1 Le serveur d'impression

En environnement professionnel, les imprimantes sont généralement raccordées au réseau de l'entreprise, avec un **serveur d'impression** qui centralise :
- les partages ;
- les journaux (logs) ;
- les informations d'utilisation (toners, bacs de feuilles).

Cela simplifie l'accès et la maintenance de l'ensemble des imprimantes réseau.

### 5.2 Accès depuis un poste client

L'accès à une imprimante via un serveur d'impression se fait, comme tout partage réseau, via son **chemin UNC** : le serveur propose la liste des imprimantes de l'entreprise, et un clic droit → Connecter suffit à lier l'imprimante au poste local. Le spouleur enverra ensuite les travaux d'impression vers le port d'impression, qui correspond ici à la carte réseau.

### 5.3 Le service spouleur et le pool d'impression

Le **spouleur** (service central de l'impression) traite la file d'attente et envoie les travaux un par un vers le périphérique d'impression.

Lorsqu'une imprimante est très sollicitée (file d'attente chargée), il est possible de créer un **pool d'impression** : il relie une seule imprimante (logique) à **plusieurs périphériques d'impression** physiques. Le spouleur répartit alors les travaux entre tous les périphériques disponibles du pool, divisant d'autant le temps de traitement global de la file d'attente.

## ✅ Points clés à retenir

- Le matériel est pris en charge à chaud (Plug & Play) ou après redémarrage (périphériques PCI), et se gère via le Gestionnaire de périphériques (mise à jour, restauration de version, désinstallation).
- Un pilote (32/64 bits, idéalement signé pour la stabilité du système) est composé des fichiers `.inf` (définition), `.sys` (pilote compilé), `.cat` (certificat) et de fichiers complémentaires ; les identifiants `VEN_`/`DEV_` permettent de retrouver un pilote manquant.
- Le magasin de pilotes (`C:\Windows\System32\DriverStore`, géré par `pnputil`) fournit des pilotes génériques pré-installés, fonctionnels mais limités aux fonctionnalités de base.
- Une « imprimante » est en réalité la couche logicielle (pilote + file d'attente/spouleur + port), distincte du « périphérique d'impression » (le matériel) ; une imprimante peut être locale, partagée (nécessite que l'hôte soit allumé) ou réseau (autonome, avec sa propre interface).
- Une imprimante dispose de ses propres droits NTFS (impression / gestion des documents / gestion de l'imprimante) et se configure, se partage (chemin UNC) et se gère depuis le panneau de configuration.
- En entreprise, un serveur d'impression centralise les imprimantes réseau (partages, logs, consommables) ; le service spouleur traite la file d'attente, et un pool d'impression permet de répartir les travaux entre plusieurs périphériques physiques pour accélérer le traitement.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-9-les-pilotes-et-imprimantes"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-9-les-pilotes-et-imprimantes-data">
[
  {
    "question": "Comment un périphérique branché sur un port USB est-il généralement pris en charge par le système ?",
    "options": ["À chaud, en tant que périphérique plug & play", "Uniquement après un redémarrage complet du système", "Uniquement via une installation manuelle obligatoire", "Il n'est jamais reconnu sans pilote tiers"],
    "correctIndex": 0,
    "explanation": "Un périphérique connecté via USB ou une connectique sans fil est généralement pris en charge à chaud, ce qu'on appelle un périphérique plug & play, contrairement à un périphérique interne sur port PCI qui nécessite souvent un redémarrage pour être reconnu."
  },
  {
    "question": "Quelle console Windows permet de visualiser les périphériques pris en charge et non pris en charge, de mettre à jour ou désinstaller un pilote ?",
    "options": ["Le gestionnaire des tâches", "Le gestionnaire de périphériques", "Le panneau de configuration des imprimantes", "L'observateur d'événements"],
    "correctIndex": 1,
    "explanation": "Le gestionnaire de périphériques permet de visualiser les périphériques pris en charge et non pris en charge, de mettre à jour, désactiver, désinstaller un pilote ou d'éditer ses propriétés."
  },
  {
    "question": "Dans l'identifiant d'un périphérique affiché dans ses propriétés détaillées, à quoi correspondent les parties VEN_ et DEV_ ?",
    "options": ["VEN_ identifie la version du pilote, DEV_ la date d'installation", "VEN_ et DEV_ désignent tous les deux le même numéro de série", "VEN_ identifie le fabricant, DEV_ identifie le matériel chez ce fabricant", "VEN_ est l'adresse IP du périphérique, DEV_ son adresse MAC"],
    "correctIndex": 2,
    "explanation": "L'identifiant d'un périphérique est composé d'un identifiant de fabricant (VEN_, pour vendor) et d'un identifiant du matériel chez ce fabricant (DEV_, pour device), un peu comme un numéro de série."
  },
  {
    "question": "À quoi peut servir un site comme pcilookup.com dans le contexte de la gestion des pilotes ?",
    "options": ["À télécharger directement n'importe quel pilote signé par Microsoft", "À vérifier la charge réseau du poste", "À générer automatiquement un certificat de conformité pour un pilote", "À retrouver, à partir des identifiants VEN_/DEV_, le pilote correspondant à un périphérique non pris en charge"],
    "correctIndex": 3,
    "explanation": "À l'aide des identifiants VEN_/DEV_ d'un périphérique, un site comme pcilookup.com peut aider à retrouver sur Internet le pilote correspondant à un périphérique non pris en charge ou non identifié."
  },
  {
    "question": "Pourquoi Microsoft privilégie-t-il aujourd'hui les pilotes signés ?",
    "options": ["Parce que le certificat de conformité associé garantit la stabilité du système et limite l'apparition des écrans bleus", "Parce qu'ils sont toujours gratuits, contrairement aux pilotes non signés", "Parce qu'ils s'installent automatiquement sans redémarrage", "Parce qu'ils ne nécessitent pas de fichier .inf"],
    "correctIndex": 0,
    "explanation": "Les pilotes signés sont accompagnés d'un certificat de conformité garantissant la stabilité du système ; depuis leur généralisation, les écrans bleus liés à des pilotes mal conçus ou défaillants sont devenus plus rares."
  },
  {
    "question": "Parmi les fichiers composant un pilote, lequel contient la définition du pilote au format texte ?",
    "options": [".sys", ".inf", ".cat", ".dll"],
    "correctIndex": 1,
    "explanation": "Le fichier .inf contient la définition du pilote au format texte, tandis que le fichier .sys est le pilote compilé directement utilisable par le système, et le fichier .cat le certificat fourni par Microsoft ou un tiers de confiance."
  },
  {
    "question": "Quel fichier d'un pilote correspond au certificat de conformité fourni par Microsoft ou un tiers de confiance ?",
    "options": [".inf", ".sys", ".cat", ".exe"],
    "correctIndex": 2,
    "explanation": "Le fichier .cat correspond au certificat de conformité fourni par Microsoft ou un tiers de confiance, attestant la signature du pilote."
  },
  {
    "question": "Dans quel dossier retrouve-t-on tous les fichiers .inf des pilotes installés sur un système Windows ?",
    "options": ["c:\\Windows\\system32\\DriverStore", "c:\\Windows\\system32\\drivers", "c:\\ProgramData\\drivers", "c:\\Windows\\inf"],
    "correctIndex": 3,
    "explanation": "Tous les fichiers .inf des pilotes des périphériques sont disponibles dans le dossier c:\\Windows\\inf, tandis que les autres fichiers associés se trouvent dans system32 ou SysWOW64."
  },
  {
    "question": "Qu'est-ce que le \"magasin de pilotes\" (DriverStore) de Windows ?",
    "options": ["Un ensemble de pilotes génériques disponibles dès l'installation du système, stockés dans c:\\Windows\\system32\\DriverStore", "Une boutique en ligne pour acheter des pilotes certifiés Microsoft", "Un service qui télécharge automatiquement tous les pilotes disponibles sur Internet", "Une sauvegarde cloud des pilotes installés par l'utilisateur"],
    "correctIndex": 0,
    "explanation": "Le magasin de pilotes (ou pilotes génériques) est un ensemble de pilotes disponibles dès l'installation du système, stocké dans c:\\Windows\\system32\\DriverStore, et qui permet au système de faire fonctionner un périphérique sans installer le pilote du fabricant."
  },
  {
    "question": "Quelle commande permet de gérer (lister, ajouter, supprimer) les pilotes présents dans le magasin de pilotes Windows ?",
    "options": ["msinfo32", "pnputil", "driverquery", "devcon"],
    "correctIndex": 1,
    "explanation": "La commande pnputil permet de gérer le magasin de pilotes Windows : lister, ajouter ou supprimer des pilotes."
  },
  {
    "question": "Quelle commande affiche une fenêtre graphique contenant des informations détaillées sur le matériel, les périphériques et le système ?",
    "options": ["pnputil", "driverquery", "msinfo32", "devmgmt.msc"],
    "correctIndex": 2,
    "explanation": "La commande msinfo32 permet d'afficher une fenêtre graphique regroupant de nombreuses informations détaillées sur le matériel, les périphériques et le système."
  },
  {
    "question": "Dans la terminologie précisée par le module, qu'est-ce qui correspond réellement à une \"imprimante\", par opposition au périphérique d'impression ?",
    "options": ["La feuille de papier imprimée elle-même", "Le câble USB ou réseau reliant l'ordinateur au matériel d'impression", "Le toner et le bac à feuilles du matériel", "La partie logicielle qui envoie l'ordre d'impression au périphérique d'impression (pilote, configuration, file d'attente, port)"],
    "correctIndex": 3,
    "explanation": "Le module précise qu'une imprimante est en réalité la partie logicielle (pilote, configuration, file d'attente, port d'impression) qui envoie l'ordre d'impression, par opposition au périphérique d'impression qui est le matériel produisant la feuille imprimée."
  },
  {
    "question": "Quel est le rôle du service spouleur (file d'attente d'impression) décrit dans le module ?",
    "options": ["Il convertit le document dans un langage brut électronique interprétable par le périphérique et traite les travaux un par un vers le port d'impression", "Il stocke physiquement les feuilles imprimées avant leur distribution", "Il gère uniquement les autorisations NTFS de l'imprimante", "Il remplace entièrement le pilote de l'imprimante"],
    "correctIndex": 0,
    "explanation": "Le spouleur convertit numériquement le document (texte ou image) en un langage brut électronique interprétable par le périphérique d'impression, puis traite les travaux d'impression un à un pour les envoyer vers le port d'impression."
  },
  {
    "question": "Quelle est la différence entre une imprimante locale et une imprimante partagée ?",
    "options": ["Il n'y a aucune différence, les deux termes désignent la même chose", "L'imprimante locale est reliée directement à l'ordinateur, l'imprimante partagée est cette même imprimante locale rendue accessible sur le réseau via l'OS", "L'imprimante partagée possède toujours son propre système d'exploitation", "L'imprimante locale ne peut jamais être utilisée par un seul utilisateur"],
    "correctIndex": 1,
    "explanation": "Une imprimante locale est un périphérique d'impression directement relié à l'ordinateur (par exemple en USB), tandis qu'une imprimante partagée est cette même imprimante locale rendue accessible sur le réseau grâce à l'OS de l'ordinateur, qui doit alors être allumé."
  },
  {
    "question": "Qu'est-ce qui caractérise une imprimante réseau, par opposition à une imprimante partagée ?",
    "options": ["Elle dépend obligatoirement d'un ordinateur allumé pour fonctionner", "Elle ne peut être utilisée que par un seul utilisateur à la fois", "Elle est indépendante, possède son propre OS, une interface réseau et un service web de configuration", "Elle ne peut pas être administrée à distance"],
    "correctIndex": 2,
    "explanation": "Une imprimante réseau est un périphérique indépendant, possédant son propre système d'exploitation, une interface réseau et un service web permettant sa configuration, contrairement à une imprimante partagée qui dépend d'un ordinateur allumé."
  },
  {
    "question": "Quels types d'autorisations NTFS peut-on configurer spécifiquement sur une imprimante ?",
    "options": ["Lecture, écriture et exécution uniquement", "Uniquement un accès en lecture ou en refus total", "Les imprimantes ne disposent d'aucun paramètre de sécurité NTFS", "Impression, gestion des documents (file d'attente) et gestion de l'imprimante"],
    "correctIndex": 3,
    "explanation": "Une imprimante possède ses propres paramètres de sécurité NTFS permettant d'autoriser ou de refuser : la simple impression, la gestion des documents (file d'attente, suppression, etc.) ou la gestion complète de l'imprimante."
  },
  {
    "question": "Comment un poste client accède-t-il généralement à une imprimante partagée ou à une imprimante centralisée sur un serveur d'impression ?",
    "options": ["Via son chemin UNC, comme pour tout autre partage réseau", "Uniquement en installant physiquement un câble USB vers chaque poste", "Via une adresse IP publique exclusivement", "Il n'est pas possible d'accéder à une imprimante partagée depuis un autre poste"],
    "correctIndex": 0,
    "explanation": "Comme pour tout autre partage réseau, on accède à une imprimante partagée ou centralisée sur un serveur d'impression via son chemin UNC."
  },
  {
    "question": "Quel est l'intérêt de centraliser la gestion des imprimantes réseau sur un serveur d'impression en entreprise ?",
    "options": ["Cela empêche totalement les pannes matérielles", "Cela permet de centraliser les partages, les journaux et les informations d'utilisation (toners, bacs), simplifiant l'accès et la maintenance", "Cela supprime le besoin d'un pilote pour chaque imprimante", "Cela réduit automatiquement la consommation électrique des imprimantes"],
    "correctIndex": 1,
    "explanation": "Un serveur d'impression permet de centraliser l'ensemble des partages, des journaux (logs) et des informations d'utilisation (toners, bacs de feuilles) des imprimantes réseau, ce qui simplifie leur accès et leur maintenance."
  },
  {
    "question": "Qu'est-ce qu'un pool d'impression, et dans quel but est-il mis en place ?",
    "options": ["Un groupe d'utilisateurs autorisés à imprimer sur une imprimante donnée", "Une sauvegarde automatique de tous les documents imprimés", "Une liaison entre une imprimante et plusieurs périphériques d'impression, permettant de répartir et d'accélérer le traitement d'une file d'attente très chargée", "Un espace disque réservé au stockage temporaire des fichiers à imprimer"],
    "correctIndex": 2,
    "explanation": "Un pool d'impression relie une imprimante à plusieurs périphériques d'impression : le spouleur peut alors répartir les travaux entre tous les périphériques disponibles, divisant ainsi le temps de traitement d'une file d'attente très sollicitée."
  },
  {
    "question": "Pourquoi peut-il être utile d'installer le pilote fourni par le constructeur plutôt que de se contenter du pilote générique du magasin de pilotes ?",
    "options": ["Le pilote générique empêche totalement le périphérique de fonctionner", "Le pilote générique n'est jamais signé et provoque systématiquement des écrans bleus", "Il n'y a jamais de différence fonctionnelle entre les deux", "Le pilote constructeur, signé, permet de bénéficier de l'ensemble des fonctionnalités du périphérique, ce qui n'est pas toujours le cas avec le pilote générique"],
    "correctIndex": 3,
    "explanation": "Le pilote générique du magasin de pilotes permet de faire fonctionner le périphérique avec ses fonctionnalités de base, mais seul le pilote signé du constructeur permet généralement de profiter de l'ensemble des fonctionnalités du périphérique."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-9-les-pilotes-et-imprimantes",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-9-les-pilotes-et-imprimantes-data",
    });
  });
</script>
