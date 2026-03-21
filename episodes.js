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
    title: "The Power Of Affirmation & Self Advocacy w/ Tatiauna Holland",
    description: "Tatiauna Holland delves into the importance of self-advocacy and the power of affirmation. She shares personal stories about growing up in a supportive environment that encouraged her to express herself and pursue her dreams. Tatiauna discusses the challenges of societal expectations, particularly within the Black community, and emphasizes the need for mindset shifts to overcome these barriers. The conversation also touches on the significance of teaching children to advocate for themselves and the impact of having affirming role models.",
    date: "03/13/2026",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: "9CoWP2DazGA"
  },
  {
    title: "Episode Title",
    description: "A short description of what was talked about or cooked during this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: null
  },
  {
    title: "Episode Title",
    description: "A short description of what was talked about or cooked during this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: null
  }
];

const couchEpisodes = [
  {
    title: "DetachingTo Align In Purpose w/ Unique Starr",
    description: "A short description of the conversation or topic covered in this episode.",
    date: "03/20/2026",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: "_TubobfNp_0"
  },
  {
    title: "Part III: Give Me A Year by Shonda Scott",
    description: "A short description of the conversation or topic covered in this episode.",
    date: "01/23/2026",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: "K7h7wnsRCNY"
  },
  {
    title: "Part II: Give Me A Year by Shonda Scott",
    description: "A short description of the conversation or topic covered in this episode.",
    date: "MM/DD/YYYY",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: "3ava3d1YsNI"
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

function validId(id) {
  return id && !id.includes("_ID");
}

const TRUNCATE_LENGTH = 120;

function truncate(text) {
  if (text.length <= TRUNCATE_LENGTH) return { short: text, isTruncated: false };
  return { short: text.slice(0, text.lastIndexOf(" ", TRUNCATE_LENGTH)) + "…", isTruncated: true };
}

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

  const { short, isTruncated } = truncate(ep.description);
  const safeDesc = ep.description.replace(/'/g, "\\'");
  const safeTitle = ep.title.replace(/'/g, "\\'");
  const readMore = isTruncated
    ? `<button class="read-more" onclick="openModal('${safeTitle}', '${ep.date}', '${safeDesc}')">Read more</button>`
    : "";

  return `
    <div class="card">
      <h3>${ep.title}</h3>
      <p>${short}${readMore}</p>
      <div class="ep-meta">${ep.date}</div>
      ${spotify}
      ${youtube}
    </div>`;
}

function buildDishList(dishes) {
  return dishes.map(d => `<li>${d}</li>`).join("\n        ");
}

function openModal(title, date, description) {
  document.getElementById("modal-title").textContent = title;
  document.getElementById("modal-meta").textContent = date;
  document.getElementById("modal-description").textContent = description;
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeModal();
});

document.getElementById("kitchen-grid").innerHTML = kitchenEpisodes.map(buildCard).join("");
document.getElementById("couch-grid").innerHTML   = couchEpisodes.map(buildCard).join("");
document.getElementById("dish-list").innerHTML    = buildDishList(dishes);
