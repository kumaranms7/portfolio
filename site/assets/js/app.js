/* ------------------------------------------------------------------
   App: intro and profile chooser, page routing (one long home page plus
   a printable resume), scroll-spy nav, hero video, trailer player,
   dialogs and keyboard handling.
------------------------------------------------------------------- */
(function () {
  'use strict';
  var AQ = (window.AQ = window.AQ || {});
  var C = AQ.content, R = AQ.render, doc = document.documentElement;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icon(id, fill) { return '<svg class="ico' + (fill ? ' ico--fill' : '') + '" aria-hidden="true"><use href="#' + id + '"/></svg>'; }

  var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reduced() { return !!(mq && mq.matches); }
  function syncMotion() { doc.setAttribute('data-motion', reduced() ? 'reduced' : 'full'); }
  syncMotion();
  if (mq && mq.addEventListener) mq.addEventListener('change', syncMotion);

  doc.setAttribute('data-fx', C.fx || 'wild');

  function applyMail(root) { $$('[data-mail]', root).forEach(function (a) { a.href = C.mail[a.getAttribute('data-mail')] || a.href; }); }
  applyMail(document);

  /* ---------- motion helpers (the main scroll animation is pure CSS, see views.css) ---------- */
  var motionIO = null, countIO = null;
  var HAS_SCROLL_ANIM = !!(window.CSS && CSS.supports && CSS.supports('(animation-timeline: view()) and (animation-range: entry)'));

  function setNum(el, v) { el.textContent = Math.round(v) + (el.getAttribute('data-suffix') || ''); }
  function initMotion() {
    if (motionIO) motionIO.disconnect();
    if (countIO) countIO.disconnect();
    var home = $('[data-view="home"]');

    // Browsers without scroll-driven animations: toggle .is-in each time a block enters or leaves the screen.
    if (!HAS_SCROLL_ANIM && !reduced() && 'IntersectionObserver' in window) {
      doc.classList.add('rv-io');
      motionIO = new IntersectionObserver(function (es) {
        es.forEach(function (e) { e.target.classList.toggle('is-in', e.isIntersecting); });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      $$('[data-reveal]', home).forEach(function (n) { motionIO.observe(n); });
    } else doc.classList.remove('rv-io');

    // The big numbers count up every time they scroll into view, and reset when they leave.
    var nums = $$('[data-count]', home);
    if (!nums.length || reduced() || !('IntersectionObserver' in window)) return;
    countIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var el = e.target, to = +el.getAttribute('data-count');
        cancelAnimationFrame(el._raf);
        if (!e.isIntersecting) { setNum(el, 0); return; }
        var t0 = performance.now();
        (function step(now) {
          var k = Math.min(1, (now - t0) / 1100);
          setNum(el, to * (1 - Math.pow(1 - k, 3)));
          if (k < 1) el._raf = requestAnimationFrame(step);
        })(t0);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { countIO.observe(n); });
  }

  /* ---------- skill tabs: arrow keys, selection follows focus, find-in-page opens the right tab ---------- */
  // (The native focusgroup attribute only moves focus along one axis; these tabs run down on a laptop and across on a phone.)
  function initTabs() {
    var list = $('[data-tabs]');
    if (!list) return;
    var tabs = $$('[role="tab"]', list), panels = tabs.map(function (t, i) { return document.getElementById('sp-' + i); });
    function select(i) {
      tabs.forEach(function (t, k) {
        var on = k === i, p = panels[k];
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (on) { p.removeAttribute('hidden'); p.setAttribute('tabindex', '0'); }
        else { p.setAttribute('hidden', 'until-found'); p.removeAttribute('tabindex'); }
      });
      // a swipeable row on phones: keep the chosen tab in view without moving the page
      if (list.scrollWidth > list.clientWidth + 1) {
        var a = tabs[i].getBoundingClientRect(), b = list.getBoundingClientRect();
        list.scrollBy({ left: a.left - b.left - (b.width - a.width) / 2, behavior: reduced() ? 'auto' : 'smooth' });
      }
    }
    list.addEventListener('focusin', function (e) { var t = e.target.closest('[role="tab"]'); if (t && t.getAttribute('aria-selected') !== 'true') select(tabs.indexOf(t)); });
    list.addEventListener('click', function (e) { var t = e.target.closest('[role="tab"]'); if (t) select(tabs.indexOf(t)); });
    panels.forEach(function (p, i) { p.addEventListener('beforematch', function () { select(i); }); });
    // arrow keys move focus (and so the selection) in both directions, Home and End jump to the ends
    list.addEventListener('keydown', function (e) {
      var i = tabs.indexOf(document.activeElement), n = tabs.length, to = -1;
      if (i < 0) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') to = (i + 1) % n;
      else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') to = (i - 1 + n) % n;
      else if (e.key === 'Home') to = 0;
      else if (e.key === 'End') to = n - 1;
      if (to < 0) return;
      e.preventDefault();
      tabs[to].focus();
    });
  }

  /* ---------- End credits poster video: loads when you scroll near it, plays only while on screen ---------- */
  function initPosterVideo() {
    var poster = $('.poster'), v = poster && $('[data-poster-video]', poster), btn = poster && $('[data-poster-toggle]', poster);
    if (!v) return;
    var conn = navigator.connection || {};
    if (reduced() || conn.saveData) { v.remove(); if (btn) btn.remove(); return; }   // these visitors keep the still picture and download nothing
    var srcs = [];
    try { srcs = JSON.parse(v.getAttribute('data-srcs')) || []; } catch (e) {}
    var loaded = false, visible = false, userPaused = false;
    function label() {
      btn.setAttribute('aria-label', userPaused ? 'Play video' : 'Pause video');
      btn.innerHTML = icon(userPaused ? 'i-play' : 'i-pause', userPaused);
    }
    function load() {
      if (loaded) return; loaded = true;
      srcs.forEach(function (src) {
        var s = document.createElement('source'); s.src = src; s.type = /\.webm(\?|$)/i.test(src) ? 'video/webm' : 'video/mp4'; v.appendChild(s);
      });
      v.load();
    }
    function sync() {
      if (!loaded) return;
      if (visible && !userPaused && !document.hidden && !reduced()) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    }
    v.addEventListener('playing', function () { poster.classList.add('has-video'); btn.hidden = false; });
    // give up (and keep the still picture) only when the last listed file fails too
    v.addEventListener('error', function (e) {
      if (e.target !== v && e.target !== v.lastElementChild) return;
      poster.classList.remove('has-video'); btn.hidden = true;
    }, true);
    btn.addEventListener('click', function () { userPaused = !userPaused; label(); sync(); });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) load();
        sync();
      }, { rootMargin: '300px 0px', threshold: 0.05 }).observe(poster);
    } else { visible = true; load(); sync(); }
  }

  /* ---------- pointer: the animated cursor and the hero's depth effect, on one animation loop (mouse only) ----------
     Smoothness rules: the dot is placed exactly under the pointer with no easing, only the ring trails it (about 50 ms),
     the hero eases toward the pointer in about 120 ms, and everything is moved with transform/translate on the element
     itself. Writing the position into a CSS variable on <html> instead costs about 60 ms per move, which is what made it feel delayed. */
  function initPointer() {
    if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var cur = $('[data-cursor]'), useCursor = !!(cur && 'showPopover' in cur);
    var lag = useCursor ? $('.cursor__lag', cur) : null;
    var hero = $('[data-hero]'), art = $('.hero__art');
    var DEPTH = { left: [24, 10], right: [20, -14], br: [-28, -12] };      // how far each chip drifts
    var mx = 0, my = 0, rx = 0, ry = 0, px = 0, py = 0;                     // pointer, ring, hero depth (-1..1)
    var live = false, heroVisible = true, raf = 0, last = 0;

    // a popover lives in the top layer; showing it again puts it above any dialog that opened after it
    function bump() { try { if (cur.matches(':popover-open')) cur.hidePopover(); cur.showPopover(); } catch (err) {} }
    function kind(t) {
      if (!t || !t.closest) return '';
      if (t.closest('input, textarea, select, [contenteditable]')) return 'off';
      if (t.closest('[data-title], .card:not(.card--static), .orig, .util, .profile')) return 'play';
      if (t.closest('a, button, [role="tab"], summary')) return 'link';
      return '';
    }
    function tick(now) {
      var dt = last ? Math.min(now - last, 64) : 16, moving = false;
      last = now;
      if (useCursor) {
        var kr = reduced() ? 1 : 1 - Math.exp(-dt / 50);
        rx += (mx - rx) * kr; ry += (my - ry) * kr;
        lag.style.translate = (rx - mx).toFixed(2) + 'px ' + (ry - my).toFixed(2) + 'px';
        if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) moving = true;
      }
      if (art && heroVisible && !reduced()) {
        var tx = (mx / innerWidth - 0.5) * 2, ty = (my / innerHeight - 0.5) * 2, kp = 1 - Math.exp(-dt / 120);
        px += (tx - px) * kp; py += (ty - py) * kp;
        art.style.transform = 'translate3d(' + (px * -12).toFixed(2) + 'px,' + (py * -6).toFixed(2) + 'px,0)';
        var chips = hero.querySelectorAll('.chip');
        for (var i = 0; i < chips.length; i++) {
          var d = DEPTH[chips[i].getAttribute('data-pos')] || [-14, -8];
          chips[i].style.translate = (px * d[0]).toFixed(2) + 'px ' + (py * d[1]).toFixed(2) + 'px';
        }
        if (Math.abs(tx - px) > 0.002 || Math.abs(ty - py) > 0.002) moving = true;
      }
      if (moving) raf = requestAnimationFrame(tick); else { raf = 0; last = 0; }
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (useCursor) {
        if (!live) { live = true; rx = mx; ry = my; doc.classList.add('has-cursor'); bump(); }
        cur.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';    // exactly under the pointer
        cur.classList.add('is-on');
      }
      kick();
    }, { passive: true });
    if (useCursor) {
      window.addEventListener('pointerover', function (e) { if (e.pointerType === 'mouse') cur.setAttribute('data-kind', kind(e.target)); }, { passive: true });
      window.addEventListener('pointerdown', function (e) { if (e.pointerType === 'mouse') cur.classList.add('is-down'); });
      window.addEventListener('pointerup', function () { cur.classList.remove('is-down'); });
      doc.addEventListener('mouseleave', function () { cur.classList.remove('is-on'); });
      var mo = new MutationObserver(bump);
      $$('dialog').forEach(function (d) { mo.observe(d, { attributes: true, attributeFilter: ['open'] }); });
    }
    if (hero && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; if (heroVisible) kick(); }, { threshold: 0 }).observe(hero);
    }
  }

  /* ---------- wild mode: split the section titles into letters and the About quote into words, so each one can
     animate on its own as you scroll (see "WILD MOTION" in views.css). Screen readers still get the whole text. ---------- */
  function splitText() {
    if (doc.getAttribute('data-fx') !== 'wild' || reduced() || !HAS_SCROLL_ANIM) return;
    var home = $('[data-view="home"]');
    $$('.sec__title', home).forEach(function (h) {
      var text = h.textContent;
      if (!text.trim() || h.classList.contains('is-split')) return;
      var n = 0;
      h.setAttribute('aria-label', text);
      h.innerHTML = text.split(' ').map(function (w) {
        return '<span class="w" aria-hidden="true">' + w.split('').map(function (ch) { return '<span class="l" style="--i:' + (n++) + '">' + esc(ch) + '</span>'; }).join('') + '</span>';
      }).join(' ');
      h.classList.add('is-split');
    });
    $$('.about__quote blockquote p', home).forEach(function (p) {
      if (p.classList.contains('is-split')) return;
      p.innerHTML = p.textContent.split(' ').map(function (w, i) { return '<span class="qw" style="--w:' + i + '">' + esc(w) + '</span>'; }).join(' ');
      p.classList.add('is-split');
    });
  }

  /* ---------- profile ---------- */
  var profileId = '';
  var avatar = $('[data-avatar]');
  function setProfile(id) {
    profileId = id;
    doc.setAttribute('data-profile', id);
    var p = R.profile(id);
    if (avatar) avatar.title = 'Watching as ' + p.name + '. Select to switch.';
    R.hero(id);
    R.home(id);
    applyMail($('[data-view="home"]'));
    splitText();
    initMotion();
    initTabs();
    initPosterVideo();
    watchSpy();
    if (location.hash && /^#[a-z]+$/.test(location.hash)) goTo(location.hash.slice(1), false);
  }

  /* ---------- routing: one long home page, plus the resume ---------- */
  var BASE_TITLE = document.title, viewNow = '', firstRoute = true;

  function goTo(id, smooth) {
    var el = id && document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ block: 'start', behavior: smooth && !reduced() ? 'smooth' : 'auto' });
  }

  function route() {
    var h = location.hash;
    var legacy = /^#\/(story|lab|skills|trophies|contact)/.exec(h);   // old links such as #/lab
    if (legacy) { h = '#' + legacy[1]; history.replaceState(null, '', h); }
    var v = h === '#/resume' ? 'resume' : 'home';
    var changed = v !== viewNow;
    if (v === 'resume') R.resume();

    $$('.view').forEach(function (el) {
      var on = el.getAttribute('data-view') === v;
      el.hidden = !on;
      el.classList.toggle('is-on', on);
      el.classList.toggle('is-enter', on && changed);
    });
    viewNow = v;
    doc.setAttribute('data-page', v);
    document.title = v === 'resume' ? 'Resume · Kumaran M S' : BASE_TITLE;
    markResume(v === 'resume');
    var view = $('[data-view="' + v + '"]');
    applyMail(view);

    if (v === 'resume') {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (!firstRoute) { var hh = $('h1', view); if (hh) hh.focus({ preventScroll: true }); }
    } else {
      var id = h.replace(/^#\/?/, '');
      if (id && document.getElementById(id)) {
        // the browser cannot scroll to a section that was hidden when the link was followed,
        // nor to an old-style #/lab link that was rewritten to #lab
        if (changed || firstRoute || legacy) goTo(id, !!legacy && !changed);
      } else if (changed || !id) {
        window.scrollTo({ top: 0, behavior: changed || reduced() ? 'instant' : 'smooth' });
      }
    }
    firstRoute = false;
    if (v === 'home') setTimeout(syncNative, 700);
  }
  window.addEventListener('hashchange', route);

  /* ---------- nav: highlight the section in view ---------- */
  var spyLinks = $$('[data-spy] a'), spyIO = null, spyNative = false;
  function markResume(on) {
    spyLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#/resume') { if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); }
      else if (on) { a.removeAttribute('aria-current'); a.classList.remove('target-current'); }
    });
  }
  function setSpy(link) {
    if (viewNow !== 'home') return;
    spyLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#/resume') return;
      var on = a === link || (link && a.getAttribute('href') === link.getAttribute('href'));
      a.classList.toggle('target-current', !!on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  // Chrome and Edge track the target natively (CSS :target-current); everywhere else an observer does it.
  function watchSpy() {
    spyNative = !!(window.CSS && CSS.supports && CSS.supports('scroll-target-group: auto'));
    if (spyNative) return;
    if (spyIO) spyIO.disconnect();
    if (!('IntersectionObserver' in window)) return;
    spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var l = spyLinks.filter(function (a) { return a.getAttribute('href') === '#' + e.target.id; })[0];
        if (l) setSpy(l);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    $$('#top, [data-sections] .sec').forEach(function (s) { spyIO.observe(s); });
  }
  // native path: mirror the visual :target-current state into aria-current once scrolling stops
  function syncNative() {
    if (viewNow !== 'home' || !spyNative) return;
    var cur = null;
    try { cur = $('.nav__links a:target-current'); } catch (err) { return; }
    spyLinks.forEach(function (a) {
      if (a.getAttribute('href') === '#/resume') return;
      var on = cur && a.getAttribute('href') === cur.getAttribute('href');
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }
  document.addEventListener('scrollend', syncNative);

  /* ---------- intro and profile chooser ---------- */
  var gate = $('#gate'), intro = $('[data-intro]', gate), who = $('[data-who]', gate), list = $('[data-profiles]', gate);
  var I = C.intro;
  $('[data-intro-role]', gate).textContent = I.role;
  $('[data-intro-pos]', gate).textContent = I.position + ' · ' + I.place;
  $('[data-who-note]', gate).textContent = I.whoNote;
  // the main profile shows your photo with a MAIN badge, the others a letter or an icon
  list.innerHTML = C.profiles.map(function (p) {
    var face = p.photo ? '<img src="assets/img/kumaran-face.webp" alt="" width="480" height="480">' : (p.glyph ? '<span class="profile__glyph" aria-hidden="true">' + esc(p.glyph) + '</span>' : icon(p.icon));
    return '<button type="button" class="profile" data-profile="' + p.id + '"><span class="profile__tile art-' + p.art + '">' + face +
      (p.badge ? '<span class="profile__badge">' + esc(p.badge) + '</span>' : '') + '</span>' +
      '<span class="profile__name">' + esc(p.name) + '</span><span class="profile__line">' + esc(p.line) + '</span></button>';
  }).join('');

  function showWho() {
    intro.hidden = true; who.hidden = false;
    var b = $('.profile', who); if (b) b.focus();
  }
  // The intro waits for a click. It never advances by itself.
  function openGate(mode) {
    if (!gate.open) gate.showModal();
    if (mode === 'who') { showWho(); return; }
    intro.hidden = false; who.hidden = true;
    var go = $('[data-intro-go]', gate); if (go) go.focus({ preventScroll: true });
  }
  function closeGate() {
    if (gate.open) gate.close();
    document.body.setAttribute('data-state', 'ready');
    if (!location.hash || location.hash === '#top') window.scrollTo({ top: 0, behavior: 'instant' });
  }

  gate.addEventListener('click', function (e) {
    var b = e.target.closest('.profile');   // not [data-profile]: <html> carries that attribute too
    if (b) { setProfile(b.getAttribute('data-profile')); closeGate(); return; }
    if (!intro.hidden) showWho();
  });
  gate.addEventListener('cancel', function (e) {
    // Esc: move on one step, never leave a visitor stuck behind the intro
    e.preventDefault();
    if (!intro.hidden) { showWho(); return; }
    if (!profileId) setProfile('browse');
    closeGate();
  });

  /* ---------- hero video (empty until you add a clip in content.js) ---------- */
  function initHeroVideo() {
    var cfg = C.hero || {}, srcs = [].concat(cfg.video || []).filter(Boolean);
    var media = $('[data-hero-media]'), btn = $('[data-hero-toggle]'), hero = $('[data-hero]');
    if (!srcs.length || !media || !hero) return;
    var conn = navigator.connection || {};
    if (reduced() || conn.saveData) return;            // no motion and no download for these visitors

    var portrait = cfg.mode === 'portrait', art = $('.hero__art');
    doc.setAttribute('data-hero-video', portrait ? 'portrait' : 'backdrop');
    var v = document.createElement('video');
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
    v.width = portrait ? 960 : 1280; v.height = portrait ? 960 : 720; v.tabIndex = -1;
    // portrait mode: the clip lives inside the photo's box (above the photo, below the chips), so it always lines up with it
    if (portrait && art) art.insertBefore(media, $('[data-hero-chips]', art));
    srcs.forEach(function (src) {
      var s = document.createElement('source'); s.src = src; s.type = /\.webm(\?|$)/i.test(src) ? 'video/webm' : 'video/mp4'; v.appendChild(s);
    });
    media.appendChild(v); media.hidden = false;

    var userPaused = false, visible = true;
    function label() {
      btn.setAttribute('aria-label', userPaused ? 'Play background video' : 'Pause background video');
      btn.innerHTML = icon(userPaused ? 'i-play' : 'i-pause', userPaused);
    }
    function sync() {
      if (!userPaused && visible && !document.hidden && !reduced()) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    }
    v.addEventListener('playing', function () { media.classList.add('is-live'); btn.hidden = false; });
    // only give up when the last listed file fails too (a browser may skip the WebM and use the MP4)
    v.addEventListener('error', function (e) {
      if (e.target !== v && e.target !== v.lastElementChild) return;
      media.hidden = true; btn.hidden = true; doc.removeAttribute('data-hero-video');
    }, true);
    btn.addEventListener('click', function () { userPaused = !userPaused; label(); sync(); });
    document.addEventListener('visibilitychange', sync);
    if (mq && mq.addEventListener) mq.addEventListener('change', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { visible = es[0].isIntersecting; sync(); }, { threshold: 0.05 }).observe(hero);
    }
    label(); sync();
  }

  /* ---------- trailer ---------- */
  var tr = $('#trailer'), bars = $('[data-tr-bars]'), stage = $('[data-tr-stage]'), pauseBtn = $('[data-tr-pause]');
  var scenes = C.trailer, DUR = 3400, ti = 0, tPaused = false, tTimer = 0, tStart = 0, tElapsed = 0;

  function sceneHtml(s, last) {
    var cls = s.style ? ' scene--' + s.style : '';
    return '<div class="scene' + cls + '"><h2 class="scene__big">' + esc(s.big) + '</h2><p class="scene__small">' + esc(s.small) + '</p>' +
      (last ? '<div class="scene__cta"><a class="btn btn--light btn--lg" href="' + esc(C.mail.hiring) + '">' + icon('i-mail') + 'Email about a role</a>' +
        '<button type="button" class="btn btn--glass btn--lg" data-tr-again>' + icon('i-swap') + 'Watch again</button></div>' : '') + '</div>';
  }
  function setPaused(p) {
    tPaused = p;
    tr.classList.toggle('is-paused', p);
    pauseBtn.setAttribute('aria-label', p ? 'Play trailer' : 'Pause trailer');
    pauseBtn.innerHTML = icon(p ? 'i-play' : 'i-pause', p);
    clearTimeout(tTimer);
    if (p) { tElapsed += Date.now() - tStart; }
    else if (ti < scenes.length - 1) { tStart = Date.now(); tTimer = setTimeout(function () { go(ti + 1); }, Math.max(200, DUR - tElapsed)); }
  }
  function go(i) {
    clearTimeout(tTimer);
    ti = Math.max(0, Math.min(scenes.length - 1, i));
    var last = ti === scenes.length - 1;
    stage.innerHTML = sceneHtml(scenes[ti], last);
    $$('.bar', bars).forEach(function (b, k) {
      b.classList.remove('is-on', 'is-done');
      if (k < ti) b.classList.add('is-done');
      else if (k === ti && !last) { void b.offsetWidth; b.classList.add('is-on'); }
      else if (k === ti && last) b.classList.add('is-done');
    });
    tElapsed = 0; tStart = Date.now();
    if (!tPaused && !last) tTimer = setTimeout(function () { go(ti + 1); }, DUR);
  }
  function openTrailer() {
    bars.innerHTML = scenes.map(function () { return '<span class="bar" style="--dur:' + DUR + 'ms"><i></i></span>'; }).join('');
    tPaused = reduced();
    tr.classList.toggle('is-paused', tPaused);
    pauseBtn.innerHTML = icon(tPaused ? 'i-play' : 'i-pause', tPaused);
    pauseBtn.setAttribute('aria-label', tPaused ? 'Play trailer' : 'Pause trailer');
    if (!tr.open) tr.showModal();
    go(0);
  }
  tr.addEventListener('close', function () { clearTimeout(tTimer); });
  tr.addEventListener('click', function (e) {
    if (e.target.closest('[data-tr-next]')) go(ti + 1);
    else if (e.target.closest('[data-tr-prev]')) go(ti - 1);
    else if (e.target.closest('[data-tr-pause]')) setPaused(!tPaused);
    else if (e.target.closest('[data-tr-again]')) { tPaused = false; setPaused(false); tElapsed = 0; go(0); }
  });
  tr.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); go(ti + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(ti - 1); }
  });

  /* ---------- clicks ---------- */
  function closeOpen(id) { var d = document.getElementById(id); if (d && d.open) d.close(); }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-title]');
    if (t) { R.openTitle(t.getAttribute('data-title')); return; }

    var act = e.target.closest('[data-act]');
    if (act) {
      var a = act.getAttribute('data-act');
      if (act.hasAttribute('data-menu-act')) closeOpen('menu');
      if (a === 'trailer') { openTrailer(); return; }
      if (a === 'profiles') { openGate('who'); return; }
      if (a === 'print') { window.print(); return; }
    }

    var op = e.target.closest('[data-open]');
    if (op) { var d = document.getElementById(op.getAttribute('data-open')); if (d && d.showModal && !d.open) d.showModal(); return; }

    var c = e.target.closest('[data-close]');
    if (c) { var dd = c.closest('dialog'); if (dd) dd.close(); return; }

    var ml = e.target.closest('[data-menu-link]');
    if (ml) { var md = ml.closest('dialog'); if (md) md.close(); }
  });

  // Light dismiss where <dialog closedby> is not supported
  if (!('closedBy' in HTMLDialogElement.prototype)) {
    $$('dialog[closedby="any"]').forEach(function (dialog) {
      var outside = function (e) { var r = dialog.getBoundingClientRect(); return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom; };
      var down = false;
      dialog.addEventListener('pointerdown', function (e) { down = outside(e); });
      dialog.addEventListener('pointerup', function (e) { if (down && outside(e)) dialog.close(); down = false; });
    });
  }

  /* ---------- nav and pointer ---------- */
  var nav = $('#nav');
  function onScroll() { nav.classList.toggle('is-solid', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- start: the intro shows on every load; ?nointro skips it for testing ---------- */
  var skipIntro = /[?&]nointro/.test(location.search);
  setProfile('browse');
  route();
  initHeroVideo();
  initPointer();
  if (!skipIntro) openGate('intro');
  else document.body.setAttribute('data-state', 'ready');

  AQ.app = { setProfile: setProfile, openTrailer: openTrailer };
})();
