# Travaux pratiques

Tous tes TP, classés par cours. Utilise la recherche ou le filtre "Cours" pour retrouver rapidement un TP.

<div id="tssr-tp-filter"></div>

<script type="application/json" id="tssr-tp-data">
[
  {
    "title": "TP - Plan d'adressage IP",
    "description": "Concevoir un plan d'adressage IP pour un petit réseau d'entreprise à partir d'un cahier des charges.",
    "course": "Cours 1 - Bases des réseaux",
    "tags": ["adressage", "sous-réseaux"],
    "href": "cours-01-bases-des-reseaux/tp-plan-adressage/"
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRFilter.init({
      containerId: "tssr-tp-filter",
      dataId: "tssr-tp-data",
      itemLabel: "TP",
      showCourseFilter: true,
      showModuleFilter: false,
      showAlpha: true,
    });
  });
</script>

!!! tip "Ajouter un TP"
    Ajoute une ligne dans le tableau JSON ci-dessus (`title`, `description`, `course`, `tags`, `href`) et crée la page correspondante. Détails sur la page [+ Ajouter du contenu](../ajouter-du-contenu.md).
