# Naz's Farm House — Website

A plain static site (HTML/CSS/JS, no build step) — 4 pages: Home, Rooms & Gallery, Events, Book/Contact.

## What's here

```
index.html    Home
rooms.html    Rooms & Gallery
events.html   Events & Functions
book.html     Book / Contact (calendar, inquiry form, map)
css/style.css All styling
js/main.js    Mobile nav, sticky mobile CTA, calendar, form handling
images/       Photos + logo (currently working stills pulled from your videos — see note below)
data/blocked-dates.json   Manually-edited list of booked dates for the calendar
```

## 1. Photo quality — read this first

The current photos are frames pulled from your WhatsApp videos, lightly sharpened to help clarity, but they're a placeholder standard — good enough to launch with, not as crisp as real stills. When you get proper photos taken (even just phone photos in good light, not video frames), replace the files in `images/` with the same filenames and everything updates automatically. Landscape/portrait orientation of the current images is preserved in the CSS (object-fit: cover), so new photos don't need to match exact dimensions — just aim for decent resolution (1200px+ on the long edge).

## 2. Inquiry form — already connected

The form on `book.html` is wired up to your real Formspree account (`https://formspree.io/f/xqpzwnze`), which forwards submissions to `nazs.farmhouse1@gmail.com`. Nothing more to do here — it's live.

Submitting the form doesn't redirect visitors away to Formspree's site: `js/main.js` sends it in the background and shows an inline "Thanks — your inquiry is in…" message (or a clear error message) right on the page.

If you ever need to change where submissions go, log in at [formspree.io](https://formspree.io) and update the notification email on the form — no code changes needed. Their free plan covers a generous number of submissions per month, plenty for an inquiry form like this.

## 3. Update the availability calendar

Edit `data/blocked-dates.json` — add or remove dates in `YYYY-MM-DD` format as bookings come in and go out:

```json
{
  "blockedDates": ["2026-09-05", "2026-09-06", "2026-09-12"]
}
```

The calendar on the Book/Contact page reads this file automatically. Note: this only works when the site is served over http/https (i.e. once deployed, or run locally through a simple server) — opening the HTML file directly by double-clicking it won't load the calendar data, because browsers block that kind of local file loading for security reasons. This is normal and won't be an issue once it's live on GitHub Pages.

## 4. Rates

Rates aren't published anywhere on the site yet (shown as "available on request") since these hadn't been decided at time of build. Once you have a number, it's easy to add — just let me know and I'll drop it into the relevant pages.

## 5. Deploying (GitHub Pages + your Namecheap domain)

1. Create a GitHub repo and push everything in this folder to it, with `index.html` at the root of the `main` branch.
2. In the repo: Settings → Pages → set Source to "Deploy from a branch," branch `main`, folder `/ (root)`.
3. Still in Settings → Pages, enter `nazsfarmhouse.in` under Custom domain and save (this adds a `CNAME` file to the repo).
4. In Namecheap: open the domain → Advanced DNS → remove any existing parking/redirect records, then add:
   - Four **A records**, host `@`, pointing to: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME record**, host `www`, pointing to `<your-github-username>.github.io`
5. Wait for DNS to propagate (minutes to a few hours), then go back to GitHub Pages settings and turn on "Enforce HTTPS."

## 6. Airbnb / Booking.com

Not linked yet since there are no live listings. Once you have them, the natural place to add buttons is the Book/Contact page, alongside the inquiry form.

## 7. Instagram

Linked already in the footer of every page and on Book/Contact (`instagram.com/nazs_farm_house_`).
