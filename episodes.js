// ─────────────────────────────────────────────
//  EPISODES DATA
//  Add new episodes at the TOP of each array.
//
//  Fields:
//    title    – episode title
//    date     – "MM/DD/YYYY"
//    spotify  – Spotify episode ID (from the share URL), or null
//    youtube  – YouTube video ID (from the watch URL), or null
//
//  NOTE: descriptions are pulled automatically from YouTube.
//  Only add a description manually if the episode has no YouTube ID.
//
//  To find IDs:
//    Spotify URL: open.spotify.com/episode/EPISODE_ID  ← copy that part
//    YouTube URL: youtube.com/watch?v=VIDEO_ID         ← copy that part
// ─────────────────────────────────────────────

const kitchenEpisodes = [
  {
    title: "The Power Of Affirmation & Self Advocacy w/ Tatiauna Holland",
    date: "03/13/2026",
    spotify: null,
    youtube: "9CoWP2DazGA"
  },
  {
    title: "The Impact Of Technology On The Youth w/ Unique Starr",
    date: "03/06/2026",
    spotify: null,
    youtube: "q3RHFCVmqjE"
  },
  {
    title: "Justice & Forgiveness",
    date: "02/27/2026",
    spotify: null,
    youtube: "VremHABoPqw"
  }
];

const couchEpisodes = [
  {
    title: "Detaching To Align In Purpose w/ Unique Starr",
    date: "03/20/2026",
    spotify: null,
    youtube: "_TubobfNp_0"
  },
  {
    title: "Part III: Give Me A Year by Shonda Scott",
    date: "01/23/2026",
    spotify: null,
    youtube: "K7h7wnsRCNY"
  },
  {
    title: "Part II: Give Me A Year by Shonda Scott",
    date: "MM/DD/YYYY",
    spotify: null,
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

// Descriptions are fetched from descriptions.json, which is generated
// automatically by the GitHub Action on every push. No API key needed here.

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
  try {
    const res = await fetch("descriptions.json");
    if (!res.ok) return;
    const data = await res.json();
    allEpisodes.forEach((ep, index) => {
      if (ep.youtube && data[ep.youtube] && !ep.description) {
        ep.description = data[ep.youtube];
        updateCardDesc(index);
      }
    });
  } catch (e) {
    console.warn("Could not load descriptions.json:", e);
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
