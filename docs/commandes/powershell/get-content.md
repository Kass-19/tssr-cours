# La commande `Get-Content`

`Get-Content` lit et affiche le contenu d'un fichier directement dans la console PowerShell. Elle prend en charge principalement les fichiers texte, CSV et CliXML — un fichier JSON ou HTML nécessite une étape de conversion avant de pouvoir être lu proprement.

```powershell
Get-Content user.csv
```

Syntaxe générale : `Get-Content [-Path] <chemin> [-Tail <n>]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Path` | Chemin du fichier à lire (peut être omis : `Get-Content user.csv` fonctionne comme `Get-Content -Path user.csv`). Accepte un chemin local ou un chemin réseau UNC (`\\serveur\partage\fichier`). |
| `-Tail <n>` | N'affiche que les `n` dernières lignes du fichier, au lieu de tout le contenu — pratique sur un gros fichier pour voir rapidement les entrées les plus récentes. |

## Combinaisons fréquentes

```powershell
Get-Content user.csv                                           # contenu brut, affiché dans la console
Get-Content user.csv -Tail 10                                  # seulement les 10 dernières lignes
Get-Content -Path "\\serveur\partage\Users.csv"                # fichier sur un partage réseau
Get-Content -Path "\\serveur\partage\Users.csv" -Tail 10
```
