/* Writes a plain-HTML copy of the portfolio's words into site/index.html (inside <noscript>), and refreshes sitemap.xml.

   Why: the page is built by JavaScript, so a crawler or reader that does not run scripts (some search and AI tools, link
   previews, text browsers) would otherwise see almost nothing. This puts the same content in the HTML itself.

   Run it after you change content.js or apps.js:   node tools/make-static.mjs
   It needs only Node. It reads site/assets/js/content.js and apps.js and rewrites the block between the two
   "static-snapshot" comments in site/index.html. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'site');

// load the data files the way a browser would
globalThis.window = {};
for (const f of ['content.js', 'apps.js']) vm.runInThisContext(fs.readFileSync(path.join(site, 'assets/js', f), 'utf8'), { filename: f });
const C = window.AQ.content;

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ul = (items) => '<ul>' + items.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
const strip = (s) => String(s).replace(/<[^>]+>/g, '');   // a few facts carry <b> tags

const out = [];
const P = C.person;
out.push(`<h2>${esc(P.name)}: ${esc(C.intro.role)}</h2>`);
out.push(`<p>${esc(C.intro.position)} · ${esc(C.intro.place)}. Open to remote roles. Seven years of PHP and WordPress delivery, now building Claude-powered desktop tools. This page needs JavaScript for the animated version; the same content follows in plain text.</p>`);
out.push(`<p>Contact: <a href="mailto:${esc(P.email)}">${esc(P.email)}</a>, <a href="tel:${esc(P.phoneTel)}">${esc(P.phoneDisplay)}</a>, <a href="${esc(P.linkedin)}">LinkedIn</a>.</p>`);

// about
out.push('<h2>About</h2>');
out.push(`<blockquote><p>${esc(C.about.quote)}</p></blockquote>`);
out.push('<ul>' + C.about.facts.map((f) => `<li><strong>${esc(f[0])}:</strong> ${esc(f[1])}${f[2] ? ', ' + esc(f[2]) : ''}</li>`).join('') + '</ul>');
out.push(ul(C.about.stats.map((s) => `${s[0]} ${s[1]}`)));

// what I do
out.push('<h2>What I do</h2>');
for (const c of C.craft) {
  out.push(`<h3>${esc(c.name)}</h3><p>${esc(c.line)}</p>`);
  out.push(ul(c.facts.map((f) => `${f[0]} ${f[1]}`)));
  out.push(`<p>${esc(c.chips.join(', '))}.</p>`);
}

// AI lab: every app
out.push('<h2>AI Lab: three products and five utilities</h2>');
out.push(`<p>${esc(C.blocks.lab.sub)}</p>`);
const apps = [...Object.entries(C.products).map(([id, p]) => [id, p.name]), ...C.gadgets.map((g) => [g.id, g.name])];
for (const [id, name] of apps) {
  const a = C.apps[id], d = a.detail;
  out.push(`<h3>${esc(name)} <small>(${esc(a.kind)})</small></h3>`);
  out.push(`<p><em>${esc(a.card.hook)}</em></p><p>${esc(d.what)}</p>`);
  out.push(`<p><strong>The problem it solves:</strong> ${esc(d.problem)} <strong>Who it is for:</strong> ${esc(d.who)}</p>`);
  out.push('<h4>How it works</h4><ol>' + d.steps.map((t) => `<li>${esc(t)}</li>`).join('') + '</ol>');
  out.push('<h4>Highlights</h4>');
  for (const g of d.groups) out.push(`<p><strong>${esc(g.h)}</strong></p>` + ul(g.items));
  out.push('<h4>Built to be safe</h4>' + ul(d.safety));
  out.push(`<p><strong>Where AI fits:</strong> ${esc(d.ai)}</p>`);
  out.push(`<p><strong>Tech:</strong> ${esc(d.tech.join(', '))}.</p>`);
  out.push('<p><strong>Numbers:</strong> ' + esc(d.stats.map((s) => `${s[0]} ${s[1]}`).join('; ')) + '.</p>');
}

// journey
out.push('<h2>My journey</h2>');
for (const s of C.journey) {
  out.push(`<h3>${esc(s.short)} (${esc(s.dates)})</h3><p>${esc(s.role)}, ${esc(s.org)}. ${esc(s.headline)} ${esc(s.summary)}</p>`);
  out.push(ul(s.bullets));
  out.push(`<p><strong>The hardest part:</strong> ${esc(s.hardest)} <strong>Recognition:</strong> ${esc(s.recognition)}.</p>`);
}

// skills, trophies, websites
out.push('<h2>Skills</h2>');
for (const g of C.skills) out.push(`<p><strong>${esc(g.group)}:</strong> ${esc(g.items.join(', '))}.</p>`);
out.push('<h2>Trophies</h2>' + ul(C.trophies.map((t) => `${t.title}: ${t.text}`)));
out.push('<h2>Websites I have built</h2><p>Client names are left out on purpose.</p>');
out.push('<ul>' + C.websites.map((w) => `<li><strong>${esc(w.title)}</strong> (${esc(w.k)}): ${esc(w.line)} ${esc(w.chips.join(', '))}.</li>`).join('') + '</ul>');

const body = out.join('\n');

// splice into index.html
const file = path.join(site, 'index.html');
let html = fs.readFileSync(file, 'utf8');
const block = `<!-- static-snapshot:start (written by tools/make-static.mjs: do not edit by hand) -->\n<div class="noscript noscript--static">\n${body}\n</div>\n<!-- static-snapshot:end -->`;
if (html.includes('<!-- static-snapshot:start')) {
  html = html.replace(/<!-- static-snapshot:start[\s\S]*?<!-- static-snapshot:end -->/, () => block);
} else {
  html = html.replace(/<noscript>\s*<div class="noscript">[\s\S]*?<\/div>\s*<\/noscript>/, () => `<noscript>\n    ${block}\n    </noscript>`);
}
fs.writeFileSync(file, html);

// sitemap
const url = (html.match(/<link rel="canonical" href="([^"]+)"/) || [])[1];
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(site, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${url}</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n</urlset>\n`);

console.log(`snapshot written: ${Math.round(body.length / 1024)} KB of text, ${apps.length} apps, ${C.journey.length} seasons; sitemap for ${url}`);
