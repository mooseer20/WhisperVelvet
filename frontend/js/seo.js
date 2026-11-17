const BASE = "https://gentle-kitsune-99e4c1.netlify.app";

const SEO = {
  "index.html": {
    title: "Velvet Whispers — Watch Vampire & Supernatural Series",
    description: "Stream vampire series, dark romance movies, and supernatural TV shows on Velvet Whispers. Discover Vampire Diaries, The Originals, Lucifer, and more.",
    index: true
  },
  "moviess.html": {
    title: "Vampire & Horror Movies | Velvet Whispers",
    description: "Browse vampire and horror movies on Velvet Whispers — Twilight, Nosferatu, Morbius, Underworld, and more. Find your next dark fantasy film tonight.",
    index: true
  },
  "tvshows.html": {
    title: "Supernatural TV Shows | Velvet Whispers",
    description: "Explore the best supernatural TV shows on Velvet Whispers — The Vampire Diaries, Legacies, True Blood, Castlevania, and every dark series worth bingeing.",
    index: true
  },
  "vampire.html": {
    title: "Sign in | Velvet Whispers",
    description: null,
    index: false 
  },
  "favourites.html": {
    title: "My Watchlist | Velvet Whispers",
    description: "Your saved watchlist on Velvet Whispers. Pick up where you left off — all your favourite vampire series and dark movies in one place.",
    index: false
  },
  "fav2.html": {
    title: "My Favourites | Velvet Whispers",
    description: "Your favourite vampire series and dark movies saved in one place on Velvet Whispers.",
    index: false
  },
  "movieinfo.html": {
    title: null,
    description: null,
    index: true
  },
  "whoiswatch.html": {
    title: "Who's Watching? | Velvet Whispers",
    description: "Select your profile to start watching on Velvet Whispers.",
    index: false
  },
  "mage.html": {
    title: "Manage Profiles | Velvet Whispers",
    description: null,
    index: false
  },
  "signin.html": {
    title: "Sign In | Velvet Whispers",
    description: null,
    index: false
  },
  "signup.html": {
    title: "Sign Up | Velvet Whispers",
    description: null,
    index: false
  }
};

(function () {
  const page = location.pathname.split("/").pop() || "index.html";
  const params = new URLSearchParams(location.search);
  const movieTitle = params.get("title");

  let entry = SEO[page];

  if (page === "movieinfo.html" && movieTitle) {
    entry = {
      title: movieTitle + " | Velvet Whispers",
      description: "Watch " + movieTitle + " on Velvet Whispers — your home for vampire and supernatural stories told in crimson.",
      index: true
    };
  }

  if (!entry) return;

  if (entry.title) {
    document.title = entry.title;
  }

  if (entry.description) {
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = entry.description;
  }

  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement("meta");
    robots.name = "robots";
    document.head.appendChild(robots);
  }
  robots.content = entry.index ? "index, follow" : "noindex, nofollow";

  if (entry.index) {
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = BASE + location.pathname + location.search;
  }

})();