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
    title: "The Impact Of Technology On The Youth w/ Unique Starr",
    description: "In this conversation, Dav Lewis and guest, Unique Starr, discusse her journey through the Harvard Social Impact Initiative, grappling with feelings of shame and identity as he navigates the intersection of elite education and his commitment to his community. They delve into the impact of technology on children, particularly regarding screen addiction, and Unique Starr shares her personal experiences as a parent who has chosen to limit technology for his daughter. The discussion also touches on food choices, cultural identity, and the challenges of cooking and meal prep in a busy life, highlighting the importance of being mindful about what we consume and how it shapes our lives.",
    date: "03/06/2026",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: "q3RHFCVmqjE"
  },
  {
    title: "Justice & Forgiveness",
    description: "In this episode Dav and special guest, Tatiuana Holland, explore a range of topics including cooking (Oyster Mushrooms + Dirty Rice), Louisiana roots, academic journey, legal career, the psychology of law, fairness in the legal system, collaborative justice, the criminal justice system, forgiveness, and self-healing. The discussion delves into the concept of collaborative justice and the complexities of forgiveness and self-healing.",
    date: "02/27/2026",
    spotify: "SPOTIFY_EPISODE_ID",
    youtube: "VremHABoPqw"
  }
];

const couchEpisodes = [
  {
    title: "Detaching To Align In Purpose w/ Unique Starr",
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

// ─────────────────────────────────────────────
//  YOUTUBE API KEY
//  Get one free at: console.cloud.google.com
//  Enable "YouTube Data API v3" then create an API key
// ─────────────────────────────────────────────
const YOUTUBE_API_KEY = "YOUR_API_KEY_HERE";

// All episodes in one flat list so cards can reference them by index
const allEpisodes = [...kitchenEpisodes, ...couchEpisodes];

function buildCard(ep, index) {
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

  const desc = ep.description || "";
  const { short, isTruncated } = truncate(desc);
  const readMore = isTruncated
    ? `<button class="read-more" data-index="${index}">Read more</button>`
    : "";

  return `
    <div class="card" id="card-${index}">
      <h3>${ep.title}</h3>
      <p class="card-desc">${short}${readMore}</p>
      <div class="ep-meta">${ep.date}</div>
      ${spotify}
      ${youtube}
    </div>`;
}

function updateCardDesc(index) {
  const ep = allEpisodes[index];
  const card = document.getElementById(`card-${index}`);
  if (!card) return;
  const descEl = card.querySelector(".card-desc");
  const { short, isTruncated } = truncate(ep.description || "");
  const readMore = isTruncated
    ? `<button class="read-more" data-index="${index}">Read more</button>`
    : "";
  descEl.innerHTML = short + readMore;
}

function buildDishList(dishes) {
  return dishes.map(d => `<li>${d}</li>`).join("\n        ");
}

function openModal(ep) {
  document.getElementById("modal-title").textContent = ep.title;
  document.getElementById("modal-meta").textContent = ep.date;
  document.getElementById("modal-description").textContent = ep.description || "";
  document.getElementById("modal-overlay").classList.add("open");
}

function closeModal() {
  document.getElementById("modal-overlay").classList.remove("open");
}

async function fetchYouTubeDescriptions() {
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === "YOUR_API_KEY_HERE") return;

  const ids = allEpisodes
    .map((ep, i) => ({ id: ep.youtube, index: i }))
    .filter(({ id }) => validId(id));

  if (!ids.length) return;

  const videoIds = ids.map(({ id }) => id).join(",");
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    data.items.forEach(item => {
      const match = ids.find(({ id }) => id === item.id);
      if (match && !allEpisodes[match.index].description) {
        allEpisodes[match.index].description = item.snippet.description;
        updateCardDesc(match.index);
      }
    });
  } catch (e) {
    console.warn("Could not fetch YouTube descriptions:", e);
  }
}

document.getElementById("modal-close").addEventListener("click", closeModal);
document.getElementById("modal-overlay").addEventListener("click", function(e) {
  if (e.target === this) closeModal();
});
document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeModal();
});
document.addEventListener("click", function(e) {
  if (e.target.classList.contains("read-more")) {
    openModal(allEpisodes[e.target.dataset.index]);
  }
});

document.getElementById("kitchen-grid").innerHTML = kitchenEpisodes.map(buildCard).join("");
document.getElementById("couch-grid").innerHTML   = couchEpisodes.map((ep, i) => buildCard(ep, kitchenEpisodes.length + i)).join("");
document.getElementById("dish-list").innerHTML    = buildDishList(dishes);

fetchYouTubeDescriptions();
