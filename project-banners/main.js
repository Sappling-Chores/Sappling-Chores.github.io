/**
 * main.js — Project Banners
 *
 * Reads the `projects` array from projects.js and:
 *   1. Renders one full-height banner per project into #scrollContainer.
 *   2. Renders navigation dots into #navDots.
 *   3. Keeps the active dot in sync as the user scrolls.
 *
 * Nothing here needs to change when you add a new project —
 * just append an object to the projects array in projects.js.
 */

(function () {
  "use strict";

  /* ── Grab references ───────────────────────────────────── */
  const container = document.getElementById("scrollContainer");
  const navDotsEl = document.getElementById("navDots");

  if (!container || !navDotsEl) {
    console.error("Project Banners: required DOM elements not found.");
    return;
  }

  if (!Array.isArray(projects) || projects.length === 0) {
    console.error("Project Banners: `projects` array is empty or undefined.");
    return;
  }

  /* ── Helpers ────────────────────────────────────────────── */

  /**
   * Escape any HTML-special characters in a string so it's safe
   * to insert as textContent in a template literal.
   */
  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ── Render banners ─────────────────────────────────────── */

  const fragment = document.createDocumentFragment();

  projects.forEach(function (project, index) {
    const isFirst = index === 0;

    const article = document.createElement("article");
    article.className = "banner";
    article.id = "banner-" + index;
    article.setAttribute("aria-label", "Project: " + esc(project.title));

    // imagePosition defaults to "center" when not specified in projects.js
    const imgPosition = esc(project.imagePosition || "center");

    article.innerHTML = `
      <div class="banner__media">

        <img
          class="banner__bg"
          src="${esc(project.image)}"
          alt="${esc(project.title)} background"
          loading="${isFirst ? "eager" : "lazy"}"
          decoding="async"
          style="object-position: ${imgPosition};"
        />

        <div class="banner__content">
          <h1 class="banner__title">${esc(project.title)}</h1>
          <p  class="banner__description">${esc(project.description)}</p>
        </div>

        <div class="banner__actions">
          <a
            class="btn btn--demo"
            href="${esc(project.demoUrl)}"
            id="demo-btn-${index}"
            target="_blank"
            rel="noopener noreferrer"
          >Demo ↗</a>
          <a
            class="btn btn--github"
            href="${esc(project.githubUrl)}"
            id="github-btn-${index}"
            target="_blank"
            rel="noopener noreferrer"
          >GitHub ↗</a>
        </div>

        ${isFirst
          ? `<div class="scroll-hint" aria-hidden="true">
               <span class="scroll-hint__label">Scroll</span>
               <span class="scroll-hint__arrow"></span>
             </div>`
          : ""
        }

      </div><!-- /.banner__media -->
    `;

    fragment.appendChild(article);
  });

  container.appendChild(fragment);

  /* ── Render nav dots ────────────────────────────────────── */

  const dots = projects.map(function (project, index) {
    const dot = document.createElement("span");
    dot.className = "nav-dot" + (index === 0 ? " active" : "");
    dot.setAttribute("aria-label", "Project " + (index + 1) + ": " + esc(project.title));
    dot.setAttribute("role", "img");
    navDotsEl.appendChild(dot);
    return dot;
  });

  /* ── Active-dot tracking via IntersectionObserver ───────── */

  let activeBannerIndex = 0;

  function setActiveDot(index) {
    if (index === activeBannerIndex) return;
    dots[activeBannerIndex].classList.remove("active");
    dots[index].classList.add("active");
    activeBannerIndex = index;
  }

  // Use IntersectionObserver with a 50 % threshold so the dot
  // switches exactly when a banner occupies the majority of the viewport.
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          const index = Number(entry.target.id.replace("banner-", ""));
          setActiveDot(index);
        }
      });
    },
    { root: container, threshold: 0.5 }
  );

  document.querySelectorAll(".banner").forEach(function (banner) {
    observer.observe(banner);
  });

})();
