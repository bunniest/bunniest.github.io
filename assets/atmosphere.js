/* ════════════════════════════════════════════════════════════════
   atmosphere.js — the moonlight, the stars, the shared chrome
   ----------------------------------------------------------------
   • injects the layered background (sky, mist, grain, starfield)
   • scatters twinkling stars + floating candle-lights
   • builds the shared header/nav + footer so they live in ONE place
   • provides a soft lightbox (photos) and keepsake modal (memories)

   you almost never need to touch this file. to change the navigation
   or footer, edit the SITE config object just below.
   ════════════════════════════════════════════════════════════════ */

const SITE = {
  name: 'love is heavenly',
  tagline: 'a midnight sanctuary',
  // navigation — { href, label }. edit here to change every page at once.
  nav: [
    { href: 'index.html',     label: 'home' },
    { href: 'journal.html',   label: 'journal' },
    { href: 'garden.html',    label: 'memory garden' },
    { href: 'music.html',     label: 'music room' },
    { href: 'gallery.html',   label: 'photographs' },
    { href: 'about.html',     label: 'about' },
    { href: 'guestbook.html', label: 'guestbook' },
  ],
  footer: 'kept softly, by moonlight',
};

/* honor the visitor's motion preference */
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── hand-drawn doodles (little wobbly SVGs, not stock emoji) ──── */
const DOODLES = {
  star:    '<svg viewBox="0 0 24 24"><path d="M12 2.6l2.7 6.3 6.8.5-5.2 4.3 1.7 6.6L12 16.6 6 20.3l1.7-6.6L2.5 9.4l6.8-.5z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>',
  sparkle: '<svg viewBox="0 0 24 24"><path d="M12 1.5c.6 5.4 1.7 8.4 9 9.5-7.3 1.1-8.4 4.1-9 9.5-.6-5.4-1.7-8.4-9-9.5 7.3-1.1 8.4-4.1 9-9.5z" fill="currentColor"/></svg>',
  moon:    '<svg viewBox="0 0 24 24"><path d="M17 3a9 9 0 1 0 4.5 13A7.2 7.2 0 0 1 17 3z" fill="currentColor"/><circle cx="8.6" cy="8" r="0.9" fill="#0a0c15"/></svg>',
  heart:   '<svg viewBox="0 0 24 24"><path d="M12 20.6S3.5 14.6 3.5 8.9A4.4 4.4 0 0 1 12 7a4.4 4.4 0 0 1 8.5 1.9C20.5 14.6 12 20.6 12 20.6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  flower:  '<svg viewBox="0 0 24 24"><g fill="currentColor"><circle cx="12" cy="5" r="2.7"/><circle cx="18.6" cy="9.6" r="2.7"/><circle cx="16" cy="17.6" r="2.7"/><circle cx="8" cy="17.6" r="2.7"/><circle cx="5.4" cy="9.6" r="2.7"/></g><circle cx="12" cy="11.6" r="3" fill="#cad6f2"/></svg>',
  leaf:    '<svg viewBox="0 0 24 24"><path d="M12 3C6 8 6 17 12 21c6-4 6-13 0-18z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 6v12" stroke="currentColor" stroke-width="1.3"/></svg>',
  letter:  '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="1" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M3.5 7l8.5 6.5L20.5 7" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
  flame:   '<svg viewBox="0 0 24 24"><path d="M12 2.5c3 4 6 6 6 10a6 6 0 0 1-12 0c0-2 1-3.6 2.6-5 .2 1.5.9 2.3 1.9 2.8C9.6 8 10 5.5 12 2.5z" fill="currentColor"/></svg>',
  tv:      '<svg viewBox="0 0 24 24"><rect x="3" y="8" width="18" height="11" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M8 8l4-4 4 4M9 22h6" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  bud:     '<svg viewBox="0 0 24 24"><path d="M12 21v-8M12 13c0-3.2-2.2-5.2-5.2-5.2C6.8 11 9 13 12 13zM12 11c0-3.2 2.2-5.2 5.2-5.2C17.2 9 15 11 12 11z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  bunny:   '<svg viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><path d="M9 9.5C7.6 6.6 7.2 3.2 8.5 2.8 9.8 2.4 10.6 5.4 10.8 8"/><path d="M15 9.5c1.4-2.9 1.8-6.3.5-6.7-1.3-.4-2.1 2.6-2.3 5.2"/><circle cx="12" cy="14.5" r="5.4"/></g><circle cx="10.1" cy="13.6" r="0.8" fill="currentColor"/><circle cx="13.9" cy="13.6" r="0.8" fill="currentColor"/><circle cx="12" cy="15.4" r="0.7" fill="#e6a6bf"/><path d="M12 16.1v1M10.7 17.4c.8.5 1.8.5 2.6 0" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
};

function doodle(name) {
  return '<span class="doodle" aria-hidden="true">' + (DOODLES[name] || DOODLES.star) + '</span>';
}
window.DOODLES = DOODLES;
window.doodle = doodle;

/* a wobbly hand-drawn underline, used beneath titles */
window.squiggle = function () {
  return '<span class="squiggle" aria-hidden="true"><svg viewBox="0 0 150 10" preserveAspectRatio="none"><path d="M2 6 Q14 1 26 6 T50 6 T74 6 T98 6 T122 6 T148 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></span>';
};

/* a little hand-drawn moon-and-stars vignette for the masthead */
const MASTHEAD_ART = `
  <svg class="masthead-art" viewBox="0 0 150 120" aria-hidden="true">
    <g stroke="#aebfe6" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.85">
      <path d="M28 26 v11 M22.5 31.5 h11"/>
      <path d="M60 16 v8 M56 20 h8"/>
      <path d="M20 64 v8 M16 68 h8"/>
      <path d="M44 92 v7 M40.5 95.5 h7"/>
    </g>
    <path d="M118 34 a33 33 0 1 0 0 58 a26 26 0 1 1 0 -58 z" fill="#cad6f2"/>
    <g stroke="#0a0c15" stroke-width="2.2" stroke-linecap="round" fill="none">
      <path d="M104 58 q3.5 3.5 7 0"/>
      <path d="M115 58 q3.5 3.5 7 0"/>
      <path d="M107 69 q6.5 5 13 0"/>
    </g>
    <path d="M96 86 q-1 6 6 7" stroke="#aebfe6" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
  </svg>`;

/* replace any <span data-doodle="name"> in static html with its svg */
function fillDoodles() {
  document.querySelectorAll('[data-doodle]').forEach((el) => {
    el.innerHTML = DOODLES[el.dataset.doodle] || DOODLES.star;
    el.classList.add('doodle');
    el.setAttribute('aria-hidden', 'true');
  });
}

/* ── 1. background atmosphere ─────────────────────────────────── */
function buildAtmosphere() {
  const frag = document.createDocumentFragment();

  ['sky', 'mist', 'grain'].forEach((cls) => {
    const d = document.createElement('div');
    d.className = cls;
    d.setAttribute('aria-hidden', 'true');
    frag.appendChild(d);
  });

  const field = document.createElement('div');
  field.className = 'starfield';
  field.setAttribute('aria-hidden', 'true');

  // gentle star scatter — fewer if motion is reduced
  const starCount = REDUCE_MOTION ? 40 : 90;
  for (let i = 0; i < starCount; i++) {
    const s = document.createElement('span');
    s.className = 'star';
    const size = Math.random() * 2.4 + 0.6;
    s.style.width = s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.setProperty('--tw', (Math.random() * 6 + 4).toFixed(1) + 's');
    s.style.animationDelay = (Math.random() * 6).toFixed(1) + 's';
    field.appendChild(s);
  }

  // a few faint hand-drawn stars, drifting quietly in the dark
  const big = ['star', 'sparkle', 'moon'];
  const bigCount = REDUCE_MOTION ? 3 : 5;
  for (let i = 0; i < bigCount; i++) {
    const d = document.createElement('span');
    d.className = 'doodle-star';
    const size = Math.random() * 12 + 11;
    d.style.width = d.style.height = size + 'px';
    d.style.left = Math.random() * 92 + '%';
    d.style.top = Math.random() * 92 + '%';
    d.style.setProperty('--tw', (Math.random() * 5 + 7).toFixed(1) + 's');
    d.style.animationDelay = (Math.random() * 6).toFixed(1) + 's';
    d.innerHTML = DOODLES[big[i % big.length]];
    field.appendChild(d);
  }
  frag.appendChild(field);

  document.body.prepend(frag);
}

/* current page filename, for marking the active nav link */
function currentPage() {
  return (location.pathname.split('/').pop() || 'index.html').toLowerCase();
}

/* ── 2. shared masthead + footer ──────────────────────────────── */
function buildChrome() {
  const here = currentPage();

  const header = document.querySelector('[data-chrome="header"]');
  if (header) {
    const links = SITE.nav.map((n) => {
      const current = n.href.toLowerCase() === here || (here === '' && n.href === 'index.html');
      return `<a href="${n.href}"${current ? ' aria-current="page"' : ''}>${n.label}</a>`;
    }).join('');
    header.innerHTML = `
      <div class="masthead-text">
        <a class="brand" href="index.html">${SITE.name}</a>
        ${window.squiggle()}
        <div class="tagline">${SITE.tagline} ${doodle('moon')}</div>
        <nav class="nav" aria-label="primary">${links}</nav>
      </div>
      ${MASTHEAD_ART}`;
  }
}

function buildFooter() {
  const footer = document.querySelector('[data-chrome="footer"]');
  if (!footer) return;
  const year = new Date().getFullYear();
  footer.innerHTML = `
    <div class="divider-star" aria-hidden="true"></div>
    <p class="sign">${SITE.footer} ${doodle('heart')}</p>
    <p class="muted" style="font-size:0.92rem;margin-top:0.4rem;">
      ${SITE.name} · ${year} · <a href="guestbook.html">leave a note</a>
    </p>`;
}

/* ── 3. soft lightbox for the gallery ─────────────────────────── */
function initLightbox() {
  const figures = document.querySelectorAll('[data-lightbox]:not([data-bound])');
  if (!figures.length) return;

  let box = document.querySelector('.lightbox');
  if (!box) {
    box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'photograph viewer');
    box.innerHTML = `
      <button class="close" aria-label="close">×</button>
      <div class="stage"></div>
      <div class="cap"></div>`;
    document.body.appendChild(box);
    box.querySelector('.close').addEventListener('click', () => box.classList.remove('open'));
    box.addEventListener('click', (e) => { if (e.target === box) box.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') box.classList.remove('open'); });
  }

  const stage = box.querySelector('.stage');
  const cap = box.querySelector('.cap');

  const open = (fig) => {
    const img = fig.querySelector('img');
    const ph = fig.querySelector('.ph');
    const caption = fig.querySelector('figcaption');
    stage.innerHTML = '';
    if (img) {
      const big = new Image();
      big.src = img.dataset.full || img.src;
      big.alt = img.alt || '';
      stage.appendChild(big);
    } else if (ph) {
      stage.appendChild(ph.cloneNode(true));
    }
    cap.textContent = caption ? caption.textContent : '';
    box.classList.add('open');
    box.querySelector('.close').focus();
  };

  figures.forEach((fig) => {
    fig.dataset.bound = '1';
    fig.setAttribute('tabindex', '0');
    fig.setAttribute('role', 'button');
    fig.addEventListener('click', () => open(fig));
    fig.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(fig); }
    });
  });
}

/* ── 4. keepsake modal for the memory garden ──────────────────── */
function initMemoryModal() {
  const blooms = document.querySelectorAll('[data-memory]:not([data-bound])');
  if (!blooms.length) return;

  let modal = document.querySelector('.modal');
  let panel;
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="panel">
        <div class="glyph" aria-hidden="true"></div>
        <h3></h3>
        <div class="when"></div>
        <div class="body"></div>
        <button class="close">close gently</button>
      </div>`;
    document.body.appendChild(modal);
    panel = modal.querySelector('.panel');
    panel.querySelector('.close').addEventListener('click', () => modal.classList.remove('open'));
    modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.classList.remove('open'); });
  } else {
    panel = modal.querySelector('.panel');
  }

  const open = (btn) => {
    panel.querySelector('.glyph').innerHTML = doodle(btn.dataset.doodle || 'star');
    panel.querySelector('h3').textContent = btn.dataset.title || '';
    panel.querySelector('.when').textContent = btn.dataset.when || '';
    panel.querySelector('.body').textContent = btn.dataset.body || '';
    modal.classList.add('open');
    panel.querySelector('.close').focus();
  };

  blooms.forEach((b) => {
    b.dataset.bound = '1';
    b.addEventListener('click', () => open(b));
  });
}

/* expose the interactive initializers so render.js can call them
   AFTER it has injected the dynamic blooms / photographs. */
window.Heavenly = { initLightbox, initMemoryModal };

/* ── boot ─────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildAtmosphere();
  buildChrome();
  buildFooter();
  fillDoodles();
  // if a page has static (non-rendered) lightbox/memory elements, these
  // still wire them up; render.js re-calls them after dynamic injection.
  initLightbox();
  initMemoryModal();
});
