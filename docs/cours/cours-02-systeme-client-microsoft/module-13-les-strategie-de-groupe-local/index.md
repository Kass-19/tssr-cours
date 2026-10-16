# Module 13 : Les stratégie de groupe local

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module introduit la base de registre Windows, socle technique indispensable à la compréhension des **stratégies de groupe local (LGPO)**, puis détaille le fonctionnement de ces dernières : les consoles de gestion, les ruches concernées, et la structure des paramètres configurables.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La base de registre

### 1.1 Définition

La **base de registre** est une base de données native de Windows, **hiérarchique** et **centrale**, qui stocke l'ensemble des informations de configuration du système — depuis son premier démarrage et pendant toute sa durée de vie. Elle couvre les configurations liées à un ou plusieurs **utilisateurs**, **programmes** et **périphériques matériels**.

📌 Cette base existe depuis **Windows 98** et reste utilisée aujourd'hui ; elle contient des **milliers de paramètres**.

Windows consulte en permanence cette base pour exécuter les ordres donnés par l'utilisateur dans les meilleures conditions. Elle peut être consultée et modifiée manuellement via la commande :

```cmd
regedit
```

⚠️ La manipulation de la base de registre doit être réservée à des techniciens initiés, et réalisée avec la plus grande précaution.

### 1.2 Les 5 ruches (hives)

Les données sont regroupées en 5 catégories appelées **ruches** :

| Ruche | Contenu |
|---|---|
| `HKEY_CLASSES_ROOT` | Informations sur les applications |
| `HKEY_CURRENT_USER` | Configuration relative à l'utilisateur **actuellement connecté** |
| `HKEY_LOCAL_MACHINE` | Informations liées à l'**ordinateur**, donc communes à tous les utilisateurs |
| `HKEY_USERS` | Éléments de la base **SAM** et des profils utilisateurs |
| `HKEY_CURRENT_CONFIG` | Informations de profils matériel utilisés par l'ordinateur |

📌 Les équipes systèmes et réseaux travaillent essentiellement avec `HKEY_CURRENT_USER` et `HKEY_LOCAL_MACHINE` pour configurer les stratégies de groupe local.

### 1.3 Structure : ruches, clés et valeurs

Les ruches contiennent des **clés**, qui peuvent elles-mêmes contenir des clés, lesquelles contiennent des **valeurs**. Ces valeurs peuvent être de type :

- **binaire** (0 ou 1) ;
- **hexadécimal** ;
- **chaîne de caractères**.

Exemple, pour une imprimante :

| Nom | Type | Données |
|---|---|---|
| `(par défaut)` | REG_SZ | (valeur non définie) |
| `Auto Install` | REG_DWORD | 0x00000000 (0) |
| `Default Attributes` | REG_DWORD | 0x00000200 (512) |
| `Driver Name` | REG_SZ | Lexmark XC9200 Series Class Driver |
| `Set As Default` | REG_DWORD | 0x00000000 (0) |
| `Shared` | REG_DWORD | 0x00000000 (0) |
| `Use Existing` | REG_DWORD | 0x00000000 (0) |

Dans cet exemple, la clé `Driver Name` contient une chaîne de caractères (le nom du pilote), tandis que `Set As Default` et `Shared` valent `0` : l'imprimante n'est ni partagée, ni définie par défaut pour l'utilisateur connecté.

📌 Cet exemple ne concerne qu'une seule imprimante — chaque valeur correspond à un paramètre système, d'où les milliers de paramètres existants, à manipuler avec précaution.

---

## 2. Les LGPO (Local Group Policy Object)

### 2.1 Principe et consoles de gestion

Les **LGPO** (*Local Group Policy Object*) permettent de gérer le comportement du poste de travail et des utilisateurs, à travers une interface dédiée plutôt qu'en éditant directement la base de registre.

| Console | Rôle |
|---|---|
| **Éditeur d'objets de stratégie de groupe** (`gpedit.msc`) | Console principale de gestion des LGPO |
| **Stratégie de sécurité locale** (`secpol.msc`) | Console complémentaire, orientée **sécurité** du système |

📌 Ces consoles MMC exploitent la base de registre de façon plus efficace et conviviale qu'une modification manuelle, et réduisent le temps consacré à la gestion des postes.

### 2.2 Que permettent concrètement les LGPO ?

Liste non exhaustive d'actions possibles :

- renforcer les **stratégies de mot de passe** ;
- agir sur les **privilèges d'administration** du système ;
- uniformiser/configurer l'**aspect** du poste de travail pour les différents utilisateurs ;
- **restreindre l'accès** à certains paramètres ou menus du système, pour sécuriser et fiabiliser le poste ;
- démarrer des **scripts** à l'ouverture ou à la fermeture de session utilisateur.

### 2.3 Ruches et groupes concernés

L'éditeur d'objets de stratégie de groupe agit sur :

| Ruche | Portée |
|---|---|
| `HKEY_LOCAL_MACHINE` | Paramètres machine (éventuellement sur un **ordinateur distant**) |
| `HKEY_CURRENT_USER` / `HKEY_USERS` | Paramètres liés aux utilisateurs de la base SAM |

Il est également possible d'agir sur deux **groupes prédéfinis** : **Administrateurs** et **Non-administrateurs**. ⚠️ Les autres groupes locaux n'apparaissent pas dans cette console.

### 2.4 Structure des paramètres

En naviguant dans la console, des centaines de paramètres sont disponibles, avec les caractéristiques suivantes :

| Caractéristique | Détail |
|---|---|
| **États possibles** | **Activé** / **Désactivé** / **Non configuré** (état par défaut — c'est alors le système qui décide du comportement) |
| **Commentaire** | Possibilité d'ajouter un commentaire pour documenter/tracer une modification |
| **Conditions d'application** | Listées dans le cadre **« Pris en charge sur »** |
| **Options supplémentaires** | Certains paramètres proposent des réglages complémentaires (valeurs binaires, hexadécimales, chaînes de caractères), avec guidage intégré |
| **Aide intégrée** | Chaque paramètre dispose d'une aide, **indispensable à consulter** avant modification |

⚠️ Les conditions de prise en charge sont strictes : par exemple, un paramètre « Supprimer le lien Jeux du menu Démarrer » peut n'être personnalisable que sur Windows Server 2008, Windows 7 et Windows Vista — et donc **sans effet** sur Windows 10.

## ✅ Points clés à retenir

- La base de registre (`regedit`) est une base hiérarchique centrale, organisée en 5 ruches (`HKEY_CLASSES_ROOT`, `HKEY_CURRENT_USER`, `HKEY_LOCAL_MACHINE`, `HKEY_USERS`, `HKEY_CURRENT_CONFIG`), contenant des clés imbriquées porteuses de valeurs (binaire/hexadécimal/chaîne) ; sa manipulation directe est réservée aux techniciens avertis.
- Les LGPO permettent de configurer le poste de travail et les comptes utilisateurs via deux consoles MMC : l'éditeur d'objets de stratégie de groupe (`gpedit.msc`, général) et la Stratégie de sécurité locale (`secpol.msc`, orientée sécurité) — plus pratiques et sûres qu'une édition directe de la base de registre.
- Les LGPO agissent principalement sur les ruches `HKEY_LOCAL_MACHINE` et `HKEY_CURRENT_USER`/`HKEY_USERS`, et peuvent cibler les groupes prédéfinis Administrateurs/Non-administrateurs (les autres groupes locaux ne sont pas gérables via cette console).
- Chaque paramètre LGPO possède trois états (Activé/Désactivé/Non configuré), des conditions de prise en charge par version d'OS (« Pris en charge sur »), d'éventuelles options complémentaires, et une aide intégrée à toujours consulter avant toute modification.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-13-les-strategie-de-groupe-local"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-13-les-strategie-de-groupe-local-data">
[
  {
    "question": "Comment le module décrit-il la base de registre Windows ?",
    "options": ["Une base de données hiérarchique et centrale qui stocke toutes les informations de configuration du système", "Un simple fichier texte listant les logiciels installés", "Une base de données exclusivement dédiée aux imprimantes", "Un service réseau permettant de synchroniser les horloges système"],
    "correctIndex": 0,
    "explanation": "La base de registre est décrite comme une base de données native, hiérarchique et centrale, qui stocke toutes les informations de configuration du système depuis son premier démarrage et pendant toute sa durée de vie."
  },
  {
    "question": "Depuis quelle version de Windows la base de registre existe-t-elle, d'après le module ?",
    "options": ["Windows XP", "Windows 98", "Windows 2000", "Windows 7"],
    "correctIndex": 1,
    "explanation": "Le module précise que la base de registre existe depuis Windows 98 et est toujours utilisée aujourd'hui, avec des milliers de paramètres."
  },
  {
    "question": "Quelle commande permet de consulter et de modifier manuellement les données de la base de registre ?",
    "options": ["gpedit", "secpol", "regedit", "msinfo32"],
    "correctIndex": 2,
    "explanation": "La commande regedit permet de consulter et de modifier manuellement les données de la base de registre, en manipulant cette dernière avec la plus grande précaution."
  },
  {
    "question": "Comment appelle-t-on les 5 grandes catégories dans lesquelles sont regroupées les données de la base de registre ?",
    "options": ["Des branches", "Des clusters", "Des partitions", "Des ruches"],
    "correctIndex": 3,
    "explanation": "Les données de la base de registre sont regroupées sous 5 catégories appelées des ruches (HKEY_CLASSES_ROOT, HKEY_CURRENT_USER, HKEY_LOCAL_MACHINE, HKEY_USERS et HKEY_CURRENT_CONFIG)."
  },
  {
    "question": "Quelle ruche de la base de registre contient la configuration relative à l'utilisateur ayant actuellement ouvert une session ?",
    "options": ["HKEY_CURRENT_USER", "HKEY_LOCAL_MACHINE", "HKEY_CLASSES_ROOT", "HKEY_CURRENT_CONFIG"],
    "correctIndex": 0,
    "explanation": "La ruche HKEY_CURRENT_USER contient la configuration relative à l'utilisateur actuellement connecté sur l'ordinateur."
  },
  {
    "question": "Quelle ruche contient des informations liées à l'ordinateur et donc communes à tous les utilisateurs ?",
    "options": ["HKEY_CLASSES_ROOT", "HKEY_LOCAL_MACHINE", "HKEY_USERS", "HKEY_CURRENT_CONFIG"],
    "correctIndex": 1,
    "explanation": "La ruche HKEY_LOCAL_MACHINE contient des informations en lien avec l'ordinateur lui-même, et donc applicables à tous les utilisateurs de la machine."
  },
  {
    "question": "Avec quelles ruches les équipes systèmes et réseaux travaillent-elles essentiellement pour configurer les stratégies de groupe local ?",
    "options": ["HKEY_CLASSES_ROOT et HKEY_CURRENT_CONFIG", "HKEY_USERS et HKEY_CURRENT_CONFIG", "HKEY_CURRENT_USER et HKEY_LOCAL_MACHINE", "Uniquement HKEY_CLASSES_ROOT"],
    "correctIndex": 2,
    "explanation": "Le module précise que les équipes système et réseaux travaillent essentiellement avec les ruches HKEY_CURRENT_USER et HKEY_LOCAL_MACHINE dans le but de configurer les stratégies de groupe local."
  },
  {
    "question": "Quels types de valeurs peuvent contenir les clés de la base de registre ?",
    "options": ["Uniquement des valeurs binaires", "Uniquement des adresses IP", "Uniquement des chemins de fichiers", "Des valeurs binaires, hexadécimales ou des chaînes de caractères"],
    "correctIndex": 3,
    "explanation": "Les clés de la base de registre peuvent contenir des valeurs sous forme binaire (0 ou 1), hexadécimale, ou sous forme de chaîne de caractère, selon l'exemple du pilote d'imprimante donné dans le module."
  },
  {
    "question": "Que signifie l'acronyme LGPO ?",
    "options": ["Local Group Policy Object", "Local General Permission Order", "Logical Group Process Objective", "Local Group Protection Options"],
    "correctIndex": 0,
    "explanation": "LGPO signifie Local Group Policy Object (stratégie de groupe local), qui permet de gérer le comportement du poste de travail et des utilisateurs."
  },
  {
    "question": "Quel composant logiciel enfichable (console MMC) permet de gérer les LGPO pour le poste de travail et les utilisateurs ?",
    "options": ["Le gestionnaire de périphériques", "L'éditeur d'objets de stratégie de groupe", "Le centre réseau et partage", "L'observateur d'évènements"],
    "correctIndex": 1,
    "explanation": "L'éditeur d'objets de stratégie de groupe est le composant logiciel enfichable qui permet de gérer le comportement du poste de travail et des utilisateurs via une seule et même console."
  },
  {
    "question": "Quelle autre console MMC, plus orientée sécurité du système, est mentionnée aux côtés de l'éditeur d'objets de stratégie de groupe ?",
    "options": ["lusrmgr.msc", "diskmgmt.msc", "secpol.msc (Stratégie de Sécurité Locale)", "compmgmt.msc"],
    "correctIndex": 2,
    "explanation": "La console Stratégie de Sécurité Locale, accessible via secpol.msc, est présentée comme une console complémentaire, plus orientée vers la sécurité du système."
  },
  {
    "question": "Parmi les actions suivantes, laquelle peut être réalisée grâce aux LGPO, d'après le module ?",
    "options": ["Formater un disque dur à distance", "Créer automatiquement une image de référence (master)", "Configurer le forwarder d'un serveur DNS", "Renforcer les stratégies de mot de passe et restreindre l'accès à certains menus du système"],
    "correctIndex": 3,
    "explanation": "Les LGPO permettent notamment de renforcer les stratégies de mot de passe, d'agir sur les privilèges d'administration, d'uniformiser l'aspect du poste de travail, et de restreindre l'accès à certains paramètres ou menus."
  },
  {
    "question": "Outre les restrictions de configuration, quel autre type d'action les LGPO permettent-elles de déclencher automatiquement ?",
    "options": ["Le lancement de scripts à l'ouverture ou à la fermeture de session utilisateur", "L'envoi automatique d'e-mails aux administrateurs", "La mise à jour automatique du BIOS", "La création automatique de comptes utilisateurs"],
    "correctIndex": 0,
    "explanation": "Les LGPO permettent également de démarrer des scripts à l'ouverture ou à la fermeture des sessions utilisateurs."
  },
  {
    "question": "Sur quelle ruche de la base de registre agit principalement l'éditeur d'objets de stratégie de groupe pour la partie \"ordinateur\" ?",
    "options": ["HKEY_CLASSES_ROOT", "HKEY_LOCAL_MACHINE", "HKEY_CURRENT_CONFIG", "HKEY_USERS uniquement"],
    "correctIndex": 1,
    "explanation": "L'éditeur d'objets de stratégie de groupe agit sur la ruche HKEY_LOCAL_MACHINE, éventuellement même celle d'un ordinateur distant, en plus des ruches liées aux utilisateurs."
  },
  {
    "question": "Sur quels groupes prédéfinis l'éditeur d'objets de stratégie de groupe permet-il d'agir, concernant les utilisateurs ?",
    "options": ["Tous les groupes locaux existants sur la machine, sans exception", "Uniquement le groupe des invités", "Les administrateurs et les non-administrateurs uniquement", "Uniquement les groupes créés manuellement par l'administrateur"],
    "correctIndex": 2,
    "explanation": "L'éditeur d'objets de stratégie de groupe permet d'agir sur les groupes prédéfinis administrateurs et non-administrateurs ; les autres groupes locaux n'apparaissent pas dans cette console."
  },
  {
    "question": "Quel est l'état par défaut d'un paramètre de stratégie de groupe local qui n'a pas été explicitement configuré ?",
    "options": ["Activé par défaut", "Désactivé par défaut", "Il n'existe pas d'état par défaut, un choix est obligatoire", "Non configuré, c'est alors le système qui décide par défaut"],
    "correctIndex": 3,
    "explanation": "Par défaut, chaque paramètre est à l'état \"non configuré\", ce qui signifie que c'est le système qui décide du comportement par défaut tant que l'administrateur n'a pas explicitement activé ou désactivé le paramètre."
  },
  {
    "question": "À quoi correspond le cadre \"pris en charge sur\" affiché pour certains paramètres de stratégie de groupe ?",
    "options": ["Aux conditions de compatibilité du paramètre selon les versions de systèmes d'exploitation", "À la liste des utilisateurs autorisés à modifier ce paramètre", "À la date de dernière modification du paramètre", "Au niveau de risque associé à ce paramètre"],
    "correctIndex": 0,
    "explanation": "Le cadre \"pris en charge sur\" indique les conditions de compatibilité d'un paramètre, c'est-à-dire sur quelles versions de systèmes d'exploitation ce paramètre est personnalisable."
  },
  {
    "question": "Dans l'exemple du module concernant la suppression du lien \"jeux\" du menu Démarrer, sur quels systèmes ce paramètre est-il personnalisable ?",
    "options": ["Windows 10 et Windows 11 uniquement", "Windows Server 2008, Windows 7 et Windows Vista", "Tous les systèmes Windows sans exception", "Uniquement Windows Server, quelle que soit la version"],
    "correctIndex": 1,
    "explanation": "L'exemple donné précise que ce paramètre concernant le lien jeux du menu Démarrer est personnalisable sur Windows Server 2008, Windows 7 et Windows Vista, mais ne fonctionnera pas sur un OS Windows 10."
  },
  {
    "question": "Sous quelles formes peuvent se présenter les options supplémentaires de certains paramètres de stratégie de groupe ?",
    "options": ["Uniquement sous forme de case à cocher simple", "Uniquement sous forme de fichiers à importer", "Sous forme de valeurs binaires, hexadécimales ou de chaînes de caractères", "Ces paramètres ne possèdent jamais d'options supplémentaires"],
    "correctIndex": 2,
    "explanation": "Certains paramètres possèdent des options supplémentaires, souvent symbolisées par des valeurs binaires, hexadécimales ou sous forme de chaîne de caractère, pour lesquelles l'administrateur est guidé."
  },
  {
    "question": "Pourquoi le module insiste-t-il sur l'importance de lire l'aide associée à chaque paramètre de stratégie de groupe ?",
    "options": ["Parce que cette aide est optionnelle et rarement utile", "Parce qu'elle remplace entièrement la documentation Technet", "Parce qu'elle permet de désactiver automatiquement le paramètre", "Parce qu'elle est essentielle et indispensable pour bien comprendre l'effet du paramètre"],
    "correctIndex": 3,
    "explanation": "Le module conclut en précisant que chaque paramètre possède une aide essentielle et indispensable à lire avant toute modification, afin d'en comprendre précisément l'effet."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-13-les-strategie-de-groupe-local",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-13-les-strategie-de-groupe-local-data",
    });
  });
</script>
