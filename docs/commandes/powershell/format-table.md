# La commande `Format-Table`

`Format-Table` affiche les objets reçus via le pipe sous forme de tableau : le nom de chaque propriété devient un en-tête de colonne, et les valeurs se répartissent dans ces colonnes.

```powershell
Get-ADUser -Filter * | Format-Table -Property Enabled, Name, SAMAccountName
```

Syntaxe générale : `<commande> | Format-Table [-Property] <propriété1>, <propriété2>... [-GroupBy <propriété>] [-Wrap] [-HideTableHeaders]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Property` | Liste des propriétés à afficher en colonnes, dans l'ordre indiqué. |
| `-GroupBy <propriété>` | Regroupe les lignes du tableau selon les valeurs d'une propriété (ex. regrouper les comptes par statut actif/inactif). |
| `-Wrap` | Permet aux valeurs trop longues pour une colonne de continuer sur la ligne suivante, plutôt que d'être tronquées. |
| `-HideTableHeaders` | Masque les en-têtes de colonnes — utile avant un export vers un format qui n'en a pas besoin. |

## Combinaisons fréquentes

```powershell
Get-ADUser -Filter * -Properties * | Format-Table Name, Department, City, Enabled    # colonnes précises
Get-ADUser -Filter * | Format-Table -GroupBy Enabled                                 # regroupement par statut
Get-ADUser -Filter * -Properties * | Group-Object City | Format-Table                # regroupement par ville, via Group-Object
Get-Service | Format-Table -Property Description -Wrap                               # valeurs longues, sans troncature
Get-EventLog -LogName System | Format-Table -Wrap                                    # même principe sur un journal d'événements
```
