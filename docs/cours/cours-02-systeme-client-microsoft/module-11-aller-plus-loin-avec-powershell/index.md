# Module 11 : Aller plus loin avec PowerShell

*Cours : [Cours 2 - Système client microsoft](../index.md)*

## 🎯 Objectif du module

Ce module approfondit l'usage de PowerShell : la redirection des flux standard (sortie et erreurs), le pipeline, le filtrage basique puis avancé des objets, et enfin le formatage des résultats affichés à l'écran.

## 🖼️ Résumé visuel

_À compléter. Tu peux utiliser un diagramme Mermaid — voir un exemple de syntaxe dans le module [L'adressage IPv4](../../cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/index.md)._

## 📖 Cours consolidé

## 1. La redirection des flux

### 1.1 Les flux standard

Une cmdlet PowerShell reçoit un ordre et produit un résultat selon trois flux standard :

| Flux | Nom | Numéro | Par défaut |
|---|---|---|---|
| **Entrée standard** | Stdin | `0` | Le clavier |
| **Sortie standard** | Stdout | `1` | L'écran |
| **Flux d'erreur** | Stderr | `2` | L'écran |

Une erreur survient par exemple lorsque la cmdlet est inconnue du système, que la syntaxe est incorrecte, ou que l'accès est refusé.

### 1.2 Rediriger la sortie standard

| Syntaxe | Effet |
|---|---|
| `Cmdlet > fichier` ou `Cmdlet 1>fichier` | Redirige le flux de sortie standard vers `fichier` (écrase/crée le fichier) |
| `Cmdlet >> fichier` ou `Cmdlet 1>>fichier` | Redirige le flux de sortie standard **à la fin** de `fichier` (append) |

📌 Si le fichier n'existe pas, le système le crée automatiquement dans le dossier spécifié ; avec `>>`, si le fichier existe déjà, le contenu est ajouté à la suite.

### 1.3 Rediriger le flux d'erreur

| Syntaxe | Effet |
|---|---|
| `Cmdlet 2> fichier.err` | Redirige le flux d'erreur vers `fichier.err` |
| `Cmdlet 2>> fichier.err` | Redirige le flux d'erreur à la fin de `fichier.err` |

📌 Pratique pour créer des fichiers de logs recensant uniquement les erreurs.

### 1.4 Rediriger sortie standard et erreurs ensemble

| Syntaxe | Effet |
|---|---|
| `Cmdlet > fichier 2>&1` | Redirige à la fois la sortie standard **et** le flux d'erreur dans `fichier` |
| `Cmdlet 2>$null` | Redirige le flux d'erreur « dans le vide » (supprime les erreurs affichées) |

### 1.5 Exemple pratique

```powershell
Get-LocalUser > c:\temp\LocalUserList.txt
```

Par défaut, `Get-LocalUser` affiche à l'écran la liste des utilisateurs de la base SAM. Avec `>` suivi d'un chemin de fichier, le résultat n'est plus affiché à l'écran mais écrit dans `c:\temp\LocalUserList.txt`. Pour vérifier le contenu du fichier :

```powershell
Get-Content c:\temp\LocalUserList.txt
```

---

## 2. Le pipeline

Le **pipeline** (`|`) transmet le résultat de la sortie standard d'une cmdlet vers l'entrée standard d'une autre cmdlet : l'ordre donné à la cmdlet suivante est en réalité le résultat de la cmdlet précédente. Ce mécanisme peut s'enchaîner sur une 3ᵉ commande, et au-delà si nécessaire.

### Exemple

```powershell
Get-NetAdapter | Select-Object Name,Status,Linkspeed
```

`Get-NetAdapter` seule affiche tous les objets « interface réseau » avec l'ensemble de leurs propriétés. En utilisant le pipe suivi de `Select-Object` (raccourci `select`), seules les propriétés `Name`, `Status` et `Linkspeed` sont conservées et affichées à l'écran — le résultat de `Get-NetAdapter` n'est jamais affiché directement, il est redirigé vers l'entrée de `select`.

---

## 3. Le filtrage basique

### 3.1 Principe

Les objets remontés par le pipeline sont parfois nombreux. Après avoir réduit les **propriétés** affichées avec `select`, il est possible d'affiner davantage en filtrant sur des **valeurs** précises de ces propriétés, à l'aide des **opérateurs de comparaison**.

📌 Une aide complète sur ces opérateurs est disponible via :

```powershell
Get-Help about_Comparison_Operators
```

### 3.2 Tableau des opérateurs de comparaison

| Comparaison | Insensible à la casse | Sensible à la casse |
|---|---|---|
| Égalité | `-eq` (*equal*) | `-ceq` |
| Inégalité | `-ne` (*not equal*) | `-cne` |
| Supérieur à | `-gt` (*greater than*) | `-cgt` |
| Supérieur ou égal à | `-ge` | `-cge` |
| Inférieur à | `-lt` (*less than*) | `-clt` |
| Inférieur ou égal à | `-le` | `-cle` |
| Contient (comparaison d'expression) | `-like` | `-clike` |
| Ne contient pas | `-notlike` | `-cnotlike` |

| Type de valeur recherchée | Opérateurs typiques |
|---|---|
| Nombre entier ou à virgule | `-eq`, `-ge`, `-lt`... |
| Chaîne de caractères | `-like`, `-notlike` |

⚠️ Le filtrage basique, via la cmdlet **`Where-Object`** (raccourci `Where` ou `?`), ne permet de filtrer que sur **une seule propriété** à la fois.

### 3.3 Exemple

```powershell
Get-NetAdapter | Select Name,Status,Linkspeed | Where Status -like up
```

Objectif : n'afficher que les cartes réseau actuellement **actives** (`Status` = `Up`). Le `|` supplémentaire redirige le résultat précédent vers `Where`, qui filtre sur la propriété `Status`. Seules les cartes avec un statut `Up` apparaissent ; celles en `Disconnected` sont exclues.

Exemple de sortie de `Get-NetAdapter` avant filtrage :

```text
Name                                   Status         LinkSpeed
----                                   ------         ---------
VMware Network Adapter VMnet1          Up             100 Mbps
Wi-Fi                                  Disconnected   0 bps
VMware Network Adapter VMnet7          Up             100 Mbps
Ethernet 2                             Disconnected   0 bps
VMware Network Adapter VMnet8          Up             426.0 Mbps
Ethernet 3                             Disconnected   0 bps
Connexion au réseau local              Disconnected   0 bps
```

---

## 4. Le filtrage avancé

### 4.1 Principe

Le filtrage avancé permet de filtrer sur **plusieurs propriétés en même temps**. On utilise toujours `Where`, mais avec une syntaxe plus riche : le paramètre `-FilterScript{}`, à l'intérieur duquel les objets filtrés sont rappelés via la variable **`$_`**.

### 4.2 Exemple

Objectif : n'afficher que les cartes réseau **actives** (`Status -like "up"`) **ET** dont le débit dépasse strictement **100 Mbits/s** (`Linkspeed -gt "100 Mbps"`).

```powershell
Get-NetAdapter | Select Name,Status,Linkspeed | Where -FilterScript {$_.status -like "up" -and $_.Linkspeed -gt "100 Mbps"}
```

Décomposition :
- `$_` rappelle les objets obtenus après le `select` (avec leurs propriétés `Name`, `Status`, `Linkspeed`) ;
- `$_.status -like "up"` filtre sur le statut ;
- `$_.Linkspeed -gt "100 Mbps"` filtre sur le débit ;
- `-and` permet de **cumuler** les deux conditions.

📌 Dès que le filtrage porte sur **2 propriétés ou plus**, la syntaxe `-FilterScript{}` du filtrage avancé devient nécessaire.

---

## 5. Le formatage

### 5.1 Principe

Par défaut, PowerShell met en forme (format/mise en page) le résultat des cmdlets avant affichage. Ce formatage par défaut peut être modifié à l'aide de cmdlets dédiées :

| Cmdlet | Raccourci | Résultat |
|---|---|---|
| `Format-List` | `fl` | Sous forme de **liste** |
| `Format-Table` | `ft` | Sous forme de **tableau** |
| `Format-Wide` | — | Met en forme les valeurs d'**une seule propriété** sélectionnée au préalable |

⚠️ Les cmdlets `Format-*` doivent impérativement être utilisées **en dernier** dans une chaîne de pipeline (après les `select`/`where` éventuels), car elles **dénaturent les objets** PowerShell, les rendant très difficilement réutilisables dans un pipeline ultérieur.

### 5.2 `Format-List`

```powershell
Get-Service | Format-List
Get-Service | Format-List -Property *
Get-Service | FL -Property Name,Status,DisplayName
```

`Get-Service` affiche par défaut la liste des services sous forme de tableau ; `Format-List` (ou `fl`) la transforme en liste. Le paramètre `-Property *` affiche l'ensemble des propriétés des objets service (équivalent à un `-select *` dans un pipeline). Le paramètre `-Property` peut aussi cibler des propriétés précises.

📌 `Get-Service | FL -Property Name,Status,DisplayName` équivaut à `Get-Service | select Name,Status,DisplayName`.

### 5.3 `Format-Table`

```powershell
Get-TimeZone | Format-Table
Get-TimeZone | Format-Table -Property *
Get-TimeZone | FT -Property StandardName,BaseUtcOffset -autosize
```

Mêmes mécanismes et mêmes paramètres que `Format-List`. Le paramètre `-autosize` dimensionne automatiquement la largeur des colonnes, en fonction des valeurs affichées et de la largeur de la console PowerShell.

### 5.4 `Format-Wide`

`Format-Wide` renvoie également un résultat sous forme de tableau, mais ne travaille que sur **une seule propriété**, préalablement sélectionnée. Il est possible de préciser le nombre de colonnes de la mise en forme, et d'utiliser le paramètre `-autosize` pour un dimensionnement automatique.


## ✅ Points clés à retenir

- PowerShell repose sur trois flux standard : entrée (`Stdin:0`, clavier par défaut), sortie (`Stdout:1`, écran par défaut) et erreur (`Stderr:2`, écran par défaut) ; ils peuvent être redirigés vers un fichier avec `>` (écrase/crée), `>>` (ajoute), `2>`/`2>>` (erreurs), `2>&1` (sortie + erreurs ensemble) ou `2>$null` (supprime les erreurs).
- Le pipeline (`|`) transmet la sortie standard d'une cmdlet vers l'entrée d'une autre, et peut s'enchaîner sur plusieurs cmdlets.
- Le filtrage basique (`Where`/`Where-Object` + opérateurs de comparaison comme `-eq`, `-gt`, `-like`...) ne porte que sur **une seule propriété** à la fois.
- Le filtrage avancé (`Where -FilterScript{ $_.propriété -opérateur valeur -and ... }`) permet de combiner plusieurs conditions sur plusieurs propriétés, en rappelant les objets via `$_`.
- Les cmdlets de formatage (`Format-List`/`fl`, `Format-Table`/`ft`, `Format-Wide`) modifient l'affichage final des résultats et doivent toujours être placées **en dernier** dans un pipeline, car elles dénaturent les objets PowerShell et empêchent leur réutilisation ultérieure.


## 📝 Fiche de révision

_À compléter._

## 🧠 Quiz — entraîne-toi

<div id="quiz-cours-02-systeme-client-microsoft-module-11-aller-plus-loin-avec-powershell"></div>

[
  {
    "question": "Quel est le numéro du flux standard correspondant à l'entrée standard (Stdin) en PowerShell ?",
    "options": ["0", "1", "2", "3"],
    "correctIndex": 0,
    "explanation": "L'entrée standard, ou Stdin, correspond au flux numéro 0 : c'est par défaut le clavier qui fournit l'ordre à la cmdlet."
  },
  {
    "question": "Par défaut, où est renvoyé le résultat d'une cmdlet (la sortie standard, Stdout:1) ?",
    "options": ["Dans un fichier journal automatique", "À l'écran", "Vers l'entrée standard d'une autre cmdlet", "Dans la base de registre"],
    "correctIndex": 1,
    "explanation": "Par défaut, le résultat d'une cmdlet (sortie standard, Stdout:1) est affiché à l'écran, tout comme les erreurs (Stderr:2) par défaut."
  },
  {
    "question": "Quel symbole permet de rediriger la sortie standard d'une cmdlet vers le début d'un fichier (en écrasant son contenu existant) ?",
    "options": ["Le double chevron >>", "Le pipe |", "Le simple chevron >", "Le symbole &"],
    "correctIndex": 2,
    "explanation": "Le simple chevron (>) permet de rediriger la sortie standard vers un fichier, en écrasant son contenu s'il existe déjà ; le système crée le fichier automatiquement s'il n'existe pas."
  },
  {
    "question": "Quelle est la différence entre le simple chevron (>) et le double chevron (>>) pour la redirection de sortie ?",
    "options": ["Il n'y a aucune différence, les deux fonctionnent de façon identique", "Le simple chevron redirige les erreurs, le double chevron redirige la sortie standard", "Le double chevron ne fonctionne qu'avec des fichiers .log", "Le simple chevron écrase le contenu du fichier, le double chevron ajoute le résultat à la fin du fichier existant"],
    "correctIndex": 3,
    "explanation": "Le simple chevron redirige la sortie standard au début d'un fichier, tandis que le double chevron ajoute le résultat à la fin d'un fichier existant, sans écraser son contenu précédent."
  },
  {
    "question": "Quel chiffre précède le chevron pour rediriger spécifiquement le flux d'erreur d'une commande vers un fichier ?",
    "options": ["2", "0", "1", "3"],
    "correctIndex": 0,
    "explanation": "Le chiffre 2 symbolise le flux d'erreur (Stderr) : on utilise donc 2> ou 2>> pour rediriger les erreurs d'une commande vers un fichier plutôt que de les voir apparaître à l'écran."
  },
  {
    "question": "Quelle variable spéciale peut être utilisée comme destination de redirection pour supprimer purement et simplement une sortie (par exemple les erreurs) ?",
    "options": ["$true", "$null", "$error", "$output"],
    "correctIndex": 1,
    "explanation": "La variable $null peut être utilisée comme fichier de destination pour supprimer une sortie : rediriger les erreurs vers $null revient à les faire disparaître (les rediriger dans le vide)."
  },
  {
    "question": "Quelle cmdlet permet de vérifier le contenu d'un fichier dans lequel on a redirigé le résultat d'une commande précédente, comme LocalUserList.txt ?",
    "options": ["Get-Item", "Get-ChildItem", "Get-Content", "Get-Process"],
    "correctIndex": 2,
    "explanation": "La cmdlet Get-Content permet de vérifier le contenu d'un fichier, par exemple pour contrôler qu'une redirection de sortie standard s'est bien déroulée."
  },
  {
    "question": "Que fait le pipeline (le symbole |) entre deux cmdlets PowerShell ?",
    "options": ["Il exécute les deux cmdlets en parallèle sans lien entre elles", "Il compare les résultats de deux cmdlets et n'affiche que les différences", "Il redirige systématiquement le résultat vers un fichier", "Il transmet le résultat de la sortie standard d'une cmdlet vers l'entrée standard de la cmdlet suivante"],
    "correctIndex": 3,
    "explanation": "Le pipeline transmet le résultat de la sortie standard d'une cmdlet vers l'entrée standard de la cmdlet suivante, l'ordre donné à cette dernière étant en fait le résultat de la précédente."
  },
  {
    "question": "Dans la commande Get-NetAdapter | select Name,Status,Linkspeed, à quoi correspond \"select\" ?",
    "options": ["Un raccourci de la cmdlet Select-Object, permettant de n'afficher que certaines propriétés", "Une commande qui supprime les objets non sélectionnés définitivement", "Un alias obligatoire du pipeline lui-même", "Une cmdlet réservée uniquement aux objets réseau"],
    "correctIndex": 0,
    "explanation": "\"select\" est un raccourci de la cmdlet Select-Object, qui permet de ne conserver et afficher que certaines propriétés des objets reçus via le pipeline, ici Name, Status et Linkspeed."
  },
  {
    "question": "Quelle cmdlet (ou son diminutif \"where\") permet de réaliser un filtrage basique, en filtrant sur la valeur d'une seule propriété ?",
    "options": ["Select-Object", "Where-Object", "Format-Table", "Get-Content"],
    "correctIndex": 1,
    "explanation": "Le filtrage basique repose sur la cmdlet Where-Object, diminutif \"where\", qui ne permet de filtrer qu'une seule propriété à la fois, par exemple Status -like up."
  },
  {
    "question": "Quels opérateurs de comparaison sont adaptés pour rechercher une valeur dans une chaîne de caractères, d'après le tableau du module ?",
    "options": ["-eq et -ne uniquement", "-gt et -lt uniquement", "-like et -notlike", "-and et -or"],
    "correctIndex": 2,
    "explanation": "Pour effectuer des recherches à l'aide de chaînes de caractères, le module indique les opérateurs -like (contient) et -notlike (ne contient pas)."
  },
  {
    "question": "Dans la commande Get-NetAdapter | select Name,Status,Linkspeed | Where Status -like up, que permet d'obtenir cette dernière partie de la commande ?",
    "options": ["Uniquement les cartes réseau dont le statut est \"Disconnected\"", "La suppression de toutes les cartes réseau du système", "Le renommage de la propriété Status en \"up\"", "Uniquement les cartes réseau dont le statut vaut \"up\" (actuellement en fonctionnement)"],
    "correctIndex": 3,
    "explanation": "La partie Where Status -like up filtre le résultat pour ne conserver que les cartes réseau dont la propriété Status correspond à \"up\", c'est-à-dire actuellement en état de fonctionnement et connectées."
  },
  {
    "question": "Dans quel cas doit-on obligatoirement utiliser la syntaxe du filtrage avancé (-FilterScript{}) plutôt que le filtrage basique ?",
    "options": ["Dès que l'on souhaite filtrer sur 2 valeurs ou plus", "Dès que l'on souhaite simplement afficher une seule propriété", "Uniquement lorsqu'on travaille avec des cmdlets de formatage", "Le filtrage avancé n'est jamais nécessaire, le filtrage basique suffit toujours"],
    "correctIndex": 0,
    "explanation": "Dès que l'on doit filtrer deux valeurs ou plus (par exemple le statut ET la vitesse de liaison), il faut utiliser la syntaxe du filtrage avancé avec le paramètre -FilterScript{}."
  },
  {
    "question": "Dans la syntaxe du filtrage avancé Where -FilterScript{$_.status -like \"up\" -and $_.Linkspeed -gt \"100 Mbps\"}, à quoi correspond la variable $_ ?",
    "options": ["Elle désigne l'utilisateur actuellement connecté au système", "Elle représente l'objet en cours de traitement dans le pipeline, avec ses propriétés", "Elle correspond au nom du fichier de sortie", "Elle désigne systématiquement la première carte réseau du système"],
    "correctIndex": 1,
    "explanation": "La variable $_ permet de rappeler l'objet en cours de traitement obtenu via le pipeline, afin d'accéder à ses propriétés (ici .status et .Linkspeed) à l'intérieur du bloc -FilterScript{}."
  },
  {
    "question": "Quel opérateur permet de combiner deux conditions de filtrage avancé qui doivent être vraies simultanément ?",
    "options": ["-or", "-not", "-and", "-xor"],
    "correctIndex": 2,
    "explanation": "L'opérateur -and permet de faire une recherche cumulée, c'est-à-dire de combiner deux conditions qui doivent toutes les deux être vraies, comme le statut up ET un linkspeed supérieur à 100 Mbps."
  },
  {
    "question": "Pourquoi les cmdlets de formatage (Format-List, Format-Table, Format-Wide) doivent-elles être utilisées en dernier dans un pipeline ?",
    "options": ["Parce qu'elles ralentissent considérablement l'exécution du script", "Parce qu'elles ne fonctionnent qu'avec la cmdlet Where-Object", "Parce qu'elles nécessitent des privilèges d'administrateur", "Parce qu'elles dénaturent les objets, les rendant très difficilement réutilisables ensuite dans un pipeline"],
    "correctIndex": 3,
    "explanation": "Les cmdlets de formatage transforment (dénaturent) les objets en vue de leur affichage, ce qui les rend ensuite très difficilement réutilisables dans la suite d'un pipeline : elles doivent donc être placées en dernier."
  },
  {
    "question": "Quelle cmdlet de formatage permet d'afficher un résultat sous forme de liste plutôt que de tableau ?",
    "options": ["Format-List", "Format-Table", "Format-Wide", "Select-Object"],
    "correctIndex": 0,
    "explanation": "Format-List (raccourci fl) permet d'obtenir un résultat sous la forme d'une liste, par opposition à Format-Table qui l'affiche sous forme de tableau."
  },
  {
    "question": "Quelle particularité possède la cmdlet Format-Wide par rapport à Format-List et Format-Table ?",
    "options": ["Elle affiche obligatoirement toutes les propriétés d'un objet", "Elle ne peut travailler qu'avec une seule propriété à la fois", "Elle ne peut être utilisée qu'avec des services système", "Elle redirige automatiquement le résultat dans un fichier"],
    "correctIndex": 1,
    "explanation": "Format-Wide se distingue en ne travaillant qu'avec une seule propriété sélectionnée au préalable, dont elle met en forme les valeurs, éventuellement sur plusieurs colonnes."
  },
  {
    "question": "À quoi sert le paramètre -autosize utilisé avec Format-Table ou Format-Wide ?",
    "options": ["Il trie automatiquement les résultats par ordre alphabétique", "Il limite le nombre de résultats affichés à l'écran", "Il dimensionne automatiquement la largeur des colonnes selon leur contenu et la console", "Il convertit automatiquement le résultat en fichier CSV"],
    "correctIndex": 2,
    "explanation": "Le paramètre -autosize permet de dimensionner automatiquement la largeur des colonnes en fonction des valeurs qu'elles contiennent et de la largeur de la console PowerShell."
  },
  {
    "question": "Quel opérateur de comparaison insensible à la casse correspond à \"égal\" (equal) dans le tableau du module ?",
    "options": ["-ne", "-ceq", "-like", "-eq"],
    "correctIndex": 3,
    "explanation": "L'opérateur -eq (equal) correspond au test d'égalité insensible à la casse ; sa version sensible à la casse équivalente est -ceq."
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRQuiz.init({
      containerId: "quiz-cours-02-systeme-client-microsoft-module-11-aller-plus-loin-avec-powershell",
      dataId: "quiz-cours-02-systeme-client-microsoft-module-11-aller-plus-loin-avec-powershell-data",
    });
  });
</script>
