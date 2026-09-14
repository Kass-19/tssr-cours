# TSSR · Mon espace de révision — Guide de mise en ligne

Ce dossier contient ton site de révision, déjà construit et testé. Ce guide t'explique, étape par étape, comment le mettre en ligne gratuitement, sans rien installer sur ton ordinateur.

## 1. Comprendre les 3 briques du site (2 minutes)

Pas besoin de tout comprendre en détail, juste l'idée générale :

- **MkDocs Material** : un outil qui transforme de simples fichiers texte (`.md`, format "Markdown") en un vrai site web avec menu, recherche, thème clair/sombre, etc. Tu écris du texte, il génère les pages.
- **GitHub** : un site qui héberge ton projet ("dépôt" ou "repository") et te permet de le modifier directement dans ton navigateur, comme demandé.
- **GitHub Pages + GitHub Actions** : deux services gratuits de GitHub. À chaque fois que tu modifies un fichier, GitHub Actions relance automatiquement MkDocs Material pour reconstruire le site, et GitHub Pages le publie à une adresse du type `https://ton-pseudo.github.io/tssr-cours/`.

Résultat concret : tu modifies un fichier texte dans ton navigateur → 1 à 2 minutes plus tard, le site en ligne est à jour. Tu n'auras jamais besoin d'installer quoi que ce soit ni de taper la moindre commande.

## 2. Créer ton compte GitHub

1. Va sur [github.com](https://github.com) et clique sur **"Sign up"**.
2. Choisis un pseudo (il apparaîtra dans l'adresse de ton site, ex : si tu choisis `kassandra-tssr`, ton site sera `https://kassandra-tssr.github.io/tssr-cours/`).
3. Renseigne ton adresse mail et un mot de passe, confirme ton compte par mail.
4. Le compte est gratuit, aucune carte bancaire n'est demandée.

## 3. Créer le dépôt (ton "dossier projet" en ligne)

1. Une fois connecté, clique sur le **+** en haut à droite → **"New repository"**.
2. Nom du dépôt : `tssr-cours` (tu peux choisir autre chose, mais il faudra alors l'adapter à l'étape 5).
3. Visibilité : **Public** (tu as demandé à pouvoir partager le site).
4. Ne coche aucune case d'initialisation (pas de README, pas de .gitignore) : on va importer nos fichiers directement.
5. Clique sur **"Create repository"**.

## 4. Uploader les fichiers du site

1. Sur la page (vide) du dépôt fraîchement créé, clique sur **"uploading an existing file"** (ou "Add file" → "Upload files").
2. Sur ton ordinateur, ouvre le dossier de ce projet et **sélectionne tout son contenu** (tous les fichiers et dossiers : `docs`, `.github`, `mkdocs.yml`, `requirements.txt`, `README.md`...).
3. Glisse-dépose le tout dans la zone d'upload de GitHub.
4. Tout en bas, dans "Commit changes", écris un message du type `Première version du site`, puis clique sur **"Commit changes"**.

!!! Important : le dossier `.github` (avec un point devant) contient le fichier qui active la publication automatique. Vérifie bien qu'il est présent après l'upload (GitHub l'affiche parfois masqué dans l'explorateur de fichiers de ton ordinateur — active l'affichage des fichiers/dossiers cachés si besoin).

## 5. Personnaliser 2 lignes avant de publier

Dans ton dépôt GitHub, ouvre le fichier `mkdocs.yml` (clique dessus, puis sur le crayon ✏️ pour l'éditer), et remplace `TON-PSEUDO-GITHUB` par ton pseudo GitHub réel aux lignes suivantes :

```yaml
site_url: https://TON-PSEUDO-GITHUB.github.io/tssr-cours/
repo_url: https://github.com/TON-PSEUDO-GITHUB/tssr-cours
```

Clique sur "Commit changes" pour enregistrer.

## 6. Activer GitHub Pages

1. Dans ton dépôt, va dans **"Settings"** (onglet en haut).
2. Dans le menu de gauche, clique sur **"Pages"**.
3. Sous "Build and deployment" → "Source", choisis **"GitHub Actions"** (pas "Deploy from a branch").
4. C'est tout — rien d'autre à faire ici, le fichier `.github/workflows/deploy.yml` déjà présent dans le projet s'occupe du reste.

## 7. Suivre la première publication

1. Va dans l'onglet **"Actions"** de ton dépôt.
2. Tu dois voir une exécution nommée "Publier le site" en cours (rond orange/jaune) puis terminée (coche verte). Ça prend en général 1 à 2 minutes.
3. Une fois terminé, ton site est en ligne à l'adresse `https://ton-pseudo.github.io/tssr-cours/`.

Si la coche est **rouge** (erreur), clique sur l'exécution pour voir le message d'erreur — dans la grande majorité des cas, c'est une erreur de syntaxe dans un fichier modifié (voir la section suivante).

## 8. Utilisation au quotidien

Une fois le site en ligne, consulte directement la page **"+ Ajouter du contenu"** dans le menu du site (aussi disponible dans `docs/ajouter-du-contenu.md`) : elle explique, avec des captures d'écran textuelles, comment modifier une page, ajouter un cours, un terme de glossaire, une commande ou un TP — toujours depuis le navigateur, via l'éditeur GitHub.

En résumé : ouvre le fichier à modifier sur GitHub → clique sur le crayon ✏️ → modifie → "Commit changes" → attends 1-2 minutes → le site est à jour.

## 9. Structure du projet (pour t'y retrouver)

```
tssr-site/
├── mkdocs.yml                  → Configuration générale du site (thème, menu, couleurs)
├── requirements.txt            → Liste des outils nécessaires pour construire le site
├── .github/workflows/deploy.yml→ La "recette" qui publie le site automatiquement
└── docs/                       → TOUT le contenu du site est ici
    ├── index.md                 → Page d'accueil
    ├── stylesheets/extra.css    → Styles visuels personnalisés (cartes, quiz, filtres)
    ├── javascripts/filter.js    → Moteur de recherche/filtre (glossaire, commandes, TP)
    ├── javascripts/quiz.js      → Moteur des quiz
    ├── cours/                   → Un dossier par module de cours
    ├── travaux-pratiques/       → Les TP, classés par cours
    ├── commandes/                → Mémos PowerShell / Bash
    └── glossaire/                → Le glossaire
```

## 10. Tester en local avant de publier (optionnel)

Si un jour tu veux voir tes modifications avant de les publier (utile pour un gros changement), et que tu as Python installé sur ton ordinateur :

```bash
pip install -r requirements.txt
mkdocs serve
```

Puis ouvre `http://127.0.0.1:8000` dans ton navigateur. Ce n'est pas obligatoire : tu peux tout à fait ne travailler que via l'éditeur GitHub en ligne.

## Ce qui a été décidé pour cette première version (et comment faire évoluer)

- **Édition** : via l'éditeur de fichiers intégré à GitHub (pas d'interface d'administration séparée pour l'instant).
- **Quiz** : le score s'affiche en fin de quiz mais n'est pas conservé après avoir quitté la page. Si tu veux plus tard un historique de tes scores, on pourra ajouter une sauvegarde locale au navigateur (simple) ou une vraie synchronisation entre appareils (plus complexe, nécessite une base de données).
- **Graphiques** : les diagrammes (comme le "résumé visuel" du module d'exemple) utilisent **Mermaid**, intégré nativement — écris ton diagramme en texte, il est dessiné automatiquement. Pour de vrais graphiques de données (barres, courbes), on pourra ajouter Chart.js le jour où tu en as besoin.
