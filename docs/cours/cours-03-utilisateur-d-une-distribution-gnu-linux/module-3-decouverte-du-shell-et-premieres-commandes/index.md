# Module 3 : Découverte du shell et premières commandes

*Cours : [Cours 3 - Utilisateur d'une distribution GNU-Linux](../index.md)*

## 🎯 Objectif du module

Ce module approfondit la découverte du shell Bash (prompt, syntaxe des commandes, compte root), présente les premières commandes d'information système (identité, connexions, mot de passe, date/calendrier, localisation), introduit les variables (création, lecture, variables d'environnement), et enfin les outils qui simplifient l'usage de la ligne de commande (historique, autocomplétion, aide).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Premières commandes

### 1.1 Anatomie d'une fenêtre de shell

| Élément | Description |
|---|---|
| **Invite de commande** (*prompt*) | Terminée par `$` pour un utilisateur standard, ou `#` pour le compte **root** |
| **Zone de saisie** | Espace où l'utilisateur saisit commande, options et arguments |

Syntaxe générale d'une commande :

```text
commande [options] <Argument>
```

```bash
ls -l /home/user30
```

⚠️ L'espace entre commande, options et arguments est un **séparateur d'expression** : son usage doit être précis, il ne s'agit pas d'un simple espace littéral.

### 1.2 Le compte root

Sous Linux/Unix, **root** est le compte super-administrateur, aux accès privilégiés. Son prompt se termine par `#`, contre `$` pour un utilisateur standard.

⚠️ Bonnes pratiques :
- ne **pas** utiliser root pour les opérations courantes ;
- se connecter via un compte utilisateur standard, puis élever ses privilèges si nécessaire ;
- éviter toute connexion **directe** en root, en particulier en SSH — certaines distributions (ex. Debian) désactivent d'ailleurs cette connexion par défaut.

📌 L'élévation de privilèges sera approfondie dans un futur module consacré à l'administration Linux.

---

## 2. Un peu plus de commandes

### 2.1 Conventions typographiques du cours

| Élément | Couleur |
|---|---|
| Commandes | Vert-bleu |
| Options | Rouge foncé |
| Arguments | Orange |

📌 Les crochets `[ ]` et chevrons `< >` qui encadrent options/arguments dans la documentation indiquent des valeurs **optionnelles** et ne doivent **pas** être saisis littéralement dans la commande.

### 2.2 Identité de l'utilisateur

| Commande | Rôle | Exemple de sortie |
|---|---|---|
| `logname` | Nom de l'utilisateur connecté | `user30` |
| `id` | UID, GID et groupes de l'utilisateur courant | `uid=1060 gid=1060 groups=user30,any` |
| `id -u user5` | UID d'un autre utilisateur spécifié | `uid=1061` |

```bash
logname
id
id -u user5
```

### 2.3 Connexions utilisateurs

| Commande | Rôle |
|---|---|
| `who` | Liste les utilisateurs connectés |
| `who -H` | Affiche les en-têtes de colonnes |
| `who -q` | Affiche le nombre de connexions actives |

```bash
who
who -H
who -q
```

Exemple de sortie de `who` :

```text
user30 pts/0 2023-10-01 10:30
```

### 2.4 Gestion des mots de passe

La commande `passwd` permet de changer son mot de passe (demande le mot de passe actuel, puis le nouveau à deux reprises) :

```bash
passwd
```

```text
user30@deb~:$ passwd
Changement du mot de passe pour user30.
Current password:
Nouveau mot de passe :
Retapez le nouveau mot de passe :
passwd: password updated successfully
```

Avec l'option `-S`, consulter les informations du mot de passe actuel :

```bash
passwd -S
```

```text
user30@deb~:$ passwd -S
user30 P 06/26/2020 0 99999 7 -1
```

📌 Les autres options de `passwd` relèvent d'un futur cours sur l'administration Linux.

#### Exigences de complexité des mots de passe

- contenir au moins un **caractère spécial** ;
- ne pas être **trop similaire** au mot de passe précédent ;
- ne pas utiliser de **mots du dictionnaire**.

---

## 3. Démonstration — commandes d'information de l'utilisateur

Récapitulatif des commandes présentées en démonstration :

```bash
logname                  # nom de l'utilisateur connecté
id                        # UID, GID et groupes
id -u                     # UID uniquement
id -g                     # GID uniquement
id -G                     # groupes supplémentaires uniquement
who                       # utilisateurs connectés
w                         # utilisateurs connectés + détails (charge système, inactivité, commandes en cours, CPU)
w -u                      # informations supplémentaires
w -h                      # sans en-têtes de colonnes
uptime                    # durée de fonctionnement du système
passwd                    # changer de mot de passe
passwd -S                 # détails sur le mot de passe/compte
```

Exemple de sortie `id` :

```text
uid=1031(user01) gid=1031(user01) groupes=1031(user01),1002(ENI),1003(TASR)
```

📌 La commande `w` enrichit `who` avec : la charge système, le temps d'inactivité de l'utilisateur, les commandes en cours d'exécution (colonne WHAT), et le CPU consommé par les processus.

---

## 4. Un peu plus de commandes — date, calendrier, localisation

### 4.1 La commande `date`

```bash
date
```

```text
ven. 26 janvier 2025 14:20:30 UTC+2
```

📌 En tant que root, `date` permet aussi de **modifier** la date/heure système.

#### Formatage personnalisé de la sortie

```bash
date +"%A, %d %B %Y%nIl est %H:%M"
```

⚠️ Le signe `+` s'utilise une seule fois, en début de séquence ; les guillemets doubles permettent d'inclure des espaces sans qu'ils soient interprétés comme séparateurs d'expression.

Tableau des symboles de formatage :

| Option | Résultat |
|---|---|
| `%a` | Nom du jour abrégé |
| `%A` | Nom du jour complet |
| `%b` | Nom du mois abrégé |
| `%B` | Nom du mois complet |
| `%d` | Numéro du jour |
| `%D` | Date au format anglo-saxon (mm/dd/yy) |
| `%j` | Numéro du jour dans l'année |
| `%w` | Numéro du jour dans la semaine (0 = dimanche) |
| `%m` | Numéro du mois |
| `%y` | Année sur 2 chiffres |
| `%Y` | Année sur 4 chiffres |
| `%H` | Heure (0-23) |
| `%I` | Heure (0-12) |
| `%M` | Minutes |
| `%S` | Secondes |
| `%T` | Heure sous forme HH:MM:SS |
| `%n` | Saut de ligne |
| `%t` | Tabulation |

Exemples :

```bash
date +"%A %d %B %Y %H:%M"
# → Bonjour, nous sommes le mardi 18 mai 2021. Il est 13h54.

date +"%Y %m %d"
# → 2021 05 18
```

📌 Le format `date +"%Y %m %d"` est particulièrement utile pour l'**horodatage**, par exemple lors de l'écriture dans un fichier journal.

### 4.2 La commande `cal`

| Usage | Résultat |
|---|---|
| `cal` | Calendrier du mois courant (jour actuel en surbrillance) |
| `cal 03 2021` | Calendrier d'un mois précis |
| `cal 2021` | Calendrier de l'année entière |

```bash
cal
cal 03 2021
cal 2021
```

### 4.3 Se repérer : `tty` et `pwd`

| Commande | Rôle | Exemple |
|---|---|---|
| `tty` | Indique le terminal/pseudo-terminal utilisé | `/dev/tty1` (console) ou `/dev/pts/2` (SSH/graphique) |
| `pwd` (*Print Working Directory*) | Affiche le répertoire courant dans l'arborescence | `/home/user30` |

```bash
tty
pwd
```

📌 Un système Linux est **multi-utilisateur, multi-session** : une seconde session connectée apparaîtra par exemple en `/dev/pts/1`. Sur certaines distributions, l'emplacement courant est déjà visible dans le prompt (entre les deux-points et le `$`), le `~` étant le raccourci du répertoire personnel (*home*).

---

## 5. Découverte des variables

### 5.1 Principe

Une **variable** porte un nom et stocke une donnée en mémoire. Il faut distinguer :
- le **nom** de la variable (le « contenant ») ;
- son **contenu** (la « donnée »).

Créer une variable et lire son contenu (avec `$` devant le nom) :

```bash
var="contenu de la variable"
echo $var
```

```bash
prenom=Romain
echo $prenom
# prenom=Sophia modifie le contenu, le nom reste identique
```

Libérer une variable :

```bash
unset var
```

### 5.2 Les variables d'environnement

Les **variables d'environnement** sont générées par le système au démarrage, à l'ouverture d'une session ou au lancement d'un service. Par convention (choix humain, non technique), elles s'écrivent en **majuscules**.

| Commande | Rôle |
|---|---|
| `env` | Affiche les principales variables d'environnement |
| `set` | Affiche l'ensemble des variables d'environnement **et** des fonctions (très verbeux, utile avec un filtrage étudié plus loin dans le cours) |

```bash
env
set
```

Variables d'environnement utiles :

| Variable | Contenu |
|---|---|
| `$SHELL` | Chemin vers l'exécutable du shell utilisé |
| `$LOGNAME` | Nom de l'utilisateur connecté (fonctionnement proche de `$USERNAME`, différence liée à l'historique Unix/Linux) |
| `$HOME` | Chemin du répertoire personnel — raccourci utile (`$HOME` plus court que `/home/user30`), également accessible via `~` |
| `$LANG` | Langue et encodage de caractères utilisés |
| `$PATH` | Répertoires où le système recherche commandes et scripts exécutables (équivalent Windows : `%PATH%`) |
| `$PWD` | Répond de façon équivalente à la commande `pwd` |

---

## 6. Démonstration — utilisation des variables

⚠️ Les noms de variables sont **sensibles à la casse** : `echo $home` ne renvoie rien (la variable `$home` en minuscules n'existe pas), il faut utiliser `echo $HOME`.

```bash
echo $HOME
echo $LOGNAME
echo $PATH
```

Créer une variable personnalisée :

```bash
monNom="Mathieu"
echo $monNom
echo "Je m'appelle $monNom"
```

📌 Le `$` sert uniquement à **appeler** une variable déjà en mémoire ; lors de la création/modification (`monNom="Mathieu"`), on n'utilise **pas** le `$`.

Variables fréquemment consultées via `env` :

```text
$PATH        — chemins des exécutables
$LS_COLORS   — coloration syntaxique de ls
$LANG        — langue/encodage (ex. français de France, UTF-8)
$SHELL       — shell utilisé
$LOGNAME     — nom d'utilisateur
```

Supprimer une variable :

```bash
unset monNom
echo "Je m'appelle $monNom"
# → $monNom ne correspond plus à rien
```

---

## 7. Se simplifier l'utilisation de la ligne de commande

### 7.1 L'historique des commandes

| Fonctionnalité | Usage |
|---|---|
| `history` | Liste toutes les commandes précédemment exécutées |
| Flèches **haut/bas** | Naviguer dans l'historique |
| `!!` | Réexécute la **dernière** commande saisie |
| `!string` | Réexécute la dernière commande **commençant** par `string` |
| `!?commande` | Recherche la dernière commande **contenant** `commande` |
| `!n` | Réexécute la commande numéro `n` de l'historique |

```bash
history
!!
!73
```

📌 L'historique est stocké dans `~/.bash_history` (dans le répertoire personnel de chaque utilisateur) — géré via les variables `HISTFILE` et `HISTSIZE`. ⚠️ Attention à ne pas y laisser d'informations sensibles.

### 7.2 L'autocomplétion

La touche **Tab** complète automatiquement une commande, un chemin, ou un nom de variable.

| Usage | Comportement |
|---|---|
| `Tab` (une pression) | Complète si une seule possibilité existe |
| `Tab` `Tab` (deux pressions) | Affiche toutes les options possibles en cas d'ambiguïté |

```bash
cd /e[Tab]       # complète automatiquement si une seule option
$H[Tab]          # complète par exemple en $HOME
```

### 7.3 Obtenir de l'aide

| Méthode | Usage |
|---|---|
| `commande --help` | Aide contextuelle rapide (options disponibles) |
| `man commande` | Manuel détaillé de la commande |
| `help` (sous Bash) | Aide sur les commandes **intégrées** à Bash |

```bash
pwd --help
man passwd
```

📌 Le manuel (`man`) est souvent plus complet en **anglais**, les traductions étant parfois incomplètes :

```bash
LANG=C man passwd
```

#### Les 9 sections du manuel (`man`)

| Section | Contenu |
|---|---|
| 1 | Commandes utilisateurs |
| 2 | Appels système |
| 3 | Appels bibliothèque |
| 4 | Fichiers spéciaux |
| 5 | Fichiers de paramétrage |
| 6 | Jeux |
| 7 | Divers |
| 8 | Administration système |
| 9 | Interface du noyau |

Pour accéder à une section précise (ex. le fichier `/etc/passwd`, section 5, plutôt que la commande `passwd`, section 1) :

```bash
man -s 5 passwd
```

#### Navigation dans `man`

| Touche | Action |
|---|---|
| `/mot` | Rechercher « mot » (mise en surbrillance) |
| `n` | Occurrence suivante de la recherche |
| `q` | Quitter |

## ✅ Points clés à retenir

- Le prompt distingue utilisateur standard (`$`) et root (`#`) ; root ne doit jamais être utilisé pour les tâches courantes ni pour une connexion directe en SSH.
- Les commandes d'information utilisateur essentielles : `logname`, `id` (avec `-u`/`-g`/`-G`), `who`/`w` (connexions), `uptime` (durée de fonctionnement), `passwd`/`passwd -S` (mot de passe).
- `date` (avec formatage `+"%..."`) et `cal` donnent respectivement l'heure/date précise et le calendrier ; `tty` et `pwd` indiquent respectivement le terminal utilisé et la position dans l'arborescence.
- Une variable distingue son nom (contenant, sans `$` à la création) de son contenu (récupéré avec `$nom`) ; les variables d'environnement système (`$HOME`, `$PATH`, `$LOGNAME`, `$SHELL`, `$LANG`...) sont par convention en majuscules et sensibles à la casse ; `env`/`set` les listent, `unset` les supprime.
- Pour accélérer la saisie : `history` (+ `!!`, `!n`, `!string`) pour rappeler une commande passée, et `Tab` pour l'autocomplétion (double Tab pour lister les options).
- Pour obtenir de l'aide : `commande --help` (rapide), `man commande` (détaillé, en anglais via `LANG=C man` si besoin, organisé en 9 sections consultables avec `man -s N`), et `help` pour les commandes internes de Bash.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-3-decouverte-du-shell-et-premieres-commandes"></div>

<script type="application/json" id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-3-decouverte-du-shell-et-premieres-commandes-data">
[
  {
    "question": "Par quel caractère se termine généralement le prompt d'un utilisateur standard, par opposition au compte root ?",
    "options": ["Le caractère $", "Le caractère %", "Le caractère #", "Le caractère @"],
    "correctIndex": 0,
    "explanation": "Le prompt d'un utilisateur standard se termine généralement par le caractère $, tandis que celui du compte root se termine par le caractère #, ce qui permet de le reconnaître facilement."
  },
  {
    "question": "Pourquoi est-il fortement déconseillé de se connecter directement avec le compte root, en particulier en session SSH ?",
    "options": ["Parce que root ne peut pas exécuter de commandes en ligne de commande", "Pour des raisons de sécurité, et certaines distributions comme Debian désactivent même cette connexion par défaut", "Parce que le compte root n'existe pas sous Linux", "Parce que cela ralentit considérablement le système"],
    "correctIndex": 1,
    "explanation": "Pour des raisons de sécurité, il est déconseillé de se connecter directement en root, notamment en SSH ; certaines distributions comme Debian désactivent même cette possibilité par défaut, préférant une connexion via un compte utilisateur suivie d'une élévation de privilèges si nécessaire."
  },
  {
    "question": "Quelle commande permet d'obtenir uniquement le nom de l'utilisateur actuellement connecté ?",
    "options": ["who", "id", "logname", "env"],
    "correctIndex": 2,
    "explanation": "La commande logname permet d'obtenir simplement le nom de l'utilisateur actuellement connecté, par exemple user30."
  },
  {
    "question": "Quelle commande, utilisée avec l'option -u suivie d'un nom d'utilisateur, permet d'obtenir uniquement l'UID de cet utilisateur ?",
    "options": ["logname -u", "who -u", "passwd -u", "id -u"],
    "correctIndex": 3,
    "explanation": "La commande id -u, suivie éventuellement d'un nom d'utilisateur (comme id -u user5), permet d'obtenir uniquement l'UID (identifiant numérique) de l'utilisateur concerné."
  },
  {
    "question": "Quelles informations supplémentaires la commande w fournit-elle par rapport à la commande who ?",
    "options": ["La charge système, le temps d'inactivité des utilisateurs, les commandes en cours et le CPU consommé", "Uniquement la liste des fichiers ouverts par chaque utilisateur", "Le mot de passe actuel de chaque utilisateur connecté", "La date d'installation du système"],
    "correctIndex": 0,
    "explanation": "En complément de who, la commande w ajoute des informations telles que la charge système, le temps d'inactivité de l'utilisateur, les commandes actuellement en cours (WHAT) et le CPU consommé par les processus."
  },
  {
    "question": "Quelle commande permet de connaître depuis combien de temps le système fonctionne sans interruption ?",
    "options": ["tty", "uptime", "date", "cal"],
    "correctIndex": 1,
    "explanation": "La commande uptime indique depuis combien de temps le système fonctionne, sans avoir été redémarré."
  },
  {
    "question": "Quelle option de la commande passwd permet d'obtenir des informations détaillées sur l'état du mot de passe d'un compte, sans le modifier ?",
    "options": ["passwd -l", "passwd -d", "passwd -S", "passwd -i"],
    "correctIndex": 2,
    "explanation": "L'option -S de la commande passwd permet de vérifier et d'afficher des informations sur l'état actuel du mot de passe d'un compte, sans procéder à sa modification."
  },
  {
    "question": "Parmi les exigences de complexité des mots de passe mentionnées dans le module, laquelle est correcte ?",
    "options": ["Le mot de passe doit obligatoirement comporter uniquement des chiffres", "Le mot de passe doit être strictement identique au nom d'utilisateur", "Le mot de passe ne doit comporter aucune majuscule", "Le mot de passe doit contenir au moins un caractère spécial et ne pas être trop similaire au précédent"],
    "correctIndex": 3,
    "explanation": "Le module mentionne notamment qu'un bon mot de passe doit contenir au moins un caractère spécial, ne pas être trop similaire au précédent, et ne pas utiliser de mots du dictionnaire."
  },
  {
    "question": "Dans la commande date +\"%A, %d %B %Y%nIl est %H:%M\", quel symbole permet d'insérer un saut de ligne dans le résultat affiché ?",
    "options": ["%n", "%t", "%d", "%T"],
    "correctIndex": 0,
    "explanation": "Le symbole %n permet d'insérer un saut de ligne dans le formatage de la commande date, tandis que %t insère une tabulation."
  },
  {
    "question": "Dans le formatage de la commande date, quel symbole permet d'obtenir le nom complet du jour de la semaine ?",
    "options": ["%a", "%A", "%d", "%D"],
    "correctIndex": 1,
    "explanation": "Le symbole %A (majuscule) permet d'obtenir le nom complet du jour (par exemple \"mardi\"), tandis que %a donne la version abrégée du nom du jour."
  },
  {
    "question": "Que permet de faire la commande cal lorsqu'on l'utilise sans aucun argument ?",
    "options": ["Modifier la date système", "Afficher la liste des utilisateurs connectés", "Afficher le calendrier du mois en cours, avec le jour actuel en surbrillance", "Afficher l'historique des commandes exécutées"],
    "correctIndex": 2,
    "explanation": "Utilisée sans argument, la commande cal affiche le calendrier du mois en cours, avec le jour actuel mis en surbrillance."
  },
  {
    "question": "Que renseigne la commande tty lorsqu'elle est exécutée ?",
    "options": ["Le nom d'utilisateur actuellement connecté", "L'adresse IP de la machine", "La date et l'heure du système", "Le nom du terminal ou pseudo-terminal utilisé pour la session en cours"],
    "correctIndex": 3,
    "explanation": "La commande tty renseigne sur le type de terminal ou pseudo-terminal utilisé (par exemple /dev/tty1 en console directe, ou /dev/pts/2 en connexion SSH ou graphique)."
  },
  {
    "question": "Que signifie l'acronyme de la commande pwd, et à quoi sert-elle ?",
    "options": ["Print Working Directory, elle affiche le répertoire courant dans l'arborescence", "Password, elle sert à changer le mot de passe", "Print Weekly Data, elle affiche un résumé hebdomadaire d'activité", "Public Working Domain, elle affiche le domaine réseau courant"],
    "correctIndex": 0,
    "explanation": "pwd signifie Print Working Directory : elle affiche le chemin du répertoire courant dans lequel se trouve l'utilisateur."
  },
  {
    "question": "Dans l'exemple var=\"contenu de la variable\" suivi de echo $var, que récupère-t-on concrètement en exécutant echo $var ?",
    "options": ["Le nom de la variable, c'est-à-dire \"var\"", "Le contenu stocké dans la variable, c'est-à-dire \"contenu de la variable\"", "Une erreur, car $var n'existe pas tant qu'on ne l'a pas exportée", "Le type de données de la variable"],
    "correctIndex": 1,
    "explanation": "echo $var affiche le contenu stocké dans la variable (le contenant), et non le nom de la variable lui-même : $var est le moyen d'accéder à la donnée mémorisée."
  },
  {
    "question": "Pourquoi la commande echo $home (en minuscules) ne renvoie-t-elle rien, alors que echo $HOME fonctionne ?",
    "options": ["Parce qu'il manque des guillemets autour de $home", "Parce que la commande echo ne reconnaît que les variables numériques", "Parce que la variable $home n'existe pas, les noms de variables d'environnement étant sensibles à la casse et écrits en majuscules par convention", "Parce que $home est réservé exclusivement au compte root"],
    "correctIndex": 2,
    "explanation": "Les noms de variables sont sensibles à la casse, et les variables d'environnement sont par convention écrites en majuscules : $home (en minuscules) n'existe donc pas, contrairement à $HOME."
  },
  {
    "question": "Quelle variable d'environnement contient le chemin des répertoires où se trouvent les commandes et scripts utilisables par l'utilisateur ?",
    "options": ["$HOME", "$LANG", "$SHELL", "$PATH"],
    "correctIndex": 3,
    "explanation": "La variable $PATH précise les répertoires dans lesquels se trouvent les commandes et scripts utilisables par l'utilisateur courant ; son équivalent sous Windows se récupère avec %PATH%."
  },
  {
    "question": "Quelle commande permet de supprimer (libérer) une variable existante en mémoire ?",
    "options": ["unset", "clear", "rm", "delvar"],
    "correctIndex": 0,
    "explanation": "La commande unset (par exemple unset monNom) permet de supprimer une variable existante, dont le contenu ne sera alors plus accessible."
  },
  {
    "question": "Quel raccourci permet de réexécuter directement la dernière commande saisie dans l'historique Bash ?",
    "options": ["!?", "!!", "!n", "Ctrl+R"],
    "correctIndex": 1,
    "explanation": "Le double point d'exclamation !! permet de réexécuter immédiatement la dernière commande saisie ; !string rappelle la dernière commande commençant par cette chaîne, et !n rappelle la commande numéro n de l'historique."
  },
  {
    "question": "Dans quel fichier l'historique des commandes Bash est-il mémorisé pour chaque utilisateur ?",
    "options": ["/etc/passwd", "~/.bashrc", "~/.bash_history", "/var/log/history.log"],
    "correctIndex": 2,
    "explanation": "L'historique des commandes est mémorisé dans le fichier .bash_history, situé dans le répertoire personnel de chaque utilisateur ; il convient de ne pas y laisser d'informations sensibles."
  },
  {
    "question": "Quelle commande, suivie du nom d'une commande, permet de consulter la documentation détaillée de celle-ci, avec recherche possible via \"/mot\" et sortie via \"q\" ?",
    "options": ["help", "info", "--help", "man"],
    "correctIndex": 3,
    "explanation": "La commande man (manuel), suivie du nom de la commande recherchée, permet d'accéder à sa documentation détaillée ; on peut y rechercher un terme avec /mot, passer à l'occurrence suivante avec n, et quitter avec q."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-3-decouverte-du-shell-et-premieres-commandes",
      dataId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-3-decouverte-du-shell-et-premieres-commandes-data",
    });
  });
</script>
