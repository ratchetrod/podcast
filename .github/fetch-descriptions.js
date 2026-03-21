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
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
}

// Fetch all pages of a playlist
async function fetchPlaylist(playlistId) {
  const episodes = [];
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
      return episodes;
    }

    for (const item of json.items) {
      const s = item.snippet;
      // skip deleted / private videos
      if (!s.resourceId || s.title === "Deleted video" || s.title === "Private video") continue;

      episodes.push({
        title:       s.title,
        youtube:     s.resourceId.videoId,
        description: s.description,
        date:        formatDate(s.publishedAt),
        spotify:     null   // filled in manually via spotifyIds in episodes.js
      });
    }

    pageToken = json.nextPageToken || "";
  } while (pageToken);

  return episodes;
}

// ─── main ─────────────────────────────────────────────────────────────────────

(async () => {
  // Load existing episodes.json to preserve any manually added Spotify IDs
  let existing = { kitchen: [], couch: [] };
  if (fs.existsSync("episodes.json")) {
    try { existing = JSON.parse(fs.readFileSync("episodes.json", "utf8")); }
    catch (_) {}
  }

  // Build a map of YouTube ID → Spotify ID from whatever was saved before
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
