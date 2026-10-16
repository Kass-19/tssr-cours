# Module 10 : Maintenance du système

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module présente les problématiques de maintenance d'un système Windows 10 (performance et fiabilité), les outils de diagnostic disponibles (en temps réel, sur historique, ou automatiques), la fonctionnalité **Points de restauration système**, ainsi que les outils de **récupération du système** via **WinRE**.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Les problématiques et les outils de diagnostic

### 1.1 Deux grandes familles de problématiques

| Problématique | Ce qu'elle recouvre |
|---|---|
| **Performance** | Surveillance des 4 éléments matériels majeurs : **processeur**, **mémoire vive**, **stockage**, **carte réseau** |
| **Fiabilité** | Le système a-t-il le comportement attendu ? L'utilisateur peut-il travailler normalement ? Le démarrage est-il rapide et sans erreur ? Les services nécessaires démarrent-ils correctement ? Les applications professionnelles fonctionnent-elles sans problème ? |

### 1.2 Trois approches de diagnostic

| Approche | Principe |
|---|---|
| **Analyse en temps réel** | Enquêter sur un dysfonctionnement en cours |
| **Analyse sur historique** | Enquêter sur un ou plusieurs dysfonctionnements survenus récemment |
| **Diagnostic automatique** | Outils intégrés à Windows, peu utilisés par les équipes techniques car leur mécanisme et leurs résultats manquent de transparence |

### 1.3 Outils d'analyse en temps réel

| Outil | Rôle |
|---|---|
| **Gestionnaire des tâches** | Liste les processus en cours, l'état des services, et les taux d'utilisation du matériel |
| **Observateur d'événements** (journaux d'événements / logs) | Permet d'éplucher les logs à la recherche d'indices sur un dysfonctionnement en cours — réflexe indispensable pour tout technicien |
| **Moniteur de ressources** | Tableau de bord complémentaire au gestionnaire des tâches, détaillant graphiquement l'utilisation actuelle des 4 composants matériels principaux |
| **Analyseur de performance** | Outil puissant permettant de positionner et déclencher des sondes sur plusieurs centaines d'éléments du système — généralement réservé aux serveurs, utilisé en dernier recours |

### 1.4 Outils d'analyse sur historique

| Outil | Rôle |
|---|---|
| **Historique de fiabilité** | Vue synthétique de l'état de santé de Windows 10, recensant les événements majeurs survenus dans le temps |
| **Observateur d'événements** | Permet également de « remonter le temps » pour enquêter sur un dysfonctionnement passé ou récurrent |
| **Analyseur de performance** | Permet de planifier le démarrage de sondes à des heures précises (ex. hors heures de travail) et de récupérer un rapport d'analyse généré automatiquement |

### 1.5 Diagnostics automatiques

Certains diagnostics automatiques restent utiles pour des analyses poussées du matériel (ex. état de fonctionnement de la mémoire vive). Les autres sont peu utilisés en pratique par les équipes techniques, car il n'est pas possible de consulter le détail des causes identifiées ni des solutions proposées.

📌 Ces outils automatiques sont néanmoins présents dans Windows 10 Pro : ils proviennent de l'héritage de l'édition Famille, orientée grand public et non technicien.

### 1.6 Recherche en ligne

Au-delà des outils internes, la recherche sur Internet est courante, voire indispensable, car des solutions existent très souvent (généralement en anglais). Le site **TechNet** de Microsoft, ressource officielle pour les techniciens Microsoft, est particulièrement riche en procédures et résolutions de problèmes — complété par des forums, blogs et l'aide Windows.

---

## 2. Les points de restauration système

### 2.1 Principe

Les **points de restauration** fonctionnent comme un journal des modifications du système. Ils permettent de restaurer le système à un état antérieur **plus rapidement** qu'une restauration complète.

| Ce qui est sauvegardé | Ce qui n'est **pas** sauvegardé |
|---|---|
| Base de registre, certains fichiers système, certains programmes | Les **données** utilisateur (nécessite un outil de sauvegarde classique) |

⚠️ La fonctionnalité est **désactivée par défaut** et s'active **volume par volume**.

### 2.2 Création des points de restauration

Une fois la fonctionnalité activée, les points de restauration peuvent être créés :

- **quotidiennement**, pour assurer un retour en arrière avec un faible delta ;
- lors d'un **événement important** du système (ex. installation d'un pilote, avant une mise à jour Windows Update) ;
- **manuellement**.

### 2.3 Gestion et limites

La fonctionnalité se pilote via les propriétés avancées du système, onglet **Protection du système**. Un espace protégé (de taille configurable) est alloué au stockage des points de restauration : une fois cet espace saturé, le point le plus récent remplace le plus ancien (fonctionnement en rotation).

### 2.4 Restauration

| Situation | Méthode |
|---|---|
| Le système démarre normalement | Restauration via l'interface graphique (**Protection du système**) |
| Windows 10 ne démarre plus du tout | Restauration via **WinRE** |

---

## 3. Récupérer le système

### 3.1 Qu'est-ce que WinRE ?

**WinRE** (*Windows Recovery Environment*) est l'outil officiel et natif de récupération de l'OS principal. C'est un **OS léger secondaire**, embarquant des outils de diagnostic et de réparation, capable d'intervenir lorsque l'OS principal ne répond plus. Il permet notamment un retour à la configuration d'usine (comme sur un smartphone ou une tablette).

### 3.2 Lancer WinRE

WinRE réside sur un volume réservé du disque dur principal (support bootable). Plusieurs façons de le démarrer :

| Méthode |
|---|
| Menu Démarrer → **Redémarrer** en maintenant la touche **Maj** |
| Ligne de commande : `shutdown /r /o` |
| Paramètres → Mise à jour et sécurité → Récupération → **Redémarrer maintenant** |
| Si le disque dur principal est défaillant : démarrer sur un **support d'installation de Windows 10** puis « Réparer l'ordinateur » |

```cmd
shutdown /r /o
```

### 3.3 Déclenchement automatique de WinRE

WinRE peut également se lancer **automatiquement**, lorsque Windows juge le système principal insuffisamment fiable, notamment après :

- **2 échecs consécutifs** de démarrage de l'OS principal ;
- **2 arrêts imprévus** de Windows 10 survenus moins de 2 minutes après le démarrage.

---

## 4. Outils de récupération du système (via WinRE)

WinRE propose plusieurs outils de réparation et de diagnostic :

| Outil | Description |
|---|---|
| **Restauration système** | Restaure le système à l'aide d'un point de restauration disponible (⚠️ nécessite des privilèges d'administration) |
| **Restauration complète** | À partir d'une sauvegarde (support demandé : DVD, disque dur, partage réseau) |
| **Invite de commandes** | `cmd` en tant qu'administrateur, pour utiliser des outils de diagnostic et de réparation en ligne de commande |
| **Rétrogradation** | Possible uniquement si le système provient d'une **mise à niveau** d'une version Windows antérieure (⚠️ pas de retour possible vers une build Windows 10 antérieure à l'heure actuelle) |

### 4.1 Modes de démarrage alternatifs

Si Windows 10 ne démarre pas, un problème dans la séquence de démarrage est probable. Plusieurs démarrages alternatifs permettent de poursuivre l'investigation :

| Mode | Usage |
|---|---|
| **Mode sans échec** | Démarre un Windows 10 allégé, avec uniquement l'indispensable |
| **Mode vidéo basse résolution** | Utile en cas de défaillance de la carte graphique empêchant tout affichage normal |
| **Désactivation de la vérification de signature des pilotes** | Utile si un périphérique ne fonctionne pas faute de certificat valide |

### 4.2 Outils de diagnostic automatique du démarrage

WinRE propose enfin des outils automatiques permettant de réparer :

- le **MBR** (*Master Boot Record*) ou la **GUID Partition Table** ;
- le magasin **BCD** (*Boot Configuration Data*) — l'ensemble de fichiers Windows qui prennent en charge et coordonnent le démarrage habituel du système.

## ✅ Points clés à retenir

- Les problématiques de maintenance se répartissent entre **performance** (processeur, RAM, stockage, carte réseau) et **fiabilité** (comportement attendu du système et des applications).
- Trois approches de diagnostic existent : en temps réel (Gestionnaire des tâches, Observateur d'événements, Moniteur de ressources, Analyseur de performance), sur historique (Historique de fiabilité, Observateur d'événements, Analyseur de performance planifié), et automatique (peu utilisé par les équipes techniques, hérité de l'édition Famille).
- Les points de restauration sauvegardent la base de registre, certains fichiers système et programmes (jamais les données), se créent quotidiennement/à des événements clés/manuellement, et fonctionnent en rotation dans un espace protégé dédié ; ils sont désactivés par défaut.
- **WinRE** est l'OS de secours natif de Windows, lançable manuellement (Maj + Redémarrer, `shutdown /r /o`, menu Récupération, support d'installation) ou automatiquement (2 échecs de démarrage consécutifs, ou 2 arrêts imprévus en moins de 2 min après démarrage).
- WinRE propose restauration système, restauration complète depuis sauvegarde, invite de commandes admin, rétrogradation (si issue d'une mise à niveau), des modes de démarrage alternatifs (sans échec, vidéo basse résolution, pilotes non signés), et des outils de réparation du MBR/GPT et du magasin BCD.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-10-maintenance-du-systeme"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-10-maintenance-du-systeme-data">
[
  {
    "question": "Quels sont les 4 éléments matériels majeurs à surveiller pour évaluer la performance d'un ordinateur ?",
    "options": ["Le processeur, la mémoire vive, le stockage et la carte réseau", "L'écran, le clavier, la souris et le boîtier", "Le BIOS, le pilote graphique, le pare-feu et l'antivirus", "La carte mère, l'alimentation, le ventilateur et le disque optique"],
    "correctIndex": 0,
    "explanation": "Le module identifie 4 éléments matériels majeurs à surveiller pour évaluer la performance d'un système : le processeur, la mémoire vive, le stockage et la carte réseau."
  },
  {
    "question": "Quel outil permet de lister les processus en cours d'exécution, l'état des services et les taux d'utilisation du matériel en temps réel ?",
    "options": ["L'observateur d'évènements", "Le gestionnaire des tâches", "WinRE", "L'analyseur de performance"],
    "correctIndex": 1,
    "explanation": "Le gestionnaire des tâches permet de lister les processus en cours d'exécution, l'état des services et les taux d'utilisation du matériel."
  },
  {
    "question": "Pourquoi un technicien consulte-t-il systématiquement l'observateur d'évènements (les logs) lors d'un dysfonctionnement ?",
    "options": ["Parce que c'est le seul outil capable de redémarrer un service bloqué", "Parce que cela permet de restaurer automatiquement le système", "Parce que le dysfonctionnement en cours ou passé a probablement laissé des évènements récents dans les journaux, fournissant des indices", "Parce que c'est l'unique outil permettant de surveiller la carte réseau"],
    "correctIndex": 2,
    "explanation": "Le module précise que tout bon technicien se doit de consulter les logs, car un dysfonctionnement en cours ou passé y laisse généralement des évènements récents permettant de trouver des indices."
  },
  {
    "question": "Quel outil, complémentaire au gestionnaire des tâches, donne du détail graphique sur l'utilisation actuelle des 4 composants matériels principaux ?",
    "options": ["L'historique de fiabilité", "WinRE", "Technet", "Le moniteur de ressources"],
    "correctIndex": 3,
    "explanation": "Le moniteur de ressources est un tableau de bord complémentaire au gestionnaire des tâches, donnant du détail sur l'utilisation actuelle des 4 composants matériels principaux à l'aide de graphiques."
  },
  {
    "question": "Dans quel contexte le module recommande-t-il plutôt l'usage de l'analyseur de performance ?",
    "options": ["Plutôt sur les serveurs, et en dernier recours si les autres outils d'analyse n'ont pas porté leurs fruits", "Systématiquement, en premier réflexe sur tout type de poste", "Uniquement sur les imprimantes réseau", "Uniquement pour visualiser les pilotes installés"],
    "correctIndex": 0,
    "explanation": "L'analyseur de performance est un outil puissant et complet, mais le module précise qu'il est généralement utilisé sur les serveurs, et en dernier recours lorsque les autres outils n'ont pas permis de résoudre le problème."
  },
  {
    "question": "Qu'apporte l'historique de fiabilité (reliability history) comme outil d'analyse sur l'historique du système ?",
    "options": ["Un journal détaillé de chaque frappe clavier effectuée", "Une vue synthétique résumant l'état de santé de Windows 10 dans le temps, recensant les évènements majeurs", "Un rapport exclusivement dédié à la consommation réseau", "La liste des pilotes signés installés sur le système"],
    "correctIndex": 1,
    "explanation": "L'historique de fiabilité propose une vue synthétique de l'état de santé de Windows 10, en recensant les évènements majeurs survenus sur le système au fil du temps."
  },
  {
    "question": "Pourquoi les outils de diagnostic automatique de Windows sont-ils généralement peu utilisés par les équipes techniques, d'après le module ?",
    "options": ["Parce qu'ils sont payants et nécessitent une licence séparée", "Parce qu'ils ne fonctionnent que sur Windows Server", "Parce que leur process, leur mécanisme et leurs résultats ne sont pas assez transparents, voire inexistants", "Parce qu'ils sont incompatibles avec les pilotes signés"],
    "correctIndex": 2,
    "explanation": "Le module précise que les outils de diagnostic automatique ne sont généralement pas utilisés par les équipes techniques car leur process, leur mécanisme et leurs résultats ne sont pas assez transparents, voire inexistants."
  },
  {
    "question": "D'où proviennent historiquement les outils de diagnostic automatique présents dans Windows 10 édition Pro ?",
    "options": ["Ils ont été développés spécifiquement pour les administrateurs systèmes professionnels", "Ils sont fournis par des éditeurs tiers uniquement", "Ils proviennent exclusivement de Windows Server", "Ils proviennent de l'héritage de l'édition Famille de Windows 10, destinée au grand public"],
    "correctIndex": 3,
    "explanation": "Ces outils de diagnostic automatique sont présents dans l'édition Pro car ils proviennent de l'héritage de l'édition Famille de Windows 10, destinée à un public grand public souvent non initié aux outils d'investigation manuelle."
  },
  {
    "question": "Quel site officiel Microsoft le module recommande-t-il particulièrement pour les procédures et la résolution de problèmes techniques ?",
    "options": ["Le site Technet de Microsoft", "Le Microsoft Store", "Le site support.office.com uniquement", "GitHub Microsoft"],
    "correctIndex": 0,
    "explanation": "Le site Technet de Microsoft, site officiel des techniciens Microsoft, est présenté comme très riche en procédures et résolutions de problèmes, et constitue la première source d'investigation mentionnée."
  },
  {
    "question": "Que sauvegarde précisément un point de restauration système ?",
    "options": ["Les données personnelles de l'utilisateur (documents, photos)", "La base de registre, certains fichiers système et des programmes, mais pas les données", "Uniquement les pilotes installés", "L'intégralité du disque dur, données comprises"],
    "correctIndex": 1,
    "explanation": "Un point de restauration sauvegarde la base de registre, certains fichiers système et des programmes, mais ne sauvegarde pas les données : pour cela, il faut utiliser un outil de sauvegarde classique."
  },
  {
    "question": "La fonctionnalité des points de restauration système est-elle activée par défaut sur Windows 10 ?",
    "options": ["Oui, et de façon identique sur tous les volumes simultanément", "Oui, mais uniquement sur le volume système C:", "Non, elle est désactivée par défaut et s'active volume par volume", "Non, elle ne peut être activée que via WinRE"],
    "correctIndex": 2,
    "explanation": "Le module précise que la fonctionnalité de point de restauration est désactivée par défaut, et qu'elle doit être activée volume par volume."
  },
  {
    "question": "Parmi les situations suivantes, laquelle déclenche la création automatique d'un point de restauration, selon le module ?",
    "options": ["Uniquement à la demande explicite de l'utilisateur", "Uniquement lors de l'arrêt complet de l'ordinateur", "Les points de restauration ne peuvent jamais être créés automatiquement", "À chaque évènement important comme l'installation d'un pilote, ou avant une mise à jour Windows Update"],
    "correctIndex": 3,
    "explanation": "Les points de restauration peuvent se créer chaque jour, à chaque évènement important du système (comme l'installation d'un pilote ou avant une mise à jour Windows Update), ou manuellement."
  },
  {
    "question": "Que se passe-t-il lorsque l'espace alloué au stockage des points de restauration est totalement occupé ?",
    "options": ["Le point de restauration le plus récent prend la place du point le plus ancien", "Le système refuse de créer tout nouveau point de restauration", "Windows efface automatiquement toutes les données utilisateur", "Le système se bloque jusqu'à libération manuelle d'espace"],
    "correctIndex": 0,
    "explanation": "Lorsque l'espace alloué est totalement occupé, le point de restauration le plus récent prend la place du point le plus ancien, fonctionnant ainsi en boucle."
  },
  {
    "question": "Que faire pour restaurer le système à l'aide d'un point de restauration si Windows 10 ne parvient plus à démarrer du tout ?",
    "options": ["C'est impossible, il faut obligatoirement réinstaller Windows depuis zéro", "Utiliser WinRE pour accéder aux outils de restauration", "Attendre que Windows Update répare automatiquement le problème", "Débrancher puis rebrancher le disque dur"],
    "correctIndex": 1,
    "explanation": "Si le système entier ne démarre plus, il est possible d'utiliser un point de restauration via WinRE, l'outil de récupération natif qui reste accessible même lorsque l'OS principal ne répond plus."
  },
  {
    "question": "Qu'est-ce que WinRE, tel que décrit dans le module ?",
    "options": ["Un antivirus intégré nativement à Windows 10", "Un service cloud de sauvegarde Microsoft", "Un OS léger et secondaire, natif, permettant de diagnostiquer et réparer l'OS principal lorsqu'il ne répond plus", "Un pilote générique utilisé par le magasin de pilotes"],
    "correctIndex": 2,
    "explanation": "WinRE est l'outil officiel et natif de récupération du système d'exploitation : un OS secondaire léger embarquant des outils de diagnostic et de réparation, capable même d'effectuer un retour à la configuration d'usine."
  },
  {
    "question": "Dans quelles circonstances WinRE peut-il se lancer automatiquement, sans action de l'utilisateur ?",
    "options": ["Après chaque redémarrage normal du système", "Uniquement lorsqu'un nouveau pilote est installé", "Jamais, WinRE doit toujours être lancé manuellement", "Après 2 échecs consécutifs du démarrage de l'OS principal, ou après 2 arrêts imprévus survenus moins de 2 minutes après le démarrage"],
    "correctIndex": 3,
    "explanation": "WinRE peut se lancer automatiquement après 2 échecs consécutifs du démarrage de l'OS principal, ou après 2 arrêts imprévus de Windows 10 survenus moins de 2 minutes après le démarrage, le système étant alors jugé peu fiable."
  },
  {
    "question": "Quelle commande en ligne de commande permet de lancer WinRE ?",
    "options": ["shutdown /r /o", "msinfo32 /recovery", "pnputil /winre", "sfc /scannow /recovery"],
    "correctIndex": 0,
    "explanation": "La commande shutdown /r /o permet de lancer WinRE depuis une invite de commande, en plus des méthodes via le menu Démarrer (MAJ + Redémarrer) ou les paramètres de récupération."
  },
  {
    "question": "Pourquoi êtes-vous \"challengé\" (authentification requise) lorsque vous souhaitez restaurer le système via WinRE ?",
    "options": ["Parce que WinRE nécessite une connexion Internet active", "Parce que la restauration système requiert des privilèges d'administration", "Parce qu'un compte Microsoft en ligne est obligatoire", "Parce que cette fonctionnalité est réservée à l'édition Famille uniquement"],
    "correctIndex": 1,
    "explanation": "Le module précise qu'une restauration système via WinRE requiert des privilèges d'administration, ce qui explique que l'utilisateur soit challengé (authentifié) avant de pouvoir l'effectuer."
  },
  {
    "question": "Si un périphérique ne fonctionne pas faute de certificat valide pour son pilote, quelle option de démarrage de Windows 10 peut aider à investiguer le problème ?",
    "options": ["Le mode sans échec classique", "Le mode vidéo basse résolution", "Le démarrage en ne prenant pas en compte la signature des pilotes", "Le retour à la configuration d'usine"],
    "correctIndex": 2,
    "explanation": "Le démarrage sans application de la signature des pilotes permet de faire fonctionner temporairement un périphérique dont le pilote ne possède pas de certificat valide, afin de poursuivre les investigations."
  },
  {
    "question": "Quels éléments les outils de diagnostic automatique de WinRE peuvent-ils notamment réparer ?",
    "options": ["Uniquement les fichiers de registre utilisateur", "Uniquement les pilotes d'imprimante", "Les fichiers de configuration du pare-feu", "Le MBR, la GUID Partition Table, ou le magasin BCD (Boot Configuration Data)"],
    "correctIndex": 3,
    "explanation": "Les outils de diagnostic automatique de WinRE permettent notamment de réparer le MBR, la GUID Partition Table, ou le magasin BCD (Boot Configuration Data), cet ensemble de fichiers qui coordonne le démarrage habituel de Windows."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-10-maintenance-du-systeme",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-10-maintenance-du-systeme-data",
    });
  });
</script>
