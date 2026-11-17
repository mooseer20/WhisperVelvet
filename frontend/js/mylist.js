document.addEventListener("DOMContentLoaded", () => {

    const favs = JSON.parse(localStorage.getItem("favourites")) || [];
    const container = document.getElementById("mylist-container");

    if (!favs.length) {
        container.innerHTML = `<p class="empty-msg">Your list is empty...</p>`;
        return;
    }

    favs.forEach(id => {
        const m = allMovies[id]; // from your DB
        if (!m) return;

        const card = document.createElement("div");
        card.className = "movie-card";

        card.innerHTML = `
            <div class="movie-poster" style="background-image:url('${m.img}')"></div>

            <div class="movie-title">${id.toUpperCase()}</div>
            <div class="movie-meta">IMDB: ${m.imdb}</div>


            <div class="heart" data-id="${id}">❤️</div>
        `;

        container.appendChild(card);
    });

    document.addEventListener("click", e => {
        if (!e.target.classList.contains("heart")) return;

        const id = e.target.dataset.id;
        let favs = JSON.parse(localStorage.getItem("favourites")) || [];

        favs = favs.filter(f => f !== id);
        localStorage.setItem("favourites", JSON.stringify(favs));

        location.reload(); // refresh page
    });

});
