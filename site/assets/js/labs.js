/* ------------------------------------------------------------------
   Labs: three playable stand-ins for the real desktop apps.
   Everything here runs on fictional demo data. Nothing is sent
   anywhere and nothing is published.
------------------------------------------------------------------- */
(function () {
  'use strict';
  var AQ = (window.AQ = window.AQ || {});
  var C = AQ.content;

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function icon(id) { return '<svg class="ico" aria-hidden="true"><use href="#' + id + '"/></svg>'; }
  function reduced() { return document.documentElement.getAttribute('data-motion') === 'reduced'; }

  /* Accessible tabs with arrow-key support. */
  function tabs(root, selector) {
    var btns = $$(selector, root);
    function select(btn, focus) {
      btns.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.tabIndex = on ? 0 : -1;
        var panel = document.getElementById(b.getAttribute('aria-controls'));
        if (panel) panel.hidden = !on;
      });
      if (focus) btn.focus();
    }
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b); });
      b.addEventListener('keydown', function (e) {
        var k = e.key, j = -1;
        if (k === 'ArrowDown' || k === 'ArrowRight') j = (i + 1) % btns.length;
        else if (k === 'ArrowUp' || k === 'ArrowLeft') j = (i - 1 + btns.length) % btns.length;
        else if (k === 'Home') j = 0;
        else if (k === 'End') j = btns.length - 1;
        if (j > -1) { e.preventDefault(); select(btns[j], true); }
      });
    });
    select(btns[0]);
  }

  /* ================= GAds Dashboard ================= */
  function gads(root) {
    var D = C.gadsDemo;
    var max = Math.max.apply(null, D.series), min = Math.min.apply(null, D.series);
    var pts = D.series.map(function (v, i) {
      return (i * (300 / (D.series.length - 1))).toFixed(1) + ',' + (66 - ((v - min) / (max - min)) * 56).toFixed(1);
    });
    var chart = '<svg viewBox="0 0 300 74" preserveAspectRatio="none" role="img" aria-label="Conversions trend, rising over 30 days">' +
      '<defs><linearGradient id="gg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2563c9" stop-opacity=".28"/><stop offset="1" stop-color="#2563c9" stop-opacity="0"/></linearGradient></defs>' +
      '<polygon points="0,74 ' + pts.join(' ') + ' 300,74" fill="url(#gg)"/>' +
      '<polyline points="' + pts.join(' ') + '" fill="none" stroke="#2563c9" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>';

    root.innerHTML =
      '<div class="app">' +
      '<div class="app__title"><i></i><i></i><i></i><span>GAds Dashboard · demo account</span></div>' +
      '<div class="app__body">' +
      '<div class="app__side"><div class="app__brand">GAds Dashboard<small>' + esc(D.account) + '</small></div>' +
      '<div class="app__nav" role="tablist" aria-label="GAds Dashboard sections" aria-orientation="vertical">' +
      '<button type="button" role="tab" id="gt-over" aria-controls="gp-over">Dashboard</button>' +
      '<button type="button" role="tab" id="gt-audit" aria-controls="gp-audit">Audit</button>' +
      '<button type="button" role="tab" id="gt-rsa" aria-controls="gp-rsa">RSA Builder</button></div></div>' +
      '<div class="app__main">' +

      // Dashboard
      '<section id="gp-over" class="pane" role="tabpanel" aria-labelledby="gt-over">' +
      '<div><h4>Account overview</h4><p class="app__sub">Last 30 days · ' + esc(D.account) + '</p></div>' +
      '<div class="kpis">' + D.kpis.map(function (k) { return '<div class="kpi"><span>' + esc(k.label) + '</span><b>' + esc(k.value) + '</b><em>' + esc(k.delta) + '</em></div>'; }).join('') + '</div>' +
      '<div class="chart"><div class="chart__head"><span>Conversions per day</span><span>30 days</span></div>' + chart + '</div>' +
      '<div class="chat"><div class="chat__head"><h4>' + icon('i-spark') + ' Ask about this account</h4></div>' +
      '<div class="chat__prompts" role="group" aria-label="Sample questions">' + D.prompts.map(function (p, i) { return '<button type="button" class="pill" data-p="' + i + '" aria-pressed="false">' + esc(p.q) + '</button>'; }).join('') + '</div>' +
      '<div class="chat__log" aria-live="polite"><p class="chat__empty">Pick a question to see how the assistant answers.</p></div></div>' +
      '</section>' +

      // Audit
      '<section id="gp-audit" class="pane" role="tabpanel" aria-labelledby="gt-audit" hidden>' +
      '<div><h4>Account audit</h4><p class="app__sub" data-audit-sub>5 findings · 0 fixes ready</p></div>' +
      D.audit.map(function (f, i) {
        return '<div class="finding"><span class="sev sev--' + f.sev + '">' + f.sev + '</span><div><b>' + esc(f.title) + '</b><span>' + esc(f.text) + '</span></div><button type="button" class="mini" data-fix="' + i + '">Prepare fix</button></div>';
      }).join('') + '</section>' +

      // RSA
      '<section id="gp-rsa" class="pane" role="tabpanel" aria-labelledby="gt-rsa" hidden>' +
      '<div><h4>AI RSA Builder</h4><p class="app__sub">Keyword: ' + esc(D.rsa.keyword) + ' · limit ' + D.rsa.limit + ' characters per headline</p></div>' +
      '<div class="rsa__bar"><button type="button" class="mini" data-gen>Generate headlines</button><span class="note" data-rsa-note>Scores check length, keyword use and clarity.</span></div>' +
      '<div class="rsa" data-rsa aria-live="polite"></div>' +
      '</section>' +

      '</div></div></div>';

    tabs(root, '[role="tab"]');

    /* chat */
    var log = $('.chat__log', root), busy = false, timer = 0;
    $$('.pill', root).forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (busy) return;
        var p = D.prompts[parseInt(btn.getAttribute('data-p'), 10)];
        $$('.pill', root).forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
        log.innerHTML = '<div class="msg msg--user">' + esc(p.q) + '</div><div class="msg msg--ai" data-ai><span class="note">Reading live account data…</span></div>';
        var ai = $('[data-ai]', log);
        busy = true;
        var finish = function () {
          ai.innerHTML = esc(p.a) + '<div class="msg__meta"><span class="tagpill">Checked against live account data</span></div>';
          busy = false;
        };
        if (reduced()) { finish(); return; }
        timer = setTimeout(function () {
          var i = 0;
          (function type() {
            i = Math.min(p.a.length, i + 3);
            ai.textContent = p.a.slice(0, i);
            if (i < p.a.length) timer = setTimeout(type, 14); else finish();
          })();
        }, 650);
      });
    });

    /* audit */
    var ready = 0, subEl = $('[data-audit-sub]', root);
    $$('[data-fix]', root).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.disabled) return;
        b.disabled = true; b.textContent = 'Fix ready'; ready++;
        subEl.textContent = '5 findings · ' + ready + ' fix' + (ready === 1 ? '' : 'es') + ' ready';
      });
    });

    /* RSA */
    var rsaEl = $('[data-rsa]', root), genBtn = $('[data-gen]', root), note = $('[data-rsa-note]', root);
    var scores = [94, 90, 88, 83, 79, 86];
    genBtn.addEventListener('click', function () {
      genBtn.disabled = true; rsaEl.innerHTML = '';
      note.textContent = 'Generating…';
      D.rsa.headlines.forEach(function (h, i) {
        setTimeout(function () {
          var row = document.createElement('div');
          row.className = 'rsa__row';
          row.innerHTML = '<b>' + esc(h) + '</b><span class="rsa__meta"><span>' + h.length + '/' + D.rsa.limit + '</span><span class="rsa__score" title="Quality score ' + scores[i] + '"><i style="width:' + scores[i] + '%"></i></span><span>' + scores[i] + '</span></span>';
          rsaEl.appendChild(row);
          if (i === D.rsa.headlines.length - 1) {
            note.innerHTML = '<b>All within the ' + D.rsa.limit + '-character limit.</b> In the real app a click publishes them. Here nothing is sent.';
            genBtn.disabled = false; genBtn.textContent = 'Generate again';
          }
        }, reduced() ? 0 : 220 * (i + 1));
      });
    });
  }

  /* ================= Site Modernizer ================= */
  function modernizer(root) {
    var M = C.modernizer;
    var step = 0, design = 0, view = 'new', broken = false;

    root.innerHTML =
      '<div class="mod">' +
      '<ol class="pipe" aria-label="Pipeline steps">' + M.steps.map(function (s, i) { return '<li><button type="button" data-step="' + i + '" aria-pressed="' + (i === 0) + '">' + s.name + '</button></li>'; }).join('') + '</ol>' +
      '<p class="pipe__text" aria-live="polite" data-pipe></p>' +
      '<div class="mod__split">' +
      '<div class="mod__col">' +
      '<div class="seg" role="group" aria-label="Preview"><button type="button" data-view="old" aria-pressed="false">Original</button><button type="button" data-view="new" aria-pressed="true">Redesigned</button></div>' +
      '<div class="pv" data-pv><div class="pv__bar"><strong>Riverbend Plumbing</strong><span class="pv__phone">Call 555-0142</span></div>' +
      '<h5>Plumbing repairs in Riverbend</h5><p>Licensed plumbers for leaks, drains and water heaters. Same-day visits across the county.</p>' +
      '<div class="pv__cards"><i></i><i></i><i></i></div><span class="pv__btn">Request a quote</span></div>' +
      '<div class="designs" role="group" aria-label="Choose a design">' + M.designs.map(function (d, i) { return '<button type="button" data-design="' + i + '" aria-pressed="' + (i === 0) + '">' + d.name + '</button>'; }).join('') + '</div>' +
      '</div>' +
      '<div class="mod__col">' +
      '<ul class="checks" data-checks>' + M.checks.map(function (c) { return '<li data-check="' + esc(c) + '">' + icon('i-check') + '<span>' + esc(c) + ' kept</span></li>'; }).join('') + '</ul>' +
      '<p class="verdict" data-verdict role="status">All 9 checks pass. This page can be packaged.</p>' +
      '<button type="button" class="btn btn--sm" data-break aria-pressed="false">Remove the main heading</button>' +
      '</div></div></div>';

    var pv = $('[data-pv]', root), pipeText = $('[data-pipe]', root), verdict = $('[data-verdict]', root);

    function applyDesign() {
      var d = M.designs[design];
      pv.classList.toggle('is-original', view === 'old');
      pv.classList.toggle('is-broken', broken);
      if (view === 'new') {
        pv.style.setProperty('--pv-bg', d.bg); pv.style.setProperty('--pv-ink', d.ink); pv.style.setProperty('--pv-accent', d.accent);
        pv.style.setProperty('--pv-radius', d.radius); pv.style.setProperty('--pv-font', d.font); pv.style.setProperty('--pv-card', d.card);
      } else { ['--pv-bg', '--pv-ink', '--pv-accent', '--pv-radius', '--pv-font', '--pv-card'].forEach(function (v) { pv.style.removeProperty(v); }); }
      $$('[data-view]', root).forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-view') === view ? 'true' : 'false'); });
      $$('[data-design]', root).forEach(function (b) { b.setAttribute('aria-pressed', parseInt(b.getAttribute('data-design'), 10) === design ? 'true' : 'false'); });
    }
    function applyChecks() {
      $$('[data-check]', root).forEach(function (li) {
        var fail = broken && li.getAttribute('data-check') === 'Main heading (H1)';
        li.classList.toggle('is-fail', fail);
        li.querySelector('use').setAttribute('href', fail ? '#i-x' : '#i-check');
        li.querySelector('span').textContent = li.getAttribute('data-check') + (fail ? ' missing' : ' kept');
      });
      verdict.classList.toggle('is-fail', broken);
      verdict.textContent = broken ? 'Page not finalised: 1 of 9 checks failed. Nothing is packaged.' : 'All 9 checks pass. This page can be packaged.';
      var pkg = $$('[data-step]', root)[M.steps.length - 1];
      pkg.classList.toggle('is-blocked', broken);
      $$('[data-step]', root)[3].classList.toggle('is-blocked', broken);
      renderStep();
    }
    function renderStep() {
      $$('[data-step]', root).forEach(function (b) { b.setAttribute('aria-pressed', parseInt(b.getAttribute('data-step'), 10) === step ? 'true' : 'false'); });
      var s = M.steps[step];
      var blocked = broken && (step === 3 || step === 5);
      pipeText.textContent = blocked ? (step === 3 ? 'Check: this page lost its main heading, so it fails and is not finalised.' : 'Package: blocked until every page passes its checks.') : s.text;
    }

    $$('[data-step]', root).forEach(function (b) { b.addEventListener('click', function () { step = parseInt(b.getAttribute('data-step'), 10); renderStep(); }); });
    $$('[data-view]', root).forEach(function (b) { b.addEventListener('click', function () { view = b.getAttribute('data-view'); applyDesign(); }); });
    $$('[data-design]', root).forEach(function (b) { b.addEventListener('click', function () { design = parseInt(b.getAttribute('data-design'), 10); view = 'new'; step = 2; applyDesign(); renderStep(); }); });
    var br = $('[data-break]', root);
    br.addEventListener('click', function () {
      broken = !broken;
      br.setAttribute('aria-pressed', broken ? 'true' : 'false');
      br.textContent = broken ? 'Restore the main heading' : 'Remove the main heading';
      if (broken) step = 3;
      applyDesign(); applyChecks();
    });
    applyDesign(); applyChecks();
  }

  /* ================= Form and Lead Platform ================= */
  function forms(root) {
    var F = C.forms;
    root.innerHTML =
      '<div class="app frm">' +
      '<div class="app__title"><i></i><i></i><i></i><span>Form and Lead Platform · demo site</span></div>' +
      '<div class="frm__body">' +
      '<div class="frm__pal"><h4>Field types</h4>' + F.fieldTypes.map(function (t) { return '<span>' + esc(t) + '</span>'; }).join('') + '</div>' +
      '<div class="frm__canvas">' +
      '<div class="frm__step" data-steps hidden><i class="is-on"></i><i></i></div>' +
      '<h4>Request a quote</h4>' +
      '<div class="fld fld--row" data-s="1"><div><label for="f-first">First name</label><input id="f-first" value="Jordan" autocomplete="off"></div><div><label for="f-last">Last name</label><input id="f-last" value="Lee" autocomplete="off"></div></div>' +
      '<div class="fld" data-s="1"><label for="f-mail">Email</label><input id="f-mail" type="email" value="jordan@example.com" autocomplete="off"></div>' +
      '<div class="fld" data-s="1"><label for="f-reason">Reason</label><select id="f-reason"><option>General question</option><option>Sales enquiry</option></select></div>' +
      '<div class="fld" data-s="1" data-cond><label for="f-co">Company name</label><input id="f-co" value="Lee &amp; Sons" autocomplete="off"></div>' +
      '<div class="fld" data-s="2"><label for="f-msg">Message</label><textarea id="f-msg">Need a quote for two water heaters.</textarea></div>' +
      '<div class="fld" data-s="2"><label class="consent"><input type="checkbox" checked> I agree to be contacted about this request.</label></div>' +
      '<div class="fld" data-s="2" data-cap><label for="f-cap">Captcha: which day comes after Monday?</label><input id="f-cap" value="Tuesday" autocomplete="off"></div>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="mini mini--ghost" data-next hidden>Next step</button><button type="button" class="mini" data-send>Send test entry</button></div>' +
      '</div>' +
      '<div class="frm__side">' +
      '<h4>Form settings</h4>' +
      '<div class="tgl"><span id="tg1">Multi-step</span><button type="button" role="switch" aria-checked="false" aria-labelledby="tg1" data-tg="multi"></button></div>' +
      '<div class="tgl"><span id="tg2">Conditional field</span><button type="button" role="switch" aria-checked="true" aria-labelledby="tg2" data-tg="cond"></button></div>' +
      '<div class="tgl"><span id="tg3">Captcha</span><button type="button" role="switch" aria-checked="true" aria-labelledby="tg3" data-tg="cap"></button></div>' +
      '<h4>Delivery log</h4><ul class="frm__log" data-log aria-live="polite"><li>Waiting for a test entry…</li></ul>' +
      '</div></div></div>';

    var S = { multi: false, cond: true, cap: true, step: 1 };
    var steps = $('[data-steps]', root), next = $('[data-next]', root), send = $('[data-send]', root), reason = $('#f-reason', root);

    function apply() {
      $$('[data-s]', root).forEach(function (el) {
        var inStep = !S.multi || el.getAttribute('data-s') === String(S.step);
        var hide = !inStep;
        if (el.hasAttribute('data-cond') && S.cond && reason.selectedIndex === 0) hide = true;
        if (el.hasAttribute('data-cap') && !S.cap) hide = true;
        el.hidden = hide;
      });
      steps.hidden = !S.multi;
      $$('i', steps).forEach(function (i, n) { i.classList.toggle('is-on', n < S.step); });
      next.hidden = !S.multi;
      next.textContent = S.step === 1 ? 'Next step' : 'Previous step';
      $$('[data-tg]', root).forEach(function (b) { b.setAttribute('aria-checked', S[b.getAttribute('data-tg')] ? 'true' : 'false'); });
    }
    $$('[data-tg]', root).forEach(function (b) {
      b.addEventListener('click', function () { var k = b.getAttribute('data-tg'); S[k] = !S[k]; if (k === 'multi') S.step = 1; apply(); });
    });
    next.addEventListener('click', function () { S.step = S.step === 1 ? 2 : 1; apply(); });
    reason.addEventListener('change', apply);

    var log = $('[data-log]', root);
    send.addEventListener('click', function () {
      if (send.disabled) return;
      send.disabled = true; log.innerHTML = '';
      var lines = F.log.slice();
      if (!S.cap) lines[0] = 'Spam check passed: honeypot, rate limit';
      lines.forEach(function (t, i) {
        setTimeout(function () {
          var li = document.createElement('li'); li.textContent = t; log.appendChild(li);
          if (i === lines.length - 1) send.disabled = false;
        }, reduced() ? 0 : 340 * (i + 1));
      });
    });
    apply();
  }

  var builders = { gads: gads, modernizer: modernizer, forms: forms };
  // The demos are built on demand, when a title page opens
  AQ.labs = { mount: function (name, el) { var fn = builders[name]; if (fn && el) fn(el); } };
})();

