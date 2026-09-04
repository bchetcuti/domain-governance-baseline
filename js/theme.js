/* Shared colour-theme control for all public Baseline surfaces. */
(function () {
  const root = document.documentElement;
  const preferenceKey = "domain-governance-baseline-theme";
  const systemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  let theme;
  try {
    const stored = window.localStorage.getItem(preferenceKey);
    theme = stored === "dark" || stored === "light" ? stored : systemTheme();
  } catch {
    theme = systemTheme();
  }

  root.setAttribute("data-theme", theme);

  const sunIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const moonIcon = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

  function initialiseToggle() {
    const header = document.querySelector(".site-header .wrap-wide");
    if (!header) return;

    let actions = header.querySelector(".header-actions");
    if (!actions) {
      actions = document.createElement("div");
      actions.className = "header-actions";
      header.appendChild(actions);
    }

    let toggle = actions.querySelector("[data-theme-toggle]");
    if (!toggle) {
      toggle = document.createElement("button");
      toggle.className = "icon-btn";
      toggle.type = "button";
      toggle.setAttribute("data-theme-toggle", "");
      actions.appendChild(toggle);
    }

    const paint = () => {
      const nextTheme = theme === "dark" ? "light" : "dark";
      toggle.innerHTML = theme === "dark" ? sunIcon : moonIcon;
      toggle.setAttribute("aria-label", `Switch to ${nextTheme} colour theme`);
      toggle.setAttribute("title", `Switch to ${nextTheme} colour theme`);
    };

    paint();
    toggle.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", theme);
      try {
        window.localStorage.setItem(preferenceKey, theme);
      } catch {
        // Theme switching still works when local storage is unavailable.
      }
      paint();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialiseToggle, { once: true });
  } else {
    initialiseToggle();
  }
})();
