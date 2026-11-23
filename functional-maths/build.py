"""Build index.html from src/ (one self-contained file).
Usage: python3 build.py 23.11.26a"""
import pathlib, sys
root = pathlib.Path(__file__).parent
ver = sys.argv[1]
js = "\n".join((root / "src" / f).read_text() for f in ["core.js", "topics-number.js", "topics-measures.js", "topics-data.js", "app.js"])
js = js.replace("__VERSION__", ver).replace("</script", "<\\/script")
s = (root / "src" / "template.html").read_text().replace("/*__JS__*/", js)
(root / "index.html").write_text(s)
print("built index.html", ver, len(s) // 1024, "KB")
