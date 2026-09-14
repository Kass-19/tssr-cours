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
    Ajoute un objet dans le tableau JSON ci-dessus (`title` = la commande, `description`, `course` = catégorie, `module` = thème, `tags`). Détails sur la page [+ Ajouter du contenu](../ajouter-du-contenu.md).
