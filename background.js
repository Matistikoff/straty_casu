let blockedSites = [];

function loadBlockedSites() {
  browser.storage.local.get("blockedSites").then((result) => {
    blockedSites = result.blockedSites || [];
  });
}

function isBlocked(url) {
  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return blockedSites.some((site) => {
      return hostname === site || hostname.endsWith("." + site);
    });
  } catch {
    return false;
  }
}

browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check when URL changes (catches redirects too)
  if (changeInfo.url && isBlocked(changeInfo.url)) {
    browser.tabs.remove(tabId);
    return;
  }
  // Also check when tab starts loading (catches address bar navigation)
  if (changeInfo.status === "loading" && tab.url && isBlocked(tab.url)) {
    browser.tabs.remove(tabId);
  }
});

// Keep blockedSites in sync when popup saves changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.blockedSites) {
    blockedSites = changes.blockedSites.newValue || [];
  }
});

loadBlockedSites();
