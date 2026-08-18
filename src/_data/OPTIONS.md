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
