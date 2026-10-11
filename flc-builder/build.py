"""Build index.html from src/template.html, embedding images so the tool is one offline file.
Usage: python3 build.py 11.10.26a"""
import base64, pathlib, sys
root = pathlib.Path(__file__).parent
ver = sys.argv[1]
def uri(name):
    f = root / "assets" / name
    mime = "image/png" if f.suffix == ".png" else "image/jpeg"
    return f"data:{mime};base64," + base64.b64encode(f.read_bytes()).decode()
s = (root / "src" / "template.html").read_text()
for k, f in {"LOGO": "logo.png", "READER": "icon-reader.png", "WRITER": "icon-writer.png", "MATHS": "icon-maths.png",
             "CUR": "curiosity.jpeg", "RES": "resilience.jpeg", "IND": "independence.jpeg", "COL": "collaboration.jpeg"}.items():
    s = s.replace(f"__IMG_{k}__", uri(f))
s = s.replace("__VERSION__", ver)
assert "__" not in s.split("<script>")[1].split("const SUBJ")[0], "unfilled placeholder"
(root / "index.html").write_text(s)
print("built index.html", ver, len(s) // 1024, "KB")
