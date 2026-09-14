# Module 7 : La sauvegarde et la maintenance

*Cours : [Cours 7 - Les infrastructures réseau](../index.md)*

## 🎯 Objectif du module

Ce module couvre les opérations de maintenance courantes sur un équipement Cisco : sauvegarder et restaurer la configuration (running-config, startup-config) et l'image IOS, y compris vers/depuis un serveur distant (TFTP) ou depuis le mode de secours **ROMMON** lorsque l'IOS ne démarre plus ; réinitialiser un équipement en mode usine ; et récupérer un mot de passe perdu via le registre de configuration.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. Sauvegarde des configurations et de l'image IOS

### 1.1 Rappel : running-config et startup-config

| Configuration | Stockage | Caractéristique |
| --- | --- | --- |
| **running-config** | RAM | Configuration actuellement utilisée, **volatile** |
| **startup-config** | NVRAM | Configuration conservée après redémarrage |
| **IOS** | Flash | Système d'exploitation du routeur |

⚠️ Toute modification est directement appliquée dans la running-config. Si elle n'est pas copiée dans la startup-config, elle sera **perdue** au prochain redémarrage — qui peut survenir à un moment inattendu.

### 1.2 Utiliser la configuration non sauvegardée comme filet de sécurité

📌 Ne pas copier immédiatement une modification vers la startup-config peut volontairement servir de **système de secours** : en cas de grosse modification risquée sur la running-config (par exemple à distance, avec un risque de perdre l'accès à l'équipement), il suffit de ne pas faire la copie tant que le résultat n'est pas validé. En cas de problème, un simple redémarrage (par une personne sur site si l'accès distant est perdu) permet de revenir à la dernière configuration valide stockée en startup-config.

La règle à retenir : sauvegarder au bon moment, c'est-à-dire lorsque la configuration a été testée et validée — pas avant.

### 1.3 La commande copy

La commande `copy` va bien au-delà de `copy running-config startup-config`. Elle permet de copier une configuration vers de nombreuses destinations :

- la **running-config** vers la **startup-config**, ou inversement ;
- une configuration vers la mémoire **Flash** (pour conserver plusieurs versions, par exemple avant une grosse maintenance, afin de pouvoir revenir en arrière) ;
- une configuration vers un **serveur distant** (FTP, SCP, TFTP), ou l'inverse (récupération depuis un serveur distant).

📌 Il est possible d'**automatiser** la sauvegarde des configurations sur des équipements Cisco pour en conserver différentes versions dans le temps (non traité en détail dans ce cours).

### 1.4 Sauvegarder la running-config sur un serveur TFTP

```
copy running-config tftp:
```

Le système demande l'adresse IP du serveur TFTP, puis le nom du fichier à créer (un nom par défaut est proposé, mais il peut être modifié). Le fichier sauvegardé correspond au contenu de `show running-config`, stocké en texte sur le serveur.

📌 Il est conseillé de toujours faire figurer, dans le nom du fichier de sauvegarde : le **nom de la machine**, la **date**, et éventuellement l'**heure**. Cela facilite grandement la recherche d'une ancienne version lorsque les sauvegardes sont réalisées régulièrement.

### 1.5 Sauvegarder l'image IOS

```
show flash
copy flash: tftp:
```

`show flash` permet de connaître le nom exact du fichier IOS présent sur la mémoire Flash avant de le copier vers le serveur TFTP. 📌 Cette opération est utile pour récupérer une copie de l'IOS avant une mise à jour, ou pour la réutiliser sur un autre équipement.

## 2. Restauration des configurations et de l'image IOS

### 2.1 Restaurer une configuration depuis un serveur TFTP

```
copy tftp: running-config
```

Le système demande l'adresse IP du serveur TFTP joignable depuis le routeur, le nom du fichier à télécharger, puis une confirmation avant de charger cette configuration dans la running-config.

⚠️ Cette opération est prise en compte **immédiatement**. Si la configuration restaurée est incorrecte (route manquante, adresse IP erronée, etc.), l'accès à l'équipement peut être perdu — en particulier en cas de connexion à distance. Il faut donc être particulièrement vigilant avant de restaurer directement dans la running-config.

### 2.2 Restaurer une image IOS

```
copy tftp: flash:
```

Le système demande l'adresse IP du serveur TFTP, le fichier à télécharger, et le nom à lui donner sur la mémoire Flash. 📌 Contrairement à la restauration de configuration, cette opération **n'est pas prise en compte immédiatement** : il faut ensuite configurer manuellement l'équipement pour utiliser cette nouvelle image IOS au démarrage.

### 2.3 Récupération quand l'IOS ne démarre plus

Il arrive que l'IOS ne parvienne plus à démarrer, par exemple en cas de corruption ou de fin de vie de la mémoire Flash (dont la durée de vie n'est pas nécessairement aussi longue que celle du reste du routeur).

**Rappel du démarrage d'un routeur Cisco** : POST (*Power-On Self-Test*) → **ROMMON** (*ROM Monitor*), un mini-système de maintenance qui recherche et charge l'IOS depuis la Flash → chargement de l'IOS. Si le routeur ne parvient pas à trouver ou charger l'IOS, il **bascule en mode ROMMON**, reconnaissable à son invite :

```
rommon 1 >
```

Le **ROMMON** est un environnement minimal permettant certaines opérations de maintenance, notamment le téléchargement d'une image IOS depuis un serveur TFTP.

### 2.4 Télécharger une image IOS depuis le ROMMON

Deux commandes principales sont utiles dans ce mode :

| Commande | Rôle |
| --- | --- |
| `reset` | Redémarre le système |
| `tftpdnld` | *TFTP network download* — télécharge une image IOS depuis un serveur TFTP |

Avant de lancer `tftpdnld`, il faut renseigner plusieurs **variables d'environnement** :

```
IP_ADDRESS
IP_SUBNET_MASK
DEFAULT_GATEWAY
TFTP_SERVER
TFTP_FILE
```

⚠️ L'adresse IP configurée dans le ROMMON est utilisée sur le **premier port LAN** du routeur (le port ayant le plus petit numéro) : il faut donc veiller à connecter le routeur au réseau par ce port pour qu'il puisse joindre le serveur TFTP.

Une fois les variables renseignées, la commande `tftpdnld` lance le téléchargement — le système demande confirmation, car l'opération **efface l'ensemble de la mémoire Flash** (ce qui est normalement acceptable, puisque son contenu n'est déjà plus exploitable dans cette situation). Une fois l'opération terminée, `reset` redémarre le routeur sur un IOS valide.

Pour vérifier ou corriger les variables d'environnement :

```
set      ! affiche les variables actuellement configurées
unset    ! supprime les variables pour les reconfigurer
```

### 2.5 Récapitulatif

| Situation | Solution |
| --- | --- |
| Restaurer une configuration dans la running-config | `copy tftp: running-config` |
| Restaurer une image IOS dans la Flash | `copy tftp: flash:` |
| IOS impossible à démarrer | Passage en **ROMMON** |
| Télécharger un IOS depuis le ROMMON | `tftpdnld` |
| Afficher les variables ROMMON | `set` |
| Supprimer les variables ROMMON | `unset` |
| Redémarrer depuis le ROMMON | `reset` |

📌 Point important : la restauration d'une **configuration** et celle d'une **image IOS** ne suivent pas le même mécanisme. Une configuration se récupère directement via `copy` depuis un serveur TFTP ; une image IOS doit d'abord être placée en Flash, puis le routeur configuré pour l'utiliser au démarrage. Si l'IOS ne démarre plus du tout, le **ROMMON** constitue l'environnement de secours permettant de récupérer une nouvelle image via TFTP.

## 3. Réinitialisation en mode usine

### 3.1 Pourquoi réinitialiser un équipement ?

Il est parfois nécessaire d'effacer toute trace de configuration sur un routeur ou un commutateur — par exemple lors d'un remplacement d'équipement remis en stock, ou surtout lors d'une **revente**. 📌 La configuration d'un équipement contient en effet des mots de passe : même stockés de façon chiffrée, il est préférable de ne pas les laisser sortir de l'entreprise.

### 3.2 Réinitialiser un routeur Cisco

```
Router# erase startup-config
Router# reload
```

⚠️ Lors du `reload`, le routeur peut demander s'il faut sauvegarder la running-config dans la startup-config. **Il ne faut surtout pas accepter** : cela recréerait un fichier startup-config et annulerait l'effacement effectué.

Une fois le redémarrage terminé, l'équipement revient en mode usine ; l'apparition de la question *« Would you like to enter the initial configuration dialog? »* (l'assistant de configuration initiale, non utilisé dans ce cours) confirme que l'équipement est bien revenu à une configuration vierge.

### 3.3 Réinitialiser un commutateur Cisco

Sur un commutateur, une étape supplémentaire est nécessaire : la base de données des VLAN, stockée dans le fichier **vlan.dat** sur la mémoire Flash, est distincte de la startup-config et doit également être supprimée.

```
Switch# erase startup-config
Switch# delete flash:vlan.dat
Switch# reload
```

| Équipement | Étapes principales |
| --- | --- |
| **Routeur** | `erase startup-config` → `reload` (sans sauvegarder la running-config) |
| **Commutateur** | `erase startup-config` → `delete flash:vlan.dat` → `reload` |

⚠️ Une configuration Cisco peut contenir des informations sensibles : adresses IP, réseaux utilisés, VLAN, routes, équipements voisins, comptes et mots de passe. Il ne faut jamais laisser sortir un équipement de l'entreprise avec une configuration valide contenant ces informations.

## 4. Récupération de mot de passe

### 4.1 Le registre de configuration

Il peut arriver de perdre le mot de passe d'accès à un routeur ou un commutateur (mode enable, ou compte utilisateur). La récupération repose sur la modification du **registre de configuration**, une valeur qui détermine dans quel mode de démarrage IOS doit fonctionner.

Si l'accès à l'équipement est encore possible, la valeur actuelle du registre s'affiche avec :

```
show version
```

📌 La valeur par défaut du registre de configuration est généralement **0x2102**.

### 4.2 Deux cas de figure

| Situation | Méthode |
| --- | --- |
| **Accès encore possible** à l'équipement | Modifier directement le registre avec la commande `config-register` |
| **Plus d'accès** à l'équipement | Interrompre la séquence de démarrage pour passer en **ROMMON**, puis utiliser la commande `confreg` |

En modifiant le registre de configuration, l'IOS démarre dans un mode différent, **sans charger la configuration présente en NVRAM** : l'équipement démarre donc avec une configuration vierge, tout en gardant accès au fichier de configuration sauvegardé (récupérable et modifiable ensuite).

### 4.3 Procédure de récupération complète

1. Redémarrer le routeur.
2. Interrompre le démarrage avec **Ctrl+Break** pour passer en mode **ROMMON**.
3. Modifier le registre de configuration avec `confreg` et la valeur souhaitée.
4. Redémarrer avec `reset`.
5. Le routeur redémarre **sans charger sa configuration** : l'accès est donc possible sans mot de passe.
6. Passer en mode privilégié avec `enable`.
7. Charger la configuration sauvegardée dans la running-config : `copy startup-config running-config`.

⚠️ Attention à ne pas faire l'inverse (l'habitude prise lors d'une sauvegarde classique) : puisque la running-config est actuellement vierge, un `copy running-config startup-config` à ce stade **écraserait** la startup-config avec une configuration vide. Il faut donc bien copier de la startup-config **vers** la running-config, dans ce sens précis.

8. Modifier ce qui doit l'être (par exemple le mot de passe enable perdu).
9. Sauvegarder la nouvelle configuration : `copy running-config startup-config`.
10. Remettre le registre de configuration à sa **valeur par défaut**, afin que le prochain démarrage utilise à nouveau le mode standard (chargement normal de la startup-config).
11. Effectuer un `reload`.

Le routeur redémarre alors normalement, avec la configuration modifiée (notamment le nouveau mot de passe).

### 4.4 Récapitulatif de la procédure

| Étape | Action |
| --- | --- |
| 1 | Redémarrer le routeur |
| 2 | Interrompre le démarrage avec Ctrl+Break |
| 3 | Passer en ROMMON |
| 4 | Modifier le registre avec `confreg` |
| 5 | Redémarrer avec `reset` |
| 6 | Accéder au routeur sans charger la configuration |
| 7 | Passer en mode privilégié avec `enable` |
| 8 | Charger la startup-config dans la running-config (`copy startup-config running-config`) |
| 9 | Modifier le mot de passe |
| 10 | Sauvegarder avec `copy running-config startup-config` |
| 11 | Remettre le registre de configuration à sa valeur par défaut |
| 12 | Faire un `reload` |
| 13 | Le routeur redémarre normalement avec la nouvelle configuration |

## ✅ Points clés à retenir

- ⚠️ Toute modification non sauvegardée (`copy running-config startup-config`) est perdue au redémarrage — mais cela peut aussi être utilisé volontairement comme filet de sécurité en cas de modification risquée.
- La commande **copy** est polyvalente : elle déplace des configurations entre running-config, startup-config, Flash et serveurs distants (FTP, SCP, TFTP), dans les deux sens.
- 📌 Toujours nommer les fichiers de sauvegarde avec le nom de la machine, la date et l'heure, pour s'y retrouver facilement par la suite.
- ⚠️ `copy tftp: running-config` applique la configuration **immédiatement** — un risque de perte d'accès en cas d'erreur, notamment à distance ; `copy tftp: flash:` ne prend effet qu'après configuration manuelle du démarrage sur la nouvelle image.
- Si l'IOS ne parvient plus à démarrer, le routeur bascule en mode **ROMMON**, qui permet de télécharger une nouvelle image IOS via `tftpdnld` (après avoir renseigné les variables d'environnement IP_ADDRESS, IP_SUBNET_MASK, DEFAULT_GATEWAY, TFTP_SERVER, TFTP_FILE).
- La réinitialisation en mode usine se fait avec `erase startup-config` puis `reload` (⚠️ refuser la sauvegarde de la running-config proposée lors du reload) ; sur un **commutateur**, il faut en plus supprimer la base VLAN avec `delete flash:vlan.dat`.
- 📌 Avant de céder, prêter ou revendre un équipement, toujours réinitialiser sa configuration : elle contient des informations sensibles (adresses IP, VLAN, routes, comptes et mots de passe).
- La récupération de mot de passe passe par la modification du **registre de configuration** (valeur par défaut `0x2102`), via `config-register` (accès encore possible) ou `confreg` en ROMMON (accès perdu, interruption au démarrage avec Ctrl+Break).
- ⚠️ Lors d'une récupération de mot de passe, l'ordre de copie est inversé par rapport à l'habitude : `copy startup-config running-config` (et non l'inverse), sous peine d'écraser la configuration sauvegardée avec une configuration vide.

## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-07-les-infrastructures-reseau-module-7-la-sauvegarde-et-la-maintenance"></div>

<script type="application/json" id="quiz-cours-07-les-infrastructures-reseau-module-7-la-sauvegarde-et-la-maintenance-data">
[
  {
    "question": "Pourquoi le fichier running-config est-il perdu si on ne le sauvegarde pas avant un redémarrage ?",
    "options": [
      "Parce qu'il est stocké en NVRAM, qui s'efface à chaque démarrage",
      "Parce qu'il est automatiquement supprimé après 24 heures",
      "Parce qu'il est stocké en RAM, une mémoire volatile",
      "Parce qu'il est stocké uniquement sur un serveur distant"
    ],
    "correctIndex": 2,
    "explanation": "La RAM est par définition une mémoire volatile : tout son contenu, dont la running-config, est perdu à chaque redémarrage si elle n'a pas été copiée dans la startup-config."
  },
  {
    "question": "Quel est l'intérêt de ne pas copier immédiatement une modification risquée de running-config vers la startup-config ?",
    "options": [
      "Cela permet de conserver la startup-config comme système de secours en cas de problème après redémarrage",
      "Cela accélère le traitement des paquets sur le routeur",
      "Cela empêche toute modification future de la configuration",
      "Cela chiffre automatiquement la configuration active"
    ],
    "correctIndex": 0,
    "explanation": "Si une grosse modification pose problème, il suffit de redémarrer l'équipement pour repartir sur la dernière configuration valide sauvegardée en startup-config, sans avoir entériné la modification risquée."
  },
  {
    "question": "Quelle commande permet d'effacer la configuration de démarrage d'un équipement Cisco ?",
    "options": [
      "delete startup-config",
      "no startup-config",
      "reset startup-config",
      "erase startup-config"
    ],
    "correctIndex": 3,
    "explanation": "Cette commande supprime le fichier de configuration de démarrage stocké en NVRAM, permettant de repartir sur une configuration vierge après un reload."
  },
  {
    "question": "Quelle commande permet de sauvegarder la running-config sur un serveur TFTP ?",
    "options": [
      "copy tftp: running-config",
      "copy running-config tftp:",
      "save running-config tftp:",
      "backup running-config to tftp:"
    ],
    "correctIndex": 1,
    "explanation": "Cette commande copie la configuration active vers un serveur TFTP distant, dont l'adresse IP et le nom de fichier sont demandés ensuite par le système."
  },
  {
    "question": "Que recommande le cours d'inclure dans le nom d'un fichier de sauvegarde de configuration ?",
    "options": [
      "Uniquement un numéro de version incrémental",
      "Le mot de passe enable de l'équipement",
      "L'adresse MAC de l'interface de management",
      "Le nom de la machine, la date et éventuellement l'heure de la sauvegarde"
    ],
    "correctIndex": 3,
    "explanation": "Ces informations permettent de se retrouver facilement parmi plusieurs sauvegardes réalisées régulièrement, notamment pour identifier une ancienne version précise."
  },
  {
    "question": "Quelle commande permet de sauvegarder l'image IOS présente sur la mémoire Flash vers un serveur TFTP ?",
    "options": [
      "copy flash: tftp:",
      "copy tftp: flash:",
      "copy running-config flash:",
      "backup ios tftp:"
    ],
    "correctIndex": 0,
    "explanation": "Cette commande copie le fichier IOS trouvé sur la Flash (dont le nom peut être vérifié avec show flash) vers un serveur TFTP, pratique pour en conserver une copie avant une mise à jour."
  },
  {
    "question": "Pourquoi faut-il être particulièrement vigilant en utilisant copy tftp: running-config ?",
    "options": [
      "Parce que cette commande efface systématiquement la startup-config",
      "Parce que cette commande nécessite un redémarrage immédiat de l'équipement",
      "Parce que la configuration restaurée est prise en compte immédiatement, avec un risque de coupure d'accès si elle est incorrecte",
      "Parce que cette commande n'est disponible qu'en mode ROMMON"
    ],
    "correctIndex": 2,
    "explanation": "Si la configuration restaurée depuis le serveur TFTP manque une route ou une adresse IP essentielle, on peut perdre l'accès à l'équipement, notamment si l'on est connecté à distance."
  },
  {
    "question": "Après un copy tftp: flash: pour restaurer une image IOS, la mise à jour est-elle prise en compte immédiatement ?",
    "options": [
      "Oui, l'IOS bascule automatiquement dessus dès la copie terminée",
      "Non, il faut ensuite configurer manuellement l'équipement pour utiliser cette nouvelle image au démarrage",
      "Oui, mais seulement après un erase startup-config",
      "Non, cette commande ne fonctionne qu'en mode ROMMON"
    ],
    "correctIndex": 1,
    "explanation": "Contrairement à la restauration de la running-config, copier une image IOS sur la Flash n'active pas automatiquement son utilisation : il faut ensuite indiquer manuellement au routeur d'utiliser cette image au démarrage."
  },
  {
    "question": "Dans quelle situation un routeur Cisco bascule-t-il en mode ROMMON ?",
    "options": [
      "Quand il ne parvient pas à trouver ou charger l'IOS depuis la mémoire Flash",
      "Chaque fois qu'on tape la commande reload",
      "Dès qu'une ACL bloque le trafic administratif",
      "Quand la startup-config est absente mais que l'IOS démarre normalement"
    ],
    "correctIndex": 0,
    "explanation": "Après le POST, le ROMMON tente normalement de charger l'IOS présent en Flash ; s'il n'y parvient pas (Flash corrompue ou vide, par exemple), le routeur reste en mode ROMMON, un environnement minimal de maintenance."
  },
  {
    "question": "À quoi sert la commande tftpdnld en mode ROMMON ?",
    "options": [
      "À afficher la configuration de démarrage actuelle",
      "À redémarrer directement l'équipement sans autre action",
      "À chiffrer les mots de passe stockés dans la NVRAM",
      "À télécharger une image IOS valide depuis un serveur TFTP"
    ],
    "correctIndex": 3,
    "explanation": "tftpdnld (TFTP network download) permet, depuis l'environnement minimal ROMMON, de récupérer une image IOS fonctionnelle depuis un serveur TFTP pour la réinstaller sur la Flash."
  },
  {
    "question": "Avant de lancer tftpdnld, quelles informations faut-il renseigner dans les variables d'environnement du ROMMON ?",
    "options": [
      "Uniquement le nom d'utilisateur et le mot de passe administrateur",
      "L'adresse IP du routeur, le masque, la passerelle, l'adresse du serveur TFTP et le nom du fichier IOS",
      "Le numéro de série du routeur et sa date de fabrication",
      "L'adresse MAC du serveur TFTP uniquement"
    ],
    "correctIndex": 1,
    "explanation": "Ces variables (IP_ADDRESS, IP_SUBNET_MASK, DEFAULT_GATEWAY, TFTP_SERVER, TFTP_FILE) fournissent au ROMMON tout ce dont il a besoin pour joindre le serveur TFTP et récupérer le bon fichier."
  },
  {
    "question": "Sur quel port du routeur s'applique l'adresse IP configurée dans le ROMMON pour le téléchargement TFTP ?",
    "options": [
      "Le port console utilisé pour la connexion",
      "Tous les ports LAN simultanément",
      "Le premier port LAN du routeur (le plus petit numéro)",
      "Le port configuré en dernier avant la panne"
    ],
    "correctIndex": 2,
    "explanation": "Il faut donc veiller à connecter le câble réseau vers le serveur TFTP sur ce premier port LAN pour que le téléchargement fonctionne."
  },
  {
    "question": "Que permettent respectivement les commandes set et unset en mode ROMMON ?",
    "options": [
      "set affiche les variables d'environnement configurées, unset les supprime",
      "set démarre le téléchargement, unset l'annule",
      "set redémarre le routeur, unset l'éteint",
      "set active le mode privilégié, unset le désactive"
    ],
    "correctIndex": 0,
    "explanation": "set permet de vérifier les valeurs actuellement configurées dans les variables d'environnement du ROMMON, et unset permet de les effacer pour les ressaisir en cas d'erreur."
  },
  {
    "question": "Lors d'un reload après un erase startup-config sur un routeur, quel piège faut-il éviter ?",
    "options": [
      "Répondre non à la question sur le dialogue de configuration initiale",
      "Éteindre physiquement l'équipement pendant le reload",
      "Se connecter en SSH pendant le redémarrage",
      "Accepter la sauvegarde de la running-config vers la startup-config lorsqu'elle est proposée"
    ],
    "correctIndex": 3,
    "explanation": "Si l'on accepte cette sauvegarde proposée par le système, un nouveau fichier startup-config est recréé et l'effacement effectué juste avant n'aura servi à rien."
  },
  {
    "question": "Sur un commutateur, quelle étape supplémentaire faut-il réaliser, en plus de erase startup-config et reload, pour une réinitialisation d'usine complète ?",
    "options": [
      "Réinstaller entièrement l'IOS depuis le ROMMON",
      "Supprimer le fichier vlan.dat avec delete flash:vlan.dat",
      "Désactiver le protocole CDP",
      "Changer l'adresse MAC de tous les ports"
    ],
    "correctIndex": 1,
    "explanation": "Sur un commutateur, la base de données des VLAN est stockée dans un fichier séparé de la startup-config (vlan.dat) ; il faut donc aussi le supprimer pour repartir sur une configuration réellement vierge."
  },
  {
    "question": "Pourquoi est-il important d'effacer la configuration d'un équipement Cisco avant de le revendre ou de le prêter ?",
    "options": [
      "Parce que la configuration ralentit le démarrage de l'équipement",
      "Parce que la garantie du fabricant l'exige systématiquement",
      "Parce qu'elle peut contenir des informations sensibles comme les adresses IP, les VLAN, les routes et des comptes/mots de passe",
      "Parce que cela libère automatiquement de la mémoire Flash supplémentaire"
    ],
    "correctIndex": 2,
    "explanation": "Même chiffrés, les mots de passe et l'ensemble des informations d'infrastructure présentes dans une configuration peuvent donner des indications précieuses à un attaquant potentiel."
  },
  {
    "question": "Que représente le registre de configuration (config-register) d'un routeur Cisco ?",
    "options": [
      "L'adresse IP de gestion du routeur",
      "La liste des utilisateurs autorisés à se connecter",
      "Le numéro de version de l'IOS installé",
      "Une valeur qui détermine le mode de démarrage utilisé par IOS"
    ],
    "correctIndex": 3,
    "explanation": "Le registre de configuration, visible avec show version (valeur par défaut généralement 0x2102), indique à IOS comment démarrer, notamment s'il doit charger ou non la configuration présente en NVRAM."
  },
  {
    "question": "Pour interrompre la séquence de démarrage d'un routeur et passer en ROMMON lors d'une récupération de mot de passe, quelle combinaison de touches utilise-t-on ?",
    "options": [
      "Ctrl+Alt+Suppr",
      "Ctrl+Break",
      "Ctrl+C",
      "Échap suivi de Entrée"
    ],
    "correctIndex": 1,
    "explanation": "Cette combinaison, envoyée pendant le démarrage, interrompt la séquence normale et fait basculer le routeur en mode ROMMON, permettant de modifier le registre de configuration."
  },
  {
    "question": "Lors d'une procédure de récupération de mot de passe, une fois de retour dans IOS avec une configuration vierge, quelle commande faut-il utiliser pour charger la configuration sauvegardée ?",
    "options": [
      "copy running-config startup-config",
      "erase startup-config",
      "copy startup-config running-config",
      "reload"
    ],
    "correctIndex": 2,
    "explanation": "Comme la running-config est alors vide, il faut charger la startup-config existante dans la running-config (et surtout pas l'inverse, qui écraserait la sauvegarde avec une configuration vide) afin de pouvoir modifier le mot de passe tout en conservant le reste de la configuration."
  },
  {
    "question": "Après avoir modifié le mot de passe et sauvegardé la nouvelle configuration lors d'une procédure de récupération, que faut-il impérativement faire avant le reload final ?",
    "options": [
      "Remettre le registre de configuration à sa valeur par défaut",
      "Supprimer à nouveau la startup-config",
      "Réactiver le mode ROMMON en permanence",
      "Désactiver toutes les interfaces du routeur"
    ],
    "correctIndex": 0,
    "explanation": "Sans cela, le routeur redémarrerait de nouveau dans un mode qui ne charge pas la configuration NVRAM ; il faut donc restaurer le registre par défaut pour que le prochain démarrage soit normal et charge bien la startup-config mise à jour."
  }
]
</script>


<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-07-les-infrastructures-reseau-module-7-la-sauvegarde-et-la-maintenance",
      dataId: "quiz-cours-07-les-infrastructures-reseau-module-7-la-sauvegarde-et-la-maintenance-data",
    });
  });
</script>
