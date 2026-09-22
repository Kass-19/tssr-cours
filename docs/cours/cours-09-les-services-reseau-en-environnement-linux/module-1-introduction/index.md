# Module 1 : Introduction

*Cours : [Cours 9 - Les services réseau en environnement Linux](../index.md)*

## 🎯 Objectif du module

Ce module pose le cadre général du cours : il présente l'infrastructure réseau d'entreprise que nous allons mettre en place tout au long de la formation, les services essentiels qui la composent (DHCP, DNS, services de fichiers, routage...), ainsi que la maquette technique ("bac à sable") qui servira de support à l'ensemble des travaux pratiques.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Les besoins : de l'utilisateur au service

### 1.1 Des usages multiples, des accès multiples

Les utilisateurs d'une entreprise accèdent au système d'information dans des contextes très variés :

| Dimension | Exemples |
|---|---|
| **Interface / device** | Ordinateur portable, smartphone, poste fixe, tablette |
| **Lieu** | Bureau, domicile (télétravail), transports |
| **Type d'accès** | Réseau local de l'entreprise, réseau Internet public, connexion nomade |

Quel que soit le point d'entrée, l'utilisateur finit par accéder à des **services** : partage de fichiers, résolution de noms, attribution d'adresses IP, applications métier, etc.

📌 *Le schéma du support résume ce contexte : les utilisateurs (interfaces variées, lieux variés) convergent vers le contexte réseau de l'entreprise, qui expose lui-même un ensemble de services (fichiers, annuaire, base de données...).*

### 1.2 La gestion des services : qui en a la charge ?

Deux modèles d'organisation coexistent généralement, selon la taille et le périmètre fonctionnel de l'entreprise :

- **une équipe système interne**, lorsque l'entreprise dispose d'un périmètre fonctionnel suffisant pour justifier une équipe dédiée ;
- **une entreprise sous-traitante** (infogérance), lorsque ce n'est pas le cas.

Dans les deux cas, les services constituent le **cœur du système d'information** : ce sont eux qui permettent concrètement à l'entreprise de fonctionner au quotidien — sans DHCP, DNS ou services de fichiers opérationnels, les utilisateurs ne peuvent tout simplement pas travailler.

### 1.3 Les principaux services abordés dans le cours

Le cours suit une progression logique, du plus fondamental (le réseau lui-même) vers les services applicatifs qui en dépendent :

1. **Mise en place du réseau** — la base sur laquelle tout le reste repose.
2. **Routage** — la communication entre les différents sous-réseaux de l'infrastructure.
3. **DNS** (deux modules) — la résolution de noms.
4. **DHCP** — l'attribution dynamique des adresses IP.

Voici un exemple illustratif (pseudo-code, non exécutable) du type d'informations qu'un service de configuration réseau doit gérer :

```text
# Exemple de configuration réseau
network_configuration = {
  :ip_address => "192.168.1.1",
  :subnet_mask => "255.255.255.0",
  :gateway => "192.168.1.254"
}
```

⚠️ Il s'agit ici d'un exemple pédagogique de représentation des paramètres réseau (adresse IP, masque, passerelle), et non d'une syntaxe de configuration réelle à reproduire telle quelle.

### Points clés à retenir (section 1)

- Les utilisateurs accèdent aux services de l'entreprise depuis des interfaces et des lieux très variés (poste fixe, mobile, bureau, domicile, transport).
- Les services sont gérés soit par une équipe système interne, soit par un prestataire externe.
- Les services sont au cœur du système d'information : c'est leur disponibilité qui conditionne le fonctionnement de l'entreprise.
- Le cours progresse du réseau vers le routage, puis vers les services applicatifs (DNS, DHCP).

---

## 2. Préparation du bac à sable

### 2.1 Objectif de la maquette

Pour pouvoir manipuler et expérimenter sans risque, le cours s'appuie sur un **environnement virtuel dédié** ("bac à sable" / *sandbox*), reproduisant à échelle réduite une infrastructure d'entreprise complète.

Cet environnement repose sur deux briques principales :

| Composant | Rôle |
|---|---|
| **Debian** | Système d'exploitation des machines virtuelles hébergeant les différents services (DHCP, DNS, fichiers...) |
| **PFSense** | Système d'exploitation dédié au routage et au filtrage (pare-feu / routeur) |

Les dernières versions des images ISO de ces systèmes doivent être téléchargées depuis les sites officiels des éditeurs respectifs avant de commencer les travaux pratiques.

### 2.2 Organisation des machines virtuelles

Plusieurs machines virtuelles Debian sont mises en place, chacune pouvant héberger un ou plusieurs services selon les besoins, aux côtés d'une machine virtuelle dédiée à PFSense.

La virtualisation est assurée par **VMware Workstation**. Un point d'attention particulier doit être porté à la **définition précise des réseaux virtuels** : chaque réseau de la maquette est isolé sur un **VMnet** distinct, afin de simuler fidèlement la segmentation réseau d'une infrastructure d'entreprise réelle (séparation des flux clients, serveurs, et accès Internet).

### 2.3 Schéma de l'infrastructure de la maquette

En lisant le schéma de droite à gauche, l'infrastructure se présente ainsi :

1. **Connexion Internet** (nuage) ;
2. **Passerelle FAI**, à l'adresse `88.44.22.254` ;
3. **Firewall / routeur PFSense**, connecté derrière la connexion Internet, qui gère les communications entre le LAN clients et le LAN serveurs ;
4. **Deux réseaux locaux internes**, séparés par fonction :
   - **LAN Clients** : `172.18.num_stag.0/24`
   - **LAN Serveurs** : `192.168.num_stag.0/24`
5. Un réseau intermédiaire `172.30.num_stag.0/24` entre les machines et le PFSense ;
6. Sur le LAN Serveurs, une machine Debian héberge les services **DHCP** et **DNS**.

`num_stag` désigne un numéro de réseau attribué à chaque stagiaire, afin que chaque maquette individuelle dispose de sa propre plage d'adressage.

### 2.4 Adaptation des adresses IP à son environnement de travail

Les schémas du support utilisent des adresses génériques (par exemple `88.44.22.0/24` pour le réseau du FAI) qui doivent être **adaptées à l'environnement réel** de chaque stagiaire avant toute mise en pratique.

⚠️ Deux adaptations systématiques sont à effectuer :

| À adapter | Valeur du schéma | Exemple de valeur réelle |
|---|---|---|
| Réseau LAN du FAI | `88.44.22.0/24` | `192.168.1.0/24` (cas fréquent d'un LAN ADSL/box) |
| Adresse IP de la passerelle FAI | `88.44.22.254` | `192.168.1.1` ou `192.168.1.254` (adresse de la box Internet) |

Exemple illustratif de la configuration à adapter (pseudo-code, non exécutable) :

```text
configurer_adresse_ip
  network "192.168.1.0/24"
  gateway "192.168.1.1"
```

📌 En pratique, sur un réseau domestique type ADSL/box, le réseau local est très souvent en `192.168.1.0/24`, et l'adresse de la passerelle FAI correspond à celle fournie par la box Internet du stagiaire — ces valeurs doivent être vérifiées et ajustées à chaque nouvelle mise en place.

## ✅ Points clés à retenir

- Le bac à sable repose sur des VM **Debian** (services) et une VM **PFSense** (routage/pare-feu), virtualisées sous **VMware Workstation**.
- Chaque réseau de la maquette est isolé sur un **VMnet** dédié pour simuler une segmentation réseau d'entreprise réaliste.
- L'infrastructure type comprend : Internet → passerelle FAI → PFSense (firewall/routeur) → LAN Clients et LAN Serveurs (avec DHCP et DNS sur ce dernier).
- Les adresses IP génériques des schémas (réseau et passerelle FAI) doivent systématiquement être adaptées à l'environnement réel du stagiaire avant toute manipulation.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-1-introduction"></div>

<script type="application/json" id="quiz-cours-09-les-services-reseau-en-environnement-linux-module-1-introduction-data">
[
  {
    "question": "À quel public s'adresse ce module d'introduction ?",
    "options": ["Des techniciens systèmes et réseaux possédant déjà une base en système, réseau et Linux", "Des développeurs web sans notion réseau", "Des utilisateurs finaux sans compétence technique", "Des administrateurs bases de données uniquement"],
    "correctIndex": 0,
    "explanation": "Le module précise qu'il s'adresse à des techniciens systèmes et réseaux disposant déjà d'une base de compétences en système, réseau et Linux, l'objectif étant d'approfondir la mise en place des services essentiels à l'infrastructure."
  },
  {
    "question": "Quels services sont cités comme faisant partie de l'infrastructure à mettre en place ?",
    "options": ["Uniquement la messagerie électronique", "Le DHCP, le DNS, ainsi que les services de fichiers", "Uniquement la virtualisation", "Le seul service d'impression réseau"],
    "correctIndex": 1,
    "explanation": "Le module annonce le déploiement de plusieurs services essentiels, notamment le DHCP, le DNS et les services de fichiers, en insistant sur leur configuration et leur gestion pour garantir disponibilité et efficacité."
  },
  {
    "question": "Depuis quels types d'éléments les utilisateurs accèdent-ils au système d'information de l'entreprise, selon le module ?",
    "options": ["Uniquement depuis des ordinateurs de bureau fixes", "Uniquement via une connexion filaire au bureau", "Depuis différents devices (ordinateurs, téléphones, tablettes) et différents lieux (bureau, transport, domicile, télétravail)", "Uniquement depuis des bornes dédiées en entreprise"],
    "correctIndex": 2,
    "explanation": "Le module souligne que les utilisateurs se connectent depuis des appareils variés (ordinateurs, téléphones, tablettes) et depuis des lieux différents (bureau, transports, domicile, télétravail), ce qui conditionne la conception des services."
  },
  {
    "question": "Qui peut assurer la gestion des services d'un système d'information selon le module ?",
    "options": ["Uniquement un prestataire externe, jamais une équipe interne", "Uniquement les utilisateurs finaux eux-mêmes", "Uniquement le fournisseur d'accès Internet", "Soit l'équipe système interne de l'entreprise, soit une entreprise sous-traitante"],
    "correctIndex": 3,
    "explanation": "Le module indique que la gestion des services peut être assurée soit par l'équipe système de l'entreprise si le périmètre fonctionnel le permet, soit par une entreprise sous-traitante."
  },
  {
    "question": "Dans quel ordre le cours annonce-t-il d'aborder les différentes thématiques après la mise en place du réseau ?",
    "options": ["Le routage, puis deux modules sur le DNS, puis le DHCP", "DNS, puis routage, puis DHCP", "DHCP, puis routage, puis DNS", "Uniquement le DHCP, sans routage ni DNS"],
    "correctIndex": 0,
    "explanation": "Le module précise la progression pédagogique : après la mise en place du réseau, le cours enchaîne sur la partie routage, puis consacre deux modules à la partie DNS, avant de terminer par la partie DHCP."
  },
  {
    "question": "Dans l'exemple de configuration réseau donné dans le module (192.168.1.1), à quoi correspond le masque de sous-réseau indiqué ?",
    "options": ["255.255.0.0", "255.255.255.0", "255.0.0.0", "255.255.255.255"],
    "correctIndex": 1,
    "explanation": "L'exemple de configuration fourni associe l'adresse IP 192.168.1.1 au masque de sous-réseau 255.255.255.0 et à la passerelle 192.168.1.254."
  },
  {
    "question": "Que désigne le terme \"bac à sable\" évoqué dans le module ?",
    "options": ["Un outil de sauvegarde des données de production", "Un service de stockage cloud public", "Un environnement virtuel dédié à l'apprentissage et à l'expérimentation", "Un antivirus intégré à Windows"],
    "correctIndex": 2,
    "explanation": "Le \"bac à sable\" désigne l'environnement virtuel mis en place pour s'entraîner et expérimenter sans risque, en amont des travaux pratiques du cours."
  },
  {
    "question": "Quels systèmes le module propose-t-il d'installer sous forme de machines virtuelles pour construire le bac à sable ?",
    "options": ["Des systèmes macOS et Windows Server uniquement", "Uniquement des distributions Red Hat", "Uniquement des appliances Cisco", "Des systèmes PFSense et Debian"],
    "correctIndex": 3,
    "explanation": "Le module indique qu'il faut installer des machines virtuelles sous PFSense (pour le routage/pare-feu) et sous Debian, en téléchargeant les dernières versions des ISO disponibles chez les éditeurs respectifs."
  },
  {
    "question": "Quel logiciel de virtualisation est utilisé pour mettre en place les machines virtuelles du module ?",
    "options": ["VMware Workstation", "VirtualBox", "Hyper-V", "Proxmox VE"],
    "correctIndex": 0,
    "explanation": "Le module précise que la virtualisation s'appuie sur VMware Workstation, avec une attention particulière portée à la définition précise des différents réseaux mis en place."
  },
  {
    "question": "Comment les différents réseaux de la maquette sont-ils isolés dans VMware Workstation pour simuler une infrastructure d'entreprise complète ?",
    "options": ["En utilisant des VLAN configurés sur un switch physique", "En les isolant sur des VMnets distincts", "En les séparant grâce à des adresses MAC différentes", "En désactivant le partage réseau de l'hyperviseur"],
    "correctIndex": 1,
    "explanation": "Le module explique que les réseaux sont isolés sur des VMnets, ce qui permet de simuler une infrastructure complète d'entreprise au sein de VMware Workstation."
  },
  {
    "question": "En lisant le schéma d'infrastructure de la droite vers la gauche, par quel élément commence-t-on ?",
    "options": ["Le LAN serveur", "Le contrôleur de domaine", "Un premier firewall", "Le commutateur central"],
    "correctIndex": 2,
    "explanation": "Le module décrit le schéma lu de droite à gauche : on commence par un premier firewall, suivi d'un routeur PFSense connecté derrière la connexion Internet."
  },
  {
    "question": "Quel rôle joue le routeur PFSense dans le schéma d'infrastructure décrit ?",
    "options": ["Il sert uniquement de serveur de messagerie", "Il héberge le service DNS interne exclusivement", "Il remplace le firewall en début de chaîne", "Il gère les communications entre le LAN client et le LAN serveur"],
    "correctIndex": 3,
    "explanation": "Le routeur tournant sous PFSense, connecté derrière la connexion Internet, gère les communications entre le LAN client et le LAN serveur au sein de l'infrastructure."
  },
  {
    "question": "Sur quel type de schéma le module s'appuie-t-il pour définir les numéros de réseau prédéfinis à adapter ?",
    "options": ["Le schéma NumStage", "Le schéma ISO 27001", "Le schéma RFC 1918", "Le schéma OSI en 7 couches"],
    "correctIndex": 0,
    "explanation": "Le module indique que les configurations doivent être adaptées en se basant sur le schéma NumStage, qui définit des numéros de réseau prédéfinis à ajuster selon l'environnement réel."
  },
  {
    "question": "Dans l'exemple du module, le réseau 88.44.22.0/24 présent sur certains schémas doit être remplacé par quoi ?",
    "options": ["Un réseau IPv6 équivalent", "Le réseau local propre à l'espace de travail utilisé", "Une adresse de loopback", "Le réseau 10.0.0.0/8 systématiquement"],
    "correctIndex": 1,
    "explanation": "Le module précise que des configurations comme 88.44.22.0/24 sont des exemples génériques qui doivent être modifiées selon le réseau local propre à l'espace de travail de chacun."
  },
  {
    "question": "D'après le module, à quel réseau correspond typiquement un LAN ADSL domestique ?",
    "options": ["172.16.0.0/24", "10.10.10.0/24", "192.168.1.0/24", "8.8.8.0/24"],
    "correctIndex": 2,
    "explanation": "Le module indique que sur un LAN ADSL, le réseau est souvent configuré en 192.168.1.0/24, avec une passerelle correspondant à l'adresse de la box Internet."
  },
  {
    "question": "Dans l'extrait de configuration \"configurer_adresse_ip\" du module, que remplace concrètement l'adresse 88.44.22.254 ?",
    "options": ["L'adresse du serveur DNS public", "L'adresse IP du poste client", "L'adresse de diffusion (broadcast) du réseau", "L'adresse de la passerelle FAI, remplacée par celle fournie par la box Internet"],
    "correctIndex": 3,
    "explanation": "Le module explique que l'adresse de passerelle FAI initialement indiquée (88.44.22.254) doit être remplacée par l'adresse réellement fournie par la box Internet utilisée."
  },
  {
    "question": "Pourquoi le module insiste-t-il sur le fait de répéter les adaptations et configurations au fil des mises en place ?",
    "options": ["Pour assurer une bonne compréhension et une bonne mise en œuvre des configurations", "Pour ralentir volontairement la progression du cours", "Parce que chaque module utilise un logiciel de virtualisation différent", "Pour tester la mémoire des ISO téléchargées"],
    "correctIndex": 0,
    "explanation": "Le module conclut en précisant que répéter ces adaptations et configurations au fil des exercices permet d'assurer une bonne compréhension et une bonne mise en œuvre chez l'apprenant."
  },
  {
    "question": "Quel est l'objectif pédagogique principal mis en avant à la fin de ce module d'introduction ?",
    "options": ["Mémoriser par cœur les adresses IP de chaque schéma", "Acquérir les compétences nécessaires à la mise en place et à la gestion d'une infrastructure réseau solide", "Apprendre uniquement à utiliser VMware Workstation", "Se préparer à une certification PFSense officielle"],
    "correctIndex": 1,
    "explanation": "Le module conclut en indiquant que l'objectif est d'acquérir les compétences nécessaires à la mise en place et à la gestion d'une infrastructure réseau solide, via l'étude de cas pratiques et d'exercices concrets."
  },
  {
    "question": "Comment le module justifie-t-il l'importance de comprendre les besoins des utilisateurs avant de déployer les services ?",
    "options": ["Cela n'a pas d'impact sur la conception des services", "Cela ne concerne que le service commercial", "Cela est crucial pour garantir que les services répondent aux attentes de l'entreprise et de ses collaborateurs", "Cela sert uniquement à dimensionner le stockage"],
    "correctIndex": 2,
    "explanation": "Le module conclut la partie sur les besoins utilisateurs en indiquant que cette compréhension est cruciale pour garantir que les services du système d'information répondent aux attentes de l'entreprise et de ses collaborateurs."
  },
  {
    "question": "Quelle configuration de machines virtuelles le module propose-t-il pour le bac à sable ?",
    "options": ["Plusieurs machines virtuelles sous Debian ainsi qu'une machine dédiée à PFSense", "Uniquement des conteneurs Docker, sans VM classique", "Une VM Windows Server par service à déployer", "Une seule VM combinant Debian et PFSense sur le même système"],
    "correctIndex": 3,
    "explanation": "Le module précise la configuration comme suit : plusieurs machines virtuelles sous Debian, avec une machine dédiée à PFSense, permettant d'installer différents services selon les besoins de chaque machine."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-1-introduction",
      dataId: "quiz-cours-09-les-services-reseau-en-environnement-linux-module-1-introduction-data",
    });
  });
</script>
