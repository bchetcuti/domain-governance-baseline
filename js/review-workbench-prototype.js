/* Isolated interactive design study.
   Content comes directly from /js/data.js; all fictional answers live in memory only. */
(() => {
  "use strict";

  const question = BASELINE_QUESTIONS.find((entry) => entry.id === "b3");
  const theme = MATURITY_THEMES.find((entry) => entry.id === "m2");
  const answerNames = Object.fromEntries(ANSWER_STATES.map((entry) => [entry.id, entry.label]));
  const sample = Object.freeze({
    b1: "in_place", b2: "in_place", b3: "unsure", b4: "in_place",
    b5: "in_place", b6: "partial", b7: "partial", b8: "partial",
  });
  const responses = { ...sample };
  const skipped = new Set();
  let includeTheme = false;
  let currentStage = "review";

  const $ = (selector) => document.querySelector(selector);
  const el = (tag, className, content) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  };

  function counts() {
    const answered = BASELINE_QUESTIONS.filter((q) => Object.hasOwn(responses, q.id)).length;
    const open = BASELINE_QUESTIONS.filter((q) => Object.hasOwn(responses, q.id) && responses[q.id] !== "in_place").length;
    const skippedCount = BASELINE_QUESTIONS.filter((q) => !Object.hasOwn(responses, q.id) && skipped.has(q.id)).length;
    return {
      answered, open, skipped: skippedCount,
      unaddressed: BASELINE_QUESTIONS.length - answered - skippedCount,
      complete: answered === BASELINE_QUESTIONS.length,
    };
  }

  function answerStatus(q) {
    if (Object.hasOwn(responses, q.id)) return answerNames[responses[q.id]];
    return skipped.has(q.id) ? "Skipped" : "Unanswered";
  }

  function renderAnswers() {
    $("#question-number").textContent = "Question " + String(BASELINE_QUESTIONS.indexOf(question) + 1).padStart(2, "0") + " / 10";
    $("#question-domain").textContent = question.domain;
    $("#question-visibility").textContent = question.visibility === "external" ? "Externally observable" : "Internal governance";
    $("#prototype-question").textContent = question.question;
    $("#question-why").textContent = question.why;
    $("#question-evidence").textContent = question.tech;

    const wrap = $("#prototype-answer-options");
    wrap.replaceChildren();
    ANSWER_STATES.forEach((answer) => {
      const btn = el("button", "wb-answer");
      btn.type = "button";
      btn.dataset.answer = answer.id;
      btn.setAttribute("aria-pressed", String(responses[question.id] === answer.id));
      const marker = el("span", "wb-answer-marker", "✓");
      marker.setAttribute("aria-hidden", "true");
      const text = el("span", "wb-answer-copy");
      text.append(el("strong", "", answer.label), el("small", "", answer.note));
      btn.append(marker, text);
      btn.addEventListener("click", () => {
        responses[question.id] = answer.id;
        skipped.delete(question.id);
        renderAll();
      });
      wrap.append(btn);
    });
  }

  function renderOverview() {
    const wrap = $("#question-overview");
    wrap.replaceChildren();
    BASELINE_QUESTIONS.forEach((q, i) => {
      const status = answerStatus(q);
      const row = el("li", "wb-overview-row" + (q.id === question.id ? " is-current" : ""));
      const number = el("span", "wb-overview-number", String(i + 1).padStart(2, "0"));
      const name = el("span", "wb-overview-name", q.domain);
      const badge = el("span", "wb-overview-status" + (
        status === "Partial" || status === "Not in place" ? " is-open" : status === "Not sure" ? " is-unsure" : ""
      ), status);
      row.append(number, name, badge);
      wrap.append(row);
    });
    const coverage = counts();
    $("#review-progress-heading").textContent = coverage.answered + " of " + BASELINE_QUESTIONS.length + " answered";
    $("#review-progress-fill").style.width = (coverage.answered / BASELINE_QUESTIONS.length * 100) + "%";
  }

  function renderTheme() {
    $("#theme-title").textContent = theme.theme;
    $("#theme-meaning").textContent = theme.meaning;
    $("#theme-good").textContent = theme.good;
    $("#theme-prompt").textContent = theme.prompt;
    $("#include-theme").checked = includeTheme;
    $("#other-themes").replaceChildren(...MATURITY_THEMES.filter((t) => t.id !== theme.id)
      .map((t) => el("li", "", t.theme)));
  }

  function findingNode(q, index) {
    const item = el("article", "wb-finding");
    const indexCol = el("div", "wb-finding-index", "Q" + String(index + 1).padStart(2, "0"));
    const body = el("div", "wb-finding-body");
    body.append(el("h5", "", q.question), el("span", "wb-finding-state", answerStatus(q)));
    const action = el("p", "wb-finding-action");
    action.append(el("strong", "", "Evidence to confirm: "), document.createTextNode(q.tech));
    body.append(action);

    const more = el("details");
    more.append(el("summary", "", "Supporting governance interpretation"));
    const details = el("dl", "wb-finding-details");
    for (const [label, value] of [["Board / executive context", q.board], ["Technical context", q.tech], ["Public trust / service impact", q.publicOrg]]) {
      const group = el("div");
      group.append(el("dt", "", label), el("dd", "", value));
      details.append(group);
    }
    more.append(details);
    body.append(more);
    item.append(indexCol, body);
    return item;
  }

  function renderBrief() {
    const coverage = counts();
    $("#metric-answered").textContent = coverage.answered + " of " + BASELINE_QUESTIONS.length;
    $("#metric-open").textContent = String(coverage.open);
    $("#metric-unaddressed").textContent = String(coverage.unaddressed + coverage.skipped);
    $("#brief-cover-label").textContent = coverage.complete ? "Complete ten-question pass" : "Partial review";
    $("#metrics-description").textContent =
      coverage.skipped
      ? coverage.skipped + " skipped for now · " + coverage.unaddressed + " unaddressed. Skipped questions are not treated as findings. These are coverage counts, not a rating."
      : "All " + (BASELINE_QUESTIONS.length - coverage.answered) + " unanswered questions remain visible. These are coverage counts, not a risk or maturity rating.";

    const openItems = BASELINE_QUESTIONS
      .map((q, i) => ({ q, i }))
      .filter(({ q }) => Object.hasOwn(responses, q.id) && responses[q.id] !== "in_place");
    const target = $("#brief-findings");
    if (!openItems.length) {
      target.replaceChildren(el("p", "wb-metrics-boundary", "No answered questions require follow-up in this fictional pass. Confirm the underlying evidence before treating any answer as established."));
    } else target.replaceChildren(...openItems.map(({ q, i }) => findingNode(q, i)));

    const missing = BASELINE_QUESTIONS.filter((q) => !Object.hasOwn(responses, q.id));
    const notAddressed = $("#unaddressed-items");
    if (!missing.length) {
      notAddressed.replaceChildren(el("p", "", "All ten questions were answered."));
    } else {
      notAddressed.replaceChildren(...missing.map((q) =>
        el("p", "", q.question + " — " + (skipped.has(q.id) ? "Skipped for now" : "Not addressed"))));
    }

    $("#brief-theme-section").hidden = !includeTheme;
    if (includeTheme) {
      $("#brief-theme-title").textContent = theme.theme;
      $("#brief-theme-summary").textContent = theme.good;
    }
  }

  function copyContent() {
    const coverage = counts();
    const lines = [
      "DOMAIN GOVERNANCE BASELINE — ILLUSTRATIVE DESIGN PROTOTYPE",
      "Southern Community Services (fictional organisation)",
      "Canonical Version 1.0 questions; no validation or assurance conclusion.",
      "",
      "REVIEW COVERAGE",
      coverage.answered + " of 10 answered; " + coverage.open + " require follow-up; " +
        coverage.unaddressed + " unaddressed; " + coverage.skipped + " skipped.",
      "Counts describe the review pass, not risk or maturity.",
      "",
      "QUESTIONS FOR FOLLOW-UP (IN QUESTION ORDER)",
    ];
    for (const q of BASELINE_QUESTIONS) {
      if (!Object.hasOwn(responses, q.id) || responses[q.id] === "in_place") continue;
      lines.push(q.question + " — " + answerStatus(q));
      lines.push("Evidence to confirm: " + q.tech, "");
    }
    lines.push("NOT ADDRESSED IN THIS PASS");
    for (const q of BASELINE_QUESTIONS) {
      if (Object.hasOwn(responses, q.id)) continue;
      lines.push(q.question + " — " + answerStatus(q));
    }
    lines.push("", "GOVERNANCE HAND-OFF",
      "Confirm evidence; assign an accountable owner and action; revisit in an existing forum.");
    if (includeTheme) lines.push("", "OPTIONAL FOLLOW-ON SELECTED", theme.theme, theme.good);
    lines.push("", "Fictional sample only. No score, rating or assurance statement.");
    return lines.join("\n");
  }

  function showStage(stage) {
    if (!["review", "explore", "brief"].includes(stage)) return;
    currentStage = stage;
    for (const key of ["review", "explore", "brief"]) {
      const section = $("#stage-" + key);
      const active = stage === key;
      section.hidden = !active;
      section.classList.toggle("is-visible", active);
      const button = document.querySelector('.wb-step[data-stage-target="' + key + '"]');
      if (active) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    }
    if (stage === "brief") renderBrief();
    const heading = $("#stage-" + stage + "-title");
    heading.setAttribute("tabindex", "-1");
    heading.focus({ preventScroll: true });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.querySelector(".wb-steps").scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
  }

  function renderAll() {
    renderAnswers();
    renderOverview();
    renderTheme();
    renderBrief();
  }

  function init() {
    if (!question || !theme || !Array.isArray(BASELINE_QUESTIONS) || BASELINE_QUESTIONS.length !== 10) {
      throw new Error("The canonical Baseline question and optional theme data are required for this prototype.");
    }
    renderAll();
    document.querySelectorAll("[data-stage-target]").forEach((button) => {
      button.addEventListener("click", () => showStage(button.dataset.stageTarget));
    });
    $("#reset-answer").addEventListener("click", () => {
      responses[question.id] = sample[question.id];
      skipped.delete(question.id);
      renderAll();
    });
    $("#skip-answer").addEventListener("click", () => {
      delete responses[question.id];
      skipped.add(question.id);
      renderAll();
    });
    $("#theme-toggle").addEventListener("click", () => {
      const button = $("#theme-toggle");
      const expanded = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(expanded));
      $("#theme-detail").hidden = !expanded;
      button.querySelector("span").textContent = expanded ? "−" : "+";
    });
    $("#include-theme").addEventListener("change", (event) => {
      includeTheme = event.target.checked;
      renderBrief();
    });
    $("#brief-copy").addEventListener("click", async () => {
      const status = $("#copy-status");
      try {
        await navigator.clipboard.writeText(copyContent());
        status.textContent = "Illustrative brief copied. It contains fictional data only.";
      } catch {
        status.textContent = "Clipboard unavailable here. Use browser print/save, or try copying in a secure browser context.";
      }
    });
    $("#brief-print").addEventListener("click", () => {
      renderBrief();
      window.print();
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
