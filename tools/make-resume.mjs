/* Builds the resume PDF from the same data the Resume page uses (site/assets/js/resume.js), so the page and the PDF never drift apart.

   Run after you edit resume.js (or the person details in content.js):   node tools/make-resume.mjs
   Output: site/assets/Kumaran_M_S_Resume.pdf  (the file behind the floating "Download resume" button)

   It prints with Microsoft Edge or Google Chrome in headless mode (no packages needed). If yours is somewhere else, set EDGE_PATH. */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const site = path.join(root, 'site');

globalThis.window = {};
for (const f of ['content.js', 'resume.js']) vm.runInThisContext(fs.readFileSync(path.join(site, 'assets/js', f), 'utf8'), { filename: f });
const C = window.AQ.content, R = C.resume, P = C.person, T = R.titles;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const ul = (items) => '<ul>' + items.map((t) => '<li>' + esc(t) + '</li>').join('') + '</ul>';
const show = (u) => u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

const CSS = `
@page { size: 612pt 792pt; margin: 38pt 46pt 34pt 46pt; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body { font-family: Arial, 'Liberation Sans', Helvetica, sans-serif; font-size: 9.3pt; line-height: 12.2pt; color: #000; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
a { color: inherit; text-decoration: none; }
h1 { margin: 0; padding-top: 0.5pt; text-align: center; font-size: 18pt; line-height: 22pt; font-weight: 700; }
.tag { text-align: center; font-weight: 700; font-size: 10pt; line-height: 13pt; margin-top: 3pt; }
.contact { text-align: center; line-height: 12.2pt; }
.tag + .contact { margin-top: 3pt; }
h2 { margin: 8.5pt 0 5pt; font-family: Calibri, Carlito, 'Segoe UI', sans-serif; font-size: 11pt; line-height: 13pt; font-weight: 700; color: #1f4e79; break-after: avoid; }
p { margin: 0; }
.skills { width: 100%; border-collapse: collapse; }
.skills td { vertical-align: top; padding: 0 0 2pt 0; }
.skills td.sl { width: 24%; font-weight: 700; padding-right: 8pt; }
.jh { font-size: 10pt; line-height: 12.6pt; margin-top: 5pt; margin-bottom: 2pt; break-after: avoid; }
.jh:first-of-type { margin-top: 0; }
.jh i { font-size: 9.3pt; }
ul { margin: 0; padding: 0; list-style: none; }
li { margin: 0; padding-left: 14.5pt; text-indent: -9.7pt; break-inside: avoid; }
li::before { content: '\\2022'; display: inline-block; width: 9.7pt; text-indent: 0; text-align: left; font-size: 11pt; line-height: 0; }
.ph { font-weight: 700; font-size: 9.8pt; line-height: 12.2pt; margin-top: 4.5pt; break-after: avoid; }
.ph span { font-weight: 400; font-size: 9.3pt; }
.intro { margin-bottom: 1pt; break-after: avoid; }
`;

const body = [];
body.push(`<h1>${esc(P.name.toUpperCase())}</h1>`);
body.push(`<div class="tag">${esc(R.headline)}</div>`);
body.push(`<div class="contact">${esc(P.place)} | ${esc(P.phoneDisplay)} | <a href="mailto:${esc(P.email)}">${esc(P.email)}</a></div>`);
body.push(`<div class="contact">Portfolio: <a href="${esc(R.portfolio)}">${esc(show(R.portfolio))}</a> | LinkedIn: <a href="${esc(P.linkedin)}">${esc(show(P.linkedin))}</a></div>`);
body.push(`<h2>${esc(T.summary)}</h2><p>${esc(R.summary)}</p>`);
body.push(`<h2>${esc(T.highlights)}</h2>${ul(R.highlights)}`);
body.push(`<h2>${esc(T.skills)}</h2>` + '<table class="skills">' + R.skills.map(([a, b]) => `<tr><td class="sl">${esc(a)}</td><td>${esc(b)}</td></tr>`).join('') + '</table>');
body.push(`<h2>${esc(T.experience)}</h2>`);
for (const j of R.jobs) body.push(`<div class="jh"><b>${esc(j.title)}</b> | <i>${esc(j.meta)}</i></div>${ul(j.bullets)}`);
body.push(`<h2>${esc(T.featured)}</h2>`);
body.push(`<p class="intro">${esc(R.featuredIntro)}<a href="${esc(R.portfolio)}">${esc(show(R.portfolio))}</a>.</p>`);
for (const f of R.featured) body.push(`<div class="ph">${esc(f.name)} <span>| ${esc(f.tech)}</span></div>${ul(f.bullets)}`);
body.push(`<h2>${esc(T.wp)}</h2><ul>` + R.wp.map(([a, b]) => `<li><b>${esc(a)}:</b> ${esc(b)}</li>`).join('') + '</ul>');
body.push(`<h2>${esc(T.recognition)}</h2>${ul(R.recognition)}`);

const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(P.name)} - Senior Software Engineer (WordPress) and AI Automation Engineer</title><style>${CSS}</style></head><body>${body.join('\n')}</body></html>`;

const tmp = path.join(os.tmpdir(), 'kumaran-resume-print.html');
fs.writeFileSync(tmp, doc, 'utf8');
const out = path.join(site, R.file.replace(/^assets\//, 'assets/'));

const candidates = [process.env.EDGE_PATH, 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', 'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const browser = candidates.find((p) => fs.existsSync(p));
if (!browser) { console.error('No Edge or Chrome found. Set EDGE_PATH to the browser executable.'); process.exit(1); }

try { fs.unlinkSync(out); } catch { /* not there yet */ }
try {
  execFileSync(browser, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${out}`, pathToFileURL(tmp).href], { stdio: 'ignore', timeout: 60000 });
} catch (e) { /* some versions exit non-zero even when the file was written: check below */ }
if (!fs.existsSync(out)) { console.error('The browser did not write the PDF.'); process.exit(1); }
console.log(`resume PDF written: ${path.relative(root, out)} (${Math.round(fs.statSync(out).size / 1024)} KB) using ${path.basename(browser)}`);
