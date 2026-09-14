/**
 * filter.js
 * ---------------------------------------------------------------------
 * Petit moteur de recherche/filtre réutilisé par 3 pages du site :
 * Glossaire, Commandes et Travaux pratiques.
 *
 * PRINCIPE (pour comprendre le fonctionnement, pas besoin d'être
 * développeur) :
 *   1. Chaque page qui en a besoin contient un <script type="application/json">
 *      avec la LISTE des éléments (termes du glossaire, commandes, TP...)
 *      sous forme de tableau JSON. C'est CE fichier-là que tu modifieras
 *      pour ajouter du contenu — jamais ce fichier .js.
 *   2. Cette page contient aussi un <div id="..."></div> vide qui servira
 *      de zone d'affichage, et une barre de filtres (input + select).
 *   3. Cette fonction TSSRFilter.init(...) lit le JSON, affiche les
 *      cartes, et réagit à chaque frappe clavier / changement de filtre
 *      pour ne garder que les éléments qui correspondent.
 * ---------------------------------------------------------------------
 */

window.TSSRFilter = (function () {

  // Enlève les accents pour que "reseau" trouve aussi "réseau"
  function normalize(str) {
    return (str || "")
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort((a, b) =>
      a.localeCompare(b, "fr")
    );
  }

  function init(options) {
    var config = Object.assign(
      {
        containerId: null, // id du <div> où afficher les résultats
        dataId: null, // id du <script type="application/json"> contenant les données
        itemLabel: "éléments", // mot utilisé dans "12 éléments affichés"
        showCourseFilter: true,
        showModuleFilter: true,
        showAlpha: true,
        courseLabel: "Cours",
        moduleLabel: "Module",
      },
      options
    );

    var root = document.getElementById(config.containerId);
    var dataEl = document.getElementById(config.dataId);
    if (!root || !dataEl) return; // page sans filtre : on ne fait rien

    var items = [];
    try {
      items = JSON.parse(dataEl.textContent);
    } catch (e) {
      console.error("TSSRFilter: JSON invalide dans #" + config.dataId, e);
      root.innerHTML =
        '<p style="color:#c62828;">Erreur : le fichier de données de cette page contient une erreur de syntaxe JSON.</p>';
      return;
    }

    // --- Construction de la barre de filtres ---------------------------
    var bar = document.createElement("div");
    bar.className = "tssr-filter-bar";

    var searchWrap = document.createElement("div");
    searchWrap.innerHTML =
      '<label for="' +
      config.containerId +
      '-search">Rechercher</label>' +
      '<input type="text" id="' +
      config.containerId +
      '-search" placeholder="Terme, mot-clé...">';
    bar.appendChild(searchWrap);

    var courseSelect, moduleSelect;

    if (config.showCourseFilter) {
      var courseWrap = document.createElement("div");
      var courses = uniqueSorted(items.map((i) => i.course));
      courseWrap.innerHTML =
        '<label for="' + config.containerId + '-course">' + config.courseLabel + '</label>' +
        '<select id="' + config.containerId + '-course"><option value="">Tous (' + config.courseLabel.toLowerCase() + ')</option>' +
        courses.map((c) => '<option value="' + c + '">' + c + "</option>").join("") +
        "</select>";
      bar.appendChild(courseWrap);
      courseSelect = courseWrap.querySelector("select");
    }

    if (config.showModuleFilter) {
      var moduleWrap = document.createElement("div");
      moduleWrap.innerHTML =
        '<label for="' + config.containerId + '-module">' + config.moduleLabel + '</label>' +
        '<select id="' + config.containerId + '-module"><option value="">Tous (' + config.moduleLabel.toLowerCase() + ')</option></select>';
      bar.appendChild(moduleWrap);
      moduleSelect = moduleWrap.querySelector("select");
    }

    root.appendChild(bar);

    // Index alphabétique
    var alphaBar, activeLetter = "";
    if (config.showAlpha) {
      alphaBar = document.createElement("div");
      alphaBar.className = "tssr-filter-alpha";
      var toutesBtn = document.createElement("button");
      toutesBtn.textContent = "Toutes";
      toutesBtn.className = "active";
      toutesBtn.addEventListener("click", function () {
        activeLetter = "";
        setActiveAlphaButton(null);
        render();
      });
      alphaBar.appendChild(toutesBtn);
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (letter) {
        var btn = document.createElement("button");
        btn.textContent = letter;
        btn.addEventListener("click", function () {
          activeLetter = letter;
          setActiveAlphaButton(btn);
          render();
        });
        alphaBar.appendChild(btn);
      });
      root.appendChild(alphaBar);
    }

    function setActiveAlphaButton(activeBtn) {
      alphaBar.querySelectorAll("button").forEach(function (b) {
        b.classList.toggle("active", b === activeBtn || (!activeBtn && b.textContent === "Toutes"));
      });
    }

    var countEl = document.createElement("div");
    countEl.className = "tssr-filter-count";
    root.appendChild(countEl);

    var resultGrid = document.createElement("div");
    resultGrid.className = "tssr-result-grid";
    root.appendChild(resultGrid);

    function populateModuleOptions(filteredByCourse) {
      if (!moduleSelect) return;
      var current = moduleSelect.value;
      var modules = uniqueSorted(filteredByCourse.map((i) => i.module));
      moduleSelect.innerHTML =
        '<option value="">Tous (' + config.moduleLabel.toLowerCase() + ')</option>' +
        modules.map((m) => '<option value="' + m + '">' + m + "</option>").join("");
      if (modules.indexOf(current) !== -1) moduleSelect.value = current;
    }

    function render() {
      var searchInput = document.getElementById(config.containerId + "-search");
      var query = normalize(searchInput ? searchInput.value : "");
      var courseVal = courseSelect ? courseSelect.value : "";
      var moduleVal = moduleSelect ? moduleSelect.value : "";

      // Recalcule la liste des modules disponibles selon le cours choisi
      var byCourse = items.filter((i) => !courseVal || i.course === courseVal);
      populateModuleOptions(byCourse);

      var filtered = items.filter(function (item) {
        if (courseVal && item.course !== courseVal) return false;
        if (moduleVal && item.module !== moduleVal) return false;
        if (activeLetter && normalize(item.title).charAt(0) !== activeLetter.toLowerCase())
          return false;
        if (query) {
          var haystack = normalize(
            [item.title, item.subtitle, item.description, (item.tags || []).join(" ")].join(" ")
          );
          if (haystack.indexOf(query) === -1) return false;
        }
        return true;
      });

      filtered.sort((a, b) => a.title.localeCompare(b.title, "fr"));

      countEl.textContent =
        filtered.length + " " + config.itemLabel + " affiché" + (filtered.length > 1 ? "s" : "") +
        " sur " + items.length;

      resultGrid.innerHTML = filtered
        .map(function (item) {
          var tags = (item.tags || [])
            .map((t) => '<span class="tssr-tag">' + t + "</span>")
            .join("");
          var titleHtml = item.href
            ? '<a href="' + item.href + '">' + item.title + "</a>"
            : item.title;

          // Ligne "Cours / Module" : cliquable si un lien (courseHref / moduleHref)
          // a été renseigné, simple texte sinon.
          var metaParts = [];
          if (item.course) {
            metaParts.push(
              item.courseHref
                ? '<a href="' + item.courseHref + '">' + item.course + "</a>"
                : item.course
            );
          }
          if (item.module) {
            metaParts.push(
              item.moduleHref
                ? '<a href="' + item.moduleHref + '">' + item.module + "</a>"
                : item.module
            );
          }
          var metaHtml = metaParts.length
            ? '<p class="tssr-result-meta">📚 ' + metaParts.join(" · ") + "</p>"
            : "";

          return (
            '<div class="tssr-result-card">' +
            "<h3>" + titleHtml + (item.subtitle ? " — <em>" + item.subtitle + "</em>" : "") + "</h3>" +
            "<p>" + (item.description || "") + "</p>" +
            metaHtml +
            tags +
            "</div>"
          );
        })
        .join("");

      if (filtered.length === 0) {
        resultGrid.innerHTML =
          '<p style="color:var(--md-default-fg-color--light);">Aucun résultat pour ces filtres.</p>';
      }
    }

    // Écouteurs d'évènements
    root.addEventListener("input", function (e) {
      if (e.target.id === config.containerId + "-search") render();
    });
    root.addEventListener("change", function (e) {
      if (e.target === courseSelect || e.target === moduleSelect) render();
    });

    render();
  }

  return { init: init };
})();
