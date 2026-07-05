/* ============================================================
   App logic - render, state, reflection.
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
    if (linkout) {
      const lo = el("div", "q-linkout-wrap", linkout);
      card.appendChild(lo);
    }
    list.appendChild(card);
  });
}

/* ---------- RENDER: maturity ---------- */
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
        <div class="m-guide-block">
          <span class="m-guide-label">Why it matters</span>
          <p>${m.why}</p>
        </div>
        <div class="m-guide-block">
          <span class="m-guide-label">What good looks like</span>
          <p>${m.good}</p>
        </div>
        <div class="m-guide-block">
          <span class="m-guide-label">Common failure modes</span>
          <ul class="m-failures">${failuresHtml}</ul>
        </div>
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
      ? `See your reflection (${bDone}/${bTotal} answered)`
      : "See your reflection";
  } else {
    btn.disabled = true;
    btn.textContent = "Answer at least one question to continue";
  }
}

/* ---------- REFLECTION ---------- */
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

  /* Summary stats */
  const grid = $("#summary-grid");
  grid.innerHTML = "";
  const statDefs = [
    { key: "in_place", cls: "stat-good", label: "in place" },
    { key: "partial", cls: "stat-partial", label: "partial" },
    { key: "not_in_place", cls: "stat-absent", label: "not in place" },
    { key: "unsure", cls: "stat-unsure", label: "not sure" },
  ];
  statDefs.forEach((s) => {
    const stat = el("div", `summary-stat ${s.cls}`);
    stat.innerHTML = `<div class="s-count">${counts[s.key]}</div><div class="s-label">${s.label}</div>`;
    grid.appendChild(stat);
  });

  /* Intro line adapts to the picture */
  const gaps = counts.not_in_place + counts.unsure + counts.partial;
  let intro;
  if (gaps === 0 && counts.in_place === answered.length) {
    intro = `You answered every attempted question as "in place." That is a strong baseline. The real value now is keeping it true - which is where the maturity themes below come in. Remember: a passing baseline does not mean everything behind it is well managed.`;
  } else if (counts.unsure >= 3) {
    intro = `Several answers were "not sure." That is itself the most useful finding - the questions nobody can confidently answer are exactly the governance conversations worth having first. Uncertainty here is not failure; it is a map of where clarity is missing.`;
  } else {
    intro = `This is a reflection, not a score. The items below are grouped so you can see where the baseline is solid, where it is partial, and where a conversation is worth starting. None of this is a judgement - it is a starting point for a better discussion about your domain layer.`;
  }
  $("#reflection-intro-text").textContent = intro;

  /* Priority ordering: not_in_place, unsure, partial, then in_place */
  const order = { not_in_place: 0, unsure: 1, partial: 2, in_place: 3 };
  const sorted = [...answered].sort((a, b) => order[state.baseline[a.id]] - order[state.baseline[b.id]]);

  /* Conversations to have next (everything that isn't fully in place) */
  const gapsBlock = $("#gaps-block");
  const goodBlock = $("#good-block");
  gapsBlock.innerHTML = "";
  goodBlock.innerHTML = "";

  const gapItems = sorted.filter((q) => state.baseline[q.id] !== "in_place");
  const goodItems = sorted.filter((q) => state.baseline[q.id] === "in_place");

  if (gapItems.length === 0) {
    gapsBlock.appendChild(el("div", "empty-good", "Every attempted baseline question is in place. Focus your attention on the maturity themes below."));
  } else {
    gapItems.forEach((q) => gapsBlock.appendChild(renderFinding(q, state.baseline[q.id])));
  }

  if (goodItems.length === 0) {
    goodBlock.appendChild(el("div", "empty-good", "No baseline items were marked fully in place yet."));
  } else {
    goodItems.forEach((q) => goodBlock.appendChild(renderFinding(q, "in_place")));
  }

  /* Public trust surface callout - externally observable items */
  const extAnswered = answered.filter((q) => q.visibility === "external");
  const extBlock = $("#external-block");
  extBlock.innerHTML = "";
  const extGaps = extAnswered.filter((q) => state.baseline[q.id] !== "in_place");
  const extText = extAnswered.length === 0
    ? `You didn't answer any of the externally observable questions (authoritative DNS, sending domains, SPF/DKIM/DMARC). These are the parts of your domain layer anyone can inspect from outside - worth revisiting.`
    : extGaps.length === 0
      ? `All ${extAnswered.length} externally observable items you answered are in place. The signals that form your public trust surface - DNS, sending authority, email authentication - currently present coherently to an outside observer.`
      : `${extGaps.length} of ${extAnswered.length} externally observable items are not fully in place. Because these signals are visible from outside your organisation, they shape how others read your public trust surface - before you ever get to explain the internal reality behind them.`;
  extBlock.appendChild(el("p", "block-intro", extText));
  extAnswered.forEach((q) => {
    const meta = STATE_META[state.baseline[q.id]];
    const row = el("div", "mat-row");
    row.innerHTML = `<span class="mat-name">${q.question}</span><span class="finding-state ${meta.stCls}">${meta.label}</span>`;
    extBlock.appendChild(row);
  });
  const extLink = el("div", "q-linkout-wrap",
    `<a class="q-linkout" href="${THREATSCOPE_URL}" target="_blank" rel="noopener">${ICONS.eye}See these external signals for your own domain with ThreatScope Check</a>`);
  extBlock.appendChild(extLink);

  /* Maturity summary */
  const matBlock = $("#maturity-summary");
  matBlock.innerHTML = "";
  const matDone = MATURITY_THEMES.filter((m) => state.maturity[m.id]);
  if (matDone.length === 0) {
    matBlock.appendChild(el("div", "empty-good", "You haven't reflected on the maturity themes yet. Once the baseline is visible, these are the deeper conversations - portfolio, suppliers, change control, monitoring, public signals and executive reporting."));
  } else {
    MATURITY_THEMES.forEach((m) => {
      const chosen = state.maturity[m.id];
      const label = chosen ? MATURITY_STATES.find((s) => s.id === chosen).label : "Not considered";
      const row = el("div", "mat-row");
      row.innerHTML = `<span class="mat-name">${m.theme}</span><span class="mat-badge ${chosen ? "b-set" : ""}">${label}</span>`;
      matBlock.appendChild(row);
    });
  }

  $("#reflection-section").classList.add("is-visible");
  $("#reflection-section").scrollIntoView({ behavior: "smooth" });
}

function renderFinding(q, stateId) {
  const meta = STATE_META[stateId];
  const vis = VISIBILITY[q.visibility];
  const node = el("article", `finding ${meta.fCls}`);
  const visTag = q.visibility === "external"
    ? `<span class="tag tag-external">${ICONS.eye}${vis.label}</span>`
    : `<span class="tag tag-internal">${ICONS.lock}${vis.label}</span>`;

  node.innerHTML = `
    <div class="finding-head">
      <span class="finding-q">${q.question}</span>
      <span class="finding-state ${meta.stCls}">${meta.label}</span>
    </div>
    <div class="finding-layers">
      <div class="layer"><span class="layer-label">Board / risk</span><span class="layer-text">${q.board}</span></div>
      <div class="layer"><span class="layer-label">Technical</span><span class="layer-text">${q.tech}</span></div>
      <div class="layer"><span class="layer-label">Public-interest</span><span class="layer-text">${q.publicOrg}</span></div>
    </div>
    <div class="finding-visibility">${visTag}</div>
  `;
  return node;
}

/* ---------- EXPORT (copy + print) ---------- */
function buildTextReport() {
  const lines = [];

  const generatedAt = new Date().toLocaleString();

  lines.push("DOMAIN GOVERNANCE BASELINE");
  lines.push("Reflection Summary / Conversation Brief");
  lines.push("");
  lines.push("Created by Bryan Chetcuti");
  lines.push("https://baseline.bryanchetcuti.com/");
  lines.push("");
  lines.push("Based on the essay:");
  lines.push("Domain Governance as a Trust Surface");
  lines.push("https://bryanchetcuti.com/writing/domain-governance-as-a-trust-surface/");
  lines.push("");
  lines.push(`Generated locally: ${generatedAt}`);
  lines.push("");
  lines.push("Purpose:");
  lines.push("Use this summary to support a governance conversation about domain ownership,");
  lines.push("DNS, email authority, public signals, accountability and review.");
  lines.push("");
  lines.push("Boundary:");
  lines.push("This is a reflection aid, not an assurance report, compliance instrument,");
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
    const a = state.baseline[q.id];
    const label = a ? STATE_META[a].label : "Not answered";
    const visLbl = q.visibility === "external" ? "Externally observable" : "Internal only";

    lines.push(`${String(i + 1).padStart(2, "0")}. ${q.question}`);
    lines.push(`    Visibility: ${visLbl}`);
    lines.push(`    Response: ${label}`);

    if (a && a !== "in_place") {
      lines.push(`    Governance prompt: ${q.board}`);
    }

    lines.push("");
  });

  lines.push("=".repeat(72));
  lines.push("");
  lines.push("SECTION 2 - THE MATURITY GUIDE");
  lines.push("");
  lines.push("Beyond the baseline: six themes for governing the domain layer over time.");
  lines.push("Each theme includes where your organisation currently sits, if considered.");
  lines.push("");

  const wrap = (text, indent = "    ", width = 76) => {
    const words = String(text).split(/\s+/);
    const out = [];
    let line = indent;

    words.forEach((w) => {
      if ((line + w).length > width && line.trim().length) {
        out.push(line);
        line = indent + w + " ";
      } else {
        line += w + " ";
      }
    });

    if (line.trim().length) out.push(line.replace(/\s+$/, ""));
    return out;
  };

  MATURITY_THEMES.forEach((m, i) => {
    const s = state.maturity[m.id];
    const label = s ? MATURITY_STATES.find((x) => x.id === s).label : "Not considered";

    lines.push(`THEME ${String(i + 1).padStart(2, "0")} - ${m.theme.toUpperCase()}`);
    lines.push(`  Where we sit today: ${label}`);
    lines.push("");

    lines.push("  What it means:");
    lines.push(...wrap(m.meaning));
    lines.push("");

    lines.push("  Why it matters:");
    lines.push(...wrap(m.why));
    lines.push("");

    lines.push("  What good looks like:");
    lines.push(...wrap(m.good));
    lines.push("");

    lines.push("  Common failure modes:");
    m.failures.forEach((f) => {
      lines.push(...wrap(f, "    - ").map((l, idx) => idx === 0 ? l : "      " + l.trimStart()));
    });
    lines.push("");

    lines.push("  Connects to:");
    lines.push(...wrap(m.connects));
    lines.push("");

    lines.push("-".repeat(72));
    lines.push("");
  });

  lines.push("FINAL NOTE");
  lines.push("");
  lines.push("Visible signals should not be over-interpreted.");
  lines.push("A missing signal does not mean an organisation is irresponsible.");
  lines.push("A passing signal does not mean everything behind it is well managed.");
  lines.push("");
  lines.push("The goal is to make domain governance visible, discussable and improvable.");
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
  try { await navigator.clipboard.writeText(buildTextReport()); showToast("Reflection copied to clipboard"); }
  catch { showToast("Copy not available - use Print / Save instead"); }
});
$("#print-btn").addEventListener("click", () => window.print());
