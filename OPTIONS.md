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

The bar draws one tick per decade, with every sixth one taller. That isn't a
setting: on a logarithmic rule the ticks *are* the decades, and any other
number would be decoration that lies about the spacing.

### entries — post lists

| Option | Default | What it does |
| --- | --- | --- |
| `showSummaries` | `true` | Summary line under each title in section lists. `false` = tighter, more index-like. |
| `showFeed` | `true` | Advertises the Atom feed to RSS readers. |

### motion

| Option | Default | What it does |
| --- | --- | --- |
| `enabled` | `true` | All animation. `false` kills it globally. (Visitors who set "reduce motion" in their OS already get this automatically.) |

## Addresses

Every post and review lives under its section:

    /bench/fixing-the-z2/
    /stage/sonic-the-hedgehog-2020/
    /topics/olympus/

The date at the front of a filename orders the folder and is dropped from the
address. Two entries in the same section can't share a name — the build stops
and tells you, rather than quietly overwriting one with the other.

`src/redirects.njk` keeps the addresses these pages used to have working. It
generates itself from the entries, so it stays correct as you publish more.

## Per-page front matter

Any single page can override things:

```yaml
---
hideNav: true      # no header on this page only
wide: true         # start at the top instead of vertically centring
current: bench     # which section to highlight in the nav
title: Something   # browser tab text
description: ...   # meta description
draft: true        # build it locally, leave it off the live site
---
```

## Colours

CMS → Settings → Site details → Theme, or the `theme` block in
`src/_data/site.json`. `base.njk` writes these into every page as CSS
variables. The values at the top of `src/style.css` are the fallbacks: clear a
field and the CSS value takes over, so a blank is never a broken page.

| Setting | Now | Notes |
| --- | --- | --- |
| Background — darkest | `#0C080E` | Bottom of the page gradient. |
| Background — mid | `#160E1B` | Middle of the gradient. |
| Background — lightest | `#2A1730` | Top — the glow behind the masthead. |
| Raised | `#3A2142` | Major tick marks, inactive dots. |
| Text — primary | `#EFE7F1` | Headings and body. |
| Text — muted | `#A594AC` | Captions and anything secondary. |
| Hairlines | `#402A48` | Borders and dividers. |
| Accent | `#C9A24E` | The ampersand, markers, buttons, links. Hover washes derive from it. |
| Off-scale accent | `#B98CE0` | The two zones past either end of the bar. |
| Max content width | `64rem` | Try `72rem` for wider. |

### Palette variants worth trying

Type these into the matching Theme fields, darkest background first.

**Colder, more instrument-like**
`#08090C` · `#101318` · `#1B2028` · hairlines `#2C333D` · accent `#7FA8C9`

**Deeper purple, warmer accent**
`#0A050D` · `#180C22` · `#331848` · hairlines `#4A2C63` · accent `#D98C5F`

**Near-monochrome, accent only where it matters**
`#0B0B0D` · `#141416` · `#1F1F23` · hairlines `#33333A` · accent `#C9A24E`

### Typography

Pick the display face in the CMS — see "Typography" further down. Each face in
`_data/fonts.json` carries its own Google Fonts query and variable-axis
settings, and `base.njk` requests only the one in use, so switching never
accumulates weight.

## Scale bar positions

Each section has an `at` value — just the exponent. `-6` puts it at 10⁻⁶ m.
No percentages, no arithmetic; the build converts it. CMS → Settings →
Sections → "Sits at 10^ … metres".

The scale figure shown in the section list ("10⁻⁶ m") is generated from the
same number, so the label can't drift out of sync with the marker.

### Reference points

| 10^ | What's there |
| --- | --- |
| -10 | An atom. Lattice spacing in a crystal. |
| -9 | Width of a DNA helix. |
| -8 | A virus. |
| -7 | Wavelength of visible light — the floor of optical microscopy. |
| -6 | A bacterium. Working range of a good objective. |
| -5 | A red blood cell. |
| -4 | Width of a human hair. |
| -3 | A grain of sand. A millimetre. |
| -2 | A fingernail. A microscope objective. |
| 0 | A person. A workbench. |
| 1 | A house. |
| 3 | A kilometre. |
| 4 | A small town. |
| 7 | The Earth (1.27 × 10⁷ m). |
| 9 | The Sun (1.39 × 10⁹ m). |
| 11 | One astronomical unit. |
| 16 | One light year (9.46 × 10¹⁵ m). |
| 21 | The Milky Way, end to end. |
| 23 | Galaxy clusters. |
| 26 | The observable universe. |

Markers closer than about **2 decades** apart will have their labels overlap
on the bar. The build warns you when this happens rather than leaving you to
notice it.

### The build check

Every build validates the scale bar and prints warnings to the terminal
(and to the Cloudflare build log). It catches:

- a section with no `at` value, or one outside the bar's range
- two markers close enough that their labels will collide
- bands that leave a gap, overlap each other, or don't reach either end

Warnings never fail the build — the site still deploys. They're there so you
find out from a message rather than from squinting at the page.

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
| Bodoni Moda | Classic didone. Hairlines thin out on dark — large sizes only. **Currently active.** |
| Playfair Display | Familiar and safe. Very widely used, which cuts both ways. |
| IBM Plex Serif | Matches body and mono exactly. Most unified, least contrast. |
| Josefin Slab | Geometric slab. Tall x-height, art-deco feel, a very different register. |

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

## Pictures

There is nothing to configure and nothing to remember. Write a plain image tag
or drop one in through the CMS, and the build makes resized copies in AVIF,
WebP and JPEG at 400, 800, 1200, 1600 and 2048 pixels wide, then hands the
browser the list to choose from.

The two numbers worth knowing about, both in `eleventy.config.js`:

| Setting | Now | What it does |
| --- | --- | --- |
| `widths` | 400–2048 | The sizes made for each picture. 2048 covers a high-density screen at full width; there's no point going past it while the text column is 64rem. |
| `sizes` | `100vw` under 64rem, else 64rem | What the browser is told about display size *before* the stylesheet loads, so it can choose properly. The stills in a review override this — they sit in narrower columns. |

Raising `widths` makes builds slower and the deploy larger without making
anything look better. Lowering it makes pictures soft on good screens.

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

Nothing is hidden at the moment. It's there for a section you've started but
aren't ready to show — the page works by direct link while you fill it.

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

## Off-scale zones

The bar measures things made of matter. Code and ideas aren't small or large —
they have no extent at all, so they sit *past* either end rather than anywhere
on the rule.

**Discrete** (left, past 10⁻¹⁰) is below resolution: code, simulation, formal
systems. Things made of symbols rather than stuff.

**Unbound** (right, past 10²⁶) is beyond bound: ideas, reading, philosophy.
Things that have no largest case because they have no size at all.

Assign a section to a zone in CMS → Settings → Sections → Position. Rename the
zones, change their captions, or turn them off entirely under Settings → Scale
bands and lens → Off-scale zones.

Everything about the zones says "not measured", and it's worth not undoing
any of it by accident:

- **No tick marks.** Graduations imply measurement.
- **Dashed baseline** rather than the ruled bar's solid one.
- **A break mark** (⁄⁄) where the axis stops. Without it the eye reads one
  continuous scale and quietly assumes code is about 10⁻¹¹ m.
- **Violet, not brass.** A neighbouring hue, so the zones read as related to
  the bar without being part of it.
- **Different pin shapes** — square on the left, triangle on the right,
  circles only on the ruled bar. Shape survives greyscale, small sizes and
  colourblindness in a way colour alone doesn't, so it carries the
  distinction on its own.
- **The lens never touches them.** Magnification applies to the measurable
  middle only; off-scale markers hold still.

On screens under 44rem the zones are hidden — they'd eat too much of a narrow
bar, and the section list below covers the same links.
