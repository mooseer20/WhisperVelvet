const API_BASE = "/WhispVelvet/backend/api";

export async function getByTitle(type, title) {
  const res = await fetch(
    `${API_BASE}/movie.php?title=${encodeURIComponent(title)}`
  );
  return await res.json();
}
