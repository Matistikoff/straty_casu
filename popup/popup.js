const input = document.getElementById("site-input");
const addBtn = document.getElementById("add-btn");
const siteList = document.getElementById("site-list");

function normalizeDomain(domain) {
  domain = domain.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//, "");
  domain = domain.replace(/^www\./, "");
  domain = domain.replace(/\/.*$/, "");
  return domain;
}

function renderSites(sites) {
  siteList.innerHTML = "";
  if (sites.length === 0) {
    const empty = document.createElement("li");
    empty.className = "empty";
    empty.textContent = "Žiadne blokované stránky";
    siteList.appendChild(empty);
    return;
  }
  sites.forEach((site) => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = site;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "✕";
    deleteBtn.className = "delete-btn";
    deleteBtn.title = "Odstrániť";
    deleteBtn.addEventListener("click", () => removeSite(site));

    li.appendChild(span);
    li.appendChild(deleteBtn);
    siteList.appendChild(li);
  });
}

function loadSites() {
  browser.storage.local.get("blockedSites").then((result) => {
    renderSites(result.blockedSites || []);
  });
}

function addSite() {
  const domain = normalizeDomain(input.value);
  if (!domain) return;

  browser.storage.local.get("blockedSites").then((result) => {
    const sites = result.blockedSites || [];
    if (!sites.includes(domain)) {
      sites.push(domain);
      browser.storage.local.set({ blockedSites: sites }).then(() => {
        renderSites(sites);
        input.value = "";
      });
    } else {
      input.value = "";
    }
  });
}

function removeSite(domain) {
  browser.storage.local.get("blockedSites").then((result) => {
    const sites = (result.blockedSites || []).filter((s) => s !== domain);
    browser.storage.local.set({ blockedSites: sites }).then(() => {
      renderSites(sites);
    });
  });
}

addBtn.addEventListener("click", addSite);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addSite();
});

loadSites();
