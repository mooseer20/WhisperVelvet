
function movie(img, imdb, link = "movieinfo.html") {
  const src = (typeof assetUrl === "function") ? assetUrl(img) : img;
  return { img: src, imdb, link };
}

const allMovies = {
    "twlight": movie("assets/images/twlight.jpeg", "5.2"),
    "leg": movie("assets/images/leg.jpeg", "7.3"),
    "vamp": movie("assets/images/vamp.jpeg", "7.7"),
    "originals": movie("assets/images/originals.jpeg", "8.2"),

    "nos": movie("assets/images/nos.jpeg", "8.0"),
    "tala": movie("assets/images/tala.jpeg", "7.1"),
    "drac": movie("assets/images/drac.jpeg", "7.4"),
    "priest": movie("assets/images/priest.jpeg", "5.7"),
    "fromdusk": movie("assets/images/fromdusk.jpeg", "7.2"),
    "morb": movie("assets/images/morb.jpeg", "5.1"),
    "leg2": movie("assets/images/leg2.jpeg", "7.3"),
    "teenw": movie("assets/images/teenw.jpeg", "7.7"),
    "underwo": movie("assets/images/underwo.jpeg", "7.0"),
    "zomb": movie("assets/images/zomb.jpeg", "6.8"),
    "nightt": movie("assets/images/nightt.jpeg", "7.6"),
    "luc": movie("assets/images/luc.jpeg", "8.2"),

    "dracdrac": movie("assets/images/dracdrac.jpeg", "8.5", "dracula_info.html"),
    "castl": movie("assets/images/castl.jpeg", "8.2", "castlevania_info.html"),
    "hem": movie("assets/images/hem.jpeg", "7.1", "hemlock_info.html"),
    "tb": movie("assets/images/tb.jpeg", "7.9", "trueblood_info.html"),
    "sh": movie("assets/images/sh.jpeg", "6.7", "shadowhunters_info.html"),
    "vh": movie("assets/images/vh.jpeg", "6.9", "vanhelsing_info.html"),
    "firsrtkill": movie("assets/images/firsrtkill.jpeg", "6.6", "firstkill_info.html"),
    "fate": movie("assets/images/fate.jpeg", "6.9", "fatewinxsaga.html"),
    "wwds": movie("assets/images/wwds.jpeg", "8.5", "whatwedointheshadows_info.html"),
    "from": movie("assets/images/from.jpeg", "7.7", "from_info.html"),
    "mm": movie("assets/images/mm.jpeg", "7.4", "midnightmass_info.html"),
    "thorder": movie("assets/images/thorder.jpeg", "6.8", "theorder.html"),
    "dreadful": movie("assets/images/dreadful.jpeg", "8.2", "pennydreadful_info.html"),
    "vampac": movie("assets/images/vampac.jpeg", "6.5", "vampacademy_info.html"),
    "str": movie("assets/images/str.jpeg", "7.3", "THESTRAIN_info.html"),
    "van": movie("assets/images/van.jpeg", "6.9", "vanhelsing_info.html"),
    "beinghuman": movie("assets/images/beinghuman.jpeg", "7.8", "beinghuman_info.html"),
    "bloodties": movie("assets/images/bloodties.jpeg", "6.6", "bloodties_info.html")
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
