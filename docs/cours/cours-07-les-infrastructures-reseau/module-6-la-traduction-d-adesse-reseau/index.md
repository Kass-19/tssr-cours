# Module 6 : La traduction d'adesse réseau

*Cours : [Cours 7 - Les infrastructures réseau](../index.md)*

## 🎯 Objectif du module

Ce module présente le NAT (*Network Address Translation*) et le NAPT (*Network Address and Port Translation*) : pourquoi la traduction d'adresse est nécessaire en IPv4, les adresses privées de la RFC 1918, le fonctionnement de la translation dans les deux sens d'une conversation, puis la mise en œuvre concrète sur un routeur Cisco, en NAT dynamique (avec `overload`) et en NAT statique (redirection de ports vers des serveurs internes).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La traduction d'adresses réseau (NAT) : principes

### 1.1 Pourquoi le NAT ?

La traduction d'adresse réseau (**NAT**) est aujourd'hui indispensable dans les réseaux IPv4. Elle a été créée pour répondre à la **pénurie d'adresses IPv4 publiques** : le réseau Internet grossissant, les entreprises avaient de plus en plus besoin d'adresses IP pour leurs réseaux internes. Le NAT propose une alternative à l'utilisation d'adresses publiques en interne, notamment grâce aux plages d'adresses privées définies par la **RFC 1918**.

Second avantage : le NAT permet à plusieurs réseaux d'utiliser le **même plan d'adressage interne** sans conflit, grâce à la traduction entre plans d'adressage internes et publics.

📌 **Traduire**, c'est transformer une adresse source ou destination en une autre adresse — en général en modifiant également le port source ou destination associé.

### 1.2 Avantages et inconvénients

| Avantages | Inconvénients |
| --- | --- |
| Liberté de choisir son plan d'adressage interne, même en changeant de fournisseur d'accès | Consommation de ressources sur l'équipement qui fait la traduction, pouvant dégrader les performances |
| Une seule adresse IP publique peut suffire pour de nombreuses machines internes (économie de coût) | Perte partielle de la **traçabilité de bout en bout** (les adresses changent en cours de route, ce qui complique le diagnostic) |
| — | Mise en œuvre plus complexe de certains mécanismes de tunneling en présence de NAT |

### 1.3 Les adresses privées (RFC 1918)

La **RFC 1918** définit trois blocs d'adresses privées, disponibles librement pour toute entreprise afin de numéroter son plan d'adressage interne. ⚠️ Ces adresses ne sont **pas routables sur Internet** : aucun opérateur ne les annonce, et un opérateur bloquera systématiquement du trafic sortant avec ce type d'adresses source.

Sur un réseau local en revanche, ces adresses s'utilisent librement, dans la limite de la place disponible dans le plan d'adressage. 📌 Un équipement (généralement un routeur ou un pare-feu) est nécessaire pour faire la translation entre ces adresses privées et le monde public d'Internet.

### 1.4 Rappel : la notion de socket

Un **socket** identifie de façon unique un flux : côté client, il est constitué d'une adresse IP, d'un protocole de couche 4 (TCP, UDP) et d'un **port dynamique** choisi aléatoirement ; côté serveur, il est constitué d'une adresse IP, du même protocole de couche 4, et d'un **port réservé à l'application** (par exemple 443 pour HTTPS).

⚠️ Une même machine peut être à la fois client et serveur selon la conversation considérée (ex. un serveur de fichiers qui effectue lui-même une mise à jour est alors client de cette mise à jour).

### 1.5 Fonctionnement de la translation

Prenons un client interne qui contacte un serveur web public sur le port 443 : le paquet émis porte l'adresse IP privée du client comme source, avec un port source aléatoire, et l'adresse IP publique du serveur comme destination.

⚠️ Si l'adresse privée du client se retrouvait telle quelle sur Internet, elle serait automatiquement bloquée par l'opérateur — d'où la nécessité du NAT.

**Trafic aller** : lors du passage du paquet dans le routeur, le **NAT source** remplace l'adresse IP source par l'adresse IP publique du routeur (le port source peut également être modifié selon le matériel). L'adresse et le port de destination, eux, ne changent pas.

**Trafic retour** : lorsque le serveur répond, il le fait vers l'adresse IP publique du routeur, sur le port qui avait été utilisé comme source. Le routeur applique alors la translation inverse (sur la destination cette fois) pour renvoyer le paquet vers la machine interne d'origine.

📌 Pour cela, le routeur conserve en mémoire une **table de sessions** répertoriant toutes les conversations ouvertes, ce qui lui permet de savoir, par exemple, que la conversation initiée sur le port 40955 provient bien de la machine A et doit lui être retournée.

## 2. Mise en œuvre du NAT dynamique (NAPT)

### 2.1 Configuration sur un routeur Cisco

La configuration du NAT dynamique se déroule en quatre étapes.

**1. Déclarer les interfaces inside et outside** — l'interface côté réseau privé (adresse RFC 1918) et l'interface côté réseau public (adresse IP publique) :

```
Router(config)# interface gigabitEthernet 0/0
Router(config-if)# ip nat inside

Router(config)# interface gigabitEthernet 0/1
Router(config-if)# ip nat outside
```

**2. Créer une ACL** listant les réseaux internes sur lesquels le NAT source doit s'appliquer :

```
Router(config)# access-list 5 permit 192.168.0.0 0.0.255.255
```

**3. Créer la règle de NAT**, en indiquant la source (via l'ACL) et l'action à effectuer :

```
Router(config)# ip nat inside source list 5 interface gigabitEthernet 0/1 overload
```

⚠️ Ne jamais oublier le mot-clé **overload** : sans lui, une seule machine à la fois peut communiquer avec l'extérieur avec cette adresse publique. Avec `overload`, plusieurs machines sources peuvent partager la même adresse IP publique (c'est le fonctionnement NAPT : la distinction entre les sessions se fait alors aussi sur les ports).

📌 Démonstration pratique : sur une maquette Cisco Packet Tracer, les mêmes quatre étapes (déclaration `ip nat inside` / `ip nat outside`, création d'une ACL standard nommée par exemple `TO_NAT` avec l'adresse réseau et son masque inversé — un `deny` explicite en fin d'ACL est utile pour disposer d'un compteur — puis `ip nat inside source list TO_NAT interface GigabitEthernet0/0 overload`) suffisent à rendre les postes du réseau interne capables de joindre Internet, alors qu'auparavant leur réseau privé n'était pas routable à l'extérieur.

### 2.2 Vérification

```
show ip nat translations
show ip nat statistics
show ip access-list
```

`show ip nat translations` affiche les sessions ouvertes. ⚠️ L'ordre des colonnes n'est pas intuitif : la première colonne (**inside global**) est l'adresse publique après translation ; à droite figurent la **destination locale** (avant translation) et la **destination globale** (après translation) — pour du NAT source, ces deux dernières colonnes sont identiques puisque seule la source est modifiée.

📌 La translation inverse pour les paquets retour existe implicitement mais ne s'affiche pas (pour ne pas alourdir l'affichage) : si le paquet aller est translaté, le paquet retour l'est automatiquement en miroir.

`show ip nat statistics` affiche des compteurs sur le nombre de translations effectuées : si ce compteur n'augmente pas, il faut vérifier l'ACL (masque ou adresse réseau incorrects), à l'aide de `show ip access-list` pour contrôler les correspondances (*matches*).

## 3. Le NAT statique

### 3.1 Cas d'utilisation

Le **NAT statique** sert principalement à rendre une machine interne (adressée en RFC 1918) **joignable depuis Internet** — l'inverse du NAT dynamique, qui permet aux machines internes de sortir vers Internet. Une machine externe ne peut en effet pas joindre directement une adresse privée.

Une règle de NAT statique indique que le trafic arrivant sur l'adresse IP publique du routeur, sur un port donné, doit être redirigé vers une adresse IP privée, sur ce même port (ou un port différent si on choisit de le traduire également). Le mécanisme fonctionne dans les deux sens : à l'aller, la destination est traduite (adresse publique → adresse privée) ; au retour, la source est traduite (adresse privée → adresse publique du routeur), afin que la réponse semble cohérente pour la machine externe qui a initié la requête.

### 3.2 Configuration

```
Router(config)# ip nat inside source static tcp 192.168.1.100 80 <IP_publique> 80
Router(config)# ip nat inside source static tcp 192.168.1.101 25 <IP_publique> 25
Router(config)# ip nat inside source static tcp 192.168.1.101 110 <IP_publique> 110
```

Dans cet exemple, la première ligne redirige le trafic HTTP vers un serveur web interne ; les deux suivantes redirigent le trafic SMTP et POP vers un même serveur de messagerie — logique, puisqu'un serveur mail gère habituellement les deux protocoles.

⚠️ **Attention à l'ordre des paramètres** : la commande s'écrit avec l'adresse **privée** (interne) en premier, puis l'adresse **publique** (externe), ce qui n'est pas forcément intuitif. 📌 L'aide contextuelle (`?`) rappelle utilement quelle adresse doit être positionnée à quel endroit.

### 3.3 Vérification

```
show ip nat translations
show ip nat statistics
```

Tant qu'aucun trafic n'a encore été généré, les règles apparaissent sans valeurs dans les colonnes **outside local** et **outside global**. Une fois du trafic généré, une ligne apparaît par session ouverte.

📌 Rappel de la terminologie NAT affichée par `show ip nat translations` :

| Colonne | Signification |
| --- | --- |
| **inside global** | Adresse IP publique (côté interne, après translation) |
| **inside local** | Adresse IP privée (côté interne, avant translation) |
| **outside local / outside global** | Adresse de l'hôte externe (ne change pas, puisqu'il n'est pas concerné par la translation) |

### 3.4 Exemple pratique : publier deux serveurs internes

Sur une infrastructure avec deux serveurs internes (`.200` et `.201`), la configuration déjà en place (`ip nat inside` / `ip nat outside` sur les interfaces, NAT source dynamique) est conservée, et deux règles statiques sont ajoutées :

```
Router(config)# ip nat inside source static tcp 192.168.1.201 80 <IP_publique> 80
Router(config)# ip nat inside source static tcp 192.168.1.200 443 <IP_publique> 443
```

| Port public | Protocole | Serveur interne | Port interne |
| --- | --- | --- | --- |
| 80 | HTTP | 192.168.1.201 | 80 |
| 443 | HTTPS | 192.168.1.200 | 443 |

📌 Dans cet exemple, le port public reste identique au port interne (80/80, 443/443), mais il est tout à fait possible de les faire différer — par exemple rediriger le port public 8443 vers le port interne 443 — ce qui revient à traduire à la fois l'adresse IP et le port. Plusieurs règles de NAT statique peuvent cohabiter tant qu'elles n'utilisent pas deux fois la même association port public/protocole.

Test de connectivité : une requête HTTP vers l'adresse publique aboutit sur le serveur `.201` ; une requête HTTPS vers la même adresse publique aboutit sur le serveur `.200`, confirmant que la redirection fonctionne indépendamment par port.

## ✅ Points clés à retenir

- Le NAT répond à la pénurie d'adresses IPv4 publiques : il traduit une adresse (et généralement un port) source ou destination, et permet à des réseaux internes en adressage privé (**RFC 1918**, non routable sur Internet) de communiquer avec l'extérieur via une ou quelques adresses publiques.
- Avantages : souplesse du plan d'adressage interne, économie d'adresses publiques. ⚠️ Inconvénients : consommation de ressources, perte de traçabilité de bout en bout, complexité accrue de certains mécanismes de tunneling.
- Toute configuration NAT commence par déclarer les interfaces **`ip nat inside`** (réseau privé) et **`ip nat outside`** (réseau public).
- 📌 NAT **dynamique** (NAPT) : `ip nat inside source list <ACL> interface <interface> overload` — le mot-clé **overload** est indispensable pour permettre à plusieurs machines internes de partager la même adresse IP publique.
- NAT **statique** : `ip nat inside source static <protocole> <IP_privée> <port_privé> <IP_publique> <port_public>` — sert à publier un service interne vers Internet (ordre des paramètres : adresse privée avant l'adresse publique, contre-intuitif).
- Le routeur maintient une **table de sessions** qui lui permet d'appliquer automatiquement la translation inverse sur le trafic retour, sans configuration supplémentaire.
- Commandes de vérification : `show ip nat translations` (sessions actives — attention à l'ordre des colonnes inside/outside, local/global), `show ip nat statistics` (compteurs), `show ip access-list` (correspondances de l'ACL utilisée par la règle de NAT).

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-6-la-traduction-d-adesse-reseau"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-6-la-traduction-d-adresses-reseau-data">
[
  {
    "question": "Quelle est la raison historique principale de la création du NAT ?",
    "options": [
      "Améliorer la vitesse de transmission des paquets IP",
      "Remplacer le protocole ARP dans les réseaux locaux",
      "Faire face à la pénurie d'adresses IPv4 publiques",
      "Permettre le chiffrement automatique du trafic Internet"
    ],
    "correctIndex": 2,
    "explanation": "Le NAT a été créé pour offrir une alternative à l'utilisation d'adresses IP publiques sur les réseaux internes, alors que le nombre d'adresses IPv4 publiques disponibles diminuait."
  },
  {
    "question": "Quel est un avantage cité du NAT en matière de coût et de flexibilité ?",
    "options": [
      "Plusieurs machines internes peuvent partager une seule adresse IP publique",
      "Le NAT supprime totalement le besoin d'adresses IP internes",
      "Le NAT améliore systématiquement les performances du réseau",
      "Le NAT simplifie la traçabilité de bout en bout des flux"
    ],
    "correctIndex": 0,
    "explanation": "Quel que soit le nombre de machines sur le réseau interne, une seule adresse IP publique (souvent coûteuse) peut suffire grâce au NAT/NAPT."
  },
  {
    "question": "Quel est un inconvénient du NAT mentionné dans le cours ?",
    "options": [
      "L'impossibilité totale d'utiliser des adresses privées RFC 1918",
      "Le NAT empêche toute communication avec Internet",
      "Le NAT nécessite obligatoirement une adresse IPv6",
      "Une perte de traçabilité de bout en bout, car les adresses IP changent en cours de route"
    ],
    "correctIndex": 3,
    "explanation": "Comme les adresses IP changent sur un même flux (source ou destination selon le sens), il peut être plus long de retrouver ses repères lors d'investigations ou de diagnostics."
  },
  {
    "question": "Que dit la RFC 1918 à propos des adresses privées ?",
    "options": [
      "Elles doivent obligatoirement être translatées en IPv6",
      "Elles ne sont pas routables sur Internet et sont réservées aux plans d'adressage internes",
      "Elles sont routables sur Internet mais réservées à certains opérateurs",
      "Elles ne peuvent être utilisées que par des routeurs Cisco"
    ],
    "correctIndex": 1,
    "explanation": "Les blocs d'adresses définis par la RFC 1918 sont librement utilisables en interne, mais aucun opérateur ne les route sur Internet ; un équipement de type routeur ou pare-feu doit faire la translation vers des adresses publiques."
  },
  {
    "question": "Que signifie NAPT par rapport à NAT ?",
    "options": [
      "NAPT ne traduit que le port, jamais l'adresse IP",
      "NAPT est un synonyme strict de NAT sans différence",
      "NAPT s'applique uniquement au NAT statique",
      "NAPT (Network Address and Port Translation) traduit à la fois l'adresse IP et le port"
    ],
    "correctIndex": 3,
    "explanation": "Le cours précise qu'on parle souvent de NAT par simplification, mais qu'il s'agit en réalité fréquemment de NAPT, qui traduit conjointement l'adresse IP et le port."
  },
  {
    "question": "Dans la configuration NAT sur un routeur Cisco, à quoi correspond l'interface déclarée en « inside » ?",
    "options": [
      "L'interface côté réseau privé/interne",
      "L'interface côté réseau public/externe",
      "L'interface utilisée uniquement pour l'administration SSH",
      "L'interface reliée au serveur TFTP"
    ],
    "correctIndex": 0,
    "explanation": "L'interface inside se trouve sur le réseau privé (généralement adressé avec la RFC 1918), tandis que l'interface outside porte une adresse IP publique."
  },
  {
    "question": "À quoi sert l'ACL utilisée dans une configuration de NAT dynamique (NAPT) ?",
    "options": [
      "À bloquer tout le trafic entrant sur l'interface outside",
      "À chiffrer les paquets avant leur translation",
      "À définir quels réseaux internes doivent bénéficier de la translation d'adresse source",
      "À définir les ports publics disponibles pour le NAT statique"
    ],
    "correctIndex": 2,
    "explanation": "L'ACL liste les adresses (ou réseaux) internes autorisés à être source-natés ; la règle de NAT référence ensuite cette ACL pour savoir quel trafic translater."
  },
  {
    "question": "Dans la commande ip nat inside source list ... interface ... overload, à quoi sert le mot-clé overload ?",
    "options": [
      "À augmenter artificiellement la bande passante disponible",
      "À autoriser plusieurs machines sources à utiliser la même adresse IP publique simultanément",
      "À dupliquer automatiquement les règles NAT sur toutes les interfaces",
      "À forcer l'utilisation d'IPv6 pour la translation"
    ],
    "correctIndex": 1,
    "explanation": "Sans le mot-clé overload, une seule machine à la fois pourrait utiliser l'adresse IP publique pour communiquer vers l'extérieur ; overload permet le partage simultané par plusieurs machines (NAPT)."
  },
  {
    "question": "Dans la commande show ip nat translations, que représente la colonne « inside global » ?",
    "options": [
      "L'adresse IP publique utilisée après la translation",
      "L'adresse IP privée de la machine avant translation",
      "L'adresse de l'hôte distant sur Internet",
      "Le port utilisé par le serveur distant"
    ],
    "correctIndex": 0,
    "explanation": "« Inside local » correspond à l'adresse privée avant translation, tandis que « inside global » correspond à l'adresse publique utilisée après translation, celle vue depuis l'extérieur."
  },
  {
    "question": "À quoi sert la commande show ip nat statistics ?",
    "options": [
      "À afficher la table de routage complète du routeur",
      "À afficher la liste des VLAN configurés",
      "À afficher les mots de passe stockés en clair",
      "À afficher des compteurs sur le nombre de translations effectuées, utile pour diagnostiquer un problème"
    ],
    "correctIndex": 3,
    "explanation": "Si les compteurs de translation n'augmentent pas alors que du trafic est censé passer, cela peut indiquer une erreur dans l'ACL de NAT (mauvais masque ou mauvaise adresse réseau, par exemple)."
  },
  {
    "question": "Dans quel cas de figure utilise-t-on principalement le NAT statique ?",
    "options": [
      "Pour permettre à une machine interne de naviguer sur Internet en HTTP",
      "Pour rendre une machine interne (avec une adresse privée) joignable depuis Internet",
      "Pour chiffrer automatiquement tout le trafic sortant",
      "Pour remplacer entièrement les ACL sur le routeur"
    ],
    "correctIndex": 1,
    "explanation": "Le NAT statique sert essentiellement en destination : rediriger le trafic arrivant sur l'adresse IP publique du routeur, sur un port donné, vers une adresse IP privée précise sur ce même port."
  },
  {
    "question": "Dans la commande ip nat inside source static, dans quel ordre les adresses sont-elles indiquées ?",
    "options": [
      "L'adresse publique en premier, puis l'adresse interne",
      "Uniquement l'adresse interne, le port public est déduit automatiquement",
      "L'adresse (et le port) interne vers laquelle on redirige, puis l'adresse (et le port) publique depuis laquelle on redirige",
      "Uniquement l'adresse publique, sans jamais préciser l'adresse interne"
    ],
    "correctIndex": 2,
    "explanation": "Le cours souligne que cet ordre n'est pas forcément intuitif : on indique d'abord l'adresse (et le port) interne de destination, puis l'adresse (et le port) publique depuis laquelle vient le trafic."
  },
  {
    "question": "Dans un exemple de NAT statique, on redirige le port 80 public vers un serveur et le port 443 public vers un autre serveur. Que cela illustre-t-il ?",
    "options": [
      "Il est possible de publier plusieurs serveurs internes derrière une même adresse IP publique, en utilisant des ports différents",
      "Il faut obligatoirement une adresse IP publique différente par serveur",
      "Le NAT statique ne peut gérer qu'un seul port à la fois",
      "Le port interne doit toujours être différent du port public"
    ],
    "correctIndex": 0,
    "explanation": "Tant que les associations de ports ne sont pas en conflit, on peut ajouter autant de règles de NAT statique que nécessaire pour publier plusieurs services derrière une seule adresse IP publique."
  },
  {
    "question": "Est-il possible, avec le NAT, de translater le port en plus de l'adresse IP (par exemple port public 8443 vers port interne 443) ?",
    "options": [
      "Non, le port public et le port interne doivent toujours être identiques",
      "Non, la translation de port n'existe qu'en NAT dynamique",
      "Oui, mais uniquement pour le protocole UDP",
      "Oui, il est tout à fait possible de translater le port en même temps que l'adresse IP"
    ],
    "correctIndex": 3,
    "explanation": "Le cours illustre ce cas avec l'exemple du port public 8443 redirigé vers le port interne 443, montrant que l'adresse ET le port peuvent être translatés simultanément."
  },
  {
    "question": "Que se passe-t-il pour le trafic retour lorsqu'un serveur interne répond à une requête ayant transité par du NAT source ?",
    "options": [
      "Le trafic retour n'a besoin d'aucune translation particulière",
      "Le routeur effectue la translation inverse (miroir) grâce à sa table de sessions",
      "Le trafic retour doit être configuré manuellement avec une ACL distincte",
      "Le trafic retour est systématiquement bloqué par défaut"
    ],
    "correctIndex": 1,
    "explanation": "Le routeur conserve une table des sessions ouvertes qui lui permet de faire la translation retour automatiquement, en miroir de celle effectuée à l'aller, sans configuration supplémentaire."
  },
  {
    "question": "Dans un socket, quels éléments identifient une connexion côté client ?",
    "options": [
      "Uniquement une adresse IP et une adresse MAC",
      "Un nom d'utilisateur et un mot de passe",
      "Une adresse IP, un protocole de couche 4 (TCP/UDP) et un port dynamique choisi aléatoirement",
      "Un numéro de VLAN et un masque de sous-réseau"
    ],
    "correctIndex": 2,
    "explanation": "Le socket client est constitué de l'adresse IP du client, du protocole de couche 4 utilisé, et d'un port dynamique choisi aléatoirement dans la plage définie par la RFC."
  },
  {
    "question": "Une même machine peut-elle être à la fois client et serveur selon les flux ?",
    "options": [
      "Non, une machine a un rôle fixe défini une fois pour toutes",
      "Non, seul un routeur peut jouer les deux rôles",
      "Oui, mais uniquement si le NAT statique est désactivé",
      "Oui, cette notion s'entend à l'échelle d'une conversation donnée"
    ],
    "correctIndex": 3,
    "explanation": "Un serveur de fichiers, par exemple, est serveur pour les machines qui s'y connectent, mais peut être client lorsqu'il télécharge lui-même ses mises à jour."
  },
  {
    "question": "Pour implémenter le NAT dynamique sur un routeur Cisco, quelles sont, dans l'ordre, les grandes étapes de configuration ?",
    "options": [
      "Créer la règle de NAT, puis déclarer les interfaces inside/outside",
      "Déclarer les interfaces inside/outside, créer l'ACL des réseaux à NATer, puis créer la règle de NAT avec overload",
      "Configurer uniquement l'ACL, le NAT s'active automatiquement",
      "Créer les VLAN, puis activer ip routing"
    ],
    "correctIndex": 1,
    "explanation": "Il faut d'abord identifier les interfaces inside et outside, ensuite définir via une ACL les réseaux internes concernés, et enfin créer la règle de NAT source en y référençant cette ACL avec le mot-clé overload."
  },
  {
    "question": "Pourquoi le NAT peut-il compliquer certains mécanismes de tunneling, comme mentionné dans le cours ?",
    "options": [
      "Parce que le NAT chiffre systématiquement tout le trafic",
      "Parce que le NAT bloque nativement tous les protocoles autres que TCP",
      "Parce que le NAT modifie les adresses IP et ports en cours de route, ce qui peut perturber ces mécanismes",
      "Parce que le NAT nécessite toujours une reconfiguration complète des VLAN"
    ],
    "correctIndex": 2,
    "explanation": "C'est un des inconvénients évoqués : la modification des adresses (et parfois des ports) par le NAT peut compliquer la mise en œuvre de certains mécanismes de tunneling."
  },
  {
    "question": "Que permet de vérifier la commande show ip access-list dans le contexte d'une configuration NAT ?",
    "options": [
      "Si l'ACL utilisée pour définir le trafic à NATer fait bien des correspondances (matchs)",
      "Le nombre de sessions NAT actuellement actives",
      "La liste des adresses IP publiques disponibles",
      "Le registre de configuration du routeur"
    ],
    "correctIndex": 0,
    "explanation": "Si les compteurs de translation NAT n'augmentent pas comme attendu, vérifier les correspondances de l'ACL associée (avec show ip access-list) permet souvent de détecter une erreur de masque ou d'adresse réseau."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-07-les-infrastructures-reseau-module-6-la-traduction-d-adesse-reseau",
      dataId: "quiz-cours-07-les-infrastructures-reseau-module-6-la-traduction-d-adesse-reseau-data",
    });
  });
</script>
