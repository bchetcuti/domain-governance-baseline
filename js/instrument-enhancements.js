/* ============================================================
   Instrument identity enhancements: governance layers + pathways.
   Keeps the baseline as a local reflection instrument, not a score.
   ============================================================ */
(function () {
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

  function entireLayerIsAnsweredAndInPlace(layer) {
    const layerQuestions = BASELINE_QUESTIONS.filter((question) => question.layer === layer);
    return layerQuestions.length > 0 && layerQuestions.every((question) => state.baseline[question.id] === "in_place");
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

  function alignPracticeReferences() {
    document.querySelectorAll('a[href="/resources/"]').forEach((link) => {
      const text = link.textContent.trim();
      if (text === "Reflection resources") link.textContent = "From baseline to practice";
      if (text === "Domain Governance Reflection Resources") link.textContent = "Establish a domain register";
    });

    const disclaimers = Array.from(document.querySelectorAll("#reflection-section .disclaimer"));
    const resourceDisclaimer = disclaimers.find((block) => block.textContent.includes("Turn this reflection into a governance artefact"));
    if (resourceDisclaimer) {
      resourceDisclaimer.innerHTML = `
        <strong>Move from reflection to practice.</strong>
        Start with the <a href="/resources/domain-register/">Establish a domain register guide</a>
        to create the foundational inventory and ownership record behind the first baseline questions.
      `;
    }

    document.querySelectorAll(".m-guide-block").forEach((block) => {
      const label = block.querySelector(".m-guide-label");
      const paragraph = block.querySelector("p");
      if (label?.textContent.trim() !== "Use existing governance" || !paragraph) return;
      paragraph.textContent = "Use the practical guidance to establish missing practices, then maintain the resulting records in the organisational systems you already operate.";
    });
  }

  function buildPathways() {
    const pathways = [];
    const externalOpen = openQuestions().filter((question) => question.visibility === "external");

    if (externalOpen.length || hasOpenInLayers(["dns"])) {
      pathways.push({
        label: "Public signal review",
        title: "Review externally visible DNS and domain signals",
        summary: "Your answers suggest that externally visible DNS or public trust-surface signals may be worth reviewing. Use this as evidence for a governance conversation, not as a scorecard.",
        action: "Run a public-signal check, then decide which observations need ownership, evidence or escalation.",
        href: THREATSCOPE_URL,
        cta: "Open ThreatScope Check",
      });
    }

    if (hasOpenInLayers(["email"])) {
      pathways.push({
        label: "Email trust",
        title: "Review mail authority and DMARC alignment",
        summary: "Email trust answers that are partial, absent or uncertain usually need a clean view of sending authority, SPF, DKIM and DMARC policy.",
        action: "Confirm which domains are allowed to send mail, then review whether authentication policy and reporting are being actively governed.",
        href: THREATSCOPE_URL,
        cta: "Check email-facing signals",
      });
    }

    if (hasOpenInLayers(["registration"])) {
      pathways.push({
        label: "Registration hygiene",
        title: "Establish a dependable domain register",
        summary: "Registration uncertainty usually means the organisation lacks a complete view of which domains matter, why they exist and who is accountable for ownership and renewal.",
        action: "Build a minimum credible register covering purpose, accountable ownership, technical operation, registrar, DNS, renewal, email use, dependencies and unresolved questions.",
        href: "/resources/domain-register/",
        cta: "Establish a domain register",
      });
    }

    if (hasOpenInLayers(["delivery", "operational"])) {
      pathways.push({
        label: "Operational clarity",
        title: "Turn domain dependency and incident answers into an operating path",
        summary: "Delivery and operational uncertainty points to the practical side of domain governance: which systems depend on the domain layer, who is called during failure and what can be recovered.",
        action: "Map dependent services, escalation contacts and recovery steps before the next incident tests them.",
        href: "/resources/",
        cta: "Open practical guidance",
      });
    }

    if (entireLayerIsAnsweredAndInPlace("registration") && !hasOpenInLayers(["registration"])) {
      pathways.push({
        label: "Broader context",
        title: "Compare strong internal hygiene with public domain-layer observation",
        summary: "Your registration hygiene answers are currently clear. The next useful move is to keep that internal clarity connected to how public domain-layer signals are observed over time.",
        action: "Use .auDO as a public observatory reference for repeated observation and sector-level context.",
        href: "https://audo.bryanchetcuti.com/",
        cta: "Explore .auDO",
      });
    }

    if (!pathways.length) {
      pathways.push({
        label: "Next governance conversation",
        title: "Use the summary to keep the baseline true",
        summary: "No specific pathway is being elevated from this pass. That does not mean the domain layer is finished; it means the next conversation is cadence, ownership and evidence.",
        action: "Use the optional follow-on themes to decide what belongs in recurring governance reporting.",
        href: "#maturity-section",
        cta: "Review optional follow-on themes",
      });
    }

    return pathways.slice(0, 4);
  }

  function renderPathways() {
    const block = document.querySelector("#pathways-block");
    if (!block) return;

    block.innerHTML = "";
    buildPathways().forEach((pathway) => {
      const card = create("article", "pathway-card", `
        <span class="pathway-label">${pathway.label}</span>
        <h4 class="pathway-title">${pathway.title}</h4>
        <p class="pathway-summary">${pathway.summary}</p>
        <p class="pathway-action"><strong>Suggested action:</strong> ${pathway.action}</p>
        <div class="q-linkout-wrap">
          <a class="q-linkout" href="${pathway.href}"${pathway.href.startsWith("#") ? "" : ' target="_blank" rel="noopener"'}>${pathway.cta}</a>
        </div>
      `);
      block.appendChild(card);
    });
  }

  function buildPathwayText() {
    const lines = [];
    lines.push("SUGGESTED NEXT PATHWAYS");
    lines.push("Guidance paths only. These are not scores, findings of fault or automated recommendations.");
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
    lines.push("Practical guidance explains how to establish the basic practices behind the checklist. Begin with a dependable domain register covering purpose, accountability, renewal, email use and critical dependencies.");
    lines.push("Guide: https://baseline.bryanchetcuti.com/resources/domain-register/");
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

  enhanceBaselineLayers();
  alignPracticeReferences();

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
      showToast("Conversation brief copied to clipboard");
    } catch (_error) {
      showToast("Copy not available - use Print / Save instead");
    }
  }, true);
})();
