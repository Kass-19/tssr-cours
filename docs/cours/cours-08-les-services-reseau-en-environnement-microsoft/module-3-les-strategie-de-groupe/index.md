# Module 3 : Les stratégie de groupe

*Cours : [Cours 8 - Les services réseau en environnement Microsoft](../index.md)*

## 🎯 Objectif du module

Ce module traite du fonctionnement des GPO : leur rôle, leur ciblage, leur ordre de traitement, et deux cas d'usage concrets (redirection de dossiers, déploiement d'imprimantes).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Le fonctionnement des GPO

Les **stratégies de groupe** interviennent sur les **ordinateurs** et les **utilisateurs** d'un domaine AD. Elles ajoutent de la sécurité, automatisent des actions (ex. fond d'écran commun) et réduisent la charge d'administration — mais leur configuration peut être complexe, et elles restent **dépendantes des systèmes d'exploitation** ciblés.

On distingue les **stratégies locales** (hors domaine, poste par poste) des **stratégies de groupe / GPO** (contexte de domaine). En cas de conflit, **les GPO l'emportent toujours sur la stratégie locale**.

Pourquoi privilégier les GPO plutôt que le registre ? Une modification du registre est fastidieuse et n'impacte qu'un seul poste, alors qu'une GPO, via sa propre console MMC, s'applique à un ensemble de machines en une seule configuration.

### Application des GPO

- Actualisation automatique : toutes les **90 minutes** (±30) pour les postes, toutes les **5 minutes** pour les contrôleurs de domaine.
- Forçage manuel : `gpupdate /force`
- Côté client, ce sont les **CSE** (*Client Side Extensions*) qui récupèrent et appliquent effectivement les paramètres.

### Les politiques par défaut

| Politique | Rôle |
|---|---|
| **DDP** (*Default Domain Policy*) | S'applique dès la racine du domaine, à tous les utilisateurs |
| **Default Domain Controller Policy** | Cible spécifiquement les contrôleurs de domaine |

📌 Pour cibler des éléments plus précis, il faut créer de nouvelles GPO liées aux OU concernées.

---

## 2. Le ciblage des stratégies

Une GPO se lie à un **site**, un **domaine**, ou une **OU** — sur ces objets, elle s'applique aux ordinateurs et/ou utilisateurs qui s'y trouvent. **Les GPO ne peuvent jamais s'appliquer sur des groupes** : lier une GPO à une OU qui ne contient que des groupes ne produirait donc aucun effet.

### Ordre de traitement

Le principe est proche de l'héritage NTFS :

1. Les stratégies sont **héritées du parent vers l'enfant**.
2. Les stratégies héritées sont appliquées **avant** celles du conteneur courant.
3. Une stratégie marquée **« appliquée »** devient prioritaire.
4. Entre plusieurs GPO d'un même niveau, celle avec le **numéro d'ordre le plus élevé** est appliquée en premier.

**Gestion des conflits** : si plusieurs GPO définissent des paramètres distincts → cumul. Si elles définissent des valeurs différentes pour le **même** paramètre → **la dernière appliquée (la plus proche de l'objet) l'emporte**.

### Restrictions et filtres

| Mécanisme | Effet |
|---|---|
| **Blocage d'héritage** | Annule la prise en compte des stratégies héritées sur un conteneur (à utiliser avec précaution) |
| **Statut « appliqué »** | Rend une GPO prioritaire, peut **outrepasser** un blocage d'héritage |
| **Filtres de sécurité** | Restreignent l'application via des règles de contrôle d'accès |
| **Filtres WMI** | Limitent l'application selon des critères techniques (OS, matériel...) |

---

## 3. La mise en œuvre des stratégies

Un paramètre de GPO possède un nom, un état, un support (OS compatibles), une description, et parfois un commentaire.

### États possibles

**Non configuré** / **Activé** / **Désactivé**.

Les GPO s'appuient sur des fichiers **.admx**, intégrés à la console MMC, pour gérer les personnalisations liées à des logiciels (ex. Microsoft Office) ou composants système (menu démarrer, barre des tâches...).

---

## 4. Démonstration – Création et application d'une GPO

Exemple : empêcher les utilisateurs de redémarrer/éteindre/mettre en veille leur machine.

1. Console **Gestion des stratégies de groupe** → créer une GPO liée à l'OU souhaitée.
2. **Stratégie → Modèles d'administration** → trouver le paramètre concerné.
3. État **Activé** → Appliquer → OK.
4. Vérifier via l'onglet **Paramètres** (liaisons, filtres, délégations).
5. `gpupdate /force` côté client plutôt que d'attendre les 90 minutes.

⚠️ Une telle stratégie n'est jamais une garantie absolue — il existe souvent des moyens détournés de contourner une restriction ; il faut rester vigilant sur le niveau global de sécurité.

---

## 5. La redirection des dossiers

Permet de stocker les dossiers du profil (documents, bureau, contacts...) sur un **emplacement réseau** plutôt qu'en local. Se configure via GPO sur les **objets utilisateurs**.

| Option | Description |
|---|---|
| **Répertoire d'accueil dédié** | Sous-dossier par utilisateur → renforce sécurité/confidentialité |
| **Emplacement partagé** | Tous les dossiers redirigés au même endroit → gestion des droits à surveiller de près |
| **Arrêt de la redirection** | Retour à un profil local classique |

⚠️ Par défaut, tous les dossiers redirigés atterrissent au **même emplacement réseau** — vigilance nécessaire pour éviter qu'ils soient accessibles à tous.

---

## 6. Déploiement d'imprimantes via GPO

Se configure depuis la **console de serveur d'impression**, sur une GPO existante ou nouvelle. Il faut bien définir le **type d'objet ciblé** (utilisateurs, groupes ou ordinateurs). Mise à jour côté client : automatique (90 min ±30) ou forcée via `gpupdate /force`.

⚠️ Selon que l'imprimante est déployée par GPO ou installée manuellement, les utilisateurs n'ont pas nécessairement les mêmes droits sur celle-ci (impact sur la gestion des files d'attente).

---

## ✅ Points clés à retenir

- Les GPO ciblent des **sites, domaines ou OU** — jamais directement des **groupes**.
- Actualisation : **90 min ±30** (postes), **5 min** (contrôleurs) ; forçage via `gpupdate /force`.
- Ordre de traitement : **héritage parent → enfant**, puis priorité aux stratégies **« appliquées »**, puis au **numéro d'ordre le plus élevé**.
- En cas de conflit sur un même paramètre : **la dernière stratégie appliquée (la plus proche de l'objet) l'emporte**.
- Le **blocage d'héritage** peut être outrepassé par le statut **« appliqué »**.
- Une GPO seule ne garantit jamais une restriction à 100 % — rester vigilant sur la configuration globale.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-3-les-strategie-de-groupe"></div>

<script type="application/json" id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-3-les-strategies-de-groupe-data">[
  {
    "question": "Sur quels types d'objets agissent principalement les GPO (Group Policy Object) ?",
    "options": [
      "Les ordinateurs et les utilisateurs du domaine",
      "Les groupes de sécurité et les groupes de distribution",
      "Les contrôleurs de domaine uniquement",
      "Les imprimantes et les ports d'impression"
    ],
    "correctIndex": 0,
    "explanation": "Les GPO interviennent principalement sur les ordinateurs et les utilisateurs d'un domaine Active Directory, ce qui explique pourquoi une console de modification de GPO présente toujours les branches « Configuration ordinateur » et « Configuration utilisateur »."
  },
  {
    "question": "Parmi les affirmations suivantes sur les GPO, laquelle est correcte ?",
    "options": [
      "Elles ne peuvent s'appliquer qu'à un seul poste à la fois",
      "Elles renforcent la sécurité et permettent d'automatiser des actions, mais leur configuration peut être complexe vu le grand nombre de paramètres",
      "Elles remplacent entièrement le besoin d'un contrôleur de domaine",
      "Elles simplifient toujours la configuration et ne présentent aucun inconvénient"
    ],
    "correctIndex": 1,
    "explanation": "Les GPO apportent de la sécurité et automatisent des actions (fond d'écran commun, restrictions...), réduisant la charge d'administration. En contrepartie, le grand nombre de paramètres disponibles rend leur configuration complexe, et elles restent dépendantes des systèmes d'exploitation ciblés."
  },
  {
    "question": "En cas de conflit entre une stratégie locale (configurée poste par poste) et une stratégie de groupe appliquée dans un contexte de domaine, laquelle l'emporte ?",
    "options": [
      "Les deux stratégies fusionnent automatiquement leurs paramètres sans priorité",
      "Aucune des deux stratégies ne s'applique",
      "La stratégie de groupe (domaine) l'emporte",
      "La stratégie locale l'emporte toujours"
    ],
    "correctIndex": 2,
    "explanation": "Dans un contexte de domaine, la stratégie de groupe prend le pas sur la stratégie locale en cas de conflit, ce qui justifie de privilégier systématiquement la gestion via GPO plutôt que via le registre local de chaque poste."
  },
  {
    "question": "Quel est le principal inconvénient de configurer un paramètre directement via le registre plutôt que via une GPO ?",
    "options": [
      "Le registre ne permet pas de modifier les paramètres utilisateur",
      "Le registre s'applique automatiquement à tous les postes du domaine",
      "Le registre est réservé aux contrôleurs de domaine",
      "Le registre nécessite une reconfiguration poste par poste et n'impacte qu'une seule machine à la fois"
    ],
    "correctIndex": 3,
    "explanation": "Modifier le registre est fastidieux car cela doit se faire poste par poste et n'impacte que la machine concernée, contrairement à une GPO qui dispose de sa propre console d'administration et s'applique à un ensemble de machines ou d'utilisateurs."
  },
  {
    "question": "Une fois créée, au bout de combien de temps une GPO s'applique-t-elle par défaut sur un poste de travail classique ?",
    "options": [
      "Toutes les 90 minutes, à plus ou moins 30 minutes près",
      "Une fois par jour, à minuit",
      "Toutes les 5 minutes",
      "Immédiatement, sans délai"
    ],
    "correctIndex": 0,
    "explanation": "L'actualisation par défaut d'une GPO se fait toutes les 90 minutes, avec un intervalle aléatoire de plus ou moins 30 minutes, afin d'éviter que tous les postes ne sollicitent le contrôleur de domaine en même temps."
  },
  {
    "question": "Quel est le délai d'actualisation par défaut des GPO spécifiquement sur les contrôleurs de domaine ?",
    "options": [
      "90 minutes, comme pour tous les postes",
      "5 minutes",
      "24 heures",
      "Il n'y a jamais d'actualisation automatique sur un contrôleur de domaine"
    ],
    "correctIndex": 1,
    "explanation": "Les contrôleurs de domaine ont un cycle d'actualisation bien plus court : toutes les 5 minutes, contre 90 minutes (± 30) pour les postes clients classiques."
  },
  {
    "question": "Quelle commande permet de forcer immédiatement l'application d'une GPO sans attendre le cycle d'actualisation automatique ?",
    "options": [
      "gpresult /force",
      "secedit /refreshpolicy",
      "gpupdate /force",
      "Restart-GPO -Force"
    ],
    "correctIndex": 2,
    "explanation": "gpupdate /force déclenche une actualisation immédiate des stratégies de groupe (paramètres ordinateur et utilisateur), sans attendre le cycle automatique de 90 minutes."
  },
  {
    "question": "Que désigne le terme CSE (Client Side Extensions) côté poste client ?",
    "options": [
      "Un protocole de chiffrement utilisé uniquement par Kerberos",
      "Le nom donné aux fichiers .admx utilisés dans les modèles d'administration",
      "Un composant matériel dédié à la sécurité",
      "Les composants qui récupèrent les stratégies mises à disposition par le contrôleur de domaine et qui appliquent les paramètres correspondants"
    ],
    "correctIndex": 3,
    "explanation": "Les CSE sont les extensions côté client qui vont chercher les GPO publiées par le contrôleur de domaine et se chargent de les intégrer et d'appliquer concrètement les paramètres qu'elles contiennent sur le poste."
  },
  {
    "question": "Quelle différence existe-t-il entre la Default Domain Policy (DDP) et la Default Domain Controller Policy ?",
    "options": [
      "La DDP s'applique à la racine du domaine pour l'ensemble des utilisateurs, tandis que la Default Domain Controller Policy cible spécifiquement les paramètres des contrôleurs de domaine",
      "La Default Domain Controller Policy s'applique à tous les utilisateurs, la DDP uniquement aux imprimantes",
      "Elles sont strictement identiques et interchangeables",
      "Seule la DDP peut être modifiée, l'autre est figée définitivement"
    ],
    "correctIndex": 0,
    "explanation": "La Default Domain Policy s'applique dès la racine du domaine pour l'ensemble des utilisateurs, quel que soit l'endroit où ils se trouvent. La Default Domain Controller Policy vise spécifiquement les paramètres propres aux contrôleurs de domaine."
  },
  {
    "question": "Sur quels types d'objets une GPO peut-elle être liée (le fameux « ciblage ») ?",
    "options": [
      "Un conteneur Built-in uniquement",
      "Un site Active Directory, un domaine, une unité d'organisation",
      "Un groupe de sécurité, un utilisateur, un ordinateur",
      "Un rôle FSMO"
    ],
    "correctIndex": 1,
    "explanation": "Le ciblage d'une GPO repose sur des liaisons établies vers un site Active Directory, un domaine ou une unité d'organisation (OU). Une fois liée, la stratégie s'applique aux objets ordinateurs et utilisateurs contenus dans cet objet."
  },
  {
    "question": "Une unité d'organisation ne contient que des groupes de sécurité. Que se passe-t-il si l'on y applique une GPO ?",
    "options": [
      "Une erreur bloque la création de la GPO",
      "La stratégie s'applique uniquement au premier membre du groupe",
      "La stratégie ne s'applique pas, car les GPO ne peuvent pas s'appliquer directement sur des groupes",
      "La stratégie s'applique à tous les membres des groupes automatiquement"
    ],
    "correctIndex": 2,
    "explanation": "Les GPO ne peuvent pas s'appliquer sur des groupes : elles ciblent uniquement des objets ordinateurs (paramètres ordinateur) ou utilisateurs (paramètres utilisateur). Il faut donc toujours lier une stratégie à une OU contenant des ordinateurs et/ou des utilisateurs."
  },
  {
    "question": "Concernant l'ordre de traitement des GPO, quelle affirmation est exacte ?",
    "options": [
      "Toutes les GPO liées à un même objet s'appliquent simultanément sans ordre défini",
      "Seule la dernière GPO créée est prise en compte, les autres sont ignorées",
      "Les stratégies héritées du parent sont appliquées après celles du conteneur courant",
      "Les stratégies héritées sont appliquées avant celles du conteneur courant, et celles dont le numéro d'ordre est le plus élevé sont appliquées en premier"
    ],
    "correctIndex": 3,
    "explanation": "L'héritage va du parent vers l'enfant : les stratégies héritées passent avant celles définies sur le conteneur courant. Au sein d'une même liste de liaisons, la GPO dont le numéro d'ordre est le plus élevé est traitée en premier."
  },
  {
    "question": "Deux GPO définissent des valeurs différentes pour un même paramètre, appliquées au même objet. Quelle règle détermine la valeur finalement retenue ?",
    "options": [
      "C'est l'ordre d'application qui détermine la valeur retenue : la dernière stratégie appliquée (la plus proche de l'objet) l'emporte",
      "C'est toujours la première GPO créée qui l'emporte, peu importe son ordre",
      "Les deux valeurs sont ignorées et le paramètre reste non configuré",
      "La valeur la plus restrictive s'applique systématiquement"
    ],
    "correctIndex": 0,
    "explanation": "Quand deux stratégies définissent des valeurs distinctes pour un même paramètre, c'est l'ordre d'application qui tranche : la dernière stratégie appliquée, donc la plus proche de l'objet dans la hiérarchie, l'emporte. Si les stratégies portent sur des paramètres différents, leurs effets se cumulent simplement."
  },
  {
    "question": "Que permet le statut « appliqué » (enforced) sur une GPO ?",
    "options": [
      "De rendre la GPO invisible aux autres administrateurs",
      "De rendre la GPO prioritaire, y compris face à un blocage d'héritage",
      "De supprimer automatiquement les GPO conflictuelles",
      "D'empêcher toute modification future de la GPO"
    ],
    "correctIndex": 1,
    "explanation": "Le statut « appliqué » rend une GPO prioritaire et lui permet d'outrepasser un blocage d'héritage configuré sur un conteneur enfant. C'est un mécanisme à réserver aux stratégies qui doivent absolument s'imposer partout."
  },
  {
    "question": "Que fait un blocage d'héritage configuré sur une unité d'organisation ?",
    "options": [
      "Il force l'application immédiate de toutes les GPO liées",
      "Il empêche uniquement les nouveaux utilisateurs de recevoir des GPO",
      "Il annule la prise en compte des stratégies héritées des conteneurs parents pour cette unité d'organisation",
      "Il supprime toutes les GPO existantes du domaine"
    ],
    "correctIndex": 2,
    "explanation": "Le blocage d'héritage, appliqué sur un conteneur, annule la prise en compte des stratégies héritées des niveaux supérieurs, un peu comme la rupture d'héritage sur les autorisations NTFS. Il impacte toutes les stratégies héritées, sauf celles marquées « appliqué »."
  },
  {
    "question": "Quelle est la différence entre un filtre de sécurité et un filtre WMI appliqués à une GPO ?",
    "options": [
      "Le filtre WMI concerne uniquement les imprimantes réseau",
      "Ils sont strictement équivalents et interchangeables",
      "Le filtre de sécurité ne peut s'appliquer qu'aux contrôleurs de domaine",
      "Le filtre de sécurité restreint la lecture/application via des règles de contrôle d'accès (droits de lecture), tandis que le filtre WMI restreint l'application via des requêtes système"
    ],
    "correctIndex": 3,
    "explanation": "Les filtres de sécurité s'appuient sur des règles de contrôle d'accès pour accorder ou retirer le droit de lecture/application d'une GPO à certains objets. Les filtres WMI limitent l'application de la GPO en s'appuyant sur des requêtes système, par exemple pour cibler un système d'exploitation précis."
  },
  {
    "question": "Quel est l'intérêt principal de la redirection de dossiers par GPO par rapport à un profil purement local ?",
    "options": [
      "Elle permet de stocker des éléments du profil (documents, bureau, menu démarrer...) sur un emplacement réseau centralisé, ce qui améliore la gestion et la sécurisation des données",
      "Elle empêche tout accès aux dossiers depuis un autre poste",
      "Elle supprime définitivement le besoin d'authentification des utilisateurs",
      "Elle remplace entièrement le besoin d'un serveur de fichiers"
    ],
    "correctIndex": 0,
    "explanation": "La redirection de dossiers permet de délocaliser des éléments du profil utilisateur vers un serveur de fichiers dédié, garantissant une meilleure accessibilité et une sauvegarde plus fiable, à condition de rester vigilant sur les droits d'accès à cet emplacement partagé."
  },
  {
    "question": "Parmi les options de redirection de dossiers évoquées, laquelle crée un sous-dossier dédié et propre à chaque utilisateur, renforçant ainsi la confidentialité de ses données ?",
    "options": [
      "La redirection locale sur le poste de travail",
      "La redirection vers le répertoire d'accueil de l'utilisateur (sous-dossier individuel sous un chemin racine)",
      "L'arrêt de la redirection",
      "La redirection vers un emplacement partagé commun"
    ],
    "correctIndex": 1,
    "explanation": "La redirection vers le répertoire d'accueil crée un sous-dossier spécifique à chaque utilisateur sous le chemin d'accès racine défini, garantissant à chacun un espace personnel sécurisé. À l'inverse, la redirection vers un emplacement partagé place les dossiers de tous les utilisateurs dans le même sous-dossier, ce qui demande une gestion plus rigoureuse des droits d'accès."
  },
  {
    "question": "Comment peut-on déployer des imprimantes auprès des utilisateurs ou des ordinateurs d'un domaine de manière automatisée ?",
    "options": [
      "Uniquement via le registre, poste par poste",
      "Les imprimantes ne peuvent jamais être déployées automatiquement",
      "Via une stratégie de groupe dédiée au déploiement d'imprimantes, ciblant des utilisateurs, des groupes ou des ordinateurs",
      "Uniquement en installant manuellement chaque imprimante sur chaque poste"
    ],
    "correctIndex": 2,
    "explanation": "Le déploiement d'imprimantes par GPO permet d'automatiser leur attribution en ciblant précisément des utilisateurs, des groupes ou des ordinateurs. Comme pour toute GPO, la mise à jour se fait soit au bout du délai par défaut (90 minutes ± 30), soit immédiatement via gpupdate /force."
  },
  {
    "question": "Une imprimante est déployée à la fois par GPO sur certains postes et installée manuellement sur d'autres. Quelle affirmation est correcte concernant les droits des utilisateurs ?",
    "options": [
      "Le déploiement par GPO supprime automatiquement tous les droits utilisateurs sur l'imprimante",
      "Seule l'installation manuelle permet de gérer les files d'attente d'impression",
      "Les droits et possibilités de contrôle sur l'imprimante sont systématiquement identiques, quel que soit le mode de déploiement",
      "Les utilisateurs n'auront pas nécessairement les mêmes droits ou possibilités de contrôle sur l'imprimante selon qu'elle a été déployée par GPO ou installée manuellement"
    ],
    "correctIndex": 3,
    "explanation": "Le mode de déploiement (GPO ou installation manuelle) influence les droits et le niveau de contrôle dont disposera l'utilisateur sur l'imprimante, ce qui peut avoir un impact concret sur son expérience d'impression et sa capacité à gérer les files d'attente."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-3-les-strategie-de-groupe",
      dataId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-3-les-strategie-de-groupe-data",
    });
  });
</script>
