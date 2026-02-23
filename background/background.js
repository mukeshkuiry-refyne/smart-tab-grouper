const COLORS = ["blue", "green", "yellow", "red", "purple", "cyan", "orange"];

// Persistent color map so same hostname always gets same color
const hostnameColorMap = new Map();
let colorIndex = 0;
const groupCache = new Map(); // hostname -> Map<windowId, groupId>

// ── Friendly hostname mappings ─────────────────────────────────────────
const HOSTNAME_ALIASES = {
  // Custom Added by - Mukesh
  "misv2.refyne.co.in": "MIS",
  "refyne.co.in": "Refyne",
  "refynetech.atlassian.net": "Atlassian",
  "aws.amazon.com": "AWS Console",
  "console.aws.amazon.com": "AWS Console",
  // Search & Google
  "google.com": "Google",
  "docs.google.com": "Google Docs",
  "sheets.google.com": "Sheets",
  "slides.google.com": "Slides",
  "drive.google.com": "Drive",
  "calendar.google.com": "Calendar",
  "meet.google.com": "Meet",
  "mail.google.com": "Gmail",
  "contacts.google.com": "Contacts",
  "photos.google.com": "Photos",
  "maps.google.com": "Maps",
  "translate.google.com": "Translate",
  "news.google.com": "Google News",
  "play.google.com": "Play Store",
  "console.cloud.google.com": "GCP",
  "analytics.google.com": "Analytics",
  "search.google.com": "Google",
  "gemini.google.com": "Gemini",
  "bard.google.com": "Gemini",
  "firebase.google.com": "Firebase",
  "console.firebase.google.com": "Firebase",
  "colab.research.google.com": "Colab",
  "accounts.google.com": "Google Account",
  "myaccount.google.com": "Google Account",
  "ads.google.com": "Google Ads",
  "fonts.google.com": "Google Fonts",

  // Microsoft
  "outlook.live.com": "Outlook",
  "outlook.office.com": "Outlook",
  "outlook.office365.com": "Outlook",
  "onedrive.live.com": "OneDrive",
  "teams.microsoft.com": "Teams",
  "office.com": "Office",
  "microsoft.com": "Microsoft",
  "dev.azure.com": "Azure DevOps",
  "portal.azure.com": "Azure",
  "bing.com": "Bing",
  "copilot.microsoft.com": "Copilot",
  "linkedin.com": "LinkedIn",
  "learn.microsoft.com": "MS Docs",
  "visualstudio.com": "VS Online",
  "code.visualstudio.com": "VS Code",

  // Dev & Code
  "github.com": "GitHub",
  "gist.github.com": "Gists",
  "github.dev": "GitHub Dev",
  "gitlab.com": "GitLab",
  "bitbucket.org": "Bitbucket",
  "stackoverflow.com": "StackOverflow",
  "stackexchange.com": "StackExchange",
  "dev.to": "Dev.to",
  "hashnode.com": "Hashnode",
  "codepen.io": "CodePen",
  "codesandbox.io": "CodeSandbox",
  "replit.com": "Replit",
  "jsfiddle.net": "JSFiddle",
  "npmjs.com": "npm",
  "pypi.org": "PyPI",
  "crates.io": "Crates.io",
  "rubygems.org": "RubyGems",
  "packagist.org": "Packagist",
  "hub.docker.com": "Docker Hub",
  "vercel.com": "Vercel",
  "netlify.com": "Netlify",
  "app.netlify.com": "Netlify",
  "render.com": "Render",
  "railway.app": "Railway",
  "heroku.com": "Heroku",
  "supabase.com": "Supabase",
  "cloud.mongodb.com": "MongoDB",
  "postman.com": "Postman",
  "swagger.io": "Swagger",
  "regex101.com": "Regex101",
  "json-generator.com": "JSON Gen",
  "bundlephobia.com": "Bundlephobia",
  "caniuse.com": "Can I Use",

  // AI & ML
  "chat.openai.com": "ChatGPT",
  "chatgpt.com": "ChatGPT",
  "openai.com": "OpenAI",
  "platform.openai.com": "OpenAI API",
  "claude.ai": "Claude",
  "anthropic.com": "Anthropic",
  "huggingface.co": "HuggingFace",
  "kaggle.com": "Kaggle",
  "perplexity.ai": "Perplexity",
  "midjourney.com": "Midjourney",
  "poe.com": "Poe",
  "you.com": "You.com",
  "deepseek.com": "DeepSeek",
  "chat.deepseek.com": "DeepSeek",
  "groq.com": "Groq",
  "together.ai": "Together",
  "replicate.com": "Replicate",
  "stability.ai": "Stability",

  // Social
  "twitter.com": "Twitter",
  "x.com": "X",
  "facebook.com": "Facebook",
  "instagram.com": "Instagram",
  "tiktok.com": "TikTok",
  "reddit.com": "Reddit",
  "old.reddit.com": "Reddit",
  "pinterest.com": "Pinterest",
  "tumblr.com": "Tumblr",
  "threads.net": "Threads",
  "mastodon.social": "Mastodon",
  "bsky.app": "Bluesky",
  "quora.com": "Quora",
  "snapchat.com": "Snapchat",

  // Video & Media
  "youtube.com": "YouTube",
  "music.youtube.com": "YT Music",
  "studio.youtube.com": "YT Studio",
  "twitch.tv": "Twitch",
  "vimeo.com": "Vimeo",
  "netflix.com": "Netflix",
  "disneyplus.com": "Disney+",
  "hulu.com": "Hulu",
  "primevideo.com": "Prime Video",
  "max.com": "Max",
  "crunchyroll.com": "Crunchyroll",
  "open.spotify.com": "Spotify",
  "music.apple.com": "Apple Music",
  "soundcloud.com": "SoundCloud",
  "podcasts.apple.com": "Podcasts",
  "dailymotion.com": "Dailymotion",

  // Communication
  "slack.com": "Slack",
  "app.slack.com": "Slack",
  "discord.com": "Discord",
  "discord.gg": "Discord",
  "telegram.org": "Telegram",
  "web.telegram.org": "Telegram",
  "web.whatsapp.com": "WhatsApp",
  "signal.org": "Signal",
  "zoom.us": "Zoom",
  "gather.town": "Gather",

  // Project Management
  "notion.so": "Notion",
  "trello.com": "Trello",
  "asana.com": "Asana",
  "monday.com": "Monday",
  "clickup.com": "ClickUp",
  "linear.app": "Linear",
  "height.app": "Height",
  "basecamp.com": "Basecamp",
  "airtable.com": "Airtable",
  "miro.com": "Miro",
  "jira.atlassian.net": "Jira",

  // Atlassian (suffix match will catch subdomains)
  "atlassian.com": "Atlassian",
  "atlassian.net": "Atlassian",

  // Design
  "figma.com": "Figma",
  "canva.com": "Canva",
  "dribbble.com": "Dribbble",
  "behance.net": "Behance",
  "sketch.com": "Sketch",
  "framer.com": "Framer",
  "adobe.com": "Adobe",
  "creativecloud.adobe.com": "Adobe CC",
  "coolors.co": "Coolors",
  "unsplash.com": "Unsplash",
  "pexels.com": "Pexels",
  "icons8.com": "Icons8",
  "fontawesome.com": "Font Awesome",

  // Shopping
  "amazon.com": "Amazon",
  "amazon.in": "Amazon IN",
  "amazon.co.uk": "Amazon UK",
  "amazon.de": "Amazon DE",
  "amazon.co.jp": "Amazon JP",
  "ebay.com": "eBay",
  "etsy.com": "Etsy",
  "walmart.com": "Walmart",
  "flipkart.com": "Flipkart",
  "myntra.com": "Myntra",
  "aliexpress.com": "AliExpress",
  "shopify.com": "Shopify",
  "target.com": "Target",
  "bestbuy.com": "Best Buy",

  // Finance
  "paypal.com": "PayPal",
  "stripe.com": "Stripe",
  "dashboard.stripe.com": "Stripe",
  "razorpay.com": "Razorpay",
  "robinhood.com": "Robinhood",
  "coinbase.com": "Coinbase",
  "binance.com": "Binance",
  "zerodha.com": "Zerodha",
  "groww.in": "Groww",
  "wise.com": "Wise",
  "revolut.com": "Revolut",

  // Reference & Learning
  "wikipedia.org": "Wikipedia",
  "en.wikipedia.org": "Wikipedia",
  "medium.com": "Medium",
  "substack.com": "Substack",
  "udemy.com": "Udemy",
  "coursera.org": "Coursera",
  "edx.org": "edX",
  "khanacademy.org": "Khan Academy",
  "leetcode.com": "LeetCode",
  "hackerrank.com": "HackerRank",
  "codeforces.com": "Codeforces",
  "geeksforgeeks.org": "GFG",
  "freecodecamp.org": "freeCodeCamp",
  "w3schools.com": "W3Schools",
  "developer.mozilla.org": "MDN",
  "css-tricks.com": "CSS-Tricks",
  "smashingmagazine.com": "Smashing",
  "scotch.io": "Scotch",
  "digitalocean.com": "DigitalOcean",

  // News & Info
  "news.ycombinator.com": "Hacker News",
  "techcrunch.com": "TechCrunch",
  "theverge.com": "The Verge",
  "wired.com": "WIRED",
  "arstechnica.com": "Ars Technica",
  "bbc.com": "BBC",
  "cnn.com": "CNN",
  "nytimes.com": "NY Times",
  "reuters.com": "Reuters",
  "producthunt.com": "Product Hunt",
  "indiehackers.com": "Indie Hackers",
  "bloomberg.com": "Bloomberg",
  "wsj.com": "WSJ",
  "theguardian.com": "Guardian",
  "washingtonpost.com": "WashPost",

  // Misc
  "archive.org": "Archive",
  "web.archive.org": "Wayback",
  localhost: "Localhost",
  "127.0.0.1": "Localhost",
  "chatgpt.com": "ChatGPT",
  "about.google": "Google About",
  "apple.com": "Apple",
  "support.apple.com": "Apple Support",
  "icloud.com": "iCloud",
};

// ── Settings ───────────────────────────────────────────────────────────
const DEFAULT_SETTINGS = {
  autoGroup: true,
  smartColoring: true,
  collapsedByDefault: false,
  minTabsToGroup: 2,
};

async function getSettings() {
  const data = await chrome.storage.sync.get("settings");
  return { ...DEFAULT_SETTINGS, ...(data.settings || {}) };
}

async function saveSettings(settings) {
  await chrome.storage.sync.set({ settings });
}

// ── Helpers ────────────────────────────────────────────────────────────
function getColorForHostname(hostname) {
  if (hostnameColorMap.has(hostname)) return hostnameColorMap.get(hostname);
  const c = COLORS[colorIndex % COLORS.length];
  colorIndex++;
  hostnameColorMap.set(hostname, c);
  return c;
}

function getHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function getFriendlyName(hostname) {
  if (!hostname) return "Unknown";

  const bare = hostname.replace(/^www\./, "");

  // 1. Exact match on full hostname (e.g. "mail.google.com")
  if (HOSTNAME_ALIASES[hostname]) return HOSTNAME_ALIASES[hostname];
  // 2. Match without www
  if (HOSTNAME_ALIASES[bare]) return HOSTNAME_ALIASES[bare];

  // 3. Check if any alias key is a suffix (handles *.atlassian.net etc.)
  for (const [key, name] of Object.entries(HOSTNAME_ALIASES)) {
    if (bare.endsWith("." + key)) return name;
  }

  // 4. Smart fallback – pick the meaningful domain part
  const parts = bare.split(".");
  const tldFragments = new Set([
    "com",
    "co",
    "org",
    "net",
    "io",
    "dev",
    "app",
    "ai",
    "me",
    "us",
    "uk",
    "in",
    "de",
    "fr",
    "so",
    "gg",
    "tv",
    "to",
    "cc",
    "ly",
    "sh",
    "xyz",
    "info",
    "biz",
  ]);
  let domainPart = parts[0];
  for (let i = parts.length - 1; i >= 0; i--) {
    if (!tldFragments.has(parts[i]) && parts[i].length > 1) {
      domainPart = parts[i];
      break;
    }
  }
  return domainPart.charAt(0).toUpperCase() + domainPart.slice(1);
}

// ── Group title ────────────────────────────────────────────────────────
async function updateGroupTitle(groupId, hostname) {
  try {
    const tabs = await chrome.tabs.query({ groupId });
    const name = getFriendlyName(hostname);
    await chrome.tabGroups.update(groupId, {
      title: tabs.length > 1 ? name + " \u00b7 " + tabs.length : name,
    });
  } catch {
    // Group may have been closed
  }
}

// ── Core: get or create a tab group ────────────────────────────────────
async function getOrCreateGroup(hostname, tabIds) {
  if (!tabIds.length) return null;

  let firstTab;
  try {
    firstTab = await chrome.tabs.get(tabIds[0]);
  } catch {
    return null;
  }
  const windowId = firstTab.windowId;

  // Filter to tabs still in the same window
  const validIds = [];
  for (const id of tabIds) {
    try {
      const t = await chrome.tabs.get(id);
      if (t.windowId === windowId) validIds.push(id);
    } catch {
      /* tab closed */
    }
  }
  if (!validIds.length) return null;

  let perWindow = groupCache.get(hostname);
  if (!perWindow) {
    perWindow = new Map();
    groupCache.set(hostname, perWindow);
  }

  // Try reusing existing group
  if (perWindow.has(windowId)) {
    const cachedGroupId = perWindow.get(windowId);
    try {
      const groupInfo = await chrome.tabGroups.get(cachedGroupId);
      if (groupInfo && groupInfo.windowId === windowId) {
        await chrome.tabs.group({ groupId: cachedGroupId, tabIds: validIds });
        await updateGroupTitle(cachedGroupId, hostname);
        return cachedGroupId;
      }
    } catch {
      perWindow.delete(windowId);
    }
  }

  // Create new group
  const newGroupId = await chrome.tabs.group({ tabIds: validIds });
  const settings = await getSettings();
  await chrome.tabGroups.update(newGroupId, {
    color: settings.smartColoring ? getColorForHostname(hostname) : undefined,
    collapsed: settings.collapsedByDefault,
  });
  await updateGroupTitle(newGroupId, hostname);
  perWindow.set(windowId, newGroupId);
  return newGroupId;
}

// ── Cache rebuild (using actual tab URLs, not title parsing) ───────────
async function rebuildGroupCache() {
  try {
    const allGroups = await chrome.tabGroups.query({});
    groupCache.clear();

    for (const g of allGroups) {
      const tabsInGroup = await chrome.tabs.query({ groupId: g.id });
      let hostname = null;
      for (const t of tabsInGroup) {
        if (t.url && t.url.startsWith("http")) {
          hostname = getHostname(t.url);
          if (hostname) break;
        }
      }
      if (!hostname) continue;

      let perWindow = groupCache.get(hostname);
      if (!perWindow) {
        perWindow = new Map();
        groupCache.set(hostname, perWindow);
      }
      perWindow.set(g.windowId, g.id);
      if (g.color) hostnameColorMap.set(hostname, g.color);
    }
  } catch {
    /* no groups yet */
  }
}

rebuildGroupCache();

// ── Grouping operations ────────────────────────────────────────────────
async function groupAllTabs() {
  const settings = await getSettings();
  const minTabs = settings.minTabsToGroup || 2;
  const tabs = await chrome.tabs.query({});
  const buckets = {};

  for (const tab of tabs) {
    if (!tab.url || !tab.url.startsWith("http")) continue;
    const hostname = getHostname(tab.url);
    if (!hostname) continue;
    (buckets[hostname] ||= []).push(tab.id);
  }

  let count = 0;
  for (const [hostname, ids] of Object.entries(buckets)) {
    if (ids.length >= minTabs) {
      await getOrCreateGroup(hostname, ids);
      count += ids.length;
    }
  }
  return count;
}

async function ungroupAllTabs() {
  const tabs = await chrome.tabs.query({});
  let count = 0;
  for (const tab of tabs) {
    if (tab.groupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE) {
      try {
        await chrome.tabs.ungroup(tab.id);
        count++;
      } catch {
        /* gone */
      }
    }
  }
  groupCache.clear();
  hostnameColorMap.clear();
  colorIndex = 0;
  return count;
}

async function groupUngroupedTabs() {
  const settings = await getSettings();
  const minTabs = settings.minTabsToGroup || 2;
  const tabs = await chrome.tabs.query({});
  const buckets = {};

  for (const tab of tabs) {
    if (tab.groupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE)
      continue;
    if (!tab.url || !tab.url.startsWith("http")) continue;
    const hostname = getHostname(tab.url);
    if (!hostname) continue;
    (buckets[hostname] ||= []).push(tab.id);
  }

  let count = 0;
  for (const [hostname, ids] of Object.entries(buckets)) {
    if (ids.length >= minTabs) {
      await getOrCreateGroup(hostname, ids);
      count += ids.length;
    }
  }
  return count;
}

async function sortGroupsByDomain() {
  const groups = await chrome.tabGroups.query({});
  const sorted = [...groups].sort((a, b) =>
    (a.title || "").localeCompare(b.title || ""),
  );
  for (const group of sorted) {
    const tabsInGroup = await chrome.tabs.query({ groupId: group.id });
    for (const tab of tabsInGroup) {
      try {
        await chrome.tabs.move(tab.id, { index: -1 });
      } catch {
        /* */
      }
    }
  }
  return sorted.length;
}

async function closeDuplicateTabs() {
  const tabs = await chrome.tabs.query({});
  const seen = new Set();
  const dupes = [];

  for (const tab of tabs) {
    if (!tab.url) continue;
    let key;
    try {
      const u = new URL(tab.url);
      key = (u.origin + u.pathname).replace(/\/$/, "");
    } catch {
      key = tab.url;
    }
    if (seen.has(key)) dupes.push(tab.id);
    else seen.add(key);
  }

  if (dupes.length > 0) await chrome.tabs.remove(dupes);
  return dupes.length;
}

// ── Live stats ─────────────────────────────────────────────────────────
async function getLiveStats() {
  const tabs = await chrome.tabs.query({});
  const groups = await chrome.tabGroups.query({});
  let grouped = 0,
    ungrouped = 0;
  for (const tab of tabs) {
    if (tab.groupId && tab.groupId !== chrome.tabGroups.TAB_GROUP_ID_NONE)
      grouped++;
    else ungrouped++;
  }
  return {
    totalTabs: tabs.length,
    groupedTabs: grouped,
    ungroupedTabs: ungrouped,
    totalGroups: groups.length,
  };
}

// ── Auto-grouping with debounce ────────────────────────────────────────
let autoGroupTimer = null;
const pendingHostnames = new Set();

function scheduleAutoGroup(hostname) {
  pendingHostnames.add(hostname);
  if (autoGroupTimer) clearTimeout(autoGroupTimer);
  autoGroupTimer = setTimeout(async () => {
    const hostnames = [...pendingHostnames];
    pendingHostnames.clear();
    autoGroupTimer = null;

    const settings = await getSettings();
    if (!settings.autoGroup) return;

    for (const hn of hostnames) {
      try {
        const matching = await chrome.tabs.query({ url: "*://" + hn + "/*" });
        if (matching.length >= (settings.minTabsToGroup || 2)) {
          await getOrCreateGroup(
            hn,
            matching.map((t) => t.id),
          );
        }
      } catch {
        /* ignore */
      }
    }
  }, 300);
}

// onCreated: new tabs rarely have a URL yet — onUpdated handles it
chrome.tabs.onCreated.addListener(() => {});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo) => {
  if (!changeInfo.url || !changeInfo.url.startsWith("http")) return;
  const hostname = getHostname(changeInfo.url);
  if (hostname) scheduleAutoGroup(hostname);
});

// Refresh cache when a tab is closed (update group counts)
chrome.tabs.onRemoved.addListener((_tabId, removeInfo) => {
  if (removeInfo.isWindowClosing) return;
  setTimeout(() => rebuildGroupCache(), 500);
});

// ── Message handler ────────────────────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      switch (msg.type) {
        case "GROUP_ALL_TABS": {
          const n = await groupAllTabs();
          sendResponse({ success: true, count: n });
          break;
        }
        case "UNGROUP_ALL_TABS": {
          const n = await ungroupAllTabs();
          sendResponse({ success: true, count: n });
          break;
        }
        case "GROUP_UNGROUPED_TABS": {
          const n = await groupUngroupedTabs();
          sendResponse({ success: true, count: n });
          break;
        }
        case "SORT_GROUPS": {
          const n = await sortGroupsByDomain();
          sendResponse({ success: true, count: n });
          break;
        }
        case "CLOSE_DUPLICATES": {
          const n = await closeDuplicateTabs();
          sendResponse({ success: true, count: n });
          break;
        }
        case "GET_SETTINGS":
          sendResponse(await getSettings());
          break;
        case "SAVE_SETTINGS":
          await saveSettings(msg.settings);
          sendResponse({ success: true });
          break;
        case "GET_STATS":
          sendResponse(await getLiveStats());
          break;
        case "GET_GROUP_INFO": {
          const groups = await chrome.tabGroups.query({});
          const tabs = await chrome.tabs.query({});
          sendResponse({ groups, tabs });
          break;
        }
        case "UNGROUP_BY_ID": {
          const gt = await chrome.tabs.query({ groupId: msg.groupId });
          for (const tab of gt) {
            try {
              await chrome.tabs.ungroup(tab.id);
            } catch {
              /* */
            }
          }
          sendResponse({ success: true });
          break;
        }
        default:
          sendResponse({ error: "Unknown message type" });
      }
    } catch (err) {
      console.error("Message handler error:", err);
      sendResponse({ error: err?.message || String(err) });
    }
  })();
  return true;
});
