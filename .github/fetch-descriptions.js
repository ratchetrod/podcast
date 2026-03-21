const https = require("https");
const fs = require("fs");

const API_KEY = process.env.YOUTUBE_API_KEY;

if (!API_KEY) {
  console.log("No YOUTUBE_API_KEY set — skipping.");
  fs.writeFileSync("descriptions.json", "{}");
  process.exit(0);
}

const src = fs.readFileSync("episodes.js", "utf8");
const ids = [...src.matchAll(/youtube:\s*["']([a-zA-Z0-9_-]{11})["']/g)].map(m => m[1]);

if (!ids.length) {
  console.log("No YouTube IDs found — skipping.");
  fs.writeFileSync("descriptions.json", "{}");
  process.exit(0);
}

console.log("Fetching descriptions for:", ids);

const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${ids.join(",")}&key=${API_KEY}`;

https.get(url, res => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    let json;
    try {
      json = JSON.parse(data);
    } catch (e) {
      console.error("Failed to parse YouTube response:", data);
      process.exit(1);
    }

    if (json.error) {
      console.error("YouTube API error:", json.error.message);
      process.exit(1);
    }

    const out = {};
    json.items.forEach(item => {
      const raw = item.snippet.publishedAt;
      const d = new Date(raw);
      const date = `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
      out[item.id] = {
        description: item.snippet.description,
        date
      };
    });

    fs.writeFileSync("descriptions.json", JSON.stringify(out, null, 2));
    console.log("Saved descriptions for:", Object.keys(out));
  });
}).on("error", err => {
  console.error("Request failed:", err.message);
  process.exit(1);
});
