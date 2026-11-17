
function movie(img, imdb, link = "movieinfo.html") {
  const src = (typeof assetUrl === "function") ? assetUrl(img) : img;
  return { img: src, imdb, link };
}

const allMovies = {
    "twlight": movie("../twlight.jpeg", "5.2"),
    "leg": movie("../leg.jpeg", "7.3"),
    "vamp": movie("../vamp.jpeg", "7.7"),
    "originals": movie("../originals.jpeg", "8.2"),

    "nos": movie("../nos.jpeg", "8.0"),
    "tala": movie("../tala.jpeg", "7.1"),
    "drac": movie("../drac.jpeg", "7.4"),
    "priest": movie("../priest.jpeg", "5.7"),
    "fromdusk": movie("../fromdusk.jpeg", "7.2"),
    "morb": movie("../morb.jpeg", "5.1"),
    "leg2": movie("../leg2.jpeg", "7.3"),
    "teenw": movie("../teenw.jpeg", "7.7"),
    "underwo": movie("../underwo.jpeg", "7.0"),
    "zomb": movie("../zomb.jpeg", "6.8"),
    "nightt": movie("../nightt.jpeg", "7.6"),
    "luc": movie("../luc.jpeg", "8.2"),

    "dracdrac": movie("../dracdrac.jpeg", "8.5", "dracula_info.html"),
    "castl": movie("../castl.jpeg", "8.2", "castlevania_info.html"),
    "hem": movie("../hem.jpeg", "7.1", "hemlock_info.html"),
    "tb": movie("../tb.jpeg", "7.9", "trueblood_info.html"),
    "sh": movie("../sh.jpeg", "6.7", "shadowhunters_info.html"),
    "vh": movie("../vh.jpeg", "6.9", "vanhelsing_info.html"),
    "firsrtkill": movie("../firsrtkill.jpeg", "6.6", "firstkill_info.html"),
    "fate": movie("../fate.jpeg", "6.9", "fatewinxsaga.html"),
    "wwds": movie("../wwds.jpeg", "8.5", "whatwedointheshadows_info.html"),
    "from": movie("../from.jpeg", "7.7", "from_info.html"),
    "mm": movie("../mm.jpeg", "7.4", "midnightmass_info.html"),
    "thorder": movie("../thorder.jpeg", "6.8", "theorder.html"),
    "dreadful": movie("../dreadful.jpeg", "8.2", "pennydreadful_info.html"),
    "vampac": movie("../vampac.jpeg", "6.5", "vampacademy_info.html"),
    "str": movie("../str.jpeg", "7.3", "THESTRAIN_info.html"),
    "van": movie("../van.jpeg", "6.9", "vanhelsing_info.html"),
    "beinghuman": movie("../beinghuman.jpeg", "7.8", "beinghuman_info.html"),
    "bloodties": movie("../bloodties.jpeg", "6.6", "bloodties_info.html")
};

document.addEventListener("DOMContentLoaded", () => {
    const favs = JSON.parse(localStorage.getItem("favourites")) || [];
    const container = document.getElementById("favourites-container");

    if (!favs.length) {
        container.innerHTML = `<p class="empty-msg">No favorites yet...</p>`;
        return;
    }

    favs.forEach(id => {
        const m = allMovies[id];
        if (!m) return;

        const div = document.createElement("div");
        div.className = "movie-wrapper";

        div.innerHTML = `
            <a href="${m.link}">
                <div class="movie-card" style="background-image:url('${m.img}')"></div>
            </a>
            <div class="movie-info-bar">
                <div class="fav-btn active" data-movie="${id}">
                    <i class="fa-solid fa-heart"></i>
                </div>
                <div class="imdb-block">
                    <i class="fa-solid fa-star"></i> ${m.imdb}
                </div>
            </div>
        `;

        container.appendChild(div);
    });

    // Remove from favorites when clicked
    document.querySelectorAll(".fav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const movieName = btn.dataset.movie;

            let favs = JSON.parse(localStorage.getItem("favourites")) || [];
            favs = favs.filter(m => m !== movieName);
            localStorage.setItem("favourites", JSON.stringify(favs));

            // Refresh to update list visually
            location.reload();
        });
    });
});
