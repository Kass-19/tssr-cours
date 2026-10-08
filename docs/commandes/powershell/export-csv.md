# La commande `Export-Csv`

`Export-Csv` enregistre les objets reçus via le pipe dans un fichier CSV, pour une utilisation future (archivage, partage, réimport avec `Import-Csv`). Le CSV est l'un des formats nativement pris en charge par PowerShell, sans conversion préalable nécessaire.

```powershell
Get-ADUser -Filter * | Export-Csv -Path "C:\Users\export.csv" -Delimiter ";"
```

Syntaxe générale : `<commande> | Export-Csv -Path <chemin> [-Delimiter <caractère>] [-NoTypeInformation] [-Append]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Path` | Chemin du fichier CSV à créer (ou à compléter avec `-Append`). |
| `-Delimiter` | Caractère séparant les valeurs (point-virgule `";"` ou virgule `","` le plus souvent). |
| `-NoTypeInformation` | Supprime la première ligne du fichier qui indiquerait normalement le type d'objet exporté (ex. `Microsoft.ActiveDirectory.Management.ADUser`) — cette ligne peut gêner certains logiciels qui lisent le CSV ensuite. |
| `-Append` | Ajoute les nouvelles lignes à la suite d'un fichier déjà existant, au lieu de l'écraser (comportement par défaut sans cette option). |

## Combinaisons fréquentes

```powershell
Get-ADUser -Filter * | Export-Csv -Path "C:\Users\export.csv" -Delimiter ";"
Get-ADUser -Filter * | Export-Csv -NoTypeInformation -Path "export.csv" -Delimiter ";"
Get-ADComputer -Filter * | Export-Csv -Path "export-computer.csv" -Delimiter ";" -NoTypeInformation -Append
```

## Voir aussi

Pour un format qui conserve la structure exacte des objets PowerShell (plutôt qu'un simple texte tabulaire), `Export-CliXml` fonctionne sur le même principe :

```powershell
Get-ADComputer -Filter * | Export-CliXml -Path "computer.xml"
```
