# tending the sanctuary — a little guide

*love is heavenly* is a hand-built static website: just HTML, CSS, and a
little JavaScript. there's no build step and nothing to install. to change
what the site says, you only ever edit the small files in the **`content/`**
folder. everything else takes care of itself.

If you can edit a text file and push to GitHub, you can keep this place alive.

---

## the shape of things

```
index.html        home — welcome + featured entry + recent notes
journal.html      the journal
garden.html       memory garden
music.html        music room
gallery.html      photographs
about.html        about / profile
guestbook.html    guestbook

content/          ← THE ONLY FOLDER YOU NORMALLY EDIT
  journal.js        journal entries
  memories.js       memory-garden blooms
  music.js          records on the shelves + embedded players
  photos.js         the photo album
  profile.js        your about page + favorite things
  guestbook.js      the "always shown" guestbook notes

assets/
  heavenly.css      all the styling (colors live at the very top)
  atmosphere.js     the moonlight, stars, nav, lightbox (rarely touched)
  render.js         turns content/*.js into pages (don't need to edit)
```

Each content file begins with a comment explaining exactly what to do.
Newest items always go at the **top** of their list.

---

## adding a journal entry

Open `content/journal.js` and copy one entry block:

```js
{
  title:   "a letter to the quiet hour",
  date:    "june 14, 2026",
  mood:    "tender",
  tags:    ["midnight", "longing"],
  featured: true,      // optional — shows on the home page (use on ONE entry)
  hand:    true,       // optional — shows the excerpt in handwriting
  excerpt: "a few lines that hold the feeling...",
  // href: "posts/your-slug.html"   // optional — link to a full post page
},
```

Save, commit, push. That's it.

> Want a full long-form post? Make an HTML page (anywhere, e.g. a `posts/`
> folder), then add `href: "posts/your-slug.html"` to the entry so its title
> links there.

## adding a memory (a glowing bloom)

`content/memories.js`:

```js
{
  glyph: "🌙",                      // the light it shows
  title: "the moon followed us home",
  when:  "a warm night, long ago",
  body:  "the memory itself, written like a whisper.",
  hue:   "moon"                     // candle | rose | lavender | moon
},
```

## adding music

`content/music.js`. Records live on labelled shelves:

```js
{ title: "love is heavenly", artist: "the band", url: "https://bandcamp.com/..." }
```

For a real **embedded player**, copy the `<iframe>` embed code from Bandcamp,
Spotify, or YouTube and add it to the `embeds` list:

```js
embeds: [
  { title: "now spinning",
    html: '<iframe style="border:0;width:100%;height:120px;" src="https://bandcamp.com/EmbeddedPlayer/album=123456/" seamless></iframe>' }
]
```

> Only paste embed code from players you trust — it's inserted exactly as written.

## adding photos

1. Drop your image into the **`photos/`** folder.
2. In `content/photos.js`, add:

```js
{ src: "photos/your-photo.jpg", caption: "a soft caption" }
```

No photo yet? Leave a dreamy gradient placeholder instead:

```js
{ gradient: "linear-gradient(160deg, #1d2238, #3a2f4f)", caption: "the moon, half-drawn" }
```

## editing the about page

Everything is in `content/profile.js` — your name, a few paragraphs, and
groups of favorite things. Change the `avatar` to any emoji you like.

---

## the guestbook

Notes a visitor leaves are saved **in their own browser** (a gentle demo —
they won't see each other's notes). The notes in `content/guestbook.js` are
the ones that always show.

To collect notes **everyone can see**, point the form at a free service:

1. Make a form at [Formspree](https://formspree.io) (free tier is fine).
2. In `guestbook.html`, change the opening form tag to:
   ```html
   <form id="gb-form" class="gb-form card" action="https://formspree.io/f/yourid" method="POST">
   ```
3. Add `name="message"` to the textarea if Formspree asks for it.

Submissions then arrive in your inbox, and you can copy the loveliest ones
into `content/guestbook.js` by hand.

---

## changing the look

- **Colors:** the top of `assets/heavenly.css` (the `:root` block) holds every
  color — charcoal, navy, candlelight, moonlight, rose, lavender. Change a few
  values and the whole mood shifts.
- **Site name, tagline, navigation, footer:** the `SITE` object at the top of
  `assets/atmosphere.js`.
- **Fonts:** swapped via the Google Fonts `<link>` in each page's `<head>` and
  the `--serif` / `--body` / `--script` variables in the CSS.

---

## seeing it locally

Just open `index.html` in a browser. For the cleanest result (so the fonts and
scripts load exactly as online), run a tiny local server:

```bash
python3 -m http.server
# then visit http://localhost:8000
```

## publishing

This repo is set up as a GitHub Pages site. Commit and push to your published
branch and the changes go live within a minute or two.

*keep it soft. ♥*
