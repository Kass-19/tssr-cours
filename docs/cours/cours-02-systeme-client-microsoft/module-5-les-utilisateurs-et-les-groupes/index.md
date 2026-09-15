# Module 5 : Les utilisateurs et les groupes

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module présente la notion d'utilisateur sous Windows, les types d'utilisateurs (local/domaine), les catégories d'utilisateurs, la gestion des profils, les outils d'administration, la gestion des groupes, et le contrôle de compte utilisateur (UAC).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La notion d'utilisateur

La notion d'**utilisateur** est fondamentale en informatique. Windows 10 est omniprésent en entreprise : il sert à accéder et manipuler les données nécessaires à l'exercice d'un métier — c'est donc une **porte ouverte sur le système d'information** de l'entreprise.

Cela soulève des questions essentielles : la **confiance**, le **droit d'accès** aux données (modifier ou simplement consulter), l'accès à l'ensemble des données ou seulement à certains éléments, le statut (prestataire, rôle dans l'entreprise...).

📌 **La règle d'or** : **1 collaborateur de l'entreprise = 1 utilisateur du système d'information.**

### S'identifier sur le réseau

L'identification repose classiquement sur un couple **login + mot de passe**, auquel peuvent s'ajouter d'autres preuves d'identité :

- Carte à puce individuelle
- Empreinte digitale
- Validation par SMS
- Validation par email

---

## 2. La gestion des utilisateurs

### Les deux types d'utilisateurs

| Type | Stockage | Portée |
|---|---|---|
| **Utilisateur local** | Base de données locale **SAM** (*Security Account Manager*) | Propre à un seul ordinateur — ne peut utiliser que les ressources de cette machine |
| **Utilisateur de domaine** | Base de données commune **Active Directory**, hébergée sur le **contrôleur de domaine** (éventuellement chez un prestataire) | Reconnu par plusieurs ordinateurs et serveurs d'un réseau d'entreprise |

Dans les deux cas, l'utilisateur est identifié dans le système par un code unique : le **SID** (*Security Identifier*).

### Comment s'ouvre une session ?

| Type d'utilisateur | Déroulé |
|---|---|
| **Local** | Le login apparaît sur l'écran d'accueil → renseigner le mot de passe → session ouverte |
| **De domaine** | L'ordinateur doit préalablement être **joint au domaine** (intégré à l'annuaire). Le domaine est sélectionné par défaut, il faut renseigner le couple ID/mot de passe. Il est aussi possible de s'identifier auprès d'un **autre domaine** |

**Processus côté serveur (utilisateur de domaine)** : l'ordinateur contacte le domaine de façon sécurisée et transmet l'identifiant + mot de passe → le serveur contrôle la présence dans l'annuaire → il donne (ou non) le feu vert pour l'ouverture de session.

📌 Les utilisateurs **locaux** restent toujours présents (et identifiables) après une jonction au domaine — ils n'apparaissent simplement plus sur l'écran d'accueil une fois l'ordinateur joint au domaine.

---

## 3. Les catégories d'utilisateurs

| Catégorie | Description |
|---|---|
| **Utilisateur standard** | Peut ouvrir une session et utiliser les ressources de l'ordinateur — devient « standard » dès qu'il est membre du groupe **Utilisateurs** |
| **Utilisateur administrateur** | Mêmes droits que le standard, **plus** la possibilité de modifier le système — nécessite d'appartenir au groupe **Administrateurs**. C'est le cas du compte créé par défaut à l'installation |
| **Compte invité** | Utilisation restreinte des ressources, **non identifié** (pas de mot de passe) — utile pour un besoin temporaire (rare) |

⚠️ La base SAM contient également un compte générique **« Administrateur »**, qui n'identifie aucune personne physique de l'entreprise — c'est une **faille de sécurité potentielle**, il est donc **désactivé par défaut**. Le compte **Invité** est lui aussi générique et **désactivé par défaut**, pour les mêmes raisons.

---

## 4. La gestion des profils

Chaque utilisateur possède un **profil** : son espace personnel, dont il est propriétaire. Un profil est créé dès la **première ouverture de session** sur un poste — il correspond à un sous-dossier dans `C:\Users`, propre à chaque utilisateur ayant déjà ouvert une session sur cette machine.

Ce sous-dossier contient tous les paramètres et données propres à l'utilisateur : ses documents, son bureau, ses favoris de navigateur...

| Type de profil | Rôle |
|---|---|
| **Profil public** | Commun à **tous** les utilisateurs — son contenu se répercute sur chaque profil utilisateur |
| **Profil par défaut** | Sert de **base** à la création de tout nouveau profil utilisateur — modifiable et personnalisable |

### Bonnes pratiques

Chaque sous-dossier `C:\Users\<utilisateur>` est **lié** à des éléments du disque dur, notamment à la base **SAM** elle-même contenue dans la **base de registre** de l'ordinateur. Il est donc **fortement déconseillé** de manipuler directement les profils depuis `C:\Users`.

✅ La bonne méthode : passer par les **paramètres système avancés**, qui permettent de modifier, supprimer, changer le type, et gérer proprement le profil par défaut.

---

## 5. Les outils de gestion

| Interface | Outils |
|---|---|
| **Console MMC** | `lusrmgr.msc` (gestion des utilisateurs et groupes locaux), `compmgmt.msc` (gestion de l'ordinateur) |
| **CMD** | `net user`, `net localgroup` |
| **PowerShell** | Cmdlets associées à `-LocalUser` (avec les verbes `Get`, `New`...) et à `-LocalGroup` / `-LocalGroupMember` pour gérer les groupes |

```cmd
net user
net localgroup
```

```powershell
Get-LocalUser
New-LocalUser
Get-LocalGroup
Get-LocalGroupMember
```

---

## 6. La gestion des groupes

Tout utilisateur doit appartenir à **au moins un groupe** pour pouvoir utiliser le système. Comme les utilisateurs, les groupes sont identifiés par un **SID**.

Lorsqu'un utilisateur est ajouté à un groupe, le SID de ce groupe vient enrichir son **jeton d'accès** (*access token*) — l'ensemble des SID associés à un utilisateur, comprenant à la fois son propre SID **et** ceux de tous les groupes auxquels il appartient.

### Les 3 catégories de groupes

| Catégorie | Rôle |
|---|---|
| **Groupes locaux** | Gèrent les autorisations d'accès aux ressources, éventuellement les privilèges d'administration |
| **Groupes prédéfinis** | Permettent de déléguer, de façon granulaire, des tâches d'administration précises à un utilisateur standard (ex. gérer les sauvegardes, configurer la carte réseau, lire les journaux d'événements) |
| **Entités intégrées de sécurité** | Groupes transparents, affectés automatiquement par Windows pour la gestion des permissions |

---

## 7. L'UAC : le contrôle de compte utilisateur

Sans action particulière, le système traite **tous les utilisateurs de la même façon**, y compris les administrateurs : toute action est par défaut considérée comme celle d'un **utilisateur standard**, même pour un membre du groupe Administrateurs.

Il faut donc **« montrer patte blanche »** pour utiliser des privilèges d'administrateur — c'est le rôle de l'**UAC** (*User Account Control*).

### Comment ça fonctionne

Un contrôle UAC se déclenche dès qu'on accède à un endroit du système où se cachent des actions pouvant **modifier le système**. L'élévation de privilège est symbolisée par un **bouclier**.

| Statut de l'utilisateur | Comportement de l'UAC |
|---|---|
| **Membre du groupe Administrateurs** | Simple **validation** requise |
| **Utilisateur standard** | **Challenge** : authentification requise avec le login/mot de passe d'un compte disposant des privilèges (et donc des SID) nécessaires |

### Pourquoi ces contrôles ?

- Lutter contre les programmes malveillants qui modifieraient le système **à l'insu de l'utilisateur**.
- Avertir face à un paramètre système **sensible**, à manipuler avec précaution.

⚠️ Il est **déconseillé de désactiver l'UAC**.

### Configuration

Via le **panneau de configuration**, ou via la **console de stratégie locale**. En règle générale, la configuration par défaut du niveau de l'UAC est déjà pertinente et n'a pas besoin d'être modifiée.

**Exemple concret** : pour modifier le système via `cmd.exe`, il faut lancer la console **avec les privilèges d'administrateur** (déclenche le contrôle UAC).

---

## ✅ Points clés à retenir

- Règle d'or : **1 collaborateur = 1 utilisateur**.
- **Utilisateur local** (base SAM, propre à une machine) vs **utilisateur de domaine** (Active Directory, reconnu sur tout le réseau) — les deux sont identifiés par un **SID**.
- 3 catégories d'utilisateurs : **standard**, **administrateur**, **invité** — les comptes génériques « Administrateur » et « Invité » sont **désactivés par défaut** pour des raisons de sécurité.
- Le profil utilisateur (`C:\Users\<nom>`) ne doit **jamais** être manipulé directement — toujours passer par les **paramètres système avancés**.
- 3 catégories de groupes : **locaux** (autorisations), **prédéfinis** (délégation granulaire), **entités intégrées de sécurité** (automatiques, transparentes).
- Le **jeton d'accès** d'un utilisateur regroupe son propre SID **et** ceux de tous ses groupes.
- L'**UAC** traite tout le monde comme un utilisateur standard par défaut, y compris les admins — une **validation** (admin) ou un **challenge d'authentification** (standard) est requis pour toute élévation de privilège.


## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-5-les-utilisateurs-et-les-groupes"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-5-les-utilisateurs-et-les-groupes-data">
[
  {
    "question": "Quelle est la « règle d'or » énoncée concernant la relation entre collaborateurs et utilisateurs du système d'information ?",
    "options": ["1 collaborateur de l'entreprise = 1 utilisateur du système d'information", "1 utilisateur peut être partagé par plusieurs collaborateurs", "1 collaborateur peut posséder autant d'utilisateurs qu'il le souhaite", "1 utilisateur correspond à 1 ordinateur, quel que soit le nombre de collaborateurs"],
    "correctIndex": 0,
    "explanation": "La règle d'or de la gestion des utilisateurs est qu'à chaque collaborateur de l'entreprise doit correspondre un seul utilisateur du système d'information, ce qui permet de tracer précisément les droits et les actions de chacun."
  },
  {
    "question": "Dans quelle base de données locale les utilisateurs locaux d'un ordinateur sont-ils stockés ?",
    "options": ["Active Directory", "La base SAM (Security Account Manager)", "Le registre système uniquement", "La base MMC"],
    "correctIndex": 1,
    "explanation": "Les utilisateurs locaux sont propres à un ordinateur et sont stockés dans la base de données locale SAM (Security Account Manager) ; ils ne peuvent utiliser que les ressources de cet ordinateur."
  },
  {
    "question": "Où sont stockés les utilisateurs de domaine dans un réseau d'entreprise ?",
    "options": ["Dans la base SAM locale de chaque poste", "Dans le registre de chaque ordinateur du domaine", "Dans une base de données commune, Active Directory, hébergée sur le contrôleur de domaine", "Dans un fichier texte partagé sur le réseau"],
    "correctIndex": 2,
    "explanation": "Les utilisateurs de domaine sont stockés dans une base de données commune, Active Directory, centralisée sur un serveur appelé contrôleur de domaine, ce qui permet leur reconnaissance par plusieurs ordinateurs et serveurs."
  },
  {
    "question": "Quel code permet de reconnaître un utilisateur de manière unique dans le système, qu'il soit local ou de domaine ?",
    "options": ["Le GUID de la carte réseau", "Le jeton d'accès", "Le numéro de série du disque dur", "Le SID (Security Identifier)"],
    "correctIndex": 3,
    "explanation": "Quel que soit son type, un utilisateur est reconnu dans le système grâce à un code unique, le SID (Security Identifier)."
  },
  {
    "question": "Que doit-on faire au préalable pour pouvoir ouvrir une session avec un utilisateur de domaine sur un ordinateur ?",
    "options": ["Joindre l'ordinateur au domaine, c'est-à-dire l'intégrer dans l'annuaire", "Désactiver tous les utilisateurs locaux de l'ordinateur", "Supprimer la base SAM locale", "Configurer l'UAC en mode désactivé"],
    "correctIndex": 0,
    "explanation": "Pour ouvrir une session avec un utilisateur de domaine, l'ordinateur doit au préalable être joint au domaine, c'est-à-dire intégré dans l'annuaire Active Directory."
  },
  {
    "question": "Que deviennent les utilisateurs locaux d'un ordinateur après que celui-ci a été joint à un domaine ?",
    "options": ["Ils sont automatiquement supprimés de la base SAM", "Ils restent présents et identifiables, mais n'apparaissent plus sur l'écran d'accueil", "Ils sont transférés dans Active Directory", "Ils continuent d'apparaître normalement sur l'écran d'accueil"],
    "correctIndex": 1,
    "explanation": "Les utilisateurs locaux restent toujours présents et identifiables après une jonction de domaine, mais ils n'apparaissent plus sur l'écran d'accueil de Windows dès lors que l'ordinateur a été joint au domaine."
  },
  {
    "question": "Quelles sont les trois catégories d'utilisateurs présentées dans ce module ?",
    "options": ["Local, domaine et prestataire", "Standard, invité et prestataire", "Standard, administrateur et invité", "Administrateur, invité et service"],
    "correctIndex": 2,
    "explanation": "Le module distingue trois catégories d'utilisateurs : les utilisateurs standards, les utilisateurs administrateurs et le compte invité, chacun ayant des privilèges différents."
  },
  {
    "question": "À quel groupe un utilisateur doit-il appartenir pour être considéré comme un utilisateur standard ?",
    "options": ["Le groupe Administrateurs", "Le groupe Invités", "Le groupe Opérateurs de sauvegarde", "Le groupe Utilisateurs"],
    "correctIndex": 3,
    "explanation": "Un utilisateur est considéré comme standard dès lors qu'il devient membre du groupe Utilisateurs, ce qui lui permet d'ouvrir une session et d'utiliser les ressources de l'ordinateur sans pouvoir modifier le système."
  },
  {
    "question": "Pourquoi le compte générique « Administrateur » de la base SAM est-il désactivé par défaut ?",
    "options": ["Parce qu'il n'identifie aucune personne physique dans l'entreprise, ce qui représente une faille de sécurité", "Parce qu'il ne dispose d'aucun privilège d'administration", "Parce qu'il est automatiquement supprimé après l'installation", "Parce qu'il ne peut être utilisé que par un utilisateur de domaine"],
    "correctIndex": 0,
    "explanation": "Le compte générique « Administrateur » de la base SAM ne correspond à aucune personne physique identifiable de l'entreprise, ce qui constitue une faille de sécurité ; il est donc désactivé par défaut."
  },
  {
    "question": "Pourquoi le compte invité est-il considéré comme non identifié ?",
    "options": ["Parce qu'il n'a pas de SID associé", "Parce qu'il ne possède pas de mot de passe", "Parce qu'il ne peut jamais être activé", "Parce qu'il appartient obligatoirement au groupe Administrateurs"],
    "correctIndex": 1,
    "explanation": "Le compte invité est un compte non identifié car il ne possède pas de mot de passe ; c'est un compte générique, désactivé par défaut, qui peut être activé temporairement pour des besoins restreints."
  },
  {
    "question": "Dans quel dossier système les profils des utilisateurs ayant ouvert une session sur un ordinateur sont-ils stockés ?",
    "options": ["C:\\Windows\\System32", "C:\\ProgramData", "C:\\Users", "C:\\Documents"],
    "correctIndex": 2,
    "explanation": "Chaque utilisateur possède un sous-dossier dans C:\\Users dès lors qu'il a ouvert une session pour la première fois sur le poste ; ce sous-dossier contient l'ensemble de ses paramètres et données personnelles."
  },
  {
    "question": "Que contient le profil public, commun à tous les utilisateurs d'un ordinateur ?",
    "options": ["Uniquement les paramètres du compte invité", "Une copie de sauvegarde de la base SAM", "Les journaux d'événements du système", "Des éléments qui se répercutent sur l'ensemble des profils utilisateurs"],
    "correctIndex": 3,
    "explanation": "Le profil public est un profil commun à tous les utilisateurs : ce qu'il contient se répercute sur l'ensemble des profils utilisateurs de l'ordinateur."
  },
  {
    "question": "Pourquoi est-il fortement déconseillé de manipuler directement les profils depuis le dossier C:\\Users ?",
    "options": ["Parce que chaque sous-dossier est lié à des jointures avec le disque dur et la base SAM, elle-même liée à la base de registre", "Parce que ce dossier est en lecture seule par défaut", "Parce que cela désactive automatiquement l'UAC", "Parce que ce dossier n'est accessible qu'aux utilisateurs de domaine"],
    "correctIndex": 0,
    "explanation": "Chaque sous-dossier de C:\\Users est lié à un utilisateur et comporte des jointures avec le disque dur, notamment avec la base SAM, elle-même contenue dans la base de registre ; il faut donc passer par les paramètres système avancés pour gérer proprement les profils."
  },
  {
    "question": "Quelle console MMC permet de gérer les utilisateurs et groupes locaux d'un ordinateur ?",
    "options": ["compmgmt.msc", "lusrmgr.msc", "diskmgmt.msc", "gpedit.msc"],
    "correctIndex": 1,
    "explanation": "La console lusrmgr.msc (gestion des utilisateurs et groupes locaux) permet de créer, modifier ou supprimer des utilisateurs et des groupes, en complément de compmgmt.msc qui offre une gestion plus large de l'ordinateur."
  },
  {
    "question": "Quelle commande cmd.exe permet de gérer les utilisateurs en ligne de commande ?",
    "options": ["net localgroup", "diskpart", "net user", "lusrmgr"],
    "correctIndex": 2,
    "explanation": "La commande net user permet de gérer les utilisateurs en ligne de commande sous cmd.exe, tandis que net localgroup sert à gérer les groupes locaux."
  },
  {
    "question": "Que représente le jeton d'accès (access token) d'un utilisateur ?",
    "options": ["Le mot de passe chiffré de l'utilisateur", "La liste des fichiers modifiés récemment par l'utilisateur", "Le nom de l'ordinateur sur lequel l'utilisateur s'est connecté", "L'ensemble des SID associés à cet utilisateur, y compris ceux des groupes auxquels il appartient"],
    "correctIndex": 3,
    "explanation": "Le jeton d'accès contient le SID de l'utilisateur ainsi que tous les SID des groupes auxquels il appartient ; lorsqu'un utilisateur est ajouté à un groupe, le SID de ce groupe enrichit son jeton d'accès."
  },
  {
    "question": "Que permettent les groupes prédéfinis de Windows, par exemple pour gérer les sauvegardes ou configurer la carte réseau ?",
    "options": ["Déléguer de façon granulaire des tâches d'administration à un utilisateur standard", "Remplacer totalement le groupe Administrateurs", "Désactiver automatiquement l'UAC pour leurs membres", "Supprimer la nécessité d'un SID pour leurs membres"],
    "correctIndex": 0,
    "explanation": "Les groupes prédéfinis permettent de déléguer de manière granulaire certaines tâches d'administration à un utilisateur standard, comme gérer les sauvegardes, configurer la carte réseau ou lire les journaux d'événements."
  },
  {
    "question": "Qu'est-ce qui caractérise les entités intégrées de sécurité sous Windows ?",
    "options": ["Ce sont des groupes que l'administrateur doit créer manuellement pour chaque utilisateur", "Ce sont des groupes transparents, affectés automatiquement à l'utilisateur par Windows pour la gestion des permissions", "Ce sont des groupes réservés exclusivement aux utilisateurs de domaine", "Ce sont des groupes qui remplacent la base SAM"],
    "correctIndex": 1,
    "explanation": "Les entités intégrées de sécurité sont des groupes transparents, affectés automatiquement par Windows à l'utilisateur pour la gestion des permissions, sans intervention manuelle de l'administrateur."
  },
  {
    "question": "Sans action particulière, avec quel niveau de privilège le système traite-t-il les actions de tous les utilisateurs, y compris les administrateurs ?",
    "options": ["Un niveau d'administrateur complet en permanence", "Un niveau invité", "Un niveau d'utilisateur standard", "Aucun contrôle de privilège n'est appliqué par défaut"],
    "correctIndex": 2,
    "explanation": "Sans action particulière, toute action réalisée sur le système est considérée comme celle d'un utilisateur standard, même si la personne est membre du groupe Administrateurs ; c'est l'UAC qui gère l'élévation de privilèges lorsque nécessaire."
  },
  {
    "question": "Quel symbole visuel signale généralement qu'une action nécessite une élévation de privilèges via l'UAC ?",
    "options": ["Un cadenas rouge", "Une étoile jaune", "Un point d'exclamation orange", "Un bouclier"],
    "correctIndex": 3,
    "explanation": "L'élévation de pouvoir accordée par l'UAC (User Account Control) est symbolisée par un bouclier ; un membre du groupe Administrateurs doit alors valider l'action, tandis qu'un utilisateur standard doit s'authentifier avec les identifiants d'un compte disposant des privilèges nécessaires."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-5-les-utilisateurs-et-les-groupes",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-5-les-utilisateurs-et-les-groupes-data",
    });
  });
</script>
