/* ============================================================
   Conversation-first reflection output.
   Keeps the baseline as a reflection summary, not a score.
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

  function buildConversationFirstReflection() {
    const answered = BASELINE_QUESTIONS.filter((question) => state.baseline[question.id]);
    const counts = { in_place: 0, partial: 0, not_in_place: 0, unsure: 0 };
    answered.forEach((question) => counts[state.baseline[question.id]]++);

    const gapCount = counts.not_in_place + counts.unsure + counts.partial;
    const intro = document.querySelector("#reflection-intro-text");
    if (gapCount === 0 && counts.in_place === answered.length) {
      intro.textContent = "Every attempted baseline question is marked in place. Treat that as a useful starting position, not a score. The next governance conversation is how to keep those answers true over time.";
    } else if (counts.unsure >= 3) {
      intro.textContent = "Several answers are not sure. That is the most useful finding: uncertainty shows where accountability, evidence or ownership is missing. Start there.";
    } else {
      intro.textContent = "This reflection summary leads with conversation priorities rather than a score. Use it to decide which domain-governance questions need ownership, evidence or escalation.";
    }

    const sorted = priorityItems(answered);
    const gapItems = sorted.filter((question) => state.baseline[question.id] !== "in_place");
    const goodItems = sorted.filter((question) => state.baseline[question.id] === "in_place");

    const gapsBlock = document.querySelector("#gaps-block");
    gapsBlock.innerHTML = "";
    if (gapItems.length === 0) {
      gapsBlock.appendChild(create("div", "empty-good", "Every attempted baseline question is in place. Focus the next conversation on the maturity themes: portfolio, suppliers, change control, monitoring, public signals and executive reporting."));
    } else {
      gapItems.forEach((question) => gapsBlock.appendChild(renderPriorityFinding(question, state.baseline[question.id])));
    }

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
    if (considered.length === 0) {
      matBlock.appendChild(create("div", "empty-good", "You have not reflected on the maturity themes yet. Once the baseline is visible, these are the deeper conversations - portfolio, suppliers, change control, monitoring, public signals and executive reporting."));
    } else {
      MATURITY_THEMES.forEach((theme) => {
        const chosen = state.maturity[theme.id];
        const label = chosen ? MATURITY_STATES.find((entry) => entry.id === chosen).label : "Not considered";
        matBlock.appendChild(create("div", "mat-row", `<span class="mat-name">${theme.theme}</span><span class="mat-badge ${chosen ? "b-set" : ""}">${label}</span>`));
      });
    }

    document.querySelector("#reflection-section").classList.add("is-visible");
    document.querySelector("#reflection-section").scrollIntoView({ behavior: "smooth" });
  }

  function buildConversationBriefText() {
    const answered = BASELINE_QUESTIONS.filter((question) => state.baseline[question.id]);
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

    lines.push("DOMAIN GOVERNANCE BASELINE - REFLECTION SUMMARY");
    lines.push("Based on the essay: Domain Governance as a Trust Surface (Bryan Chetcuti)");
    lines.push(`Generated: ${new Date().toLocaleString()}`);
    lines.push("This is a reflection summary, not a score, report, rating or assurance instrument.");
    lines.push("=".repeat(64));
    lines.push("");

    lines.push("CONVERSATION PRIORITIES");
    if (gapItems.length === 0) {
      lines.push("Every attempted baseline question is marked in place. The next conversation is how to keep those answers true over time.");
      lines.push("");
    } else {
      gapItems.forEach(addFinding);
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
    lines.push("");

    lines.push("WHAT IS ALREADY IN PLACE");
    if (goodItems.length === 0) lines.push("No baseline items were marked fully in place yet.");
    else goodItems.forEach((question) => lines.push(`- ${question.question}`));
    lines.push("");

    lines.push("MATURITY THEMES");
    MATURITY_THEMES.forEach((theme, index) => {
      const chosen = state.maturity[theme.id];
      const label = chosen ? MATURITY_STATES.find((entry) => entry.id === chosen).label : "Not considered";
      lines.push(`${String(index + 1).padStart(2, "0")}. ${theme.theme}: ${label}`);
      lines.push(...wrap(theme.good));
      lines.push("");
    });

    lines.push("Remember: visible signals should not be over-interpreted. A missing signal does not mean an organisation is irresponsible; a passing signal does not mean everything behind it is well managed.");
    return lines.join("\n");
  }

  window.buildTextReport = buildConversationBriefText;

  const generateButton = document.querySelector("#generate-btn");
  if (generateButton) {
    generateButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      buildConversationFirstReflection();
    }, true);
  }

  const copyButton = document.querySelector("#copy-btn");
  if (copyButton) {
    copyButton.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      try {
        await navigator.clipboard.writeText(buildConversationBriefText());
        showToast("Reflection summary copied to clipboard");
      } catch (_error) {
        showToast("Copy not available - use Print / Save instead");
      }
    }, true);
  }
})();
