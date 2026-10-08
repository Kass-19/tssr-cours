# La commande `Select-Object`

`Select-Object` (raccourci possible : `Select`) sélectionne, parmi les objets reçus via le pipe, uniquement les propriétés que l'on souhaite afficher. C'est la commande la plus courante après un pipe, pour simplifier une sortie trop chargée.

```powershell
Get-Process | Select-Object Name, CPU
```

Dans cet exemple, seules les propriétés `Name` et `CPU` des processus en cours sont conservées.

Syntaxe générale : `<commande> | Select-Object [-Property] <propriété1>, <propriété2>... [-First n | -Last n | -Unique] [-ExpandProperty <propriété>]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Property` | Propriété(s) à conserver, séparées par des virgules. L'ordre indiqué est l'ordre d'affichage. Peut être omis (`Select Name, CPU` fonctionne aussi bien que `Select -Property Name, CPU`). |
| `-First n` | Ne conserve que les `n` premiers objets du résultat. |
| `-Last n` | Ne conserve que les `n` derniers objets du résultat. |
| `-Unique` | Supprime les doublons : si plusieurs objets ont la même valeur pour la propriété sélectionnée, un seul est conservé. |
| `-ExpandProperty <propriété>` | Affiche uniquement les valeurs de la propriété indiquée, sans l'en-tête habituel. |

## Combinaisons fréquentes

```powershell
Get-Service | Select-Object -Property Name, Status   # deux propriétés précises
Get-Service | Select-Object -First 5                 # les 5 premiers résultats
Get-Service | Select-Object -Last 5                   # les 5 derniers résultats
Get-Process | Select-Object -Unique ProcessName | Measure   # noms de processus uniques, puis comptage
Get-ADUser -Filter * -Properties * | Select-Object Name, Department, City   # propriétés "cachées" d'Active Directory, à condition de les avoir demandées avec -Properties *
```

## Propriétés calculées

`Select-Object` permet aussi de créer une **propriété calculée** : une nouvelle propriété, avec le nom de son choix, dont la valeur est calculée à partir d'une propriété existante. Pratique pour traduire un nom de propriété, ou convertir une unité.

Syntaxe : `@{n='NomAffiché'; e={ expression utilisant $_ }}` (`n` = *name*, `e` = *expression*).

```powershell
# Convertit la taille (en octets) en mégaoctets, avec 2 décimales
Get-ChildItem -File | Select-Object Name, @{n='Taille'; e={ '{0:N2}' -f ($_.length / 1MB) }}

# Équivalent avec la fonction d'arrondi [math]::round
Get-ChildItem -File | Select-Object Name, @{n='Taille'; e={ [math]::round($_.length / 1MB, 2) }}

# Deux propriétés calculées sur le même objet
Get-Volume | Select-Object DriveLetter, @{n='Taille (GB)'; e={ '{0:N2}' -f ($_.Size / 1GB) }}, @{n='Espace libre (GB)'; e={ '{0:N2}' -f ($_.SizeRemaining / 1GB) }}
```

À noter : après un `Where-Object`, on ne peut tester que des propriétés déjà sélectionnées par un `Select-Object` précédent — penser à sélectionner la propriété avant de la tester plus loin dans le pipe.
