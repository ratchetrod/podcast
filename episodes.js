// ─────────────────────────────────────────────
//  EPISODES DATA
//  Add new episodes at the TOP of each array.
//
//  Fields:
//    num         – episode number (string)
//    title       – episode title
//    description – short blurb
//    date        – "MM/DD/YYYY"
//    spotify     – Spotify episode ID (from the share URL)
//    youtube     – YouTube video ID (from the watch URL), or null
//
//  To find IDs:
//    Spotify URL: open.spotify.com/episode/EPISODE_ID  ← copy that part
//    YouTube URL: youtube.com/watch?v=VIDEO_ID         ← copy that part
// ─────────────────────────────────────────────

const kitchenEpisodes = [
  {
    num: "03",
    title: "Episode Title",
    description: "A short description of what was talked about or cooked during this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: null
  },
  {
    num: "02",
    title: "Episode Title",
    description: "A short description of what was talked about or cooked during this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: null
  },
  {
    num: "01",
    title: "Episode Title",
    description: "A short description of what was talked about or cooked during this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: null
  }
];

const couchEpisodes = [
  {
    num: "06",
    title: "Episode Title",
    description: "A short description of the conversation or topic covered in this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: null
  },
  {
    num: "05",
    title: "Episode Title",
    description: "A short description of the conversation or topic covered in this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: null
  },
  {
    num: "04",
    title: "Episode Title",
    description: "A short description of the conversation or topic covered in this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: "_TubobfNp_0"
  }
];

const dishes = [
  "Dish Name One",
  "Dish Name Two",
  "Dish Name Three",
  "Dish Name Four",
  "Dish Name Five",
  "Dish Name Six"
];

// ─────────────────────────────────────────────
//  PAGE BUILDER – no need to edit below this line
// ─────────────────────────────────────────────

function buildCard(ep) {
  const youtube = validId(ep.youtube)
    ? `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;margin-top:1rem;">
        <iframe
          src="https://www.youtube.com/embed/${ep.youtube}"
          style="position:absolute;top:0;left:0;width:100%;height:100%;"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>`
    : "";

  const validId = id => id && !id.includes("_ID");

  const spotify = validId(ep.spotify)
    ? `<iframe
        src="https://open.spotify.com/embed/episode/${ep.spotify}"
        width="100%"
        height="152"
        frameborder="0"
        allowtransparency="true"
        allow="encrypted-media"
        style="margin-top:1rem;border-radius:4px;"
      ></iframe>`
    : "";

  return `
    <div class="card">
      <h3>${ep.title}</h3>
      <p>${ep.description}</p>
      <div class="ep-meta">Ep. ${ep.num} &bull; ${ep.date}</div>
      ${spotify}
      ${youtube}
    </div>`;
}

function buildDishList(dishes) {
  return dishes.map(d => `<li>${d}</li>`).join("\n        ");
}

document.getElementById("kitchen-grid").innerHTML = kitchenEpisodes.map(buildCard).join("");
document.getElementById("couch-grid").innerHTML   = couchEpisodes.map(buildCard).join("");
document.getElementById("dish-list").innerHTML    = buildDishList(dishes);
