/* ════════════════════════════════════════════════════════════════
   render.js — turns the content/*.js data into the page
   ----------------------------------------------------------------
   each page includes only the data file(s) it needs, then this file.
   rendering is driven by which container elements exist on the page,
   so you never edit this file to add content — only content/*.js.
   ════════════════════════════════════════════════════════════════ */

(function () {
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  const hueColor = {
    candle: 'var(--candle)', rose: 'var(--rose)',
    lavender: 'var(--lavender)', moon: 'var(--moonlight)'
  };

  /* ── home: featured journal entry ───────────────────────────── */
  function renderFeatured(el) {
    const list = window.JOURNAL || [];
    if (!list.length) { el.innerHTML = '<p class="empty">the first entry is yet to be written.</p>'; return; }
    const f = list.find((p) => p.featured) || list[0];
    const link = f.href ? esc(f.href) : 'journal.html';
    el.innerHTML = `
      <article class="card featured">
        <div class="kicker">tonight's entry</div>
        <h2>${esc(f.title)}</h2>
        <div class="meta">${esc(f.date)}${f.mood ? ' · feeling ' + esc(f.mood) : ''}</div>
        <p class="excerpt"${f.hand ? ' style="font-family:var(--script);font-size:1.35rem;line-height:1.5;"' : ''}>${esc(f.excerpt)}</p>
        <a class="link more" href="${link}">read on the journal &rarr;</a>
      </article>`;
  }

  /* ── home: a few recent titles ──────────────────────────────── */
  function renderRecent(el) {
    const list = (window.JOURNAL || []).slice(0, 4);
    if (!list.length) { el.innerHTML = '<p class="empty">no entries yet.</p>'; return; }
    el.innerHTML = list.map((p) => `
      <a class="note-card" href="${p.href ? esc(p.href) : 'journal.html'}" style="text-decoration:none;display:block;">
        <span class="date">${esc(p.date)}</span>
        <h3 style="margin:0.2rem 0;">${esc(p.title)}</h3>
        <span class="muted" style="font-size:0.95rem;">${esc(p.mood ? 'feeling ' + p.mood : '')}</span>
      </a>`).join('');
  }

  /* ── journal: full list of note cards ───────────────────────── */
  function renderJournal(el) {
    const list = window.JOURNAL || [];
    if (!list.length) { el.innerHTML = '<p class="empty">the journal is waiting for its first whisper.</p>'; return; }
    el.innerHTML = list.map((p) => {
      const tags = (p.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
      const title = p.href
        ? `<a href="${esc(p.href)}">${esc(p.title)}</a>`
        : esc(p.title);
      const body = p.hand
        ? `<p class="hand">${esc(p.excerpt)}</p>`
        : `<p class="excerpt">${esc(p.excerpt)}</p>`;
      return `
        <article class="note-card">
          ${p.mood ? `<span class="mood"><span class="dot"></span>${esc(p.mood)}</span>` : ''}
          <span class="date">${esc(p.date)}</span>
          <h3>${title}</h3>
          ${body}
          ${tags ? `<div class="tags">${tags}</div>` : ''}
        </article>`;
    }).join('');
  }

  /* ── memory garden: little taped keepsakes ──────────────────── */
  function renderMemories(el) {
    const list = window.MEMORIES || [];
    if (!list.length) { el.innerHTML = '<p class="empty">no memories planted yet.</p>'; return; }
    const draw = window.doodle || ((n) => '');
    el.innerHTML = list.map((m, i) => {
      const name = m.doodle || m.glyph || 'star';
      return `
        <button class="memory" data-memory
          data-doodle="${esc(name)}" data-title="${esc(m.title)}"
          data-when="${esc(m.when)}" data-body="${esc(m.body)}"
          aria-label="open memory: ${esc(m.title)}">
          <span class="bloom" style="--ps:${(4 + (i % 5)).toFixed(1)}s;">${draw(name)}</span>
          <span class="label">${esc(m.title)}</span>
          <span class="when">${esc(m.when)}</span>
        </button>`;
    }).join('');
    if (window.Heavenly) window.Heavenly.initMemoryModal();
  }

  /* ── music room: shelves of records + embeds ────────────────── */
  function renderMusic(el) {
    const data = window.MUSIC || { shelves: [], embeds: [] };
    let html = '';
    (data.shelves || []).forEach((shelf) => {
      const records = (shelf.records || []).map((r) => {
        const inner = `
          <div class="disc" aria-hidden="true"></div>
          <div class="title">${esc(r.title)}</div>
          <div class="artist">${esc(r.artist)}</div>`;
        return `<div class="record">${
          r.url && r.url !== '#'
            ? `<a href="${esc(r.url)}" target="_blank" rel="noopener">${inner}</a>`
            : inner
        }</div>`;
      }).join('');
      html += `
        <section class="shelf">
          <div class="shelf-label">${esc(shelf.label)}</div>
          <div class="records">${records}</div>
        </section>`;
    });
    // embeds are raw author-provided iframe markup (trusted), inserted as-is
    if ((data.embeds || []).length) {
      html += '<div class="embeds">';
      data.embeds.forEach((e) => {
        html += `<div><div class="shelf-label" style="font-size:1.2rem;">${esc(e.title || '')}</div>${e.html || ''}</div>`;
      });
      html += '</div>';
    }
    el.innerHTML = html || '<p class="empty">the record player is quiet for now.</p>';
  }

  /* ── gallery: soft photographs ──────────────────────────────── */
  function renderGallery(el) {
    const list = window.PHOTOS || [];
    if (!list.length) { el.innerHTML = '<p class="empty">no photographs hung yet.</p>'; return; }
    el.innerHTML = list.map((ph) => {
      const inner = ph.src
        ? `<img src="${esc(ph.src)}" alt="${esc(ph.caption || '')}" loading="lazy">`
        : `<div class="ph" style="background:${esc(ph.gradient || 'var(--paper-navy)')};" role="img" aria-label="${esc(ph.caption || 'photograph')}"></div>`;
      return `
        <figure data-lightbox>
          ${inner}
          ${ph.caption ? `<figcaption>${esc(ph.caption)}</figcaption>` : ''}
        </figure>`;
    }).join('');
    if (window.Heavenly) window.Heavenly.initLightbox();
  }

  /* ── about: profile + favorite things ───────────────────────── */
  function renderProfile(el) {
    const p = window.PROFILE;
    if (!p) return;
    const intro = (p.intro || []).map((t) => `<p>${esc(t)}</p>`).join('');
    const bio = (p.bio || []).map((b) =>
      `<div class="bio-row"><span class="bio-k">${esc(b.label)}</span><span class="bio-v">${esc(b.value)}</span></div>`).join('');
    const bioCard = bio
      ? `<div class="bio-card">${bio}<div class="bio-foot">your webmaster for today</div></div>`
      : '';
    const favs = (p.favorites || []).map((f) => `
      <div class="fav">
        <h4>${esc(f.title)}</h4>
        <ul>${(f.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </div>`).join('');
    el.innerHTML = `
      <div class="profile">
        <div class="avatar" aria-hidden="true">${(window.doodle || (() => ''))(p.doodle || 'moon')}</div>
        <div>
          <h1 class="page-title" style="margin:0;">${esc(p.name)}</h1>
          ${p.pronouns ? `<div class="muted script" style="font-size:1.3rem;">${esc(p.pronouns)}</div>` : ''}
        </div>
      </div>
      ${bioCard}
      <div class="prose" style="margin-top:1.6rem;">${intro}</div>
      <div class="divider-star" aria-hidden="true"></div>
      <h2 class="section-title center">a few of my favorite things</h2>
      <div class="favorites">${favs}</div>`;
  }

  /* ── guestbook: seeded notes + visitor notes (localStorage) ──── */
  const GB_KEY = 'heavenly_guestbook';

  function loadVisitorNotes() {
    try { return JSON.parse(localStorage.getItem(GB_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveVisitorNotes(notes) {
    try { localStorage.setItem(GB_KEY, JSON.stringify(notes)); } catch (e) {}
  }

  function paintGuestbook(listEl) {
    const seed = window.GUESTBOOK_SEED || [];
    const mine = loadVisitorNotes();
    const all = mine.concat(seed); // visitor notes newest, on top
    if (!all.length) { listEl.innerHTML = '<p class="empty">no notes yet — be the first kind voice.</p>'; return; }
    listEl.innerHTML = all.map((n) => `
      <div class="gb-note">
        <span class="who">${esc(n.who || 'anonymous')}</span><span class="when">${esc(n.when || '')}</span>
        <p class="msg">${esc(n.msg)}</p>
      </div>`).join('');
  }

  function initGuestbook(root) {
    const form = root.querySelector('#gb-form');
    const listEl = root.querySelector('#gb-entries');
    if (listEl) paintGuestbook(listEl);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const who = form.elements['who'].value.trim() || 'anonymous';
      const msg = form.elements['msg'].value.trim();
      if (!msg) return;
      const when = new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      const notes = loadVisitorNotes();
      notes.unshift({ who, msg, when });
      saveVisitorNotes(notes);
      form.reset();
      paintGuestbook(listEl);
      const note = root.querySelector('#gb-saved');
      if (note) { note.hidden = false; setTimeout(() => { note.hidden = true; }, 4000); }
    });
  }

  /* ── dispatch by which containers exist ─────────────────────── */
  function run() {
    const map = {
      '#featured-entry': renderFeatured,
      '#recent-entries': renderRecent,
      '#journal-list': renderJournal,
      '#garden-field': renderMemories,
      '#music-room': renderMusic,
      '#gallery': renderGallery,
      '#profile-area': renderProfile,
    };
    Object.keys(map).forEach((sel) => {
      const el = document.querySelector(sel);
      if (el) map[sel](el);
    });
    const gb = document.querySelector('#guestbook');
    if (gb) initGuestbook(gb);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
