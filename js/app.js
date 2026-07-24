/* ============================================================
   App logic - render, state, review.
   No backend, no storage. Everything stays in the browser tab.
   ============================================================ */

const state = {
  baseline: {},   // questionId -> answerStateId
  maturity: {},   // themeId -> maturityStateId
};

/* ---------- SVG icons ---------- */
const ICONS = {
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
  layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/></svg>',
  scale: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="m5 8 7-5 7 5"/><path d="M5 8v8l7 4 7-4V8"/></svg>',
};

const $ = (sel, root = document) => root.querySelector(sel);
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};

/* ---------- RENDER: baseline ---------- */
function renderBaseline() {
  const list = $("#baseline-list");
  BASELINE_QUESTIONS.forEach((q, i) => {
    const card = el("article", "q-card");
    card.id = `card-${q.id}`;

    const vis = VISIBILITY[q.visibility];
    const tagCls = q.visibility === "external" ? "tag-external" : "tag-internal";
    const tagIcon = q.visibility === "external" ? ICONS.eye : ICONS.lock;
    const linkout = q.visibility === "external"
      ? `<a class="q-linkout" href="${THREATSCOPE_URL}" target="_blank" rel="noopener">${ICONS.eye}Want to see this signal for your own domain? Check it with ThreatScope Check</a>`
      : "";

    card.innerHTML = `
      <div class="q-top">
        <span class="q-num">${String(i + 1).padStart(2, "0")}</span>
        <div class="q-body">
          <div class="q-domain">${q.domain}</div>
          <div class="q-text">${q.question}</div>
          <p class="q-why">${q.why}</p>
        </div>
        <span class="tag ${tagCls}" title="${vis.blurb}">${tagIcon}${vis.label}</span>
      </div>
    `;

    const answers = el("div", "answers");
    ANSWER_STATES.forEach((a) => {
      const btn = el("button", "answer");
      btn.type = "button";
      btn.dataset.state = a.id;
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `<span class="a-label">${a.label}</span><span class="a-note">${a.note}</span>`;
      btn.addEventListener("click", () => {
        state.baseline[q.id] = a.id;
        answers.querySelectorAll(".answer").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        card.classList.add("is-answered");
        updateProgress();
      });
      answers.appendChild(btn);
    });
    card.appendChild(answers);
    if (linkout) card.appendChild(el("div", "q-linkout-wrap", linkout));
    list.appendChild(card);
  });
}

/* ---------- RENDER: optional themes ---------- */
function renderMaturity() {
  const list = $("#maturity-list");
  MATURITY_THEMES.forEach((m, idx) => {
    const card = el("article", "m-card");
    card.id = m.anchor;
    const failuresHtml = m.failures.map((f) => `<li>${f}</li>`).join("");
    card.innerHTML = `
      <div class="m-head">
        <span class="m-index">Theme ${String(idx + 1).padStart(2, "0")}</span>
        <a class="m-anchor" href="#${m.anchor}" aria-label="Link to ${m.theme}">#</a>
      </div>
      <h3 class="m-theme">${m.theme}</h3>
      <p class="m-meaning">${m.meaning}</p>
      <div class="m-guide">
        <div class="m-guide-block"><span class="m-guide-label">Why it matters</span><p>${m.why}</p></div>
        <div class="m-guide-block"><span class="m-guide-label">What good looks like</span><p>${m.good}</p></div>
        <div class="m-guide-block"><span class="m-guide-label">Common failure modes</span><ul class="m-failures">${failuresHtml}</ul></div>
      </div>
      <p class="m-connects">${m.connects}</p>
      <p class="m-prompt"><strong>Where does your organisation sit today?</strong> ${m.prompt}</p>
    `;
    const scale = el("div", "m-scale");
    MATURITY_STATES.forEach((s) => {
      const btn = el("button", "m-opt");
      btn.type = "button";
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML = `${s.label}<span class="m-opt-note">${s.note}</span>`;
      btn.addEventListener("click", () => {
        state.maturity[m.id] = s.id;
        scale.querySelectorAll(".m-opt").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        updateProgress();
      });
      scale.appendChild(btn);
    });
    card.appendChild(scale);
    list.appendChild(card);
  });
}

/* ---------- PROGRESS ---------- */
function updateProgress() {
  const bTotal = BASELINE_QUESTIONS.length;
  const bDone = Object.keys(state.baseline).length;
  $("#baseline-progress-fill").style.width = `${(bDone / bTotal) * 100}%`;
  $("#baseline-progress-text").textContent = `${bDone} of ${bTotal} answered`;

  const mTotal = MATURITY_THEMES.length;
  const mDone = Object.keys(state.maturity).length;
  $("#maturity-progress-fill").style.width = `${(mDone / mTotal) * 100}%`;
  $("#maturity-progress-text").textContent = `${mDone} of ${mTotal} considered`;

  const btn = $("#generate-btn");
  if (bDone > 0) {
    btn.disabled = false;
    btn.textContent = bDone < bTotal
      ? `See your summary (${bDone}/${bTotal} answered)`
      : "See your summary";
  } else {
    btn.disabled = true;
    btn.textContent = "Answer at least one question to continue";
  }
}

/* ---------- REVIEW SUMMARY FALLBACK ---------- */
const STATE_META = {
  in_place:     { cls: "good",    stCls: "st-good",    fCls: "f-good",    label: "In place" },
  partial:      { cls: "partial", stCls: "st-partial", fCls: "f-partial", label: "Partial" },
  not_in_place: { cls: "absent",  stCls: "st-absent",  fCls: "f-absent",  label: "Not in place" },
  unsure:       { cls: "unsure",  stCls: "st-unsure",  fCls: "f-unsure",  label: "Not sure" },
};

function buildReflection() {
  const answered = BASELINE_QUESTIONS.filter((q) => state.baseline[q.id]);
  const counts = { in_place: 0, partial: 0, not_in_place: 0, unsure: 0 };
  answered.forEach((q) => counts[state.baseline[q.id]]++);

  const grid = $("#summary-grid");
  grid.innerHTML = "";
  [
    { key: "in_place", cls: "stat-good", label: "in place" },
    { key: "partial", cls: "stat-partial", label: "partial" },
    { key: "not_in_place", cls: "stat-absent", label: "not in place" },
    { key: "unsure", cls: "stat-unsure", label: "not sure" },
  ].forEach((s) => {
    grid.appendChild(el("div", `summary-stat ${s.cls}`, `<div class="s-count">${counts[s.key]}</div><div class="s-label">${s.label}</div>`));
  });

  const gaps = counts.not_in_place + counts.unsure + counts.partial;
  let intro;
  if (gaps === 0 && counts.in_place === answered.length) {
    intro = `Every attempted question is marked "in place." Treat that as a useful starting position, not a score. The next step is to keep those answers current through recurring review.`;
  } else if (counts.unsure >= 3) {
    intro = `Several answers are "not sure." That is the most useful finding: uncertainty shows where accountability, evidence or ownership is missing. Resolve those questions first.`;
  } else {
    intro = `This review summary leads with priorities for follow-up rather than a score. Use it to decide which domain-governance questions need ownership, evidence, remediation or escalation.`;
  }
  $("#reflection-intro-text").textContent = intro;

  const order = { not_in_place: 0, unsure: 1, partial: 2, in_place: 3 };
  const sorted = [...answered].sort((a, b) => order[state.baseline[a.id]] - order[state.baseline[b.id]]);
  const gapItems = sorted.filter((q) => state.baseline[q.id] !== "in_place");
  const goodItems = sorted.filter((q) => state.baseline[q.id] === "in_place");
  const gapsBlock = $("#gaps-block");
  const goodBlock = $("#good-block");
  gapsBlock.innerHTML = "";
  goodBlock.innerHTML = "";

  if (gapItems.length === 0) {
    gapsBlock.appendChild(el("div", "empty-good", "Every attempted baseline question is in place. Use the recurring-review guide to keep the evidence, ownership and practices current."));
  } else {
    gapItems.forEach((q) => gapsBlock.appendChild(renderFinding(q, state.baseline[q.id])));
  }

  if (goodItems.length === 0) {
    goodBlock.appendChild(el("div", "empty-good", "No baseline items were marked fully in place yet."));
  } else {
    goodItems.forEach((q) => goodBlock.appendChild(renderFinding(q, "in_place")));
  }

  const extAnswered = answered.filter((q) => q.visibility === "external");
  const extBlock = $("#external-block");
  extBlock.innerHTML = "";
  const extGaps = extAnswered.filter((q) => state.baseline[q.id] !== "in_place");
  const extText = extAnswered.length === 0
    ? `You did not answer any externally observable questions. Revisit authoritative DNS, sending domains and email authentication as visible signals.`
    : extGaps.length === 0
      ? `All ${extAnswered.length} externally observable items you answered are in place. Treat that as a prompt to keep reviewing the public trust surface, not as proof that everything behind it is well governed.`
      : `${extGaps.length} of ${extAnswered.length} externally observable items are not fully in place. These signals shape how others read the public trust surface before the internal reality is explained.`;
  extBlock.appendChild(el("p", "block-intro", extText));
  extAnswered.forEach((q) => {
    const meta = STATE_META[state.baseline[q.id]];
    extBlock.appendChild(el("div", "mat-row", `<span class="mat-name">${q.question}</span><span class="finding-state ${meta.stCls}">${meta.label}</span>`));
  });
  extBlock.appendChild(el("div", "q-linkout-wrap", `<a class="q-linkout" href="${THREATSCOPE_URL}" target="_blank" rel="noopener">${ICONS.eye}See these external signals for your own domain with ThreatScope Check</a>`));

  const matBlock = $("#maturity-summary");
  matBlock.innerHTML = "";
  const matDone = MATURITY_THEMES.filter((m) => state.maturity[m.id]);
  if (matDone.length === 0) {
    matBlock.appendChild(el("div", "empty-good", "You have not considered the optional themes in this pass. Use them only where they help deepen portfolio, supplier, change, monitoring, public-signal or executive-governance work."));
  } else {
    MATURITY_THEMES.forEach((m) => {
      const chosen = state.maturity[m.id];
      const label = chosen ? MATURITY_STATES.find((s) => s.id === chosen).label : "Not considered";
      matBlock.appendChild(el("div", "mat-row", `<span class="mat-name">${m.theme}</span><span class="mat-badge ${chosen ? "b-set" : ""}">${label}</span>`));
    });
  }

  $("#reflection-section").classList.add("is-visible");
  $("#reflection-section").scrollIntoView({ behavior: "smooth" });
}

function renderFinding(q, stateId) {
  const meta = STATE_META[stateId];
  const vis = VISIBILITY[q.visibility];
  const visTag = q.visibility === "external"
    ? `<span class="tag tag-external">${ICONS.eye}${vis.label}</span>`
    : `<span class="tag tag-internal">${ICONS.lock}${vis.label}</span>`;
  return el("article", `finding ${meta.fCls}`, `
    <div class="finding-head"><span class="finding-q">${q.question}</span><span class="finding-state ${meta.stCls}">${meta.label}</span></div>
    <div class="finding-layers">
      <div class="layer"><span class="layer-label">Board / risk</span><span class="layer-text">${q.board}</span></div>
      <div class="layer"><span class="layer-label">Technical</span><span class="layer-text">${q.tech}</span></div>
      <div class="layer"><span class="layer-label">Public-interest</span><span class="layer-text">${q.publicOrg}</span></div>
    </div>
    <div class="finding-visibility">${visTag}</div>
  `);
}

/* ---------- EXPORT FALLBACK ---------- */
function buildTextReport() {
  const lines = [];
  lines.push("DOMAIN GOVERNANCE BASELINE");
  lines.push("Baseline Review Summary");
  lines.push("");
  lines.push("Created by Bryan Chetcuti");
  lines.push("https://baseline.bryanchetcuti.com/");
  lines.push("");
  lines.push("Based on the essay:");
  lines.push("Domain Governance as a Trust Surface");
  lines.push("https://bryanchetcuti.com/writing/domain-governance-as-a-trust-surface/");
  lines.push("");
  lines.push(`Generated locally: ${new Date().toLocaleString()}`);
  lines.push("");
  lines.push("Purpose:");
  lines.push("Use this summary to identify domain-governance priorities, evidence gaps,");
  lines.push("accountable owners and practical next actions.");
  lines.push("");
  lines.push("Boundary:");
  lines.push("This is a review aid, not an assurance report, compliance instrument,");
  lines.push("maturity score or rating. Observation is not judgement.");
  lines.push("");
  lines.push("Privacy:");
  lines.push("This summary was generated in the browser. No answers were sent to a backend");
  lines.push("or stored by the tool.");
  lines.push("");
  lines.push("=".repeat(72));
  lines.push("");
  lines.push("SECTION 1 - THE BASELINE");
  lines.push("");

  BASELINE_QUESTIONS.forEach((q, i) => {
    const answer = state.baseline[q.id];
    const label = answer ? STATE_META[answer].label : "Not answered";
    const visibility = q.visibility === "external" ? "Externally observable" : "Internal only";
    lines.push(`${String(i + 1).padStart(2, "0")}. ${q.question}`);
    lines.push(`    Visibility: ${visibility}`);
    lines.push(`    Response: ${label}`);
    if (answer && answer !== "in_place") lines.push(`    Governance prompt: ${q.board}`);
    lines.push("");
  });

  lines.push("=".repeat(72));
  lines.push("");
  lines.push("SECTION 2 - OPTIONAL FOLLOW-ON THEMES");
  lines.push("");
  lines.push("Six optional themes for broader domain-governance review.");
  lines.push("");

  MATURITY_THEMES.forEach((m, i) => {
    const selected = state.maturity[m.id];
    const label = selected ? MATURITY_STATES.find((x) => x.id === selected).label : "Not considered";
    lines.push(`THEME ${String(i + 1).padStart(2, "0")} - ${m.theme.toUpperCase()}`);
    lines.push(`  Where we sit today: ${label}`);
    lines.push(`  What good looks like: ${m.good}`);
    lines.push("");
  });

  lines.push("FINAL NOTE");
  lines.push("");
  lines.push("Visible signals should not be over-interpreted.");
  lines.push("A missing signal does not mean an organisation is irresponsible.");
  lines.push("A passing signal does not mean everything behind it is well managed.");
  lines.push("");
  lines.push("The goal is to make domain governance visible, governable and improvable.");
  lines.push("");
  lines.push("Generated with Domain Governance Baseline");
  lines.push("https://baseline.bryanchetcuti.com/");
  lines.push("");
  return lines.join("\n");
}

/* ---------- THEME TOGGLE ---------- */
(function () {
  const t = $("[data-theme-toggle]"), r = document.documentElement;
  let d = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
  r.setAttribute("data-theme", d);
  const paint = () => {
    t.innerHTML = d === "dark"
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  };
  paint();
  t.addEventListener("click", () => { d = d === "dark" ? "light" : "dark"; r.setAttribute("data-theme", d); paint(); });
})();

/* ---------- INIT ---------- */
renderBaseline();
renderMaturity();
updateProgress();

$("#generate-btn").addEventListener("click", buildReflection);
$("#start-btn").addEventListener("click", () => $("#baseline-section").scrollIntoView({ behavior: "smooth" }));

$("#copy-btn").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(buildTextReport()); showToast("Review summary copied to clipboard"); }
  catch { showToast("Copy not available - use Print / Save instead"); }
});
$("#print-btn").addEventListener("click", () => window.print());