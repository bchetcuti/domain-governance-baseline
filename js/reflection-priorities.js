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

  // A response alone does not establish organisational risk priority.
  const priorityItems = (answered) => [...answered];

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

  // Review coverage describes participation, not maturity or assurance.
  // Skipped questions remain distinct from unknown answers ("Not sure").
  function getReviewCoverage() {
    ensureGuidedState();
    const total = BASELINE_QUESTIONS.length;
    const answered = BASELINE_QUESTIONS.filter((question) => state.baseline[question.id]).length;
    const skipped = BASELINE_QUESTIONS.filter((question) => !state.baseline[question.id] && state.skippedBaseline[question.id]).length;
    return {
      total,
      answered,
      skipped,
      unaddressed: total - answered - skipped,
      complete: answered === total,
    };
  }

  function coverageDescription(coverage) {
    if (coverage.complete) {
      return "All ten questions were answered in this pass. This records stated responses, not independent validation of evidence, control effectiveness or assurance.";
    }
    return "This is a partial review. Skipped or unaddressed questions are not assessed and must not be treated as in place. Return to them if they matter to the decision.";
  }

  function renderReviewCoverage() {
    const coverage = getReviewCoverage();
    const label = document.querySelector("#review-coverage-label");
    const counts = document.querySelector("#review-coverage-counts");
    const detail = document.querySelector("#review-coverage-detail");
    if (!label || !counts || !detail) return;

    label.textContent = coverage.complete ? "Complete ten-question pass" : "Partial review";
    label.classList.toggle("is-complete", coverage.complete);
    counts.textContent = `${coverage.answered} of ${coverage.total} answered · ${coverage.skipped} skipped · ${coverage.unaddressed} unaddressed`;
    detail.textContent = coverageDescription(coverage);
  }

  function coverageExportLines() {
    const coverage = getReviewCoverage();
    return [
      "REVIEW COVERAGE",
      `Status: ${coverage.complete ? "Complete ten-question pass" : "Partial review"}`,
      `Questions: ${coverage.answered} of ${coverage.total} answered; ${coverage.skipped} skipped; ${coverage.unaddressed} unaddressed.`,
      coverageDescription(coverage),
      "",
    ];
  }

  function governanceHandoffLines() {
    return [
      "HAND-OFF TO EXISTING GOVERNANCE",
      "Use this summary in an existing technology, risk, supplier or service forum.",
      "For each material open question:",
      "- Confirm the missing evidence or record, including supplier evidence where needed.",
      "- Record an accountable owner, decision or action, and a follow-up date.",
      "- Revisit unresolved questions and exceptions in the existing review cadence.",
      "Recurring review guide: https://baseline.bryanchetcuti.com/resources/recurring-domain-governance-review/",
      "",
    ];
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

    // Optional themes are guidance, not a second guided assessment.
    ensureGuidedControls("baseline");
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

    const optional = document.querySelector("#maturity-progress-text");
    if (optional) optional.textContent =
      `${countKeys(state.maturity)} of ${MATURITY_THEMES.length} selected for follow-up`;

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
  }

  function applyGuidedFlow() {
    ensureGuidedState();
    const activeBaseline = currentBaselineIndex();
    BASELINE_QUESTIONS.forEach((question, index) => updateBaselineCard(question, index, activeBaseline));
    updateCompletePanel("baseline");
    syncGuidedProgress();
    renderReviewOverview();
  }

  function renderReviewOverview() {
    const list = document.querySelector("#review-question-overview");
    if (!list) return;
    const active = state.guided.baselineOpenId ||
      BASELINE_QUESTIONS[currentBaselineIndex()]?.id || null;
    list.replaceChildren();
    BASELINE_QUESTIONS.forEach((question, index) => {
      const answered = state.baseline[question.id];
      const skipped = !answered && state.skippedBaseline[question.id];
      const label = answered ? stateMeta[answered].label : skipped ? "Skipped" : "Unanswered";
      const row = create("li", "review-overview-row");
      const button = create("button", "review-overview-button");
      button.type = "button";
      button.dataset.reviewOpen = question.id;
      if (active === question.id) button.setAttribute("aria-current", "step");
      button.append(
        create("span", "review-overview-number", String(index + 1).padStart(2, "0")),
        create("span", "review-overview-name", question.domain),
        create("span", "review-overview-status", label)
      );
      row.appendChild(button);
      list.appendChild(row);
    });
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
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (kind === "baseline") {
        target.tabIndex = -1;
        target.focus({ preventScroll: true });
      }
    }
  }

  function clearPressedButtons(card, selector) {
    card.querySelectorAll(selector).forEach((button) => button.setAttribute("aria-pressed", "false"));
  }

  // A visible summary is a snapshot. Once an answer changes it must be
  // regenerated before copy or print can expose an outdated result.
  function invalidateGeneratedReview() {
    const summary = document.querySelector("#reflection-section");
    if (!summary?.classList.contains("is-visible")) return;

    summary.classList.remove("is-visible");
    const notice = document.querySelector("#review-refresh-notice");
    if (notice) notice.hidden = false;
  }

  function handleGuidedClick(event) {
    const overview = event.target.closest("[data-review-open]");
    if (overview) {
      event.preventDefault();
      state.guided.baselineOpenId = overview.dataset.reviewOpen;
      applyGuidedFlow();
      const card = document.querySelector("#card-" + state.guided.baselineOpenId);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "start" });
        card.focus({ preventScroll: true });
      }
      return;
    }
    const answer = event.target.closest(".answer");
    if (answer && answer.closest("#baseline-list")) {
      const card = answer.closest(".q-card");
      const id = card?.dataset.guidedId;
      if (id) {
        delete state.skippedBaseline[id];
        invalidateGeneratedReview();
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
        invalidateGeneratedReview();
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

      invalidateGeneratedReview();
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
    const index = BASELINE_QUESTIONS.findIndex((entry) => entry.id === question.id) + 1;
    const vis = VISIBILITY[question.visibility];
    const visTag = question.visibility === "external"
      ? `<span class="tag tag-external">${ICONS.eye}${vis.label}</span>`
      : `<span class="tag tag-internal">${ICONS.lock}${vis.label}</span>`;
    return create("article", `finding review-brief-finding ${meta.fCls}`, `
      <div class="finding-head">
        <span class="review-finding-index">Q${String(index).padStart(2, "0")}</span>
        <span class="finding-state ${meta.stCls}">${meta.label}</span>
      </div>
      <h4 class="finding-q">${question.question}</h4>
      <p class="review-finding-action"><strong>Evidence to confirm:</strong> ${question.tech}</p>
      <details class="review-finding-context">
        <summary>Supporting governance interpretation</summary>
        <div class="finding-layers">
          <div class="layer"><span class="layer-label">Board / exec / risk</span><span class="layer-text">${question.board}</span></div>
          <div class="layer"><span class="layer-label">Technical</span><span class="layer-text">${question.tech}</span></div>
          <div class="layer"><span class="layer-label">Public trust / service impact</span><span class="layer-text">${question.publicOrg}</span></div>
        </div>
        <div class="finding-visibility">${visTag}</div>
      </details>
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

  // Editorial cross-references, not inferred risks or ranked recommendations.
  // m6 spans the full Baseline; it is always available in Explore all.
  const themeQuestions = {
    m1: ["b1", "b2"], m2: ["b5", "b6"], m3: ["b9"],
    m4: ["b10"], m5: ["b5", "b7", "b8"], m6: [],
  };
  const referencesFor = (theme) =>
    (themeQuestions[theme.id] || []).map((id) => {
      const index = BASELINE_QUESTIONS.findIndex((q) => q.id === id);
      return index < 0 ? null : `Q${String(index + 1).padStart(2, "0")}`;
    }).filter(Boolean);

  function renderThemeConnections() {
    const list = document.querySelector("#review-theme-contextual-list");
    if (!list) return;
    list.replaceChildren();
    const related = MATURITY_THEMES.map((theme) => {
      const connected = (themeQuestions[theme.id] || []).filter((id) =>
        state.baseline[id] && state.baseline[id] !== "in_place"
      );
      return { theme, connected };
    }).filter((item) => item.connected.length);
    if (!related.length) {
      const message = create("p", "review-no-topics");
      message.textContent = "No themes are linked to a question marked for follow-up in this pass. All six themes remain available to explore.";
      list.appendChild(message);
      return;
    }
    related.forEach(({ theme, connected }) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "review-theme-connection";
      button.dataset.followOnTheme = theme.id;
      const title = create("strong");
      title.textContent = theme.theme;
      const prompt = create("span");
      prompt.textContent = `Connects to ${connected.map((id) =>
        `Q${String(BASELINE_QUESTIONS.findIndex((q) => q.id === id) + 1).padStart(2, "0")}`
      ).join(", ")}`;
      button.append(title, prompt);
      list.appendChild(button);
    });
  }

  function renderSelectedFollowOn() {
    const matBlock = document.querySelector("#maturity-summary");
    const container = document.querySelector("#review-selected-topics");
    if (!matBlock || !container) return;
    matBlock.replaceChildren();
    const selectedThemes = MATURITY_THEMES.filter((theme) => state.maturity[theme.id] === "selected");
    container.hidden = selectedThemes.length === 0;
    selectedThemes.forEach((theme) => {
      const article = create("article", "review-selected-topic");
      const heading = create("h5");
      heading.textContent = theme.theme;
      const ref = create("span", "review-theme-reference");
      const references = referencesFor(theme);
      ref.textContent = references.length ? `Extends ${references.join(", ")}` : "Across the full Baseline";
      const good = create("p");
      good.textContent = theme.good;
      const edit = document.createElement("button");
      edit.type = "button";
      edit.className = "review-theme-edit";
      edit.dataset.followOnTheme = theme.id;
      edit.textContent = "Review selection";
      article.append(heading, ref, good, edit);
      matBlock.appendChild(article);
    });
  }

  function buildPriorityFirstReview() {
    ensureGuidedState();
    const answered = BASELINE_QUESTIONS.filter((question) => state.baseline[question.id]);
    const skippedBaseline = BASELINE_QUESTIONS.filter((question) => state.skippedBaseline[question.id]);
    const skippedMaturity = MATURITY_THEMES.filter((theme) => state.skippedMaturity[theme.id]);
    renderReviewCoverage();
    const counts = { in_place: 0, partial: 0, not_in_place: 0, unsure: 0 };
    answered.forEach((question) => counts[state.baseline[question.id]]++);

    const gapCount = counts.not_in_place + counts.unsure + counts.partial;
    const intro = document.querySelector("#reflection-intro-text");
    intro.textContent = gapCount
      ? `${gapCount} answered question${gapCount === 1 ? "" : "s"} invite follow-up. Decide significance and next actions in an existing governance forum.`
      : "No answered questions flagged for follow-up. Validate the evidence and revisit it through recurring review.";

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
    const unaddressedBlock = document.querySelector("#unaddressed-block");
    unaddressedBlock.replaceChildren();
    const notAddressed = BASELINE_QUESTIONS.filter((question) => !state.baseline[question.id]);
    const unaddressedSection = document.querySelector(".review-unaddressed");
    if (unaddressedSection) unaddressedSection.hidden = notAddressed.length === 0;
    const unaddressedCount = document.querySelector("#review-unaddressed-count");
    if (unaddressedCount) unaddressedCount.textContent =
      `${notAddressed.length} to revisit`;
    if (!notAddressed.length) {
      unaddressedBlock.appendChild(create("p", "block-intro", "All ten questions were answered."));
    } else {
      notAddressed.forEach((question) => {
        const skipped = state.skippedBaseline[question.id];
        const index = BASELINE_QUESTIONS.indexOf(question) + 1;
        unaddressedBlock.appendChild(create("div", "mat-row",
          `<span class="mat-name">Q${String(index).padStart(2, "0")} · ${question.question}</span><span class="mat-badge">${skipped ? "Skipped for now" : "Not addressed"}</span>`));
      });
    }

    const grid = document.querySelector("#summary-grid");
    grid.replaceChildren();
    const coverage = getReviewCoverage();
    [
      { count: `${coverage.answered} of ${coverage.total}`, label: "questions answered" },
      { count: String(gapCount), label: "answered questions for follow-up" },
      { count: String(coverage.skipped + coverage.unaddressed), label: "skipped or unaddressed" },
    ].forEach((entry) => grid.appendChild(create("div", "summary-stat",
      `<div class="s-count">${entry.count}</div><div class="s-label">${entry.label}</div>`)));
    const breakdown = document.querySelector("#review-brief-breakdown");
    if (breakdown) breakdown.textContent =
      `Among answered: ${counts.not_in_place} not in place · ${counts.unsure} not sure · ${counts.partial} partial · ${counts.in_place} in place. ${coverage.skipped} skipped; ${coverage.unaddressed} unaddressed. Counts describe this review, not risk or maturity.`;

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

    renderThemeConnections();
    renderSelectedFollowOn();

    const notice = document.querySelector("#review-refresh-notice");
    if (notice) notice.hidden = true;
    document.querySelector("#reflection-section").classList.add("is-visible");
    document.querySelector("#reflection-section").scrollIntoView({ behavior: "smooth" });
  }

  function buildReviewSummaryText() {
    ensureGuidedState();
    const answered = BASELINE_QUESTIONS.filter((question) => state.baseline[question.id]);
    const followUp = answered.filter((question) => state.baseline[question.id] !== "in_place");
    const inPlace = answered.filter((question) => state.baseline[question.id] === "in_place");
    const missing = BASELINE_QUESTIONS.filter((question) => !state.baseline[question.id]);
    const selectedThemes = MATURITY_THEMES.filter((theme) => state.maturity[theme.id]);
    const lines = [
      "DOMAIN GOVERNANCE BASELINE",
      "Governance review brief · Version 1.0",
      "Created and stewarded by Bryan Chetcuti",
      "https://baseline.bryanchetcuti.com/",
      "",
      `Generated locally: ${new Date().toLocaleString()}`,
      "",
      ...coverageExportLines(),
      "QUESTIONS FOR GOVERNANCE DISCUSSION (CANONICAL QUESTION ORDER)",
      "The selected response does not determine risk or action priority.",
    ];
    if (!followUp.length) lines.push("No answered questions marked for follow-up in this pass.");
    followUp.forEach((question) => {
      const index = BASELINE_QUESTIONS.indexOf(question) + 1;
      const label = stateMeta[state.baseline[question.id]].label;
      lines.push(`Q${String(index).padStart(2, "0")} · ${question.question} [${label}]`);
      lines.push(`  Evidence to confirm: ${question.tech}`);
      lines.push("");
    });
    lines.push("", "NOT ADDRESSED IN THIS PASS");
    if (!missing.length) lines.push("All ten questions were answered.");
    missing.forEach((question) => {
      const index = BASELINE_QUESTIONS.indexOf(question) + 1;
      lines.push(`Q${String(index).padStart(2, "0")} · ${question.question} - ${state.skippedBaseline[question.id] ? "Skipped for now" : "Not addressed"}`);
    });
    lines.push("", "WHERE TO TAKE THIS FURTHER - OPTIONAL THEMES");
    if (!selectedThemes.length) lines.push("None selected. The ten-question review stands on its own.");
    selectedThemes.forEach((theme) => {
      const refs = referencesFor(theme);
      lines.push(`- ${theme.theme}: Selected for discussion, not assessed`);
      lines.push(`  ${refs.length ? "Extends " + refs.join(", ") : "Across the full Baseline"}`);
      lines.push(`  ${theme.good}`);
    });
    lines.push("", ...governanceHandoffLines());
    lines.push("", "SUPPORTING REVIEW DETAIL");
    lines.push("Publicly observable answers:");
    const external = answered.filter((question) => question.visibility === "external");
    if (!external.length) lines.push("None answered.");
    external.forEach((question) => lines.push(`- ${question.question}: ${stateMeta[state.baseline[question.id]].label}`));
    lines.push("", "Answers marked in place:");
    if (!inPlace.length) lines.push("None in this pass.");
    inPlace.forEach((question) => lines.push(`- ${question.question}`));
    lines.push("", "Detailed interpretation for questions requiring follow-up:");
    followUp.forEach((question) => {
      lines.push(`- ${question.question}`);
      lines.push(`  Board / executive: ${question.board}`);
      lines.push(`  Technical: ${question.tech}`);
      lines.push(`  Public trust / service impact: ${question.publicOrg}`);
      lines.push("");
    });
    lines.push("FINAL NOTE");
    lines.push("This is a private, browser-generated review aid, not independent validation,");
    lines.push("a risk rating, maturity score, compliance or assurance conclusion.");
    lines.push("Unanswered and skipped questions are not treated as in place.");
    lines.push("Evidence and decisions belong in existing organisational governance records.");
    lines.push("");
    lines.push("Citation and stewardship: https://baseline.bryanchetcuti.com/citation/");
    return lines.join("\n");
  }

  window.buildTextReport = buildReviewSummaryText;

  setupGuidedPass();
  document.addEventListener("click", handleGuidedClick, false);
  document.addEventListener("review:changed", () => {
    // Theme selection is part of a valid review's follow-up, not a change
    // to its ten answers. Reflect selection immediately in screen and export.
    syncGuidedProgress();
    renderSelectedFollowOn();
  });
  document.addEventListener("click", (event) => {
    const open = event.target.closest("[data-follow-on-theme]");
    if (!open) return;
    const theme = MATURITY_THEMES.find((item) => item.id === open.dataset.followOnTheme);
    if (!theme) return;
    const panel = document.querySelector("#optional-exploration");
    if (panel) panel.open = true;
    const card = document.getElementById(theme.anchor);
    if (card) {
      card.tabIndex = -1;
      card.scrollIntoView({ behavior: "smooth", block: "start" });
      card.focus({ preventScroll: true });
    }
  });

  const generateButton = document.querySelector("#generate-btn");
  if (generateButton) {
    generateButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      buildPriorityFirstReview();
    }, true);
  }

  // Printing never rebuilds the generated brief, which would discard the
  // reviewer's expanded supporting context. Restore their choices afterwards.
  let disclosureState = null;
  window.addEventListener("beforeprint", () => {
    if (!document.querySelector("#reflection-section")?.classList.contains("is-visible")) return;
    disclosureState = Array.from(document.querySelectorAll("#reflection-section details"))
      .map((detail) => [detail, detail.open]);
    disclosureState.forEach(([detail]) => { detail.open = true; });
  });
  window.addEventListener("afterprint", () => {
    if (!disclosureState) return;
    disclosureState.forEach(([detail, wasOpen]) => { detail.open = wasOpen; });
    disclosureState = null;
  });

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