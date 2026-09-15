# Module 3 : Intéragire avec Windows 10

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module présente les moyens d'interagir avec Windows 10 : l'interface graphique (bureau, consoles MMC), la ligne de commande **CMD**, et **PowerShell** (présentation, aide, notion d'objets, cmdlets).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

_À compléter._

## ✅ Points clés à retenir

## 1. L'interface graphique (GUI)

Chaque utilisateur dispose d'un **profil** personnalisable (bureau, menu Démarrer). Windows 10 permet d'ajouter des **bureaux virtuels supplémentaires** pour agrandir son espace de travail, et propose la fonctionnalité **Timeline** (depuis la build 1803) : un historique des tâches récentes, accessible aussi pour créer de nouveaux bureaux.

### Multitâche

Windows 10 est **multitâche** : plusieurs applications tournent simultanément, et on bascule de l'une à l'autre via la **barre des tâches** ou le raccourci **Windows + Tabulation**. Le **gestionnaire des tâches** permet de vérifier le bon fonctionnement de chaque application.

### Zone de notification et zone de recherche

| Zone | Rôle |
|---|---|
| **Zone de notification** | Informations en temps réel, raccourcis vers des programmes en arrière-plan, état de la connexion réseau (pratique en mobilité) |
| **Zone de recherche** | Indexée, propose des suggestions automatiques — réflexe à prendre pour accéder rapidement à n'importe quel emplacement du système (ex. taper « panneau » pour ouvrir le panneau de configuration) |

### Panneau de configuration et consoles MMC

Le **panneau de configuration** s'appuie sur des fichiers **.cpl**, situés dans `Windows\System32`. L'interface **« Tous les paramètres »** tend progressivement à le remplacer, avec une approche plus moderne.

Les consoles **MMC** (*Microsoft Management Console*) sont des outils essentiels, bien que moins connus des utilisateurs classiques :

| Type de console | Accès |
|---|---|
| **Consoles préconfigurées** | Clic droit sur le menu Démarrer, ou fichiers **.msc** dans `Windows\System32` (ex. gestion des disques, gestionnaire de périphériques, console de gestion de l'ordinateur regroupant observateur d'événements + utilisateurs/groupes locaux) |
| **Console personnalisée** | Taper `MMC` dans la zone de recherche → console vierge → ajout de **composants logiciels enfichables** au choix (ex. gestion des disques, pare-feu local, utilisateurs/groupes) → sauvegarde via *Fichier → Enregistrer sous* |

---

## 2. La ligne de commande CMD

### Pourquoi utiliser la CLI ?

L'interface graphique a ses limites : certaines tâches ne peuvent être réalisées **que** via la ligne de commande.

### Les shells disponibles

| Shell | Nature |
|---|---|
| **cmd.exe** | Shell historique, héritier de MS-DOS |
| **PowerShell** | Shell moderne, orienté objet (voir section 3) |

`cmd.exe` propose des **commandes internes** (natives au shell) et peut aussi exécuter des **commandes externes** (programmes Windows). Il est également possible d'enregistrer une suite de commandes dans un fichier texte pour créer un **script**.

### Structure d'une commande

- Le **prompt** indique la position actuelle dans l'arborescence du système.
- Le **premier mot** tapé est toujours une **commande** — ne pas respecter cette règle génère une erreur.
- Commande et paramètres sont **toujours séparés par des espaces** (caractère délimiteur).
- Le résultat s'affiche par défaut à l'écran, mais peut être redirigé vers un fichier via le **chevron** (`>`).

```ps
echo Hello World
```

### La syntaxe de l'aide

Chaque commande nécessite une **syntaxe précise** — une syntaxe incorrecte génère une erreur, d'où l'importance de consulter l'aide.

| Symbole | Signification |
|---|---|
| Texte **sans** crochets/accolades | Paramètre **obligatoire** |
| Texte **entre crochets `[ ]` ou accolades `{ }`** | Paramètre **facultatif** |
| Barre verticale **`\|`** (pipe) | Sépare des choix possibles |
| Points de suspension **`...`** | L'élément précédent peut être **répété N fois** |

**Exemple avec la commande COPY** :
```ps
COPY source destination [/options]
```
`COPY`, `source` et `destination` sont **obligatoires** ; `/options` est **facultatif**. Les options (précédées d'un `/`, ex. `/A`, `/B`) ne peuvent **pas être cumulées** entre elles dans cet exemple.

### En pratique

Lancer `cmd.exe` (ex. via la zone de recherche) ouvre une console personnalisable (police, taille, couleurs). Quelques commandes utiles :

```
cls              REM efface l'écran
notepad          REM lance une application externe (Bloc-notes)
timedate.cpl     REM ouvre un élément du panneau de configuration (date/heure)
help             REM liste toutes les commandes disponibles
help copy        REM affiche l'aide détaillée d'une commande précise
```

⚠️ Modifier la configuration du système nécessite des **privilèges d'administration** — il faut alors relancer `cmd.exe` **en tant qu'administrateur** (avec la confirmation UAC : *« Voulez-vous autoriser cette application à apporter des modifications à votre appareil ? »*).

---

## 3. Présentation de PowerShell

**PowerShell** est un interpréteur de commandes et un langage de script développé par Microsoft, **orienté objet**, s'appuyant sur les bibliothèques **.NET Framework**.

### Historique

Disponible nativement depuis **Windows Server 2008** (fin 2006), installable aussi sur Windows XP, Vista et Server 2003 sous certains prérequis. La version actuelle largement répandue est la **5.1**, stabilisée depuis plusieurs années.

### Accès à PowerShell

| Outil | Description |
|---|---|
| **Console PowerShell** | Native, disponible en version simple |
| **PowerShell ISE** (*Integrated Scripting Environment*) | Plus orientée scripting : volet script + console de test (F5 pour exécuter) |
| **Windows Terminal** | Outil tiers (Windows Store), personnalisable |
| **Visual Studio Code** | Alternative moderne à l'ISE |

Tous ces outils peuvent être lancés **en tant qu'administrateur** si une modification du système est nécessaire.

---

## 4. Utiliser la ligne de commande PowerShell

### Vérifier sa version

```ps
$PSVersionTable
```

Cette variable renvoie plusieurs informations, dont la **version de PowerShell** et sa valeur **PSCompatibleVersion** — essentielle pour la **rétrocompatibilité** : un script écrit en PowerShell 5.1 (Windows 10) peut ne pas fonctionner sur des systèmes plus anciens (Windows 7, Server 2012 R2...). Un point important dans un contexte professionnel avec un parc de machines hétérogène.

### La structure d'une cmdlet

Une **cmdlet** (commande PowerShell) suit toujours la structure **Verbe-Nom** :

| Verbe courant | Rôle |
|---|---|
| **Get** | Afficher / obtenir une information |
| **Set** | Modifier |
| **Remove** | Supprimer |
| **Add** | Ajouter |
| **New** | Créer |

```ps
Get-Alias          # liste les alias PowerShell
Get-Verb           # liste tous les verbes utilisables
```

📌 Les cmdlets **ne sont pas sensibles à la casse**.

### Les paramètres

Un paramètre est précédé d'un **tiret** ; certains fonctionnent seuls, d'autres nécessitent un **argument** :

```ps
Get-ChildItem -Path C:\users
```

### En pratique

En lançant PowerShell (ou l'ISE) et en tapant `$PSVersionTable`, on obtient la version installée (ex. 5.1). La touche **Tabulation** permet l'auto-complétion des commandes.

```ps
Get-Verb                          # liste des verbes disponibles
Get-Command                       # liste de toutes les commandes disponibles
Get-Command -CommandType cmdlet   # filtre : uniquement les cmdlets
```

📌 La colonne **« CommandType »** de `Get-Command` distingue 3 familles : **cmdlets**, **fonctions**, et **alias**.

---

## 5. L'aide de PowerShell

PowerShell propose une aide qui dépasse le simple usage des commandes : elle couvre aussi les **concepts fondamentaux** du langage — comme un manuel structuré en chapitres, consultable à la demande.

⚠️ **Depuis la version 3**, l'aide **n'est plus intégrée nativement** (contrairement aux versions 1 et 2) : elle doit être **téléchargée**. Seules les sections en **anglais** sont maintenues à jour.

### Mettre à jour l'aide

```ps
Update-Help
```
Nécessite des **privilèges d'administration** (modification du système) et un accès Internet (les sections d'aide sont téléchargées depuis les dépôts officiels Microsoft, ou un dépôt local/privé d'entreprise).

### Consulter l'aide

| Commande | Effet |
|---|---|
| `Get-Help` | Affichage complet |
| `Help` | Affichage page par page |
| `man` | Alias emprunté à Unix, même effet que `Help` |
| `Get-Help <commande>` | Aide détaillée sur une commande précise (ex. `Get-Help Disable-LocalUser`) |
| `man about_Variable` | Sections `about_*` : explications sur les concepts PowerShell (ici, les variables) |

### Options utiles de Get-Help

| Option | Effet |
|---|---|
| `-Examples` | Affiche des exemples d'utilisation concrets |
| `-ShowWindow` | Ouvre l'aide complète dans une fenêtre séparée, avec barre de recherche |
| `-Online` | Consulte la version la plus à jour, en ligne |

### En pratique — démonstration de mise à jour de l'aide

`Get-Help Update-Help` renvoie, en PowerShell 5.1 non mis à jour, le message *« get-help ne parvient pas à trouver les fichiers d'aide de cette applet de commandes »* — normal, l'aide n'a pas encore été téléchargée. Pour la mettre à jour : ouvrir une console **en tant qu'administrateur**, s'assurer d'un accès Internet (ex. brancher la VM sur le réseau **Bridge** plutôt que Hostonly), puis lancer `Update-Help` (peut prendre plusieurs minutes). Certaines erreurs peuvent survenir si des modules ne sont pas présents sur le système — à traiter comme de simples avertissements. Une fois à jour :

```ps
Get-Help Update-Help -Examples     # exemples d'utilisation
Update-Help -ShowWindow            # aide complète dans une fenêtre séparée
```

---

## 6. Les objets dans PowerShell

La notion d'**objet** n'est pas propre à PowerShell (on la retrouve en PHP, C#...). Un objet PowerShell est un élément du système qu'on peut manipuler ou configurer : un utilisateur, un fichier, une carte réseau...

Chaque objet possède :

| Notion | Définition | Analogie (« mon ballon ») |
|---|---|---|
| **Propriétés** | Ses caractéristiques | Forme (ovale/sphérique), dimensions, masse... |
| **Méthodes** | Les actions qu'on peut mener sur lui | Le lancer, le gonfler... |

**Exemples concrets (cmdlets réelles)** :
```ps
Get-Process                  # liste tous les processus en cours d'exécution
Get-Process -Name notepad    # détails sur un processus précis
```

### Interagir avec un objet (exemple pédagogique fictif)

Le cours illustre la logique d'interaction avec un objet fictif « mon ballon » (à ne pas prendre pour de vraies cmdlets, mais pour comprendre le principe) :

```ps
Get-MonBallon                              # affiche les propriétés majeures (pas toutes)
Get-MonBallon | Select-Object *            # affiche TOUTES les propriétés (l'étoile = tout)
Get-MonBallon | Select-Object diamètre, forme, couleur   # filtre sur des propriétés précises
```

**Trouver les bonnes commandes** :
```ps
Get-Command                    # liste exhaustive des commandes disponibles
Get-Command Get-*              # toutes les commandes commençant par "Get-"
Get-Command *printer*          # commandes liées aux imprimantes
Get-Command New-*User*         # commandes pour créer des utilisateurs
```

**Modifier un objet** :
```ps
Set-MonBallon -Name "basket" -Description "ballon de basket"     # modifier
New-MonBallon -Name "rugby" -Forme "ovale" -Couleur "blanc"       # créer
Remove-MonBallon -Name "football"                                 # supprimer
```

---

## 7. Démonstration complète — cas pratique

**Objectif** : vérifier que le service de **géolocalisation** est arrêté, puis récupérer le nom et le SID d'un utilisateur.

### Étape 1 — Trouver et vérifier le service

```ps
Get-Command *service*                                              # cmdlets liées aux services
Get-Service                                                         # affiche tous les services (status, name, displayname)
Help Get-Service                                                    # confirme le rôle de la cmdlet

Get-Service | Where-Object { $_.DisplayName -like "*géolocalisation*" }   # filtre le bon service
```

### Étape 2 — Arrêter le service

```ps
Get-Command *service*          # repérer une cmdlet de gestion (New/Restart/Stop...)
Help Stop-Service              # "stops one or more running services"
Stop-Service -DisplayName "géolocalisation"     # arrêt effectif (pas d'erreur = succès)
```

### Étape 3 — Récupérer les infos d'un utilisateur et les exporter

```ps
Get-Command *user*                                    # repérer Get-LocalUser
Get-LocalUser demo-user | Select-Object Name, SID      # afficher nom + SID

Get-LocalUser demo-user | Select-Object Name, SID | Out-File "C:\users\demo-user\identity.txt"   # exporter vers un fichier
```

📌 Cette démonstration illustre bien la méthode générale : **repérer la cmdlet** (`Get-Command`), **comprendre son usage** (`Help`), **filtrer le résultat** (`Where-Object`, `Select-Object`), puis **agir ou exporter** (`Stop-Service`, `Out-File`).

---
## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-3-interagire-avec-windows-10"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-3-interagire-avec-windows-10-data">
[
  {
    "question": "Depuis quelle mise à jour (build) de Windows 10 la fonctionnalité Timeline est-elle disponible ?",
    "options": ["La build 1803", "La build 1903", "La build 1809", "Dès la toute première version de Windows 10"],
    "correctIndex": 0,
    "explanation": "La fonctionnalité Timeline, qui propose un historique des tâches effectuées, est disponible depuis la build 1803 de Windows 10 (mise à jour d'avril 2018)."
  },
  {
    "question": "Quel raccourci clavier permet de basculer rapidement entre les applications ouvertes sous Windows 10 ?",
    "options": ["Ctrl + Alt + Suppr", "Windows + Tabulation", "Windows + R", "Alt + F4"],
    "correctIndex": 1,
    "explanation": "La combinaison Windows + Tabulation permet de basculer facilement d'une application à l'autre, en complément de la barre des tâches, sur un système d'exploitation multi-tâches comme Windows 10."
  },
  {
    "question": "Dans quel dossier système trouve-t-on les fichiers avec l'extension .cpl utilisés par le panneau de configuration ?",
    "options": ["Windows\\Temp", "Program Files\\Common Files", "Windows\\System32", "Users\\Public"],
    "correctIndex": 2,
    "explanation": "Les éléments du panneau de configuration sont lancés grâce à des fichiers portant l'extension .cpl, disponibles dans le dossier Windows System32."
  },
  {
    "question": "Que signifie l'acronyme MMC, utilisé pour les consoles de gestion sous Windows 10 ?",
    "options": ["Multiple Management Center", "Microsoft Monitoring Console", "Main Menu Configuration", "Microsoft Management Console"],
    "correctIndex": 3,
    "explanation": "MMC signifie Microsoft Management Console ; ces consoles regroupent des outils essentiels pour les techniciens, que l'on peut retrouver via des fichiers .msc ou créer sur mesure."
  },
  {
    "question": "Quels sont les deux principaux shells disponibles nativement dans Windows 10 ?",
    "options": ["cmd.exe et PowerShell", "Bash et Zsh", "PowerShell et Python", "cmd.exe et Bash"],
    "correctIndex": 0,
    "explanation": "Windows 10 propose principalement deux shells : cmd.exe, héritier historique de MS-DOS, et PowerShell, un interpréteur de commandes plus moderne et orienté objet."
  },
  {
    "question": "Dans la syntaxe d'aide d'une commande, que signifie un élément placé entre crochets [ ] ?",
    "options": ["Cet élément est obligatoire", "Cet élément est facultatif", "Cet élément doit être répété plusieurs fois", "Cet élément est une commande interne uniquement"],
    "correctIndex": 1,
    "explanation": "Tout texte qui n'est pas entre crochets ou accolades est obligatoire, tandis que ce qui se trouve entre crochets (ou accolades) est facultatif."
  },
  {
    "question": "Dans la syntaxe COPY source destination [/options], quels éléments sont obligatoires pour exécuter la commande ?",
    "options": ["Uniquement le mot COPY", "Uniquement les options", "COPY, la source et la destination", "COPY et les options, mais pas la destination"],
    "correctIndex": 2,
    "explanation": "Dans cette syntaxe, le mot COPY ainsi que la source et la destination sont des paramètres obligatoires ; les options, entre crochets, restent facultatives."
  },
  {
    "question": "Pourquoi doit-on lancer cmd.exe en tant qu'administrateur pour modifier la configuration du système ?",
    "options": ["Parce que cmd.exe ne fonctionne pas du tout sans droits administratifs", "Parce que PowerShell impose cette contrainte à cmd.exe", "Parce que les commandes internes nécessitent toujours une connexion Internet", "Parce qu'un simple utilisateur ne dispose pas des privilèges nécessaires, pour des raisons de sécurité et de fiabilité"],
    "correctIndex": 3,
    "explanation": "Pour des raisons de sécurité et de fiabilité, un simple utilisateur ne peut pas apporter de modifications au système ; il est donc nécessaire de lancer le shell avec des privilèges d'administration pour ce type d'opération."
  },
  {
    "question": "Sur quelle technologie PowerShell s'appuie-t-il, ce qui en fait un shell orienté objet ?",
    "options": ["Le .NET Framework", "Le noyau Linux", "Le protocole ICMP", "Le système de fichiers NTFS"],
    "correctIndex": 0,
    "explanation": "PowerShell s'appuie sur des bibliothèques .NET Framework, ce qui lui permet d'être orienté objet et de créer des scripts plus ou moins élaborés."
  },
  {
    "question": "Quelle est la structure typique d'une commandlet (cmdlet) PowerShell ?",
    "options": ["Un nom suivi d'un verbe, séparés par un point", "Un verbe suivi d'un nom, séparés par un tiret (par exemple Get-Service)", "Deux verbes séparés par une barre verticale", "Un nombre suivi d'une lettre"],
    "correctIndex": 1,
    "explanation": "Les commandlets PowerShell suivent une structure intuitive composée d'un verbe (comme Get, Set, Remove, Add, New) suivi d'un nom, séparés par un tiret."
  },
  {
    "question": "Quelle variable PowerShell permet d'afficher la version de PowerShell installée sur le poste, ainsi que des informations de compatibilité ?",
    "options": ["$PSHome", "$Error", "$PSVersionTable", "$Profile"],
    "correctIndex": 2,
    "explanation": "La variable $PSVersionTable fournit plusieurs informations, dont la version de PowerShell installée et la valeur PSCompatibleVersion, utile pour vérifier la rétrocompatibilité des scripts."
  },
  {
    "question": "Quelles sont les trois familles de commandes regroupées dans PowerShell, visibles dans la colonne « CommandType » de Get-Command ?",
    "options": ["Les cmdlets, les scripts et les modules", "Les fonctions, les variables et les objets", "Les alias, les services et les processus", "Les cmdlets, les fonctions et les alias"],
    "correctIndex": 3,
    "explanation": "La commande Get-Command révèle trois familles de commandes disponibles dans PowerShell : les cmdlets, les fonctions et les alias, classées dans la colonne « CommandType »."
  },
  {
    "question": "Quelle commande permet de mettre à jour les sections d'aide de PowerShell depuis les dépôts officiels de Microsoft ?",
    "options": ["Update-Help", "Get-Help", "Install-Module", "Set-ExecutionPolicy"],
    "correctIndex": 0,
    "explanation": "Update-Help télécharge les sections d'aide depuis Internet (dépôts officiels de Microsoft) ou depuis un dépôt local ; cette opération nécessite des privilèges d'administration."
  },
  {
    "question": "À partir de quelle version de PowerShell l'aide n'est-elle plus intégrée nativement et doit-elle être téléchargée manuellement ?",
    "options": ["À partir de la version 1", "À partir de la version 3", "Dès la toute première version", "Elle a toujours été intégrée nativement"],
    "correctIndex": 1,
    "explanation": "Avec les versions 1 et 2 de PowerShell, l'aide était intégrée nativement ; à partir de la version 3, Microsoft a changé d'approche et il est nécessaire de télécharger les sections d'aide pour disposer d'informations actualisées."
  },
  {
    "question": "Quelle option de la commande Get-Help permet d'afficher des exemples d'utilisation d'une commande spécifique ?",
    "options": ["-ShowWindow", "-Online", "-Examples", "-Verbose"],
    "correctIndex": 2,
    "explanation": "L'option -Examples de Get-Help affiche des exemples pertinents pour l'utilisation d'une commande spécifique, ce qui est utile lorsqu'on connaît déjà la commande mais qu'on a un doute sur sa syntaxe."
  },
  {
    "question": "Dans l'analogie PowerShell utilisant l'objet « ballon », à quoi correspondent des caractéristiques comme la forme, les dimensions ou la masse ?",
    "options": ["Aux méthodes de l'objet", "Aux cmdlets associées à l'objet", "Aux verbes disponibles pour l'objet", "Aux propriétés de l'objet"],
    "correctIndex": 3,
    "explanation": "Les caractéristiques d'un objet, comme sa forme, ses dimensions ou sa masse, correspondent à ses propriétés en PowerShell ; les actions que l'on peut mener sur cet objet, comme le lancer ou le gonfler, correspondent quant à elles à ses méthodes."
  },
  {
    "question": "Quelle cmdlet PowerShell permet d'afficher la liste des services de l'ordinateur local ou distant ?",
    "options": ["Get-Service", "Get-Process", "Get-LocalUser", "Get-Command"],
    "correctIndex": 0,
    "explanation": "La cmdlet Get-Service affiche les services de l'ordinateur local ou distant ; on peut ensuite filtrer son résultat, par exemple avec Where-Object, pour cibler un service précis."
  },
  {
    "question": "Quelle cmdlet permet d'arrêter un service en cours d'exécution sous PowerShell ?",
    "options": ["Remove-Service", "Stop-Service", "Disable-Service", "End-Process"],
    "correctIndex": 1,
    "explanation": "Stop-Service permet d'arrêter un ou plusieurs services en cours d'exécution, comme illustré par l'exemple d'arrêt du service de géolocalisation dans la démonstration."
  },
  {
    "question": "Dans une commande PowerShell utilisant le symbole |, que réalise-t-on ?",
    "options": ["On sépare deux commandes totalement indépendantes exécutées en parallèle", "On commente une ligne de code sans l'exécuter", "On transmet (pipe) le résultat d'une commande à une autre commande pour le traiter davantage", "On indique une valeur facultative dans la syntaxe d'aide"],
    "correctIndex": 2,
    "explanation": "Le symbole | (pipe) transmet le résultat d'une commande à la commande suivante, comme dans get-service | where-object {...}, qui filtre les services affichés selon une condition."
  },
  {
    "question": "Quelle cmdlet permet d'exporter un résultat PowerShell vers un fichier texte, comme dans l'exemple sauvegardant le nom et le SID d'un utilisateur ?",
    "options": ["Export-Csv", "Send-File", "Save-Content", "Out-File"],
    "correctIndex": 3,
    "explanation": "Out-File permet de rediriger le résultat d'une commande PowerShell vers un fichier, comme dans l'exemple get-localuser demo-user | select name, SID | out-file \"identity.txt\", qui enregistre les informations affichées dans un fichier texte."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-3-interagire-avec-windows-10",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-3-interagire-avec-windows-10-data",
    });
  });
</script>
