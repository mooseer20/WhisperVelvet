function movie(img, imdb, link = "movieinfo.html") {
  const src = (typeof assetUrl === "function") ? assetUrl(img) : img;
  return { img: src, imdb, link };
}

const allMovies = {

    "twlight": movie(
        "assets/images/twlight.jpeg",
        "5.2",
        2008,
        "122 min",
        ["Romance", "Fantasy"],
        "Her blood awakened something ancient."
    ),

    "vamp": movie(
        "assets/images/vamp.jpeg",
        "7.7",
        2009,
        "44 min",
        ["Drama", "Fantasy"],
        "Love. Death. Blood. Everything collides."
    ),

    "originals": movie(
        "assets/images/originals.jpeg",
        "8.2",
        2013,
        "45 min",
        ["Fantasy", "Horror"],
        "Family is power… but at what cost?"
    ),

    "beinghuman": movie(
        "assets/images/beinghuman.jpeg",
        "7.8",
        2011,
        "60 min",
        ["Drama", "Supernatural"],
        "A ghost, a vampire, and a werewolf walk into an apartment."
    ),

    "bloodties": movie(
        "assets/images/bloodties.jpeg",
        "6.6",
        2007,
        "43 min",
        ["Crime", "Romance"],
        "Every case reveals a darker truth."
    )

    // ADD MORE MOVIES IN SAME FORMAT
};
