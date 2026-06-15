# making it yours

This is a deliberately simple, clean shell. It's quiet on purpose — the
character is supposed to come from **your** photos, graphics and words, not
from the code. Here's everything you can change, easiest first.

You only ever edit plain text files. No build step, nothing to install.

---

## the five-minute version

| What | Where |
|------|-------|
| Site name, tagline, navigation, footer | `assets/atmosphere.js` → the `SITE` object at the very top |
| **Banner image** across the top | `SITE.banner` (drop the file in `/images`) |
| **Background image** for the whole page | `SITE.background` |
| **Accent colour** (links, highlights) | `SITE.accent` |
| Colours / fonts overall | top of `assets/heavenly.css` (the `:root` block) |
| Journal entries | `content/journal.js` |
| Photos | `content/photos.js` (files go in `/photos`) |
| Memories | `content/memories.js` |
| Music | `content/music.js` |
| About / profile | `content/profile.js` |
| The "right now" note | `content/now.js` |
| Guestbook seed notes | `content/guestbook.js` |

---

## add a banner or background (this is what makes it feel real)

1. Put an image in the **`/images`** folder (a grainy film photo, a dusk shot,
   anything that's the vibe).
2. Open `assets/atmosphere.js` and set it in `SITE`:

```js
const SITE = {
  name: 'love is heavenly',
  tagline: 'a midnight sanctuary',
  banner: 'images/my-banner.jpg',        // shows across the top of every page
  background: 'images/dusk.jpg',          // soft, dark photo behind everything
  accent: '#aebfe6',                      // or your own colour
  ...
```

Leave any of them as `''` to skip it. The background is dimmed automatically so
text stays readable.

## add a journal entry

`content/journal.js` — copy one block, newest at the top:

```js
{
  title: "the title",
  date:  "june 15, 2026",
  mood:  "tender",                 // optional, one word
  tags:  ["midnight", "longing"],  // optional
  featured: true,                  // optional — shows on the home page (one entry)
  hand: true,                      // optional — handwritten style
  excerpt: "what the entry is about...",
  // href: "posts/your-slug.html"  // optional — link to a full post page
}
```

## add photos

1. Drop the image into **`/photos`**.
2. In `content/photos.js`:

```js
{ src: "photos/your-photo.jpg", caption: "a soft caption" }
```

## a profile picture

In `content/profile.js`, add `avatarImg: "images/me.jpg"` (or leave it out for
the simple drawn moon).

## graphics, stamps, gifs, dividers

Want the indie-web look? Save real graphics into `/images` and drop them into
any page's HTML wherever you like, e.g.:

```html
<img src="images/divider.gif" alt="">
```

---

## the guestbook

Notes visitors leave are saved in *their own* browser (a gentle demo). The notes
in `content/guestbook.js` always show. To collect notes everyone can see, point
the form at a free service like [Formspree](https://formspree.io): in
`guestbook.html`, change the form tag to
`<form ... action="https://formspree.io/f/yourid" method="POST">`.

---

## see it locally

Open `index.html`, or run a tiny server for the cleanest result:

```bash
python3 -m http.server
# visit http://localhost:8000
```

## publish

Commit and push — it's a GitHub Pages site and goes live in a minute or two.

*it's yours now. fill it with real things.*
