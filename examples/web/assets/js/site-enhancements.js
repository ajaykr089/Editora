/* ============================================
   EDITORA — SITE ENHANCEMENTS
   Search, dark mode, active nav, breadcrumbs, TOC
   ============================================ */

(function () {
  "use strict";

  // ---- Path helpers -------------------------------------------------
  // depth: 0 at site root, 1 inside /docs or /plugins
  var pathParts = window.location.pathname.split("/").filter(Boolean);
  var inSubdir = /\/(docs|plugins)\/[^/]*$/.test(window.location.pathname);
  var rootPrefix = inSubdir ? "../" : "";
  var currentFile = pathParts.length ? pathParts[pathParts.length - 1] : "index.html";
  var currentDir = inSubdir ? pathParts[pathParts.length - 2] : "";

  // ====================================================================
  // 1. DARK MODE
  // ====================================================================
  function initDarkMode() {
    var root = document.documentElement;
    var saved = null;
    try { saved = localStorage.getItem("editora-theme"); } catch (e) {}
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (prefersDark ? "dark" : "light");
    if (theme === "dark") root.setAttribute("data-theme", "dark");

    var btn = document.getElementById("themeToggle");
    if (!btn) return;
    updateToggleIcon(btn, theme);

    btn.addEventListener("click", function () {
      var isDark = root.getAttribute("data-theme") === "dark";
      var next = isDark ? "light" : "dark";
      if (next === "dark") {
        root.setAttribute("data-theme", "dark");
      } else {
        root.removeAttribute("data-theme");
      }
      try { localStorage.setItem("editora-theme", next); } catch (e) {}
      updateToggleIcon(btn, next);
    });
  }

  function updateToggleIcon(btn, theme) {
    var sun = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path></svg>';
    var moon = '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    btn.innerHTML = theme === "dark" ? sun : moon;
    btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  // ====================================================================
  // 2. ACTIVE NAV — computed, not hardcoded per page
  // ====================================================================
  function initActiveNav() {
    var links = document.querySelectorAll(".nav-links a");
    links.forEach(function (a) {
      a.classList.remove("active");
      var href = a.getAttribute("href") || "";
      if (href.startsWith("http") || href.startsWith("#")) return;

      var isHome = (href === "index.html" || href === "../index.html") &&
                   currentFile === "index.html" && !inSubdir;
      var isDocs = href.indexOf("docs/") !== -1 && currentDir === "docs";
      var isPlugins = href.indexOf("plugins/") !== -1 && currentDir === "plugins";

      if (isHome || isDocs || isPlugins) {
        a.classList.add("active");
      }
    });
  }

  // ====================================================================
  // 3. BREADCRUMBS
  // ====================================================================
  function initBreadcrumbs() {
    var container = document.getElementById("breadcrumbs");
    if (!container) return;

    var titleEl = document.querySelector(".docs-content h1, main h1, .hero h1");
    var pageLabel = titleEl ? titleEl.textContent.trim() : document.title.split("|")[0].replace("Editora -", "").trim();

    var crumbs = ['<a href="' + rootPrefix + 'index.html">Home</a>'];
    if (currentDir === "docs") {
      crumbs.push('<a href="' + rootPrefix + 'docs/installation.html">Docs</a>');
    } else if (currentDir === "plugins") {
      crumbs.push('<a href="' + rootPrefix + 'plugins/index.html">Plugins</a>');
    }
    if (currentFile !== "installation.html" && currentFile !== "index.html") {
      crumbs.push('<span aria-current="page">' + pageLabel + '</span>');
    }

    container.innerHTML = crumbs.join('<span class="crumb-sep">/</span>');
  }

  // ====================================================================
  // 4. TABLE OF CONTENTS (docs pages only)
  // ====================================================================
  function slugify(text) {
    return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").slice(0, 60);
  }

  function initTOC() {
    var toc = document.getElementById("docsToc");
    var content = document.querySelector(".docs-content");
    if (!toc || !content) return;

    var headings = content.querySelectorAll("h2, h3");
    if (!headings.length) { toc.style.display = "none"; return; }

    var wrapper = document.querySelector(".docs-wrapper");
    if (wrapper) wrapper.classList.add("has-toc");

    var list = document.createElement("ul");
    headings.forEach(function (h, i) {
      if (!h.id) h.id = slugify(h.textContent) + "-" + i;
      var li = document.createElement("li");
      li.className = h.tagName === "H3" ? "toc-sub" : "";
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      list.appendChild(li);
    });

    var heading = document.createElement("h3");
    heading.textContent = "On this page";
    toc.appendChild(heading);
    toc.appendChild(list);

    // Scrollspy
    var tocLinks = toc.querySelectorAll("a");
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tocLinks.forEach(function (l) { l.classList.remove("active"); });
          var match = toc.querySelector('a[href="#' + entry.target.id + '"]');
          if (match) match.classList.add("active");
        }
      });
    }, { rootMargin: "-100px 0px -70% 0px" });
    headings.forEach(function (h) { observer.observe(h); });
  }

  // ====================================================================
  // 5. SEARCH (Cmd+K / Ctrl+K)
  // ====================================================================
  function initSearch() {
    var openBtn = document.getElementById("searchTrigger");
    var modal = document.getElementById("searchModal");
    if (!modal) return;
    var input = modal.querySelector(".search-input");
    var results = modal.querySelector(".search-results");
    var data = window.EDITORA_SEARCH_INDEX || [];

    function resolveUrl(url) {
      return rootPrefix + url;
    }

    function render(items) {
      if (!items.length) {
        results.innerHTML = '<div class="search-empty">No results. Try a different term.</div>';
        return;
      }
      results.innerHTML = items.slice(0, 8).map(function (item, i) {
        return '<a href="' + resolveUrl(item.url) + '" class="search-result' + (i === 0 ? " active" : "") + '">' +
          '<span class="search-result-title">' + item.title.replace(/^Editora\s*-?\s*/, "") + '</span>' +
          '<span class="search-result-cat">' + item.category + '</span>' +
          '</a>';
      }).join("");
    }

    function search(query) {
      query = query.trim().toLowerCase();
      if (!query) { render(data); return; }
      var scored = data.map(function (item) {
        var hay = (item.title + " " + item.desc).toLowerCase();
        var score = hay.indexOf(query) === -1 ? -1 : (item.title.toLowerCase().indexOf(query) !== -1 ? 2 : 1);
        return { item: item, score: score };
      }).filter(function (x) { return x.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })
        .map(function (x) { return x.item; });
      render(scored);
    }

    function openModal() {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
      input.value = "";
      render(data);
      setTimeout(function () { input.focus(); }, 10);
    }

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }

    if (openBtn) openBtn.addEventListener("click", openModal);
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeModal();
    });
    input.addEventListener("input", function () { search(input.value); });

    input.addEventListener("keydown", function (e) {
      var items = results.querySelectorAll(".search-result");
      var activeIndex = -1;
      items.forEach(function (el, i) { if (el.classList.contains("active")) activeIndex = i; });

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (items.length) {
          items[activeIndex] && items[activeIndex].classList.remove("active");
          var next = items[(activeIndex + 1) % items.length];
          next.classList.add("active");
          next.scrollIntoView({ block: "nearest" });
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (items.length) {
          items[activeIndex] && items[activeIndex].classList.remove("active");
          var prev = items[(activeIndex - 1 + items.length) % items.length];
          prev.classList.add("active");
          prev.scrollIntoView({ block: "nearest" });
        }
      } else if (e.key === "Enter") {
        e.preventDefault();
        var current = items[activeIndex] || items[0];
        if (current) window.location.href = current.getAttribute("href");
      } else if (e.key === "Escape") {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openModal();
      } else if (e.key === "Escape" && modal.classList.contains("open")) {
        closeModal();
      }
    });
  }

  // ====================================================================
  document.addEventListener("DOMContentLoaded", function () {
    initDarkMode();
    initActiveNav();
    initBreadcrumbs();
    initTOC();
    initSearch();
  });
})();
