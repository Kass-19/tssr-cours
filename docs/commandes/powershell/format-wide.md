# La commande `Format-Wide`

`Format-Wide` répartit la valeur d'**une seule propriété** (généralement `Name`) sur plusieurs colonnes, à la différence de `Format-Table` qui affiche plusieurs propriétés mais sur une seule colonne chacune. Pratique pour afficher une longue liste de noms de façon compacte.

```powershell
Get-Service | Format-Wide -Column 10
```

Syntaxe générale : `<commande> | Format-Wide [-Property <propriété>] [-Column <n> | -Autosize]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Property <propriété>` | Propriété à afficher (par défaut `Name` si non précisée). |
| `-Column <n>` | Nombre de colonnes à utiliser pour répartir les valeurs. |
| `-Autosize` | Laisse PowerShell déterminer automatiquement le nombre de colonnes optimal, selon la largeur de la console et la longueur des valeurs. |

!!! warning "Attention à la troncature"
    Avec un nombre de colonnes imposé (`-Column`) trop élevé, les valeurs peuvent être tronquées faute de place — `-Autosize` évite ce problème en adaptant automatiquement le nombre de colonnes.

## Combinaisons fréquentes

```powershell
Get-Service | Format-Wide -Autosize                                   # nombre de colonnes déterminé automatiquement
Get-ADUser -Filter * | Format-Wide -Autosize
Get-ADUser -Filter * | Format-Wide -Column 3                          # nombre de colonnes imposé
Get-ADUser -Filter * | Format-Wide -Property GivenName -Column 5      # sur une autre propriété que Name
```
