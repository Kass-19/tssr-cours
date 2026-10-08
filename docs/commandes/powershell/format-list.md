# La commande `Format-List`

`Format-List` affiche les propriétés des objets sous forme de **liste verticale** (une propriété par ligne, sous la forme `Propriété : Valeur`) plutôt qu'en tableau. Pratique pour une impression, un export, ou simplement quand il y a trop de propriétés pour un tableau lisible.

```powershell
Get-ADUser -Filter * | Format-List Name, Enabled, SamAccountName
```

Syntaxe générale : `<commande> | Format-List [-Property] <propriété1>, <propriété2>... [-GroupBy <propriété>]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Property` | Liste des propriétés à afficher, dans l'ordre indiqué. Peut être omis (`Format-List Name, Enabled` fonctionne comme `-Property Name, Enabled`). |
| `-GroupBy <propriété>` | Regroupe les objets selon une propriété, comme pour `Format-Table`. |

!!! warning "Après un Format-List, l'objet change de type"
    Une fois `Format-List` appliqué, le résultat n'est plus l'objet d'origine mais un objet de mise en forme : on ne peut plus lui appliquer certaines autres commandes derrière (par exemple un second filtre). Place donc `Format-List` en toute fin de chaîne de commandes.

## Combinaisons fréquentes

```powershell
Get-Service | Format-List Name, Status, DisplayName
Get-ADUser | Format-List Name, GivenName, Department, City
Get-ADUser | Format-List -GroupBy City                         # regroupement par ville
Get-ADUser | Select-Object Name, City | Format-List            # combiné à Select-Object en amont
```
