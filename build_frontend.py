from pathlib import Path
import shutil

root = Path(__file__).parent
public = root / "public"
public.mkdir(exist_ok=True)

for filename in ("index.html", "styles.css", "app.js"):
    shutil.copy2(root / filename, public / filename)
