/* ════════════════════════════════════════════════════════════════
   GUESTBOOK  ·  kind notes left by visitors
   ----------------------------------------------------------------
   These are the notes that always show (your "seeded" entries).
   Visitors can also leave notes through the form on the page — those
   are saved in their own browser (localStorage) as a gentle demo.

   To collect notes that everyone can see, connect the form to a free
   service like Formspree or a Google Form. See CONTENT.md for how.

   Seed entries look like:
     { who: "a name", when: "june 2026", msg: "a kind little note" }
   newest at the TOP.
   ════════════════════════════════════════════════════════════════ */

window.GUESTBOOK_SEED = [
  { who: "the moon", when: "every night", msg: "i'll keep the light on for whoever needs it." },
  { who: "a passing stranger", when: "june 2026", msg: "found this place by accident at 2am and felt less alone. thank you for keeping it soft." },
  { who: "you, maybe", when: "someday", msg: "this is a sample note. leave one of your own below — be kind, be tender, sign it however you like." }
];
