
from pathlib import Path
import re

root = Path("frontend")
extensions = {".html", ".css", ".js", ".php"}

pattern = re.compile(
    r"""(?:src|href|url)\s*=\s*["']([^"']+)["']""",
    re.I
)

for file in root.rglob("*"):
    if not file.is_file() or file.suffix.lower() not in extensions:
        continue

    text = file.read_text(encoding="utf-8", errors="ignore")

    for match in pattern.finditer(text):
        path = match.group(1)

        if not re.search(r"\.(png|jpe?g|webp|gif|svg|ico)$", path, re.I):
            continue

        if path.startswith(("http:", "https:", "data:", "#", "//")):
            continue

        target = (file.parent / path).resolve()

        if not target.exists():
            print(f"BROKEN: {file}: {path}")

