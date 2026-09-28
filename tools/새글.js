/* blog/ 안의 글을 읽어 blog.html 목록 · rss.xml · sitemap.xml 을 다시 만든다.
   실행: ELECTRON_RUN_AS_NODE=1 Code.exe tools/새글.js   (저장소 루트에서)
   각 글의 <title>·<meta name="description">·<time datetime> 을 읽는다. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SITE = 'https://nadolesson.co.kr';
const posts = fs.readdirSync(path.join(ROOT, 'blog')).filter(f => f.endsWith('.html')).map(f => {
  const h = fs.readFileSync(path.join(ROOT, 'blog', f), 'utf8');
  const g = (re, d) => { const m = h.match(re); return m ? m[1].trim() : d; };
  return {
    slug: f.replace(/\.html$/, ''),
    title: g(/<title>([^<]*)<\/title>/, f).split(' | ')[0],
    summary: g(/<meta name="description" content="([^"]*)"/, ''),
    date: g(/<time datetime="([^"]*)"/, new Date().toISOString().slice(0, 10))
  };
}).sort((a, b) => b.date.localeCompare(a.date) || b.slug.localeCompare(a.slug));

/* blog.html 목록 교체 */
let bl = fs.readFileSync(path.join(ROOT, 'blog.html'), 'utf8');
const items = posts.map(p => `<article class="post-item">
        <time datetime="${p.date}">${p.date}</time>
        <h3><a href="blog/${p.slug}">${p.title}</a></h3>
        <p class="muted">${p.summary}</p>
      </article>`).join('\n      ');
bl = bl.replace(/<div class="post-list">[\s\S]*?<\/div>\n    <div class="hl-box"/, `<div class="post-list">\n      ${items}\n    </div>\n    <div class="hl-box"`);
fs.writeFileSync(path.join(ROOT, 'blog.html'), bl, 'utf8');

/* rss.xml */
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>여수과외 학습 소식</title>
<link>${SITE}/blog.html</link>
<description>전라남도 여수시 지역 과외·학습 정보</description>
<language>ko</language>
<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${posts.slice(0, 40).map(p => `<item><title><![CDATA[${p.title}]]></title><link>${SITE}/blog/${p.slug}</link><guid>${SITE}/blog/${p.slug}</guid><pubDate>${new Date(p.date + 'T09:00:00+09:00').toUTCString()}</pubDate><description><![CDATA[${p.summary}]]></description></item>`).join('\n')}
</channel></rss>`;
fs.writeFileSync(path.join(ROOT, 'rss.xml'), rss, 'utf8');

/* sitemap.xml — 고정 페이지 + school/ + blog/ */
const urls = [];
const push = (loc, pri) => urls.push(`  <url><loc>${SITE}/${loc}</loc><lastmod>${new Date().toISOString().slice(0,10)}</lastmod><priority>${pri}</priority></url>`);
push('', '1.0');
['schools','teachers','online','blog'].forEach(p => push(p, '0.9'));
fs.readdirSync(path.join(ROOT, 'school')).filter(f => f.endsWith('.html')).forEach(f => push('school/' + f.replace(/.html$/, ''), '0.8'));
posts.forEach(p => push('blog/' + p.slug, '0.7'));
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`, 'utf8');

console.log('글 ' + posts.length + '편 · sitemap ' + urls.length + ' URL 갱신 완료');
