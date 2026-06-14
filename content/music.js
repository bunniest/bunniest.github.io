/* ════════════════════════════════════════════════════════════════
   MUSIC ROOM  ·  favorite songs as records on shelves + embedded players
   ----------------------------------------------------------------
   SHELVES — each shelf has a label and a row of records:
     { title: "song or album", artist: "who made it", url: "https://..." }
   the url can point to bandcamp, spotify, youtube, anywhere.

   EMBEDS — paste raw embed code (an <iframe>) from bandcamp / spotify /
   youtube. it will be dropped onto the page exactly as written, so only
   paste code from players you trust.
   ════════════════════════════════════════════════════════════════ */

window.MUSIC = {
  shelves: [
    {
      label: "songs for the midnight hour",
      records: [
        { title: "love is heavenly", artist: "the band that started this", url: "https://bandcamp.com" },
        { title: "slow dance, no one watching", artist: "placeholder", url: "#" },
        { title: "porchlight", artist: "placeholder", url: "#" },
        { title: "moon in the rearview", artist: "placeholder", url: "#" }
      ]
    },
    {
      label: "warm & nostalgic",
      records: [
        { title: "old radio static", artist: "placeholder", url: "#" },
        { title: "the blue hour", artist: "placeholder", url: "#" },
        { title: "letters unsent", artist: "placeholder", url: "#" }
      ]
    },
    {
      label: "for crying gently",
      records: [
        { title: "we were heaven", artist: "placeholder", url: "#" },
        { title: "last song before sleep", artist: "placeholder", url: "#" }
      ]
    }
  ],

  // paste real <iframe> embeds here. left empty by default so nothing
  // broken shows. example (bandcamp):
  // { title: "now spinning", html: '<iframe style="border:0;width:100%;height:120px;" src="https://bandcamp.com/EmbeddedPlayer/album=XXXX/" seamless></iframe>' }
  embeds: []
};
