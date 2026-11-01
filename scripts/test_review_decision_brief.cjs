/* Regression tests for the dependency-free, private governance brief.
   Exercise the real result generator with actual canonical question data. */
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const listeners = {};
const domEvents = {};
const details = [{ open: true }, { open: false }, { open: true }];
const node = (tag = "div") => ({
  tagName: tag.toUpperCase(), children: [], dataset: {}, className: "",
  textContent: "", append(...children) { this.children.push(...children); },
  appendChild(child) { this.children.push(child); return child; },
  replaceChildren(...children) { this.children = [...children]; },
});
const selectedTopics = node();
const selectedSection = { hidden: true };
const relatedTopics = node();
const reviewSummary = { classList: {
  contains: (name) => name === "is-visible",
  remove: () => { throw new Error("Optional selection must not invalidate the brief"); },
} };
const document = {
  createElement: node,
  querySelector: selector => ({
    "#reflection-section": reviewSummary,
    "#maturity-summary": selectedTopics,
    "#review-selected-topics": selectedSection,
    "#review-theme-contextual-list": relatedTopics,
  })[selector] || null,
  querySelectorAll: selector => selector === "#reflection-section details" ? details : [],
  addEventListener: (name, cb) => { domEvents[name] = cb; },
};
const window = { addEventListener: (name, cb) => { listeners[name] = cb; } };
const state = { baseline: {}, maturity: {} };
const scope = { document, window, state, Date, console };
vm.createContext(scope);
const data = fs.readFileSync("js/data.js", "utf8");
vm.runInContext(data + "\nthis.QUESTIONS=BASELINE_QUESTIONS;this.THEMES=MATURITY_THEMES;this.VISIBILITY_MODEL=VISIBILITY;this.ICONS={eye:'',lock:''};", scope);
const priority = fs.readFileSync("js/reflection-priorities.js", "utf8");
vm.runInContext(priority.replace(
  "  window.buildTextReport = buildReviewSummaryText;",
  "  window.__followOnProbe = {renderThemeConnections, renderSelectedFollowOn};\n" +
  "  window.buildTextReport = buildReviewSummaryText;"
), scope);

assert.equal(scope.QUESTIONS.length, 10);
assert.equal(scope.THEMES.length, 6);
assert.equal(typeof window.buildTextReport, "function");
assert.equal(typeof listeners.beforeprint, "function");
assert.equal(typeof listeners.afterprint, "function");
assert.ok(priority.includes("function renderThemeConnections()"), "Related theme cues missing");
assert.ok(priority.includes("renderSelectedFollowOn();"), "Selected topics must update immediately");
assert.ok(priority.includes('data-follow-on-theme'), "Related themes must open for exploration");
const page = fs.readFileSync("review/index.html", "utf8");
const printCSS = fs.readFileSync("css/review-decision-brief.css", "utf8");
assert.ok(page.indexOf('id="summary-grid"') < page.indexOf('id="gaps-block"'),
  "Compact review overview must lead the findings");
assert.ok(page.indexOf('id="maturity-section"') < page.indexOf('id="review-handoff-heading"'),
  "Optional themes must precede the governance hand-off");
assert.ok(page.indexOf('id="maturity-summary"') > page.indexOf('id="review-handoff-heading"'),
  "Selected optional themes must appear within the governance hand-off");
assert.ok(page.indexOf('id="pathways-section"') > page.indexOf('id="supporting-review-detail"'),
  "Practice guide pathways must be supporting detail");
assert.ok(page.includes('<details class="review-unaddressed"'),
  "Skipped and unaddressed items must remain accessible through a disclosure");
assert.ok(printCSS.includes('#optional-exploration {display:none!important}'),
  "Printing must not expand the entire optional theme catalogue");


function report() { return window.buildTextReport(); }
function contains(text, part) { assert.ok(text.includes(part), "Missing text: " + part); }

let text = report();
contains(text, "Status: Partial review");
contains(text, "Questions: 0 of 10 answered");
contains(text, "No answered questions marked for follow-up");
contains(text, "None selected. The ten-question review stands on its own.");

state.baseline.b1 = "partial";
state.baseline.b3 = "unsure";
state.baseline.b5 = "in_place";
state.skippedBaseline.b2 = true;
state.maturity.m2 = "selected";
text = report();
contains(text, "Questions: 3 of 10 answered; 1 skipped; 6 unaddressed");
contains(text, "Q01 · Which domains do we own");
contains(text, "Q03 · Who has registrar access");
contains(text, "Q02 · Who is the accountable business owner");
contains(text, "Skipped for now");
assert.ok(!text.includes("—"), "Portable brief must use ordinary hyphens, not em dashes");
contains(text, "Supplier assurance: Selected for discussion, not assessed");
contains(text, "Extends Q05, Q06");
assert.ok(text.indexOf("WHERE TO TAKE THIS FURTHER") < text.indexOf("HAND-OFF TO EXISTING GOVERNANCE"),
  "Follow-on themes must precede governance hand-off in the portable brief");
assert.ok(text.indexOf("Q01 · Which domains") < text.indexOf("Q03 · Who has registrar access"),
  "Findings must stay in canonical order, not automatic priority order");
assert.ok(!text.includes("MATURITY RATING") && !text.includes("OVERALL SCORE"));

// Exercise the production DOM renderer, not just its string literals.
window.__followOnProbe.renderThemeConnections();
assert.equal(relatedTopics.children.length, 1, "Only the Q01 portfolio theme is related to open responses");
assert.equal(relatedTopics.children[0].dataset.followOnTheme, "m1");
window.__followOnProbe.renderSelectedFollowOn();
assert.equal(selectedSection.hidden, false, "Selected themes must display within the governance hand-off");
assert.equal(selectedTopics.children.length, 1, "Selected follow-on must appear in the visible brief");
assert.equal(selectedTopics.children[0].children[0].textContent, "Supplier assurance");
assert.equal(selectedTopics.children[0].children[1].textContent, "Extends Q05, Q06");
assert.equal(typeof domEvents["review:changed"], "function");
delete state.maturity.m2;
domEvents["review:changed"]();
assert.equal(selectedSection.hidden, true, "No selected themes must hide the empty hand-off block");
assert.equal(selectedTopics.children.length, 0, "Deselection removes previous topic immediately");
assert.ok(!report().includes("Supplier assurance: Selected for discussion"),
  "Deselection must update the copied report without regeneration");
state.maturity.m2 = "selected";
domEvents["review:changed"]();
assert.equal(selectedTopics.children[0].children[0].textContent, "Supplier assurance");
assert.equal(selectedSection.hidden, false);
state.baseline.b6 = "partial";
window.__followOnProbe.renderThemeConnections();
assert.ok(relatedTopics.children.some(item => item.dataset.followOnTheme === "m2"),
  "Open Q06 must surface the connected supplier-assurance theme");
delete state.baseline.b6;

for (const q of scope.QUESTIONS) state.baseline[q.id] = "in_place";
text = report();
contains(text, "Status: Complete ten-question pass");
contains(text, "Questions: 10 of 10 answered; 0 skipped; 0 unaddressed");
contains(text, "No answered questions marked for follow-up");

listeners.beforeprint();
assert.deepEqual(details.map(d => d.open), [true,true,true],
  "Print must expose all supporting content");
listeners.afterprint();
assert.deepEqual(details.map(d => d.open), [true,false,true],
  "Print must restore the user's disclosure states");
console.log("Governance brief regression tests passed: coverage, canonical order, skip, optional themes, print.");
