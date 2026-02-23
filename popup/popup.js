/* ── Helpers ─────────────────────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
let feedbackTimer = null;

function flash(msg, ok = true) {
  const el = $("feedback");
  el.textContent = msg;
  el.className = "feedback show " + (ok ? "success" : "error");
  clearTimeout(feedbackTimer);
  feedbackTimer = setTimeout(() => { el.className = "feedback"; }, 2200);
}

function send(type, extra = {}) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ type, ...extra }, (res) => {
      resolve(res || {});
    });
  });
}

/* ── Color map for group dots ────────────────────────────────────────── */
const COLOR_HEX = {
  blue: "#4a9eff", red: "#ff5252", yellow: "#ffd740",
  green: "#4caf50", pink: "#ff80ab", purple: "#b388ff",
  cyan: "#4dd0e1", orange: "#ffab40", grey: "#90a4ae",
};

/* ── Stats ───────────────────────────────────────────────────────────── */
async function refreshStats() {
  const s = await send("GET_STATS");
  $("sTabs").textContent = s.totalTabs ?? "-";
  $("sGroups").textContent = s.totalGroups ?? "-";
  $("sGrouped").textContent = s.groupedTabs ?? "-";
  $("sUngrouped").textContent = s.ungroupedTabs ?? "-";
}

/* ── Groups list ─────────────────────────────────────────────────────── */
async function refreshGroups() {
  const data = await send("GET_GROUP_INFO");
  const wrap = $("groupsWrap");
  const list = $("groupsList");
  list.innerHTML = "";

  if (!data.groups || data.groups.length === 0) {
    wrap.style.display = "none";
    return;
  }

  // Count tabs per group
  const counts = new Map();
  for (const tab of data.tabs) {
    if (tab.groupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      counts.set(tab.groupId, (counts.get(tab.groupId) || 0) + 1);
    }
  }

  for (const g of data.groups) {
    const row = document.createElement("div");
    row.className = "group-row";

    // Colored dot
    const dot = document.createElement("div");
    dot.className = "group-dot";
    dot.style.background = COLOR_HEX[g.color] || "#888";

    // Label
    const label = document.createElement("span");
    label.className = "group-label";
    const cnt = counts.get(g.id) || 0;
    label.textContent = (g.title || "?") + (cnt > 0 ? "" : "");
    label.title = g.title || "";

    // Remove button
    const x = document.createElement("button");
    x.className = "group-x";
    x.textContent = "\u2715";
    x.title = "Ungroup";
    x.addEventListener("click", async () => {
      await send("UNGROUP_BY_ID", { groupId: g.id });
      flash("Ungrouped");
      refresh();
    });

    row.append(dot, label, x);
    list.appendChild(row);
  }

  wrap.style.display = "block";
}

function refresh() {
  refreshStats();
  refreshGroups();
}

/* ── Button handlers ─────────────────────────────────────────────────── */
$("btnGroupAll").addEventListener("click", async () => {
  const res = await send("GROUP_ALL_TABS");
  if (res.error) { flash(res.error, false); return; }
  flash(res.count > 0 ? "Grouped " + res.count + " tabs" : "Nothing to group");
  refresh();
});

$("btnGroupNew").addEventListener("click", async () => {
  const res = await send("GROUP_UNGROUPED_TABS");
  if (res.error) { flash(res.error, false); return; }
  flash(res.count > 0 ? "Grouped " + res.count + " new tabs" : "No new tabs to group");
  refresh();
});

$("btnUngroupAll").addEventListener("click", async () => {
  const res = await send("UNGROUP_ALL_TABS");
  if (res.error) { flash(res.error, false); return; }
  flash(res.count > 0 ? "Ungrouped " + res.count + " tabs" : "No groups to remove");
  refresh();
});

$("btnSort").addEventListener("click", async () => {
  const res = await send("SORT_GROUPS");
  if (res.error) { flash(res.error, false); return; }
  flash(res.count > 0 ? "Sorted " + res.count + " groups" : "No groups to sort");
  refresh();
});

$("btnDupes").addEventListener("click", async () => {
  const res = await send("CLOSE_DUPLICATES");
  if (res.error) { flash(res.error, false); return; }
  flash(res.count > 0 ? "Closed " + res.count + " duplicate(s)" : "No duplicates found");
  refresh();
});

/* ── Settings ────────────────────────────────────────────────────────── */
function bindToggle(elId, settingKey) {
  const el = $(elId);
  el.addEventListener("click", async () => {
    el.classList.toggle("active");
    const settings = await send("GET_SETTINGS");
    settings[settingKey] = el.classList.contains("active");
    await send("SAVE_SETTINGS", { settings });
  });
}

async function initSettings() {
  const s = await send("GET_SETTINGS");

  if (s.autoGroup) $("tAutoGroup").classList.add("active");
  if (s.smartColoring) $("tColors").classList.add("active");
  if (s.collapsedByDefault) $("tCollapse").classList.add("active");

  bindToggle("tAutoGroup", "autoGroup");
  bindToggle("tColors", "smartColoring");
  bindToggle("tCollapse", "collapsedByDefault");
}

/* ── Init ────────────────────────────────────────────────────────────── */
(async () => {
  await initSettings();
  refresh();
})();
