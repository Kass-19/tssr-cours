# + Ajouter du contenu

Cette page explique comment ajouter du contenu **directement depuis ton navigateur, sur GitHub**, sans rien installer. C'est le principe retenu pour ce site : chaque fichier de cours est un simple fichier texte (Markdown), et GitHub propose un éditeur de texte intégré dans le navigateur.

Le guide complet de mise en ligne (première publication) est dans le fichier `README.md` du dépôt. Cette page couvre uniquement le fonctionnement **au quotidien**, une fois le site déjà en ligne.

## Modifier une page existante

Deux façons d'arriver au même endroit (l'éditeur de texte de GitHub) :

- **Depuis le site** : ouvre la page à modifier, puis clique sur le bouton crayon ✏️ **"Modifier cette page"** en haut à droite. Pratique quand tu es déjà en train de lire la page.
- **Depuis GitHub directement** : va sur ton dépôt, ouvre le dossier `docs/`, puis navigue jusqu'au fichier voulu (ex : `docs/cours/cours-02-systeme-client-microsoft/module-6-la-securite-ntfs-et-les-acl/index.md`), et clique sur le crayon ✏️ en haut à droite du fichier. Pratique si tu connais déjà l'arborescence et veux aller plus vite, ou si tu enchaînes plusieurs modules du même cours (tu restes dans le dossier GitHub et tu cliques de fichier en fichier).

Les deux méthodes fonctionnent pour **n'importe quel fichier** du site, y compris les 119 pages de modules déjà créées : rien ne les distingue d'une page "normale", tu peux directement les compléter avec cette méthode.

Ensuite, dans les deux cas :

1. Modifie le texte dans l'éditeur GitHub (à gauche : le texte brut Markdown ; onglet "Preview" : l'aperçu mis en forme).
2. En bas de page, clique sur **"Commit changes..."** (= "Enregistrer les modifications"), laisse la branche `main` sélectionnée, puis confirme.
3. Attends 1 à 2 minutes : le site se republie automatiquement (voir l'onglet "Actions" du dépôt GitHub pour suivre la progression).

!!! question "Et si je préfère travailler depuis le dossier sur mon ordinateur, en ligne de commande (CLI) ?"
    C'est possible (avec `git clone`, un éditeur de texte comme VS Code, puis `git add`/`commit`/`push`), et ça devient plus confortable si tu modifies beaucoup de fichiers à la fois ou si tu veux faire une recherche/remplacement sur tout le site. Mais ça demande d'installer Git et d'apprendre quelques commandes en plus. Pour compléter tes cours au fil de l'eau (un module à la fois), l'éditeur GitHub en ligne suffit largement et évite cette étape — tu peux toujours basculer vers la CLI plus tard si ça devient répétitif, dis-le-moi et je t'accompagnerai à ce moment-là.

## Ajouter un nouveau cours

1. Sur GitHub, va dans `docs/cours/`.
2. Crée un nouveau dossier (bouton "Add file" → "Create new file", puis tape `nom-du-module/index.md` : GitHub crée le dossier automatiquement).
3. Copie-colle le contenu de `docs/cours/reseaux-bases/index.md` comme point de départ, et adapte les 7 sections (objectif, résumé visuel, cours consolidé, points clés, fiche de révision, quiz).
4. Ajoute une vignette dans `docs/cours/index.md` (copie un bloc `<a class="tssr-card" ...>` existant).
5. Ajoute une ligne dans `mkdocs.yml`, section `nav:` → `Cours:`, pour que le module apparaisse dans le menu.

## Ajouter un terme au glossaire / une commande / un TP

Ces trois pages fonctionnent de la même façon : un petit bloc de données en haut du fichier (entre `<script type="application/json">` et `</script>`), au format suivant (exemple du glossaire) :

```json
{
  "title": "Nom du terme",
  "subtitle": "Acronyme développé (optionnel)",
  "description": "Explication courte.",
  "course": "Nom du cours concerné",
  "courseHref": "../cours/cours-01-bases-des-reseaux/",
  "module": "Nom du module concerné",
  "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
  "tags": ["mot-clé1", "mot-clé2"]
}
```

Pour ajouter un élément : ouvre la page (`docs/glossaire/index.md`, `docs/commandes/powershell.md`, `docs/commandes/bash.md` ou `docs/travaux-pratiques/index.md`) via l'éditeur GitHub, ajoute une **virgule** après le dernier `}` existant, puis colle un nouveau bloc `{ ... }` sur ce modèle. La page se met à jour automatiquement (recherche, filtres, compteur) sans toucher au code.

**Relier un terme à un cours/module précis (cliquable) :** les champs `courseHref` et `moduleHref` sont optionnels. Si tu ne les renseignes pas, `course` et `module` s'affichent quand même (en texte simple, utile pour les filtres) mais sans lien cliquable. Pour obtenir un lien cliquable, la façon la plus simple est :

1. Ouvre la page du cours ou du module concerné sur le site.
2. Copie l'adresse affichée dans la barre du navigateur.
3. Colle-la telle quelle comme valeur de `courseHref` ou `moduleHref`.

(Tu peux aussi utiliser un chemin relatif comme dans l'exemple ci-dessus si tu préfères, mais copier l'adresse depuis le navigateur évite toute erreur.)

!!! warning "Attention à la syntaxe JSON"
    Chaque `{ ... }` doit être séparé du suivant par une virgule, et il ne doit **jamais** y avoir de virgule après le tout dernier élément du tableau `[ ]`. C'est l'erreur la plus fréquente — si la page affiche un message d'erreur rouge, c'est presque toujours une virgule oubliée ou en trop.

## Besoin d'aide ?

Si une modification casse une page (erreur affichée, mise en forme cassée), tu peux toujours revenir en arrière : dans l'onglet **"History"** du fichier concerné sur GitHub, clique sur une version précédente puis restaure-la.
