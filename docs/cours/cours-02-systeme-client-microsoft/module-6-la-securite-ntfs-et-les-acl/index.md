# Module 6 : La sécurité NTFS et les ACL

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module présente les ACL (listes de contrôle d'accès) sous NTFS : leur structure (DACL, ACE), les niveaux d'autorisation, les règles de fonctionnement (cumul, refus, héritage, impact des déplacements/copies), et les bonnes pratiques de gestion en tant qu'administrateur.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Qu'est-ce qu'une ACL ?

Sur un volume formaté en **NTFS**, tous les fichiers et répertoires sont soumis à la sécurité NTFS : des **autorisations** définissent les droits d'accès à ces objets. Lorsqu'un utilisateur tente d'accéder à une ressource, il présente son **jeton d'accès** (voir Module 5), qui est filtré par la ressource — donnant ou bloquant l'accès.

Ces autorisations sont stockées dans l'**index** du système de fichiers NTFS, et sont consultables/modifiables depuis l'onglet **Sécurité** de chaque objet (clic droit → Propriétés).

### La structure d'une ACL

| Élément | Rôle |
|---|---|
| **DACL** (*Discretionary Access Control List*) | La liste elle-même : contient les **utilisateurs et groupes** concernés par les autorisations sur l'objet |
| **ACE** (*Access Control Entry*) | Pour chaque groupe de la DACL, définit **les actions possibles** sur l'objet |

En pratique, la DACL contient surtout des **groupes locaux** créés au préalable, des **groupes prédéfinis** (ex. Administrateurs) et des **entités de sécurité** — rarement des utilisateurs individuels.

📌 **Bonne pratique** : éviter au maximum d'insérer des **utilisateurs** directement dans une DACL — il est bien plus simple de gérer 10 groupes que 100 utilisateurs. On ajoute donc les utilisateurs à des groupes, et ce sont les groupes qu'on place dans la DACL.

---

## 2. Les niveaux d'autorisation (ACE de base)

Pour les besoins courants (la grande majorité des cas en entreprise), on utilise les **ACE de base**, qui sont **cumulatives** — chaque niveau inclut les droits du niveau précédent. Configurables depuis le bouton **Modifier** de l'onglet Sécurité.

| Niveau | Droits |
|---|---|
| **Lecture** | Lire des fichiers, exécuter des programmes, afficher le contenu d'un dossier |
| **Modification** | Tout ce que permet Lecture, **+** modifier, créer et supprimer des objets dans le répertoire |
| **Contrôle total** | Tout ce que permet Modification, **+** gérer soi-même les **ACL** de l'objet |

📌 Il est conseillé de se limiter **au maximum à ces 3 niveaux** pour la majorité des usages.

### Les autorisations spéciales

Dans des cas plus rares où un besoin d'accès plus fin se présente, on configure des **autorisations spéciales**, disponibles via le bouton **Avancé** de l'onglet Sécurité (ex. autoriser un utilisateur à créer des fichiers, mais pas à les imprimer).

---

## 3. Les règles de fonctionnement des ACL

### Autorisation explicite et refus implicite

Les permissions reposent sur des **règles explicites** : il faut explicitement ajouter un groupe à la DACL, et un accès dans son ACE. Un groupe **absent** de la DACL se voit refuser l'accès automatiquement — c'est le **refus implicite**.

Il n'existe que 2 états possibles pour un accès :

| État | Effet |
|---|---|
| **Autorisé** | Accès accordé |
| **Refusé** | Accès bloqué |

### Cumul des règles et priorité du refus

Un utilisateur peut appartenir à **plusieurs groupes**, chacun potentiellement présent dans la DACL avec des règles différentes.

| Situation | Règle qui s'applique |
|---|---|
| Plusieurs groupes avec des niveaux d'accès **différents mais tous autorisés** | Le niveau d'accès **le plus élevé** l'emporte |
| Un groupe **autorise** un accès, un autre le **refuse explicitement** | Le **refus explicite l'emporte toujours** — pour des raisons de sécurité |

### Les mécanismes d'héritage

L'**héritage** fait partie intégrante de la sécurité NTFS — un point important à bien comprendre.

- Par défaut, un répertoire **propage ses autorisations** à ses objets enfants (sous-répertoires et fichiers contenus).
- En consultant les autorisations d'un objet enfant, les autorisations **héritées** apparaissent **grisées** et ne sont **pas modifiables** directement.

**Comment modifier une autorisation héritée ?**

| Méthode | Comment |
|---|---|
| **1. Modifier au niveau du parent** | Modifier les autorisations sur le dossier parent (parfois même remonter jusqu'à la racine du lecteur) pour qu'elles s'appliquent |
| **2. Désactiver l'héritage** | Si les modifications au niveau du parent impactent d'autres objets enfants indésirablement, on peut **désactiver l'héritage** sur l'objet concerné — les autorisations grisées deviennent alors noires et **modifiables** |

### Impact des déplacements et copies de fichiers

Puisque l'héritage est central à la sécurité NTFS, déplacer ou copier un fichier a un impact direct sur ses autorisations d'accès :

| Action | Effet sur les autorisations |
|---|---|
| **Couper/coller au sein du même volume** | Autorisations **conservées** — c'est le même index de système de fichiers qui est concerné |
| **Déplacer vers un autre volume** | L'objet est considéré comme **nouveau** → ce sont les autorisations **héritées de la destination** qui s'appliquent |
| **Copier** (même volume ou non) | Toujours considéré comme un **nouvel objet** → autorisations héritées de la destination |

---

## 4. Vérifier et gérer les ACL en tant qu'administrateur

Une fois les ACL configurées, il faut **toujours tester les accès** des utilisateurs, si possible **directement avec eux** (les appeler, prendre contact) — une bonne pratique qui permet aussi à l'équipe technique d'échanger avec les utilisateurs pour d'autres raisons qu'une panne ou un incident.

Autre méthode : tester les accès depuis l'onglet **« Accès effectif »**, disponible dans l'onglet **Avancé** de la sécurité — qui simule l'accès réel d'un utilisateur ou groupe donné sans avoir besoin de se connecter avec son compte.

📌 Il faut **toujours tester les accès avant** d'annoncer qu'un partage est en production.

---

## ✅ Points clés à retenir

- Les ACL sont à manipuler avec **précaution**. Bonnes pratiques à suivre :

| Bonne pratique | Pourquoi |
|---|---|
| **Privilégier les groupes** dans les DACL, éviter les utilisateurs individuels | Plus simple à gérer à l'échelle (10 groupes vs 100 utilisateurs) |
| **Utiliser au maximum les ACE de base** (Lecture, Modification, Contrôle total) | Suffisent à la grande majorité des besoins, plus simples à auditer |
| **Garder en tête les mécanismes d'héritage**, privilégier les droits hérités | Cohérence et simplicité de gestion dans l'arborescence |
| **Privilégier le refus implicite** plutôt que de cocher des cases « Refus » explicites | Un refus explicite est plus difficile à tracer/désactiver qu'une simple absence de la DACL |
| **Toujours tester** les actions sur les ACL, idéalement avec l'utilisateur concerné | Évite les mauvaises surprises en production |

- Règle de priorité à retenir absolument : en cas de conflit entre plusieurs groupes d'un même utilisateur, c'est le **niveau le plus élevé** qui l'emporte entre autorisations — **sauf** si un **refus explicite** existe quelque part, auquel cas **le refus gagne toujours**.
- **Déplacement/copie** : rester sur le **même volume en coupant/collant** conserve les autorisations d'origine ; tout le reste (autre volume, ou copie) applique les autorisations **héritées de la destination**.

⚠️ **Attention à l'UAC pour les administrateurs** : même en étant membre du groupe Administrateurs, le système considère d'abord l'utilisateur comme un utilisateur **standard** (voir Module 5) — ce qui peut avoir des effets indésirables lors de manipulations d'ACL si l'élévation de privilège n'est pas correctement gérée. Il est possible de désactiver ce comportement via les stratégies de sécurité, mais cela reste déconseillé pour des raisons de sécurité.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-6-la-securite-ntfs-et-les-acl"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-6-la-securite-ntfs-et-les-acl-data">
[
  {
    "question": "Sur quel système de fichiers les ACL (Access Control List) sont-elles utilisées pour sécuriser les fichiers et dossiers ?",
    "options": ["NTFS", "FAT32", "exFAT", "ReFS"],
    "correctIndex": 0,
    "explanation": "Sur un volume formaté en NTFS, tous les répertoires et fichiers sont soumis à la sécurité NTFS, dont les autorisations d'accès sont définies par les ACL et stockées dans l'index du système de fichiers."
  },
  {
    "question": "Où sont stockées les autorisations NTFS d'un fichier ou d'un dossier ?",
    "options": ["Dans la base SAM de l'ordinateur", "Dans l'index du système de fichiers NTFS", "Dans le fichier lui-même, sous forme de métadonnées cachées", "Dans le registre système exclusivement"],
    "correctIndex": 1,
    "explanation": "Les autorisations NTFS sont stockées dans l'index du système de fichiers, consultables et modifiables depuis l'onglet Sécurité de chaque objet."
  },
  {
    "question": "Que contient la DACL (Discretionary Access Control List) d'un objet NTFS ?",
    "options": ["Uniquement les fichiers journalisés par le système", "Le code source du système de fichiers NTFS", "Les utilisateurs et groupes concernés par les autorisations, en pratique surtout des groupes", "La liste des pilotes installés sur l'ordinateur"],
    "correctIndex": 2,
    "explanation": "La DACL contient les utilisateurs et groupes auxquels s'appliquent des autorisations ; en bonne pratique, on évite d'y insérer directement des utilisateurs, car il est plus simple de gérer un nombre restreint de groupes qu'un grand nombre d'utilisateurs individuels."
  },
  {
    "question": "Pourquoi est-il recommandé d'éviter d'insérer directement des utilisateurs dans une DACL, en privilégiant les groupes ?",
    "options": ["Parce que les utilisateurs ne peuvent techniquement pas être ajoutés à une DACL", "Parce que cela désactive automatiquement l'héritage NTFS", "Parce que les groupes offrent toujours un contrôle total, sans possibilité de restriction", "Parce qu'il est plus simple de gérer un nombre restreint de groupes qu'un grand nombre d'utilisateurs individuels"],
    "correctIndex": 3,
    "explanation": "Il est plus facile de gérer, par exemple, une dizaine de groupes plutôt qu'une centaine d'utilisateurs individuels ; c'est pourquoi la bonne pratique consiste à privilégier l'insertion de groupes dans les DACL."
  },
  {
    "question": "Que définissent les ACE (Access Control Entry) au sein d'une ACL ?",
    "options": ["Les actions possibles sur l'objet pour un groupe ou un utilisateur donné", "La liste des utilisateurs autorisés à se connecter au domaine", "Le chemin d'accès physique du fichier sur le disque", "La taille maximale autorisée pour un fichier"],
    "correctIndex": 0,
    "explanation": "Les ACE définissent, pour chaque groupe ou utilisateur présent dans la DACL, les actions possibles sur l'objet concerné (lecture, modification, contrôle total, etc.)."
  },
  {
    "question": "Quel niveau d'accès NTFS de base permet à un utilisateur de lire des fichiers, d'exécuter des programmes et d'afficher le contenu d'un dossier ?",
    "options": ["Le niveau Modification", "Le niveau Lecture", "Le niveau Contrôle total", "Les autorisations spéciales"],
    "correctIndex": 1,
    "explanation": "Le niveau Lecture est le premier niveau d'accès de base : il permet de lire des fichiers, d'exécuter des programmes et d'afficher le contenu d'un dossier."
  },
  {
    "question": "En plus des droits du niveau Lecture, que permet le niveau Modification ?",
    "options": ["Gérer soi-même les ACL de l'objet", "Configurer les autorisations spéciales uniquement", "Modifier les fichiers, ainsi que créer et supprimer des objets dans le répertoire", "Désactiver l'héritage NTFS"],
    "correctIndex": 2,
    "explanation": "Le niveau Modification conserve les droits du niveau Lecture, tout en permettant à l'utilisateur de modifier les fichiers ainsi que de créer et supprimer des objets dans le répertoire."
  },
  {
    "question": "Qu'est-ce qui distingue le niveau Contrôle total des niveaux Lecture et Modification ?",
    "options": ["Il empêche toute modification des fichiers existants", "Il n'accorde que des droits de lecture seule", "Il ne s'applique qu'aux entités intégrées de sécurité", "Il permet en plus à l'utilisateur de gérer lui-même les ACL de l'objet"],
    "correctIndex": 3,
    "explanation": "Le Contrôle total accorde les mêmes droits que le niveau Modification, mais permet en plus à l'utilisateur de gérer lui-même les ACL de l'objet en question."
  },
  {
    "question": "Depuis quel bouton de l'onglet Sécurité peut-on configurer des autorisations spéciales plus fines, comme autoriser la création de fichiers sans autoriser leur impression ?",
    "options": ["Le bouton Avancé", "Le bouton Modifier", "Le bouton Propriétaire", "Le bouton Hérité"],
    "correctIndex": 0,
    "explanation": "Les autorisations spéciales, qui permettent d'affiner les accès au-delà des trois niveaux de base, sont disponibles depuis le bouton Avancé de l'onglet Sécurité."
  },
  {
    "question": "Que se passe-t-il pour un groupe absent de la DACL d'un objet ?",
    "options": ["L'accès lui est automatiquement accordé en lecture seule", "L'accès lui est refusé implicitement", "Il hérite systématiquement du niveau Contrôle total", "Le système génère une erreur bloquant l'accès à tous les utilisateurs"],
    "correctIndex": 1,
    "explanation": "Les permissions NTFS reposent sur des règles explicites : un groupe absent de la DACL se voit refuser l'accès de manière implicite."
  },
  {
    "question": "Lorsqu'un utilisateur appartient à plusieurs groupes présents dans la DACL avec des niveaux d'accès différents (sans refus explicite), quelle autorisation l'emporte ?",
    "options": ["L'autorisation du groupe qui possède le plus bas niveau d'accès", "L'autorisation du groupe ajouté en dernier à la DACL", "L'autorisation du groupe qui possède le plus haut niveau d'accès", "Aucune autorisation ne s'applique, l'accès est bloqué par défaut"],
    "correctIndex": 2,
    "explanation": "Lorsque plusieurs groupes d'un même utilisateur figurent dans une DACL avec des niveaux d'accès différents, c'est le niveau d'accès le plus élevé qui l'emporte, sauf en cas de refus explicite."
  },
  {
    "question": "Si un utilisateur appartient à un groupe autorisant la lecture et à un autre groupe refusant explicitement la lecture, quelle règle l'emporte ?",
    "options": ["L'autorisation l'emporte toujours sur le refus explicite", "Le système accorde l'accès en lecture seule par défaut", "Le conflit doit être résolu manuellement par l'administrateur avant tout accès", "Le refus explicite l'emporte toujours sur l'autorisation"],
    "correctIndex": 3,
    "explanation": "Pour des raisons de sécurité, un refus explicite l'emporte toujours sur une autorisation, même si un autre groupe de l'utilisateur autorise cet accès."
  },
  {
    "question": "Par défaut, comment un répertoire NTFS transmet-il ses autorisations à ses objets enfants (sous-répertoires et fichiers contenus) ?",
    "options": ["Il les propage automatiquement par héritage", "Il ne les transmet jamais automatiquement, chaque objet doit être configuré manuellement", "Il les transmet uniquement si l'UAC est désactivé", "Il les transmet uniquement aux utilisateurs, jamais aux groupes"],
    "correctIndex": 0,
    "explanation": "Par défaut, un répertoire propage ses autorisations à ses objets enfants par héritage ; ces autorisations héritées apparaissent grisées et ne sont pas modifiables directement sur l'objet enfant."
  },
  {
    "question": "Comment reconnaît-on visuellement, dans l'onglet Sécurité, une autorisation héritée d'un objet parent ?",
    "options": ["Elle apparaît en rouge et clignotante", "Elle apparaît grisée et n'est pas directement modifiable", "Elle est précédée d'un astérisque", "Elle n'apparaît pas du tout dans la liste"],
    "correctIndex": 1,
    "explanation": "Les autorisations héritées apparaissent grisées dans l'onglet Sécurité et ne peuvent pas être modifiées directement sur l'objet enfant ; il faut agir sur le dossier parent ou désactiver l'héritage."
  },
  {
    "question": "Que se passe-t-il au niveau des autorisations NTFS lorsqu'on déplace un fichier par couper/coller au sein d'un même volume ?",
    "options": ["Les autorisations sont systématiquement réinitialisées aux valeurs par défaut", "Le fichier hérite automatiquement des autorisations du nouveau dossier de destination", "Les autorisations d'accès sont conservées, car c'est le même index du système de fichiers qui est concerné", "Toutes les autorisations spéciales sont supprimées"],
    "correctIndex": 2,
    "explanation": "Lors d'un déplacement au sein d'un même volume, les autorisations d'accès sont conservées, car il s'agit toujours du même index de système de fichiers."
  },
  {
    "question": "Que se passe-t-il au niveau des autorisations NTFS lorsqu'on copie un objet vers un autre volume, ou qu'on le déplace vers un volume différent ?",
    "options": ["Les autorisations d'origine sont automatiquement conservées à l'identique", "L'opération est bloquée par défaut pour des raisons de sécurité", "Seules les autorisations spéciales sont conservées, les niveaux de base sont réinitialisés", "L'objet est considéré comme nouveau et hérite des conditions d'accès du dossier de destination"],
    "correctIndex": 3,
    "explanation": "Lorsqu'un objet est copié vers un autre volume ou déplacé sur un volume différent, il est considéré comme un nouvel objet par le système de fichiers, et ce sont les conditions d'accès héritées du dossier de destination qui s'appliquent."
  },
  {
    "question": "Depuis quel onglet un administrateur peut-il tester les accès effectifs d'un utilisateur ou d'un groupe sur un objet NTFS ?",
    "options": ["L'onglet Accès effectif, disponible depuis l'onglet Avancé", "L'onglet Général", "L'onglet Propriétés réseau", "L'onglet Compatibilité"],
    "correctIndex": 0,
    "explanation": "L'onglet Accès effectif, accessible depuis l'onglet Avancé de la sécurité d'un objet, permet de tester les accès réels d'un utilisateur ou d'un groupe, en complément de vérifications directement avec les utilisateurs concernés."
  },
  {
    "question": "Parmi les bonnes pratiques de gestion des ACL rappelées en conclusion, laquelle concerne le choix entre refus implicite et refus explicite ?",
    "options": ["Toujours cocher les cases de refus explicite pour plus de clarté", "Privilégier le refus implicite plutôt que de cocher des cases de refus explicite", "Ne jamais utiliser le refus, qu'il soit implicite ou explicite", "Privilégier le refus explicite car il est plus rapide à configurer"],
    "correctIndex": 1,
    "explanation": "Parmi les bonnes pratiques, il est recommandé de privilégier le refus implicite (absence du groupe dans la DACL) plutôt que de cocher explicitement des cases de refus, ce qui simplifie la gestion et limite les risques d'erreur."
  },
  {
    "question": "Pourquoi l'UAC peut-il avoir un effet indésirable pour un administrateur manipulant des ACL ?",
    "options": ["Parce que l'UAC supprime automatiquement toutes les ACL configurées", "Parce que l'UAC empêche définitivement toute modification des ACL", "Parce que même membre du groupe Administrateurs, le système le considère d'abord comme un utilisateur standard, pour des raisons de sécurité", "Parce que l'UAC ne concerne que les utilisateurs de domaine, jamais les administrateurs locaux"],
    "correctIndex": 2,
    "explanation": "L'UAC fait en sorte que même un membre du groupe Administrateurs soit d'abord considéré comme un utilisateur standard par le système, ce qui peut produire des effets indésirables lors de la manipulation des ACL si l'élévation de privilèges n'est pas correctement gérée."
  },
  {
    "question": "Que recommande le module de faire systématiquement avant d'annoncer qu'un partage est en production ?",
    "options": ["Désactiver l'héritage NTFS sur l'ensemble du volume", "Supprimer tous les groupes prédéfinis de la DACL", "Activer le compte Administrateur générique", "Tester les accès des utilisateurs sur les ACL configurées"],
    "correctIndex": 3,
    "explanation": "Il est recommandé de toujours tester les accès des utilisateurs, si possible directement avec eux, avant d'annoncer qu'un partage est en production, afin de vérifier que les ACL configurées produisent le résultat attendu."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-6-la-securite-ntfs-et-les-acl",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-6-la-securite-ntfs-et-les-acl-data",
    });
  });
</script>
