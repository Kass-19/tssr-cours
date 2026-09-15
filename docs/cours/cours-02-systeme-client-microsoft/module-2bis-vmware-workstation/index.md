# Module 2bis : VMWare Workstation

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module présente les principes de la virtualisation, la gestion des ressources d'une VM (CPU, RAM, disque) sous VMware Workstation, les différents types de réseaux virtuels, les avantages/inconvénients de l'outil, ainsi que deux démonstrations : la création d'une VM et l'import/export de VM.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La virtualisation des systèmes : principes

La **virtualisation** permet de faire cohabiter plusieurs systèmes d'exploitation sur une seule machine physique. Normalement, un ordinateur n'est piloté que par **un seul** OS, seul habilité à utiliser ses ressources matérielles. La virtualisation permet à des OS dits **« invités »** d'exploiter ces mêmes ressources.

| Terme | Définition |
|---|---|
| **Hôte** | La machine physique, propriétaire des ressources matérielles |
| **VM** (*Virtual Machine*) | Un ordinateur virtuel hébergeant un OS invité, indépendant et isolé des autres VM, bien que partageant la même machine hôte |
| **Hyperviseur** | L'élément central qui fait le lien entre les VM et l'hôte — sans lui, pas de virtualisation possible |

### Les deux formes d'hyperviseur

| Type | Exemple |
|---|---|
| **Logiciel**, installé sur un OS existant | VMware **Workstation** |
| **Système d'exploitation** dédié | VMware **ESXi** |

L'hyperviseur a une **vision globale** des ressources de l'hôte : bien que les OS invités croient avoir un accès direct au matériel, c'est en réalité l'hyperviseur qui **intercepte** leurs demandes, les priorise et les partage entre toutes les VM — c'est ce mécanisme qui optimise l'usage des ressources tout en garantissant l'isolation de chaque environnement.

### Ce dont une VM a besoin

Comme une machine physique, une VM nécessite : **CPU**, **RAM**, **stockage**, **carte réseau** — et, selon les cas, des composants supplémentaires (BIOS/EFI, carte graphique, lecteur DVD). Une VM est définie par un **ensemble de fichiers** stockés dans un répertoire dédié, géré par l'hyperviseur.

---

## 2. Les ressources d'une VM sous Workstation

### CPU

Le CPU attribué à une VM est configuré à sa création, en fonction des ressources totales de l'hôte. ⚠️ Attribuer trop de ressources CPU à une VM peut avoir l'effet inverse de celui recherché : ses instructions risquent d'être **mises en file d'attente** si d'autres VM (ou l'hôte lui-même) sont jugées prioritaires — ce qui dégrade les performances plutôt que de les améliorer. VMware fournit ses propres recommandations, accessibles via le bouton **Help**. L'allocation ne peut être modifiée qu'une fois la **VM éteinte**.

### RAM

📌 La RAM attribuée à une VM lui est réservée **dès son démarrage** — si une VM est configurée avec 4 Go, l'hôte lui dédie immédiatement ces 4 Go. Il faut donc s'assurer d'avoir suffisamment de RAM disponible sur l'hôte **avant** de démarrer la VM.

| État de la VM | Effet sur la RAM allouée |
|---|---|
| **Éteinte** | RAM libérée, disponible pour l'hôte |
| **En pause** | Contenu de la RAM transféré dans un fichier du répertoire de la VM, restauré en RAM à la reprise |
| **En marche** | RAM réservée en continu |

### Disque dur

Le disque dur d'une VM est en réalité **un simple fichier** — ce qui ouvre de nombreuses possibilités : le créer en dizaines d'exemplaires, le déplacer, le copier, le compresser, le supprimer, comme n'importe quel fichier.

Par défaut, la taille du disque est **dynamique** : le fichier grandit au fur et à mesure du remplissage réel, pas selon la taille maximale allouée. Exemple : une VM avec 60 Go alloués ne pèsera en réalité que quelques Go juste après l'installation de l'OS.

Il est même possible de faire du **surdimensionnement** : allouer plus d'espace que ce dont l'hôte dispose réellement, tant que cet espace n'est pas effectivement utilisé.

⚠️ **Précautions** : une VM ne peut jamais dépasser son quota maximal défini (ex. 20 Go max = 20 Go max, point final) ; et si l'hôte n'a lui-même plus d'espace disponible (toutes VM confondues), des effets de bord désagréables peuvent survenir (VM figées, corruption possible).

---

## 3. Les réseaux virtuels de VMware Workstation

Comme une machine physique, une VM doit être connectée à un **switch virtuel** via une **carte réseau virtuelle** pour communiquer.

| Type de réseau | Communication possible | Particularités |
|---|---|---|
| **Hostonly** | VM ↔ autres VM du même réseau Hostonly, VM ↔ hôte | Toutes les machines doivent être sur le même réseau IP ; l'IP de l'hôte se configure via la carte **VMware Network Adapter** (accessible par `ncpa.cpl`) |
| **VMnet** | Identique à Hostonly, en version personnalisable | Réseaux numérotés de **0 à 19** ; **VMnet1** = Hostonly par défaut, **VMnet8** = réseau NAT par défaut |
| **LAN Segments** | Petits réseaux virtuels nommés, isolés entre eux | Utile pour maquetter un réseau d'entreprise (ex. « usine », « administratif », « serveur »...) ; communication entre segments possible via un **routeur virtuel**, mais **pas de communication directe avec l'hôte** |
| **Bridge** | VM connectée au **réseau physique** (switch physique de l'hôte) | Accès aux services réseau réels (DNS, DHCP...) — la VM apparaît comme n'importe quelle machine physique sur le réseau |
| **NAT** | VM ↔ autres VM/hôte (via **VMnet8**), et VM ↔ réseau physique | La VM emprunte l'adresse IP de la carte Ethernet de l'hôte pour sortir vers l'extérieur (**translation d'adresse**) |

---

## 4. Avantages, inconvénients et bonnes pratiques

### Avantages de VMware Workstation

| Avantage | Détail |
|---|---|
| **Interface simple** | Prise en main rapide |
| **VMware Tools** | Améliore l'usage des VM (ex. glisser-déposer de fichiers hôte ↔ VM) |
| **Mise en pause** | Libère temporairement les ressources de l'hôte sans éteindre la VM |
| **Snapshot** | Enregistre l'état d'une VM à un instant T, avant une action risquée (mise à jour, nouveau pilote...) → permet un **rollback** en cas d'échec, pour revenir rapidement à une situation stable |
| **Clonage** | Duplique une VM modèle en plusieurs clones en quelques minutes → base rapide pour maquetter une petite infrastructure |

### Inconvénients

- Prévu pour des **maquettes et des tests**, pas pour virtualiser des serveurs ou services de **production** (nécessite une solution de virtualisation d'entreprise plus poussée).
- Logiciel **propriétaire et payant**, sans accès aux sources pour le personnaliser.
- Les concepts de virtualisation demandent une **courbe d'apprentissage** avant d'être bien maîtrisés.

### À savoir pour bien démarrer

- Une VM possède son propre **firmware** (BIOS ou UEFI), configurable (ex. séquence de démarrage).
- Une clé USB branchée sur l'hôte peut être **automatiquement reconnue** par la VM.
- La VM **capture le clavier et la souris** une fois qu'on clique dedans : `Ctrl + Alt` permet de reprendre la main sur l'hôte.
- Des boutons dédiés dans la barre de navigation de Workstation permettent d'envoyer un `Ctrl+Alt+Suppr` dans la VM, ou de créer un snapshot rapidement.

---

## 5. Démonstration – Création d'une VM

| Étape | Détail |
|---|---|
| **1. Point de départ** | Instance Workstation fraîchement installée → librairie de VM vide |
| **2. Source de l'OS** | 3 choix possibles : lecteur DVD de l'hôte, image ISO, ou **« I will install the operating system later »** — ce dernier choix est **recommandé**, car les deux premiers laissent Workstation prendre seule certaines décisions de configuration |
| **3. Choix de l'OS cible** | Ex. Windows 10 64 bits — ce choix conditionne les recommandations matérielles proposées ensuite |
| **4. Nom et emplacement** | Nom de la VM + dossier d'hébergement des fichiers sur le disque de l'hôte. Bonne pratique : héberger ses VM sur un **volume dédié**, si possible un **SSD** |
| **5. Taille du disque** | Proposée par défaut selon l'OS choisi (ex. 64 Go pour Windows 10). Le disque est un fichier **.vmdk** (*Virtual Machine Disk*) — choix possible entre un fichier unique ou plusieurs fragments (« Store virtual disk as a single file » recommandé pour une meilleure lisibilité) |
| **6. Récapitulatif** | Configuration CPU/RAM/réseau déjà définie, modifiable via **« Customize hardware »** |
| **7. Réseau** | Connexion de la VM au réseau choisi (ex. Hostonly) |
| **8. Démarrage** | La VM apparaît dans la librairie et peut être démarrée — elle bloquera au démarrage tant qu'aucun OS n'est installé, ce qui est normal |
| **9. Fichiers générés** | Dans le dossier d'accueil de la VM : fichier **.vmx** (configuration, éditable en texte brut) et fichier **.vmdk** (disque dur, quelques Mo au départ, grandira sans jamais dépasser la taille maximale définie) |

---

## 6. Import et export de VM

Une VM étant définie par un ensemble de fichiers, elle peut être **déplacée, copiée et manipulée** comme n'importe quel fichier — ce qui rend son import/export particulièrement simple.

### Import

| Méthode | Comment |
|---|---|
| **Depuis un dossier existant** | Ouvrir la VM depuis Workstation, ou double-cliquer directement sur son fichier **.vmx** |
| **Depuis une archive** | Formats **OVA** (*Open Virtual Appliance*) ou **OVF** (*Open Virtualization Format*) |

📌 À l'import d'une VM déjà configurée, Workstation demande si la VM a été **déplacée** (conserve la configuration source, ex. l'adresse MAC) ou **copiée** (génère une nouvelle adresse MAC) — un point important pour éviter des conflits MAC si l'original existe encore ailleurs sur le réseau.

### Export

| Méthode | Comment |
|---|---|
| **Copie simple** | Copier-coller le dossier d'accueil de la VM vers la destination de sauvegarde |
| **Archive OVA/OVF** | Conserve une version compacte, facilement transférable — menu **File → Export to OVF** (ou choisir l'extension OVA) |

**Exemple de commande pour exporter en OVA** :
```
vmware-vdiskmanager -r <nom_VM>.vmdk -t 1 <nom_VM_export.ova>
```

### Démonstration

- **Import depuis un dossier** : double-clic sur le fichier `.vmx` d'une VM Debian 9 existante (512 Mo RAM, 1 CPU, 20 Go disque) → choix « copiée » → Workstation génère une nouvelle adresse MAC → la VM démarre avec sa configuration d'origine conservée.
- **Import depuis une archive OVA** : sélection d'une archive pfSense → attribution d'un nom et d'un répertoire de décompactage → import (quelques secondes à quelques minutes) → la VM apparaît dans la librairie avec sa configuration propre (1 Go RAM, 1 CPU, 20 Go disque).
- **Export en OVF/OVA** : sélection de la VM démo → **File → Export to OVF** → choix de la destination et du format → export terminé, archive vérifiée dans le dossier de destination. 📌 Une VM sans OS installé produit une archive **très légère**.

---

## ✅ Points clés à retenir

- L'**hyperviseur** est l'élément central de la virtualisation — sans lui, aucune VM ne peut fonctionner. Il existe en version **logicielle** (Workstation) ou **OS dédié** (ESXi).
- La **RAM** d'une VM est réservée dès son démarrage — toujours vérifier la disponibilité sur l'hôte avant de lancer une VM gourmande.
- Le disque dur d'une VM est un **fichier** à taille **dynamique** : il grandit avec l'usage réel, sans jamais dépasser le quota maximal défini.
- 5 types de réseaux virtuels à distinguer : **Hostonly** (VM ↔ hôte/VM), **VMnet** (Hostonly personnalisable, numéroté 0-19), **LAN Segments** (réseaux isolés, sans accès à l'hôte), **Bridge** (accès direct au réseau physique), **NAT** (accès au réseau physique via l'IP de l'hôte).
- Le **snapshot** permet un rollback rapide après une action risquée — un réflexe à prendre avant toute modification critique d'une VM.
- Workstation est un outil de **maquette et de test**, pas une solution de virtualisation pour la **production**.
- Une VM = un ensemble de fichiers (**.vmx** pour la config, **.vmdk** pour le disque) → import/export simplifié, par copie directe ou via une archive **OVA/OVF**.


## 📝 Fiche de révision

_À compléter._

