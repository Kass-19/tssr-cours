# La commande `Import-Csv`

`Import-Csv` fait l'inverse d'`Export-Csv` : elle recrée des objets PowerShell à partir d'un fichier CSV. Elle s'enchaîne souvent avec une commande de création d'objets (par exemple `New-ADUser`), à qui elle transmet les valeurs lues via le pipe.

```powershell
Import-Csv "chemin/vers/le/fichier.csv" -Delimiter ";" | New-ADUser
```

Syntaxe générale : `Import-Csv [-Path] <chemin> [-Delimiter <caractère>]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Path` | Chemin du fichier CSV à importer (peut être omis en premier argument). |
| `-Delimiter` | Caractère qui sépare les valeurs dans le fichier — **doit être le même** que celui utilisé lors de l'export (`Export-Csv -Delimiter`), sinon les valeurs ne seront pas associées aux bonnes propriétés. |

!!! warning "Les noms de colonnes du CSV doivent correspondre aux propriétés attendues"
    La commande qui reçoit les données via le pipe (ex. `New-ADUser`) attend des noms de propriétés précis. Si les en-têtes du fichier CSV ne correspondent pas à ces noms (ex. `nom` au lieu de `Name`), la commande suivante échoue avec un message d'erreur. Dans ce cas, passer par un `Select-Object` intermédiaire avec une [propriété calculée](select-object.md#proprietes-calculees) permet de renommer la colonne avant de la transmettre.

## Combinaisons fréquentes

```powershell
Import-Csv "chemin/vers/le/fichier.csv" -Delimiter ";" | New-ADUser
Import-Csv -Path "\\chemin\vers\Users.csv" -Delimiter ";"                         # juste lire/vérifier le contenu importé
Import-Csv -Path "\\chemin\vers\Users.csv" -Delimiter ";" | New-ADUser            # importer et créer les comptes AD correspondants
```

Astuce : avant de réimporter une liste d'utilisateurs déjà existante, il faut généralement d'abord supprimer les comptes existants (ex. `Get-ADUser -Filter * | Remove-ADUser`) pour éviter les erreurs de doublons — PowerShell protège toutefois les comptes système (`Administrator`, `Guest`, `KRBTGT`) contre la suppression accidentelle.
