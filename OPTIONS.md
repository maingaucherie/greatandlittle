# Knobs

Everything here is a value you can change without touching a template.

## src/_data/options.json — behaviour

Edit the file directly, or through the CMS once you add it there.

### nav — the compact scale bar header

| Option | Default | What it does |
| --- | --- | --- |
| `show` | `true` | The header on every page. `false` removes it site-wide. |
| `showOnHome` | `false` | Also show it on the homepage, above the full-size bar. Slightly redundant, but try it. |
| `showLabels` | `true` | Section names under the dots. `false` = dots only, very minimal. |
| `sticky` | `true` | Header follows you as you scroll. `false` = scrolls away. |
| `markCurrent` | `true` | The section you're in is filled brass with its label always visible. |

### home — the front page

| Option | Default | What it does |
| --- | --- | --- |
| `showEyebrow` | `false` | The small `greatandlittle.space` line above the title. |
| `showRailCaptions` | `true` | The "10⁻¹⁰ m — the lattice" captions under the big bar. |
| `tickCount` | `18` | Number of tick marks. Try 36 for one per decade, or 9 for sparse. |
| `majorEvery` | `3` | Every Nth tick is drawn taller. |

### entries — post lists

| Option | Default | What it does |
| --- | --- | --- |
| `showSummaries` | `true` | Summary line under each title in section lists. `false` = tighter, more index-like. |
| `showFeed` | `true` | Advertises the Atom feed to RSS readers. |

### motion

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | All animation. `false` kills it globally. (Visitors who set "reduce motion" in their OS already get this automatically.) |

## Per-page front matter

Any single page can override things:

```yaml
---
hideNav: true      # no header on this page only
wide: true         # start at the top instead of vertically centring
current: optics    # which section to highlight in the nav
title: Something   # browser tab text
description: ...   # meta description
---
```

## src/style.css — appearance

Top of the file, under `:root`. Change once, applies everywhere.

| Token | Now | Notes |
| --- | --- | --- |
| `--pitch` | `#0C080E` | Bottom of the page gradient. |
| `--ground` | `#160E1B` | Middle of the gradient. |
| `--aubergine` | `#2A1730` | Top — the glow behind the masthead. |
| `--brass` | `#C9A24E` | The accent. Change `--brass-wash` to match (same colour at 9%). |
| `--ink` / `--ink-soft` | | Text, full strength and muted. |
| `--rule` | `#402A48` | Hairlines and borders. |
| `--measure` | `64rem` | Content width. Try `72rem` for wider. |

### Palette variants worth trying

Paste over the existing values.

**Colder, more instrument-like**
```css
--pitch:#08090C; --ground:#101318; --aubergine:#1B2028;
--rule:#2C333D; --brass:#7FA8C9; --brass-wash:rgba(127,168,201,0.09);
```

**Deeper purple, warmer accent**
```css
--pitch:#0A050D; --ground:#180C22; --aubergine:#331848;
--rule:#4A2C63; --brass:#D98C5F; --brass-wash:rgba(217,140,95,0.09);
```

**Near-monochrome, accent only where it matters**
```css
--pitch:#0B0B0D; --ground:#141416; --aubergine:#1F1F23;
--rule:#33333A; --brass:#C9A24E; --brass-wash:rgba(201,162,78,0.09);
```

### Typography

Two places must agree: the Google Fonts `<link>` in `src/_includes/base.njk`,
and the `font-family` rules in `style.css`. Display faces that hold up on a
dark background and aren't Fraunces: **Newsreader**, **Instrument Serif**,
**Young Serif**, **Bodoni Moda** (only at large sizes — its hairlines vanish
when small).

Fraunces has variable axes you can tune without changing the font:

```css
font-variation-settings:"SOFT" 0,"WONK" 1,"opsz" 96;
```

`SOFT` 0–100 rounds the corners. `WONK` 0 or 1 toggles the odd angled
terminals — that's most of the character. `opsz` should roughly match the
size the text is displayed at.

## Scale bar positions

In `_data/sections.json`, or CMS → Settings → Sections. For 10^N metres:

    x = (N + 10) / 36 × 100

Markers closer than ~6% apart collide on hover. The formula and the bar's
range are the only fixed things; everything else about a section is editable.

## Typography — now in the CMS

Settings → Appearance → Typography.

**Display face** changes the wordmark, section names and headings. Body and
label faces stay as IBM Plex — they do unglamorous work well and swapping them
usually makes things worse.

| Face | Character |
| --- | --- |
| Fraunces | Quirky, angled terminals. The original choice. |
| Newsreader | Editorial and calm. Reads as publication rather than personality. |
| Instrument Serif | High contrast, elegant, a little fashionable. |
| Young Serif | Chunky and confident. Much heavier presence. |
| Spectral | Quiet and bookish. Makes the site feel like a journal. |
| Bodoni Moda | Classic didone. Hairlines thin out on dark — large sizes only. |
| Playfair Display | Familiar and safe. Very widely used, which cuts both ways. |
| IBM Plex Serif | Matches body and mono exactly. Most unified, least contrast. |

**Heading size** is a multiplier, 0.7 to 1.4. Different faces read larger or
smaller at the same point size, so a face you like but find overbearing may
just need 0.9.

Only the chosen font is downloaded — switching doesn't accumulate weight.

### Adding a face that isn't listed

Add an entry to `src/_data/fonts.json`:

```json
"Crimson Pro": {
  "query": "Crimson+Pro:wght@400;500",
  "stack": "'Crimson Pro', Georgia, serif",
  "axes": "",
  "note": "..."
}
```

`query` is the part after `family=` in a Google Fonts URL. Then add the name
to the `options:` list under `display` in `src/admin/config.yml` so it shows
up in the dropdown.

## Favicons

Three designs are in `src/icons/`. `src/favicon.svg` is the live one — copy
whichever you prefer over it.

| File | Design |
| --- | --- |
| `favicon-marker.svg` | A rail with one brass marker standing on it. The site's navigation reduced to its smallest unit. **Currently active.** |
| `favicon-amp.svg` | The italic ampersand from the wordmark. |
| `favicon-scale.svg` | One small filled dot and one large open circle on a shared rail — great and little, in the least possible ink. |

To swap: copy the file you want to `src/favicon.svg`, commit, push.

SVG favicons work in every current browser. For older ones and for the iOS
home screen you also want `favicon.ico` and `apple-touch-icon.png` at
`src/`. Upload your chosen SVG to realfavicongenerator.net or favicon.io,
download the pack, and drop those two files into `src/`. The `<link>` tags
are already in `base.njk` waiting for them — until then they 404 harmlessly.

## Hiding a section

Each section has a `hidden` flag — CMS → Settings → Sections → "Hide from
navigation".

When hidden, a section disappears from the scale bar and the homepage list,
but its page still builds at its usual URL and every post in it stays live.
Direct links keep working; only the navigation forgets about it. The section
page shows "· unlisted" next to its scale figure so you can tell.

Currently hidden: Optics, Overhead, The Void. Unhide any of them the moment
you have something to put there.

## Series and topics

Two different ways to organise, both optional.

**Series** groups posts under a heading on their section page. Give several
posts the same series value — "Lamp restoration" — and they collect together
in order, with the loose posts falling below. Best for a project that spans
multiple posts.

**Topics** are free-form tags. Each one gets a page at `/topics/name/`
listing everything tagged with it, across both posts and reviews. Best for
threads that cut across sections — "Olympus" might appear on a repair post
and a media review.

Both are fields in the CMS. Note the field is `topics`, not `tags` — Eleventy
uses `tags` internally for collections, so using it here would break things.

## Review rubric

CMS → Settings → Review rubric. You can reword the axis labels and the score
bars update everywhere at once.

Don't change a `key` on an existing axis — that's what links a label to the
numbers already stored in your reviews. Adding a fourth axis is safe; existing
reviews will show a dash for it until you go back and score them.

## The scale bar lens

CMS → Settings → Scale bands and lens.

Hovering the bar magnifies the region under your pointer — ticks, section
markers and size bands all warp together, because they're all positioned by
the same function. Two numbers control it:

| Setting | Default | What it does |
| --- | --- | --- |
| Lens width | 1.5 decades | How far the magnification spreads. Small is a tight loupe with sharp compression at its edges; large is a gentle swell across most of the bar. |
| Strength | 1.5× | Peak magnification. Total bar width is fixed, so more magnification here means more compression everywhere else. |
| Marker grab distance | 44px | How close the pointer gets before a section marker locks the lens in place so the link holds still. Set to 0 to disable. |
| Lens on | true | Off gives a plain linear bar. |

Try 4 decades at 2.5× for something much more dramatic, or 8 at 1.2× for a
barely-there swell.

Visitors who've set "reduce motion" in their OS get the plain linear bar
automatically — no setting needed. So does anyone with JavaScript off. Every
link works identically in all three cases.

### Size domains

The bands beneath the bar. Each has a name, a start and end exponent, and a
brightness from 0.05 to 1.

Bands must be **contiguous** — each one's `from` should equal the previous
one's `to`, and together they should span the whole bar. Gaps render as
blank space; overlaps stack.

Two practical notes. Keep names short, since a label only appears when its
band is wide enough to hold it — the lens is what gives narrow bands room,
so a long name is readable when magnified and hidden otherwise. And
brightness currently peaks at human scale and falls off toward both ends,
which encodes the site's whole premise: you're in the middle, and the great
and the little recede in both directions.
