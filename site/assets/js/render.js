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
    if (!(I.have === 'all' || (I.have && I.have.indexOf(name) >= 0))) return '';
    // a full URL: a relative one inside a CSS variable would be read from the stylesheet's folder (assets/css/), not the page's
    // scrim: a dark layer under the colour overlay so the text on the card stays readable
    return '--img:' + (scrim ? 'linear-gradient(90deg, rgba(10, 10, 12, 0.68) 0%, rgba(10, 10, 12, 0.3) 55%, rgba(10, 10, 12, 0) 100%), ' : '') + 'url(' + new URL(I.base + name + '.webp', document.baseURI).href + ');';
  }
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
    return '<div class="row__track">' + items + '</div>' +
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

  function trophyCard(t, i) {
    return '<article class="trophy trophy--' + t.tier + '"' + rv('pop', i % 4, pic('trophy-' + (i + 1), true)) + '>' + icon('i-trophy') + '<p class="trophy__tier">' + t.tier + '</p><h3 class="trophy__t">' + esc(t.title) + '</h3><p class="trophy__x">' + esc(t.text) + '</p></article>';
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

  var SECTIONS = {
    about: function () {
      var A = C.about;
      return sec('about', '',
        '<div class="about"><figure class="about__quote"' + rv('left') + '><blockquote><p>“' + esc(A.quote) + '”</p></blockquote><figcaption>' + esc(A.by) + '</figcaption></figure>' +
        '<dl class="about__facts">' + A.facts.map(function (f, i) {
          return '<div' + rv('right', i) + '><dt>' + esc(f[0]) + '</dt><dd>' + esc(f[1]) + '</dd>' + (f[2] ? '<small>' + esc(f[2]) + '</small>' : '') + '</div>';
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
        return orig({ art: p.art, icon: p.icon, k: p.k, t: p.name, m: p.line, facts: p.facts.slice(0, 2), data: { title: 'product:' + id }, rv: rv('zoom', i) });
      }).join('');
      var utils = C.gadgets.map(function (g, i) {
        return '<button type="button" class="util" data-title="short:' + esc(g.id) + '"' + rv('pop', i) + '>' + icon(g.icon, 'util__ico') +
          '<span class="util__t">' + esc(g.name) + '</span><span class="util__fig">' + esc(g.figure) + '</span><span class="util__lab">' + esc(g.figureLabel) + '</span></button>';
      }).join('');
      return sec('lab', '',
        '<h3 class="sub-title"' + rv('up') + '>Three full products <span>Playable demos on fictional data</span></h3><div class="orig-grid orig-grid--3">' + prods + '</div>' +
        '<h3 class="sub-title"' + rv('up') + '>Five utilities <span>Each one does one job</span></h3><div class="util-grid">' + utils + '</div>');
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

  /* ---------- Resume (its own printable page) ---------- */
  function renderResume() {
    var P = C.person;
    var exp = J().slice().reverse().map(function (s) {
      if (s.id === 'ai') return '<li><b>' + esc(s.years) + '</b> · AI automation tools, built alongside the senior role</li>';
      return '<li><b>' + esc(s.years) + '</b> · ' + esc(s.role) + ', ' + esc(s.org) + '</li>';
    }).join('');
    var tools = C.tools.map(function (t) { return '<li><b>' + esc(t.name) + '</b>: ' + esc(t.line) + '</li>'; }).join('');
    var skills = C.skills.filter(function (g) { return g.unlock < 99; }).map(function (g) { return '<li><b>' + esc(g.group) + ':</b> ' + esc(g.items.join(', ')) + '</li>'; }).join('');
    var tr = C.achievements.map(function (a) { return '<li><b>' + esc(a.title) + '</b>: ' + esc(a.text) + '</li>'; }).join('');
    $('[data-view="resume"]').innerHTML =
      '<div class="resume__tools"><button type="button" class="btn btn--light" data-act="print">' + icon('i-print') + 'Print or save as PDF</button>' +
      '<a class="btn btn--ember" href="' + esc(C.mail.hiring) + '">' + icon('i-mail') + 'Email about a role</a>' +
      '<a class="btn btn--ghost" href="#top">' + icon('i-chev-l') + 'Back to the portfolio</a></div>' +
      '<article class="paper"><h1 id="h-resume" tabindex="-1">' + esc(P.name) + '</h1><p class="paper__role">AI automation engineer</p>' +
      '<p class="paper__contact">' + esc(P.place) + ' · ' + esc(P.phoneDisplay) + ' · ' + esc(P.email) + ' · ' + esc(P.linkedin.replace('https://www.', '')) + '</p>' +
      '<p class="paper__sum">Seven years of PHP and WordPress delivery, now building Claude-powered desktop tools. One of them cut Google Ads reporting from 1–2 hours to under a minute. Open to remote roles.</p>' +
      '<div class="paper__facts">' + C.about.stats.map(function (s) { return '<div><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span></div>'; }).join('') + '</div>' +
      '<h3>Experience</h3><ul>' + exp + '</ul>' +
      '<div class="paper__cols"><div><h3>AI tools</h3><ul>' + tools + '</ul></div><div><h3>Skills</h3><ul>' + skills + '</ul>' +
      '<h3>Recognition and education</h3><ul>' + tr + '</ul></div></div></article>';
  }

  /* ---------- title pages (the only click-to-open details: projects) ---------- */
  function openTitle(spec) {
    var dlg = $('#title');
    if (!dlg || !dlg.showModal) return;
    var parts = spec.split(':'), kind = parts[0], id = parts[1];
    var banner = $('[data-t-banner]', dlg), body = $('[data-t-body]', dlg), demoName = null;
    var art = 'slate', k = '', name = '', html = '';

    if (kind === 'product') {
      var p = C.products[id]; if (!p) return;
      art = p.art; k = p.k; name = p.name; demoName = p.demo;
      html = '<p class="title__syn">' + esc(p.synopsis) + '</p><ul class="title__facts">' + p.facts.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul>' +
        '<ul class="chips">' + p.chips.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
        '<div class="title__demo"><h4>Try it</h4><div data-demo></div></div>';
    } else if (kind === 'short') {
      var g = C.gadgets.filter(function (x) { return x.id === id; })[0]; if (!g) return;
      art = 'slate'; k = 'Utility'; name = g.name;
      html = '<p class="title__syn">' + esc(g.what) + '</p><div class="bigfig"><b>' + esc(g.figure) + '</b><span>' + esc(g.figureLabel) + '</span></div>';
      if (g.bars) html += '<div class="mbars">' + g.bars.map(function (b, i) { return '<div><div class="mbar__row"><span>' + esc(b[0]) + '</span><span>' + esc(b[2]) + '</span></div><div class="mbar"><span class="mbar__fill mbar__fill--' + (i === 0 ? 'manual' : 'auto') + '" style="--w:' + b[1] + '%"></span></div></div>'; }).join('') + '</div>';
      if (g.demo && g.demo.type === 'code') html += '<pre class="code" aria-label="Example change">' + g.demo.lines.map(function (l) { return l[0] === '+' ? '<span class="add">+ ' + esc(l[1]) + '</span>' : esc('  ' + l[1]) + '\n'; }).join('') + '</pre>';
      if (g.demo && g.demo.type === 'steps') html += '<ul class="steps">' + g.demo.items.map(function (t) { return '<li>' + icon('i-check') + esc(t) + '</li>'; }).join('') + '</ul>';
      html += '<p class="title__syn">' + esc(g.meta) + '</p>';
    } else if (kind === 'website') {
      var w = C.websites.filter(function (x) { return x.id === id; })[0]; if (!w) return;
      art = w.art; k = w.k; name = w.title;
      html = '<p class="title__syn">' + esc(w.line) + '</p><ul class="chips">' + w.chips.map(function (c) { return '<li>' + esc(c) + '</li>'; }).join('') + '</ul>' +
        '<p class="title__syn">Built with the integrations above. Client names are left out on purpose.</p>' +
        '<a class="btn btn--ember" href="' + esc(C.mail.project) + '">' + icon('i-mail') + 'Email about a similar project</a>';
    } else { return; }

    banner.className = 'title__banner art-' + art;
    $('[data-t-k]', dlg).textContent = k;
    $('[data-t-name]', dlg).textContent = name;
    body.innerHTML = html;
    if (demoName && AQ.labs) AQ.labs.mount(demoName, $('[data-demo]', body));
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }

  AQ.render = { home: renderHome, hero: renderHero, resume: renderResume, openTitle: openTitle, profile: profile };
})();
