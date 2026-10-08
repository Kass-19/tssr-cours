# La commande `Out-File`

`Out-File` redirige la sortie d'une commande (par défaut affichée à l'écran) vers un fichier texte. C'est l'équivalent PowerShell des chevrons de redirection (`>` en Bash). Elle s'utilise après un pipe, à la fin d'une chaîne de commandes.

```powershell
Get-Service | Out-File "service.txt"
```

Syntaxe générale : `<commande> | Out-File <chemin> [-Append] [-Width <n>]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Append` | Ajoute le résultat à la suite du contenu déjà présent dans le fichier, au lieu de l'écraser (comportement par défaut sans cette option). |
| `-Width <n>` | Nombre de caractères par ligne avant retour à la ligne automatique (80 par défaut). |

!!! question "Et pour les formats qui ne sont pas du texte brut (HTML, JSON) ?"
    `Out-File` écrit telle quelle la sortie qu'elle reçoit : pour un format comme HTML ou JSON, il faut d'abord **convertir** les objets avec une commande `ConvertTo-*` (`ConvertTo-Html`, `ConvertTo-Json`...), puis transmettre ce résultat converti à `Out-File` via un second pipe.

## Combinaisons fréquentes

```powershell
Get-Service | Out-File "service.txt"                     # écrase le fichier s'il existe déjà
Get-Service | Out-File "service.txt" -Append             # ajoute à la suite

# Conversion préalable puis export vers un fichier
Get-ADUser -Filter * | ConvertTo-Html | Out-File "Utilisateurs.html"
Get-ADComputer -Filter * | ConvertTo-Json | Out-File "Ordinateurs.json"
```
