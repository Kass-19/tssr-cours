# Module 7 : La gestion du réseau et du pare-feu

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module couvre la gestion du réseau et du pare-feu sous Windows 10 : la carte réseau et son profil (emplacement réseau), la configuration de la carte réseau (adressage statique/dynamique) ainsi que les outils de diagnostic réseau, et enfin les trois niveaux de configuration du pare-feu Windows.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La carte réseau et le profil

### 1.1 Le centre Réseau et partage

Le **Centre Réseau et partage** permet de configurer le comportement du système sur le réseau. Il est accessible depuis l'icône réseau de la barre de notification ou depuis le panneau de configuration.

Il donne des informations sur :
- la connectivité du poste et les différentes connexions réseau détectées (utile si plusieurs cartes réseau sont présentes) ;
- le **profil réseau** associé à chaque carte ;
- la configuration des fonctionnalités de partage et des cartes réseau elles-mêmes.

### 1.2 Les profils réseau (emplacements réseau)

Chaque carte réseau est associée à un profil prédéfini, appelé aussi **emplacement réseau**. L'objectif principal du profil est de faire en sorte que le pare-feu du système s'adapte à l'emplacement dans lequel on se connecte — particulièrement utile dans un contexte de mobilité.

| Profil | Niveau de confiance | Comportement du pare-feu | Déclenchement |
|---|---|---|---|
| **Réseau privé** | Réseau de confiance, connectivité maîtrisée et sécurisée | Laisse passer un bon nombre de communications | Choisi manuellement pour un réseau connu et fiable |
| **Réseau avec domaine** | Confiance la plus élevée | Laisse passer davantage de communications, notamment avec le contrôleur de domaine et les autres machines membres du domaine | Détecté automatiquement une fois l'ordinateur joint au domaine ; **non modifiable** manuellement dans ce cas |
| **Réseau public** | Réseau ouvert à tous, donc plus risqué | Bloque un bon nombre de communications pour protéger le système | S'applique automatiquement si aucune passerelle par défaut ou aucun domaine n'est détecté, ou si l'on choisit de rendre l'ordinateur invisible sur le réseau |

---

## 2. Configurer la carte réseau

### 2.1 Accéder aux propriétés de la carte réseau

Plusieurs façons d'accéder à la configuration de la carte réseau :

- via le panneau de configuration ;
- via le Centre Réseau et partage ;
- via la commande :

```cmd
ncpa.cpl
```

### 2.2 Adressage statique et adressage dynamique

| Mode | Principe |
|---|---|
| **Statique (manuel)** | L'adresse IP, le masque, la passerelle par défaut et les serveurs DNS sont renseignés manuellement dans les propriétés de la carte réseau |
| **Dynamique** | Ces informations sont obtenues automatiquement, fournies par un serveur **DHCP** ou, à défaut, par le service **APIPA** |

📌 **APIPA** (*Automatic Private IP Addressing*) est un service natif de Windows qui fournit une configuration IP temporaire lorsqu'aucun serveur DHCP n'est joignable. Le réseau réservé à APIPA est `169.254.0.0/16` ; il permet uniquement de communiquer avec les autres machines du réseau local également adressées en APIPA.

### 2.3 Outils de diagnostic réseau

Pour vérifier le bon fonctionnement de la carte réseau et investiguer en cas de problème :

- graphiquement, la zone de notification et le Centre Réseau et partage donnent de premières informations, ainsi qu'un **assistant de résolution des problèmes** qui réalise un diagnostic automatique de la connexion (hérité de l'édition Famille, davantage orienté utilisateur final que technicien/administrateur) ;
- en ligne de commande, plusieurs outils de l'invite de commandes restent les plus efficaces pour un usage technique :

| Commande | Rôle |
|---|---|
| `arp` | Gestion/consultation du cache de résolution d'adresses ARP |
| `ipconfig` | Affiche la configuration réseau et interagit avec la pile réseau (DNS, DHCP) |
| `ping` | Teste la connectivité (⚠️ bloqué par défaut par le pare-feu Windows en entrée) |
| `tracert` | Teste la route empruntée par les paquets TCP/IP |
| `netstat` | Vérifie l'état de la couche 4 du modèle OSI (connexions/ports) |
| `nslookup` | Diagnostic de la résolution de noms d'hôtes (DNS) |

📌 `cmd.exe` regorge de commandes d'investigation réseau au-delà de cette liste.

---

## 3. Le pare-feu Windows

### 3.1 Rôle du pare-feu

Windows 10 embarque nativement un pare-feu, activé par défaut, qui observe et filtre les communications réseau **entrantes** et **sortantes** du système, afin de le protéger contre les accès non autorisés.

Par défaut, le pare-feu Windows :
- **bloque** une partie des connexions entrantes ;
- **laisse passer** les connexions sortantes.

Il repose sur des règles prédéfinies fournies par le système, facilement activables depuis les consoles de gestion, et qui s'adaptent automatiquement selon le profil réseau détecté (voir section 1.2). Il est également possible de créer des règles personnalisées.

### 3.2 Les trois niveaux de configuration

Le pare-feu Windows propose trois niveaux de configuration, du plus général au plus précis :

| Niveau | Granularité | Description |
|---|---|---|
| **1 — Activation globale** | Par profil réseau | Active ou désactive totalement le pare-feu pour chaque profil (ex. activé pour le réseau privé, désactivable si besoin) |
| **2 — Autorisation par application** | Par application | Autorise ou bloque le trafic généré par une application particulière, en la sélectionnant dans la liste proposée |
| **3 — Règles avancées (entrantes/sortantes)** | Par règle détaillée | Permet de filtrer le trafic entrant/sortant selon des critères précis (adresses IP sources, ports de destination...), via des règles prédéfinies ou des règles personnalisées |

Ces trois consoles de gestion du pare-feu sont accessibles depuis le panneau de configuration, ou plus directement via la commande :

```cmd
firewall.cpl
```

## ✅ Points clés à retenir

- Le Centre Réseau et partage centralise la gestion de la connectivité, des profils réseau et du partage.
- Chaque carte réseau est associée à un profil (emplacement réseau) qui adapte automatiquement le comportement du pare-feu : réseau privé (confiance, peu de restrictions), réseau de domaine (confiance maximale, non modifiable une fois joint au domaine), réseau public (restrictions maximales, profil par défaut en l'absence de passerelle ou de domaine détecté).
- La carte réseau se configure en statique (IP/masque/passerelle/DNS manuels) ou en dynamique (DHCP, ou APIPA en secours sur `169.254.0.0/16` si aucun DHCP n'est joignable) ; `ncpa.cpl` ouvre directement les connexions réseau.
- Les outils en ligne de commande (`arp`, `ipconfig`, `ping`, `tracert`, `netstat`, `nslookup`) restent les plus efficaces pour diagnostiquer un problème réseau, `ping` étant bloqué par défaut en entrée par le pare-feu Windows.
- Le pare-feu Windows, activé par défaut, bloque une partie du trafic entrant et laisse passer le trafic sortant ; il se configure sur 3 niveaux — activation globale par profil, autorisation par application, règles avancées entrantes/sortantes — accessibles via le panneau de configuration ou `firewall.cpl`.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-7-la-gestion-du-reseau-et-du-pare-feu"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-7-la-gestion-du-reseau-et-du-pare-feu-data">
[
  {
    "question": "Depuis où peut-on accéder au Centre Réseau et partage sous Windows 10 ?",
    "options": ["Depuis l'icône réseau de la barre de notification ou depuis le panneau de configuration", "Uniquement depuis la commande diskmgmt.msc", "Uniquement depuis le gestionnaire des tâches", "Uniquement depuis l'invite de commande"],
    "correctIndex": 0,
    "explanation": "Le Centre Réseau et partage est disponible depuis l'icône réseau de la barre de notification, mais aussi depuis le panneau de configuration."
  },
  {
    "question": "À quoi sert principalement le profil réseau (emplacement réseau) associé à une carte réseau ?",
    "options": ["À définir automatiquement l'adresse MAC de la carte réseau", "À faire en sorte que le pare-feu du système s'adapte à l'emplacement dans lequel on se connecte", "À choisir la vitesse de transmission de la carte réseau", "À attribuer un nom d'hôte permanent à l'ordinateur"],
    "correctIndex": 1,
    "explanation": "Le but premier du profil réseau est de faire en sorte que le pare-feu du système s'adapte à l'emplacement dans lequel on se connecte, ce qui est particulièrement pratique dans un contexte de mobilité."
  },
  {
    "question": "Quel comportement adopte le pare-feu pour l'emplacement réseau « privé » ?",
    "options": ["Il bloque systématiquement toutes les communications entrantes et sortantes", "Il désactive complètement le pare-feu sans possibilité de le réactiver", "Il laisse passer un bon nombre de communications, car ce réseau est considéré de confiance", "Il applique les mêmes règles strictes que pour le réseau public"],
    "correctIndex": 2,
    "explanation": "Le réseau privé est considéré comme un réseau de confiance à la connectivité maîtrisée ; le pare-feu s'adapte donc en laissant passer un bon nombre de communications."
  },
  {
    "question": "Pourquoi le profil réseau avec domaine n'est-il plus modifiable une fois l'ordinateur joint au domaine de l'entreprise ?",
    "options": ["Parce que Windows verrouille tous les profils réseau dès l'installation", "Parce qu'il n'existe techniquement qu'un seul profil réseau possible sur un ordinateur", "Parce que ce profil doit être configuré manuellement avant toute jonction au domaine", "Parce que ce profil de plus grande confiance est automatiquement appliqué et géré par la jonction au domaine"],
    "correctIndex": 3,
    "explanation": "L'emplacement réseau avec domaine est un profil de plus grande confiance, laissant passer davantage de communications notamment avec le contrôleur de domaine ; il n'est plus modifiable une fois l'ordinateur joint au domaine de l'entreprise."
  },
  {
    "question": "Dans quel cas le profil réseau public s'applique-t-il automatiquement ?",
    "options": ["Lorsqu'aucune passerelle par défaut ou aucun domaine n'est détecté, ou si l'ordinateur est rendu invisible sur le réseau", "Lorsque l'ordinateur est joint à un domaine d'entreprise", "Lorsque l'utilisateur active manuellement le mode avion", "Lorsque le pare-feu Windows est complètement désactivé"],
    "correctIndex": 0,
    "explanation": "Le profil réseau public s'applique automatiquement lorsqu'aucune passerelle par défaut ou aucun domaine n'est détecté, ou bien si l'utilisateur décide de rendre son ordinateur invisible sur le réseau ; le pare-feu bloque alors un bon nombre de communications."
  },
  {
    "question": "Quelle commande permet d'accéder rapidement aux propriétés des cartes réseau sous Windows 10 ?",
    "options": ["firewall.cpl", "ncpa.cpl", "diskmgmt.msc", "lusrmgr.msc"],
    "correctIndex": 1,
    "explanation": "La commande ncpa.cpl permet d'accéder rapidement aux propriétés des cartes réseau, en complément du panneau de configuration ou du Centre Réseau et partage."
  },
  {
    "question": "Comment appelle-t-on le mode de configuration d'une carte réseau où l'on renseigne manuellement l'adresse IP, le masque et la passerelle ?",
    "options": ["L'adressage dynamique", "L'adressage APIPA", "L'adressage statique", "L'adressage par proxy"],
    "correctIndex": 2,
    "explanation": "Lorsqu'on renseigne manuellement l'adresse IP, le masque, la passerelle par défaut et le serveur DNS, on configure la carte réseau de manière statique, par opposition à l'adressage dynamique fourni automatiquement."
  },
  {
    "question": "Quels services peuvent fournir automatiquement les informations réseau (adresse IP, masque, passerelle) dans le cadre de l'adressage dynamique ?",
    "options": ["Le service DNS ou le service NTP", "Le pare-feu Windows ou l'UAC", "Le service Active Directory ou le service WSUS", "Le serveur DHCP ou le service APIPA"],
    "correctIndex": 3,
    "explanation": "En adressage dynamique, les informations réseau sont automatiquement fournies soit par un serveur DHCP, soit par le service APIPA lorsque aucun serveur DHCP n'est joignable."
  },
  {
    "question": "Quel est le réseau réservé au service APIPA sous Windows ?",
    "options": ["169.254.0.0/16", "10.0.0.0/8", "192.168.0.0/16", "127.0.0.0/8"],
    "correctIndex": 0,
    "explanation": "Le service APIPA, natif sous Windows, utilise le réseau réservé 169.254.0.0/16 pour fournir une configuration temporaire lorsque aucun serveur DHCP n'est joignable."
  },
  {
    "question": "Avec quelles machines un ordinateur configuré en APIPA peut-il éventuellement communiquer ?",
    "options": ["Avec n'importe quelle machine disposant d'un accès Internet", "Avec les autres machines de son réseau local également adressées en APIPA", "Uniquement avec le contrôleur de domaine de l'entreprise", "Avec aucune autre machine, APIPA isole totalement l'ordinateur"],
    "correctIndex": 1,
    "explanation": "Un ordinateur adressé en APIPA peut éventuellement communiquer avec les autres machines de son réseau local qui sont elles aussi adressées en APIPA, mais pas au-delà."
  },
  {
    "question": "Pourquoi l'assistant graphique « Résoudre les problèmes » n'est-il généralement pas privilégié par les techniciens et administrateurs ?",
    "options": ["Parce qu'il nécessite une licence supplémentaire payante", "Parce qu'il ne fonctionne que sur les serveurs Windows", "Parce qu'il est plutôt orienté vers les utilisateurs, hérité de l'édition Famille", "Parce qu'il désactive automatiquement le pare-feu pendant son exécution"],
    "correctIndex": 2,
    "explanation": "L'assistant « Résoudre les problèmes » est un héritage de l'édition Famille, plutôt orienté vers l'utilisateur final ; les techniciens et administrateurs préfèrent généralement les outils en ligne de commande, plus précis et efficaces."
  },
  {
    "question": "Quelle commande affiche la configuration réseau et permet d'interagir avec le DNS et le DHCP (comme /flushdns ou /release) ?",
    "options": ["arp", "netstat", "nslookup", "ipconfig"],
    "correctIndex": 3,
    "explanation": "ipconfig affiche la configuration réseau d'un poste et permet d'interagir avec les services DNS et DHCP, par exemple pour vider le cache DNS ou libérer/renouveler une adresse IP."
  },
  {
    "question": "Pourquoi la commande ping peut-elle parfois échouer par défaut sur un poste Windows, même si la machine cible est bien joignable ?",
    "options": ["Parce que le pare-feu Windows bloque par défaut certaines requêtes ICMP entrantes", "Parce que ping ne fonctionne que sur les réseaux IPv6", "Parce que ping nécessite obligatoirement des privilèges d'administrateur", "Parce que ping est incompatible avec le protocole TCP/IP"],
    "correctIndex": 0,
    "explanation": "Le protocole utilisé par ping (ICMP) est bloqué par défaut par le pare-feu Windows, ce qui peut expliquer l'absence de réponse même lorsque la machine cible est correctement joignable."
  },
  {
    "question": "Quelle commande permet de diagnostiquer la résolution de noms d'hôtes, par exemple pour vérifier qu'un domaine se résout bien en une adresse IP ?",
    "options": ["tracert", "nslookup", "netstat", "arp"],
    "correctIndex": 1,
    "explanation": "nslookup permet de diagnostiquer la résolution de noms d'hôtes, en interrogeant directement un serveur DNS pour vérifier la correspondance entre un nom de domaine et une adresse IP."
  },
  {
    "question": "Quelle commande permet de vérifier les informations relatives à la couche 4 (Transport) du modèle OSI, comme les connexions et ports actifs ?",
    "options": ["tracert", "arp", "netstat", "ipconfig"],
    "correctIndex": 2,
    "explanation": "netstat permet de vérifier les informations relatives à la couche 4 (Transport) du modèle OSI, notamment les connexions réseau actives et les ports en écoute."
  },
  {
    "question": "Le pare-feu Windows est-il activé par défaut sur un système Windows 10 ?",
    "options": ["Non, il doit systématiquement être activé manuellement après l'installation", "Non, il n'est disponible que sur les éditions Entreprise de Windows 10", "Oui, mais uniquement pour le profil réseau public", "Oui, le pare-feu est activé par défaut"],
    "correctIndex": 3,
    "explanation": "Windows 10 embarque nativement un pare-feu qui est activé par défaut, permettant au système de se protéger contre les accès non autorisés dès l'installation."
  },
  {
    "question": "Quel comportement par défaut adopte le pare-feu Windows concernant les connexions entrantes et sortantes ?",
    "options": ["Il bloque certaines connexions entrantes et laisse passer les connexions sortantes", "Il bloque systématiquement toutes les connexions, entrantes comme sortantes", "Il laisse passer toutes les connexions, entrantes comme sortantes, par défaut", "Il bloque uniquement les connexions sortantes, sans jamais filtrer les connexions entrantes"],
    "correctIndex": 0,
    "explanation": "Par défaut, le pare-feu Windows bloque certaines connexions en entrée tout en laissant passer les connexions sortantes, ce comportement s'appuyant sur des règles prédéfinies par le système."
  },
  {
    "question": "Que permet le premier niveau de configuration du pare-feu Windows ?",
    "options": ["Filtrer précisément le trafic entrant en fonction des adresses IP sources", "Activer ou désactiver totalement le fonctionnement du pare-feu selon le profil réseau détecté", "Autoriser granulairement le trafic généré par une application spécifique", "Créer des règles personnalisées basées sur les ports de destination"],
    "correctIndex": 1,
    "explanation": "Le premier niveau de configuration du pare-feu Windows permet d'activer ou de désactiver totalement son fonctionnement, et ce en fonction du profil réseau détecté (privé, domaine ou public)."
  },
  {
    "question": "Que permet le deuxième niveau de configuration du pare-feu Windows, plus précis que le premier ?",
    "options": ["Activer ou désactiver totalement le pare-feu", "Filtrer le trafic entrant selon les adresses IP sources ou les ports de destination", "Autoriser granulairement le trafic réseau généré par une application particulière", "Configurer le profil réseau de la carte réseau"],
    "correctIndex": 2,
    "explanation": "Le deuxième niveau de configuration du pare-feu Windows permet d'autoriser de manière granulaire le trafic généré par une application particulière, en la retrouvant dans la liste proposée."
  },
  {
    "question": "Quelle commande permet d'accéder rapidement aux consoles de gestion du pare-feu Windows ?",
    "options": ["ncpa.cpl", "timedate.cpl", "lusrmgr.msc", "firewall.cpl"],
    "correctIndex": 3,
    "explanation": "Les trois consoles de gestion du pare-feu Windows sont accessibles depuis le panneau de configuration, ou plus rapidement grâce à la commande firewall.cpl."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-7-la-gestion-du-reseau-et-du-pare-feu",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-7-la-gestion-du-reseau-et-du-pare-feu-data",
    });
  });
</script>
