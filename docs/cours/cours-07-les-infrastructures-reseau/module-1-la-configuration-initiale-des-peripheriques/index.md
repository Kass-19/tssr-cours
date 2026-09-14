# Module 1 : La configuration initiale des périphériques

*Cours : [Cours 7 - Les infrastructures réseau](../index.md)*

## 🎯 Objectif du module

Ce module pose les bases de l'interaction avec un équipement Cisco (routeur, commutateur, point d'accès Wi-Fi) : comment s'y connecter physiquement pour la première fois, comment fonctionne le système d'exploitation Cisco IOS et ses différents modes d'exécution, comment lire et utiliser la syntaxe des commandes, quelles sont les commandes de configuration initiale indispensables (nom de l'équipement, bannière, mots de passe) et comment fonctionne le cycle de démarrage d'un équipement ainsi que la sauvegarde de sa configuration.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Découverte de Cisco IOS

### 1.1 Connexion à un équipement Cisco

Un équipement Cisco tout juste sorti de son carton n'a aucune configuration. Pour pouvoir le configurer pour la première fois, il faut donc s'y connecter **physiquement**, en local, via le **port console** repéré en bleu sur la façade de l'équipement, à l'aide du **câble console bleu** fourni dans le carton.

Ce câble se branche d'un côté sur le port console de l'équipement, et de l'autre côté sur l'ordinateur, sur lequel on utilise un **émulateur de terminal** (par exemple PuTTY) pour dialoguer avec l'équipement.

📌 La connexion console est indispensable dans deux cas :
- pour effectuer la **configuration initiale** de l'équipement, avant de pouvoir s'y connecter à distance ;
- pour **récupérer ou réinitialiser** l'équipement en cas de perte du mot de passe (retour à la configuration usine).

### 1.2 Cisco IOS

**Cisco IOS** est le système d'exploitation développé par Cisco pour ses équipements réseau. Il équipe la plupart des routeurs, commutateurs et points d'accès Wi-Fi Cisco et propose une **interface en ligne de commande** permettant de consulter l'état de l'équipement et de modifier sa configuration.

⚠️ Il existe d'autres systèmes d'exploitation dans l'écosystème Cisco : il faut donc vérifier, selon le type d'équipement utilisé, quel système d'exploitation est réellement en place.

La version d'IOS s'affiche automatiquement au démarrage de l'équipement. Pour la consulter à tout moment :

```
show version
```

### 1.3 Connexion console avec PuTTY

Pour établir la connexion console, on utilise le câble console fourni avec l'équipement, branché soit sur un port USB, soit sur un port RJ45 selon le modèle de câble disponible, et relié côté ordinateur à un port USB.

Côté ordinateur, on lance ensuite un émulateur de terminal — **PuTTY** est un émulateur simple qui convient parfaitement à cet usage — configuré avec les paramètres suivants :

| Paramètre | Valeur |
| --- | --- |
| Type de connexion | Série |
| Port | Numéro du port COM correspondant au câble |
| Vitesse | 9600 bauds |

Une fois la session ouverte, l'équipement Cisco répond et l'on accède à ses différents modes d'exécution.

### 1.4 Les différents modes Cisco IOS

Cisco IOS fonctionne avec plusieurs **modes d'exécution** emboîtés, chacun identifiable par l'invite de commande affichée après le nom de l'équipement.

**Mode utilisateur** — c'est le mode par défaut à la connexion, repéré par le symbole `>` :

```
Switch>
```

Il permet uniquement de consulter certaines informations ; les possibilités de configuration y sont très limitées.

**Mode privilégié** — on y accède depuis le mode utilisateur avec la commande `enable`. L'invite se termine alors par `#` :

```
Switch> enable
Switch#
```

Ce mode donne accès à davantage de commandes d'administration et de consultation.

### 1.5 Mode de configuration globale

Depuis le mode privilégié, la commande `configure terminal` permet de basculer en **mode de configuration globale**, où l'invite devient `(config)#` :

```
Switch# configure terminal
Switch(config)#
```

C'est depuis ce mode que l'on peut ensuite accéder à des **sous-modes de configuration** plus spécifiques (port console, interfaces, VLAN, etc.), abordés plus loin dans le cours.

### 1.6 Afficher les commandes disponibles

À n'importe quel moment, le point d'interrogation `?` permet de lister les commandes disponibles dans le mode courant, ou de connaître leur syntaxe. C'est une aide précieuse pour découvrir les commandes sans devoir toutes les connaître par cœur.

### 1.7 Naviguer entre les modes : exit et end

Deux commandes permettent de revenir en arrière dans les modes d'exécution, mais elles ne se comportent pas de la même façon :

| Commande | Effet |
| --- | --- |
| `exit` | Fait remonter **d'un seul niveau** vers le mode précédent |
| `end` | Ramène **directement** en mode privilégié, quel que soit le sous-mode de configuration en cours |

Par exemple, depuis un sous-mode de configuration, il faut taper `exit` trois fois de suite pour revenir en mode utilisateur (sous-mode → configuration globale → privilégié → utilisateur), alors qu'un seul `end` suffit pour revenir directement en mode privilégié.

📌 Il faut toujours regarder l'invite de commande pour savoir dans quel mode on se trouve : `Switch>` (utilisateur), `Switch#` (privilégié), `Switch(config)#` (configuration globale).

**🧠 À retenir**

| Commande / symbole | Fonction |
| --- | --- |
| `>` | Mode utilisateur |
| `enable` | Passe en mode privilégié |
| `#` | Mode privilégié |
| `configure terminal` | Passe en configuration globale |
| `(config)#` | Mode de configuration globale |
| `?` | Affiche les commandes disponibles |
| `exit` | Remonte d'un niveau |
| `end` | Revient directement au mode privilégié |
| `show version` | Affiche la version de Cisco IOS |
| Console | Permet la configuration initiale et la récupération d'accès |
| PuTTY | Émulateur de terminal permettant notamment la connexion console |

## 2. Structure des commandes Cisco IOS

Chaque commande Cisco IOS possède une syntaxe précise et ne peut être exécutée que dans le **mode approprié** : par exemple, une commande liée à OSPF s'exécute en mode de configuration globale, alors que `show ip interface` s'exécute en mode privilégié.

### 2.1 Syntaxe d'une commande

Une commande Cisco IOS est constituée :
- d'une **commande** proprement dite ;
- suivie d'**un ou plusieurs mots-clés ou arguments**.

### 2.2 Les mots-clés et les arguments

- Les **mots-clés** sont des éléments **fixes** de la syntaxe (ex. `show`, `ip`, `interface`).
- Les **arguments** sont des éléments qui **varient selon le contexte** (ex. `gigabitEthernet 0/1`, qui précise l'interface concernée).

**Exemple décomposé**

```
show ip interface gigabitEthernet 0/1
```

| Élément | Rôle |
| --- | --- |
| `show` | commande |
| `ip` | mot-clé |
| `interface` | mot-clé |
| `gigabitEthernet` | argument (type d'interface) |
| `0/1` | argument (numéro de l'interface) |

### 2.3 L'aide intégrée de Cisco IOS

Cisco IOS propose deux formes d'aide à la saisie des commandes :
- le **point d'interrogation** `?`, qui affiche les possibilités disponibles à l'endroit précis où il est saisi dans la commande ;
- la **vérification de syntaxe**, qui signale automatiquement les erreurs de saisie.

Ces aides sont particulièrement utiles pour découvrir les commandes, comprendre leur syntaxe et identifier rapidement une erreur de frappe.

### 2.4 Vérification de syntaxe et interpréteur de commandes

Lorsque l'interpréteur de commandes détecte une erreur dans la saisie, il positionne un symbole `^` **juste sous l'endroit où le problème a été détecté**, ce qui permet de repérer rapidement l'erreur, y compris sur une commande longue.

```
Switch(config)# adresse
                 ^
% Invalid input detected at '^' marker.
```

**🧠 À retenir**

| Élément | Rôle |
| --- | --- |
| Commande | Action principale demandée à Cisco IOS |
| Mot-clé | Élément fixe de la syntaxe |
| Argument | Élément permettant de préciser la commande |
| `?` | Affiche les possibilités disponibles |
| `^` | Indique l'endroit où une erreur de syntaxe est détectée |
| Vérification de syntaxe | Permet de repérer les erreurs dans une commande |

## 3. Commandes courantes de configuration initiale

### 3.1 Changer le nom de l'équipement

Les équipements Cisco sortent tous du carton avec le même nom par défaut, ce qui les rend difficiles à distinguer une fois connectés. Il faut donc systématiquement leur attribuer un nom, en mode de configuration globale :

```
Switch(config)# hostname R1
R1(config)#
```

Pour revenir au nom par défaut (généralement `Router` ou `Switch` selon le type d'équipement) :

```
no hostname
```

### 3.2 Mettre en place une bannière

Il est recommandé de configurer une **bannière** (MOTD, *Message Of The Day*), qui s'affiche systématiquement lorsqu'une personne tente de se connecter à l'équipement — par exemple pour rappeler que l'accès est réservé à certaines personnes.

```
banner motd #ACCES RESERVE AU PERSONNEL AUTORISE#
```

Le message est encadré par deux **caractères délimiteurs** identiques (ici `#`), qui peuvent être remplacés par un autre caractère au choix.

⚠️ Cisco IOS ne gère pas toujours correctement les caractères accentués : il est préférable de rédiger les bannières uniquement en caractères **ASCII**, sans accents ni caractères spéciaux (éventuellement en anglais pour simplifier).

### 3.3 Protéger les accès avec des mots de passe

Cisco IOS permet d'exiger un mot de passe avant d'autoriser la connexion à l'équipement ou l'accès à certains niveaux de privilège. Des mots de passe distincts peuvent être définis selon le type d'accès :
- accès **console** ;
- accès **Telnet / SSH** (lignes VTY) ;
- accès au **mode privilégié** (enable).

### 3.4 Mot de passe de la console

On configure la ligne console en mode de configuration globale, puis on y définit un mot de passe et on active sa demande avec `login` :

```
Switch(config)# line console 0
Switch(config-line)# password monmotdepasse
Switch(config-line)# login
```

Le mot de passe sera alors demandé à chaque connexion via le câble console.

### 3.5 Supprimer un mot de passe

```
no password
```

⚠️ Attention à ne pas confondre `no password` (qui **supprime explicitement** la configuration du mot de passe) avec la commande `password` saisie sans rien derrière.

### 3.6 Protéger l'accès Telnet / SSH

Les connexions distantes (Telnet, SSH) passent par les lignes **VTY**, configurables avec :

```
Switch(config)# line vty 0 15
Switch(config-line)# password mot_de_passe
Switch(config-line)# login
```

Le mot de passe utilisé pour les connexions VTY peut être différent de celui de la console.

### 3.7 Chiffrer les mots de passe

Par défaut, les mots de passe configurés sur la console ou les lignes VTY apparaissent **en clair** dans le fichier de configuration : si quelqu'un récupère ce fichier, il peut donc les lire directement. Pour l'éviter :

```
service password-encryption
```

Cette commande stocke les mots de passe sous une forme chiffrée/obfusquée dans la configuration, de sorte qu'ils ne s'affichent plus en clair.

⚠️ `service password-encryption` reste une protection relativement basique. Pour les secrets importants (notamment le mot de passe du mode privilégié), Cisco recommande un mécanisme plus robuste : `enable secret` plutôt que `enable password`.

### 3.8 Protéger le mode privilégié avec enable secret

La commande `enable` permet de passer du mode utilisateur au mode privilégié : il est donc important d'en protéger l'accès. En mode de configuration globale :

```
Switch(config)# enable secret MonMotDePasse
```

Le mot de passe est alors stocké de manière sécurisée dans la configuration, et Cisco IOS le demandera systématiquement lors d'un `enable`.

### 3.9 Différencier les niveaux d'accès

Ce système de mots de passe permet de mettre en place des **niveaux d'accès différenciés** selon les équipes : par exemple, des techniciens de proximité peuvent se connecter et exécuter des commandes de diagnostic simples (`ping`, `traceroute`) sans disposer du mot de passe du mode privilégié, ce dernier étant réservé aux administrateurs réseau habilités à modifier la configuration.

**🧠 À retenir**

| Commande | Fonction |
| --- | --- |
| `hostname R1` | Change le nom de l'équipement |
| `no hostname` | Supprime le nom configuré |
| `banner motd #...#` | Configure une bannière de connexion |
| `line console 0` | Configure l'accès console |
| `password ...` | Définit un mot de passe sur une ligne |
| `login` | Active la demande du mot de passe |
| `no password` | Supprime le mot de passe |
| `line vty 0 15` | Configure les connexions distantes |
| `service password-encryption` | Masque/chiffre les mots de passe dans la configuration |
| `enable secret ...` | Protège le passage au mode privilégié |
| `enable` | Passe en mode privilégié |

**🔑 Exemple de configuration de base**

```
Switch> enable
Switch# configure terminal
Switch(config)# hostname SW1
SW1(config)# banner motd #ACCES RESERVE AU PERSONNEL AUTORISE#
SW1(config)# line console 0
SW1(config-line)# password Console123
SW1(config-line)# login
SW1(config-line)# exit
SW1(config)# line vty 0 15
SW1(config-line)# password Remote123
SW1(config-line)# login
SW1(config-line)# exit
SW1(config)# enable secret Admin123
SW1(config)# service password-encryption
```

📌 Pour le TSSR, retenir en priorité que `enable secret` est la méthode à privilégier pour protéger l'accès au mode privilégié, plutôt que `enable password`.

## 4. Démarrage et gestion des configurations

### 4.1 Le démarrage d'un équipement Cisco

Au démarrage, un équipement Cisco effectue plusieurs étapes successives :

1. **Le POST** (*Power-On Self-Test*), stocké dans la **ROM**, vérifie le processeur (CPU), la mémoire RAM, la mémoire Flash et les autres composants matériels nécessaires au démarrage.
2. **Le chargement de Cisco IOS** : si le système d'exploitation est présent dans la mémoire Flash, il est chargé.
3. **La recherche du fichier de configuration** `startup-config` : s'il existe, il est chargé ; sinon, l'équipement peut lancer le mode **Setup**, un assistant de configuration initiale.

### 4.2 La running-config

La **running-config** est la configuration **actuellement utilisée** par l'équipement. Elle est stockée en **RAM** et s'affiche avec :

```
show running-config
```

⚠️ La RAM est une mémoire **volatile** : son contenu est perdu à chaque extinction ou redémarrage. Les modifications faites dans la running-config ne sont donc **pas conservées automatiquement** après un redémarrage.

### 4.3 La startup-config

La **startup-config** est la configuration qui sera chargée au **démarrage** de l'équipement. Elle est stockée en **NVRAM** (*Non-Volatile RAM*), une mémoire qui, à l'inverse de la RAM, conserve son contenu même hors tension.

| Configuration | Stockage | Volatile ? | Utilisation |
| --- | --- | --- | --- |
| running-config | RAM | ✅ Oui | Configuration actuellement active |
| startup-config | NVRAM | ❌ Non | Configuration chargée au démarrage |

### 4.4 Sauvegarder la configuration

Comme la running-config n'est pas conservée automatiquement, toute modification doit être copiée dans la startup-config pour survivre à un redémarrage :

```
copy running-config startup-config
```

Une forme abrégée équivalente existe :

```
copy run start
```

📌 running-config → `copy running-config startup-config` → startup-config

### 4.5 Comparer les deux configurations

Les deux configurations peuvent être affichées séparément afin de vérifier si des modifications non sauvegardées existent :

```
show running-config
show startup-config
```

Comparer les deux permet de savoir si la configuration actuellement active correspond bien à celle qui sera restaurée au prochain démarrage.

### 4.6 Revenir à une configuration vierge

Pour repartir d'une configuration vierge, il faut supprimer la startup-config puis redémarrer l'équipement :

```
erase startup-config
reload
```

L'équipement redémarre alors sans startup-config, dans un état comparable à celui d'un équipement neuf sorti de son carton.

**🧠 À retenir**

| Objectif | Commande |
| --- | --- |
| Afficher la configuration actuelle | `show running-config` |
| Afficher la configuration de démarrage | `show startup-config` |
| Sauvegarder la configuration | `copy running-config startup-config` |
| Supprimer la configuration de démarrage | `erase startup-config` |
| Redémarrer l'équipement | `reload` |

## ✅ Points clés à retenir

- La connexion **console** (câble bleu + émulateur type PuTTY, 9600 bauds, connexion série) est indispensable pour la configuration initiale d'un équipement neuf et pour récupérer l'accès en cas de mot de passe perdu.
- **Cisco IOS** est le système d'exploitation en ligne de commande des routeurs, commutateurs et points d'accès Cisco ; `show version` affiche sa version.
- Trois modes d'exécution principaux : mode utilisateur (`>`), mode privilégié (`#`, via `enable`) et mode de configuration globale (`(config)#`, via `configure terminal`).
- ⚠️ Piège classique : `exit` ne remonte que d'un seul niveau à la fois, alors que `end` ramène directement en mode privilégié depuis n'importe quel sous-mode de configuration.
- Une commande Cisco IOS est composée de mots-clés (fixes) et d'arguments (variables selon le contexte) ; `?` liste les possibilités à un endroit donné, et le symbole `^` signale précisément l'endroit d'une erreur de syntaxe.
- Commandes de configuration initiale essentielles : `hostname` (nom de l'équipement), `banner motd` (bannière, à rédiger en ASCII sans accents), `line console 0` / `line vty 0 15` avec `password` + `login` (mots de passe console et distant), `service password-encryption` (chiffrage basique des mots de passe en clair) et `enable secret` (protection recommandée du mode privilégié, à privilégier sur `enable password`).
- Des niveaux d'accès différenciés permettent de limiter certains utilisateurs (ex. techniciens) à des commandes de diagnostic (`ping`, `traceroute`) sans leur donner le mot de passe du mode privilégié.
- 📌 Point le plus important du module : la **running-config** (RAM, active, volatile) est distincte de la **startup-config** (NVRAM, chargée au démarrage, non volatile). Toute modification doit être sauvegardée avec `copy running-config startup-config`, sinon elle est perdue au redémarrage.
- `erase startup-config` suivi de `reload` permet de réinitialiser un équipement à un état proche de sa sortie d'usine.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-1-la-configuration-initiale-des-peripheriques"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-1-la-configuration-initiale-des-peripheriques-data">
[
  {
    "question": "Exemple de question à remplacer",
    "options": ["Réponse A", "Réponse B", "Réponse C"],
    "correctIndex": 0,
    "explanation": "Explique ici pourquoi cette réponse est correcte."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-07-les-infrastructures-reseau-module-1-la-configuration-initiale-des-peripheriques",
      dataId: "quiz-cours-07-les-infrastructures-reseau-module-1-la-configuration-initiale-des-peripheriques-data",
    });
  });
</script>
