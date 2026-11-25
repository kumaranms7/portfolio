/* ------------------------------------------------------------------
   Render: builds the home page sections, the resume page and the
   title pages (dialogs) from content.js.
   Everything the visitor sees comes from data, so facts live in one place.
   The basics (about, journey, skills, trophies) are printed straight onto
   the page. Only the projects open a title page.
   data-reveal marks what animates in and out as you scroll (see views.css).
------------------------------------------------------------------- */
(function () {
  'use strict';
  var AQ = (window.AQ = window.AQ || {});
  var C = AQ.content;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icon(id, cls, fill) { return '<svg class="ico' + (fill ? ' ico--fill' : '') + (cls ? ' ' + cls : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function J() { return C.journey; }
  function dataAttrs(o) { var a = ''; if (o) Object.keys(o).forEach(function (k) { a += ' data-' + k + '="' + esc(o[k]) + '"'; }); return a; }
  /* background picture for a card, as CSS text for a style attribute ('' when the file is not listed in content.js) */
  function pic(name, scrim) {
    var I = C.images || {};
    if (!name) return '';
    if (!(I.have === 'all' || (I.have && I.have.indexOf(name) >= 0))) return '';
    // a full URL: a relative one inside a CSS variable would be read from the stylesheet's folder (assets/css/), not the page's
    // scrim: a dark layer under the colour overlay so the text on the card stays readable
    return '--img-url:' + (scrim ? 'linear-gradient(90deg, rgba(10, 10, 12, 0.68) 0%, rgba(10, 10, 12, 0.3) 55%, rgba(10, 10, 12, 0) 100%), ' : '') + 'url(' + new URL(I.base + name + '.webp', document.baseURI).href + ');';
  }
  /* an app's dashboard screenshot as a card or popup background (it sits ABOVE the colour overlay, see .orig in views.css) */
  function appPic(id) { return pic('app-' + id); }
  /* scroll animation: kind = up | left | right | zoom | pop | title, i = stagger step, css = extra style text */
  function rv(kind, i, css) {
    var s = (i != null ? '--i:' + i + ';' : '') + (css || '');
    return ' data-reveal="' + (kind || 'up') + '"' + (s ? ' style="' + s + '"' : '');
  }

  /* ---------- poster card (used in rows) ---------- */
  function card(o) {
    var tag = o.href ? 'a' : (o.static ? 'div' : 'button');
    var attrs = '';
    if (o.href) attrs += ' href="' + esc(o.href) + '"';
    if (tag === 'button') attrs += ' type="button"';
    attrs += dataAttrs(o.data);
    if (o.pic) attrs += ' style="' + o.pic + '"';
    return '<' + tag + ' class="card art-' + o.art + (o.cls ? ' ' + o.cls : '') + (o.static ? ' card--static' : '') + '"' + attrs + '>' +
      (o.icon ? icon(o.icon, 'card__ico') : '') +
      (o.num ? '<span class="card__num" aria-hidden="true">' + esc(o.num) + '</span>' : '') +
      '<span class="card__body">' +
      (o.k ? '<span class="card__k">' + esc(o.k) + '</span>' : '') +
      '<span class="card__t">' + esc(o.t) + '</span>' +
      (o.m ? '<span class="card__m">' + esc(o.m) + '</span>' : '') +
      '</span></' + tag + '>';
  }

  /* ---------- horizontal row with arrows ---------- */
  function track(title, items) {
    // a scroller with nothing focusable inside must itself be reachable by keyboard
    var keys = /<(a|button)[ >]/.test(items) ? '' : ' tabindex="0" role="region" aria-label="' + esc(title) + ', scrollable"';
    return '<div class="row__track"' + keys + '>' + items + '</div>' +
      '<button type="button" class="row__arrow row__arrow--prev" aria-label="Scroll ' + esc(title) + ' left" hidden>' + icon('i-chev-l') + '</button>' +
      '<button type="button" class="row__arrow row__arrow--next" aria-label="Scroll ' + esc(title) + ' right" hidden>' + icon('i-chev-r') + '</button>';
  }
  function row(id, title, sub, items) {
    return '<section class="row" aria-labelledby="r-' + id + '">' +
      '<div class="row__head"><h2 class="row__title" id="r-' + id + '">' + esc(title) + '</h2>' + (sub ? '<span class="row__sub">' + esc(sub) + '</span>' : '') + '</div>' +
      track(title, items) + '</section>';
  }

  var syncers = [];
  window.addEventListener('resize', function () { syncers.forEach(function (f) { f(); }); });
  /* arrows appear only when there is more to scroll */
  function initRows(root) {
    $$('.row', root).forEach(function (r) {
      var tr = $('.row__track', r), prev = $('.row__arrow--prev', r), next = $('.row__arrow--next', r);
      function sync() {
        var max = tr.scrollWidth - tr.clientWidth;
        prev.hidden = tr.scrollLeft < 8;
        next.hidden = tr.scrollLeft > max - 8 || max < 8;
      }
      prev.addEventListener('click', function () { tr.scrollBy({ left: -tr.clientWidth * 0.8, behavior: 'smooth' }); });
      next.addEventListener('click', function () { tr.scrollBy({ left: tr.clientWidth * 0.8, behavior: 'smooth' }); });
      tr.addEventListener('scroll', sync, { passive: true });
      syncers.push(sync);
      sync();
      setTimeout(sync, 300);
    });
  }

  /* ---------- big "original" card: products and websites. Everything shows without hover. ---------- */
  function orig(o) {
    return '<button type="button" class="orig art-' + o.art + '"' + dataAttrs(o.data) + (o.rv || '') + '>' + icon(o.icon, 'orig__ico') +
      '<span class="orig__k">' + esc(o.k) + '</span><span class="orig__t">' + esc(o.t) + '</span><span class="orig__m">' + esc(o.m) + '</span>' +
      (o.facts ? '<span class="orig__facts">' + o.facts.map(function (f) { return '<span>' + f + '</span>'; }).join('') + '</span>' : '') +
      (o.chips ? '<span class="orig__chips">' + o.chips.map(function (c) { return '<span>' + esc(c) + '</span>'; }).join('') + '</span>' : '') +
      '<span class="orig__cta">Open details' + icon('i-arrow') + '</span></button>';
  }

  /* ---------- AI Lab application cards and popups ----------
     The card says what the app IS (a question to pull you in, one plain sentence, three things it does) and keeps the
     result as a small footer. The popup tells the whole story. All the words are in apps.js. */
  function appCard(id, o) {
    var a = C.apps[id], c = a.card;
    return '<button type="button" class="orig orig--app art-' + o.art + '"' + dataAttrs(o.data) + (o.rv || '') + '>' + icon(o.icon, 'orig__ico') +
      '<span class="orig__k">' + esc(a.kind) + '</span><span class="orig__t">' + esc(o.t) + '</span>' +
      '<span class="orig__hook">' + esc(c.hook) + '</span><span class="orig__m">' + esc(c.what) + '</span>' +
      '<span class="orig__facts">' + c.points.map(function (f) { return '<span>' + esc(f) + '</span>'; }).join('') + '</span>' +
      '<span class="orig__foot"><span class="orig__res"><i>Result</i><b>' + esc(c.result) + '</b></span><span class="orig__cta">See how it works' + icon('i-arrow') + '</span></span></button>';
  }
  function checks(items) { return '<ul class="title__facts">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }
  /* x.mid = extra markup between "How it works" and "Highlights" (the demo video, or a before/after visual) */
  function detailHtml(id, x) {
    var a = C.apps[id], d = a.detail, none = /^None/.test(d.ai);
    return '<p class="dt__hook">' + esc(a.card.hook) + '</p><p class="title__syn">' + esc(d.what) + '</p>' +
      '<div class="dt__two"><div><h4>The problem it solves</h4><p>' + esc(d.problem) + '</p></div><div><h4>Who it is for</h4><p>' + esc(d.who) + '</p></div></div>' +
      '<div><h4>How it works</h4><ol class="dt__steps">' + d.steps.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol></div>' +
      ((x && x.mid) || '') +
      '<div><h4>Highlights</h4><div class="dt__groups">' + d.groups.map(function (g) { return '<div class="dt__g"><h5>' + esc(g.h) + '</h5>' + checks(g.items) + '</div>'; }).join('') + '</div></div>' +
      '<div><h4>Built to be safe</h4>' + checks(d.safety) + '</div>' +
      '<div class="dt__ai' + (none ? ' dt__ai--none' : '') + '"><h4>' + (none ? 'AI inside? No' : 'Where AI fits') + '</h4><p>' + esc(d.ai) + '</p></div>' +
      '<div><h4>Under the hood</h4><ul class="chips">' + d.tech.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>' +
      '<div><h4>By the numbers</h4><div class="dt__stats">' + d.stats.map(function (s) { return '<p class="dt__stat"><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></p>'; }).join('') + '</div></div>' +
      '<div class="dt__cta"><p>Want something like this for your team?</p><a class="btn btn--ember" href="' + esc(C.mail.project) + '">' + icon('i-mail') + 'Email me about it</a></div>';
  }

  function trophyCard(t, i) {
    return '<article class="trophy trophy--' + t.tier + '"' + rv('pop', i % 4, pic(t.img, true)) + '>' + icon('i-trophy') + '<p class="trophy__tier">' + t.tier + '</p><h3 class="trophy__t">' + esc(t.title) + '</h3><p class="trophy__x">' + esc(t.text) + '</p></article>';
  }

  function chips(list, cls) {
    return '<ul class="chips' + (cls ? ' ' + cls : '') + '">' + list.map(function (c, k) { return '<li' + rv('pop', k) + '>' + esc(c) + '</li>'; }).join('') + '</ul>';
  }

  /* ---------- section frame: full-width band, content inside the fixed-width container ---------- */
  var secNo = 0;   // the big ghost number behind each section
  function sec(id, cls, body, bleed) {
    var b = C.blocks[id];
    return '<section class="sec sec--' + id + (cls ? ' ' + cls : '') + '" id="' + id + '" tabindex="-1" aria-labelledby="h-' + id + '"' +
      (secNo ? ' data-n="' + (secNo < 10 ? '0' : '') + secNo + '"' : '') + '><div class="wrap">' +
      '<header class="sec__head"><p class="eyebrow"' + rv('up') + '>' + esc(b.eyebrow) + '</p><h2 class="sec__title" id="h-' + id + '"' + rv('title') + '>' + esc(b.title) + '</h2>' +
      (b.sub ? '<p class="sec__sub"' + rv('up') + '>' + esc(b.sub) + '</p>' : '') + '</header>' +
      (bleed ? '</div>' + body : body + '</div>') + '</section>';
  }

  /* a band of giant outlined words that slides sideways as you scroll past it (decorative, hidden from screen readers) */
  function marq(words, n) {
    var one = words.map(function (w, k) { return '<span' + (k % 3 === 2 ? ' class="is-fill"' : '') + '>' + esc(w) + '</span><i>✦</i>'; }).join('');
    return '<div class="marq marq--' + (n % 2 ? 'b' : 'a') + '" aria-hidden="true"><div class="marq__row">' + one + one + one + '</div></div>';
  }

  var BLURB = {
    'Quality': 'Where it started: auditing other people’s data for accuracy.',
    'Web build': 'The core of seven years of delivery.',
    'Engineering': 'Tools and habits for shipping safely.',
    'Delivery': 'Running projects, clients and servers.',
    'AI automation': 'What I build with now.',
    'In training': 'Learning next.',
  };

  function statNum(v) { var m = /^(\d+)(.*)$/.exec(v); return m ? ' data-count="' + m[1] + '" data-suffix="' + esc(m[2]) + '"' : ''; }

  /* ---------- "What I do": the animated scenes ----------
     Pure HTML and CSS drawings (craft.css plays them). They are decorative, so screen readers skip them;
     the text beside each one says the same thing in words. */
  function sbar(title) { return '<div class="scene__bar"><i></i><i></i><i></i><span>' + esc(title) + '</span></div>'; }
  /* one typed line: segs = [[class, text], ...], at = start (ms), ms = time per character. Returns the markup and when it ends. */
  function tl(segs, at, ms) {
    var n = segs.reduce(function (a, s) { return a + s[1].length; }, 0);
    return {
      html: '<div class="tl"><span class="tl__t" style="--c:' + n + ';--d:' + at + 'ms;--s:' + ms + 'ms">' +
        segs.map(function (s) { return '<span class="' + s[0] + '">' + esc(s[1]) + '</span>'; }).join('') + '</span></div>',
      end: at + n * ms,
    };
  }
  function page(mobile, d0) {
    function d(n) { return ' style="--d:' + (d0 + n) + 'ms"'; }
    return '<div class="pg' + (mobile ? ' pg--m' : '') + '"><div class="pg__nav"><i class="logo"' + d(0) + '></i><b' + d(80) + '></b><b' + d(150) + '></b><b' + d(220) + '></b></div>' +
      '<div class="pg__hero"><div class="pg__img"' + d(300) + '></div><div class="pg__copy"><i class="h"' + d(500) + '></i><i class="h s"' + d(580) + '></i><i class="t"' + d(660) + '></i><i class="t s"' + d(730) + '></i><span class="pbtn"' + d(900) + '>' +
      (mobile ? '' : '<svg class="dz__cur" viewBox="0 0 24 24"><path d="M5 3l14 8-6 2 4 7-3 1.5-4-7-5 4z"/></svg><u class="dz__ring"></u>') + '</span></div></div>' +
      (mobile ? '' : '<div class="pg__cards"><i' + d(1050) + '></i><i' + d(1120) + '></i><i' + d(1190) + '></i></div>') + '</div>';
  }

  var SCENES = {
    code: function () {
      var L = [
        [['k', 'function '], ['f', 'getOrders'], ['p', '('], ['v', '$status'], ['p', ') {']],
        [['p', '  '], ['v', '$rows'], ['p', ' = '], ['f', 'db'], ['p', '()->'], ['f', 'table'], ['p', '('], ['s', '\'orders\''], ['p', ')']],
        [['p', '    ->'], ['f', 'where'], ['p', '('], ['s', '\'status\''], ['p', ', '], ['v', '$status'], ['p', ')']],
        [['p', '    ->'], ['f', 'limit'], ['p', '('], ['n', '20'], ['p', ')->'], ['f', 'get'], ['p', '();']],
        [['p', '  '], ['k', 'return '], ['f', 'array_map'], ['p', '('], ['s', '\'formatRow\''], ['p', ', '], ['v', '$rows'], ['p', ');']],
        [['p', '}']],
        [['c', '// 24 tests passed. Ready to ship.']],
      ];
      var t = 300, src = '', gut = '';
      L.forEach(function (segs, i) { var r = tl(segs, t, 18); src += r.html; t = r.end + 140; gut += '<span>' + (i + 1) + '</span>'; });
      return '<div class="scene scene--code" aria-hidden="true">' + sbar('orders.php') +
        '<div class="ed"><div class="code__gut">' + gut + '</div><div class="code__src">' + src + '</div></div>' +
        '<p class="code__ok" style="--d:' + t + 'ms">✓ 24 tests passed</p>' +
        '<div class="scene__foot"><span><i class="live"></i>main</span><span>PHP 8.1</span></div></div>';
    },

    design: function () {
      return '<div class="scene scene--design" aria-hidden="true">' + sbar('homepage layout') +
        '<div class="dz"><div class="dz__desk">' + page(false, 150) + '</div>' +
        '<div class="dz__phone">' + page(true, 2500) + '</div>' +
        '<div class="dz__pal"><i style="--c:#ff3b2f;--d:3300ms"></i><i style="--c:#f5c04a;--d:3420ms"></i><i style="--c:#3ddc97;--d:3540ms"></i><i style="--c:#7cc4ff;--d:3660ms"></i><p style="--d:3800ms">Aa</p></div></div></div>';
    },

    seo: function () {
      var items = ['Title and meta tags', 'Canonical tag', 'Schema markup', 'Image sizes', 'Core Web Vitals'];
      return '<div class="scene scene--seo" aria-hidden="true">' + sbar('seo-report') +
        '<div class="seo"><div class="seo__gauge"><svg viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="42"/><circle class="arc" cx="50" cy="50" r="42" pathLength="100"/></svg>' +
        '<p class="seo__n"><span></span><em>+</em></p><small>SEO score</small></div>' +
        '<ul class="seo__list">' + items.map(function (t, i) { return '<li style="--d:' + (500 + i * 380) + 'ms"><i></i>' + t + '</li>'; }).join('') + '</ul></div>' +
        '<div class="seo__chart"><div class="seo__vitals"><b style="--d:2000ms">LCP</b><b style="--d:2300ms">INP</b><b style="--d:2600ms">CLS</b></div>' +
        '<svg viewBox="0 0 300 70" preserveAspectRatio="none"><path class="area" d="M0 62 L30 58 L60 60 L90 50 L120 52 L150 40 L180 42 L210 28 L240 30 L270 16 L300 10 L300 70 L0 70 Z"/>' +
        '<path class="line" pathLength="1" d="M0 62 L30 58 L60 60 L90 50 L120 52 L150 40 L180 42 L210 28 L240 30 L270 16 L300 10"/></svg></div></div>';
    },

    ai: function () {
      var p = tl([['p', 'add a dry-run mode to the meta tag tool']], 250, 28);
      return '<div class="scene scene--ai" aria-hidden="true">' + sbar('claude-code') +
        '<div class="ai"><div class="ai__prompt"><b>&gt;</b>' + p.html + '</div>' +
        '<p class="ai__work" style="--d:' + (p.end + 200) + 'ms"><i></i><i></i><i></i>Claude Code is working</p>' +
        '<div class="ai__diff"><p class="del" style="--d:2900ms">- $meta = write_now($pages);</p><p class="add" style="--d:3100ms">+ $meta = preview($pages);</p><p class="add" style="--d:3300ms">+ write_files(only_if: approved);</p></div>' +
        '<ul class="ai__checks"><li style="--d:3700ms">Tests pass</li><li style="--d:4000ms">Preview shows every change</li><li style="--d:4300ms">Nothing is written until I approve</li></ul>' +
        '<div class="ai__stamp" style="--d:4800ms"><b>Reviewed</b><span>by Kumaran</span></div></div></div>';
    },

    server: function () {
      var cmd = tl([['p', '$ '], ['f', 'git push origin main']], 250, 40), ticks = '';
      for (var i = 0; i < 30; i++) ticks += '<i' + (i === 21 ? ' class="slow"' : '') + ' style="--i:' + i + '"></i>';
      return '<div class="scene scene--srv" aria-hidden="true">' + sbar('production') +
        '<div class="srv"><div class="srv__term">' + cmd.html +
        '<p class="srv__ln" style="--d:1250ms">Deploying to production</p><div class="srv__bar" style="--d:1400ms"><i></i></div>' +
        '<p class="srv__ln srv__ln--ok" style="--d:2750ms">✓ Cache cleared</p><p class="srv__ln srv__ln--ok" style="--d:3000ms">✓ Health checks passed</p>' +
        '<p class="srv__ln srv__ln--ok" style="--d:3250ms">✓ Live. Backup taken, rollback ready.</p></div>' +
        '<div class="srv__stat"><ul class="srv__list"><li><i class="live"></i>Web server<em>OK</em></li><li><i class="live"></i>Database<em>OK</em></li><li><i class="live"></i>Nightly backup<em>OK</em></li><li><i class="live"></i>SSL certificate<em>OK</em></li></ul>' +
        '<div class="srv__up">' + ticks + '</div><small>Last 30 days</small></div></div></div>';
    },
  };

  var SECTIONS = {
    /* five crafts as expanding panels. One is open at a time; each has a scene, a line, two numbers and a set of tools. */
    craft: function () {
      return sec('craft', '', '<div class="craft is-auto" data-craft' + rv('zoom') + '>' + C.craft.map(function (c, i) {
        var on = i === 0;
        return '<article class="disc art-' + c.art + (on ? ' is-on' : '') + '">' +
          '<button type="button" class="disc__rail" id="cr-h-' + i + '" aria-expanded="' + on + '" aria-controls="cr-b-' + i + '">' +
          '<span class="disc__n" aria-hidden="true">0' + (i + 1) + '</span><span class="disc__name">' + esc(c.name) + '</span>' + icon(c.icon, 'disc__ico') + '<span class="disc__chev" aria-hidden="true">' + icon('i-chev-r') + '</span></button>' +
          '<i class="disc__bar" aria-hidden="true"></i>' +
          '<div class="disc__body" id="cr-b-' + i + '" role="region" aria-labelledby="cr-h-' + i + '"><div class="disc__in">' +
          '<div class="stage">' + SCENES[c.scene]() + '<button type="button" class="stage__replay" data-replay>' + icon('i-replay') + 'Replay</button></div>' +
          '<div class="disc__txt"><h3 class="disc__t">' + esc(c.name) + '</h3><p class="disc__line">' + esc(c.line) + '</p></div>' +
          '<div class="disc__more"><div class="disc__facts">' + c.facts.map(function (f) { return '<p class="fact"><b>' + esc(f[0]) + '</b><span>' + esc(f[1]) + '</span></p>'; }).join('') + '</div>' +
          '<ul class="chips">' + c.chips.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul></div>' +
          '</div></div></article>';
      }).join('') + '</div>');
    },

    about: function () {
      var A = C.about;
      return sec('about', '',
        '<div class="about"><figure class="about__quote"' + rv('left') + '><blockquote><p>“' + esc(A.quote) + '”</p></blockquote><figcaption>' + esc(A.by) + '</figcaption></figure>' +
        '<dl class="about__facts">' + A.facts.map(function (f, i) {
          return '<div' + rv('right', i) + '><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + (f[2] ? '<small>' + esc(f[2]) + '</small>' : '') + '</dd></div>';
        }).join('') + '</dl></div>' +
        '<div class="stats">' + A.stats.map(function (s, i) { return '<div class="statbox"' + rv('zoom', i) + '><b' + statNum(s[0]) + '>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('') + '</div>');
    },

    /* every season is printed in full: no tabs, no clicks */
    story: function () {
      return sec('story', '', '<ol class="timeline">' + J().map(function (s, i) {
        var skills = C.skills.filter(function (g) { return g.unlock === i; }).reduce(function (a, g) { return a.concat(g.items); }, []);
        return '<li class="season-card"' + rv(i % 2 ? 'right' : 'left') + '>' +
          '<div class="season-card__side art-' + C.seasonArt[i] + '"' + (pic('season-' + (i + 1)) ? ' style="' + pic('season-' + (i + 1)) + '"' : '') + '><span class="season-card__ghost" aria-hidden="true">S' + (i + 1) + '</span>' +
          '<p class="season-card__zone">Season ' + (i + 1) + ' · ' + esc(s.dates) + '</p><h3 class="season-card__role">' + esc(s.short) + '</h3>' +
          '<p class="season-card__org">' + esc(s.role) + ' · ' + esc(s.org) + '</p></div>' +
          '<div class="season-card__main"><p class="pull">' + esc(s.headline) + '</p><p class="season-card__syn">' + esc(s.summary) + '</p>' +
          '<div class="season-card__cols"><div><h4>What happens</h4><ul>' + s.bullets.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') + '</ul></div>' +
          '<div><h4>The hardest part</h4><p class="season-card__syn">' + esc(s.hardest) + '</p>' +
          (s.projects.length ? '<h4 class="mt">Projects</h4><ul>' + s.projects.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' : '') + '</div></div>' +
          (skills.length ? '<div><h4>Skills unlocked</h4>' + chips(skills) + '</div>' : '') +
          '<p class="season-card__trophy">' + icon('i-trophy') + '<span>' + esc(s.recognition) + '</span></p></div></li>';
      }).join('') + '</ol>');
    },

    /* the products and utilities open title pages; their key numbers show on the cards */
    lab: function () {
      var prods = ['gads', 'modernizer', 'forms'].map(function (id, i) {
        var p = C.products[id];
        return appCard(id, { art: p.art, icon: p.icon, t: p.name, data: { title: 'product:' + id }, rv: rv('zoom', i, appPic(id)) });
      }).join('');
      var utils = C.gadgets.map(function (g, i) {
        return appCard(g.id, { art: g.art, icon: g.icon, t: g.name, data: { title: 'short:' + g.id }, rv: rv('zoom', i) });
      }).join('');
      return sec('lab', '',
        '<h3 class="sub-title"' + rv('up') + '>Three full products <span>' + (C.demoVideos ? 'Each has a demo video' : 'Each one a full application') + '</span></h3><div class="orig-grid orig-grid--3">' + prods + '</div>' +
        '<h3 class="sub-title"' + rv('up') + '>Five utilities <span>Each one does one job</span></h3><div class="orig-grid orig-grid--5">' + utils + '</div>');
    },

    method: function () {
      return sec('method', '', '<div class="principles">' + C.principles.map(function (p, i) {
        return '<article class="principle"' + rv('zoom', i % 3) + '><h3>' + esc(p.title) + '</h3><p>' + esc(p.text) + '</p><small>' + esc(p.tool) + '</small></article>';
      }).join('') + '</div>');
    },

    /* tabs: one skill group per tab. Vertical list on a laptop, a swipeable row on a phone. */
    skills: function () {
      function abbr(name) {
        var w = name.split(/\s+/).filter(function (x) { return x !== '/' && !/^(and|of|the)$/i.test(x); });
        if (w.length === 1) { var s = w[0].split('/')[0].replace(/[.+#]/g, ''); return s.length <= 3 ? s : s.slice(0, 2); }
        return (w[0][0] + w[1][0]).toUpperCase();
      }
      var tabs = '', panels = '';
      C.skills.forEach(function (g, i) {
        var on = i === 0, train = g.unlock === 99, s = !train && J()[g.unlock];
        tabs += '<button type="button" role="tab" id="st-' + i + '" class="st' + (train ? ' st--train' : '') + '" aria-selected="' + on + '" tabindex="' + (on ? 0 : -1) + '">' +
          '<span class="st__name">' + esc(g.group) + '</span><span class="st__meta">' + g.items.length + ' skills · ' + esc(BLURB[g.group] || '') + '</span></button>';
        panels += '<div role="tabpanel" id="sp-' + i + '" aria-labelledby="st-' + i + '"' + (on ? ' tabindex="0"' : ' hidden="until-found"') + '>' +
          '<div class="skillpanel' + (train ? ' skillpanel--train' : '') + '"><h3 class="skillpanel__t">' + esc(g.group) + '</h3><p class="skillpanel__s">' + esc(BLURB[g.group] || '') + '</p>' +
          '<p class="skillpanel__when">' + (train ? 'Learning next' : 'Picked up in season ' + (g.unlock + 1) + ' · ' + esc(s.short) + ' · ' + esc(s.years)) + '</p>' +
          '<ul class="skilltiles">' + g.items.map(function (it, k) {
            return '<li class="skilltile" style="--i:' + k + '"><span class="skilltile__ic" aria-hidden="true">' + esc(abbr(it)) + '</span><span class="skilltile__n">' + esc(it) + '</span></li>';
          }).join('') + '</ul></div></div>';
      });
      return sec('skills', '',
        '<div class="skilltabs"' + rv('up') + '><div class="skilltabs__list" role="tablist" aria-label="Skill groups" aria-orientation="vertical" data-tabs>' + tabs + '</div>' +
        '<div class="skilltabs__panels">' + panels + '</div></div>');
    },

    trophies: function () {
      return sec('trophies', '', '<div class="trophy-grid">' + C.trophies.map(trophyCard).join('') + '</div>');
    },

    /* the row scrolls edge to edge, so it sits outside the container; its heading sits inside */
    core: function () {
      return sec('core', 'sec--row', '<div class="row row--bare"' + rv('zoom') + '>' + track('My core five', C.core.map(function (c, i) {
        return '<div class="t5"><span class="t5__n" aria-hidden="true">' + (i + 1) + '</span>' + card({ art: c.art, t: c.title, m: c.line, icon: c.icon, static: true }) + '</div>';
      }).join('')) + '</div>', true);
    },

    websites: function () {
      return sec('websites', '', '<div class="orig-grid orig-grid--4">' + C.websites.map(function (w, i) {
        return orig({ art: w.art, icon: w.icon, k: w.k, t: w.title, m: w.line, chips: w.chips, data: { title: 'website:' + w.id }, rv: rv('zoom', i) });
      }).join('') + '</div>');
    },

    contact: function () {
      var P = C.person, b = C.blocks.contact;
      return '<section class="sec sec--contact" id="contact" tabindex="-1" aria-labelledby="h-contact"><div class="wrap">' +
        '<div class="credits"><div class="poster art-ember"' + rv('zoom') + '><img src="assets/img/stylish.webp" alt="Kumaran M S, full-length portrait" width="800" height="1200" loading="lazy">' +
        ((C.posterVideo || []).length ? '<video class="poster__video" muted loop playsinline preload="none" width="720" height="1080" tabindex="-1" aria-hidden="true" data-poster-video data-srcs="' + esc(JSON.stringify(C.posterVideo)) + '"></video>' +
          '<button type="button" class="iconbtn poster__toggle" data-poster-toggle aria-label="Pause video" hidden>' + icon('i-pause') + '</button>' : '') +
        '<span class="poster__t">Kumaran M S</span></div>' +
        '<div><p class="eyebrow"' + rv('up') + '>' + esc(b.eyebrow) + '</p><h2 class="sec__title" id="h-contact"' + rv('title') + '>' + esc(b.title) + '</h2>' +
        '<dl class="credit-list">' + C.credits.map(function (c, i) { return '<div class="credit"' + rv('right', i) + '><dt>' + esc(c[0]) + '</dt><dd>' + esc(c[1]) + '</dd></div>'; }).join('') + '</dl>' +
        '<div class="credits__cta"' + rv('up') + '><a class="btn btn--light btn--lg" href="' + esc(C.mail.hiring) + '">' + icon('i-mail') + 'Email about a role</a>' +
        '<a class="btn btn--ember btn--lg" href="' + esc(C.mail.project) + '">' + icon('i-mail') + 'Email about a project</a>' +
        '<div class="credits__links"><a class="btn btn--ghost" href="tel:' + esc(P.phoneTel) + '">' + icon('i-phone') + esc(P.phoneDisplay) + '</a>' +
        '<a class="btn btn--ghost" href="' + esc(P.linkedin) + '" target="_blank" rel="noopener">' + icon('i-in') + 'LinkedIn</a>' +
        '<button type="button" class="btn btn--ghost" data-act="trailer">' + icon('i-play', '', true) + 'Watch the trailer again</button></div></div></div></div></div></section>';
    },
  };

  function profile(id) { return C.profiles.filter(function (p) { return p.id === id; })[0] || C.profiles[0]; }

  function renderHome(profileId) {
    var p = profile(profileId), html = '';
    syncers = [];
    $('[data-rows]').innerHTML = row('continue', 'Continue exploring', '', p.order.concat(['resume', 'contact']).map(function (id) {
      var s = C.sections[id];
      return card({ href: s.href, art: s.art, k: s.k, t: s.title, m: s.line, icon: s.icon, pic: pic(id) });
    }).join(''));
    var band = 0;
    p.order.forEach(function (id, i) {
      secNo = i + 1; html += SECTIONS[id]();
      if ((i === 1 || i === 3 || i === 5) && C.marquee && C.marquee[band]) html += marq(C.marquee[band], band++);
    });
    secNo = 0;
    $('[data-sections]').innerHTML = html + SECTIONS.contact();
    initRows($('[data-view="home"]'));
  }

  function ctaButton(def, kind) {
    var cls = 'btn btn--lg ' + (kind === 'primary' ? 'btn--light' : 'btn--glass');
    if (def.act === 'trailer') return '<button type="button" class="' + cls + '" data-act="trailer">' + icon('i-play', '', true) + esc(def.label) + '</button>';
    if (def.mail) return '<a class="' + cls + '" href="' + esc(C.mail[def.mail]) + '">' + icon('i-mail') + esc(def.label) + '</a>';
    return '<a class="' + cls + '" href="' + esc(def.href) + '">' + icon(kind === 'primary' ? 'i-arrow' : 'i-info') + esc(def.label) + '</a>';
  }

  function renderHero(profileId) {
    var p = profile(profileId);
    $('[data-hero-kicker]').textContent = p.hero.kicker;
    $('[data-hero-cta]').innerHTML = ctaButton(p.hero.primary, 'primary') + ctaButton(p.hero.secondary, 'secondary');
    var chipHost = $('[data-hero-chips]');
    if (chipHost) {
      chipHost.innerHTML = (C.hero.chips || []).map(function (c, i) {
        return '<p class="chip chip--' + esc(c.pos) + '" data-pos="' + esc(c.pos) + '" style="--n:' + i + '"><span class="chip__k">' + esc(c.k) + '</span><span class="chip__v">' + esc(c.v) + '</span></p>';
      }).join('');
    }
  }

  /* ---------- Resume page: exactly the words of the PDF (assets/js/resume.js), in a modern layout ---------- */
  function renderResume() {
    var R = C.resume, P = C.person, T = R.titles;
    function show(u) { return u.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); }
    // a skills sentence becomes chips: split on commas outside brackets, and on semicolons
    function pieces(text) {
      var out = [], depth = 0, cur = '';
      for (var i = 0; i < text.length; i++) {
        var ch = text.charAt(i);
        if (ch === '(') depth++; else if (ch === ')') depth--;
        if ((ch === ',' && depth === 0) || ch === ';') { if (cur.trim()) out.push(cur.trim()); cur = ''; } else cur += ch;
      }
      if (cur.trim()) out.push(cur.trim());
      return out;
    }
    function list(items) { return '<ul class="title__facts">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }
    function chipList(items) { return '<ul class="chips">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>'; }
    // o = the order on a phone, where the two columns become one
    function block(cls, o, title, inner) { return '<section class="rz-sec ' + cls + '" style="--o:' + o + '"><h2>' + esc(title) + '</h2>' + inner + '</section>'; }

    var jobs = R.jobs.map(function (j) {
      var m = j.meta.split(' | ');   // organisation | dates | optional note
      return '<li class="rz-job"><h3>' + esc(j.title) + '</h3><p class="rz-job__meta"><span class="rz-job__org">' + esc(m[0]) + '</span><span class="rz-pill">' + esc(m[1]) + '</span>' +
        (m[2] ? '<span class="rz-pill rz-pill--note">' + esc(m[2]) + '</span>' : '') + '</p>' + list(j.bullets) + '</li>';
    }).join('');
    var ART = ['blue', 'green', 'amber', 'ember'];
    var feat = R.featured.map(function (f, i) {
      return '<article class="rz-card art-' + ART[i % ART.length] + '"><h3>' + esc(f.name) + '</h3>' + chipList(f.tech.split(', ')) + list(f.bullets) + '</article>';
    }).join('');
    var wp = R.wp.map(function (w) { return '<article class="rz-card rz-wp"><h3>' + esc(w[0]) + '</h3><p>' + esc(w[1].charAt(0).toUpperCase() + w[1].slice(1)) + '</p></article>'; }).join('');
    var skills = R.skills.map(function (s) { return '<div class="rz-skill"><h3>' + esc(s[0]) + '</h3>' + chipList(pieces(s[1])) + '</div>'; }).join('');
    var RECI = ['i-trophy', 'i-check', 'i-user'];
    var rec = '<ul class="rz-rec">' + R.recognition.map(function (t, i) { return '<li>' + icon(RECI[i % RECI.length]) + '<span>' + esc(t) + '</span></li>'; }).join('') + '</ul>';
    var roles = R.headline.split(' | ').map(function (r) { return '<span>' + esc(r) + '</span>'; }).join('');

    $('[data-view="resume"]').innerHTML =
      '<div class="rz"><header class="rz-head">' +
        '<img class="rz-face" src="assets/img/kumaran-face.webp" alt="" width="120" height="120">' +
        '<div><p class="rz-eyebrow">Resume</p><h1 id="h-resume" tabindex="-1">' + esc(P.name) + '</h1><p class="rz-roles">' + roles + '</p>' +
          '<ul class="rz-contact"><li>' + icon('i-pin') + esc(P.place) + '</li>' +
          '<li>' + icon('i-phone') + '<a href="tel:' + esc(P.phoneTel) + '">' + esc(P.phoneDisplay) + '</a></li>' +
          '<li>' + icon('i-mail') + '<a href="mailto:' + esc(P.email) + '">' + esc(P.email) + '</a></li>' +
          '<li>' + icon('i-site') + '<a href="' + esc(R.portfolio) + '">' + esc(show(R.portfolio)) + '</a></li>' +
          '<li>' + icon('i-in') + '<a href="' + esc(P.linkedin) + '" target="_blank" rel="noopener">' + esc(show(P.linkedin)) + '</a></li></ul></div>' +
        '<div class="rz-actions"><a class="btn btn--ember btn--lg" data-resume href="' + esc(R.file) + '" download="Kumaran_M_S_Resume.pdf">' + icon('i-download') + 'Download PDF</a>' +
          '<a class="btn btn--light" href="' + esc(C.mail.hiring) + '">' + icon('i-mail') + 'Email about a role</a>' +
          '<button type="button" class="btn btn--ghost" data-act="print">' + icon('i-print') + 'Print</button>' +
          '<a class="btn btn--ghost" href="#top">' + icon('i-chev-l') + 'Back to the portfolio</a></div>' +
      '</header>' +
      '<div class="rz-body"><div class="rz-main">' +
        block('rz-sum', 1, T.summary, '<p>' + esc(R.summary) + '</p>') +
        block('rz-exp', 4, T.experience, '<ol class="rz-tl">' + jobs + '</ol>') +
        block('rz-feat', 5, T.featured, '<p class="rz-intro">' + esc(R.featuredIntro) + '<a href="#top">' + esc(show(R.portfolio)) + '</a>.</p><div class="rz-cards">' + feat + '</div>') +
        block('rz-wps', 6, T.wp, '<div class="rz-cards">' + wp + '</div>') +
      '</div><aside class="rz-side">' +
        block('rz-hi', 2, T.highlights, list(R.highlights)) +
        block('rz-sk', 3, T.skills, skills) +
        block('rz-rc', 7, T.recognition, rec) +
      '</aside></div></div>';
  }

  /* ---------- title pages (the only click-to-open details: projects) ---------- */
  function openTitle(spec) {
    var dlg = $('#title');
    if (!dlg || !dlg.showModal) return;
    var parts = spec.split(':'), kind = parts[0], id = parts[1];
    var banner = $('[data-t-banner]', dlg), body = $('[data-t-body]', dlg);
    var art = 'slate', k = '', name = '', html = '', bg = '';

    if (kind === 'product') {
      var p = C.products[id]; if (!p || !C.apps[id]) return;
      art = p.art; k = p.k + ' · ' + C.apps[id].kind; name = p.name;
      bg = appPic(id);   // a screenshot of the app's dashboard page under the colour overlay
      // the demo video: nothing is downloaded until the visitor presses play
      html = detailHtml(id, { mid: (C.demoVideos && p.video) ? '<div class="title__demo"><h4>Watch the demo <small>' + esc(p.video.length) + '</small></h4>' +
        '<video class="title__video" controls playsinline preload="none" width="1280" height="720" poster="' + esc(p.video.poster) + '" aria-label="' + esc(p.name) + ' demo video">' +
        '<source src="' + esc(p.video.src) + '" type="video/mp4"></video>' +
        '<p class="title__note">' + esc(p.video.note) + '</p></div>' : '' });
    } else if (kind === 'short') {
      var g = C.gadgets.filter(function (x) { return x.id === id; })[0]; if (!g || !C.apps[id]) return;
      art = g.art || 'slate'; k = 'Utility · ' + C.apps[id].kind; name = g.name;
      var mid = '';
      if (g.bars) mid = '<div><h4>Before and after</h4><div class="mbars">' + g.bars.map(function (b, i) { return '<div><div class="mbar__row"><span>' + esc(b[0]) + '</span><span>' + esc(b[2]) + '</span></div><div class="mbar"><span class="mbar__fill mbar__fill--' + (i === 0 ? 'manual' : 'auto') + '" style="--w:' + b[1] + '%"></span></div></div>'; }).join('') + '</div></div>';
      if (g.demo && g.demo.type === 'code') mid = '<div><h4>What it changes</h4><pre class="code" aria-label="Example change">' + g.demo.lines.map(function (l) { return l[0] === '+' ? '<span class="add">+ ' + esc(l[1]) + '</span>' : esc('  ' + l[1]) + '\n'; }).join('') + '</pre></div>';
      html = detailHtml(id, { mid: mid });
    } else if (kind === 'website') {
      var w = C.websites.filter(function (x) { return x.id === id; })[0]; if (!w) return;
      art = w.art; k = w.k; name = w.title;
      html = '<p class="title__syn">' + esc(w.line) + '</p><ul class="chips">' + w.chips.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
        '<p class="title__syn">Built with the integrations above. Client names are left out on purpose.</p>' +
        '<a class="btn btn--ember" href="' + esc(C.mail.project) + '">' + icon('i-mail') + 'Email about a similar project</a>';
    } else { return; }

    banner.className = 'title__banner art-' + art + (bg ? ' img-on' : '');
    banner.style.cssText = bg;   // cleared for the other kinds so a product's picture never carries over
    $('[data-t-k]', dlg).textContent = k;
    $('[data-t-name]', dlg).textContent = name;
    body.innerHTML = html;
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }

  // closing a title page stops its video and drops it, so nothing keeps playing or downloading in the background
  var titleDlg = $('#title');
  if (titleDlg) titleDlg.addEventListener('close', function () { var b = $('[data-t-body]', titleDlg); if (b) b.innerHTML = ''; });

  AQ.render = { home: renderHome, hero: renderHero, resume: renderResume, openTitle: openTitle, profile: profile };
})();
