
from pathlib import Path
import os
import re
import shutil
import sys

ROOT = Path.cwd()
FRONTEND = ROOT / "frontend"
DEST = FRONTEND / "assets" / "images"

IMAGE_EXT = {
    ".png", ".jpg", ".jpeg", ".webp",
    ".gif", ".ico", ".avif"
}

SOURCE_EXT = {
    ".html", ".htm", ".css", ".js",
    ".mjs", ".php", ".json", ".xml"
}

APPLY = "--apply" in sys.argv

if not FRONTEND.is_dir():
    sys.exit("ERROR: frontend folder not found.")

images = [
    p for p in ROOT.iterdir()
    if p.is_file() and p.suffix.lower() in IMAGE_EXT
]

if not images:
    sys.exit("No root-level images found.")

for img in images:
    if (DEST / img.name).exists():
        sys.exit(f"Destination already exists: {img.name}")

changes = {}
total = 0

for source in ROOT.rglob("*"):
    if not source.is_file():
        continue

    if source.suffix.lower() not in SOURCE_EXT:
        continue

    if any(x in source.parts for x in
           [".git", "node_modules", "vendor"]):
        continue

    try:
        original = source.read_bytes().decode("utf-8")
    except (UnicodeDecodeError, OSError):
        continue

    updated = original
    count = 0

    for img in images:
        target = DEST / img.name

        # Browser URLs in frontend JavaScript are
        # normally resolved against the HTML document.
        if source.suffix.lower() in {".js", ".mjs"} \
                and FRONTEND in source.parents:
            base = FRONTEND
        else:
            base = source.parent

        new_path = Path(
            os.path.relpath(target, base)
        ).as_posix()

        pattern = re.compile(
            r'(?<![A-Za-z0-9:/.-])'
            r'(?:\.\.?/)*'
            + re.escape(img.name)
            + r'(?![A-Za-z0-9_.-])'
        )

        updated, replacements = pattern.subn(
            lambda _: new_path, updated
        )

        count += replacements

    if updated != original:
        changes[source] = updated
        total += count

print("\n========== MIGRATION PREVIEW ==========")
print(f"Images to move: {len(images)}")
print(f"Source files to update: {len(changes)}")
print(f"References to update: {total}")

print("\nDestination:", DEST.relative_to(ROOT))

for img in images:
    print("MOVE:", img.name)

for source in sorted(changes):
    print("UPDATE:", source.relative_to(ROOT))

if not APPLY:
    print("\nDRY RUN ONLY. No files changed.")
    print("Review the preview, then run with --apply.")
    sys.exit(0)

# Copy images first, so originals remain safe
# until all updated source files are written.
DEST.mkdir(parents=True, exist_ok=True)

for img in images:
    shutil.copy2(img, DEST / img.name)

for source, content in changes.items():
    source.write_bytes(content.encode("utf-8"))

# Remove original root images after updating paths.
for img in images:
    img.unlink()

print("\nMIGRATION COMPLETED SUCCESSFULLY.")
print(f"Moved {len(images)} images.")
print(f"Updated {total} references.")

