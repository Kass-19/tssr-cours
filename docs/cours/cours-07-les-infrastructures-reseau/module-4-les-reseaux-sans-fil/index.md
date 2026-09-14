# Module 4 : Les réseaux sans fil

*Cours : [Cours 7 - Les infrastructures réseau](../index.md)*

## 🎯 Objectif du module

Ce module présente les fondamentaux des réseaux Wi-Fi en entreprise : la norme 802.11 et ses évolutions, les différents équipements d'une infrastructure sans fil, les modes de fonctionnement (ad hoc et infrastructure) avec les notions de BSS, ESS, SSID et BSSID, le processus d'association d'un terminal et la méthode d'accès au média CSMA/CA. Il présente ensuite les principes de sécurisation d'un réseau Wi-Fi et l'évolution des suites cryptographiques (WEP, WPA, WPA2, WPA3).

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Les réseaux sans fil : normes et équipements

### 1.1 La norme 802.11 et son évolution

Les réseaux sans fil sont aujourd'hui incontournables en entreprise : ils apportent la mobilité nécessaire aux utilisateurs (smartphones, tablettes, ordinateurs portables) au sein d'un bâtiment ou entre bâtiments.

La norme **IEEE 802.11**, publiée en 1997, a permis de déployer massivement des technologies Wi-Fi normalisées, avec une interconnexion fiable entre équipements de constructeurs différents. Elle a depuis été complétée par de nombreuses mises à jour (802.11a, 802.11b, etc.) qui ont augmenté les débits et ajouté des fonctionnalités, notamment de roaming.

📌 Les normes actuellement déployées : **802.11ac**, massivement utilisée en entreprise ; **802.11ax**, en cours de déploiement ; **802.11be**, encore émergente.

Depuis quelques années, la Wi-Fi Alliance (l'organisme qui normalise les technologies Wi-Fi) a introduit une numérotation plus simple : **Wi-Fi 5**, **Wi-Fi 6**, et bientôt **Wi-Fi 7** (récemment ratifiée). Le logo « Wi-Fi Certified » permet de vérifier facilement la compatibilité d'un matériel (infrastructure ou terminal utilisateur) avec une norme donnée.

### 1.2 Les équipements d'une infrastructure Wi-Fi

| Équipement | Rôle |
| --- | --- |
| **Terminal** (carte réseau sans fil) | Équipement utilisateur (souvent intégré, invisible) qui se connecte à un point d'accès |
| **Point d'accès Wi-Fi** | Fait le pont entre le monde sans fil et le monde filaire |
| **Contrôleur de points d'accès** | Configure et administre plusieurs points d'accès simultanément, et ajoute des fonctionnalités avancées ; utile dès que le nombre de points d'accès devient important |
| **Routeur intégrant un point d'accès** | Cas typique d'une box grand public, qui combine point d'accès, routeur et d'autres fonctions |

### 1.3 Le mode ad hoc et l'IBSS

Le **mode ad hoc** correspond à la connexion directe de deux terminaux entre eux — par exemple, un partage de connexion depuis un smartphone, où l'ordinateur se connecte en Wi-Fi au smartphone qui relaie ensuite sa connexion 4G/5G.

⚠️ Ce mode est limité en nombre d'équipements, en fonctionnalités et en portée (la capacité de rayonnement Wi-Fi d'un smartphone est limitée).

Cette première forme d'infrastructure Wi-Fi crée un **IBSS** (*Independent Basic Service Set*), défini par trois paramètres :

- le **SSID** (nom du réseau Wi-Fi visible par les utilisateurs) ;
- des paramètres de **sécurité** (clé, niveau de sécurité, etc.) ;
- une **fréquence de canal radio**.

### 1.4 Le mode infrastructure : BSS, BSA et ESS

En **mode infrastructure**, plusieurs terminaux sans fil se connectent les uns aux autres par l'intermédiaire de points d'accès (ou de routeurs sans fil), qui peuvent également relier les terminaux au reste d'une infrastructure filaire. Ce mode apporte des fonctions centralisées de contrôle, de gestion, de sécurité et de statistiques, notamment via le contrôleur de points d'accès.

| Notion | Définition |
| --- | --- |
| **BSS** (Basic Service Set) | Zone de service définie par un seul point d'accès (SSID + sécurité + fréquence) |
| **BSA** (Basic Service Area) | Zone de couverture radio correspondant à un BSS |
| **ESS** (Extended Service Set) | Plusieurs points d'accès partageant le même SSID et les mêmes paramètres de sécurité, reliés au même réseau filaire |

📌 Pour qu'un utilisateur puisse passer d'un point d'accès à l'autre sans perdre la connexion (le **roaming**), il faut que les BSA se **chevauchent** — sinon l'utilisateur traverse un trou noir de couverture.

### 1.5 SSID, BSSID et ESSID

| Sigle | Signification | Définition |
| --- | --- | --- |
| **SSID** (Service Set Identifier) | Nom du réseau | Le nom affiché lors de la connexion à un réseau sans fil |
| **BSSID** (Basic Service Set Identifier) | Identifiant unique d'un BSS | L'adresse MAC du point d'accès concerné |
| **ESSID** | Identifiant d'un ESS | Équivalent du SSID dans une topologie à plusieurs points d'accès |

Un point d'accès peut porter un ou plusieurs SSID (par exemple, un SSID pour les employés et un autre pour les invités). Un même SSID peut être propagé sur un seul point d'accès, ou sur plusieurs (auquel cas on parle d'ESS).

### 1.6 L'association d'un terminal au réseau

La connexion d'un terminal à un réseau sans fil, appelée **association**, se déroule en trois temps :

1. **Détection** : le terminal vérifie qu'un point d'accès diffuse bien le SSID recherché à proximité.
2. **Connexion et sécurité** : le terminal se connecte, ce qui peut nécessiter une phase d'**authentification** selon la norme de sécurité utilisée (le cours se limite aux modes de sécurité basés sur des clés ; des modes plus avancés, basés sur la norme **802.1X**, permettent une authentification poussée du terminal, voire de l'utilisateur).
3. **Canal radio** : le SSID est diffusé par le point d'accès sur un seul canal. Ce canal n'est cependant pas mémorisé « en dur » par le terminal, car il peut y avoir plusieurs bornes et le canal peut changer selon celle à laquelle le terminal se connecte.

### 1.7 Accès au média : half-duplex alterné et CSMA/CA

Dans un réseau Wi-Fi, les communications ont lieu en **half-duplex alterné** : les équipements (terminaux et borne) parlent chacun leur tour. Pour éviter les collisions sur ce média partagé, on utilise le mécanisme **CSMA/CA** (*Carrier Sense Multiple Access with Collision Avoidance*).

Principe simplifié :

1. Le terminal qui souhaite émettre se met en **écoute** : si quelqu'un parle déjà, il attend.
2. Dès qu'un créneau libre est détecté, il envoie un message **RTS** (*Ready To Send*) — l'équivalent de « lever la main pour demander la parole ».
3. Si le point d'accès est disponible, il répond par un **CTS** (*Clear To Send*), qui autorise le terminal à parler.
4. Le terminal émet alors l'information souhaitée.

📌 Toutes les transmissions Wi-Fi sont soumises à des **accusés de réception** : en l'absence d'accusé, l'émetteur suppose une collision et retransmet.


## 2. Sécurisation des réseaux Wi-Fi

### 2.1 Recommandations ANSSI

Un réseau sans fil expose le trafic à quiconque se trouve à portée d'écoute (l'analogie avec la voix : « quand je parle, n'importe qui peut m'entendre »). Il est donc nécessaire de mettre en place des mécanismes de **chiffrement**, de contrôle d'accès et éventuellement d'**authentification** des équipements et des utilisateurs.

📌 L'ANSSI propose 23 mesures pour sécuriser les accès Wi-Fi, notamment : éviter d'activer le Wi-Fi quand ce n'est pas nécessaire, désactiver l'association automatique, etc. (guide disponible sur [messervices.cyber.gouv.fr](https://messervices.cyber.gouv.fr/guides/securiser-les-acces-wi-fi)).

⚠️ Ces recommandations ne sont pas toutes applicables dans tous les contextes : chacune doit être évaluée au regard des besoins propres de l'entreprise.

### 2.2 Les suites cryptographiques Wi-Fi

| Suite | Année | Authentification / statut |
| --- | --- | --- |
| **WEP** | Fin des années 1990 | Basée sur une clé pré-partagée (*Pre-Shared Key*) commune ⚠️ Aujourd'hui cassée très facilement (outils disponibles sur Internet) — **à ne surtout plus utiliser** |
| **WPA** | Suite logique de WEP | Nouvelle méthode de chiffrement et d'authentification, mais également cassé — **à ne plus utiliser** |
| **WPA2** | 2004 | Ne fait pas encore l'objet de failles facilement exploitables à ce jour — la référence actuelle |
| **WPA3** | Plus récent | Conçu de manière plus robuste, mais tous les terminaux ne sont pas encore compatibles ⚠️ à déployer seulement après vérification de la compatibilité de l'ensemble du parc |

📌 La règle générale : privilégier toujours la norme la plus récente disponible et compatible avec l'ensemble des équipements de l'entreprise, car elle est conçue de manière plus robuste que ses prédécesseurs.

--- 

## ✅ Points clés à retenir

_À compléter._

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-4-les-reseaux-sans-fil"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-4-les-reseaux-sans-fil-data">
[
  {
    "question": "Que permet la norme IEEE 802.11 ?",
    "options": [
      "Chiffrer nativement tout le trafic Ethernet filaire",
      "Remplacer entièrement le protocole ARP",
      "Déployer des technologies Wi-Fi normalisées, interopérables entre constructeurs",
      "Garantir un débit fixe identique sur tous les équipements"
    ],
    "correctIndex": 2,
    "explanation": "802.11 est la norme qui a permis de déployer massivement des technologies Wi-Fi de façon normalisée, avec une bonne interopérabilité entre les différents constructeurs."
  },
  {
    "question": "Que représentent les appellations « Wi-Fi 5 », « Wi-Fi 6 » par rapport aux normes 802.11ac, 802.11ax ?",
    "options": [
      "Une numérotation plus simple introduite par la Wi-Fi Alliance pour désigner ces mêmes normes",
      "Des normes totalement indépendantes de 802.11",
      "Des générations de matériel non compatibles entre elles",
      "Des protocoles de sécurité remplaçant WPA"
    ],
    "correctIndex": 0,
    "explanation": "La Wi-Fi Alliance a simplifié la communication autour des normes techniques (802.11ac, 802.11ax...) en les renommant Wi-Fi 5, Wi-Fi 6, etc."
  },
  {
    "question": "À quoi sert un contrôleur de points d'accès ?",
    "options": [
      "À remplacer le rôle du routeur dans le réseau filaire",
      "À chiffrer uniquement le trafic invité",
      "À servir exclusivement d'antenne relais 4G/5G",
      "À configurer et gérer plusieurs points d'accès simultanément, sans les configurer individuellement"
    ],
    "correctIndex": 3,
    "explanation": "Quand on dispose de nombreux points d'accès, un contrôleur évite d'avoir à les configurer un par un et ajoute des fonctionnalités de gestion centralisée."
  },
  {
    "question": "Le mode ad hoc en Wi-Fi correspond à quelle situation typique ?",
    "options": [
      "Un réseau avec plusieurs points d'accès reliés par un contrôleur",
      "Deux terminaux qui se connectent directement l'un à l'autre, comme un partage de connexion",
      "Un réseau d'entreprise avec authentification 802.1x",
      "Un réseau utilisant exclusivement le protocole CSMA/CD"
    ],
    "correctIndex": 1,
    "explanation": "Le mode ad hoc, illustré par le partage de connexion d'un smartphone, connecte directement deux terminaux, avec un nombre d'équipements et une portée limités."
  },
  {
    "question": "Quels sont les trois paramètres qui définissent un IBSS ?",
    "options": [
      "L'adresse IP, le masque de sous-réseau et la passerelle",
      "Le BSSID, le protocole de routage et la métrique",
      "Le nom du fabricant, le modèle et la version du firmware",
      "Le SSID, les paramètres de sécurité et la fréquence du canal radio"
    ],
    "correctIndex": 3,
    "explanation": "Ces trois paramètres permettent d'identifier de façon unique le service Wi-Fi rendu dans une infrastructure Wi-Fi de base de type IBSS."
  },
  {
    "question": "Que désigne un BSSID ?",
    "options": [
      "L'adresse MAC du point d'accès, identifiant unique de son BSS",
      "Le nom du réseau Wi-Fi affiché aux utilisateurs",
      "L'adresse IP publique du contrôleur Wi-Fi",
      "Le numéro de canal radio utilisé par le point d'accès"
    ],
    "correctIndex": 0,
    "explanation": "Dans un ESS, l'adresse MAC du point d'accès sans fil sert à identifier de manière unique chaque BSS, d'où l'acronyme BSSID (Basic Service Set Identifier)."
  },
  {
    "question": "Que faut-il pour qu'un utilisateur puisse passer d'un point d'accès à un autre sans perdre la connexion (roaming) ?",
    "options": [
      "Que les deux points d'accès utilisent des SSID différents",
      "Que les deux points d'accès soient reliés en mode ad hoc",
      "Un chevauchement entre les zones de couverture (BSA) des deux points d'accès",
      "Que l'utilisateur redémarre manuellement sa connexion Wi-Fi"
    ],
    "correctIndex": 2,
    "explanation": "Sans chevauchement des BSA, l'utilisateur traverserait une zone sans couverture (un trou noir) et perdrait la connexion en se déplaçant d'un point d'accès à l'autre."
  },
  {
    "question": "Qu'est-ce qui caractérise un ESS (Extended Service Set) ?",
    "options": [
      "Un unique point d'accès diffusant plusieurs SSID différents",
      "Plusieurs points d'accès partageant le même SSID, les mêmes paramètres de sécurité et reliés au même réseau filaire",
      "Un réseau Wi-Fi fonctionnant uniquement en mode ad hoc",
      "Un point d'accès sans connexion au réseau filaire de l'entreprise"
    ],
    "correctIndex": 1,
    "explanation": "Un ESS étend la couverture d'un même service Wi-Fi en réunissant plusieurs BSS partageant SSID et sécurité, reliés sur le même réseau filaire, ce qui permet le roaming."
  },
  {
    "question": "Un même point d'accès peut-il diffuser plusieurs SSID (par exemple un pour les employés, un pour les invités) ?",
    "options": [
      "Oui, un point d'accès peut porter un ou plusieurs SSID",
      "Non, un point d'accès ne peut diffuser qu'un seul SSID",
      "Oui, mais seulement s'il est en mode ad hoc",
      "Non, cela nécessiterait un contrôleur dédié à chaque SSID"
    ],
    "correctIndex": 0,
    "explanation": "C'est un cas d'usage classique en entreprise : un même point d'accès peut tout à fait diffuser plusieurs SSID distincts, par exemple un pour les employés et un pour les invités."
  },
  {
    "question": "Quelle est la première étape lorsqu'un terminal essaie de se connecter à un réseau sans fil ?",
    "options": [
      "L'échange de la clé de chiffrement WPA3",
      "L'attribution d'une adresse IP par DHCP",
      "La négociation du mode duplex avec le point d'accès",
      "La détection : vérifier qu'un point d'accès diffuse le SSID recherché dans la zone"
    ],
    "correctIndex": 3,
    "explanation": "L'association nécessite d'abord une phase de détection, pour savoir si un point d'accès diffusant le SSID recherché est présent dans la zone, avant l'éventuelle authentification et la connexion."
  },
  {
    "question": "Comment qualifie-t-on le mode de communication utilisé sur un réseau Wi-Fi ?",
    "options": [
      "Du full-duplex intégral, sans aucune limitation",
      "Du half-duplex alterné, où les équipements parlent chacun leur tour",
      "Du half-duplex simultané pour tous les équipements",
      "Un mode propre au Wi-Fi, sans lien avec le duplex"
    ],
    "correctIndex": 1,
    "explanation": "Comme le média radio est partagé, les équipements Wi-Fi (bornes et terminaux) doivent parler tour à tour, ce qui correspond à du half-duplex alterné."
  },
  {
    "question": "Quelle méthode le Wi-Fi utilise-t-il pour éviter les collisions sur le média partagé ?",
    "options": [
      "CSMA/CD (Carrier Sense Multiple Access with Collision Detection)",
      "STP (Spanning Tree Protocol)",
      "CSMA/CA (Carrier Sense Multiple Access with Collision Avoidance)",
      "ARP (Address Resolution Protocol)"
    ],
    "correctIndex": 2,
    "explanation": "Contrairement au filaire qui détecte les collisions (CSMA/CD), le Wi-Fi les anticipe et les évite grâce à CSMA/CA, en demandant la parole avant d'émettre."
  },
  {
    "question": "Dans le mécanisme CSMA/CA, à quoi correspond l'échange RTS/CTS ?",
    "options": [
      "Le terminal demande la parole (RTS) et le point d'accès l'autorise à émettre (CTS)",
      "Le terminal chiffre puis déchiffre ses données",
      "Le point d'accès diffuse en boucle son SSID",
      "Le terminal change automatiquement de canal radio"
    ],
    "correctIndex": 0,
    "explanation": "RTS (Ready To Send) est un peu l'équivalent de lever la main pour demander la parole ; le point d'accès répond par un CTS (Clear To Send) pour autoriser l'émission, évitant ainsi les collisions."
  },
  {
    "question": "Comment un client Wi-Fi sait-il qu'une trame qu'il a envoyée a été correctement reçue ?",
    "options": [
      "Il n'existe aucun mécanisme d'accusé de réception en Wi-Fi",
      "Le point d'accès envoie un rapport hebdomadaire de transmission",
      "Le client vérifie l'adresse IP de destination uniquement",
      "Grâce à un accusé de réception ; son absence laisse supposer une collision et déclenche une retransmission"
    ],
    "correctIndex": 3,
    "explanation": "Toutes les transmissions Wi-Fi sont soumises à des accusés de réception ; en leur absence, l'émetteur suppose une collision et retransmet l'information."
  },
  {
    "question": "Que faut-il retenir de la suite de sécurité WEP pour le Wi-Fi ?",
    "options": [
      "Elle reste recommandée pour les petits réseaux domestiques",
      "Elle est aujourd'hui facilement cassable et ne doit surtout plus être utilisée",
      "Elle est plus récente et plus sécurisée que WPA2",
      "Elle n'utilise pas de mot de passe partagé (Pre-Shared Key)"
    ],
    "correctIndex": 1,
    "explanation": "Le WEP, basé sur une authentification par clé pré-partagée, est aujourd'hui facilement cassable avec des outils disponibles sur Internet ; il ne faut donc surtout plus l'utiliser."
  },
  {
    "question": "Parmi WPA, WPA2 et WPA3, laquelle de ces suites de sécurité ne fait aujourd'hui pas l'objet de failles facilement exploitables, tout en étant largement compatible avec le matériel existant ?",
    "options": [
      "WPA",
      "WEP",
      "WPA2",
      "Aucune, toutes ces suites sont aujourd'hui cassées"
    ],
    "correctIndex": 2,
    "explanation": "WPA a été cassé comme WEP ; WPA2, sorti en 2004, ne présente pas encore de faille facilement exploitable et bénéficie d'une large compatibilité, contrairement à WPA3 qui n'est pas encore supporté par tous les terminaux."
  },
  {
    "question": "Pourquoi faut-il être prudent avant de déployer WPA3 en entreprise ?",
    "options": [
      "Parce que WPA3 est moins sécurisé que WPA2",
      "Parce que WPA3 ne fonctionne qu'en mode ad hoc",
      "Parce que WPA3 nécessite obligatoirement un contrôleur de points d'accès",
      "Parce que tous les équipements terminaux ne sont pas encore compatibles avec cette norme"
    ],
    "correctIndex": 3,
    "explanation": "Comme toute nouvelle norme, WPA3 met du temps à se déployer complètement ; il faut donc vérifier la compatibilité de l'ensemble du parc avant de l'activer."
  },
  {
    "question": "Quel organisme est cité comme source de recommandations pour sécuriser les accès Wi-Fi ?",
    "options": [
      "L'IEEE",
      "L'ANSSI",
      "La Wi-Fi Alliance",
      "L'ICANN"
    ],
    "correctIndex": 1,
    "explanation": "L'ANSSI propose 23 mesures pour sécuriser les accès Wi-Fi, à adapter selon le contexte propre à chaque entreprise."
  },
  {
    "question": "Où se trouve le plus souvent la carte réseau sans fil d'un smartphone ou d'un ordinateur portable ?",
    "options": [
      "Toujours ajoutée sous forme de clé USB externe",
      "Placée exclusivement dans le point d'accès",
      "Intégrée dans le socle de l'appareil, généralement invisible pour l'utilisateur",
      "Uniquement disponible en option payante"
    ],
    "correctIndex": 2,
    "explanation": "La carte réseau sans fil est la plupart du temps intégrée directement dans l'appareil, sans que l'utilisateur ne la voie."
  },
  {
    "question": "Que retenir du canal radio utilisé par un SSID ?",
    "options": [
      "Le point d'accès diffuse ce SSID sur un seul canal, mais le terminal ne mémorise pas ce canal en dur",
      "Le terminal doit configurer manuellement le canal à chaque connexion",
      "Un SSID ne peut jamais changer de canal une fois configuré",
      "Le canal radio est identique pour tous les SSID d'une entreprise"
    ],
    "correctIndex": 0,
    "explanation": "Le canal utilisé est structurant pour le point d'accès, mais le terminal ne le retient pas de façon figée puisqu'il peut se connecter à plusieurs bornes différentes qui n'utilisent pas forcément le même canal."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-07-les-infrastructures-reseau-module-4-les-reseaux-sans-fil",
      dataId: "quiz-cours-07-les-infrastructures-reseau-module-4-les-reseaux-sans-fil-data",
    });
  });
</script>
