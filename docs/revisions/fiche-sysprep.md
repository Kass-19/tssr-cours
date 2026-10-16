# Sysprep – Pas-à-pas détaillé

---

## 0. Rappel : à quoi sert Sysprep ?

| Notion | Explication |
|---|---|
| **Master / image de référence** | Un Windows installé, à jour, avec les pilotes et les logiciels de l'entreprise, prêt à être cloné. |
| **Sysprep** (*System Preparation Tool*) | Outil natif de Windows qui retire du master tout ce qui le rend **unique** (SID, nom du PC, journaux, infos matérielles, etc.). |
| **SID** (*Security Identifier*) | Identifiant unique de la machine. Deux PC avec le même SID posent problème, notamment pour rejoindre un **domaine AD**. |
| **Généraliser** (`/generalize`) | C'est l'option qui fait régénérer un nouveau SID au prochain démarrage. **Sans elle, le sysprep ne sert à rien pour du clonage.** |
| **OOBE** (`/oobe`) | *Out-of-Box Experience* : l'assistant de premier démarrage (langue, clavier, compte…), comme sur un PC neuf. |
| **Mode Audit** (`/audit`) | Mode de démarrage spécial, connecté avec le compte Administrateur intégré, pour personnaliser le master **sans créer de compte utilisateur**. |

Emplacement de l'outil : `C:\Windows\System32\Sysprep\sysprep.exe`
Chaque version de Windows a son propre Sysprep : on utilise toujours celui **présent sur le système à préparer**.

---

## Vue d'ensemble du processus

```
Installation de Windows
        │
        ▼
(Option recommandée) Ctrl+Maj+F3 à l'OOBE ──► Mode Audit
        │
        ▼
Configuration du master : mises à jour, pilotes, logiciels
        │
        ▼
Nettoyage : comptes, profils, apps Store, BitLocker…
        │
        ▼
Sysprep  /generalize /oobe /shutdown
        │
        ▼
PC éteint ──► NE PAS le redémarrer sur son Windows
        │
        ▼
Capture de l'image (WinPE + DISM, serveur de déploiement, ou clone VMware)
        │
        ▼
Déploiement sur les postes cibles ──► OOBE + nouveau SID sur chacun
```

---

## Étape 1 – Installer Windows sur une machine « standard »

1. Installe Windows sur un poste (ou une VM) dont la configuration matérielle est **la plus représentative du parc**.
2. **Pendant l'installation, déconnecte le réseau** si possible.
   - *Pourquoi ?* Sans Internet, le Microsoft Store ne met pas à jour automatiquement les applications intégrées. Or ce sont ces mises à jour d'apps « par utilisateur » qui font le plus souvent échouer Sysprep (voir étape 5).
3. Ne joins **pas** le master à un domaine AD. La jonction au domaine se fera sur chaque poste cloné, après le déploiement.

> 💡 **Sur VMware Workstation** : avant toute chose, prends un **snapshot** nommé par exemple `00 - Install propre`. Tu pourras revenir en arrière à n'importe quel moment.

---

## Étape 2 – Entrer en mode Audit (recommandé)

Le mode Audit permet de préparer le master **sans créer de compte utilisateur personnel**, ce qui évite d'avoir à le supprimer ensuite.

### Méthode A – Directement depuis l'OOBE (le plus propre)
1. Quand l'assistant de premier démarrage apparaît (choix de la région / du clavier), appuie sur **`Ctrl + Maj + F3`**.
2. Windows redémarre et ouvre une session automatiquement avec le compte **Administrateur intégré**.
3. Une fenêtre **Sysprep** s'ouvre toute seule : **ferme-la** (bouton Annuler ou croix) pour l'instant, tu la relanceras à la fin.

### Méthode B – Depuis un Windows déjà configuré
Ouvre une invite de commandes **en tant qu'administrateur** :

```cmd
C:\Windows\System32\Sysprep\sysprep.exe /audit /reboot
```

> ℹ️ Tant que tu n'as pas lancé le sysprep final avec `/oobe`, chaque redémarrage te ramène en mode Audit. C'est normal : tu peux redémarrer autant que tu veux pour installer des mises à jour ou des logiciels.

---

## Étape 3 – Configurer le master

Dans le mode Audit (ou sur ta session admin) :

1. **Windows Update** : installe toutes les mises à jour et **redémarre jusqu'à ce qu'il n'y ait plus rien en attente**.
   - *Pourquoi ?* Une mise à jour en attente de redémarrage peut bloquer Sysprep.
2. **Pilotes** : installe les pilotes du matériel standard du parc.
3. **Logiciels** de base et métier (dans les versions validées par la DSI) : suite bureautique, navigateur, antivirus, client VPN, etc.
4. Paramètres système communs (fond d'écran, options d'alimentation, etc.).

> ⚠️ **Ce qui ne survit pas à Sysprep** : les pilotes installés manuellement sont retirés par défaut lors de la généralisation (voir étape 5.4 pour les conserver).

---

## Étape 4 – Points de vigilance avant le Sysprep

### 4.1 Comptes utilisateurs locaux
Sysprep **ne supprime pas** les comptes de la base SAM. Seul le compte **Administrateur intégré** est réinitialisé.

Si tu as créé un compte perso pendant l'installation (sans passer par le mode Audit) :

1. Active le compte Administrateur intégré :
   ```cmd
   net user Administrateur /active:yes
   net user Administrateur *
   ```
   (la 2ᵉ commande te demande de définir un mot de passe)
2. Déconnecte-toi, reconnecte-toi avec **Administrateur**.
3. Supprime le compte perso :
   ```cmd
   net user NomDuCompte /delete
   ```
4. Supprime son **profil** : `Win + R` → `sysdm.cpl` → onglet **Paramètres système avancés** → section **Profils des utilisateurs** → **Paramètres** → sélectionne le profil → **Supprimer**.

> Les comptes locaux de service (antivirus, sauvegarde…) peuvent être conservés si l'entreprise en a besoin.

### 4.2 Applications du Microsoft Store
Les apps Store sont liées au **profil d'un utilisateur**. Si une app a été installée ou mise à jour pour un utilisateur mais n'est pas « provisionnée » pour tous, **Sysprep échoue**. → Voir la section *Dépannage*.

### 4.3 BitLocker / chiffrement de l'appareil (Windows 11)
Windows 11 active parfois automatiquement le chiffrement de l'appareil (notamment si la VM a un TPM virtuel). Sysprep refuse de généraliser un disque chiffré.

Vérifier :
```cmd
manage-bde -status C:
```
Si la protection est active, désactive-la et **attends la fin du déchiffrement** :
```cmd
manage-bde -off C:
```

### 4.4 Windows Server
Certains **rôles serveur** ne sont pas compatibles avec Sysprep (ex. : un serveur promu contrôleur de domaine AD DS ne doit pas être sysprepé). La bonne pratique : faire le master Windows Server **avant** d'installer les rôles, puis installer les rôles sur chaque serveur cloné.

---

## Étape 5 – Lancer Sysprep

> ⚠️ Une seule instance de Sysprep peut tourner à la fois. Si la fenêtre graphique est ouverte (cas du mode Audit), ferme-la avant d'utiliser la ligne de commande.

> 💡 **Sur VMware** : prends un snapshot `01 - Avant sysprep`. Si le sysprep échoue ou si la VM redémarre par erreur, tu reviens ici en 10 secondes.

### 5.1 Méthode graphique
1. `Win + R` → tape `sysprep` → **Entrée** : l'explorateur s'ouvre dans `C:\Windows\System32\Sysprep`.
2. Double-clique sur **sysprep.exe** (il demande les droits administrateur).
3. Renseigne la fenêtre :

| Champ | Valeur à choisir | Pourquoi |
|---|---|---|
| **Action de nettoyage du système** | `Entrer dans le mode OOBE (Out-of-Box Experience)` | Au prochain démarrage, le PC cloné affichera l'assistant de premier démarrage. |
| **Généraliser** | ☑ **Cochée** | Indispensable : régénère le SID et supprime les infos spécifiques à la machine. |
| **Options d'arrêt** | `Arrêter` | Le PC doit être **éteint** pour être capturé « à froid ». |

4. Clique sur **OK**. Sysprep travaille quelques minutes, puis **la machine s'éteint**.

### 5.2 Méthode en ligne de commande (plus précise)
Invite de commandes **en tant qu'administrateur** :

```cmd
cd C:\Windows\System32\Sysprep
sysprep.exe /generalize /oobe /shutdown
```

| Option | Rôle |
|---|---|
| `/generalize` | Supprime les infos uniques (SID, etc.). Nouveau SID au prochain démarrage. |
| `/oobe` | Démarre sur l'assistant de premier démarrage au prochain boot. |
| `/shutdown` | Éteint la machine à la fin (à préférer à `/reboot` pour une capture). |
| `/audit` | Redémarre en mode Audit au lieu de l'OOBE (pour continuer à préparer). |
| `/reboot` | Redémarre au lieu d'éteindre. |
| `/quiet` | Pas de fenêtre ni de message de confirmation (utile en script). |
| `/unattend:<fichier.xml>` | Applique un fichier de réponses (automatise l'OOBE, conserve les pilotes…). |
| `/mode:vm` | Généralisation optimisée pour une VM qui sera redéployée **sur le même hyperviseur / même matériel virtuel**. Plus rapide au 1er démarrage. |

### 5.3 Spécial VM (VMware Workstation)
Si l'image ne sera déployée **que** sous forme de VM VMware :
```cmd
sysprep.exe /generalize /oobe /shutdown /mode:vm
```

### 5.4 Conserver les pilotes installés
Par défaut, la généralisation retire les pilotes installés manuellement. Deux solutions :

- **Ajouter les pilotes au magasin de pilotes Windows** (ils seront réinstallés automatiquement) :
  ```cmd
  pnputil /add-driver C:\Pilotes\*.inf /subdirs /install
  ```
- **Utiliser le paramètre `PersistAllDeviceInstalls`**. Attention, ce n'est **pas** une option de la commande `sysprep.exe` : c'est un paramètre qu'on met dans un **fichier de réponses** (`unattend.xml`), puis on appelle `sysprep /generalize /oobe /shutdown /unattend:C:\unattend.xml`. Extrait du fichier :
  ```xml
  <settings pass="generalize">
    <component name="Microsoft-Windows-PnpSysprep" processorArchitecture="amd64"
               publicKeyToken="31bf3856ad364e35" language="neutral" versionScope="nonSxS">
      <PersistAllDeviceInstalls>true</PersistAllDeviceInstalls>
    </component>
  </settings>
  ```
  (Le fichier se génère proprement avec l'outil **Windows SIM**, inclus dans le Windows ADK.)

---

## Étape 6 – Après le Sysprep : NE PAS redémarrer le master !

La machine est éteinte et généralisée. **Si elle redémarre sur son propre Windows**, elle passe l'OOBE, génère son SID et redevient une machine « normale » : il faut **refaire tout le sysprep**.

> 💡 **Sur VMware** : prends immédiatement un snapshot `02 - Après sysprep (éteinte)`. C'est **lui** qui sert de base de clonage. Même si tu démarres la VM par erreur, tu reviens sur ce snapshot.

---

## Étape 7 – Capturer l'image

Pour capturer sans redémarrer le Windows du master, on démarre la machine sur **un autre OS**.

### Option A – Serveur de déploiement (boot PXE)
La machine démarre via sa carte réseau (PXE), contacte le serveur de déploiement (ex. : WDS), qui capture le système et le stocke sous forme d'image **`.wim`** (*Windows Imaging Format*). Idéal pour déployer en masse.

### Option B – Support WinPE + DISM (sans serveur)
1. Démarre le master sur une clé USB / ISO **WinPE**.
2. Repère les lettres de lecteur (elles changent souvent sous WinPE) :
   ```cmd
   diskpart
   list volume
   exit
   ```
3. Capture la partition Windows vers un disque externe ou un partage :
   ```cmd
   dism /Capture-Image /ImageFile:D:\Images\Master-Win11.wim /CaptureDir:C:\ /Name:"Master Windows 11" /Compress:max
   ```
   - `/CaptureDir` : partition Windows du master (vérifie la lettre !)
   - `/ImageFile` : destination du fichier `.wim` (pas sur le disque capturé)
4. L'image peut ensuite être **mise à jour hors ligne** avec DISM (ajout de KB, pilotes, etc.) sans repasser par un master.

### Option C – Homelab VMware Workstation (le plus simple pour s'entraîner)
Pas besoin de WinPE : la VM éteinte après sysprep **est** ton image.
1. **Clone** : clic droit sur la VM → **Gérer** → **Cloner** → source : le snapshot `02 - Après sysprep` → **Clone complet** (indépendant) ou **Clone lié** (léger, mais dépend de la VM d'origine).
2. **Mode modèle** (pour protéger le master) : **VM** → **Settings** → onglet **Options** → **Advanced** → cocher **Enable Template mode (to be used for cloning)**. La VM ne peut alors plus être supprimée par erreur et sert uniquement de source de clones.

---

## Étape 8 – Déploiement et vérification

### Déploiement manuel avec WinPE + DISM (aperçu)
Sur le poste cible démarré sous WinPE :
1. Préparer le disque avec `diskpart` (créer les partitions système et Windows, leur attribuer des lettres, par ex. `S:` et `W:`).
2. Appliquer l'image :
   ```cmd
   dism /Apply-Image /ImageFile:D:\Images\Master-Win11.wim /Index:1 /ApplyDir:W:\
   ```
3. Rendre le disque démarrable :
   ```cmd
   bcdboot W:\Windows /s S: /f ALL
   ```

### Au premier démarrage du poste cloné
- L'**OOBE** s'affiche (langue, clavier, nom du PC, compte…).
- Un **nouveau SID** est généré.
- Les logiciels installés sur le master sont présents.

### Vérifier que le SID est bien unique
Sur deux clones, compare le résultat de :
```cmd
whoami /user
```
Pour un compte **local**, le SID ressemble à `S-1-5-21-XXXXXXXXXX-XXXXXXXXXX-XXXXXXXXXX-1001`. La partie `S-1-5-21-…-…-…` (sans le dernier nombre) est le **SID de la machine** : elle doit être **différente** sur chaque clone.

---

## Dépannage

### Où sont les journaux ?
```
C:\Windows\System32\Sysprep\Panther\setupact.log   ← déroulement complet
C:\Windows\System32\Sysprep\Panther\setuperr.log   ← uniquement les erreurs
```
Ouvre `setuperr.log` en premier : il donne directement la cause.

### Erreur « Sysprep n'a pas pu valider votre installation de Windows »
**Cause la plus fréquente** : une app du Store installée pour un utilisateur mais pas provisionnée pour tous. Dans `setupact.log`, tu verras une ligne du type :
```
SYSPRP Package Microsoft.XXXXX_1.2.3.0_x64__8wekyb3d8bbwe was installed for a user, but not provisioned for all users.
```
**Correction** (PowerShell en administrateur) – remplace `Microsoft.XXXXX` par le nom lu dans le journal :
```powershell
Get-AppxPackage -AllUsers -Name "Microsoft.XXXXX*" | Remove-AppxPackage -AllUsers
Get-AppxProvisionedPackage -Online | Where-Object DisplayName -like "Microsoft.XXXXX*" | Remove-AppxProvisionedPackage -Online
```
Puis relance Sysprep (il peut y avoir plusieurs apps en cause : recommence jusqu'à ce que ça passe).

### Erreur liée à BitLocker
→ `manage-bde -off C:`, attendre la fin du déchiffrement (`manage-bde -status C:`), relancer Sysprep.

### Erreur à cause d'une mise à jour en attente
→ Redémarrer, finir Windows Update, relancer Sysprep.

### Nombre de sysprep limité
Une même image Windows ne peut être généralisée qu'un nombre limité de fois (jusqu'à 1001 sur les versions récentes). D'où l'intérêt de **repartir d'un snapshot « avant sysprep »** plutôt que de sysprepper encore et encore la même installation.

---

## Récap express

| # | Action | Commande / astuce clé |
|---|---|---|
| 1 | Installer Windows (réseau coupé, pas de domaine) | Snapshot `00` |
| 2 | Passer en mode Audit | `Ctrl + Maj + F3` à l'OOBE |
| 3 | MAJ, pilotes, logiciels | Redémarrer jusqu'à plus rien en attente |
| 4 | Nettoyer : comptes, profils, apps Store, BitLocker | `net user`, `sysdm.cpl`, `manage-bde` |
| 5 | Lancer Sysprep | `sysprep /generalize /oobe /shutdown` (+ `/mode:vm` si VM) |
| 6 | Ne **pas** redémarrer | Snapshot `02` |
| 7 | Capturer | WinPE + `dism /Capture-Image` → `.wim` |
| 8 | Déployer et vérifier le SID | `dism /Apply-Image`, `bcdboot`, `whoami /user` |
| 🛠️ | En cas d'échec | `C:\Windows\System32\Sysprep\Panther\setuperr.log` |
