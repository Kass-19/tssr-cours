# La commande `Measure-Object`

`Measure-Object` compte le nombre d'objets reçus via le pipe, et peut aussi calculer des statistiques (somme, moyenne, minimum, maximum) sur une propriété numérique. Elle se place généralement à la fin d'une chaîne de commandes, après un tri ou un filtrage.

```powershell
Get-Process | Measure-Object
```

Cette commande renvoie le nombre de processus actifs sur le système (propriété `Count` du résultat).

Syntaxe générale : `<commande> | Measure-Object [-Property <propriété>] [-Average] [-Sum] [-Minimum] [-Maximum]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-Property <propriété>` | Propriété numérique sur laquelle effectuer les calculs. **Obligatoire** pour tout calcul autre que le simple comptage — et cette propriété doit être de type `Integer` (un nombre), sinon la commande ne peut pas calculer dessus. |
| `-Average` | Calcule la moyenne des valeurs de la propriété. |
| `-Sum` | Calcule la somme des valeurs de la propriété. |
| `-Minimum` | Renvoie la valeur minimale. |
| `-Maximum` | Renvoie la valeur maximale. |

Sans aucune de ces options (et sans `-Property`), `Measure-Object` se contente de compter le nombre d'objets reçus — c'est son comportement par défaut.

## Combinaisons fréquentes

```powershell
Get-Process | Measure-Object                                              # compte le nombre de processus
Get-ChildItem -File | Measure-Object -Property Length                      # statistiques de base sur la taille des fichiers
Get-ChildItem -File | Measure-Object -Property Length -Average             # taille moyenne des fichiers

# Stocker le résultat dans une variable pour le réutiliser
$countProcesses = Get-Process | Measure-Object
$countProcesses.Count                                                      # affiche uniquement le nombre

$stats = Get-Process | Measure-Object -Property ID -Sum -Minimum -Maximum
$fileStats = Get-ChildItem C:\Windows | Measure-Object -Property Length -Average -Minimum -Maximum -Sum
```

Pour découvrir toutes les options disponibles : `Get-Help Measure-Object`.
