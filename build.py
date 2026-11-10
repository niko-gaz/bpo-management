# Builds dist/bpo.html: the app (src/) compiled with esbuild + the Aambience Design Kit, in one self-contained page.
#   python3 build.py          -> dist/bpo.html (React from cdnjs, data from the artifact database)
#   python3 build.py --seed   -> also dist/test.html for local testing (local React + in-memory demo database)
import subprocess, re, json, sys, os
ROOT = os.path.dirname(os.path.abspath(__file__)); os.chdir(ROOT); os.makedirs('dist', exist_ok=True)
K = 'vendor/aambience-design-kit/'
subprocess.run(['node_modules/.bin/esbuild','src/main.jsx','--bundle','--format=iife','--jsx-factory=React.createElement','--jsx-fragment=React.Fragment','--minify','--target=es2019','--outfile=dist/app.js'],check=True)
tokens=open(K+'tokens.css').read()
# dark block -> also under prefers-color-scheme
i=tokens.index('[data-theme="dark"] {'); j=tokens.index('\n}',i)
dark=tokens[i+len('[data-theme="dark"] {'):j]
tokens=tokens.replace('[data-theme="dark"] {', ':root[data-theme="dark"], [data-theme="dark"] {',1)
tokens+='\n@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {'+dark+'\n} }\n'
bcss=re.sub(r'@import url\([^)]*\);','',open(K+'components/bundle.css').read())
bjs=open(K+'components/bundle.js').read()
app=open('dist/app.js').read()
css=open('src/app.css').read()
for x in (bjs,app):
  assert '</script' not in x.lower() and '<!--' not in x
def page(react_tags, extra=''):
  return f'''<!doctype html>
<html lang="el"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Ambience BPO · Διαχείριση προγράμματος</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;700&display=swap">
<style>{tokens}\n{bcss}\n{css}</style>
</head><body><div id="root"></div>
{react_tags}
{extra}
<script>{bjs}</script>
<script>{app}</script>
</body></html>'''
cdn='<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js"></script>\n<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js"></script>'
open('dist/bpo.html','w').write(page(cdn))
loc='<script src="../node_modules/react/umd/react.production.min.js"></script>\n<script src="../node_modules/react-dom/umd/react-dom.production.min.js"></script>'
seed=json.load(open('seed/seed.json', encoding='utf-8'))
fake='<script>window.__SEED='+json.dumps(seed,ensure_ascii=False)+';</script><script src="../tests/fake.js"></script>' if '--seed' in sys.argv else ''
open('dist/test.html','w').write(page(loc,fake))
print('ok', len(page(cdn))//1024,'KB')
