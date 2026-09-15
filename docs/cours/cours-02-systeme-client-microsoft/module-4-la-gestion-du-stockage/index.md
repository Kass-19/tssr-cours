# Module 4 : La gestion du stockage

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module présente le partitionnement d'un disque dur (MBR et GPT), les systèmes de fichiers (NTFS, FAT32, ReFS...), les disques durs virtuels, et les outils de gestion du stockage (console graphique, diskpart, cmdlets PowerShell).
## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Le partitionnement

Pour qu'un ordinateur puisse naviguer entre les partitions d'un disque, celui-ci possède une **table de partitionnement** — l'équivalent d'un sommaire du disque. Il existe 2 formats principaux.

### Le format MBR (Master Boot Record)

Format **historique**, indispensable pour un système démarrant en **BIOS**. Le BIOS a pour mission de charger l'OS en RAM ; or l'OS est un ensemble de fichiers présent dans une partition — c'est le **MBR** qui indique au BIOS où se trouve cette partition.

| Caractéristique | Valeur |
|---|---|
| Emplacement | Premier secteur du disque |
| Taille maximale | 512 octets |
| Partitions référencées | **4 maximum** |
| Taille de disque max | **2,2 To** |

### Étapes et vocabulaire du partitionnement (disque de base)

Sur un **disque de base**, on peut créer des **partitions principales**, ou étendre une partition existante en utilisant l'espace disponible **contigu**.

Pour dépasser la limite de 4 partitions du MBR, on peut créer une **partition étendue** : un contenant pouvant accueillir des **lecteurs logiques**, eux-mêmes capables de stocker des données — mais ces lecteurs logiques **ne sont pas référencés dans le MBR**.

### Le disque dynamique

Pour s'affranchir des limites techniques d'un disque de base, on peut utiliser un **disque dynamique**. Sur ce type de disque, les partitions sont appelées des **volumes**.

| Avantage du disque dynamique | Détail |
|---|---|
| Extension sans contiguïté | Un volume peut être étendu grâce à l'espace libre, **sans que celui-ci soit contigu** |
| Extension multi-disque | Possibilité d'utiliser l'espace libre d'un **autre** disque dynamique — ce qui ouvre la voie aux technologies **RAID** |

📌 La conversion d'un disque de base en disque dynamique se fait **sans perte de données**.

### Le format GPT (GUID Partition Table)

Ce format plus récent lève les limites du MBR : au lieu d'être stockée uniquement sur le premier secteur, la table **GPT** est sauvegardée sur **plusieurs secteurs** du disque, ce qui la rend plus résiliente.

| Caractéristique | Valeur |
|---|---|
| Partitions max | **128** |
| Taille de partition max | **256 To** |
| Compatibilité firmware | **UEFI uniquement** (pas de BIOS) |
| Compatibilité OS | **64 bits uniquement** |

---

## 2. Le système de fichiers

Une fois le disque partitionné, il faut **formater** les partitions — c'est-à-dire y installer un **système de fichiers**. Le système de fichiers (*File System*, FS) organise les données grâce à son **index**, qui contient les adresses physiques de chaque fichier. Une fois formatée, une partition est appelée un **volume**.

| Système de fichiers | Caractéristiques |
|---|---|
| **NTFS** | Système par défaut chez Microsoft. Nativement sécurisé grâce aux **ACL** (*Access Control List*) : l'index contient les autorisations d'accès à chaque fichier. Chiffrement et compression natifs (**EFS**). Peut gérer des informations de duplication. Capacité max : **256 To** |
| **FAT32** | Système historique et **standard** : reconnu par un très grand nombre d'OS (ex. une clé USB en FAT32 est lisible sur plusieurs OS différents). **Pas sécurisé nativement** (pas d'ACL). ⚠️ *Correction : le document source indique une limite de « 74 Go », ce qui est une coquille — la limite réelle de formatage FAT32 sous Windows est de **32 Go** par volume (et 4 Go max par fichier)* |
| **ReFS** | Évolution de NTFS, plutôt réservée aux **gros volumes de stockage** |
| **Autres** | ext4, VMFS, UDF, et bien d'autres — chacun adapté à un contexte différent (Linux, virtualisation, disques optiques...) |

---

## 3. Les disques durs virtuels

*(Aparté sur la virtualisation, en lien avec l'usage croissant des VM.)*

Avec l'utilisation croissante des machines virtuelles, les **disques durs virtuels** sont de plus en plus répandus. Microsoft possède son propre format, utilisé notamment dans sa solution **Hyper-V** :

| Extension | Format |
|---|---|
| **.vhd** | *Virtual Hard Disk* |
| **.vhdx** | Version étendue de VHD |

Ces disques virtuels sont **bootables**, peuvent être configurés en taille **fixe** ou **dynamique**, et peuvent même être utilisés sur des **machines physiques**. Comme pour une VM entière (voir Module 2bis), un disque dur virtuel reste manipulable comme un **simple fichier**.

---

## 4. Les outils de gestion du stockage

### Interface graphique

La console de gestion des disques s'ouvre via `diskmgmt.msc` (ou via l'interface graphique). Il est possible d'y ajouter ce composant à une **console personnalisée** (voir Module 3 – consoles MMC).

Actions possibles dans cette console : **initialiser** les disques, les **formater**, les **étendre**, les **réduire** — en somme, administrer les volumes.

### Ligne de commande

| Outil | Type |
|---|---|
| `diskpart` | Ligne de commande CMD |
| Cmdlets PowerShell | Voir ci-dessous |

```powershell
Get-Disk                       # relever le numéro du nouveau disque, obtenir des infos sur les supports de stockage
Initialize-Disk -Number <n>    # installer une table de partition sur le disque
New-Partition -DiskNumber <n>  # créer une nouvelle partition
Format-Volume -DriveLetter <l> # formater le volume avec une lettre de lecteur
```

### Démonstration – Créer un nouveau disque (interface graphique)

1. **Partitionner** le disque.
2. **Formater** une partition pour obtenir un volume.
3. **Attribuer une lettre de lecteur** pour pouvoir l'utiliser/l'explorer.

---

## ✅ Points clés à retenir

- **MBR** : 4 partitions max, 2,2 To max, compatible BIOS uniquement.
- **GPT** : 128 partitions max, 256 To par partition, compatible UEFI + OS 64 bits uniquement.
- Une **partition étendue** permet de dépasser la limite des 4 partitions MBR via des **lecteurs logiques** — mais ceux-ci ne sont pas référencés dans le MBR.
- Un **disque dynamique** (volumes) permet d'étendre le stockage sans contrainte de contiguïté, y compris sur plusieurs disques (base du RAID).
- **NTFS** (sécurisé, ACL, EFS, 256 To) est le standard Microsoft ; **FAT32** reste le plus universellement compatible mais sans sécurité native et limité à 32 Go par volume.
- Les disques durs virtuels (**.vhd/.vhdx**) sont manipulables comme de simples fichiers, bootables, et utilisables aussi bien en VM que sur une machine physique.
- Outils de gestion : `diskmgmt.msc` (GUI), `diskpart` (CMD), ou PowerShell (`Get-Disk`, `Initialize-Disk`, `New-Partition`, `Format-Volume`).

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-4-la-gestion-du-stockage"></div>

<script type="application/json" id="quiz-cours-02-systeme-client-microsoft-module-4-la-gestion-du-stockage-data">
[
  {
    "question": "À quoi sert la table de partitionnement d'un disque dur ?",
    "options": ["Elle sert de sommaire indiquant où se trouvent les différentes partitions du disque", "Elle stocke une copie de sauvegarde de tous les fichiers du disque", "Elle chiffre automatiquement les données du disque", "Elle gère la vitesse de rotation du disque dur"],
    "correctIndex": 0,
    "explanation": "La table de partitionnement fonctionne comme un sommaire du disque, permettant à l'ordinateur de savoir où se trouvent les différentes partitions présentes sur le disque dur."
  },
  {
    "question": "Que signifie l'acronyme MBR, l'un des deux formats de table de partitionnement ?",
    "options": ["Main Backup Registry", "Master Boot Record", "Memory Block Reference", "Master Binary Record"],
    "correctIndex": 1,
    "explanation": "MBR signifie Master Boot Record ; c'est le format historique indispensable pour qu'un BIOS puisse localiser la partition contenant les fichiers du système d'exploitation à charger en RAM."
  },
  {
    "question": "Sur combien de partitions maximum le format MBR peut-il référencer un disque ?",
    "options": ["2 partitions", "8 partitions", "4 partitions", "128 partitions"],
    "correctIndex": 2,
    "explanation": "Le MBR est situé sur le premier secteur du disque, avec une taille maximale de 512 octets, et ne peut référencer que 4 partitions, sur des disques durs de 2,2 To maximum."
  },
  {
    "question": "Comment peut-on dépasser la limite de 4 partitions imposée par le MBR sur un disque de base ?",
    "options": ["En convertissant directement le disque au format NTFS", "En installant un second BIOS sur la machine", "En formatant systématiquement le disque en FAT32", "En créant une partition étendue, qui peut contenir des lecteurs logiques"],
    "correctIndex": 3,
    "explanation": "Une partition étendue agit comme un contenant capable d'accueillir des lecteurs logiques ; ces derniers stockent des données mais ne sont pas référencés directement dans le MBR, ce qui permet de dépasser la limite de 4 partitions."
  },
  {
    "question": "Comment appelle-t-on les partitions présentes sur un disque dynamique, selon la terminologie Microsoft ?",
    "options": ["Des volumes", "Des lecteurs logiques", "Des secteurs", "Des index"],
    "correctIndex": 0,
    "explanation": "Pour Microsoft, les partitions contenues sur un disque dynamique sont appelées des volumes, et peuvent être étendues à l'aide d'espace libre non contigu, y compris sur un autre disque dynamique."
  },
  {
    "question": "Quel avantage un disque dynamique offre-t-il par rapport à un disque de base pour étendre un volume ?",
    "options": ["Il impose que l'espace libre utilisé soit obligatoirement contigu", "Il permet d'utiliser de l'espace libre non contigu, y compris sur un autre disque dynamique", "Il empêche toute extension de volume après sa création", "Il nécessite un formatage complet du disque à chaque extension"],
    "correctIndex": 1,
    "explanation": "Sur un disque dynamique, un volume peut être étendu grâce à de l'espace libre non contigu, y compris disponible sur un autre disque dynamique, ce qui ouvre la voie aux technologies RAID."
  },
  {
    "question": "Est-il possible de convertir un disque de base en disque dynamique sans perdre de données ?",
    "options": ["Non, la conversion entraîne systématiquement une perte de données", "Non, cette conversion n'est techniquement pas possible", "Oui, cette conversion est possible sans perte de données", "Oui, mais uniquement si le disque est vide"],
    "correctIndex": 2,
    "explanation": "Il est possible de convertir un disque de base en disque dynamique sans problème et sans perte de données."
  },
  {
    "question": "Que signifie l'acronyme GPT, le second format de table de partitionnement ?",
    "options": ["Global Partition Type", "General Purpose Table", "Generic Partition Track", "GUID Partition Table"],
    "correctIndex": 3,
    "explanation": "GPT signifie GUID Partition Table ; ce format plus récent gomme les limites du MBR en étant sauvegardé sur plusieurs secteurs du disque plutôt que sur un seul."
  },
  {
    "question": "Quel firmware est nécessaire pour lire une table de partitionnement au format GPT ?",
    "options": ["Un firmware UEFI", "Un BIOS traditionnel", "N'importe quel firmware, quel qu'il soit", "Un firmware compatible MBR uniquement"],
    "correctIndex": 0,
    "explanation": "Contrairement au MBR, lisible par un BIOS, le format GPT ne peut être lu que par un firmware UEFI, et seuls les systèmes d'exploitation 64 bits y sont compatibles."
  },
  {
    "question": "Combien de partitions maximum le format GPT permet-il, contre 4 pour le MBR ?",
    "options": ["4 partitions", "128 partitions", "16 partitions", "512 partitions"],
    "correctIndex": 1,
    "explanation": "Le format GPT permet de créer jusqu'à 128 partitions, une limite bien supérieure aux 4 partitions maximum autorisées par le MBR."
  },
  {
    "question": "Que signifie concrètement « formater une partition » ?",
    "options": ["Supprimer définitivement la table de partitionnement du disque", "Convertir automatiquement un disque de base en disque dynamique", "Installer un système de fichiers sur cette partition", "Chiffrer l'ensemble des données de la partition"],
    "correctIndex": 2,
    "explanation": "Formater une partition consiste à y installer un système de fichiers (FS) ; ce dernier organise les données grâce à un index contenant notamment les adresses physiques de chaque fichier."
  },
  {
    "question": "Comment appelle-t-on une partition une fois qu'elle a été formatée ?",
    "options": ["Un secteur", "Une table de partitionnement", "Un lecteur logique uniquement", "Un volume"],
    "correctIndex": 3,
    "explanation": "Une fois formatée, une partition prend le nom de volume, terme également utilisé pour désigner les partitions présentes sur un disque dynamique."
  },
  {
    "question": "Grâce à quel mécanisme le système de fichiers NTFS est-il nativement sécurisé ?",
    "options": ["Les ACL (Access Control List), contenues dans l'index et définissant les autorisations d'accès aux fichiers", "Un mot de passe unique appliqué à l'ensemble du volume", "Un chiffrement matériel intégré au disque dur", "Une signature numérique du BIOS"],
    "correctIndex": 0,
    "explanation": "NTFS est nativement sécurisé grâce aux ACL (Access Control List), dont les autorisations d'accès à chaque fichier sont contenues dans l'index du système de fichiers."
  },
  {
    "question": "Quelle fonctionnalité native de NTFS permet de chiffrer les données d'un fichier ou d'un dossier ?",
    "options": ["BitLocker To Go", "EFS (Encrypting File System)", "ACL (Access Control List)", "ReFS"],
    "correctIndex": 1,
    "explanation": "NTFS permet nativement de chiffrer les données grâce à EFS (Encrypting File System), en complément de la compression et des informations de duplication qu'il peut également gérer."
  },
  {
    "question": "Quelle est une limite bien connue du système de fichiers FAT32, historique et compatible avec de nombreux systèmes d'exploitation ?",
    "options": ["Il ne peut être lu que par des systèmes d'exploitation Microsoft", "Il ne permet de créer qu'une seule partition par disque", "Il ne peut pas stocker de fichier individuel dépassant 4 Go", "Il ne peut pas être utilisé sur une clé USB"],
    "correctIndex": 2,
    "explanation": "Le FAT32 est très répandu et lisible par de nombreux systèmes d'exploitation, notamment sur une clé USB, mais il n'est pas sécurisé nativement et ne peut pas stocker de fichier individuel de plus de 4 Go."
  },
  {
    "question": "À quoi correspond ReFS, mentionné comme une évolution de NTFS ?",
    "options": ["Un format de partitionnement remplaçant le GPT", "Un outil de sauvegarde intégré à Windows 7", "Un protocole de chiffrement réseau", "Un système de fichiers plutôt réservé aux gros volumes de stockage"],
    "correctIndex": 3,
    "explanation": "ReFS est présenté comme une évolution de NTFS, plutôt destinée aux gros volumes de stockage, aux côtés d'autres systèmes de fichiers comme ext4, VMFS ou UDF."
  },
  {
    "question": "Quelles sont les extensions de fichiers utilisées par Microsoft pour ses disques durs virtuels, notamment dans Hyper-V ?",
    "options": [".vhd et .vhdx", ".iso et .img", ".wim et .esd", ".vmdk et .vdi"],
    "correctIndex": 0,
    "explanation": "Microsoft utilise les extensions .vhd et .vhdx pour ses disques durs virtuels, notamment dans sa solution de virtualisation Hyper-V ; ces disques sont manipulables comme de simples fichiers."
  },
  {
    "question": "Quelle commande graphique permet d'ouvrir la console de gestion des disques sous Windows ?",
    "options": ["diskpart.msc", "diskmgmt.msc", "compmgmt.exe", "devmgmt.msc"],
    "correctIndex": 1,
    "explanation": "La console graphique de gestion des disques s'ouvre avec la commande diskmgmt.msc, que l'on peut aussi intégrer comme composant dans une console MMC personnalisée."
  },
  {
    "question": "Quel outil en ligne de commande, distinct de PowerShell, permet également d'administrer les disques sous Windows ?",
    "options": ["netstat", "tracert", "diskpart", "ipconfig"],
    "correctIndex": 2,
    "explanation": "En complément des consoles graphiques et des cmdlets PowerShell, il est possible d'administrer les disques en ligne de commande avec l'outil diskpart."
  },
  {
    "question": "Quelle cmdlet PowerShell permet d'installer une table de partition sur un disque nouvellement détecté ?",
    "options": ["Get-Disk", "New-Partition", "Format-Volume", "Initialize-Disk"],
    "correctIndex": 3,
    "explanation": "Initialize-Disk permet d'installer une table de partition sur un disque, après avoir éventuellement utilisé Get-Disk pour relever son numéro ; New-Partition crée ensuite une partition et Format-Volume la formate pour obtenir un volume utilisable."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-4-la-gestion-du-stockage",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-4-la-gestion-du-stockage-data",
    });
  });
</script>
