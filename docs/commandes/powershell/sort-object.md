# La commande `Sort-Object`

`Sort-Object` trie les objets reçus via le pipe selon une propriété donnée. Le tri est croissant par défaut : alphabétique (A → Z) pour une propriété de type texte, numérique croissant pour une propriété de type nombre.

```powershell
Get-Service | Sort-Object Status
```

Syntaxe générale : `<commande> | Sort-Object [-Property] <propriété> [-Descending]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Property` | Propriété sur laquelle trier. Peut être omis (`Sort-Object Status` fonctionne comme `Sort-Object -Property Status`). |
| `-Descending` | Inverse le sens du tri (Z → A pour du texte, décroissant pour un nombre). Sans cette option, le tri est toujours croissant. |

`Sort-Object` peut aussi être utilisée sur une propriété de type **System** : les objets conservent alors leur ordre d'origine, mais la commande les reclasse selon le critère défini.

## Combinaisons fréquentes

```powershell
Get-ChildItem C:\Windows | Sort-Object -Property Length                              # tri par taille, croissant
Get-Service | Select-Object Name, Status | Sort-Object -Property Name                 # tri alphabétique sur Name
Get-Service | Select-Object Name, Status | Sort-Object -Property Name -Descending     # Z vers A
Get-Process | Sort-Object -Property ProcessName -Descending                           # tri direct, sans Select-Object préalable
Get-Process | Select-Object Id, ProcessName | Sort-Object -Property Id -Descending    # tri numérique décroissant
```
