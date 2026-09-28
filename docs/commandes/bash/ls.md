# La commande `ls`

`ls` (pour *list*) affiche le contenu d'un répertoire : les fichiers et sous-dossiers qu'il contient. Sans argument, elle liste le répertoire courant. On peut aussi lui passer un ou plusieurs chemins :

```bash
ls              # contenu du dossier courant
ls /etc         # contenu de /etc
ls fichier.txt  # affiche le nom s'il existe
```

Syntaxe générale : `ls [options] [chemin...]`

## Options les plus courantes

| Option | Définition |
|---|---|
| `-l` | Format long : permissions, nombre de liens, propriétaire, groupe, taille, date de modification, nom |
| `-a` | Affiche **tous** les fichiers, y compris les fichiers cachés (ceux qui commencent par `.`) ainsi que `.` et `..` |
| `-A` | Comme `-a`, mais sans `.` et `..` |
| `-h` | Tailles lisibles (K, M, G) au lieu d'octets ; s'utilise avec `-l` |
| `-R` | Récursif : liste aussi le contenu de tous les sous-dossiers |
| `-t` | Trie par date de modification (le plus récent en premier) |
| `-r` | Inverse l'ordre du tri |
| `-S` | Trie par taille (le plus gros en premier) |
| `-d` | Affiche le dossier lui-même et non son contenu (utile avec `-l` pour voir les droits d'un dossier) |
| `-i` | Affiche le numéro d'inode de chaque fichier |
| `-1` | Un fichier par ligne |
| `-F` | Ajoute un symbole indiquant le type : `/` dossier, `*` exécutable, `@` lien symbolique |
| `--color=auto` | Colore la sortie selon le type de fichier (souvent activé par défaut) |

## Combinaisons fréquentes

Les options se combinent en une seule suite de lettres :

```bash
ls -la      # tout le contenu, cachés compris, en format long
ls -lh      # format long avec tailles lisibles
ls -ltr     # format long, trié par date, le plus récent en bas
ls -lhS     # format long, trié par taille
ls -ld /var # droits du dossier /var lui-même
```

Sur beaucoup de distributions, `ll` est un alias de `ls -l` ou `ls -alF`.
