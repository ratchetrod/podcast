const https = require("https");
const fs = require("fs");

const API_KEY          = process.env.YOUTUBE_API_KEY;
const KITCHEN_PLAYLIST = process.env.KITCHEN_PLAYLIST_ID;
const COUCH_PLAYLIST   = process.env.COUCH_PLAYLIST_ID;

if (!API_KEY) {
  console.log("No YOUTUBE_API_KEY set — skipping.");
  process.exit(0);
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error("Failed to parse response: " + data)); }
      });
    }).on("error", reject);
  });
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

// Fetch all video IDs from a playlist (all pages)
async function fetchPlaylistIds(playlistId) {
  const items = [];
  let pageToken = "";

  do {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems` +
      `?part=snippet&maxResults=50&playlistId=${playlistId}` +
      `&key=${API_KEY}` +
      (pageToken ? `&pageToken=${pageToken}` : "");

    const json = await get(url);

    if (json.error) {
      console.error(`YouTube API error for playlist ${playlistId}:`, json.error.message);
      return items;
    }

    for (const item of json.items) {
      const s = item.snippet;
      if (!s.resourceId || s.title === "Deleted video" || s.title === "Private video") continue;
      items.push({ title: s.title, youtube: s.resourceId.videoId });
    }

    pageToken = json.nextPageToken || "";
  } while (pageToken);

  return items;
}

// Fetch actual publish dates + descriptions from videos.list (max 50 per call)
async function fetchVideoDetails(videoIds) {
  const details = {};

  // Videos API accepts up to 50 IDs at a time
  for (let i = 0; i < videoIds.length; i += 50) {
    const batch = videoIds.slice(i, i + 50).join(",");
    const url =
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet&id=${batch}&key=${API_KEY}`;

    const json = await get(url);

    if (json.error) {
      console.error("YouTube videos API error:", json.error.message);
      continue;
    }

    for (const item of json.items) {
      details[item.id] = {
        description: item.snippet.description || "",
        date:        formatDate(item.snippet.publishedAt)
      };
    }
  }

  return details;
}

// Combine playlist order with real video metadata
async function fetchPlaylist(playlistId) {
  const items = await fetchPlaylistIds(playlistId);
  if (!items.length) return [];

  const ids     = items.map(i => i.youtube);
  const details = await fetchVideoDetails(ids);

  return items.map(item => ({
    title:       item.title,
    youtube:     item.youtube,
    description: details[item.youtube]?.description || "",
    date:        details[item.youtube]?.date        || "",
    spotify:     null
  }));
}

// ─── main ─────────────────────────────────────────────────────────────────────

(async () => {
  let existing = { kitchen: [], couch: [] };
  if (fs.existsSync("episodes.json")) {
    try { existing = JSON.parse(fs.readFileSync("episodes.json", "utf8")); }
    catch (_) {}
  }

  const spotifyMap = {};
  [...existing.kitchen, ...existing.couch].forEach(ep => {
    if (ep.youtube && ep.spotify) spotifyMap[ep.youtube] = ep.spotify;
  });

  const out = { kitchen: [], couch: [] };

  if (KITCHEN_PLAYLIST) {
    console.log("Fetching kitchen playlist:", KITCHEN_PLAYLIST);
    out.kitchen = await fetchPlaylist(KITCHEN_PLAYLIST);
    out.kitchen.forEach(ep => { ep.spotify = spotifyMap[ep.youtube] || null; });
    console.log(`  → ${out.kitchen.length} episodes`);
  } else {
    console.log("No KITCHEN_PLAYLIST_ID — keeping existing kitchen episodes.");
    out.kitchen = existing.kitchen;
  }

  if (COUCH_PLAYLIST) {
    console.log("Fetching couch playlist:", COUCH_PLAYLIST);
    out.couch = await fetchPlaylist(COUCH_PLAYLIST);
    out.couch.forEach(ep => { ep.spotify = spotifyMap[ep.youtube] || null; });
    console.log(`  → ${out.couch.length} episodes`);
  } else {
    console.log("No COUCH_PLAYLIST_ID — keeping existing couch episodes.");
    out.couch = existing.couch;
  }

  fs.writeFileSync("episodes.json", JSON.stringify(out, null, 2));
  console.log("Saved episodes.json");
})();
