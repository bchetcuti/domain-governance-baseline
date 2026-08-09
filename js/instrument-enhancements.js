/* ============================================================
   Instrument identity enhancements: governance layers + pathways + citation.
   Keeps the baseline as a local review instrument, not a score.
   ============================================================ */
(function () {
  const BASELINE_VERSION = "1.0";
  const CITATION_URL = "https://baseline.bryanchetcuti.com/citation/";
  const openStates = new Set(["partial", "not_in_place", "unsure"]);

  const create = (tag, className, html) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (html != null) node.innerHTML = html;
    return node;
  };

  const layerFor = (question) => GOVERNANCE_LAYERS?.[question.layer];

  function answeredQuestions() {
    return BASELINE_QUESTIONS.filter((question) => state.baseline[question.id]);
  }

  function openQuestions() {
    return answeredQuestions().filter((question) => openStates.has(state.baseline[question.id]));
  }

  function questionsInLayers(questions, layers) {
    return questions.filter((question) => layers.includes(question.layer));
  }

  function hasOpenInLayers(layers) {
    return questionsInLayers(openQuestions(), layers).length > 0;
  }

  function hasOpenQuestionIds(ids) {
    return openQuestions().some((question) => ids.includes(question.id));
  }

  function entireLayerIsAnsweredAndInPlace(layer) {
    const layerQuestions = BASELINE_QUESTIONS.filter((question) => question.layer === layer);
    return layerQuestions.length > 0 && layerQuestions.every((question) => state.baseline[question.id] === "in_place");
  }

  function hasCompleteBaselineWithoutOpenFindings() {
    return answeredQuestions().length === BASELINE_QUESTIONS.length && openQuestions().length === 0;
  }

  function isExternalHref(href) {
    return /^https?:\/\//i.test(href);
  }

  function enhanceVersionIdentity() {
    const meta = document.querySelector(".instrument-meta dl");
    if (meta && !meta.querySelector("[data-baseline-version]")) {
      const versionRow = create("div", "", `
        <dt>Version</dt>
        <dd data-baseline-version>Domain Governance Baseline v${BASELINE_VERSION} - <a href="/citation/">citation and stewardship</a></dd>
      `);
      meta.prepend(versionRow);
    }

    const footerExplore = document.querySelector('.footer-nav[aria-label="Explore"] .footer-links');
    if (footerExplore && !footerExplore.querySelector('a[href="/citation/"]')) {
      footerExplore.appendChild(create("a", "", "Citation and stewardship"));
      footerExplore.lastElementChild.href = "/citation/";
    }

    const printKicker = document.querySelector(".print-brand-kicker");
    if (printKicker) printKicker.textContent = `Domain Governance Baseline v${BASELINE_VERSION}`;
  }

  function enhanceBaselineLayers() {
    BASELINE_QUESTIONS.forEach((question) => {
      const layer = layerFor(question);
      const card = document.querySelector(`#card-${question.id}`);
      if (!layer || !card || card.querySelector(".q-layer")) return;

      const domain = card.querySelector(".q-domain");
      if (!domain) return;

      domain.insertAdjacentElement("afterend", create("div", "q-layer", `
        <span class="q-layer-label">${layer.label}</span>
        <span class="q-layer-blurb">${layer.blurb}</span>
      `));
    });
  }

  function buildPathways() {
    const pathways = [];

    if (hasOpenQuestionIds(["b1", "b2", "b4", "b6"])) {
      pathways.push({
        label: "Visibility and ownership",
        title: "Establish a dependable domain register",
        summary: "Inventory, ownership, renewal or dependency uncertainty usually means the organisation lacks a complete view of which domains matter, why they exist and who is accountable for them.",
        action: "Build a minimum credible register covering purpose, accountable ownership, technical operation, registrar, DNS, renewal, email use, dependencies and unresolved questions.",
        href: "/resources/domain-register/",
        cta: "Establish a domain register",
      });
    }

    if (hasOpenQuestionIds(["b3", "b5", "b9"])) {
      pathways.push({
        label: "Registrar and DNS authority",
        title: "Control privileged domain authority",
        summary: "Registrar access, authoritative DNS or recoverable change uncertainty means the organisation cannot yet demonstrate who can alter public identity and service routing or how control would be regained.",
        action: "Map registrar, reseller, delegation, DNS and recovery authority; replace shared access; enforce MFA; and make material DNS changes approved, evidenced and reversible.",
        href: "/resources/registrar-dns-authority/",
        cta: "Control registrar and DNS authority",
      });
    }

    if (hasOpenInLayers(["email"])) {
      pathways.push({
        label: "Email authority and public signals",
        title: "Govern authorised senders and mail posture",
        summary: "Email trust uncertainty usually means the organisation cannot yet connect approved sending systems with visible From, return-path and DKIM identities, SPF authorisation, DMARC policy and reporting.",
        action: "Build an authorised-sender register, reconcile it with public SPF, DKIM and DMARC evidence, and remove obsolete or unowned supplier authority.",
        href: "/resources/email-authority-public-signals/",
        cta: "Govern email authority and public signals",
      });
    }

    if (hasOpenQuestionIds(["b10"])) {
      pathways.push({
        label: "Domain incident readiness",
        title: "Prepare the domain incident path",
        summary: "Incident-path uncertainty means the organisation cannot yet demonstrate who leads, who can act, which services matter, how provider authority is recovered or how changes will be validated under pressure.",
        action: "Extend the existing incident process with domain-layer triggers, roles, provider contacts, dependencies, known-good evidence, recovery steps and a tested exercise path.",
        href: "/resources/domain-incident-readiness/",
        cta: "Establish domain incident readiness",
      });
    }

    if (hasCompleteBaselineWithoutOpenFindings()) {
      pathways.push({
        label: "Recurring domain governance",
        title: "Keep the baseline true over time",
        summary: "The starting questions are currently clear. The next useful move is to keep ownership, authority, email trust, incident readiness and unresolved actions current through an existing governance forum.",
        action: "Adopt a proportionate recurring review with a named owner, repeatable evidence set, explicit decisions and an action trail maintained in existing systems.",
        href: "/resources/recurring-domain-governance-review/",
        cta: "Run a recurring governance review",
      });
    }

    if (hasOpenQuestionIds(["b5"])) {
      pathways.push({
        label: "Supporting public evidence",
        title: "Review externally visible DNS and domain signals",
        summary: "Authoritative DNS uncertainty may be informed by what is publicly observable. Use current signals as evidence for a governance review, not as a scorecard or substitute for internal authority records.",
        action: "Run a point-in-time public-signal check, then decide which observations need ownership, provider evidence or escalation.",
        href: THREATSCOPE_URL,
        cta: "Open ThreatScope Check",
      });
    }

    if (entireLayerIsAnsweredAndInPlace("registration") && !hasOpenInLayers(["registration"])) {
      pathways.push({
        label: "Broader context",
        title: "Connect internal hygiene with repeated public observation",
        summary: "Your registration hygiene answers are currently clear. Repeated public observation can help retain context about how domain-layer signals change over time.",
        action: "Use .au Domain Observatory (.auDO) as a public observatory reference for repeated observation and sector-level context.",
        href: "https://audo.bryanchetcuti.com/",
        cta: "Explore .au Domain Observatory (.auDO)",
      });
    }

    if (!pathways.length) {
      pathways.push({
        label: "Recurring domain governance",
        title: "Use an existing forum to keep the baseline true",
        summary: "No single implementation guide is being elevated from this pass. The practical next step is to maintain cadence, ownership, evidence and action through an existing governance forum.",
        action: "Review changes, unknowns, exceptions, incidents and overdue actions using the bounded recurring-review method.",
        href: "/resources/recurring-domain-governance-review/",
        cta: "Run a recurring governance review",
      });
    }

    return pathways.slice(0, 4);
  }

  function renderPathways() {
    const block = document.querySelector("#pathways-block");
    if (!block) return;

    block.innerHTML = "";
    buildPathways().forEach((pathway) => {
      const externalAttributes = isExternalHref(pathway.href) ? ' target="_blank" rel="noopener"' : "";
      const card = create("article", "pathway-card", `
        <span class="pathway-label">${pathway.label}</span>
        <h4 class="pathway-title">${pathway.title}</h4>
        <p class="pathway-summary">${pathway.summary}</p>
        <p class="pathway-action"><strong>Suggested action:</strong> ${pathway.action}</p>
        <div class="q-linkout-wrap">
          <a class="q-linkout" href="${pathway.href}"${externalAttributes}>${pathway.cta}</a>
        </div>
      `);
      block.appendChild(card);
    });
  }

  function buildPathwayText() {
    const lines = [];
    lines.push("PRACTICAL NEXT STEPS");
    lines.push("Guide links based on the questions that need follow-up. These are not scores, findings of fault or automated assurance recommendations.");
    lines.push("");

    buildPathways().forEach((pathway) => {
      lines.push(`- ${pathway.title}`);
      lines.push(`  Focus: ${pathway.label}`);
      lines.push(`  Why: ${pathway.summary}`);
      lines.push(`  Suggested action: ${pathway.action}`);
      if (!pathway.href.startsWith("#")) lines.push(`  Link: ${pathway.href}`);
      lines.push("");
    });

    lines.push("FROM BASELINE TO PRACTICE");
    lines.push("Use the guide that matches the unresolved questions: establish a domain register; control registrar and DNS authority; govern email authority and public signals; establish domain incident readiness; then use a recurring review to keep the practices current.");
    lines.push("Guides: https://baseline.bryanchetcuti.com/resources/");
    lines.push("");

    lines.push("REFERENCE");
    lines.push(`Domain Governance Baseline v${BASELINE_VERSION} by Bryan Chetcuti`);
    lines.push(`Citation and stewardship: ${CITATION_URL}`);
    lines.push("");

    return lines.join("\n");
  }

  function enhancedTextReport() {
    const base = typeof window.buildTextReport === "function" ? window.buildTextReport() : "";
    const pathwayText = buildPathwayText();

    if (!base) return pathwayText;
    if (base.includes("\nFINAL NOTE")) {
      return base.replace("\nFINAL NOTE", `\n${pathwayText}\nFINAL NOTE`);
    }

    return `${base}\n\n${pathwayText}`;
  }

  function schedulePathwayRender() {
    requestAnimationFrame(() => {
      renderPathways();
    });
  }

  enhanceVersionIdentity();
  enhanceBaselineLayers();

  document.addEventListener("click", (event) => {
    if (event.target.closest("#generate-btn")) {
      schedulePathwayRender();
    }
  }, true);

  document.addEventListener("click", async (event) => {
    if (!event.target.closest("#copy-btn")) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    try {
      await navigator.clipboard.writeText(enhancedTextReport());
      showToast("Review summary copied to clipboard");
    } catch (_error) {
      showToast("Copy not available - use Print / Save instead");
    }
  }, true);
})();
