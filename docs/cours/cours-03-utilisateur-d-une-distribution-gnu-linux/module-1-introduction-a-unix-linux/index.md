# Module 1 : Introduction à Unix-Linux

*Cours : [Cours 3 - Utilisateur d'une distribution GNU-Linux](../index.md)*

## 🎯 Objectif du module

Ce module retrace l'historique d'Unix puis de Linux, présente ce qu'est Linux aujourd'hui (usage professionnel, distributions majeures et spécialisées), et introduit les licences de logiciels libres qui structurent cet écosystème.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Historique d'Unix

### 1.1 Des origines à Unix

| Année | Événement |
|---|---|
| **1969/1970** | Les membres du Bell Labs (chez AT&T) se retirent du projet **Multics**, jugé peu performant. L'équipe (Ken Thompson, Dennis Ritchie, Brian Kernighan) relance les travaux sous le nom **Unics** (clin d'œil à Multics, trouvé par Kernighan), écrit dans le langage **B** (création antérieure de Thompson et Ritchie) |
| **1970** | Unics devient **Unix**, orthographe qui ne changera plus |
| **1971** | Première version officielle d'Unix, installée sur du matériel **PDP-11/20** de chez Dec |
| **1972** | Dennis Ritchie crée le langage **C**, amélioration du B, le rendant plus **portable** |
| **1973** | Thompson, aidé de Ritchie, réécrit le noyau Unix en **C** ; la même année, l'**université de Berkeley** devient la première à disposer d'Unix avec ses sources |
| **1976** | Sortie d'**Unix Time Sharing System V6** (toujours au Bell Labs), disponible avec les sources contre une somme symbolique, destiné en premier lieu aux universités — la disponibilité des sources permet de comprendre, améliorer et adapter le système |
| **1977** | À Berkeley, l'étudiant **Bill Joy** compile **BSD** sur la base d'Unix V6 : naissance d'une nouvelle branche Unix, toujours active aujourd'hui |
| **1979** | Sortie de **BSD2**, avec deux programmes toujours utilisés aujourd'hui : le shell **C Shell** et l'éditeur **VI** |

📌 Bill Joy fera ensuite partie des fondateurs de **Sun Microsystems**, connue notamment pour Java et la suite bureautique OpenOffice.

### 1.2 Naissance du mouvement du logiciel libre

| Année | Événement |
|---|---|
| **1983** | En réaction à la fermeture des sources par de nombreux industriels, le chercheur du MIT **Richard Stallman (RMS)** lance le projet **GNU**, visant un OS entièrement composé de logiciels libres (code source accessible et modifiable) |
| **1985** | Stallman crée la **Free Software Foundation** |
| **jusqu'aux années 90** | Le projet GNU se développe **sans noyau** |
| **1987** | Le professeur **Andrew Tanenbaum** crée **Minix**, un clone d'Unix compatible IBM PC, destiné à l'enseignement. Minix existe toujours, mais son développement est à l'arrêt depuis **2018** |

---

## 2. Historique de Linux

### 2.1 Naissance et essor

| Date | Événement |
|---|---|
| **25 août 1991** | **Linus Torvalds**, étudiant à Helsinki, annonce aux utilisateurs de Minix qu'il développe un OS libre pour architecture **I386** (compatible IBM-PC) — initialement conçu comme un simple hobby, et non comme un projet professionnel d'envergure |
| — | Le noyau Linux viendra combler le manque de noyau du projet GNU : c'est la rencontre **GNU + Linux** |
| **1992** | Première distribution GNU/Linux : **SLS** |
| **1993** | SLS laisse place à **Slackware** ; naissance du projet **Debian** |
| **1994** | Arrivée des distributions **Red Hat** et **SuSE** |

📌 Quatre décennies plus tard, **Slackware, Debian, SuSE et Red Hat** sont toujours des distributions actives.

### 2.2 Maturation de l'écosystème

| Année | Événement |
|---|---|
| **1996** | Création de la mascotte **Tux** (le pingouin), suite à un concours visant à donner une icône reconnaissable à Linux ; création de l'environnement graphique **KDE** |
| **1997** | Création de l'environnement graphique **GNOME** (toujours parmi les plus utilisés avec KDE aujourd'hui) |
| **2004** | Le millionnaire sud-africain **Mark Shuttleworth** crée **Ubuntu**, avec pour objectif une distribution Linux accessible au grand public |
| **2011** | Décès de Steve Jobs (5 octobre) puis, 6 jours plus tard (11 octobre), de **Dennis Ritchie**, père du langage C, d'Unix et du manuel Unix (*man*) — une figure essentielle mais souvent oubliée de l'histoire de l'informatique |

---

## 3. Qu'est-ce que Linux aujourd'hui ?

### 3.1 Un OS incontournable pour les professionnels IT

Linux est un OS majeur, issu d'Unix, omniprésent dans les infrastructures. En tant que professionnel, il s'utilise principalement via la **ligne de commande** (**CLI**, *Command Line Interface*), interface principale dans le monde Linux — qu'il s'agisse d'une connexion directe ou via un logiciel de connexion distante.

📌 Linux dispose aussi d'interfaces graphiques (GUI), mais celles-ci restent anecdotiques en entreprise sur poste de bureau — davantage utiles pour redonner vie à du matériel vieillissant, Linux étant nettement moins gourmand en ressources que Windows.

Exemples d'interfaces graphiques courantes : **GNOME**, **KDE**, **XFCE**, **LXDE**.

### 3.2 Les distributions majeures en entreprise

| Distribution | Caractéristiques |
|---|---|
| **Ubuntu** (et variantes : Lubuntu, Kubuntu...) | Grand public à l'origine, aussi disponible en version **serveur** depuis 2006 |
| **Red Hat (RHEL)** | Distribution **sous licence** ; un abonnement est requis en production pour bénéficier d'un support privilégié |
| **CentOS** | Historiquement une version *downstream* (descendante) de Red Hat, sans support officiel — permettait un usage compatible Red Hat sans licence. Évolue en **2021** vers **CentOS Stream**, moins adapté à un usage en entreprise |
| **Debian** | Distribution GNU/Linux entièrement libre et gratuite, réputée pour sa **stabilité** |
| **OpenSUSE** | Version libre, avec une déclinaison commerciale **SUSE Linux Enterprise** — fréquente dans les *appliances* (mini OS Linux dédié à un produit logiciel spécifique) |

⚠️ **Libre ne veut pas forcément dire gratuit** (cas de Red Hat, par exemple).

📌 Lors du choix d'une distribution, il faut toujours vérifier la **fin de support**. Ubuntu propose des versions **LTS** (*Long Time Support*, ~5 ans de support/mises à jour) à privilégier en entreprise, les versions intermédiaires n'offrant qu'un an de support. Debian propose également des cycles de support longs.

### 3.3 Domaines d'usage de Linux

Linux est aujourd'hui majoritairement présent dans :

| Domaine | Exemple |
|---|---|
| Serveurs web | Apache |
| Serveurs d'applications Java | Applications professionnelles |
| Serveurs de bases de données | PHP (et environnements associés) |
| Smartphones | Android, basé sur un noyau Linux |
| Internet des objets | Smartwatch, Smart TV, véhicules intelligents... |

### 3.4 Quelques distributions bureau à découvrir

| Distribution | Particularité |
|---|---|
| **Linux Mint** | Dérivée d'Ubuntu, très populaire, adaptée aux débutants comme aux utilisateurs avancés |
| **ZorinOS** | Vise une transition facile depuis Windows/macOS, interface soignée ; existe en version légère/éducative |
| **Kubuntu / Xubuntu / Lubuntu** | Déclinaisons d'Ubuntu avec différents environnements graphiques |

### 3.5 Distributions spécialisées

| Distribution | Usage |
|---|---|
| **Kali Linux** | Orientée sécurité, nombreux outils de test d'intrusion. ⚠️ À ne pas utiliser à la légère en environnement professionnel — certains outils pourraient être assimilés à une tentative de piratage interne |
| **Raspbian** | Debian adaptée au Raspberry Pi |
| **3CX** | Basée sur Debian, implémente la solution de téléphonie du même nom |
| **System Rescue CD** | Récupération de système et de données en LiveCD/USB |
| **PrimTux** | Orientée éducation |

### 3.6 La distribution utilisée dans ce cours : Debian

Le cours utilise **Debian Linux 10 « Buster »**, canal **stable** de Debian au moment du cours — une distribution GNU/Linux entièrement libre, dont la redistribution est libre et gratuite, incluant le code source libre de tous les logiciels inclus.

📌 Les noms des versions Debian sont tous basés sur les personnages des films **Toy Story**.

Debian repose sur un **contrat social** fort :

> « Debian demeurera totalement libre. Nous donnerons nos travaux à la communauté des logiciels libres. Nous ne dissimulerons pas des problèmes. Et nos priorités sont nos utilisateurs et les logiciels libres. »

---

## 4. Licences et logiciels libres

### 4.1 La Free Software Foundation

Association fondée par **Richard Stallman**, dédiée à la promotion des logiciels libres et à la défense des utilisateurs. Sa devise résume bien la philosophie du libre :

> « Free as in free speech, not as in free beer » *(libre comme dans « liberté d'expression », pas comme dans « gratuit »)*

Plusieurs licences dites « libres » coexistent, avec des droits et devoirs qui peuvent diverger sur la forme comme sur le fond.

### 4.2 Panorama des licences

| Licence | Caractéristiques |
|---|---|
| **GNU GPL** (*General Public License*) | Quatre libertés fondamentales : exécuter le logiciel pour tout usage ; l'étudier et l'adapter (accès au code source) ; redistribuer des copies ; faire bénéficier la communauté des versions modifiées. Plusieurs versions existent ([gnu.org/licenses](https://www.gnu.org/licenses/licenses.html)) |
| **Apache** | Gérée par l'**Apache Software Foundation** ; autorise la modification et la distribution du code source, dans le respect du copyright ([apache.org/licenses](https://www.apache.org/licenses/LICENSE-2.0)) |
| **BSD** | Autorise la réutilisation **sans restriction**, licence proche du domaine public, librement modifiable, **sans copyleft**. Plusieurs versions existent. C'est grâce à cette licence que Steve Jobs a pu créer **macOS X** |
| **CeCILL** | Abréviation de *CEA CNRS INRIA Logiciels Libres* ; conforme au droit français, respecte les principes du logiciel libre |
| **Creative Commons** | S'applique aux créations artistiques (photos, logos, graphismes, musiques...) présentes dans les logiciels libres ; nombreuses sous-catégories |

## ✅ Points clés à retenir

- Unix naît au Bell Labs à la fin des années 1960/70 (Thompson, Ritchie, Kernighan), avec le langage C créé en 1972 pour le rendre portable ; la branche BSD naît en 1977 à Berkeley et reste active aujourd'hui.
- Le mouvement du logiciel libre démarre avec le projet GNU de Richard Stallman (1983) puis la Free Software Foundation (1985) ; le noyau manquant à GNU est fourni par le projet Linux de Linus Torvalds, lancé en 1991.
- Les grandes distributions GNU/Linux naissent entre 1992 et 1994 (SLS, Slackware, Debian, Red Hat, SuSE) ; Ubuntu (2004) vise la démocratisation grand public.
- En entreprise, les distributions dominantes sont Ubuntu, Red Hat/CentOS, Debian et OpenSUSE ; « libre » ne signifie pas « gratuit », et le choix d'une distribution doit tenir compte de sa durée de support (privilégier les versions LTS).
- Linux se pilote principalement en ligne de commande (CLI) et domine les serveurs web/applicatifs/bases de données, les smartphones (Android) et l'IoT ; ce cours utilise Debian 10 « Buster ».
- Plusieurs licences libres coexistent avec des règles différentes : GNU GPL (copyleft fort, 4 libertés), Apache (modification/distribution avec copyright), BSD (réutilisation libre, sans copyleft), CeCILL (conforme au droit français), Creative Commons (créations artistiques).

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-1-introduction-a-unix-linux"></div>

<script type="application/json" id="quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-1-introduction-a-unix-linux-data">
[
  {
    "question": "De quel projet les membres des Bell Labs se retirent-ils avant de lancer Unics, qui deviendra Unix ?",
    "options": ["Multics", "Minix", "GNU", "BSD"],
    "correctIndex": 0,
    "explanation": "En 1969/1970, les membres des Bell Labs se retirent du projet Multics, dont les performances n'étaient pas à la hauteur des attentes, et poursuivent leurs recherches avec un nouveau projet nommé Unics, en clin d'œil à Multics."
  },
  {
    "question": "Quels sont les trois chercheurs principalement associés à la création d'Unix ?",
    "options": ["Linus Torvalds, Richard Stallman et Mark Shuttleworth", "Ken Thompson, Dennis Ritchie et Brian Kernighan", "Bill Joy, Andrew Tanenbaum et Bill Gates", "Steve Jobs, Steve Wozniak et Dennis Ritchie"],
    "correctIndex": 1,
    "explanation": "L'équipe menée par Ken Thompson, Dennis Ritchie et Brian Kernighan est à l'origine du projet Unics, qui deviendra Unix à partir de 1970."
  },
  {
    "question": "Dans quel langage le noyau Unix a-t-il été réécrit en 1973, le rendant plus portable ?",
    "options": ["Le langage B", "Le langage Pascal", "Le langage C", "Le langage assembleur uniquement"],
    "correctIndex": 2,
    "explanation": "Dennis Ritchie crée le langage C en 1972 comme amélioration du langage B, et c'est dans ce langage C que Thompson, aidé de Ritchie, réécrit le noyau Unix en 1973, le rendant beaucoup plus portable."
  },
  {
    "question": "Pourquoi la disponibilité des sources d'Unix V6 (1976) auprès des universités a-t-elle été importante ?",
    "options": ["Parce qu'elle a permis de réduire drastiquement le prix du matériel informatique", "Parce qu'elle a rendu Unix immédiatement gratuit pour toutes les entreprises", "Parce qu'elle a mis fin au développement du langage C", "Parce que les sources permettent de comprendre le fonctionnement du système et éventuellement de l'améliorer ou l'adapter"],
    "correctIndex": 3,
    "explanation": "La présence des sources est importante car ce sont les éléments de programmation qui permettent à chacun de comprendre comment le système fonctionne, de l'améliorer et de l'adapter à ses propres besoins."
  },
  {
    "question": "Quelle branche des systèmes Unix, toujours active aujourd'hui, est née des travaux de Bill Joy à l'université de Berkeley en 1977 ?",
    "options": ["BSD", "GNU", "Minix", "Slackware"],
    "correctIndex": 0,
    "explanation": "En 1977, Bill Joy, étudiant à Berkeley, travaille à la compilation de BSD sur la base d'Unix V6, créant ainsi une nouvelle branche des systèmes Unix, toujours active aujourd'hui."
  },
  {
    "question": "Quel est le but du projet GNU lancé par Richard Stallman en 1983 ?",
    "options": ["Commercialiser une version propriétaire d'Unix pour les entreprises", "Créer un OS entièrement composé de logiciels libres, avec du code source accessible et modifiable", "Développer un nouveau langage de programmation concurrent du C", "Créer une mascotte reconnaissable pour Unix"],
    "correctIndex": 1,
    "explanation": "Le projet GNU, lancé par Richard Stallman en réponse à la fermeture des sources par de nombreux industriels, vise à créer un OS entièrement composé de logiciels libres, dont le code source est accessible et modifiable à l'envie."
  },
  {
    "question": "Qu'est-ce qui manquait au projet GNU jusqu'à ce qu'il trouve une solution grâce au projet de Linus Torvalds ?",
    "options": ["Un environnement graphique", "Un éditeur de texte", "Un noyau", "Une licence libre"],
    "correctIndex": 2,
    "explanation": "Le projet GNU s'est développé sans noyau jusque dans les années 90, noyau qu'il trouvera finalement grâce au projet Linux initié par Linus Torvalds."
  },
  {
    "question": "En quelle année Linus Torvalds annonce-t-il travailler sur un OS libre pour architecture i386, point de départ du projet Linux ?",
    "options": ["1983", "1987", "1996", "1991"],
    "correctIndex": 3,
    "explanation": "Le 25 août 1991, Linus Torvalds, alors étudiant à Helsinki, annonce aux utilisateurs de Minix qu'il travaille sur un OS libre pour architecture i386, dans un but initialement présenté comme un simple hobby."
  },
  {
    "question": "Comment appelle-t-on les différentes versions du système complet GNU/Linux, comme Debian, Ubuntu ou Red Hat ?",
    "options": ["Des distributions", "Des noyaux", "Des licences", "Des environnements graphiques"],
    "correctIndex": 0,
    "explanation": "On appelle \"distribution\" les différentes versions du système complet GNU/Linux, comme SLS (la première, en 1992), Slackware, Debian, Red Hat ou SuSE."
  },
  {
    "question": "Parmi les distributions suivantes, lesquelles sont citées comme étant apparues entre 1992 et 1994 et toujours présentes aujourd'hui ?",
    "options": ["Ubuntu, Linux Mint, Kali Linux et ZorinOS", "Slackware, Debian, SuSE et Red Hat", "CentOS, Raspbian, PrimTux et 3CX", "Gnome, KDE, XFCE et LXDE"],
    "correctIndex": 1,
    "explanation": "Le module cite Slackware (1993), Debian (1993), puis Red Hat et SuSE (1994) comme des distributions majeures, toutes les quatre encore présentes trois décennies plus tard."
  },
  {
    "question": "À quelle occasion particulière Dennis Ritchie, père du langage C et co-créateur d'Unix, est-il décédé en 2011 ?",
    "options": ["Le jour de la sortie d'une nouvelle version de Linux", "Le même jour que Linus Torvalds a créé Linux", "Six jours après le décès de Steve Jobs", "Lors de la création du projet Ubuntu"],
    "correctIndex": 2,
    "explanation": "Dennis Ritchie est décédé le 11 octobre 2011, six jours après le décès de Steve Jobs (survenu le 5 octobre), un événement souvent oublié malgré l'importance capitale de Ritchie dans l'histoire de l'informatique."
  },
  {
    "question": "Quelle interface est principalement utilisée par les professionnels pour interagir avec Linux au quotidien ?",
    "options": ["Une interface graphique de type bureau obligatoirement", "Une interface vocale", "Un navigateur web uniquement", "La ligne de commande (CLI, Command Line Interface)"],
    "correctIndex": 3,
    "explanation": "En tant que professionnel, Linux est principalement utilisé à travers la ligne de commande (CLI), qu'il s'agisse d'une connexion directe à une machine ou via un logiciel permettant de s'y connecter."
  },
  {
    "question": "Pourquoi les interfaces graphiques (GUI) restent-elles plutôt anecdotiques dans le monde de l'entreprise sous Linux, malgré leur existence ?",
    "options": ["Parce que la ligne de commande reste l'interface principale en entreprise, les GUI étant surtout utiles pour redonner vie à de vieux ordinateurs", "Parce qu'elles n'existent techniquement pas sous Linux", "Parce qu'elles sont payantes contrairement au CLI", "Parce qu'elles ne fonctionnent que sur Windows"],
    "correctIndex": 0,
    "explanation": "Les GUI existent bel et bien sous Linux (Gnome, KDE, XFCE, LXDE), mais restent anecdotiques en entreprise, où le CLI domine ; elles sont en revanche intéressantes pour redonner vie à des ordinateurs vieillissants grâce à leur faible consommation de ressources."
  },
  {
    "question": "Qu'est-ce qui distingue la distribution Red Hat (RHEL) pour une utilisation en production en entreprise ?",
    "options": ["Elle est entièrement libre et gratuite, sans aucune licence", "Elle est soumise à licence, et nécessite un abonnement donnant accès à un support privilégié", "Elle ne peut fonctionner que sur Raspberry Pi", "Elle est spécialisée exclusivement dans la sécurité informatique"],
    "correctIndex": 1,
    "explanation": "RHEL (Red Hat Enterprise Linux) est soumise à licence : les entreprises souhaitant l'utiliser en production doivent souscrire un abonnement donnant accès à un support privilégié de la part de Red Hat."
  },
  {
    "question": "Quelle évolution a connu CentOS en 2021, modifiant son positionnement pour les entreprises ?",
    "options": ["CentOS est devenue totalement gratuite, sans aucune restriction", "CentOS a été rachetée par Debian", "CentOS a évolué vers CentOS Stream, moins adaptée à une utilisation classique en entreprise", "CentOS a été renommée en Ubuntu Server"],
    "correctIndex": 2,
    "explanation": "Jusqu'en 2021, CentOS était une version downstream de Red Hat, compatible mais sans support officiel ; en 2021, elle a évolué vers CentOS Stream, un positionnement moins adapté à une utilisation classique en entreprise."
  },
  {
    "question": "Que signifie le sigle LTS pour une distribution comme Ubuntu, et pourquoi est-il recommandé en entreprise ?",
    "options": ["Light Terminal System, une version allégée sans interface graphique", "Linux Testing Server, une version réservée aux environnements de test", "Licensed Total Software, une version nécessitant obligatoirement une licence payante", "Long Time Support, pour bénéficier de mises à jour et d'un support généralement pendant 5 ans"],
    "correctIndex": 3,
    "explanation": "LTS signifie Long Time Support : une version LTS d'Ubuntu garantit généralement 5 ans de mises à jour et de support, contrairement aux versions intermédiaires qui ne garantissent qu'un an."
  },
  {
    "question": "Sur quel noyau le système d'exploitation Android, utilisé sur de nombreux smartphones, est-il basé ?",
    "options": ["Un noyau Linux", "Un noyau Windows", "Un noyau BSD", "Un noyau propriétaire sans lien avec Unix ou Linux"],
    "correctIndex": 0,
    "explanation": "Le module précise qu'Android, système présent sur de nombreux smartphones, est basé sur un noyau Linux, illustrant la présence majoritaire de Linux dans le monde aujourd'hui."
  },
  {
    "question": "Pourquoi la distribution Kali Linux doit-elle être manipulée avec précaution en environnement professionnel ?",
    "options": ["Parce qu'elle est extrêmement instable et plante régulièrement", "Parce que certains des outils orientés sécurité qu'elle inclut pourraient être perçus comme une tentative de piratage interne", "Parce qu'elle nécessite obligatoirement une licence payante", "Parce qu'elle n'est compatible qu'avec le matériel Raspberry Pi"],
    "correctIndex": 1,
    "explanation": "Kali Linux, distribution orientée sécurité très connue des spécialistes, inclut de nombreux outils qui pourraient, si utilisés à la légère en entreprise, être considérés comme une tentative de piratage interne."
  },
  {
    "question": "Quelles sont les quatre libertés fondamentales définies par la licence GNU General Public License (GPL) ?",
    "options": ["Vendre le logiciel sans restriction, le modifier uniquement en interne, le garder secret, et interdire sa redistribution", "Utiliser le logiciel uniquement à des fins non commerciales, ne jamais le modifier, et le redistribuer uniquement sous forme compilée", "Exécuter le logiciel pour n'importe quel usage, l'étudier et l'adapter via le code source, redistribuer des copies, et faire bénéficier la communauté des versions modifiées", "Étudier uniquement le code source sans droit de modification ni de redistribution"],
    "correctIndex": 2,
    "explanation": "La licence GNU GPL définit quatre libertés : exécuter le logiciel pour n'importe quel usage, l'étudier et l'adapter grâce à l'accès au code source, redistribuer des copies, et faire bénéficier la communauté des versions modifiées."
  },
  {
    "question": "Quelle licence libre, sans copyleft et autorisant une réutilisation sans restriction, a notamment permis à Steve Jobs de créer Mac OS X ?",
    "options": ["La licence GNU GPL", "La licence Apache", "La licence CeCILL", "La licence BSD"],
    "correctIndex": 3,
    "explanation": "La licence BSD, qui autorise une réutilisation sans restriction et ne comporte pas de copyleft, est la licence grâce à laquelle Steve Jobs a pu s'appuyer sur du code existant pour créer Mac OS X."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-1-introduction-a-unix-linux",
      dataId: "quiz-cours-03-utilisateur-d-une-distribution-gnu-linux-module-1-introduction-a-unix-linux-data",
    });
  });
</script>
