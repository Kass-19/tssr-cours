# Commandes PowerShell

<div id="tssr-ps-filter"></div>

<script type="application/json" id="tssr-ps-data">
[
  {
    "title": "Get-NetIPConfiguration",
    "description": "Affiche la configuration IP des interfaces réseau (équivalent moderne de ipconfig).",
    "course": "Réseau",
    "module": "Diagnostic",
    "tags": ["réseau"]
  },
  {
    "title": "Get-Service",
    "description": "Liste les services Windows et leur état (démarré, arrêté...).",
    "course": "Système",
    "module": "Services",
    "tags": ["système"]
  },
  {
    "title": "Get-ADUser",
    "description": "Recherche des informations sur un ou plusieurs comptes utilisateurs Active Directory.",
    "course": "Active Directory",
    "module": "Utilisateurs",
    "tags": ["AD"]
  },
  {
    "title": "Test-NetConnection",
    "description": "Teste la connectivité réseau vers un hôte et un port donnés (équivalent avancé de ping/telnet).",
    "course": "Réseau",
    "module": "Diagnostic",
    "tags": ["réseau", "diagnostic"]
  },
  {
    "title": "Select-Object",
    "description": "Sélectionne, parmi les objets reçus via le pipe, uniquement les propriétés à afficher.",
    "course": "Manipulation d'objets",
    "module": "Sélection",
    "tags": ["pipe", "objets"],
    "href": "select-object/"
  },
  {
    "title": "Sort-Object",
    "description": "Trie les objets reçus via le pipe selon une propriété (croissant par défaut, -Descending pour inverser).",
    "course": "Manipulation d'objets",
    "module": "Tri",
    "tags": ["pipe", "tri"],
    "href": "sort-object/"
  },
  {
    "title": "Measure-Object",
    "description": "Compte les objets reçus, ou calcule somme/moyenne/min/max sur une propriété numérique.",
    "course": "Manipulation d'objets",
    "module": "Statistiques",
    "tags": ["pipe", "statistiques"],
    "href": "measure-object/"
  },
  {
    "title": "Where-Object",
    "description": "Filtre les objets reçus via le pipe selon une condition sur une ou plusieurs propriétés.",
    "course": "Manipulation d'objets",
    "module": "Filtrage",
    "tags": ["pipe", "filtre"],
    "href": "where-object/"
  },
  {
    "title": "Format-Table",
    "description": "Affiche les objets reçus sous forme de tableau, une colonne par propriété.",
    "course": "Manipulation d'objets",
    "module": "Affichage",
    "tags": ["pipe", "affichage"],
    "href": "format-table/"
  },
  {
    "title": "Format-Wide",
    "description": "Répartit une seule propriété (souvent le nom) sur plusieurs colonnes.",
    "course": "Manipulation d'objets",
    "module": "Affichage",
    "tags": ["pipe", "affichage"],
    "href": "format-wide/"
  },
  {
    "title": "Format-List",
    "description": "Affiche les propriétés des objets sous forme de liste verticale (une par ligne).",
    "course": "Manipulation d'objets",
    "module": "Affichage",
    "tags": ["pipe", "affichage"],
    "href": "format-list/"
  },
  {
    "title": "Export-Csv",
    "description": "Enregistre les objets reçus via le pipe dans un fichier CSV.",
    "course": "Manipulation d'objets",
    "module": "Export",
    "tags": ["pipe", "export", "csv"],
    "href": "export-csv/"
  },
  {
    "title": "Out-File",
    "description": "Redirige la sortie d'une commande vers un fichier texte (équivalent des chevrons >).",
    "course": "Manipulation d'objets",
    "module": "Export",
    "tags": ["pipe", "export"],
    "href": "out-file/"
  },
  {
    "title": "Get-Content",
    "description": "Lit et affiche le contenu d'un fichier directement dans la console.",
    "course": "Manipulation d'objets",
    "module": "Lecture",
    "tags": ["fichiers"],
    "href": "get-content/"
  },
  {
    "title": "Import-Csv",
    "description": "Recrée des objets PowerShell à partir d'un fichier CSV (inverse d'Export-Csv).",
    "course": "Manipulation d'objets",
    "module": "Import",
    "tags": ["pipe", "import", "csv"],
    "href": "import-csv/"
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRFilter.init({
      containerId: "tssr-ps-filter",
      dataId: "tssr-ps-data",
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
    Ajoute un objet dans le tableau JSON ci-dessus (`title` = la commande, `description`, `course` = catégorie, `module` = thème, `tags`). Si tu veux aussi une page complète (description détaillée, tableau d'options, exemples), deux étapes : 1) crée un nouveau fichier `docs/commandes/powershell/nom-de-la-commande.md` (même dossier que cette page) et 2) ajoute un champ `"href": "nom-de-la-commande/"` dans l'objet JSON — c'est ce qui rend le titre de la carte cliquable et l'envoie vers cette page. Sans `href`, la carte reste une fiche courte, sans lien. Détails sur la page [+ Ajouter du contenu](../../ajouter-du-contenu.md).
