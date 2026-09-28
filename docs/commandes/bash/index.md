# Commandes Bash

<div id="tssr-bash-filter"></div>

<script type="application/json" id="tssr-bash-data">
[
  {
    "title": "ip a",
    "description": "Affiche les interfaces réseau et leurs adresses IP.",
    "course": "Réseau",
    "module": "Diagnostic",
    "tags": ["réseau"]
  },
  {
    "title": "systemctl status",
    "description": "Affiche l'état d'un service géré par systemd.",
    "course": "Système",
    "module": "Services",
    "tags": ["système"]
  },
  {
    "title": "chmod",
    "description": "Modifie les droits d'accès (lecture/écriture/exécution) d'un fichier ou dossier.",
    "course": "Système",
    "module": "Fichiers",
    "tags": ["permissions"]
  },
  {
    "title": "grep",
    "description": "Recherche du texte correspondant à un motif dans un ou plusieurs fichiers.",
    "course": "Système",
    "module": "Fichiers",
    "tags": ["recherche"]
  },
  {
    "title": "ls",
    "description": "Affiche le contenu d'un répertoire (fichiers et sous-dossiers).",
    "course": "Système",
    "module": "Fichiers",
    "tags": ["fichiers"],
    "href": "ls/"
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRFilter.init({
      containerId: "tssr-bash-filter",
      dataId: "tssr-bash-data",
      itemLabel: "commandes",
      showCourseFilter: true,
      showModuleFilter: true,
      showAlpha: true,
      courseLabel: "Catégorie",
      moduleLabel: "Thème",
    });
  });
</script>

!!! tip "Ajouter une commande"
    Ajoute un objet dans le tableau JSON ci-dessus (`title` = la commande, `description`, `course` = catégorie, `module` = thème, `tags`). Si tu veux aussi une page complète comme celle de `ls` (description détaillée, tableau d'options, exemples), deux étapes : 1) crée un nouveau fichier `docs/commandes/bash/nom-de-la-commande.md` (même dossier que cette page) et 2) ajoute un champ `"href": "nom-de-la-commande/"` dans l'objet JSON — c'est ce qui rend le titre de la carte cliquable et l'envoie vers cette page. Sans `href`, la carte reste une fiche courte, sans lien. Détails sur la page [+ Ajouter du contenu](../../ajouter-du-contenu.md).
