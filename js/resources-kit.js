/* Domain Governance Conversation Kit controls.
   No storage, submission or analytics. All state exists only in this tab. */
(function () {
  const printButton = document.querySelector("[data-print-kit]");
  const clearButton = document.querySelector("[data-clear-kit]");

  if (printButton) {
    printButton.addEventListener("click", function () {
      window.print();
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", function () {
      const confirmed = window.confirm("Clear all locally entered Conversation Kit content?");
      if (!confirmed) return;

      document.querySelectorAll("[contenteditable='true']").forEach(function (field) {
        field.textContent = "";
      });

      document.querySelectorAll("input[type='checkbox']").forEach(function (checkbox) {
        checkbox.checked = false;
      });
    });
  }
})();
