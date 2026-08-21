# greatandlittle.space

Eleventy + Sveltia CMS. Posts are markdown files in this repo; the CMS is a
web editor that writes them for you. No database, no server, no `git commit`
in your daily loop.

```
src/
  index.njk            homepage
  sections.njk         generates /bench/, /microscopy/, ... one per section
  feed.njk             the Atom feed
  style.css            all styling, heavily commented
  _data/
    site.json          title, tagline, footer text, colours
    sections.json      the sections and where they sit on the bar
    options.json       display switches (nav, motion, summaries)
    scale.json         the bar's range, size bands and lens
    rubric.json        the three review scoring axes
    fonts.json         the display faces offered in the CMS
  _includes/
    base.njk           the page shell (head, fonts, footer)
    scalebar.njk       the navigation, generated from sections.json
    post.njk           layout for one post
    review.njk         layout for one On Screen review (adds the scorecard)
  posts/               markdown, one file per post
  reviews/             markdown, one file per review
  admin/               the CMS
  uploads/             images added through the CMS
  404.njk              the not-found page
  robots.njk           robots.txt
  sitemap.njk          sitemap.xml
_site/                 generated output — never edit, never commit
```

## Setup, once

### 1. Local

```bash
npm install
npm start
```

Opens at <http://localhost:8080> and rebuilds as you save.

### 2. Push to GitHub

```bash
git init
git add .
git commit -m "Initial site"
gh repo create greatandlittle --public --source=. --push
```

### 3. Deploy on Cloudflare

Dashboard → **Add** (top right) → **Workers** → connect GitHub → pick the repo.

| Setting | Value |
| --- | --- |
| Build command | `npm run build` |
| Output directory | `_site` |

Then **Settings → Domains & Routes → Add** and enter `greatandlittle.space`.
DNS is created for you since the domain is already in your account.

### 4. Make the CMS login work

Sveltia needs a small OAuth worker so "Log in with GitHub" has somewhere to
go. Roughly ten minutes:

1. GitHub → Settings → Developer settings → **OAuth Apps** → New. Callback
   URL is your worker's URL plus `/callback` — you'll fill this in after
   step 2, so put a placeholder for now.
2. Deploy <https://github.com/sveltia/sveltia-cms-auth> as its own Worker.
   Set `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` as secrets on it.
3. Go back and set the real callback URL on the OAuth app.
4. In `src/admin/config.yml`, check `repo:` and `base_url:` — both are
   marked with `<-- change this`. `base_url` needs the full `https://…`.

Then visit `greatandlittle.space/admin/`.

## Writing

**Through the CMS.** Go to `/admin/`, log in, write, publish. It commits to
the repo and Cloudflare rebuilds within a minute. Works on your phone.

**Locally, without GitHub.** `local_backend: true` is set, so you can run
`npm start` and `npm run cms` in two terminals, then open
<http://localhost:8080/admin/> and edit files directly with nothing committed.
Good for trying things out.

**As plain markdown.** Nothing stops you writing a file by hand in
`src/posts/`. The front matter it needs:

```yaml
---
title: Fixing a Z2 that wouldn't light
date: 2026-08-20
section: bench        # must match a key in _data/sections.json
summary: One line, shown under the title and in the section list.
---
```

A review in `src/reviews/` takes the same plus the scorecard:

```yaml
---
title: The Andromeda Strain
date: 2026-08-20
year: 1971
instrument: Zeiss Ultraphot II
summary: Unusually good, which is the surprise.
scores:
  instrument: 9
  usage: 8
  plausibility: 6
---
```

The overall figure is the mean of the axes in `_data/rubric.json`, computed
at build time. Don't write it by hand.

## Common changes

**Colours.** CMS → Settings → Site details → Theme, or the `theme` block in
`_data/site.json`. The values at the top of `src/style.css` are the fallbacks
used when a field is blank. The accent is `brass`; the hover wash is derived
from it, so there's nothing to keep in sync by hand.

**Move a marker on the scale bar.** Edit its `at` in `_data/sections.json`, or
use the CMS under Settings → Sections. `at` is just the exponent — `-6` means
10⁻⁶ m — and the build does the arithmetic. Markers closer than about two
decades apart will have their labels collide; the build warns you when that
happens.

**Add a section.** Add an entry to `_data/sections.json` (or through the CMS).
The marker, the homepage row, the section page at `/yourkey/` and the Section
dropdown when writing a post all follow automatically — the dropdown reads
`sections.json` directly, so there's no second list to keep up to date.

**Footer text, tagline, scale-bar captions.** `_data/site.json`, or CMS →
Settings → Site details.

## The simulation embed

Any section with **Show the simulation embed** ticked can carry a frame and two
buttons above its post list. All three are driven by URLs on the section
itself — CMS → Settings → Sections, or `embedUrl` / `downloadUrl` /
`sourceUrl` in `_data/sections.json`.

Leave one blank and it isn't rendered. That's deliberate: an unfinished
section shows nothing rather than a placeholder box or a button that goes
nowhere. Fill `embedUrl` in and the CSS sizes the frame for you.

## Things worth not breaking

- **The section list under the scale bar is the real navigation.** The bar
  needs hover, which phones don't have and screen readers don't do.
- **`prefers-reduced-motion`** at the end of `style.css` turns off animation
  for people who get motion sick. Keep it last so it wins.
- **`_site/` is generated.** It's gitignored. Editing files in there does
  nothing — the next build overwrites them.
- **Every setting has one home.** Colours in `site.json`, display switches in
  `options.json`, the bar in `scale.json`. When a setting exists in two places
  they drift apart, and the one you edit is never the one being read.
- **Sveltia is pinned** to a specific version in `src/admin/index.html`
  rather than floating on `@latest`, so an upstream release can't change the
  editor without warning. It's in beta and moves fast; bump it on purpose.
