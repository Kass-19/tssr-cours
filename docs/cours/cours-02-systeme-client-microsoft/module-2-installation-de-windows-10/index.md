# Module 2 : Installation de Windows 10

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module présente les prérequis matériels pour installer Windows 10, les fichiers et supports nécessaires, les différents types d'installation, le processus de migration d'un poste à l'autre, et une démonstration complète d'installation sur machine virtuelle.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Les prérequis matériels

| Composant | 32 bits | 64 bits |
|---|---|---|
| **Processeur** | 1 GHz minimum | 1 GHz minimum |
| **Mémoire vive (RAM)** | 1 Go | 2 Go |
| **Espace de stockage** | 16 Go | 32 Go |

📌 Ces valeurs sont des **minimums stricts** — avec l'évolution de l'OS et l'ajout de logiciels, il est recommandé de prévoir davantage, en particulier pour le stockage (données personnelles) et la RAM.

L'espace de stockage indiqué couvre le système d'exploitation lui-même **et** ses futures mises à jour — il ne comprend pas l'espace nécessaire aux données personnelles de l'utilisateur, à prévoir en plus.

### Pourquoi privilégier le 64 bits ?

L'architecture 64 bits est une évolution matérielle qui permet des échanges d'informations plus fiables et plus rapides entre les composants — le système d'exploitation doit lui-même être adapté à cette architecture pour exploiter pleinement le matériel.

| Avantage du 64 bits | Détail |
|---|---|
| **Gestion mémoire** | Prise en charge native de **plus de 4 Go de RAM** (limite technique du 32 bits) |
| **Démarrage sécurisé** | Intègre le **UEFI Secure Boot** pour une meilleure protection au démarrage |
| **Fiabilité des pilotes** | N'accepte que les périphériques dont le pilote est **signé et approuvé par Microsoft** — réduit le risque d'écran bleu (*Blue Screen of Death*) |

---

## 2. Les fichiers et supports d'installation

Pour installer Windows, on a besoin d'un ensemble de **fichiers système**, regroupés dans une archive appelée **image**, au format **.wim** (*Windows Imaging*).

| Fichier | Rôle |
|---|---|
| **install.wim** | Contient l'ensemble des fichiers système qui seront déployés sur le disque dur |
| **boot.wim** | Mini système d'exploitation très léger, affiché au démarrage **avant même** que Windows ne soit installé — c'est lui qui permet de lancer le processus d'installation |

### Où trouver l'image Windows ?

| Support | Remarque |
|---|---|
| **DVD** | Méthode historique |
| **Clé USB bootable** | Support moderne le plus courant |
| **Image ISO** | Équivalent virtuel d'un DVD, montable directement |
| **Partage réseau** | Contient souvent plusieurs images .wim, pour déployer différentes instances de Windows |

---

## 3. Les types d'installation

| Type | Description | Avis technique |
|---|---|---|
| **Nouvelle installation** | Sur du matériel neuf, ou sur un disque dont le contenu sera **effacé** | Méthode recommandée : fiable, propre |
| **Mise à niveau** | Installer Windows 10 **par-dessus** un Windows existant, sans effacer | **À éviter** : réduit la fiabilité du système |

⚠️ **Limites de la mise à niveau** :
- Impossible depuis **Windows XP** ou **Windows Vista**.
- Installer Windows 10 par-dessus un Windows 7 peu fiable est fortement déconseillé.
- Reste toutefois envisageable dans des cas précis : conserver des données difficiles à exporter, ou continuer à utiliser des logiciels dont on n'a plus les sources d'installation.

---

## 4. Le déroulé du processus d'installation

1. **Démarrage sur le support d'installation** → le mini OS de `boot.wim` se lance, ouvrant l'environnement d'installation.
2. **Choix de l'édition** de Windows 10 (étape facultative selon le support utilisé).
3. **Choix du volume de destination** : un volume existant déjà formaté en NTFS, ou un nouveau volume créé pour l'occasion.
4. **Copie des fichiers système**, puis application des configurations de bas niveau.
5. **Redémarrage automatique** — le support d'installation peut alors être retiré, tout étant désormais présent sur le disque dur.
6. **Premier démarrage** : l'ordinateur boote directement depuis le disque dur et lance la personnalisation initiale du système.

### 💡 Astuce : contourner le compte Microsoft obligatoire (Windows 11)

Le document précise cette astuce pour **Windows 11** : pour démarrer en local sans compte Microsoft —

1. À l'écran de choix de région, appuyer sur **Shift + F10** (ouvre un terminal CMD).
2. Taper la commande : `start ms-cxh:localonly`
3. Valider avec **Entrée**.

---

## 5. La migration vers un nouveau poste

Lors du remplacement d'un poste de travail, l'équipe technique doit réfléchir à ce qui doit être transféré de l'ancien poste vers le nouveau :

| Élément à migrer |
|---|
| Comptes et profils des utilisateurs |
| Configurations particulières des logiciels installés localement |
| Outils bureautiques |
| Paramètres système (pilotes, messagerie, polices d'écriture) |
| Fichiers et dossiers |

### Les solutions de sauvegarde

- **Fichiers et dossiers** : idéalement via une **solution centralisée de sauvegarde** de l'entreprise. À défaut, Windows propose un outil natif : l'**outil de sauvegarde et restauration Windows 7**, conservé à l'identique dans Windows 10 (aucun changement depuis sa création).
- **Comptes, profils, configurations et logiciels** : via les scripts **USMT** (*User State Migration Tool*), un outil dédié de Microsoft dont la documentation complète est disponible sur son site.

**Exemple de script USMT** :
```
USMT /capture /i:migration.xml /l:logfile.log
```

📌 Un processus de migration bien mené garantit qu'aucune productivité n'est perdue lors du changement de poste.

---

## 6. Démonstration – Installation sur machine virtuelle

### Préparation

- VM VMware Workstation répondant aux prérequis.
- Média d'installation : une **image ISO**, montée directement dans le lecteur DVD virtuel de la VM (paramètres du lecteur DVD → monter l'ISO).
- Vérification préalable de la présence de `install.wim` (ex. 4,29 Go) et `boot.wim` (beaucoup plus léger) sur le support.

### Déroulé de l'installation

| Étape | Détail |
|---|---|
| **1. Démarrage** | La VM (vide, sans OS) recherche un OS selon son ordre de démarrage → détecte le DVD virtuel → lance `boot.wim` → message *« Press any key to boot from CD or DVD »* |
| **2. Langue** | Configuration de l'environnement en français, choix « Installer » (et non « Réparer ») |
| **3. Activation** | Pas de clé d'activation disponible → activation différée, avec un **délai de grâce de 30 jours** (toutes fonctionnalités disponibles) |
| **4. Édition** | Choix entre **Windows 10 Professionnel** et l'édition **N** (dépouillée de certaines fonctionnalités multimédia) → sélection de l'édition standard |
| **5. CLUF** | Acceptation du Contrat de Licence Utilisateur Final |
| **6. Type d'installation** | **Personnalisée**, faute d'OS existant sur la VM |
| **7. Disque cible** | Sélection du disque neuf de 60 Go |
| **8. Copie des fichiers** | Déploiement du contenu de l'image sur le volume, puis préparation de Windows 10 |
| **9. Redémarrage** | Le firmware détecte l'OS désormais présent sur le disque, et gère le premier démarrage |
| **10. OOBE** (*Out-of-Box Experience*) | Choix de la région (France), disposition du clavier, puis **« Je n'ai pas Internet »** (VM non connectée) → installation limitée |
| **11. Premier utilisateur** | Création du compte « Demo User », définition d'un mot de passe et de 3 questions de sécurité |
| **12. Finalisation** | Dernières configurations, puis arrivée sur le bureau de « Demo User » — installation terminée |

---

## ✅ Points clés à retenir

- Prérequis à retenir : **1 GHz CPU**, **1/2 Go RAM** (32/64 bits), **16/32 Go stockage** (32/64 bits) — le **64 bits** est recommandé pour la RAM >4 Go, le Secure Boot UEFI, et la fiabilité des pilotes signés.
- Deux fichiers clés : **install.wim** (fichiers système à déployer) et **boot.wim** (mini OS de démarrage).
- **Nouvelle installation** = recommandée ; **mise à niveau** = à éviter (impossible depuis XP/Vista, réduit la fiabilité).
- Processus d'installation : boot sur le support → édition → volume → copie des fichiers → redémarrage → personnalisation au premier démarrage.
- Migration : penser aux **comptes/profils**, **configurations logicielles**, **paramètres système**, **fichiers/dossiers** — outil dédié : **USMT**.
- En démonstration : l'activation offre un **délai de grâce de 30 jours**, et le choix « Je n'ai pas Internet » permet une installation locale complète sans compte Microsoft.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-2-installation-de-windows-10"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-2-installation-de-windows-10-data">
[
  {
    "question": "Quelle configuration processeur minimale est requise pour installer Windows 10 ?",
    "options": ["Un processeur capable de fournir une puissance de calcul d'1 GHz", "Un processeur multicœur cadencé à au moins 2 GHz", "Un processeur 64 bits exclusivement", "Un processeur compatible avec la virtualisation matérielle"],
    "correctIndex": 0,
    "explanation": "Windows 10 nécessite au minimum un processeur capable de fournir une puissance de calcul d'1 GHz, quelle que soit l'architecture (32 ou 64 bits)."
  },
  {
    "question": "Quelle quantité de mémoire vive minimale est requise pour installer une version 64 bits de Windows 10 ?",
    "options": ["1 Go", "2 Go", "4 Go", "512 Mo"],
    "correctIndex": 1,
    "explanation": "Windows 10 nécessite 1 Go de RAM pour un système 32 bits et 2 Go pour un système 64 bits, bien qu'il soit recommandé de prévoir davantage selon l'usage."
  },
  {
    "question": "Quel espace de stockage minimal est requis pour installer une version 64 bits de Windows 10 ?",
    "options": ["16 Go", "8 Go", "32 Go", "64 Go"],
    "correctIndex": 2,
    "explanation": "L'installation de Windows 10 nécessite 16 Go d'espace pour un système 32 bits et 32 Go pour un système 64 bits, afin d'accueillir le système et ses mises à jour."
  },
  {
    "question": "Quel avantage majeur un système Windows 10 64 bits offre-t-il par rapport à un système 32 bits en matière de mémoire ?",
    "options": ["Il divise automatiquement la RAM disponible par deux", "Il n'a besoin d'aucune mémoire vive pour fonctionner", "Il limite la RAM utilisable à 4 Go maximum", "Il peut gérer nativement plus de 4 Go de mémoire vive"],
    "correctIndex": 3,
    "explanation": "Contrairement à un système 32 bits limité à environ 4 Go de RAM adressable, un système Windows 10 64 bits peut gérer de manière native plus de 4 Go de mémoire vive."
  },
  {
    "question": "Quelle technologie de firmware un système Windows 10 64 bits utilise-t-il pour offrir un démarrage sécurisé ?",
    "options": ["L'UEFI", "Le BIOS traditionnel uniquement", "Le protocole USMT", "Le système de fichiers NTFS"],
    "correctIndex": 0,
    "explanation": "Les systèmes 64 bits intègrent le démarrage sécurisé grâce au firmware UEFI, ce qui renforce la protection du système dès son démarrage."
  },
  {
    "question": "Pourquoi un système Windows 10 64 bits réduit-il le risque d'écran bleu (blue screen of death) lié aux pilotes ?",
    "options": ["Parce qu'il désactive automatiquement tous les pilotes tiers", "Parce qu'il ne prend en charge que les pilotes signés et approuvés par Microsoft", "Parce qu'il n'utilise aucun pilote pour fonctionner", "Parce qu'il limite le nombre de périphériques connectés simultanément"],
    "correctIndex": 1,
    "explanation": "Un système 64 bits n'accepte que les pilotes dont la signature a été approuvée par Microsoft, ce qui améliore la fiabilité et réduit le risque d'erreurs critiques comme le blue screen of death."
  },
  {
    "question": "Quel fichier contient l'ensemble des fichiers système déployés sur le disque dur lors de l'installation de Windows ?",
    "options": ["boot.wim", "migration.xml", "install.wim", "logfile.log"],
    "correctIndex": 2,
    "explanation": "L'image install.wim (Windows Imaging Format) regroupe l'ensemble des fichiers système qui seront déployés sur le disque dur de l'ordinateur lors de l'installation."
  },
  {
    "question": "Quel est le rôle du fichier boot.wim lors du démarrage sur un support d'installation Windows ?",
    "options": ["Il contient l'ensemble des fichiers système finaux de Windows", "Il enregistre les journaux d'erreurs de l'installation", "Il stocke les scripts de migration USMT", "Il lance un mini système d'exploitation permettant de démarrer l'environnement d'installation"],
    "correctIndex": 3,
    "explanation": "boot.wim est un mini système d'exploitation, très léger, qui se lance au démarrage du support d'installation et permet d'afficher l'environnement d'installation avant même que Windows ne soit installé sur le disque."
  },
  {
    "question": "Pourquoi une mise à niveau (upgrade) vers Windows 10 est-elle généralement déconseillée par les techniciens ?",
    "options": ["Parce qu'installer Windows 10 par-dessus un système existant réduit la fiabilité du système", "Parce qu'elle est plus lente qu'une installation propre", "Parce qu'elle nécessite obligatoirement une connexion Internet", "Parce qu'elle efface systématiquement toutes les données de l'utilisateur"],
    "correctIndex": 0,
    "explanation": "La mise à niveau consiste à installer Windows 10 par-dessus un Windows existant ; ce type d'installation réduit la fiabilité du système et est donc généralement évité, sauf cas particuliers."
  },
  {
    "question": "Depuis quels systèmes d'exploitation n'est-il pas possible de réaliser une mise à niveau directe vers Windows 10 ?",
    "options": ["Windows 7 ou Windows 8", "Windows XP ou Windows Vista", "Windows 8 ou Windows 8.1", "Windows Server 2012 ou Windows Server 2016"],
    "correctIndex": 1,
    "explanation": "Il n'est pas possible de réaliser une mise à niveau vers Windows 10 depuis un ordinateur équipé de Windows XP ou de Windows Vista, contrairement à une mise à niveau depuis Windows 7 ou 8."
  },
  {
    "question": "En quel système de fichiers le volume destiné à accueillir Windows 10 doit-il être formaté ?",
    "options": ["FAT32", "exFAT", "NTFS", "ext4"],
    "correctIndex": 2,
    "explanation": "Lors de l'installation, le volume choisi pour accueillir le système d'exploitation doit être formaté en NTFS, que ce soit un volume existant ou nouvellement créé."
  },
  {
    "question": "Que se passe-t-il à l'issue de la copie des fichiers système lors de l'installation de Windows 10 ?",
    "options": ["L'ordinateur s'éteint définitivement", "Une nouvelle image install.wim est automatiquement téléchargée", "Le support d'installation est reformaté", "Un redémarrage de l'ordinateur survient"],
    "correctIndex": 3,
    "explanation": "Une fois la copie des fichiers système et les configurations de bas niveau terminées, un redémarrage survient, ce qui est normal ; le support d'installation peut alors être retiré."
  },
  {
    "question": "Quels éléments doit-on typiquement prévoir de migrer lors du remplacement d'un poste de travail par un nouvel ordinateur ?",
    "options": ["Les comptes et profils utilisateurs, les configurations logicielles, les paramètres systèmes et les fichiers/dossiers", "Uniquement le fond d'écran et les raccourcis du bureau", "Uniquement les licences d'activation Windows", "Uniquement les pilotes des périphériques réseau"],
    "correctIndex": 0,
    "explanation": "La migration doit prendre en compte les comptes et profils des utilisateurs, les configurations des logiciels installés, les outils bureautiques, les paramètres systèmes (pilotes, messagerie, polices) ainsi que les fichiers et dossiers."
  },
  {
    "question": "Quel outil natif, conservé tel quel depuis Windows 7, permet de sauvegarder des fichiers et dossiers sous Windows 10 en l'absence de solution centralisée ?",
    "options": ["USMT (User State Migration Tool)", "L'outil de sauvegarde et restauration Windows 7", "L'assistant OOBE", "Le CLUF"],
    "correctIndex": 1,
    "explanation": "Windows 10 conserve l'outil de sauvegarde et restauration Windows 7, resté inchangé depuis sa création, pour sauvegarder les fichiers et dossiers en l'absence de solution centralisée."
  },
  {
    "question": "À quoi servent les scripts USMT (User State Migration Tools) ?",
    "options": ["À activer une licence Windows sans clé de produit", "À formater automatiquement le disque dur avant installation", "À migrer les comptes, profils et configurations des utilisateurs et logiciels vers un nouvel ordinateur", "À vérifier l'intégrité de l'image install.wim"],
    "correctIndex": 2,
    "explanation": "USMT permet de migrer les comptes, les profils et les configurations logicielles d'un ancien poste vers un nouvel ordinateur, à l'aide de scripts comme USMT /capture /i:migration.xml /l:logfile.log."
  },
  {
    "question": "Lors de l'installation de Windows 10, de combien de jours dispose-t-on généralement avant d'activer le système avec une clé de produit, tout en bénéficiant de toutes les fonctionnalités ?",
    "options": ["7 jours", "90 jours", "180 jours", "30 jours (délai de grâce)"],
    "correctIndex": 3,
    "explanation": "L'installateur propose un délai de grâce de 30 jours durant lequel Windows fonctionne avec toutes ses fonctionnalités disponibles, même sans clé d'activation renseignée."
  },
  {
    "question": "Quelle particularité distingue l'édition N de Windows 10 des autres éditions ?",
    "options": ["Elle est dépouillée de certaines fonctionnalités multimédia", "Elle intègre des fonctionnalités multimédia supplémentaires", "Elle ne peut pas être activée avec une licence OEM", "Elle est réservée exclusivement aux serveurs d'entreprise"],
    "correctIndex": 0,
    "explanation": "L'édition N de Windows 10 est une variante dépouillée de certaines fonctionnalités multimédia, proposée notamment pour répondre à des exigences réglementaires dans certaines régions."
  },
  {
    "question": "Quel document doit être accepté pour poursuivre l'installation de Windows 10, après le choix de l'édition ?",
    "options": ["Le script de migration USMT", "Le CLUF (Contrat de Licence Utilisateur Final)", "Le fichier boot.wim", "Le rapport de télémétrie Windows Insider"],
    "correctIndex": 1,
    "explanation": "Avant de poursuivre l'installation, l'utilisateur doit accepter le CLUF (Contrat de Licence Utilisateur Final), qui définit les règles d'utilisation du système."
  },
  {
    "question": "Que se passe-t-il si l'on choisit « Je n'ai pas Internet » lors de la configuration initiale (OOBE) de Windows 10 ?",
    "options": ["L'installation s'interrompt automatiquement", "Windows crée un compte Microsoft factice sans connexion", "L'installation continue avec des fonctionnalités limitées", "Le processus bascule automatiquement vers une mise à niveau"],
    "correctIndex": 2,
    "explanation": "En l'absence de connexion Internet lors de l'assistant OOBE (Out-of-Box Experience), l'utilisateur peut choisir « Je n'ai pas Internet » et poursuivre l'installation avec une configuration limitée, notamment sans compte Microsoft."
  },
  {
    "question": "Quel type d'installation choisit-on typiquement lorsqu'un ordinateur ne possède encore aucun système d'exploitation ?",
    "options": ["Une mise à niveau", "Une installation via USMT", "Une installation via l'outil de sauvegarde et restauration Windows 7", "Une installation personnalisée"],
    "correctIndex": 3,
    "explanation": "En l'absence de système d'exploitation existant, on procède à une installation personnalisée, qui permet de choisir précisément où déployer Windows sur le disque dur, plutôt qu'une mise à niveau qui suppose un OS déjà présent."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-2-installation-de-windows-10",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-2-installation-de-windows-10-data",
    });
  });
</script>
