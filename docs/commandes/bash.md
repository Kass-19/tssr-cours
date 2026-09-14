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
    Ajoute un objet dans le tableau JSON ci-dessus (`title` = la commande, `description`, `course` = catégorie, `module` = thème, `tags`). Détails sur la page [+ Ajouter du contenu](../ajouter-du-contenu.md).
