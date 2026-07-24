/* ============================================================
   Guided-pass interaction and priority-first review output.
   Keeps the baseline as a review summary, not a score.
   ============================================================ */

(function () {
  const stateMeta = {
    in_place: { cls: "good", stCls: "st-good", fCls: "f-good", label: "In place" },
    partial: { cls: "partial", stCls: "st-partial", fCls: "f-partial", label: "Partial" },
    not_in_place: { cls: "absent", stCls: "st-absent", fCls: "f-absent", label: "Not in place" },
    unsure: { cls: "unsure", stCls: "st-unsure", fCls: "f-unsure", label: "Not sure" },
  };

  const priorityOrder = { not_in_place: 0, unsure: 1, partial: 2, in_place: 3 };
  const priorityItems = (answered) =>
    [...answered].sort((a, b) => priorityOrder[state.baseline[a.id]] - priorityOrder[state.baseline[b.id]]);

  const create = (tag, cls, html) => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (html != null) node.innerHTML = html;
    return node;
  };

  const countKeys = (obj) => Object.keys(obj || {}).length;

  function ensureGuidedState() {
    state.skippedBaseline = state.skippedBaseline || {};
    state.skippedMaturity = state.skippedMaturity || {};
    state.guided = state.guided || {
      baselineShowAll: false,
      maturityShowAll: false,
      baselineOpenId: null,
      maturityOpenId: null,
    };
  }

  function currentBaselineIndex() {
    return BASELINE_QUESTIONS.findIndex((question) =>
      !state.baseline[question.id] && !state.skippedBaseline[question.id]
    );
  }

  function currentMaturityIndex() {
    return MATURITY_THEMES.findIndex((theme) =>
      !state.maturity[theme.id] && !state.skippedMaturity[theme.id]
    );
  }

  function setChildrenHidden(card, collapsed) {
    Array.from(card.children).forEach((child) => {
      if (!child.classList.contains("guided-summary")) child.hidden = collapsed;
    });
  }

  function statusBadge(label, stateId) {
    if (!stateId) return `<span class="mat-badge">${label}</span>`;
    const meta = stateMeta[stateId];
    return `<span class="finding-state ${meta.stCls}">${meta.label}</span>`;
  }

  function ensureSummary(card) {
    let summary = card.querySelector(":scope > .guided-summary");
    if (!summary) {
      summary = create("div", "mat-row guided-summary");
      summary.hidden = true;
      card.insertBefore(summary, card.firstChild);
    }
    return summary;
  }

  function ensureGuidedControls(kind) {
    const textNode = document.querySelector(kind === "baseline" ? "#baseline-progress-text" : "#maturity-progress-text");
    const list = document.querySelector(kind === "baseline" ? "#baseline-list" : "#maturity-list");
    if (!textNode || !list) return;

    const progressLine = textNode.closest(".progress-line");
    if (progressLine && !progressLine.querySelector(`[data-guided-toggle="${kind}"]`)) {
      const toggle = create("button", "btn btn-ghost guided-toggle");
      toggle.type = "button";
      toggle.dataset.guidedToggle = kind;
      progressLine.appendChild(toggle);
    }

    const completeId = kind === "baseline" ? "baseline-guided-complete" : "maturity-guided-complete";
    if (!document.querySelector(`#${completeId}`)) {
      const complete = create("div", "empty-good guided-complete");
      complete.id = completeId;
      complete.hidden = true;
      list.insertAdjacentElement("afterend", complete);
    }
  }

  function addSkipButton(card, kind) {
    if (card.querySelector(`[data-guided-skip="${kind}"]`)) return;
    const label = kind === "baseline" ? "Skip for now" : "Skip this theme";
    const note = kind === "baseline"
      ? "Skipping keeps this out of the follow-up priorities. Use Not sure when uncertainty itself is the finding."
      : "Skipping keeps this theme out of the optional review for this pass.";
    const actions = create("div", "cta-row guided-card-actions", `
      <button class="btn btn-ghost" type="button" data-guided-skip="${kind}">${label}</button>
      <p class="m-connects">${note}</p>
    `);
    card.appendChild(actions);
  }

  function setupGuidedPass() {
    ensureGuidedState();

    BASELINE_QUESTIONS.forEach((question) => {
      const card = document.querySelector(`#card-${question.id}`);
      if (!card) return;
      card.dataset.guidedKind = "baseline";
      card.dataset.guidedId = question.id;
      ensureSummary(card);
      addSkipButton(card, "baseline");
    });

    MATURITY_THEMES.forEach((theme) => {
      const card = document.querySelector(`#${theme.anchor}`);
      if (!card) return;
      card.dataset.guidedKind = "maturity";
      card.dataset.guidedId = theme.id;
      ensureSummary(card);
      addSkipButton(card, "maturity");
    });

    ensureGuidedControls("baseline");
    ensureGuidedControls("maturity");
    syncGuidedProgress();
    applyGuidedFlow();
  }

  function updateBaselineCard(question, index, activeIndex) {
    const card = document.querySelector(`#card-${question.id}`);
    if (!card) return;

    const answered = state.baseline[question.id];
    const skipped = state.skippedBaseline[question.id];
    const open = state.guided.baselineOpenId === question.id;
    const showAll = state.guided.baselineShowAll;
    const complete = Boolean(answered || skipped);
    const reached = showAll || complete || open || index === activeIndex || activeIndex === -1;
    const collapsed = complete && !open;
    const summary = ensureSummary(card);

    card.hidden = !reached;
    card.classList.toggle("is-answered", Boolean(answered));
    card.classList.toggle("is-skipped", Boolean(skipped && !answered));
    card.classList.toggle("is-active", reached && !collapsed && !complete);
    card.classList.toggle("is-collapsed", reached && collapsed);

    if (!reached) return;

    if (collapsed) {
      const label = answered ? statusBadge("", answered) : statusBadge("Skipped for now");
      const action = answered ? "Change" : "Return to this";
      summary.innerHTML = `
        <span class="mat-name">${String(index + 1).padStart(2, "0")} · ${question.question}</span>
        ${label}
        <button class="btn btn-ghost" type="button" data-guided-open="baseline" data-guided-id="${question.id}">${action}</button>
      `;
      summary.hidden = false;
      setChildrenHidden(card, true);
    } else {
      summary.hidden = true;
      setChildrenHidden(card, false);
    }
  }

  function updateMaturityCard(theme, index, activeIndex) {
    const card = document.querySelector(`#${theme.anchor}`);
    if (!card) return;

    const considered = state.maturity[theme.id];
    const skipped = state.skippedMaturity[theme.id];
    const open = state.guided.maturityOpenId === theme.id;
    const showAll = state.guided.maturityShowAll;
    const complete = Boolean(considered || skipped);
    const reached = showAll || complete || open || index === activeIndex || activeIndex === -1;
    const collapsed = complete && !open;
    const summary = ensureSummary(card);

    card.hidden = !reached;
    card.classList.toggle("is-answered", Boolean(considered));
    card.classList.toggle("is-skipped", Boolean(skipped && !considered));
    card.classList.toggle("is-active", reached && !collapsed && !complete);
    card.classList.toggle("is-collapsed", reached && collapsed);

    if (!reached) return;

    if (collapsed) {
      const label = considered
        ? `<span class="mat-badge b-set">${MATURITY_STATES.find((entry) => entry.id === considered).label}</span>`
        : statusBadge("Skipped for now");
      const action = considered ? "Change" : "Return to this";
      summary.innerHTML = `
        <span class="mat-name">Theme ${String(index + 1).padStart(2, "0")} · ${theme.theme}</span>
        ${label}
        <button class="btn btn-ghost" type="button" data-guided-open="maturity" data-guided-id="${theme.id}">${action}</button>
      `;
      summary.hidden = false;
      setChildrenHidden(card, true);
    } else {
      summary.hidden = true;
      setChildrenHidden(card, false);
    }
  }

  function updateCompletePanel(kind) {
    const isBaseline = kind === "baseline";
    const complete = document.querySelector(isBaseline ? "#baseline-guided-complete" : "#maturity-guided-complete");
    if (!complete) return;

    const total = isBaseline ? BASELINE_QUESTIONS.length : MATURITY_THEMES.length;
    const answered = countKeys(isBaseline ? state.baseline : state.maturity);
    const skipped = countKeys(isBaseline ? state.skippedBaseline : state.skippedMaturity);
    const remaining = total - answered - skipped;
    const label = isBaseline ? "baseline" : "optional themes";
    const returnLabel = isBaseline ? "Return to skipped questions" : "Return to skipped themes";

    complete.hidden = remaining !== 0;
    if (remaining !== 0) return;

    complete.innerHTML = `
      <p>You have completed this pass through the ${label}.</p>
      <p>${answered} ${isBaseline ? "answered" : "considered"} · ${skipped} skipped</p>
      ${skipped ? `<div class="cta-row"><button class="btn btn-ghost" type="button" data-guided-return-skipped="${kind}">${returnLabel}</button></div>` : ""}
    `;
  }

  function syncGuidedProgress() {
    ensureGuidedState();

    const bTotal = BASELINE_QUESTIONS.length;
    const bAnswered = countKeys(state.baseline);
    const bSkipped = countKeys(state.skippedBaseline);
    const bRemaining = bTotal - bAnswered - bSkipped;
    const bFill = document.querySelector("#baseline-progress-fill");
    const bText = document.querySelector("#baseline-progress-text");
    if (bFill) bFill.style.width = `${((bAnswered + bSkipped) / bTotal) * 100}%`;
    if (bText) {
      bText.textContent = bSkipped
        ? `${bAnswered} answered · ${bSkipped} skipped · ${bRemaining} remaining`
        : `${bAnswered} of ${bTotal} answered`;
    }

    const mTotal = MATURITY_THEMES.length;
    const mConsidered = countKeys(state.maturity);
    const mSkipped = countKeys(state.skippedMaturity);
    const mRemaining = mTotal - mConsidered - mSkipped;
    const mFill = document.querySelector("#maturity-progress-fill");
    const mText = document.querySelector("#maturity-progress-text");
    if (mFill) mFill.style.width = `${((mConsidered + mSkipped) / mTotal) * 100}%`;
    if (mText) {
      mText.textContent = mSkipped
        ? `${mConsidered} considered · ${mSkipped} skipped · ${mRemaining} remaining`
        : `${mConsidered} of ${mTotal} considered`;
    }

    const btn = document.querySelector("#generate-btn");
    if (btn) {
      btn.disabled = bAnswered === 0;
      if (bAnswered > 0) {
        btn.textContent = bRemaining > 0
          ? `See your summary (${bAnswered} answered${bSkipped ? `, ${bSkipped} skipped` : ""})`
          : "See your summary";
      } else {
        btn.textContent = "Answer at least one question to continue";
      }
    }

    const baselineToggle = document.querySelector('[data-guided-toggle="baseline"]');
    if (baselineToggle) baselineToggle.textContent = state.guided.baselineShowAll ? "Return to guided view" : "Show all questions";
    const maturityToggle = document.querySelector('[data-guided-toggle="maturity"]');
    if (maturityToggle) maturityToggle.textContent = state.guided.maturityShowAll ? "Return to guided view" : "Show all themes";
  }

  function applyGuidedFlow() {
    ensureGuidedState();
    const activeBaseline = currentBaselineIndex();
    const activeMaturity = currentMaturityIndex();

    BASELINE_QUESTIONS.forEach((question, index) => updateBaselineCard(question, index, activeBaseline));
    MATURITY_THEMES.forEach((theme, index) => updateMaturityCard(theme, index, activeMaturity));

    updateCompletePanel("baseline");
    updateCompletePanel("maturity");
    syncGuidedProgress();
  }

  function firstVisibleActive(kind) {
    if (kind === "baseline") {
      const open = state.guided.baselineOpenId && document.querySelector(`#card-${state.guided.baselineOpenId}`);
      if (open && !open.hidden) return open;
      const index = currentBaselineIndex();
      return index >= 0 ? document.querySelector(`#card-${BASELINE_QUESTIONS[index].id}`) : document.querySelector("#baseline-guided-complete");
    }

    const open = state.guided.maturityOpenId && document.querySelector(`#${MATURITY_THEMES.find((theme) => theme.id === state.guided.maturityOpenId)?.anchor}`);
    if (open && !open.hidden) return open;
    const index = currentMaturityIndex();
    return index >= 0 ? document.querySelector(`#${MATURITY_THEMES[index].anchor}`) : document.querySelector("#maturity-guided-complete");
  }

  function scrollGuided(kind) {
    if ((kind === "baseline" && state.guided.baselineShowAll) || (kind === "maturity" && state.guided.maturityShowAll)) return;
    const target = firstVisibleActive(kind);
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function clearPressedButtons(card, selector) {
    card.querySelectorAll(selector).forEach((button) => button.setAttribute("aria-pressed", "false"));
  }

  function handleGuidedClick(event) {
    const answer = event.target.closest(".answer");
    if (answer && answer.closest("#baseline-list")) {
      const card = answer.closest(".q-card");
      const id = card?.dataset.guidedId;
      if (id) {
        delete state.skippedBaseline[id];
        state.guided.baselineOpenId = null;
        applyGuidedFlow();
        scrollGuided("baseline");
      }
      return;
    }

    const maturityOption = event.target.closest(".m-opt");
    if (maturityOption && maturityOption.closest("#maturity-list")) {
      const card = maturityOption.closest(".m-card");
      const id = card?.dataset.guidedId;
      if (id) {
        delete state.skippedMaturity[id];
        state.guided.maturityOpenId = null;
        applyGuidedFlow();
        scrollGuided("maturity");
      }
      return;
    }

    const skip = event.target.closest("[data-guided-skip]");
    if (skip) {
      event.preventDefault();
      const kind = skip.dataset.guidedSkip;
      const card = skip.closest(kind === "baseline" ? ".q-card" : ".m-card");
      const id = card?.dataset.guidedId;
      if (!id) return;

      if (kind === "baseline") {
        delete state.baseline[id];
        state.skippedBaseline[id] = true;
        state.guided.baselineOpenId = null;
        clearPressedButtons(card, ".answer");
      } else {
        delete state.maturity[id];
        state.skippedMaturity[id] = true;
        state.guided.maturityOpenId = null;
        clearPressedButtons(card, ".m-opt");
      }

      applyGuidedFlow();
      scrollGuided(kind);
      return;
    }

    const open = event.target.closest("[data-guided-open]");
    if (open) {
      event.preventDefault();
      const kind = open.dataset.guidedOpen;
      if (kind === "baseline") state.guided.baselineOpenId = open.dataset.guidedId;
      else state.guided.maturityOpenId = open.dataset.guidedId;
      applyGuidedFlow();
      scrollGuided(kind);
      return;
    }

    const toggle = event.target.closest("[data-guided-toggle]");
    if (toggle) {
      event.preventDefault();
      const kind = toggle.dataset.guidedToggle;
      if (kind === "baseline") state.guided.baselineShowAll = !state.guided.baselineShowAll;
      else state.guided.maturityShowAll = !state.guided.maturityShowAll;
      applyGuidedFlow();
      return;
    }

    const returnSkipped = event.target.closest("[data-guided-return-skipped]");
    if (returnSkipped) {
      event.preventDefault();
      const kind = returnSkipped.dataset.guidedReturnSkipped;
      if (kind === "baseline") {
        const skipped = BASELINE_QUESTIONS.find((question) => state.skippedBaseline[question.id]);
        if (skipped) state.guided.baselineOpenId = skipped.id;
      } else {
        const skipped = MATURITY_THEMES.find((theme) => state.skippedMaturity[theme.id]);
        if (skipped) state.guided.maturityOpenId = skipped.id;
      }
      applyGuidedFlow();
      scrollGuided(kind);
    }
  }

  function renderPriorityFinding(question, stateId) {
    const meta = stateMeta[stateId];
    const vis = VISIBILITY[question.visibility];
    const visTag = question.visibility === "external"
      ? `<span class="tag tag-external">${ICONS.eye}${vis.label}</span>`
      : `<span class="tag tag-internal">${ICONS.lock}${vis.label}</span>`;

    return create("article", `finding ${meta.fCls}`, `
      <div class="finding-head">
        <span class="finding-q">${question.question}</span>
        <span class="finding-state ${meta.stCls}">${meta.label}</span>
      </div>
      <div class="finding-layers">
        <div class="layer"><span class="layer-label">Board / exec / risk</span><span class="layer-text">${question.board}</span></div>
        <div class="layer"><span class="layer-label">Technical</span><span class="layer-text">${question.tech}</span></div>
        <div class="layer"><span class="layer-label">Public trust / service impact</span><span class="layer-text">${question.publicOrg}</span></div>
      </div>
      <div class="finding-visibility">${visTag}</div>
    `);
  }

  function renderSkippedBaselineSummary(skippedBaseline) {
    if (!skippedBaseline.length) return null;
    const block = create("div", "guided-skipped-reflection");
    block.appendChild(create("h4", "m-theme", "Questions skipped in this pass"));
    block.appendChild(create("p", "block-intro", "Skipped questions are not treated as findings. Return to them if they are relevant to this review."));
    skippedBaseline.forEach((question) => {
      block.appendChild(create("div", "mat-row", `<span class="mat-name">${question.question}</span><span class="mat-badge">Skipped for now</span>`));
    });
    return block;
  }

  function buildPriorityFirstReview() {
    ensureGuidedState();
    const answered = BASELINE_QUESTIONS.filter((question) => state.baseline[question.id]);
    const skippedBaseline = BASELINE_QUESTIONS.filter((question) => state.skippedBaseline[question.id]);
    const skippedMaturity = MATURITY_THEMES.filter((theme) => state.skippedMaturity[theme.id]);
    const counts = { in_place: 0, partial: 0, not_in_place: 0, unsure: 0 };
    answered.forEach((question) => counts[state.baseline[question.id]]++);

    const gapCount = counts.not_in_place + counts.unsure + counts.partial;
    const intro = document.querySelector("#reflection-intro-text");
    if (gapCount === 0 && counts.in_place === answered.length) {
      intro.textContent = "Every attempted baseline question is marked in place. Treat that as a useful starting position, not a score. The next step is to keep those answers current through recurring review.";
    } else if (counts.unsure >= 3) {
      intro.textContent = "Several answers are not sure. That is the most useful finding: uncertainty shows where accountability, evidence or ownership is missing. Resolve those questions first.";
    } else {
      intro.textContent = "This review summary leads with priorities for follow-up rather than a score. Use it to decide which domain-governance questions need ownership, evidence, remediation or escalation.";
    }

    const sorted = priorityItems(answered);
    const gapItems = sorted.filter((question) => state.baseline[question.id] !== "in_place");
    const goodItems = sorted.filter((question) => state.baseline[question.id] === "in_place");

    const gapsBlock = document.querySelector("#gaps-block");
    gapsBlock.innerHTML = "";
    if (gapItems.length === 0) {
      gapsBlock.appendChild(create("div", "empty-good", "Every attempted baseline question is in place. Use the recurring-review guide to keep the evidence, ownership and practices current."));
    } else {
      gapItems.forEach((question) => gapsBlock.appendChild(renderPriorityFinding(question, state.baseline[question.id])));
    }
    const skippedSummary = renderSkippedBaselineSummary(skippedBaseline);
    if (skippedSummary) gapsBlock.appendChild(skippedSummary);

    const grid = document.querySelector("#summary-grid");
    grid.innerHTML = "";
    [
      { key: "not_in_place", cls: "stat-absent", label: "not in place" },
      { key: "unsure", cls: "stat-unsure", label: "not sure" },
      { key: "partial", cls: "stat-partial", label: "partial" },
      { key: "in_place", cls: "stat-good", label: "in place" },
    ].forEach((item) => {
      grid.appendChild(create("div", `summary-stat ${item.cls}`, `<div class="s-count">${counts[item.key]}</div><div class="s-label">${item.label}</div>`));
    });
    if (skippedBaseline.length) {
      grid.appendChild(create("div", "summary-stat stat-unsure", `<div class="s-count">${skippedBaseline.length}</div><div class="s-label">skipped</div>`));
    }

    const extAnswered = answered.filter((question) => question.visibility === "external");
    const extGaps = extAnswered.filter((question) => state.baseline[question.id] !== "in_place");
    const extBlock = document.querySelector("#external-block");
    extBlock.innerHTML = "";
    const extText = extAnswered.length === 0
      ? "You did not answer any of the externally observable questions. Revisit authoritative DNS, sending domains and email authentication as externally visible signals."
      : extGaps.length === 0
        ? `All ${extAnswered.length} externally observable items you answered are in place. Treat that as a prompt to keep reviewing the public trust surface, not as proof that everything behind it is well governed.`
        : `${extGaps.length} of ${extAnswered.length} externally observable items are not fully in place. Because these signals are visible from outside your organisation, they shape how others read your public trust surface before you explain the internal reality behind them.`;
    extBlock.appendChild(create("p", "block-intro", extText));
    extAnswered.forEach((question) => {
      const meta = stateMeta[state.baseline[question.id]];
      extBlock.appendChild(create("div", "mat-row", `<span class="mat-name">${question.question}</span><span class="finding-state ${meta.stCls}">${meta.label}</span>`));
    });
    extBlock.appendChild(create("div", "q-linkout-wrap", `<a class="q-linkout" href="${THREATSCOPE_URL}" target="_blank" rel="noopener">${ICONS.eye}See these external signals for your own domain with ThreatScope Check</a>`));

    const goodBlock = document.querySelector("#good-block");
    goodBlock.innerHTML = "";
    if (goodItems.length === 0) {
      goodBlock.appendChild(create("div", "empty-good", "No baseline items were marked fully in place yet."));
    } else {
      goodItems.forEach((question) => goodBlock.appendChild(renderPriorityFinding(question, "in_place")));
    }

    const matBlock = document.querySelector("#maturity-summary");
    matBlock.innerHTML = "";
    const considered = MATURITY_THEMES.filter((theme) => state.maturity[theme.id]);
    if (considered.length === 0 && skippedMaturity.length === 0) {
      matBlock.appendChild(create("div", "empty-good", "You have not considered the optional themes in this pass. Use them only where they help deepen portfolio, supplier, change, monitoring, public-signal or executive-governance work."));
    } else {
      MATURITY_THEMES.forEach((theme) => {
        const chosen = state.maturity[theme.id];
        const skipped = state.skippedMaturity[theme.id];
        const label = chosen ? MATURITY_STATES.find((entry) => entry.id === chosen).label : skipped ? "Skipped for now" : "Not considered";
        matBlock.appendChild(create("div", "mat-row", `<span class="mat-name">${theme.theme}</span><span class="mat-badge ${chosen ? "b-set" : ""}">${label}</span>`));
      });
    }

    document.querySelector("#reflection-section").classList.add("is-visible");
    document.querySelector("#reflection-section").scrollIntoView({ behavior: "smooth" });
  }

  function buildReviewSummaryText() {
    ensureGuidedState();
    const answered = BASELINE_QUESTIONS.filter((question) => state.baseline[question.id]);
    const skippedBaseline = BASELINE_QUESTIONS.filter((question) => state.skippedBaseline[question.id]);
    const counts = { in_place: 0, partial: 0, not_in_place: 0, unsure: 0 };
    answered.forEach((question) => counts[state.baseline[question.id]]++);
    const sorted = priorityItems(answered);
    const gapItems = sorted.filter((question) => state.baseline[question.id] !== "in_place");
    const goodItems = sorted.filter((question) => state.baseline[question.id] === "in_place");
    const extAnswered = answered.filter((question) => question.visibility === "external");

    const lines = [];
    const wrap = (text, indent = "    ", width = 76) => {
      const words = String(text).split(/\s+/);
      const out = [];
      let line = indent;
      words.forEach((word) => {
        if ((line + word).length > width && line.trim().length) {
          out.push(line);
          line = indent + word + " ";
        } else {
          line += word + " ";
        }
      });
      if (line.trim().length) out.push(line.replace(/\s+$/, ""));
      return out;
    };

    const addFinding = (question) => {
      const label = stateMeta[state.baseline[question.id]].label;
      const visibility = question.visibility === "external" ? "externally observable" : "internal only";
      lines.push(`- ${question.question} [${label}; ${visibility}]`);
      lines.push("  Board / exec / risk:");
      lines.push(...wrap(question.board));
      lines.push("  Technical:");
      lines.push(...wrap(question.tech));
      lines.push("  Public trust / service impact:");
      lines.push(...wrap(question.publicOrg));
      lines.push("");
    };

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

    lines.push("PRIORITIES FOR FOLLOW-UP");
    if (gapItems.length === 0) {
      lines.push("Every attempted baseline question is marked in place. Use recurring review to keep the evidence, ownership and practices current.");
      lines.push("");
    } else {
      gapItems.forEach(addFinding);
    }

    if (skippedBaseline.length) {
      lines.push("QUESTIONS SKIPPED IN THIS PASS");
      skippedBaseline.forEach((question) => lines.push(`- ${question.question}`));
      lines.push("");
    }

    lines.push("PUBLIC TRUST SURFACE");
    if (extAnswered.length === 0) {
      lines.push("No externally observable questions were answered. Revisit authoritative DNS, sending domains and email authentication as externally visible signals.");
    } else {
      extAnswered.forEach((question) => lines.push(`- ${question.question}: ${stateMeta[state.baseline[question.id]].label}`));
    }
    lines.push("");

    lines.push("SUMMARY COUNTS - CONTEXT ONLY, NOT A SCORE");
    lines.push(`- Not in place: ${counts.not_in_place}`);
    lines.push(`- Not sure: ${counts.unsure}`);
    lines.push(`- Partial: ${counts.partial}`);
    lines.push(`- In place: ${counts.in_place}`);
    if (skippedBaseline.length) lines.push(`- Skipped this pass: ${skippedBaseline.length}`);
    lines.push("");

    lines.push("WHAT IS ALREADY IN PLACE");
    if (goodItems.length === 0) lines.push("No baseline items were marked fully in place yet.");
    else goodItems.forEach((question) => lines.push(`- ${question.question}`));
    lines.push("");

    lines.push("OPTIONAL FOLLOW-ON THEMES");
    MATURITY_THEMES.forEach((theme, index) => {
      const chosen = state.maturity[theme.id];
      const skipped = state.skippedMaturity?.[theme.id];
      const label = chosen ? MATURITY_STATES.find((entry) => entry.id === chosen).label : skipped ? "Skipped for now" : "Not considered";
      lines.push(`${String(index + 1).padStart(2, "0")}. ${theme.theme}: ${label}`);
      lines.push(...wrap(theme.good));
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

  window.buildTextReport = buildReviewSummaryText;

  setupGuidedPass();
  document.addEventListener("click", handleGuidedClick, false);

  const generateButton = document.querySelector("#generate-btn");
  if (generateButton) {
    generateButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      buildPriorityFirstReview();
    }, true);
  }

  const copyButton = document.querySelector("#copy-btn");
  if (copyButton) {
    copyButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        await navigator.clipboard.writeText(buildReviewSummaryText());
        showToast("Review summary copied to clipboard");
      } catch (_error) {
        showToast("Copy not available - use Print / Save instead");
      }
    }, true);
  }
})();