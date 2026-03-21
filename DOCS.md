# Podcast Site – Developer Reference

Personal reference for APIs, embeds, and troubleshooting.

---

## Spotify Podcast Embed

Use Spotify's oEmbed to embed individual episodes directly in the page.

### How to get the embed code

1. Open Spotify (web or desktop)
2. Navigate to your episode
3. Click the **three dots (…)** → **Share** → **Embed episode**
4. Copy the `<iframe>` code

### Standard embed format

```html
<iframe
  src="https://open.spotify.com/embed/episode/{EPISODE_ID}"
  width="100%"
  height="152"
  frameborder="0"
  allowtransparency="true"
  allow="encrypted-media"
></iframe>
```

Replace `{EPISODE_ID}` with the ID from your episode's Spotify URL.
Example URL: `https://open.spotify.com/episode/4rOoJ6Egrf8K2IrywzwOMk`
→ Episode ID: `4rOoJ6Egrf8K2IrywzwOMk`

### Compact player (152px height) vs. full player (232px height)

- `height="152"` → compact player (just the episode bar)
- `height="232"` → full player (includes cover art and description)

### Troubleshooting

| Problem | Fix |
|---|---|
| Embed shows "Episode not available" | Episode may not be published yet or is region-restricted |
| Embed is blank | Check that the episode ID is correct and the src URL is exact |
| iframe blocked | Ensure `allow="encrypted-media"` is present |
| Not showing on mobile | Add `width="100%"` instead of a fixed pixel width |

---

## YouTube Episode Embed

Use YouTube's standard iframe embed to add video episodes to the page.

### How to get the embed code

1. Open the YouTube video
2. Click **Share** → **Embed**
3. Copy the `<iframe>` code, or build it manually using the video ID

### Standard embed format

```html
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/{VIDEO_ID}"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>
```

Replace `{VIDEO_ID}` with the ID from the video's YouTube URL.
Example URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
→ Video ID: `dQw4w9WgXcQ`

### Responsive embed (recommended)

Wrap the iframe to make it scale with the page:

```html
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe
    src="https://www.youtube.com/embed/{VIDEO_ID}"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
  ></iframe>
</div>
```

### Useful URL parameters

Append these to the `src` URL as query strings (e.g. `?start=60&rel=0`):

| Parameter | Value | Effect |
|---|---|---|
| `start` | seconds | Start video at a specific time |
| `autoplay` | `1` | Autoplay on load (use sparingly) |
| `rel` | `0` | Don't show related videos at end |
| `cc_load_policy` | `1` | Show captions by default |
| `modestbranding` | `1` | Hide YouTube logo in player |

### Troubleshooting

| Problem | Fix |
|---|---|
| "Video unavailable" in embed | Video may be set to private or embedding disabled by owner |
| Embed not responsive | Use the responsive wrapper div above |
| Autoplay not working | Browsers block autoplay with sound; add `mute=1` to src params |
| `allowfullscreen` not working | Make sure the attribute is present on the `<iframe>` tag |

---

## Adding Embeds to index.html

Drop embeds inside the relevant section's card or directly below the section heading.

### Example – Spotify inside a kitchen episode card

```html
<div class="card">
  <h3>Episode Title</h3>
  <p>Short description of the episode.</p>
  <div class="ep-meta">Ep. 01 &bull; MM/DD/YYYY</div>
  <iframe
    src="https://open.spotify.com/embed/episode/{EPISODE_ID}"
    width="100%"
    height="152"
    frameborder="0"
    allowtransparency="true"
    allow="encrypted-media"
    style="margin-top: 1rem; border-radius: 4px;"
  ></iframe>
</div>
```

### Example – YouTube inside a couch episode card

```html
<div class="card">
  <h3>Episode Title</h3>
  <p>Short description of the episode.</p>
  <div class="ep-meta">Ep. 04 &bull; MM/DD/YYYY</div>
  <div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; margin-top: 1rem;">
    <iframe
      src="https://www.youtube.com/embed/{VIDEO_ID}"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  </div>
</div>
```

---

## Adding a New Episode

All episode data lives in **`episodes.js`** — that's the only file you touch when a new episode drops.

### Steps

1. Open `episodes.js`
2. Add a new entry at the **top** of the correct array (`kitchenEpisodes` or `couchEpisodes`)
3. Fill in the fields:

```js
{
  num: "07",
  title: "Your Episode Title",
  description: "Short description of what was covered.",
  date: "03/21/2026",
  spotify: "SPOTIFY_EPISODE_ID",   // from open.spotify.com/episode/THIS_PART
  youtube: "YOUTUBE_VIDEO_ID"      // from youtube.com/watch?v=THIS_PART  (or null)
},
```

4. Save, commit, push — the page updates automatically.

### Adding a dish

In the same `episodes.js` file, add to the `dishes` array at the top:

```js
const dishes = [
  "New Dish Name",   // ← add here
  "Dish Name One",
  ...
];
```

---

## File Structure

```
podcast/
├── index.html      # Main page (no need to edit for new episodes)
├── styles.css      # All styling
├── episodes.js     # Episode data — edit this for every new release
└── DOCS.md         # This file
```
