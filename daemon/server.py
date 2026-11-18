"""Read-only MCP tools backed by Velvet Whispers' PostgreSQL catalog."""

import os
from pathlib import Path

import psycopg
from dotenv import load_dotenv
from mcp.server import MCPServer
from psycopg.rows import dict_row

ROOT = Path(__file__).resolve().parent.parent
DOCS_ENV = ROOT / "docs" / ".env"
ROOT_ENV = ROOT / ".env"
load_dotenv(DOCS_ENV if DOCS_ENV.exists() else ROOT_ENV)

mcp = MCPServer("daemon")


def connect_db():
    """Open the existing app database using the same DB_* settings as PHP."""
    return psycopg.connect(
        host=os.environ.get("DB_HOST", "127.0.0.1"),
        port=os.environ.get("DB_PORT", "5432"),
        dbname=os.environ.get("DB_NAME", "vampires"),
        user=os.environ.get("DB_USER", "postgres"),
        password=os.environ.get("DB_PASS") or None,
        row_factory=dict_row,
        connect_timeout=4,
    )


def keyword_predicate(columns: list[str], words: list[str]) -> tuple[str, list[str]]:
    """Build a parameterized ILIKE predicate for catalog text columns."""
    groups = []
    parameters = []
    for word in words:
        pattern = f"%{word}%"
        groups.append("(" + " OR ".join(f"COALESCE({column}, '') ILIKE %s" for column in columns) + ")")
        parameters.extend([pattern] * len(columns))
    return "(" + " OR ".join(groups) + ")", parameters


def format_title(row: dict) -> str:
    summary = row.get("synopsis") or row.get("long_description") or "No description is available."
    genres = row.get("genres")
    rating = row.get("rating_score")
    extras = []
    if row.get("category"):
        extras.append(str(row["category"]))
    if genres:
        extras.append(f"Genres: {genres}")
    if rating is not None:
        extras.append(f"Rating: {rating}")
    suffix = f" ({'; '.join(extras)})" if extras else ""
    return f"{row['title']}{suffix} — {summary}"


@mcp.tool()
def search_titles(query: str) -> str:
    """Search the Velvet Whispers PostgreSQL catalog by title or story keywords."""
    words = [word.strip(".,!?;:") for word in query.lower().split() if len(word.strip(".,!?;:")) > 2][:8]
    if not words:
        return "Please provide a title or a few search keywords."
    predicate, parameters = keyword_predicate(
        ["ms.title", "ms.original_title", "ms.synopsis", "ms.long_description"], words
    )
    sql = f"""
        SELECT ms.title, ms.category, ms.synopsis, ms.long_description, ms.rating_score
        FROM movies_series ms
        WHERE {predicate}
        ORDER BY ms.is_featured DESC, ms.rating_score DESC NULLS LAST, ms.title ASC
        LIMIT 8
    """
    try:
        with connect_db() as connection, connection.cursor() as cursor:
            cursor.execute(sql, parameters)
            rows = cursor.fetchall()
    except psycopg.Error:
        return "The Velvet Whispers catalog database is not reachable. Check docs/.env and PostgreSQL."
    if not rows:
        return "No matching titles were found in the Velvet Whispers catalog."
    return "\n".join(format_title(row) for row in rows)


@mcp.tool()
def recommend_by_mood(mood: str) -> str:
    """Recommend catalog titles by mood, genre, or story keywords."""
    words = [word.strip(".,!?;:") for word in mood.lower().split() if len(word.strip(".,!?;:")) > 2][:8]
    if not words:
        return "Please describe a mood or genre, such as dark romance or vampire action."
    predicate, parameters = keyword_predicate(
        ["ms.title", "ms.category", "ms.synopsis", "ms.long_description", "g.name"], words
    )
    sql = f"""
        SELECT ms.title, ms.category, ms.synopsis, ms.long_description, ms.rating_score,
               COALESCE(STRING_AGG(DISTINCT g.name, ', '), '') AS genres
        FROM movies_series ms
        LEFT JOIN movie_series_genres msg ON msg.movie_series_id = ms.id
        LEFT JOIN genres g ON g.id = msg.genre_id
        WHERE {predicate}
        GROUP BY ms.id, ms.title, ms.category, ms.synopsis, ms.long_description,
                 ms.rating_score, ms.is_featured
        ORDER BY ms.is_featured DESC, ms.rating_score DESC NULLS LAST, ms.title ASC
        LIMIT 5
    """
    try:
        with connect_db() as connection, connection.cursor() as cursor:
            cursor.execute(sql, parameters)
            rows = cursor.fetchall()
    except psycopg.Error:
        return "The Velvet Whispers catalog database is not reachable. Check docs/.env and PostgreSQL."
    if not rows:
        return "No titles matched that mood in the Velvet Whispers catalog."
    return "\n".join(format_title(row) for row in rows)


@mcp.tool()
def get_title_details(title: str) -> str:
    """Get a catalog title's synopsis, category, rating, and genres."""
    title = title.strip()
    if not title:
        return "Please provide a title to look up."
    sql = """
        SELECT ms.title, ms.category, ms.synopsis, ms.long_description, ms.rating_score,
               COALESCE(STRING_AGG(DISTINCT g.name, ', '), '') AS genres
        FROM movies_series ms
        LEFT JOIN movie_series_genres msg ON msg.movie_series_id = ms.id
        LEFT JOIN genres g ON g.id = msg.genre_id
        WHERE ms.title ILIKE %s OR ms.original_title ILIKE %s
        GROUP BY ms.id, ms.title, ms.category, ms.synopsis, ms.long_description,
                 ms.rating_score, ms.is_featured
        ORDER BY ms.is_featured DESC, ms.title ASC
        LIMIT 1
    """
    try:
        with connect_db() as connection, connection.cursor() as cursor:
            cursor.execute(sql, (f"%{title}%", f"%{title}%"))
            row = cursor.fetchone()
    except psycopg.Error:
        return "The Velvet Whispers catalog database is not reachable. Check docs/.env and PostgreSQL."
    if not row:
        return f"No catalog title matching {title!r} was found."
    return format_title(row)


if __name__ == "__main__":
    mcp.run(
        transport="streamable-http",
        host=os.environ.get("MCP_HOST", "127.0.0.1"),
        port=int(os.environ.get("MCP_PORT", "8001")),
    )
