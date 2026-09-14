# Glossaire TSSR

Retrouve ici les termes, acronymes et concepts essentiels rencontrés dans tes cours, TP et fiches de révision.

<div id="tssr-glossaire-filter"></div>

<script type="application/json" id="tssr-glossaire-data">
[
  {
    "title": "Accord de niveau opérationnel",
    "subtitle": "OLA",
    "description": "Engagement interne entre équipes d'un même fournisseur qui soutient les objectifs d'un SLA, sans être un contrat avec le client.",
    "course": "Cours 6 - Sensibilisation ITIL et Gestion de parc",
    "courseHref": "../cours/cours-06-sensibilisation-itil-et-gestion-de-parc/",
    "module": "Module 3 : Les publications centrales - Stratégie et conception des services",
    "moduleHref": "../cours/cours-06-sensibilisation-itil-et-gestion-de-parc/module-3-les-publications-centrales-strategie-et-conception-des-services/",
    "tags": ["ITIL"]
  },
  {
    "title": "ACE",
    "subtitle": "Access Control Entry",
    "description": "Entrée individuelle d'une ACL indiquant quel utilisateur ou groupe reçoit une autorisation ou un refus sur une ressource.",
    "course": "Cours 2 - Système client microsoft",
    "courseHref": "../cours/cours-02-systeme-client-microsoft/",
    "module": "Module 6 : La sécurité NTFS et les ACL",
    "moduleHref": "../cours/cours-02-systeme-client-microsoft/module-6-la-securite-ntfs-et-les-acl/",
    "tags": ["Windows"]
  },
  {
    "title": "DHCP",
    "subtitle": "Dynamic Host Configuration Protocol",
    "description": "Protocole qui attribue automatiquement une adresse IP et sa configuration réseau à un poste qui se connecte.",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 3 : L'adressage IPv4",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
    "tags": ["Réseaux"]
  },
  {
    "title": "DNS",
    "subtitle": "Domain Name System",
    "description": "Service qui traduit un nom de domaine (ex : google.com) en adresse IP.",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 3 : L'adressage IPv4",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
    "tags": ["Réseaux"]
  },
  {
    "title": "CIDR",
    "subtitle": "Classless Inter-Domain Routing",
    "description": "Notation qui indique la taille d'un masque de sous-réseau sous la forme /n (ex : /24).",
    "course": "Cours 1 - Bases des réseaux",
    "courseHref": "../cours/cours-01-bases-des-reseaux/",
    "module": "Module 3 : L'adressage IPv4",
    "moduleHref": "../cours/cours-01-bases-des-reseaux/module-3-l-adressage-ipv4/",
    "tags": ["Réseaux"]
  }
]
</script>

<script>
  document.addEventListener("DOMContentLoaded", function () {
    TSSRFilter.init({
      containerId: "tssr-glossaire-filter",
      dataId: "tssr-glossaire-data",
      itemLabel: "termes",
      showCourseFilter: true,
      showModuleFilter: true,
      showAlpha: true,
    });
  });
</script>

!!! tip "Ajouter un terme, et le relier à un cours/module"
    Ajoute un objet dans le tableau JSON ci-dessus avec `title`, `subtitle` (optionnel), `description`, `course`, `module` et `tags`.

    Pour que le nom du cours/module affiché soit **cliquable** (et t'amène directement à la bonne page), ajoute aussi `courseHref` et/ou `moduleHref` : le plus simple est d'ouvrir la page du cours ou du module visé sur le site, de copier son adresse dans la barre du navigateur, et de la coller telle quelle comme valeur. Si tu ne renseignes pas ces deux champs, le nom du cours/module reste affiché mais en texte simple, non cliquable.

    Détails complets sur la page [+ Ajouter du contenu](../ajouter-du-contenu.md).
