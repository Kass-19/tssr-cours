# La commande `Where-Object`

`Where-Object` filtre les objets reçus via le pipe en ne conservant que ceux qui répondent à une condition donnée. La condition porte sur une ou plusieurs propriétés de l'objet, testées via la variable réservée `$_` (ou son équivalent `$PSItem`), qui représente l'objet en cours de traitement dans le pipe.

```powershell
Get-Service | Where-Object { $_.Status -eq 'Running' }
```

Cette commande ne conserve que les services dont la propriété `Status` vaut `Running`.

Syntaxe générale : `<commande> | Where-Object { <condition sur $_> }`

## Opérateurs de comparaison

| Opérateur | Définition |
|---|---|
| `-eq` | Égal à |
| `-gt` | Supérieur à (*greater than*) |
| `-lt` | Inférieur à (*less than*) |
| `-like` | Correspond à un motif texte, avec `*` comme joker (ex. `'Power*'`) — nécessaire dès qu'on utilise un joker, `-eq` ne le permet pas |
| `-notlike` | Ne correspond pas au motif texte |
| `-and` | Combine deux conditions : les deux doivent être vraies |
| `-or` | Combine deux conditions : au moins une doit être vraie |

Par défaut, PowerShell n'est **pas sensible à la casse** (majuscules/minuscules traitées pareil). Pour forcer une comparaison sensible à la casse, utiliser `-ceq`, `-cgt`, `-clt` (le `c` pour *case-sensitive*).

!!! warning "Attention aux sélections précédentes"
    Si `Where-Object` est utilisé après un `Select-Object`, seules les propriétés déjà sélectionnées par ce `Select-Object` peuvent être testées. Il faut donc sélectionner une propriété avant de pouvoir la tester plus loin dans le pipe.

## Combinaisons fréquentes

```powershell
# Condition simple
Get-Service | Where-Object { $_.Status -eq 'Running' }

# Combinaison avec -and : ID compris entre deux valeurs
Get-Process | Where-Object { $_.ID -gt 1500 -and $_.ID -lt 2000 }

# Plusieurs propriétés testées en même temps
Get-Process | Where-Object { $_.Name -like 'Power*' -and $_.ID -eq 825 }
Get-Process | Where-Object { $_.Name -NotLike 'Power*' }

# Avec Active Directory (Get-ADUser)
Get-ADUser -Filter * -Properties * | Where-Object { $_.Name -like "R*" }
Get-ADUser -Filter * -Properties * | Where-Object { $_.Enabled -eq $false }

# Combinaison avec -or et parenthèses pour prioriser les conditions
Get-ADUser -Filter * -Properties * | Where-Object { ($_.Name -like "*R*" -and $_.Enabled -eq $false) -or ($_.GivenName -like "*A*") }
```
