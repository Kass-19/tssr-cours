# Module 2 : Active Directory

*Cours : [Cours 8 - Les services réseau en environnement Microsoft](../index.md)*

## 🎯 Objectif du module

Ce module couvre le fonctionnement conceptuel d'Active Directory (protocoles, forêt, domaine), la gestion des objets (utilisateurs, ordinateurs, groupes, conteneurs), les ressources partagées (dossiers, autorisations NTFS/partage), la stratégie AGDLP, et les services d'impression.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Qu'est-ce qu'Active Directory ?

AD est un **service d'annuaire** qui centralise l'authentification et la gestion des objets d'un réseau : utilisateurs, ordinateurs, ressources partagées. Il repose sur trois protocoles complémentaires, chacun avec un rôle précis :

| Protocole | Rôle |
|---|---|
| **DNS** | Résolution de noms de machines / localisation de services |
| **LDAP** | Accès et gestion des informations d'annuaire, structurées en base arborescente |
| **Kerberos** | Authentification (mécanisme de « ticket », comme un ticket de cinéma vérifié à l'entrée) |

---

## 2. La forêt Active Directory

À l'installation, on crée obligatoirement une **forêt**, qui part d'un **domaine racine**. Une entreprise de taille moyenne n'a souvent qu'un seul domaine ; une grande entreprise peut avoir des **domaines enfants** (le nom se construit alors comme un prénom + un nom de famille : nom de l'enfant + domaine racine). Les domaines d'une forêt sont liés par une relation d'approbation **transitive et bidirectionnelle**, et partagent tous le même **schéma** — ce qui garantit la cohérence des informations de configuration à travers toute la forêt.

---

## 3. Le domaine et ses composantes

Le **domaine AD** = un ensemble d'ordinateurs partageant une base de données commune, administré par des règles communes. Le **contrôleur de domaine** héberge cette base et gère l'authentification.

Un **site** est une composante logique qui optimise la réplication des informations et l'accès aux ressources (ex. un campus avec plusieurs antennes → un site par antenne, chacun avec son propre plan d'adressage).

### Rôles FSMO

5 rôles indispensables au fonctionnement de la forêt/du domaine, répartis en deux niveaux :

| Niveau | Rôles |
|---|---|
| **Forêt** | Maître de noms de domaine, Maître de schéma |
| **Domaine** | Maître RID, Maître d'infrastructure, Maître émulateur PDC |

📌 Avant de rétrograder un contrôleur de domaine, il faut s'assurer qu'il ne détient plus aucun rôle FSMO.

```powershell
Install-ADDSForest -DomainName "monDomaine.local" -DomainNetbiosName "MONDOMAINE" -ForestMode "Windows2019Forest" -DomainMode "Windows2019Domain" -InstallDNS
```

---

## 4. Les objets de l'annuaire

Deux familles : les **entités de sécurité** (utilisateurs, ordinateurs, groupes) et les **conteneurs** (unités d'organisation, conteneurs système).

```powershell
Get-ADUser -Filter * | Select-Object Name, SamAccountName
```

### Les utilisateurs

Bonne pratique Microsoft : créer un **compte modèle** (ex. `modele_utilisateur`), inactif, déjà configuré avec les caractéristiques communes (groupes...) à dupliquer pour les nouveaux comptes.

Les **profils itinérants** permettent à un utilisateur de retrouver son environnement sur n'importe quel poste : le profil est téléchargé à la connexion et resynchronisé à la déconnexion — ce qui peut être lent si le profil est volumineux.

### Les ordinateurs

Le **nommage** des machines est essentiel pour faciliter l'administration (éviter les noms génériques type `win-8564xk`). La version d'OS est enregistrée automatiquement à l'intégration au domaine, et un ordinateur peut lui aussi appartenir à des groupes.

---

## 5. Les groupes

Seuls les **groupes de sécurité** possèdent un **SID** (identifiant utilisé pour gérer les droits) ; les **groupes de distribution** n'en ont pas et ne servent qu'à la messagerie.

| Étendue | Usage |
|---|---|
| **Global (GG)** | Contient utilisateurs/ordinateurs/autres groupes globaux, utilisable sur tout le domaine (ou approuvé) |
| **Domaine local (DL)** | Rassemble les objets nécessitant les mêmes droits sur une **ressource partagée** donnée |

Exemples : `gg_commercial_nantes`, `dl_marketing_sur_srvfic_ct` (accès Contrôle Total). Niveaux de droits : **CT** (contrôle total), **M** (modification), **L** (lecture), **R** (refus).

---

## 6. Les conteneurs

4 conteneurs système par défaut :

| Conteneur | Rôle |
|---|---|
| **Built-in** | Comptes locaux (base SAM) transférés lors de la promotion en contrôleur de domaine |
| **Computers** | Réception automatique des objets ordinateurs |
| **System** | Données de fonctionnement d'AD |
| **Users** | Stockage par défaut des utilisateurs/groupes |

📌 Bonne pratique : **ne pas laisser** les comptes dans Computers/Users — créer des **OU** dédiées, ce qui facilite aussi la gestion des GPO et des délégations (voir Module 3). Un objet ne peut appartenir qu'à un seul conteneur, et les OU sont protégées par défaut contre la suppression accidentelle.

---

## 7. Import/export de comptes

Utile pour créer des comptes en masse. **PowerShell** est recommandé (fiable) plutôt que **CSVDE** (outil tiers, comportement parfois instable).

```powershell
Import-Csv "C:\Utilisateurs.csv" | ForEach-Object {
    New-ADUser -Name $_.Nom -SamAccountName $_.Login -UserPrincipalName $_.Email `
    -Path "OU=Utilisateurs,DC=domaine,DC=com" `
    -AccountPassword (ConvertTo-SecureString $_.MotDePasse -AsPlainText -Force) -Enabled $true
}
```

---

## 8. Les ressources partagées

### Autorisations NTFS

S'appliquent à tous les fichiers/dossiers. Deux niveaux (base et avancées). L'**héritage** se propage du dossier racine vers les enfants ; les autorisations d'un utilisateur se **cumulent**, mais **en cas de conflit, le refus l'emporte toujours**. En l'absence de règle explicite, l'accès est refusé par défaut (refus implicite). Bonne pratique : toujours attribuer les droits aux **groupes**, pas directement aux utilisateurs.

### Autorisations de partage

Viennent **en complément** des autorisations NTFS. 3 niveaux : Lecture, Modification, Contrôle total.

### Autorisation résultante

Un utilisateur accédant à une ressource passe d'abord par les **autorisations de partage**, puis par les **autorisations NTFS** : **le privilège le plus restrictif l'emporte** entre les deux.

---

## 9. Stratégie d'imbrication des groupes – AGDLP

Méthode recommandée par Microsoft : **A**ccount → **G**lobal Group → **D**omain **L**ocal Group → **P**ermission.

1. Le compte utilisateur est créé.
2. Il est ajouté à un **groupe global (GG)**.
3. Le groupe global est intégré dans un **groupe de domaine local (DL)**.
4. Le groupe DL reçoit les **permissions NTFS** sur la ressource.

✅ Avantage : pour intégrer un nouvel utilisateur, il suffit de l'ajouter au bon groupe global — il hérite automatiquement des accès via le DL. Bonne pratique : créer **4 groupes DL par ressource** (CT, Modification, Lecture, Refus).

---

## 10. Le service d'impression

| Terme | Définition |
|---|---|
| **Port d'impression** | Lien entre le périphérique d'impression et le serveur |
| **File d'attente** | Documents en attente, traités par priorité |
| **Imprimante locale** | Connectée directement à un poste/serveur |
| **Imprimante partagée** | Accessible sur le réseau (le poste/serveur partageur doit être allumé) |
| **Imprimante réseau** | Indépendante, avec sa propre carte réseau |
| **Pool d'imprimante** | Plusieurs imprimantes physiques regroupées derrière une seule vue réseau |

Déploiement possible en 3 méthodes : manuel (l'utilisateur installe via l'explorateur), par script, ou par **GPO** (voir Module 3).

## ✅ Points clés à retenir

- AD repose sur **3 protocoles** : DNS, LDAP, Kerberos.
- Les **rôles FSMO** (5 au total) sont indispensables au fonctionnement de la forêt/du domaine.
- Toujours créer des **OU dédiées**, ne pas laisser les objets dans les conteneurs par défaut.
- Seuls les **groupes de sécurité** ont un SID.
- La méthode **AGDLP** est LA bonne pratique pour la gestion des accès.
- Accès résultant = combinaison partage + NTFS, **le plus restrictif l'emporte** ; en cas de conflit, **le refus gagne toujours**.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-2-active-directory"></div>

<script type="application/json" id="quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-2-active-directory-data">
[
  {
    "question": "Quel est le rôle principal d'Active Directory dans un réseau d'entreprise ?",
    "options": [
      "Centraliser l'authentification et la gestion des objets (utilisateurs, ordinateurs, ressources partagées)",
      "Fournir un pare-feu centralisé pour filtrer le trafic réseau",
      "Attribuer automatiquement les adresses IP aux postes clients",
      "Sauvegarder automatiquement les fichiers des utilisateurs"
    ],
    "correctIndex": 0,
    "explanation": "Active Directory est un système d'annuaire qui centralise l'authentification et la gestion des différents objets d'un réseau (utilisateurs, ordinateurs, imprimantes, groupes...), facilitant la gestion et le contrôle des accès."
  },
  {
    "question": "Sur quels trois protocoles fondamentaux repose le fonctionnement d'Active Directory ?",
    "options": [
      "DHCP, HTTP et SMTP",
      "DNS, LDAP et Kerberos",
      "TCP, UDP et ICMP",
      "FTP, SSH et RDP"
    ],
    "correctIndex": 1,
    "explanation": "Active Directory repose sur trois protocoles fondamentaux : DNS pour la résolution de noms, LDAP pour structurer et interroger l'annuaire, et Kerberos pour l'authentification des utilisateurs."
  },
  {
    "question": "Kerberos est comparé à l'entrée dans un cinéma, où l'on doit d'abord acheter un ticket avant d'accéder à la salle. À quoi correspond ce mécanisme ?",
    "options": [
      "Chaque utilisateur doit connaître l'adresse IP du contrôleur de domaine",
      "Chaque ressource doit posséder sa propre adresse MAC",
      "Chaque utilisateur doit obtenir un ticket d'authentification pour accéder aux ressources du réseau",
      "Chaque groupe doit être validé manuellement par l'administrateur"
    ],
    "correctIndex": 2,
    "explanation": "Kerberos fonctionne par système de tickets : l'utilisateur obtient un ticket d'authentification qui est ensuite vérifié pour lui donner accès aux ressources du réseau, comme un ticket de cinéma contrôlé à l'entrée de la salle."
  },
  {
    "question": "Quel rôle joue le protocole LDAP dans Active Directory ?",
    "options": [
      "Il chiffre les mots de passe des utilisateurs",
      "Il assure la réplication entre contrôleurs de domaine",
      "Il gère les files d'attente d'impression",
      "Il permet d'accéder et de gérer les informations d'annuaire, en structurant AD sous forme de base de données arborescente"
    ],
    "correctIndex": 3,
    "explanation": "LDAP (Lightweight Directory Access Protocol) permet d'accéder et de gérer les informations de l'annuaire, organisées sous forme arborescente, un peu comme les pages d'un annuaire papier."
  },
  {
    "question": "Qu'est-ce qu'une « forêt » dans Active Directory ?",
    "options": [
      "Le point de départ du contexte Active Directory, représenté par le domaine racine, obligatoirement créé lors de l'installation",
      "Un ensemble d'imprimantes reliées à un même serveur",
      "Une unité d'organisation contenant uniquement des ordinateurs",
      "Un groupe de sécurité à portée universelle"
    ],
    "correctIndex": 0,
    "explanation": "À l'installation d'AD, la création d'une forêt est obligatoire. Elle constitue le point de départ du contexte Active Directory et est représentée par le domaine racine, souvent considéré comme le cœur de l'infrastructure de l'entreprise."
  },
  {
    "question": "L'image du « prénom et du nom de famille » sert à expliquer la création d'un domaine enfant (par exemple « Conception ») rattaché à un domaine racine. Que signifie cette image ?",
    "options": [
      "Le domaine enfant remplace totalement le nom du domaine racine",
      "Le domaine enfant porte à la fois son propre nom et celui du domaine racine",
      "Le domaine enfant doit obligatoirement porter le même nom que le domaine racine",
      "Le domaine enfant n'a aucun lien de nommage avec le domaine racine"
    ],
    "correctIndex": 1,
    "explanation": "Un domaine enfant porte non seulement son propre nom, mais aussi celui du domaine racine — un peu comme un prénom (nom propre) associé à un nom de famille (héritage du domaine racine), par exemple conception.monentreprise.local."
  },
  {
    "question": "Quel est le rôle du contrôleur de domaine dans Active Directory ?",
    "options": [
      "Il sert uniquement de serveur d'impression pour le domaine",
      "Il stocke les fichiers personnels de chaque utilisateur",
      "Il héberge et gère la base Active Directory ainsi que l'authentification des utilisateurs",
      "Il fait office de pare-feu périmétrique pour le domaine"
    ],
    "correctIndex": 2,
    "explanation": "Le contrôleur de domaine (un ou plusieurs serveurs) assure la gestion du domaine : il héberge et gère la base Active Directory (l'annuaire) et prend en charge l'authentification des utilisateurs."
  },
  {
    "question": "À quoi sert la notion de « site » dans Active Directory ?",
    "options": [
      "À définir les autorisations NTFS d'un dossier partagé",
      "À isoler chaque utilisateur dans un conteneur distinct",
      "À remplacer la notion de forêt pour les petites entreprises",
      "À optimiser la réplication des informations du domaine ainsi que l'accès aux ressources selon la localisation géographique/réseau"
    ],
    "correctIndex": 3,
    "explanation": "Un site est une composante logique utilisée pour optimiser la réplication des informations du domaine et l'accès aux ressources, par exemple pour distinguer deux antennes géographiques avec des plans d'adressage différents."
  },
  {
    "question": "Combien de rôles FSMO existe-t-il dans Active Directory, et comment sont-ils répartis ?",
    "options": [
      "5 rôles : 2 au niveau de la forêt et 3 au niveau du domaine",
      "3 rôles, tous au niveau de la forêt",
      "4 rôles, tous au niveau du domaine",
      "5 rôles, tous répliqués sur chaque contrôleur de domaine"
    ],
    "correctIndex": 0,
    "explanation": "Il existe cinq rôles FSMO répartis entre la forêt (maître de noms de domaine, maître de schéma) et le domaine (maître RID, maître d'infrastructure, maître émulateur PDC)."
  },
  {
    "question": "Parmi les rôles FSMO suivants, lesquels se situent au niveau de la forêt (et non du domaine) ?",
    "options": [
      "Le maître RID et le maître émulateur PDC",
      "Le maître de noms de domaine et le maître de schéma",
      "Le maître d'infrastructure et le maître RID",
      "Le maître émulateur PDC et le maître de schéma"
    ],
    "correctIndex": 1,
    "explanation": "Au niveau de la forêt se trouvent le maître de noms de domaine et le maître de schéma. Les trois autres rôles (RID, infrastructure, émulateur PDC) sont au niveau du domaine."
  },
  {
    "question": "Sous Windows 2019 et versions ultérieures, quelle commande PowerShell permet de rétrograder un contrôleur de domaine en serveur standard ?",
    "options": [
      "Remove-ADDSDomainController",
      "Disable-ADDSForest",
      "Uninstall-AddsDomainController",
      "Demote-ADDSServer"
    ],
    "correctIndex": 2,
    "explanation": "La commande Uninstall-AddsDomainController permet de rétrograder un contrôleur de domaine sous Windows 2019 et versions ultérieures, à condition qu'il ne dispose plus de rôles FSMO."
  },
  {
    "question": "Dans Active Directory, les objets se répartissent en deux grandes familles. Lesquelles ?",
    "options": [
      "Les objets locaux et les objets distants",
      "Les objets systèmes et les objets utilisateurs",
      "Les objets répliqués et les objets non répliqués",
      "Les entités de sécurité et les conteneurs"
    ],
    "correctIndex": 3,
    "explanation": "Les entités de sécurité (utilisateurs, ordinateurs, groupes) se distinguent des conteneurs (unités d'organisation et conteneurs système), qui organisent et stockent les autres objets."
  },
  {
    "question": "Quels sont les quatre conteneurs système présents par défaut dans un domaine Active Directory ?",
    "options": [
      "Built-in, Computers, System, Users",
      "Users, Groups, Computers, Printers",
      "Domain, Forest, Site, Schema",
      "Root, Users, OU, GPO"
    ],
    "correctIndex": 0,
    "explanation": "Chaque domaine Active Directory possède par défaut quatre conteneurs : Built-in (utilisateurs/groupes locaux transférés lors de la promotion en contrôleur de domaine), Computers (objets ordinateurs), System (données de fonctionnement d'AD) et Users (stockage par défaut des utilisateurs et groupes)."
  },
  {
    "question": "Quelle condition un « modèle utilisateur » (compte générique servant de base à la création d'autres comptes) doit-il impérativement respecter ?",
    "options": [
      "Il doit posséder un mot de passe vide",
      "Le compte doit être inactif",
      "Il doit être membre du groupe Administrateurs du domaine",
      "Il doit être placé dans le conteneur Built-in"
    ],
    "correctIndex": 1,
    "explanation": "Un compte modèle doit être inactif pour être considéré comme tel : il ne peut pas se connecter au domaine, mais sert de base à copier pour créer rapidement de nouveaux comptes aux mêmes caractéristiques."
  },
  {
    "question": "Comment fonctionne un profil itinérant pour un utilisateur qui n'a pas de poste de travail attitré ?",
    "options": [
      "Le profil reste stocké définitivement sur le premier poste utilisé",
      "L'utilisateur doit recréer manuellement son environnement sur chaque poste",
      "Les données du profil sont stockées sur un serveur et téléchargées lors de chaque connexion, puis resynchronisées à la déconnexion",
      "Le profil itinérant ne fonctionne que sur les ordinateurs portables"
    ],
    "correctIndex": 2,
    "explanation": "Avec un profil itinérant, les données utilisateur sont stockées sur un serveur de l'entreprise et téléchargées lors de la connexion, puis resynchronisées vers le serveur à la déconnexion, permettant à l'utilisateur de retrouver son environnement sur n'importe quelle machine du domaine."
  },
  {
    "question": "Quelle est la principale différence entre un groupe de sécurité et un groupe de distribution dans Active Directory ?",
    "options": [
      "Seul le groupe de distribution peut contenir des utilisateurs",
      "Le groupe de sécurité ne sert qu'à la messagerie",
      "Il n'existe aucune différence fonctionnelle entre les deux",
      "Seul le groupe de sécurité possède un SID et peut se voir attribuer des autorisations d'accès aux ressources"
    ],
    "correctIndex": 3,
    "explanation": "Les groupes de distribution ne disposent pas de SID (Security Identifier) et ne servent qu'à des fins de messagerie. Les groupes de sécurité possèdent un SID unique qui leur permet de se voir attribuer des autorisations d'accès aux ressources."
  },
  {
    "question": "Quelle est la contrainte d'appartenance d'un groupe global dans Active Directory ?",
    "options": [
      "Il ne peut contenir que des objets utilisateurs, des ordinateurs, ou d'autres groupes globaux",
      "Il ne peut contenir que des groupes de domaine local",
      "Il peut contenir n'importe quel type d'objet sans restriction",
      "Il ne peut contenir que des unités d'organisation"
    ],
    "correctIndex": 0,
    "explanation": "Un groupe global ne peut contenir que des objets utilisateurs, des ordinateurs, ou d'autres groupes globaux. Il peut en revanche être ajouté comme membre sur n'importe quelle ressource du domaine ou d'un domaine approuvé, ce qu'exploite justement la méthode AGDLP."
  },
  {
    "question": "Que signifie l'acronyme AGDLP, méthode préconisée par Microsoft pour gérer les permissions sur les ressources partagées ?",
    "options": [
      "Active Directory, Group, Local, Permissions",
      "Accounts, Global Groups, Domain Local Groups, Permissions",
      "Authorization, Group Delegation, Local Policy",
      "Access, Group, Domain, License, Policy"
    ],
    "correctIndex": 1,
    "explanation": "AGDLP signifie Accounts (comptes utilisateurs) → Global Groups (groupes globaux) → Domain Local Groups (groupes de domaine local) → Permissions (autorisations NTFS). L'utilisateur est placé dans un groupe global, lui-même intégré dans un groupe de domaine local auquel sont attribuées les permissions NTFS."
  },
  {
    "question": "En cas de conflit entre une autorisation d'« autoriser » et une autorisation de « refuser » appliquées au même utilisateur sur une ressource NTFS, laquelle l'emporte ?",
    "options": [
      "L'autorisation « autoriser » l'emporte toujours",
      "C'est l'autorisation appliquée en dernier qui l'emporte",
      "Le refus l'emporte",
      "Les deux autorisations s'annulent et l'accès devient implicite"
    ],
    "correctIndex": 2,
    "explanation": "Les autorisations NTFS sont cumulatives, mais en cas de conflit entre une autorisation et un refus concernant un même utilisateur (directement ou via ses groupes), c'est toujours le refus qui l'emporte."
  },
  {
    "question": "Lorsqu'un utilisateur accède à un dossier partagé depuis le réseau, il est soumis successivement aux autorisations de partage puis aux autorisations NTFS. Quelle règle détermine son droit d'accès final (l'autorisation dite « résultante ») ?",
    "options": [
      "Seules les autorisations NTFS comptent, les autorisations de partage sont ignorées",
      "C'est le privilège le plus permissif entre les deux qui s'applique",
      "Seules les autorisations de partage comptent une fois l'utilisateur authentifié",
      "C'est le privilège le plus restrictif entre les autorisations de partage et les autorisations NTFS qui prévaut"
    ],
    "correctIndex": 3,
    "explanation": "L'utilisateur passe d'abord par les autorisations de partage, puis par les autorisations NTFS. L'autorisation résultante correspond au privilège le plus restrictif entre les deux niveaux."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-2-active-directory",
      dataId: "quiz-cours-08-les-services-reseau-en-environnement-microsoft-module-2-active-directory-data",
    });
  });
</script>
