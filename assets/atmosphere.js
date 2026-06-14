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
  footer: 'kept softly, by candlelight',
};

/* honor the visitor's motion preference */
const REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // a handful of warm floating candle-lights
  const orbCount = REDUCE_MOTION ? 0 : 7;
  for (let i = 0; i < orbCount; i++) {
    const o = document.createElement('span');
    o.className = 'orb';
    const size = Math.random() * 90 + 40;
    o.style.width = o.style.height = size + 'px';
    o.style.left = Math.random() * 95 + '%';
    o.style.top = Math.random() * 95 + '%';
    o.style.setProperty('--fl', (Math.random() * 16 + 16).toFixed(1) + 's');
    o.style.animationDelay = (Math.random() * 8).toFixed(1) + 's';
    field.appendChild(o);
  }
  frag.appendChild(field);

  document.body.prepend(frag);
}

/* ── 2. shared header + footer ────────────────────────────────── */
function buildChrome() {
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const header = document.querySelector('[data-chrome="header"]');
  if (header) {
    const links = SITE.nav.map((n) => {
      const current = n.href.toLowerCase() === here || (here === '' && n.href === 'index.html');
      return `<a href="${n.href}"${current ? ' aria-current="page"' : ''}>${n.label}</a>`;
    }).join('');
    header.innerHTML = `
      <a class="brand" href="index.html">${SITE.name} <span class="heart" aria-hidden="true">♥</span></a>
      <div class="tagline">${SITE.tagline}</div>
      <nav class="nav" aria-label="primary">${links}</nav>`;
  }

  const footer = document.querySelector('[data-chrome="footer"]');
  if (footer) {
    const year = new Date().getFullYear();
    footer.innerHTML = `
      <div class="divider-star" aria-hidden="true"></div>
      <p>${SITE.footer} <span class="heart" aria-hidden="true">♥</span></p>
      <p class="muted" style="font-size:0.85rem;margin-top:0.4rem;">
        ${SITE.name} · ${year} · <a href="guestbook.html">leave a note</a>
      </p>`;
  }
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
    panel.querySelector('.glyph').textContent = btn.dataset.glyph || '✦';
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
  // if a page has static (non-rendered) lightbox/memory elements, these
  // still wire them up; render.js re-calls them after dynamic injection.
  initLightbox();
  initMemoryModal();
});
