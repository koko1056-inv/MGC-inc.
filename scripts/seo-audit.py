# SEO/AIO 監査スクリプト。使い方: npm run build && cp -r public/column dist/ && python3 scripts/seo-audit.py dist out.json
# ページごとに title/description の長さ・h1数・見出しの飛び・構造化データの種類・内部被リンク数・本文文字数を出す。
import re,json,glob,html,os,sys,collections
root=sys.argv[1]
pages=sorted(set(glob.glob(f'{root}/**/*.html',recursive=True))-{f'{root}/200.html'})
rows=[];incoming=collections.Counter()
def txt(h): return html.unescape(re.sub(r'<[^>]+>','',h)).strip()
for f in pages:
    s=open(f).read()
    rel='/'+os.path.relpath(f,root).replace('index.html','').removesuffix('.html')
    head=s[:s.find('</head>')]
    body=s[s.find('<body'):]
    g=lambda pat: (re.search(pat,head) or [None,None])[1]
    title=g(r'<title>([^<]*)</title>'); desc=g(r'<meta name="description" content="([^"]*)"')
    canon=g(r'<link rel="canonical" href="([^"]*)"'); ogi=g(r'<meta property="og:image" content="([^"]*)"'); ogt=g(r'<meta property="og:title" content="([^"]*)"')
    robots=g(r'<meta name="robots" content="([^"]*)"')
    hs=[(int(t[1]),txt(x)) for t,x in re.findall(r'<(h[1-6])[^>]*>(.*?)</\1>',body,re.S)]
    h1=sum(1 for l,_ in hs if l==1)
    skips=sum(1 for a,b in zip(hs,hs[1:]) if b[0]-a[0]>1)
    lds=[]
    for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>',s,re.S):
        try:
            d=json.loads(m); items=d if isinstance(d,list) else d.get('@graph',[d])
            lds+= [i.get('@type') for i in items]
        except Exception as e: lds.append('INVALID')
    imgs=re.findall(r'<img[^>]*>',body); noalt=sum(1 for i in imgs if 'alt=' not in i); emptyalt=sum(1 for i in imgs if 'alt=""' in i)
    links=set(re.findall(r'href="(/[^"#?]*)',body))
    for l in links: incoming[l.rstrip('/') or '/']+=1
    words=len(txt(re.sub(r'<(script|style)[^>]*>.*?</\1>','',body,flags=re.S)))
    rows.append(dict(path=rel.rstrip('/') or '/',title=title,tlen=len(title or ''),desc=desc,dlen=len(desc or ''),canon=canon,og_img=bool(ogi),og_title=bool(ogt),robots=robots,h1=h1,skips=skips,ld=lds,imgs=len(imgs),noalt=noalt,emptyalt=emptyalt,outlinks=len(links),chars=words))
for r in rows: r['inlinks']=incoming.get(r['path'],0)
json.dump(rows,open(sys.argv[2],'w'),ensure_ascii=False,indent=1)
print(len(rows),'pages')
