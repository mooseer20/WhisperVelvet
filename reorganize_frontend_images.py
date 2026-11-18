
from pathlib import Path
import re
import sys

ROOT = Path.cwd()
FRONTEND = ROOT / "frontend"
DEST = FRONTEND / "assets" / "images"

EXTENSIONS = {
    ".png", ".jpg", ".jpeg",
    ".webp", ".gif", ".ico", ".avif"
}

SOURCE_EXTENSIONS = {
    ".html", ".htm", ".css", ".js",
    ".mjs", ".php", ".json", ".xml"
}

APPLY = "--apply" in sys.argv

images = [
    p for p in FRONTEND.iterdir()
    if p.is_file() and p.suffix.lower() in EXTENSIONS
]

if not images:
    sys.exit("No images found directly inside frontend/")

if any((DEST / p.name).exists() for p in images):
    sys.exit("STOP: A destination filename already exists.")

changes = {}
total = 0

for source in ROOT.rglob("*"):
    if not source.is_file():
        continue

    if source.suffix.lower() not in SOURCE_EXTENSIONS:
        continue

    if any(x in source.parts for x in
           [".git", "node_modules", "vendor"]):
        continue

    try:
        original = source.read_text(encoding="utf-8")
    except (UnicodeDecodeError, OSError):
        continue

    updated = original

    for img in images:
        # CSS paths are relative to the CSS file.
        # HTML paths are relative to the HTML file.
        # JS image strings are assumed to be resolved
        # relative to frontend HTML documents.
        if source.suffix.lower() in {".js", ".mjs"}:
            base = FRONTEND
        else:
            base = source.parent

        new_path = (
            Path(__import__("os").path.relpath(
                DEST / img.name, base
            )).as_posix()
        )

        pattern = re.compile(
            r'(?<![A-Za-z0-9:/.-])'
            r'(?:\.\.?/)*'
            + re.escape(img.name)
            + r'(?![A-Za-z0-9_.-])'
        )

        updated, count = pattern.subn(
            lambda _: new_path, updated
        )
        total += count

    if updated != original:
        changes[source] = updated

print("\n--- FRONTEND IMAGE MIGRATION ---")
print("Images:", len(images))
print("Files requiring updates:", len(changes))
print("References updated:", total)

for img in images:
    print("MOVE:", img.name)

for source in sorted(changes):
    print("UPDATE:", source.relative_to(ROOT))

if not APPLY:
    print("\nPREVIEW ONLY. No changes made.")
    print("Run with --apply after reviewing.")
    sys.exit(0)

DEST.mkdir(parents=True, exist_ok=True)

# Copy first, then update references.
for img in images:
    (DEST / img.name).write_bytes(img.read_bytes())

for source, content in changes.items():
    source.write_text(content, encoding="utf-8")

# Delete original images only after updates.
for img in images:
    img.unlink()

print("\nMigration completed.")

