/* ============================================================
   Mr Tanah x Residensi Armani Putra — app.js
   Dwibahasa (BM/EN), kad jenis unit, lesen/permit, borang daftar minat.
   Data: window.ARMANI (data/project.js) — dijana, jangan edit manual.
   ============================================================ */
(function () {
  'use strict';

  var D = window.ARMANI;
  if (!D) { console.error('ARMANI data tidak dijumpai'); return; }

  var LANG = 'bm';
  try { var s = localStorage.getItem('armani-lang'); if (s === 'bm' || s === 'en') LANG = s; } catch (e) {}

  var NEGERI = ['Johor','Kedah','Kelantan','Melaka','Negeri Sembilan','Pahang','Perak','Perlis',
                'Pulau Pinang','Sabah','Sarawak','Selangor','Terengganu',
                'Kuala Lumpur','Labuan','Putrajaya'];
  var SUMBER = [
    { v: 'Facebook',  bm: 'Facebook',  en: 'Facebook' },
    { v: 'Instagram', bm: 'Instagram', en: 'Instagram' },
    { v: 'TikTok',    bm: 'TikTok',    en: 'TikTok' },
    { v: 'WhatsApp',  bm: 'WhatsApp',  en: 'WhatsApp' },
    { v: 'Laman web Mr Tanah', bm: 'Laman web Mr Tanah', en: 'Mr Tanah website' },
    { v: 'Rakan / keluarga', bm: 'Rakan / keluarga', en: 'Friend / family' },
    { v: 'Ejen',      bm: 'Ejen',      en: 'Agent' },
    { v: 'Lain-lain', bm: 'Lain-lain', en: 'Others' }
  ];

  function T(k) { var t = D.i18n[LANG] || D.i18n.bm; return t[k] != null ? t[k] : (D.i18n.bm[k] || k); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function money(n) { return 'RM' + Number(n).toLocaleString('en-MY'); }
  function el(id) { return document.getElementById(id); }

  /* ---------------- WhatsApp ---------------- */
  function waLink() {
    var digits = String(D.contact.whatsapp).replace(/\D/g, '');
    var msg = LANG === 'bm'
      ? 'Salam Mr Tanah, saya berminat dengan Residensi Armani Putra di Dengkil. Boleh saya dapatkan maklumat lanjut?'
      : 'Hi Mr Tanah, I am interested in Residensi Armani Putra in Dengkil. Could I get more information?';
    return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(msg);
  }
  function bindContacts() {
    var a = document.querySelectorAll('.contact');
    for (var i = 0; i < a.length; i++) {
      a[i].href = waLink();
      a[i].target = '_blank';
      a[i].rel = 'noopener noreferrer';
    }
    var cd = document.querySelectorAll('.contact-display');
    for (var j = 0; j < cd.length; j++) cd[j].textContent = D.contact.whatsappDisplay;
    var ml = el('map-link'); if (ml) ml.href = D.mapUrl;
  }

  /* ---------------- i18n ---------------- */
  function applyLang(lang) {
    LANG = lang;
    try { localStorage.setItem('armani-lang', lang); } catch (e) {}
    var t = D.i18n[lang] || D.i18n.bm;
    document.documentElement.lang = t.htmlLang || (lang === 'bm' ? 'ms-MY' : 'en-MY');
    // Halaman butiran guna tajuk sendiri
    document.title = (document.body.getAttribute('data-page') === 'project' && t.dTitle) ? t.dTitle : t.title;
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t.metaDesc);

    document.querySelectorAll('[data-i18n]').forEach(function (n) {
      var k = n.getAttribute('data-i18n');
      if (t[k] != null) n.innerHTML = t[k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (n) {
      var k = n.getAttribute('data-i18n-ph'); if (t[k] != null) n.setAttribute('placeholder', t[k]);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (n) {
      var k = n.getAttribute('data-i18n-aria'); if (t[k] != null) n.setAttribute('aria-label', t[k]);
    });
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    document.querySelectorAll('.lang').forEach(function (g) {
      g.setAttribute('aria-label', t.langLabel || 'Language');
    });

    renderStats(); renderFacts(); renderTypes(); renderLayouts(); renderFacilities();
    renderTours();
    renderPermit(); renderFaq(); renderSelects(); renderUnits(); bindContacts();
  }

  /* ---------------- Lawatan maya 360° (ZENTRA VR3D) ---------------- */
  function tourUrl(id) { return D.tourBase + encodeURIComponent(id); }

  function renderTours() {
    var box = el('tour-cards');
    if (!box || !D.tours) return;
    box.innerHTML = D.tours.map(function (t) {
      var c = t[LANG] || t.en;
      return '<article class="tour-card">' +
        '<span class="badge-360">360°</span>' +
        '<img src="' + esc(t.img) + '" alt="' + esc(c.label) + '" loading="lazy" width="1600" height="1000">' +
        '<div class="card-copy">' +
          '<span class="eyebrow">' + esc(T('vrCredit').replace(/\.$/, '')) + '</span>' +
          '<h3>' + esc(c.label) + '</h3>' +
          '<p>' + esc(c.desc) + '</p>' +
          '<a class="btn ghost-dark" data-tour="' + esc(t.id) + '" href="' + esc(tourUrl(t.id)) + '" target="_blank" rel="noopener noreferrer">' + esc(T('vrCardBtn')) + '</a>' +
        '</div></article>';
    }).join('');
  }

  /* ---------------- Stats (hero) ---------------- */
  function renderStats() {
    var box = el('stats'); if (!box) return;
    var rows = [
      [T('statLoc'), 'Dengkil'],
      [T('statType'), LANG === 'bm' ? 'SOHO & Servis Apt' : 'SOHO & Serviced Apt'],
      [T('statRange'), '450 – 1,000 kps']
    ];
    box.innerHTML = rows.map(function (r) {
      return '<div><b>' + esc(r[1]) + '</b>' + esc(r[0]) + '</div>';
    }).join('');
  }

  /* ---------------- Facts ---------------- */
  function renderFacts() {
    var box = el('facts'); if (!box) return;
    box.innerHTML = D.facts.map(function (f) {
      var label = T('fact' + f.k.charAt(0).toUpperCase() + f.k.slice(1));
      return '<div><dt>' + esc(label) + '</dt><dd>' + esc(f.v[LANG] || f.v.bm) + '</dd></div>';
    }).join('');
  }

  /* ---------------- Kad jenis unit ---------------- */
  function typeCard(t) {
    var price = t.hargaMin === t.hargaMax ? money(t.hargaMin) : money(t.hargaMin) + ' – ' + money(t.hargaMax);
    var tag = t.mampu ? '<span class="tag-mampu">' + esc(T('typeMampu')) + '</span>' : '';
    return '' +
      '<article class="type-card">' +
        '<div class="plan"><img src="' + t.plan + '" alt="' + esc(T('planAlt').replace('{name}', t.label)) +
          '" loading="lazy" data-plan="' + t.plan + '" data-plan-label="' + esc(t.label) + '"></div>' +
        '<div class="body">' +
          '<h3>' + esc(t.label) + tag + '</h3>' +
          '<p class="meta">' + esc(t.segmen) + '</p>' +
          '<p class="meta">' + esc(t.bilik) + '</p>' +
          '<p class="meta">' + esc(t.kps) + ' ' + esc(T('typeKps')) + ' · ' + esc(t.kereta) + ' ' + esc(T('typeCar')) + '</p>' +
          '<p class="price"><small>' + esc(T('typePrice')) + '</small>' + esc(price) + '</p>' +
        '</div>' +
      '</article>';
  }
  function renderTypes() {
    var box = el('type-cards'); if (!box) return;
    box.innerHTML = D.types.map(typeCard).join('');
    bindPlanZoom(box);
  }

  /* ---------------- Laman butiran: kad susun atur ---------------- */
  function layoutCard(t) {
    var price = t.hargaMin === t.hargaMax ? money(t.hargaMin) : money(t.hargaMin) + ' – ' + money(t.hargaMax);
    var tag = t.mampu ? '<span class="tag-mampu">' + esc(T('typeMampu')) + '</span>' : '';
    var wa = waLinkFor(t.label);
    return '' +
      '<article class="layout-card">' +
        '<div class="plan"><img src="' + t.plan + '" alt="' + esc(T('planAlt').replace('{name}', t.label)) +
          '" loading="lazy" data-plan="' + t.plan + '" data-plan-label="' + esc(t.label) + '"></div>' +
        '<div class="layout-body">' +
          '<div class="head"><h3>' + esc(t.label) + tag + '</h3></div>' +
          '<p>' + esc(t.segmen) + ' · ' + esc(t.bilik) + '</p>' +
          '<div class="layout-spec">' +
            '<div><b>' + esc(t.kps) + '</b>' + esc(T('typeKps')) + '</div>' +
            '<div><b>' + esc(t.kereta) + '</b>' + esc(T('typeCar')) + '</div>' +
            '<div><b>' + esc(String(t.unit)) + '</b>' + esc(T('typeUnits')) + '</div>' +
            '<div><b>' + esc(price) + '</b>' + esc(T('typePrice')) + '</div>' +
          '</div>' +
          '<div class="layout-actions">' +
            '<a class="btn primary" href="' + wa + '" target="_blank" rel="noopener noreferrer">' +
              esc(T('typeEnquire')) + ' ↗</a>' +
          '</div>' +
        '</div>' +
      '</article>';
  }
  function renderLayouts() {
    var box = el('layout-grid'); if (!box) return;
    box.innerHTML = D.types.map(layoutCard).join('');
    bindPlanZoom(box);
  }
  function waLinkFor(label) {
    var digits = String(D.contact.whatsapp).replace(/\D/g, '');
    var msg = LANG === 'bm'
      ? 'Salam Mr Tanah, saya berminat dengan ' + label + ' di Residensi Armani Putra. Boleh saya dapatkan maklumat lanjut?'
      : 'Hi Mr Tanah, I am interested in ' + label + ' at Residensi Armani Putra. Could I get more information?';
    return 'https://wa.me/' + digits + '?text=' + encodeURIComponent(msg);
  }

  /* ---------------- Kemudahan ---------------- */
  function renderFacilities() {
    var box = el('fac-list'); if (!box) return;
    box.innerHTML = D.facilities.map(function (f) {
      return '<li style="margin-bottom:9px">• ' + esc(f[LANG] || f.bm) + '</li>';
    }).join('');
  }

  /* ---------------- Lesen & permit ---------------- */
  function renderPermit() {
    var box = el('permit-cards'); if (!box) return;
    var p = D.permit;
    var rows = [
      [T('permitDev'), p.pemaju, T('permitSsm') + ': ' + p.ssm],
      [T('permitDl'), p.noLesenPemaju, p.lesenMula + ' – ' + p.lesenTamat + ' (' + T('permitValid') + ')'],
      [T('permitAp'), p.noPermitIklan, p.permitMula + ' – ' + p.permitTamat + ' (' + T('permitValid') + ')'],
      [T('permitPbt'), p.pbt, ''],
      [T('permitSpa'), p.spajadual, ''],
      [T('permitStatus'), p.status, '']
    ];
    box.innerHTML = rows.map(function (r) {
      return '<div class="permit-card"><dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) +
             (r[2] ? '<small>' + esc(r[2]) + '</small>' : '') + '</dd></div>';
    }).join('');
  }

  /* ---------------- FAQ ---------------- */
  function renderFaq() {
    var box = el('faq-list'); if (!box) return;
    var out = [];
    for (var i = 1; i <= 6; i++) {
      var q = T('faqQ' + i), a = T('faqA' + i);
      if (!q || q === 'faqQ' + i) continue;
      out.push('<details><summary>' + esc(q) + '</summary><p>' + a + '</p></details>');
    }
    box.innerHTML = out.join('');
  }

  /* ---------------- Borang: negeri / sumber / unit ---------------- */
  function renderSelects() {
    var n = el('lf-negeri');
    if (n) {
      var cur = n.value;
      n.innerHTML = '<option value="">' + esc(T('fPilih')) + '</option>' +
        NEGERI.map(function (x) { return '<option value="' + esc(x) + '">' + esc(x) + '</option>'; }).join('');
      n.value = cur;
    }
    var s = el('lf-sumber');
    if (s) {
      var cur2 = s.value;
      s.innerHTML = '<option value="">' + esc(T('fPilih')) + '</option>' +
        SUMBER.map(function (x) {
          return '<option value="' + esc(x.v) + '">' + esc(x[LANG] || x.bm) + '</option>';
        }).join('');
      s.value = cur2;
    }
  }
  function renderUnits() {
    var box = el('lf-units'); if (!box) return;
    var checked = {};
    box.querySelectorAll('input:checked').forEach(function (i) { checked[i.value] = true; });
    var opts = D.types.map(function (t) {
      return { v: t.label, bm: t.label + ' (' + t.kps + ' kps)', en: t.label + ' (' + t.kps + ' sq ft)' };
    });
    opts.push({ v: 'Belum pasti', bm: 'Belum pasti', en: 'Not sure yet' });
    box.innerHTML = opts.map(function (o) {
      return '<label class="u"><input type="checkbox" name="unit" value="' + esc(o.v) + '"' +
             (checked[o.v] ? ' checked' : '') + '><span>' + esc(o[LANG] || o.bm) + '</span></label>';
    }).join('');
  }

  /* ---------------- Lightbox pelan ---------------- */
  function bindPlanZoom(scope) {
    (scope || document).querySelectorAll('img[data-plan]').forEach(function (img) {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', function () {
        var dlg = el('plan-dialog'); if (!dlg || !dlg.showModal) return;
        var pi = el('plan-img');
        pi.src = img.getAttribute('data-plan');
        pi.alt = img.getAttribute('data-plan-label') || '';
        var ext = el('plan-external');
        if (ext) ext.href = img.getAttribute('data-plan');
        dlg.showModal();
      });
    });
  }
  function setupPlanDialog() {
    var dlg = el('plan-dialog'); if (!dlg) return;
    var c = dlg.querySelector('.close');
    if (c) c.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  }

  /* ---------------- Dialog lawatan maya 360° ---------------- */
  function setupTourDialog() {
    var dlg = el('tour-dialog'); if (!dlg || !D.tours) return;
    var frame = dlg.querySelector('.frame');
    var sw = dlg.querySelector('.tour-switch');

    function selectTour(id) {
      var t = (D.tours || []).filter(function (x) { return x.id === id; })[0];
      if (!t) return;
      var c = t[LANG] || t.en;
      var h = el('tour-title'); if (h) h.textContent = c.label;
      if (frame) {
        var ifr = document.createElement('iframe');
        ifr.title = c.label;
        ifr.src = tourUrl(id);
        ifr.allow = 'fullscreen; gyroscope; accelerometer; xr-spatial-tracking';
        ifr.allowFullscreen = true;
        ifr.referrerPolicy = 'strict-origin-when-cross-origin';
        frame.replaceChildren(ifr);
      }
      var ext = el('tour-external'); if (ext) ext.href = tourUrl(id);
      dlg.querySelectorAll('.tour-switch button').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-id') === id));
      });
    }

    if (sw) {
      sw.innerHTML = D.tours.map(function (t) {
        var c = t[LANG] || t.en;
        return '<button type="button" data-id="' + esc(t.id) + '" aria-pressed="false">' + esc(c.label) + '</button>';
      }).join('');
      sw.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-id]'); if (b) selectTour(b.getAttribute('data-id'));
      });
    }

    // Klik kad tour -> buka dialog (fallback: pautan biasa jika <dialog> tak disokong)
    document.addEventListener('click', function (e) {
      var a = e.target.closest('[data-tour]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (typeof dlg.showModal !== 'function') return;
      e.preventDefault();
      selectTour(a.getAttribute('data-tour'));
      dlg.showModal();
    });

    var c = dlg.querySelector('.close');
    if (c) c.addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { if (frame) frame.replaceChildren(); });
  }

  /* ---------------- Borang: hantar ---------------- */
  function setupForm() {
    var form = el('leadForm'); if (!form) return;
    var status = el('lf-status');

    function setErr(name, msg) {
      var f = form.querySelector('[data-err="' + name + '"]');
      var box = f ? f.closest('.field') : null;
      if (f) f.textContent = msg || '';
      if (box) box.classList.toggle('invalid', !!msg);
    }
    function clearErrs() {
      ['nama','wa','emel','consent'].forEach(function (n) { setErr(n, ''); });
    }
    function validWa(v) {
      var d = String(v).replace(/\D/g, '');
      return d.length >= 9 && d.length <= 13;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrs();
      var ok = true;
      if (!form.nama.value.trim()) { setErr('nama', T('fErrNama')); ok = false; }
      if (!validWa(form.wa.value)) { setErr('wa', T('fErrWa')); ok = false; }
      if (form.emel.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.emel.value.trim())) {
        setErr('emel', T('fErrEmel')); ok = false;
      }
      if (!form.consent.checked) { setErr('consent', T('fErrConsent')); ok = false; }
      if (!ok) { status.className = 'form-status bad show'; status.textContent = ''; return; }

      if (form.website && form.website.value) return;  // honeypot

      var units = [];
      form.querySelectorAll('input[name="unit"]:checked').forEach(function (i) { units.push(i.value); });

      var payload = {
        form: D.formKey || 'armani',
        nama: form.nama.value.trim(),
        wa: form.wa.value.trim(),
        emel: form.emel.value.trim(),
        negeri: form.negeri.value,
        unit: units.join(', '),
        sumber: form.sumber.value,
        consent: form.consent.checked,
        marketing: form.marketing.checked,
        website: form.website ? form.website.value : '',   // honeypot
        ua: navigator.userAgent,
        page: location.pathname,
        lang: LANG
      };

      var btn = form.querySelector('.submit');
      btn.disabled = true;
      var old = btn.innerHTML;
      btn.innerHTML = T('fHantarSekarang');

      fetch(D.formEndpoint, {
        method: 'POST',
        mode: 'cors',
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // elak preflight CORS
        body: JSON.stringify(payload)
      })
        .then(function (r) { return r.json(); })
        .then(function (j) {
          if (j && j.ok) {
            status.className = 'form-status ok show';
            status.innerHTML = T('fOk').replace('{ref}', j.ref || '') + '<br><small>' + T('fOkSub') + '</small>';
            form.reset(); renderUnits();
          } else {
            status.className = 'form-status bad show';
            status.textContent = (j && j.error) || T('fBad');
          }
        })
        .catch(function () {
          status.className = 'form-status bad show';
          status.textContent = T('fFail');
        })
        .then(function () { btn.disabled = false; btn.innerHTML = old; });
    });
  }

  /* ---------------- Nav mobil + reveal ---------------- */
  function setupNav() {
    var btn = document.querySelector('.menu-btn');
    var nav = document.querySelector('.header nav');
    if (btn && nav) {
      btn.addEventListener('click', function () {
        var open = nav.classList.toggle('open');
        btn.setAttribute('aria-expanded', String(open));
      });
      nav.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
        });
      });
    }
    var hdr = document.querySelector('.header');
    if (hdr) {
      var onScroll = function () { hdr.classList.toggle('scrolled', window.scrollY > 8); };
      window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    }
  }
  function setupReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (!('IntersectionObserver' in window)) {
      items.forEach(function (n) { n.classList.add('in'); }); return;
    }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    items.forEach(function (n) { io.observe(n); });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    document.querySelectorAll('.lang button').forEach(function (b) {
      b.addEventListener('click', function () { applyLang(b.getAttribute('data-lang')); });
    });
    applyLang(LANG);
    setupNav(); setupReveal(); setupPlanDialog(); setupTourDialog(); setupForm();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
