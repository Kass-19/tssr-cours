# Module 12 : Introduction à la capture et au déploiement d'images

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module introduit la notion d'**image de référence** (master) comme levier de productivité pour une équipe informatique, détaille sa création avec **sysprep**, son exploitation (capture à froid via PXE ou WinPE/DISM), et enfin son déploiement sur un ou plusieurs postes du parc.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Introduction à la capture et au déploiement d'images

### 1.1 La recherche de productivité

Une équipe informatique cherche en permanence à gagner du temps, afin de le réinvestir dans des projets toujours plus nombreux. Plusieurs leviers existent :

| Levier | Principe | Limite |
|---|---|---|
| **Parc matériel homogène** | Gérer des postes clients (voire serveurs, matériel réseau) de même marque/modèle réduit les configurations à gérer | Reste en pratique largement **utopique** |
| **Parc logiciel homogène** | Réduire le nombre de systèmes d'exploitation différents à maintenir | Objectif rendu plus réaliste avec Windows 10 et la fin de support de Windows 7 |
| **Stock de systèmes clé en main** | Disposer d'OS prêts à l'emploi, pour l'arrivée de nouveaux collaborateurs ou le dépannage rapide d'un poste défaillant | Dépend du budget disponible |

### 1.2 La solution : les images de référence

Pour répondre à ces problématiques, la solution consiste à disposer d'**images de référence**, aussi appelées **masters**.

---

## 2. Le master

### 2.1 Définition

Un **master** (image de référence) est un OS prêt à démarrer, à jour, et — dans l'idéal — déjà équipé des logiciels de l'entreprise, prêts à l'emploi.

### 2.2 Étapes de création d'un master

| Étape | Description |
|---|---|
| 1. **Installation de l'OS** | Sur un ordinateur à la configuration matérielle la plus standard possible dans l'entreprise |
| 2. **Configuration initiale** | Installation des pilotes adéquats, pour fiabiliser le système |
| 3. **Installation des applications** *(facultative)* | Applications de base et applications métier, dans leur version validée par la DSI |
| 4. **Préparation au clonage** | Via l'outil natif **sysprep** |

### 2.3 Sysprep

**Sysprep** est l'outil natif qui prépare un système à être cloné, en réinitialisant ses paramètres personnalisés pour rendre chaque poste final **unique**. Il existe une version de sysprep propre à chaque génération d'OS (Windows 10, Windows 7...), utilisable en interface graphique ou en ligne de commande (plus précise).

#### Déroulement

1. Lancer sysprep, basculer en mode **OOBE** (*Out-of-Box Experience* — le mode de première configuration rencontré après une installation « sortie d'usine ») ;
2. Cocher la case **« Généraliser »** : étape clé, qui génère un nouveau **SID** unique à chaque ordinateur au redémarrage suivant (indispensable pour qu'une machine puisse rejoindre un domaine AD) ;
3. **Arrêter** le système, pour capturer son image **à froid** (OS principal non démarré).

En ligne de commande :

```cmd
sysprep /oobe /generalize /shutdown
```

📌 Le **mode audit** permet de redémarrer le master en amont du sysprep généralisé, pour y installer logiciels et pilotes destinés à être conservés après la généralisation.

Les journaux sysprep sont consultables dans :

```text
C:\Windows\System32\Sysprep\Panther
```

### 2.4 Limites et points d'attention de sysprep

⚠️ Sysprep n'est **pas compatible** avec toutes les configurations :

| Cas | Comportement / bonne pratique |
|---|---|
| Certains **rôles serveur** | Incompatibilité possible — à vérifier au cas par cas |
| **Apps du Microsoft Store** | Liées au profil utilisateur ; doivent être **désinstallées** avant sysprep (détails disponibles dans les journaux sysprep) |
| **Pilotes installés manuellement** | **Supprimés** par sysprep par défaut, pour maximiser la standardisation du master. Pour les conserver : option `/PersistAllDevicesInstall`, ou les ajouter au **magasin de pilotes Windows** |
| **Comptes utilisateurs de la base SAM** | **Non supprimés** par sysprep ; bonne pratique : utiliser le compte **Administrateur** pour supprimer manuellement les comptes/profils utilisateurs, à l'exception des comptes de service locaux nécessaires (ex. antivirus, sauvegarde) — seul le compte Administrateur est réinitialisé automatiquement par sysprep |

```cmd
sysprep /oobe /generalize /shutdown /PersistAllDevicesInstall
```

---

## 3. Exploitation d'un master

### 3.1 Règle essentielle après le sysprep

⚠️ Une fois le système de référence **éteint** après le sysprep, il ne doit **surtout pas être redémarré** avant la capture de son image, sous peine de perdre le bénéfice du sysprep. En cas de redémarrage accidentel, le sysprep doit être **refait intégralement**.

### 3.2 Capturer l'image sans redémarrer le master

Pour capturer l'image sans redémarrer l'ordinateur sur son propre OS (ce qui annulerait le sysprep), il faut le faire **démarrer sur un autre OS**, dédié à la capture/export d'image. Deux solutions :

| Solution | Principe |
|---|---|
| **Amorçage PXE** (*PreBoot Execution Environment*) | La carte réseau démarre l'ordinateur en allant chercher un OS sur un **serveur de déploiement** dédié. Ce serveur capture automatiquement le système et génère une image au format `.wim`, qu'il archive en vue de déploiements futurs |
| **Support WinPE amorçable** | En l'absence de serveur de déploiement : démarrage sur un DVD/clé USB/support externe contenant **WinPE** (*Windows Preinstallation Environment*), un mini OS en ligne de commande dédié à la capture et au déploiement d'image. Sa commande principale est **`dism`** (*Deployment Image Servicing and Management*) |

### 3.3 Mise à jour hors ligne de l'image capturée

Une fois l'image `.wim` capturée, elle peut être mise à jour en mode **offline** avec `dism`, par exemple pour y insérer des correctifs Windows Update (KB), des logiciels ou des pilotes.

```cmd
dism
```

### 3.4 Préparer le poste cible

Avant le déploiement, deux vérifications utiles :

- **Compatibilité matérielle** : des utilitaires gratuits téléchargeables sur le site de Microsoft permettent de valider que la configuration matérielle du poste cible respecte les prérequis de l'OS ;
- **Préparation du volume de destination** : WinPE fournit plusieurs outils pour préparer le volume qui accueillera les fichiers du futur système — `diskpart`, `mount`, PowerShell, `net use`, `bcdboot`, entre autres.

---

## 4. Déploiement d'une image

### 4.1 Déploiement via un serveur de déploiement

Une fois l'image `.wim` capturée et stockée en lieu sûr, elle est destinée à être déployée. Le **serveur de déploiement** permet un déploiement **en masse** (10, 50, 200, 500 postes clients...), avec un gain de temps considérable : plus besoin de gérer manuellement l'installation ni la validation de chaque nouvel ordinateur.

Déroulement côté poste cible :
1. démarrer en **PXE** (boot réseau) ;
2. se connecter au serveur de déploiement ;
3. choisir l'image de référence à déployer.

### 4.2 Déploiement sans serveur

En l'absence de serveur de déploiement, un déploiement **au cas par cas** reste possible via le support bootable **WinPE** et la commande **`dism`**.

⚠️ Il faut au préalable créer le **volume d'accueil** destiné à héberger le contenu de l'image `.wim`.


## ✅ Points clés à retenir

- Les images de référence (masters) répondent au besoin de productivité des équipes IT, en complément d'un parc matériel/logiciel aussi homogène que possible.
- Un master se construit en 4 étapes : installation de l'OS sur une config matérielle standard, configuration initiale (pilotes), installation des applications validées, puis préparation au clonage via **sysprep**.
- Sysprep (`sysprep /oobe /generalize /shutdown`) généralise le système (nouveau SID à chaque démarrage, indispensable pour rejoindre un domaine AD) ; il faut arrêter le poste sans le redémarrer avant capture, sous peine de devoir tout recommencer.
- Sysprep a des limites connues : incompatible avec certains rôles serveur et les apps du Microsoft Store, supprime les pilotes installés manuellement (sauf `/PersistAllDevicesInstall`), et ne supprime pas les comptes locaux (à gérer manuellement via le compte Administrateur).
- La capture de l'image (format `.wim`) se fait via un **serveur de déploiement** (amorçage PXE, capture et archivage automatiques) ou via un support **WinPE** bootable et la commande **`dism`**, qui sert aussi à mettre à jour l'image hors ligne.
- Le déploiement se fait en masse via le serveur de déploiement (boot PXE + sélection de l'image), ou au cas par cas via WinPE/`dism`, en préparant au préalable le volume de destination.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-12-introduction-a-la-capture-et-au-deploiement-d-images"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-12-introduction-a-la-capture-et-au-deploiement-d-images-data">
[
  {
    "question": "Pourquoi une équipe technique cherche-t-elle à tendre vers un parc informatique et un parc de systèmes d'exploitation homogènes ?",
    "options": ["Pour réduire les configurations à gérer et le temps de maintien, gagnant ainsi en productivité", "Pour augmenter artificiellement le coût du matériel", "Parce que la loi l'impose dans toutes les entreprises", "Pour empêcher les utilisateurs d'installer des logiciels"],
    "correctIndex": 0,
    "explanation": "Un parc homogène (matériel et systèmes d'exploitation) permet de réduire le nombre de configurations différentes à gérer et le temps de maintien, ce qui se traduit par un gain de productivité pour l'équipe technique."
  },
  {
    "question": "Qu'est-ce qu'une image de référence, aussi appelée \"master\" ?",
    "options": ["Une sauvegarde complète des données personnelles des utilisateurs", "Un OS prêt à démarrer, à jour, et dans l'idéal muni des logiciels de l'entreprise prêts à l'emploi", "Un fichier de configuration du pare-feu partagé entre tous les postes", "Une licence Windows unique valable pour tout le parc informatique"],
    "correctIndex": 1,
    "explanation": "Une image de référence, ou master, est un OS prêt à être démarré, à jour, et possédant dans l'idéal les logiciels de l'entreprise déjà installés et prêts à l'emploi."
  },
  {
    "question": "Sur quel type de poste doit-on installer l'OS lors de la création d'un master ?",
    "options": ["Sur n'importe quel poste, peu importe sa configuration matérielle", "Uniquement sur un serveur dédié, jamais sur un poste client", "Sur un ordinateur possédant la configuration matérielle la plus standard de l'entreprise", "Uniquement sur une machine virtuelle, jamais sur du matériel physique"],
    "correctIndex": 2,
    "explanation": "La création d'un master commence par l'installation de l'OS sur un ordinateur possédant la configuration matérielle la plus standard possible dans l'entreprise, afin de maximiser la compatibilité lors du déploiement."
  },
  {
    "question": "Quel est le rôle principal de l'outil natif sysprep lors de la préparation d'un master ?",
    "options": ["Installer automatiquement tous les pilotes manquants depuis Internet", "Chiffrer l'intégralité du disque dur du master", "Supprimer définitivement le système d'exploitation après utilisation", "Réinitialiser les paramètres personnalisés du master pour rendre les postes uniques dans l'entreprise"],
    "correctIndex": 3,
    "explanation": "Sysprep a pour but de réinitialiser les paramètres personnalisés du master, afin que chaque poste déployé à partir de cette image reste unique dans l'entreprise, notamment via la génération d'un nouveau SID."
  },
  {
    "question": "Pourquoi est-il indispensable que chaque ordinateur du parc possède un SID unique ?",
    "options": ["Pour pouvoir joindre un domaine Active Directory", "Pour permettre l'installation d'applications du Microsoft Store", "Pour activer la licence Windows automatiquement", "Pour accéder à Internet"],
    "correctIndex": 0,
    "explanation": "Chaque ordinateur du parc doit posséder un SID unique pour pouvoir joindre un domaine Active Directory, ce qui justifie l'importance de cocher la case \"généraliser\" lors de l'exécution de sysprep."
  },
  {
    "question": "À quoi correspond le mode OOBE (Out-of-Box Experience) évoqué lors de l'utilisation de sysprep ?",
    "options": ["À un mode de diagnostic réseau avancé", "Au mode qui permet de saisir les premières configurations après un démarrage \"sortie d'usine\"", "À un mode de sauvegarde automatique des données", "À l'interface de gestion des pilotes de périphériques"],
    "correctIndex": 1,
    "explanation": "Le mode OOBE (Out-of-Box Experience) est le mode qui permet de saisir les premières configurations après un démarrage \"sortie d'usine\", comme lors de la première installation d'une VM Windows 10."
  },
  {
    "question": "Quelles options de la commande sysprep en ligne de commande permettent de réaliser les mêmes étapes que via l'interface graphique (OOBE, généralisation, extinction) ?",
    "options": ["/install /update /restart", "/configure /reset /boot", "/oobe /generalize /shutdown", "/audit /capture /deploy"],
    "correctIndex": 2,
    "explanation": "En ligne de commande, les mêmes étapes sont réalisées avec l'exécutable sysprep suivi des options /oobe /generalize /shutdown."
  },
  {
    "question": "Dans quel dossier peut-on consulter les journaux générés par sysprep pour diagnostiquer un problème éventuel ?",
    "options": ["c:\\Windows\\inf", "c:\\Windows\\system32\\DriverStore", "c:\\Users\\Public\\Logs", "c:\\Windows\\system32\\sysprep\\Panther"],
    "correctIndex": 3,
    "explanation": "Les journaux de sysprep se trouvent dans le dossier c:\\Windows\\system32\\sysprep, dans le sous-dossier Panther."
  },
  {
    "question": "Pourquoi les applications installées depuis le Microsoft Store posent-elles problème avec sysprep ?",
    "options": ["Elles sont liées au profil de l'utilisateur et doivent être désinstallées avant la généralisation", "Elles ne sont jamais compatibles avec Windows 10", "Elles nécessitent une connexion Internet permanente", "Elles bloquent systématiquement l'extinction du système"],
    "correctIndex": 0,
    "explanation": "Les applications issues du Microsoft Store sont liées au profil de l'utilisateur ; elles doivent être désinstallées avant la généralisation, sous peine de provoquer des erreurs détaillées dans les journaux sysprep."
  },
  {
    "question": "Que fait sysprep par défaut avec les pilotes installés manuellement sur le master ?",
    "options": ["Il les conserve systématiquement, sans option particulière", "Il les supprime, dans le but de tendre vers la plus grande standardisation possible", "Il les chiffre pour éviter tout accès non autorisé", "Il les copie automatiquement sur un serveur distant"],
    "correctIndex": 1,
    "explanation": "Par défaut, sysprep supprime les pilotes installés manuellement afin de tendre vers la plus grande standardisation du master ; il faut utiliser l'option /PersistAllDevicesInstall pour les conserver."
  },
  {
    "question": "Quelle option de la commande sysprep permet de conserver les pilotes installés manuellement plutôt que de les supprimer ?",
    "options": ["/generalize", "/oobe", "/PersistAllDevicesInstall", "/shutdown"],
    "correctIndex": 2,
    "explanation": "L'option /PersistAllDevicesInstall permet de conserver les pilotes installés manuellement sur le master, qui seraient sinon supprimés par défaut lors de la généralisation."
  },
  {
    "question": "Que se passe-t-il concernant les comptes utilisateurs de la base SAM lors de l'exécution de sysprep ?",
    "options": ["Ils sont tous automatiquement supprimés, y compris le compte administrateur", "Ils sont fusionnés en un seul compte générique", "Sysprep les migre automatiquement vers Active Directory", "Ils ne sont pas supprimés par Windows, seul le compte administrateur est réinitialisé par sysprep"],
    "correctIndex": 3,
    "explanation": "Les comptes utilisateurs de la base SAM ne sont pas supprimés par Windows : seul le compte administrateur est réinitialisé par sysprep. La bonne pratique consiste à utiliser ce compte admin pour supprimer manuellement les autres utilisateurs et leurs profils."
  },
  {
    "question": "Que faut-il faire si le poste de référence (master), après exécution de sysprep, est redémarré par mégarde avant la capture de son image ?",
    "options": ["Il faut refaire un sysprep, car les avantages de la préparation précédente sont perdus", "Rien, cela n'a aucune conséquence sur la capture", "Il faut immédiatement réinstaller l'OS depuis zéro", "Il faut recréer un nouveau SID manuellement via PowerShell"],
    "correctIndex": 0,
    "explanation": "Si le poste de référence est redémarré par mégarde après le sysprep et avant la capture de l'image, tous les avantages de la préparation sont perdus et il faut refaire un sysprep."
  },
  {
    "question": "Qu'est-ce que l'amorçage PXE (PreBoot Execution Environment) utilisé pour capturer une image sans redémarrer la machine de référence sur son propre OS ?",
    "options": ["Un mode de démarrage accéléré du BIOS", "Un démarrage via la carte réseau vers un serveur de déploiement dédié", "Une technique de chiffrement du disque au démarrage", "Un protocole de synchronisation de l'horloge système"],
    "correctIndex": 1,
    "explanation": "L'amorçage PXE permet à la carte réseau d'aller chercher un OS sur un serveur dédié, appelé serveur de déploiement, qui se charge automatiquement de capturer le système et d'en créer une image."
  },
  {
    "question": "Dans quel format est généralement stockée l'image capturée d'un système (le document mentionne \".win\", ce qui correspond en réalité au format Windows standard) ?",
    "options": ["Le format .iso exclusivement", "Le format .vhdx exclusivement", "Le format .wim (Windows Imaging Format)", "Le format .exe"],
    "correctIndex": 2,
    "explanation": "Le format d'image généré et utilisé pour la capture/déploiement Windows est le .wim (Windows Imaging Format) ; le document utilisait l'abréviation \".win\", vraisemblablement une coquille pour ce format bien connu."
  },
  {
    "question": "Que signifie l'acronyme WinPE, utilisé lorsqu'on ne dispose pas de serveur de déploiement pour capturer une image ?",
    "options": ["Windows Public Edition", "Windows Partition Engine", "Windows Printer Explorer", "Windows Preinstallation Environment"],
    "correctIndex": 3,
    "explanation": "WinPE signifie Windows Preinstallation Environment : un mini OS en ligne de commande, démarrable depuis un DVD, une clé USB ou un autre support externe, dédié à la capture et au déploiement d'images."
  },
  {
    "question": "Quelle est la commande principale de WinPE, utilisée pour la capture, la mise à jour offline et le déploiement d'images système ?",
    "options": ["dism (Deployment Image Servicing and Management)", "diskpart", "sysprep", "bcdboot"],
    "correctIndex": 0,
    "explanation": "La commande dism (Deployment Image Servicing and Management tool) est la commande principale et la plus puissante de WinPE pour la capture, la mise à jour offline et le déploiement d'images système."
  },
  {
    "question": "Que peut-on faire sur une image .wim capturée, en mode offline, à l'aide de la commande dism ?",
    "options": ["Modifier uniquement la résolution d'écran par défaut", "Y insérer des correctifs Windows Update (KB), des logiciels ou des pilotes", "Chiffrer automatiquement l'ensemble de son contenu", "La convertir automatiquement en machine virtuelle"],
    "correctIndex": 1,
    "explanation": "La commande dism permet de mettre à jour une image .wim en mode offline, en y insérant par exemple des mises à jour Windows Update (KB), des logiciels ou des pilotes supplémentaires."
  },
  {
    "question": "Parmi les outils suivants disponibles dans WinPE, lequel permet de préparer le volume du poste cible destiné à accueillir le futur système ?",
    "options": ["nslookup", "ping", "diskpart", "firewall.cpl"],
    "correctIndex": 2,
    "explanation": "WinPE propose notamment l'outil diskpart (ainsi que mount, PowerShell, net use, bcdboot) pour préparer et s'assurer que le poste cible possède un volume prêt à accueillir les fichiers du futur système."
  },
  {
    "question": "Quel est l'avantage principal d'un serveur de déploiement pour installer un même master sur un grand nombre de postes (10, 50, 200, 500) ?",
    "options": ["Il supprime complètement le besoin de créer une image de référence", "Il remplace l'usage de sysprep sur le master", "Il ne fonctionne que pour des postes identiques au master, sans aucune autre condition", "Il permet de déployer en masse sans avoir à installer et valider chaque poste manuellement, pour un gain de temps considérable"],
    "correctIndex": 3,
    "explanation": "Le serveur de déploiement permet de déployer en masse une image sur de nombreux postes clients, sans avoir à s'occuper de l'installation et de la validation de chaque ordinateur individuellement, ce qui représente un gain de temps considérable."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-12-introduction-a-la-capture-et-au-deploiement-d-images",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-12-introduction-a-la-capture-et-au-deploiement-d-images-data",
    });
  });
</script>
