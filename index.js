let myLeads = [];

const inputEl = document.getElementById("input-el");
const inputBtn = document.getElementById("input-btn");
const ulEl = document.getElementById("ul-el");
const deleteBtn = document.getElementById("delete-btn");
const tabBtn = document.getElementById("tab-btn");

const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"));

if (leadsFromLocalStorage) {
  myLeads = leadsFromLocalStorage;
  render(myLeads);
}

tabBtn.addEventListener("click", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    myLeads.push(tabs[0].url);
    localStorage.setItem("myLeads", JSON.stringify(myLeads));
    render(myLeads);
  });
});

function render(leads) {
  let listItems = "";

  for (let i = 0; i < leads.length; i++) {
    listItems += `
      <li class="simple-link-item">
        <a target="_blank" rel="noopener noreferrer" href="${leads[i]}">
          ${leads[i]}
        </a>
      </li>
    `;
  }

  ulEl.innerHTML = listItems;

  // Keep the saved-link count and empty design in sync.
  const linkCount = document.getElementById("link-count");
  const emptyState = document.getElementById("empty-state");
  linkCount.textContent = `${leads.length} ${leads.length === 1 ? "link" : "links"}`;
  emptyState.hidden = leads.length > 0;
}

deleteBtn.addEventListener("dblclick", function () {
  localStorage.clear();
  myLeads = [];
  render(myLeads);
});

inputBtn.addEventListener("click", function () {
  myLeads.push(inputEl.value);
  inputEl.value = "";
  localStorage.setItem("myLeads", JSON.stringify(myLeads));
  render(myLeads);
});

// Quick guide controls used by the new design.
const guideEl = document.getElementById("guide");
const helpBtn = document.getElementById("help-btn");
const closeGuideBtn = document.getElementById("close-guide");
const emptyHelpBtn = document.getElementById("empty-help");

function toggleGuide(showGuide) {
  guideEl.hidden = !showGuide;
  helpBtn.setAttribute("aria-expanded", String(showGuide));
}

helpBtn.addEventListener("click", function () {
  toggleGuide(guideEl.hidden);
});

closeGuideBtn.addEventListener("click", function () {
  toggleGuide(false);
});

emptyHelpBtn.addEventListener("click", function () {
  toggleGuide(true);
});

// Show the initial empty state when no saved links exist.
if (!leadsFromLocalStorage) {
  render(myLeads);
}
