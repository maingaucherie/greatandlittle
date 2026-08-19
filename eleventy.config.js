// ============================================================================
// Eleventy configuration
//
// Eleventy reads everything in src/, runs it through templates, and writes
// finished HTML into _site/. That _site folder is what gets deployed.
//
// You should rarely need to touch this file. Day-to-day work happens in:
//   src/_data/sections.json   the sections and where they sit on the scale bar
//   src/_includes/*.njk       the page templates (your design lives here)
//   src/posts/  src/reviews/  the actual content, as markdown files
// ============================================================================

export default function (eleventyConfig) {

  // --- Static files -------------------------------------------------------
  // Copy these straight through without processing. Anything in src/uploads
  // (images added via the CMS) and the stylesheet land in _site untouched.
  eleventyConfig.addPassthroughCopy("src/style.css");
  eleventyConfig.addPassthroughCopy("src/uploads");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Favicons and any other root-level files (favicon.svg, favicon.ico,
  // apple-touch-icon.png, robots.txt) copied straight to the site root.
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");

  // --- Collections --------------------------------------------------------
  // A "collection" is just a named list of content Eleventy builds for you.

  // Every post, newest first.
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").reverse()
  );

  // Every On Screen review, newest first. Kept separate from posts because
  // reviews carry scores and posts don't.
  eleventyConfig.addCollection("reviews", (api) =>
    api.getFilteredByGlob("src/reviews/*.md").reverse()
  );

  // Every distinct topic across posts and reviews, with its entries.
  // Drives the /topics/<name>/ pages.
  eleventyConfig.addCollection("topics", (api) => {
    const all = api.getFilteredByGlob(["src/posts/*.md", "src/reviews/*.md"]);
    const map = new Map();
    for (const item of all) {
      for (const t of item.data.topics || []) {
        const key = String(t).trim();
        if (!key) continue;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
      }
    }
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([name, entries]) => ({
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        entries: entries.reverse(),
        count: entries.length,
      }));
  });

  // --- Filters ------------------------------------------------------------
  // Filters are small functions you can use inside templates with a pipe:
  //   {{ post.date | readableDate }}

  // 17 August 2026
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric",
    })
  );

  // 2026-08-17 — for the <time datetime="..."> attribute
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  // The key of whichever section is flagged as holding reviews. Everything
  // that used to hardcode "onscreen" asks for this instead, so renaming the
  // section is a single edit in _data/sections.json.
  eleventyConfig.addFilter("reviewSection", function (list) {
    var match = (list || []).filter(function (s) { return s.reviews; })[0];
    return match ? match.key : "";
  });

  // --- Scale bar positioning ---------------------------------------------
  // Sections are placed by exponent ("at": -5 means 10⁻⁵ m). Everything
  // below converts that to the percentage the CSS actually needs, so the
  // arithmetic lives here instead of in your head.

  // Exponent -> percentage along the bar.
  eleventyConfig.addFilter("atToPercent", function (at, low, high) {
    var n = Number(at);
    if (!isFinite(n)) return "0%";
    return (((n - low) / (high - low)) * 100).toFixed(3) + "%";
  });

  // Exponent -> a display label like "10⁻⁵ m", so the figure shown in the
  // section list can't drift out of sync with the marker's actual position.
  eleventyConfig.addFilter("expLabel", function (at) {
    var n = Number(at);
    if (!isFinite(n)) return "";
    var map = { "-": "\u207B", "0": "\u2070", "1": "\u00B9", "2": "\u00B2",
                "3": "\u00B3", "4": "\u2074", "5": "\u2075", "6": "\u2076",
                "7": "\u2077", "8": "\u2078", "9": "\u2079", ".": "\u00B7" };
    var sup = String(n).split("").map(function (c) { return map[c] || c; }).join("");
    return "10" + sup + " m";
  });

  // Sections belonging to one off-scale zone ("discrete" or "unbound"),
  // or — with no argument — the ones that sit on the ruled bar itself.
  eleventyConfig.addFilter("inZone", (list, zone) =>
    (list || []).filter((s) => (s.zone || "") === (zone || ""))
  );

  // Only the sections that aren't hidden. Used for navigation; hidden
  // sections still get their page built, they just aren't linked to.
  eleventyConfig.addFilter("visible", (list) =>
    (list || []).filter((s) => !s.hidden)
  );

  // Group a list of posts by their "series" value. Returns
  // [{ name, posts }, ...] with unseried posts collected under "".
  eleventyConfig.addFilter("bySeries", (posts) => {
    const groups = new Map();
    for (const p of posts || []) {
      const key = p.data.series || "";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(p);
    }
    // Named series first, alphabetical; loose posts last.
    return [...groups.entries()]
      .sort((a, b) => (a[0] === "" ? 1 : b[0] === "" ? -1 : a[0].localeCompare(b[0])))
      .map(([name, posts]) => ({ name, posts }));
  });

  // Return only the posts belonging to one section, e.g. posts | inSection("optics")
  eleventyConfig.addFilter("inSection", (posts, key) =>
    (posts || []).filter((p) => p.data.section === key)
  );

  // Turn a section key into its display name: "optics" -> "Optics".
  // Used by post.njk for the back link. Reads _data/sections.json.
  eleventyConfig.addFilter("sectionName", function (key) {
    const list = this.ctx?.sections?.list || [];
    const match = list.find((s) => s.key === key);
    return match ? match.name : "Great & Little";
  });

  // Average of the three review scores, to one decimal place.
  eleventyConfig.addFilter("meanScore", (scores) => {
    if (!scores) return "—";
    const vals = [scores.instrument, scores.usage, scores.plausibility]
      .filter((n) => typeof n === "number");
    if (!vals.length) return "—";
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
  });

  // --- Build-time sanity check on the scale bar --------------------------
  // Runs once per build and prints warnings rather than failing. Catches the
  // things that are annoying to spot by eye: markers off the end of the bar,
  // markers too close together to click, and bands with gaps or overlaps.
  eleventyConfig.on("eleventy.before", async () => {
    const fs = await import("node:fs/promises");
    const read = async (f) => JSON.parse(await fs.readFile(f, "utf8"));
    let sections, scale;
    try {
      sections = await read("src/_data/sections.json");
      scale = await read("src/_data/scale.json");
    } catch { return; }

    const { low, high } = scale;
    const span = high - low;
    const warn = (m) => console.warn("[scale] " + m);

    // Markers that sit on the ruled bar.
    const onBar = (sections.list || [])
      .filter((s) => !s.zone && !s.hidden && typeof s.at === "number")
      .sort((a, b) => a.at - b.at);

    for (const s of sections.list || []) {
      if (s.zone || s.hidden) continue;
      if (typeof s.at !== "number") {
        warn(`"${s.key}" has no "at" value — it will sit at the far left.`);
      } else if (s.at < low || s.at > high) {
        warn(`"${s.key}" is at 10^${s.at}, outside the bar (10^${low} to 10^${high}).`);
      }
    }

    // Labels collide below roughly 6% of the bar's width.
    const MIN = span * 0.06;
    for (let i = 1; i < onBar.length; i++) {
      const a = onBar[i - 1], b = onBar[i];
      const gap = b.at - a.at;
      if (gap < MIN) {
        warn(`"${a.key}" (10^${a.at}) and "${b.key}" (10^${b.at}) are ${gap.toFixed(1)} decades apart — labels may overlap. About ${MIN.toFixed(1)} is comfortable.`);
      }
    }

    // Bands should tile the whole bar with no gaps or overlaps.
    const bands = (scale.bands || []).slice().sort((a, b) => a.from - b.from);
    if (bands.length) {
      if (bands[0].from !== low) warn(`First band starts at 10^${bands[0].from}, but the bar starts at 10^${low}.`);
      const last = bands[bands.length - 1];
      if (last.to !== high) warn(`Last band ends at 10^${last.to}, but the bar ends at 10^${high}.`);
      for (let i = 1; i < bands.length; i++) {
        const prev = bands[i - 1], cur = bands[i];
        if (cur.from > prev.to) warn(`Gap between "${prev.name}" and "${cur.name}" (10^${prev.to} to 10^${cur.from}).`);
        if (cur.from < prev.to) warn(`"${prev.name}" and "${cur.name}" overlap between 10^${cur.from} and 10^${prev.to}.`);
      }
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data",
    },
    // Markdown files get processed by Nunjucks first, so you can use
    // template syntax inside a post if you ever need to.
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
