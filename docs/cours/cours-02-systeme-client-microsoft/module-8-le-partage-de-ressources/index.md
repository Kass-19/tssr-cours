# Module 8 : Le partage de ressources

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module couvre le partage de ressources sous Windows : les principes du partage, la mise en place et l'accès aux partages (droits de partage vs droits NTFS, outils en ligne de commande et PowerShell), ainsi que le **Bureau à distance** permettant d'accéder à un poste entier via le réseau.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Principes du partage

### 1.1 Qu'est-ce que partager ?

**Partager**, c'est permettre d'accéder, via le réseau, à une ressource hébergée par un serveur, depuis un OS client. Quatre éléments sont donc toujours impliqués dans un partage :

| Élément | Description |
|---|---|
| **La ressource** | Ce qui est partagé |
| **Le serveur** | L'hôte qui héberge la ressource |
| **Le client** | L'hôte qui accède à la ressource |
| **Le réseau** | Le support de communication entre les deux |

### 1.2 Les ressources partageables

Selon la définition Microsoft d'une ressource partageable, on distingue :

- les **fichiers**, via le partage de dossier, d'arborescence complète, ou de volume entier ;
- les **imprimantes**.

### 1.3 Serveurs et clients concernés

| Rôle | Exemples |
|---|---|
| **Serveur** (héberge la ressource) | Un OS client comme Windows 10, un OS serveur comme Windows Server 2019, mais aussi un copieur, une tablette, un smartphone — tout hôte possédant des ressources et une carte réseau |
| **Client** (accède à la ressource) | Tout type de système connecté au réseau de l'entreprise |

---

## 2. Accès et mise en place des partages

### 2.1 Qui peut partager des ressources ?

Partager une ressource **modifie le système** : des privilèges d'administrateur sont donc nécessaires. Pour des raisons de sécurité, une ressource ne doit être partagée qu'avec les personnes concernées.

### 2.2 Les deux niveaux de vérification d'accès

Une **authentification** est requise pour accéder à un partage. L'identité de l'utilisateur est vérifiée **à deux niveaux successifs** :

1. au niveau du **partage** lui-même ;
2. au niveau des droits **NTFS** de la ressource.

Trois niveaux d'accès possibles à chaque niveau : **Lecture**, **Modifier**, **Contrôle total**.

⚠️ Les autorisations de partage et les droits NTFS sont **cumulés de façon restrictive** : le droit final appliqué est le plus restrictif des deux.

> **Exemple** : John a l'autorisation **Lecture** au niveau du partage et **Modification** au niveau des droits NTFS → John n'obtient finalement qu'un droit en **lecture**, car l'autorisation de partage est plus restrictive.

### 2.3 Accéder à une ressource partagée depuis Windows 10

**Accès ponctuel** : via l'explorateur Windows, à l'aide d'un chemin **UNC** (*Universal Naming Convention*), composé du nom ou de l'adresse IP du serveur suivi du nom du partage.

**Accès durable** : via un **lecteur réseau**, mappé sur une lettre de lecteur, accessible depuis l'explorateur Windows — éventuellement monté automatiquement à l'ouverture de session de l'utilisateur.

En ligne de commande :

```cmd
net use <lettre_lecteur> <chemin_UNC>
net view
```

| Commande | Rôle |
|---|---|
| `net use` | Monte un lecteur réseau à partir d'une lettre et d'un chemin UNC |
| `net view` | Liste tous les partages disponibles sur le serveur ciblé |

En PowerShell :

```powershell
New-SmbMapping
```

### 2.4 Partager des ressources depuis un serveur

#### a) Partage simplifié (orienté utilisateur)

Depuis les propriétés d'un dossier dans l'explorateur Windows, l'onglet **Partage** propose un menu déroulant « Accorder l'accès à » et un bouton « Partager », pour une mise en place simplifiée et automatique. ⚠️ Cette méthode est orientée utilisateur final : un technicien ne l'utilise pas, il passe par le **partage avancé**.

#### b) Bonnes pratiques du partage avancé

Par défaut, l'entité **Tout le monde** dispose d'un accès en lecture. Pour des raisons de sécurité, la bonne pratique est la suivante :

1. **Supprimer** l'entité « Tout le monde » (elle inclut le groupe invité et l'utilisateur invité) ;
2. **Ajouter** l'entité « Utilisateurs authentifiés » à la place ;
3. Accorder à ces utilisateurs authentifiés un accès en **Contrôle total** au niveau du partage.

📌 Accorder le Contrôle total aux utilisateurs authentifiés au niveau du partage peut sembler risqué, mais ne l'est pas : les autorisations fines sont ensuite affinées au niveau des **droits NTFS** de la ressource (voir le principe de cumul restrictif en 2.2).

#### c) Autres méthodes de partage

| Méthode | Description |
|---|---|
| **Composant « Dossiers partagés »** (console MMC) | Permet de lister les partages, créer de nouveaux partages, consulter l'identité des utilisateurs connectés au partage et lister en temps réel les fichiers ouverts |
| **Ligne de commande** : `net share` | Spécifier le nom du partage, son emplacement, et appliquer la bonne pratique (contrôle total pour les utilisateurs authentifiés) |
| **PowerShell** : `New-SmbShare` | Même logique : nom du partage, emplacement, utilisateurs authentifiés en contrôle total |

```cmd
net share NomPartage=C:\Chemin\Dossier /GRANT:"Utilisateurs authentifiés",FULL
```

```powershell
New-SmbShare -Name "NomPartage" -Path "C:\Chemin\Dossier" -FullAccess "Utilisateurs authentifiés"
```

### 2.5 Les partages administratifs

Dans la liste des partages apparaissent aussi les **partages administratifs**, dont le nom se termine par `$`. Ils sont **cachés** (n'apparaissent pas sur le réseau) et accessibles uniquement par le compte administrateur. Ils sont créés et gérés **automatiquement** par le système, à l'installation de l'OS ou lors de l'ajout d'un nouveau volume.

---

## 3. Le bureau à distance

### 3.1 Principe

Au-delà du partage de ressources disque, il est possible d'accéder à un **poste entier** via le réseau grâce à la fonctionnalité **Bureau à distance**. Une fois activée, les utilisateurs disposant des privilèges adéquats peuvent accéder au poste distant et bénéficier du même niveau de fonctionnement que sur une session locale.

Usages typiques :
- maintenance de postes clients et de serveurs à distance, sans déplacement ;
- accès à son ordinateur professionnel depuis n'importe où, via une connexion **VPN** (*Virtual Private Network*).

### 3.2 Limites

| Type de poste | Sessions simultanées autorisées |
|---|---|
| **Poste client** (Windows 10) | **1 seule** session, locale ou distante |
| **Serveur** | **2 sessions** en simultané |

⚠️ Le Bureau à distance ne permet pas de faire du support en temps réel avec un utilisateur (puisque sa session se ferme lors de la prise de contrôle). Pour ce besoin, d'autres solutions existent : **TeamViewer**, **VNC**, **LogMeIn**, ou la solution native Microsoft **Assistance rapide** (*Remote Assistance*).

📌 Pour autoriser plus de 2 connexions simultanées sur un serveur, il faut activer le rôle **Microsoft RDS** (*Remote Desktop Services*), ou recourir à une solution tierce.

### 3.3 Se connecter à distance sur un poste Windows 10

L'outil natif **Connexion Bureau à distance** permet de personnaliser la connexion et l'environnement via ses différents onglets : sauvegarde des paramètres de connexion, et mappage des ressources locales (clé USB, imprimante, presse-papiers pour le copier-coller entre poste local et poste distant).

Il est également disponible en ligne de commande :

```cmd
mstsc
```

### 3.4 Configurer le poste cible

Sur le poste à contrôler à distance, la fonctionnalité doit être **activée manuellement**, via l'onglet « Utilisation à distance » des paramètres système avancés — elle est **désactivée par défaut** pour des raisons de sécurité.

#### Niveaux d'authentification

| Niveau | Description |
|---|---|
| **Authentification standard** | Compatible avec tous les logiciels clients de bureau à distance |
| **NLA** (*Network Level Authentication*) | Plus sécurisé : double authentification — d'abord sur le réseau, puis sur la machine distante. Le client « Connexion Bureau à distance » est compatible NLA |

#### Droits d'accès

Par défaut, seuls les **administrateurs** sont autorisés à ouvrir une session distante. L'accès peut être étendu à d'autres utilisateurs via le groupe prédéfini **« Utilisateurs du Bureau à distance »**.

### 3.5 Mécanisme technique : le protocole RDP

L'interaction entre le poste local et le poste distant repose sur le protocole **RDP** (*Remote Desktop Protocol*), qui écoute sur le port **3389**. RDP transmet les mouvements de souris et la frappe clavier du poste local vers le poste distant, et renvoie en retour le rafraîchissement de l'affichage.

📌 L'activation de la fonctionnalité Bureau à distance ouvre automatiquement les accès correspondants dans le pare-feu Windows.


## ✅ Points clés à retenir

- Un partage implique toujours 4 éléments : une ressource (fichier/dossier/volume ou imprimante), un serveur qui l'héberge, un client qui y accède, et le réseau qui les relie.
- L'accès à une ressource partagée est vérifié à **deux niveaux cumulés de façon restrictive** : les droits de partage, puis les droits NTFS — le droit final appliqué est toujours le plus restrictif des deux.
- La bonne pratique de partage avancé consiste à retirer l'entité « Tout le monde » (qui inclut les comptes invités), à la remplacer par « Utilisateurs authentifiés » en Contrôle total au niveau du partage, puis à affiner les droits réels via les permissions NTFS.
- Les partages administratifs (noms terminant par `$`) sont cachés, réservés à l'administrateur, et gérés automatiquement par le système.
- Le Bureau à distance (protocole RDP, port 3389) permet de prendre le contrôle complet d'un poste à distance, mais limite les sessions simultanées (1 sur un poste client, 2 sur un serveur sans rôle RDS) ; il doit être activé manuellement côté poste cible et peut utiliser l'authentification NLA pour plus de sécurité.
- Les commandes et cmdlets clés : `net use`/`net view`/`net share` en ligne de commande, `New-SmbMapping`/`New-SmbShare` en PowerShell, et `mstsc` pour lancer une connexion Bureau à distance.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-8-le-partage-de-ressources"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-8-le-partage-de-ressources-data">
[
  {
    "question": "Quels sont les 4 éléments essentiels derrière la notion de partage de ressources ?",
    "options": ["La ressource, le serveur, le client et le réseau", "Le pare-feu, l'utilisateur, le mot de passe et le domaine", "Le disque, la partition, le volume et le système de fichiers", "Le routeur, la passerelle, le DNS et le DHCP"],
    "correctIndex": 0,
    "explanation": "Partager, c'est permettre d'accéder à une ressource hébergée par un serveur depuis un OS client en passant par le réseau : les 4 éléments essentiels sont donc la ressource, le serveur, le client et le réseau."
  },
  {
    "question": "Selon la définition Microsoft citée dans le module, quels types de ressources peut-on partager sur le réseau ?",
    "options": ["Uniquement des bases de données SQL", "Des fichiers (dossiers, arborescences ou volumes entiers) et des imprimantes", "Uniquement de la mémoire RAM via le réseau", "Uniquement des connexions Internet partagées"],
    "correctIndex": 1,
    "explanation": "D'après la définition Microsoft citée, les ressources partageables sont des fichiers via le partage de dossiers, d'arborescences ou de volumes entiers, ainsi que des imprimantes."
  },
  {
    "question": "Quels privilèges sont nécessaires pour pouvoir partager une ressource sur un système ?",
    "options": ["Aucun privilège particulier n'est requis", "Uniquement une authentification en tant qu'utilisateur invité", "Des privilèges d'administrateur, car partager revient à modifier le système", "Un abonnement Microsoft 365 actif"],
    "correctIndex": 2,
    "explanation": "Le module précise que partager une ressource revient à modifier le système, ce qui nécessite donc des privilèges d'administrateur."
  },
  {
    "question": "Quels sont les trois niveaux d'accès possibles lors du partage d'un dossier ou d'un volume ?",
    "options": ["Lecture, écriture et exécution", "Public, privé et restreint", "Invité, standard et administrateur", "Lecture, modification et contrôle total"],
    "correctIndex": 3,
    "explanation": "Le module précise que 3 niveaux d'accès sont possibles pour le partage d'un dossier ou d'un volume : lecture, modification et contrôle total."
  },
  {
    "question": "Combien de fois l'identité d'un utilisateur est-elle vérifiée lorsqu'il accède à une ressource partagée, et à quels niveaux ?",
    "options": ["Deux fois : au niveau du partage, puis au niveau des droits NTFS", "Une seule fois, au niveau du partage uniquement", "Trois fois : partage, NTFS et pare-feu", "Aucune vérification n'est faite si l'utilisateur est sur le réseau local"],
    "correctIndex": 0,
    "explanation": "L'identité de l'utilisateur est vérifiée deux fois : d'abord au niveau du partage, puis au niveau des droits NTFS de la ressource."
  },
  {
    "question": "Si John a l'autorisation \"lecture\" au niveau du partage et \"modification\" au niveau des droits NTFS, quel droit final obtiendra-t-il ?",
    "options": ["Modification, car les droits NTFS sont toujours prioritaires", "Lecture, car les autorisations du partage sont restrictives", "Contrôle total, car les deux niveaux se cumulent", "Aucun accès, car les deux niveaux sont en conflit"],
    "correctIndex": 1,
    "explanation": "Le module illustre que les autorisations du partage sont restrictives : même si John a un droit de modification au niveau NTFS, il n'aura finalement qu'un accès en lecture, car c'est le niveau le plus restrictif entre les deux qui s'applique."
  },
  {
    "question": "Quel type de chemin permet d'accéder momentanément à une ressource partagée depuis l'explorateur Windows, en indiquant le nom ou l'IP du serveur puis le nom du partage ?",
    "options": ["Un chemin FQDN complet", "Une URL HTTP", "Un chemin UNC (Universal Naming Convention)", "Un chemin relatif au répertoire courant"],
    "correctIndex": 2,
    "explanation": "Le chemin UNC (Universal Naming Convention), contenant le nom ou l'adresse IP du serveur suivi du nom du partage, permet d'accéder momentanément à une ressource partagée depuis l'explorateur Windows."
  },
  {
    "question": "Quelle commande en ligne de commande permet de lister tous les partages disponibles sur un serveur donné ?",
    "options": ["net use", "net share", "New-SmbMapping", "net view"],
    "correctIndex": 3,
    "explanation": "La commande net view permet de lister tous les partages disponibles sur le serveur auquel on souhaite accéder."
  },
  {
    "question": "Quelle cmdlet PowerShell permet de mapper un lecteur réseau vers un partage existant ?",
    "options": ["New-SmbMapping", "New-SmbShare", "Get-SmbShare", "Set-SmbServerConfiguration"],
    "correctIndex": 0,
    "explanation": "La cmdlet PowerShell New-SmbMapping permet de mapper un lecteur réseau, équivalent à la commande net use en ligne de commande classique."
  },
  {
    "question": "Pourquoi un technicien évite-t-il généralement le menu \"accorder l'accès à\" et le bouton \"partager\" simplifié de l'explorateur Windows pour créer des partages ?",
    "options": ["Parce qu'elle nécessite obligatoirement PowerShell", "Parce que cette méthode est orientée utilisateur et moins précise que le partage avancé", "Parce qu'elle ne fonctionne que sur les serveurs, pas sur les postes clients", "Parce qu'elle désactive automatiquement le pare-feu"],
    "correctIndex": 1,
    "explanation": "Le partage simplifié via le menu déroulant est orienté utilisateur ; un technicien privilégie plutôt le bouton partage avancé pour un contrôle plus fin des autorisations."
  },
  {
    "question": "Quelle bonne pratique de sécurité le module recommande-t-il concernant l'entité \"Tout le monde\", qui possède par défaut un accès en lecture sur un partage ?",
    "options": ["La conserver telle quelle, elle ne pose aucun risque", "La remplacer par le groupe Administrateurs uniquement", "La supprimer (car elle inclut le groupe et l'utilisateur invité) et ajouter à la place l'entité des utilisateurs identifiés", "Lui donner un accès en contrôle total pour simplifier la gestion"],
    "correctIndex": 2,
    "explanation": "La bonne pratique consiste à supprimer l'entité \"Tout le monde\" (qui contient le groupe et l'utilisateur invité) et à la remplacer par l'entité des utilisateurs identifiés, en leur accordant le contrôle total : cela ne pose pas de risque car les autorisations seront ensuite affinées grâce aux droits NTFS appliqués directement sur la ressource."
  },
  {
    "question": "Qu'est-ce qu'un partage administratif, comme ceux se terminant par un \"$\" ?",
    "options": ["Un partage visible par tous les utilisateurs du réseau", "Un partage réservé exclusivement à l'impression", "Un partage temporaire supprimé automatiquement après chaque redémarrage", "Un partage caché, géré automatiquement par le système, accessible uniquement au compte administrateur"],
    "correctIndex": 3,
    "explanation": "Les partages administratifs, dont le nom se termine par un $, sont cachés et n'apparaissent pas sur le réseau ; seul le compte administrateur peut y accéder, et ils sont créés automatiquement par le système."
  },
  {
    "question": "Quelle commande en ligne de commande permet de créer un partage en précisant son nom, son emplacement et les droits d'accès ?",
    "options": ["net share", "net view", "net use", "sharing /create"],
    "correctIndex": 0,
    "explanation": "La commande net share permet de créer un partage en spécifiant son nom, son emplacement, et en appliquant la bonne pratique consistant à donner l'accès en contrôle total aux utilisateurs identifiés."
  },
  {
    "question": "Quelle fonctionnalité Windows permet d'accéder à un poste entier à distance, et pas seulement à certaines ressources partagées ?",
    "options": ["Le partage de fichiers simplifié", "Le bureau à distance", "Le service APIPA", "Le composant dossiers partagés"],
    "correctIndex": 1,
    "explanation": "Le bureau à distance permet, une fois activé, d'accéder à un poste entier à partir du réseau, et de bénéficier du même niveau de fonctionnement que sur une session locale."
  },
  {
    "question": "Quelle est la principale limite du bureau à distance natif pour un usage de support utilisateur en temps réel ?",
    "options": ["Il ne fonctionne que sur les serveurs, jamais sur les postes clients", "Il nécessite obligatoirement une connexion VPN même sur le réseau local", "Une seule session locale ou distante est permise à la fois sur un poste client, ce qui empêche d'assister l'utilisateur sans fermer sa session", "Il ne peut être utilisé qu'en ligne de commande"],
    "correctIndex": 2,
    "explanation": "Le bureau à distance ne permet qu'une seule session (locale ou distante) à la fois sur un poste client, ce qui le rend inadapté au support en temps réel ; des outils comme TeamViewer, VNC, LogMeIn ou Microsoft Remote Assistance sont alors privilégiés."
  },
  {
    "question": "Que faut-il activer pour permettre à plus de deux utilisateurs de se connecter simultanément en bureau à distance sur un serveur ?",
    "options": ["Le service APIPA", "La fonctionnalité NLA", "Le protocole SMB3", "Le rôle Microsoft RDS (ou une solution tierce équivalente)"],
    "correctIndex": 3,
    "explanation": "Au-delà de deux sessions simultanées sur un serveur, il faut activer le rôle Microsoft RDS (Remote Desktop Services) ou recourir à une autre solution tierce."
  },
  {
    "question": "Quelle commande permet de lancer l'outil natif \"Connexion Bureau à distance\" depuis la ligne de commande ?",
    "options": ["mstsc", "rdp.exe", "remotedesktop.exe", "tsclient"],
    "correctIndex": 0,
    "explanation": "L'outil natif de connexion bureau à distance est accessible en ligne de commande via mstsc."
  },
  {
    "question": "Par défaut, qui est autorisé à ouvrir une session de bureau à distance sur un poste cible ?",
    "options": ["Tous les utilisateurs du poste, sans restriction", "Uniquement les administrateurs, sauf ajout d'autres utilisateurs au groupe \"Utilisateurs du Bureau à distance\"", "Uniquement l'utilisateur invité", "Personne, cette fonctionnalité ne peut jamais être activée"],
    "correctIndex": 1,
    "explanation": "Par défaut, seuls les administrateurs sont autorisés à ouvrir une session de bureau à distance ; il est possible d'étendre cet accès à d'autres utilisateurs via le groupe prédéfini \"Utilisateurs du Bureau à distance\"."
  },
  {
    "question": "Sur quel port TCP écoute le protocole RDP utilisé par le bureau à distance ?",
    "options": ["Le port 22", "Le port 443", "Le port 3389", "Le port 3306"],
    "correctIndex": 2,
    "explanation": "Le protocole RDP (Remote Desktop Protocol), qui assure l'interaction entre le poste local et le poste distant, écoute sur le port 3389 ; l'activation du bureau à distance ouvre automatiquement l'accès correspondant dans le pare-feu."
  },
  {
    "question": "Qu'apporte le niveau d'authentification NLA (Network Level Authentication) par rapport au niveau standard, pour une connexion en bureau à distance ?",
    "options": ["Il supprime totalement le besoin de s'authentifier", "Il permet de se connecter sans mot de passe via une clé USB", "Il n'a aucun impact sur la sécurité, seulement sur l'affichage", "Il repose sur une double authentification : d'abord sur le réseau, puis sur la machine distante, pour plus de sécurité"],
    "correctIndex": 3,
    "explanation": "Le niveau NLA repose sur une double authentification, d'abord sur le réseau, puis sur la machine distante, offrant un niveau de sécurité supérieur à l'authentification standard, tout en restant compatible avec le client Connexion Bureau à distance."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-8-le-partage-de-ressources",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-8-le-partage-de-ressources-data",
    });
  });
</script>
