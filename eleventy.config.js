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

  // Favicons and the web app manifest, copied straight to the site root
  // where browsers expect to find them. (robots.txt and sitemap.xml aren't
  // here — they're generated, in src/robots.njk and src/sitemap.njk.)
  eleventyConfig.addPassthroughCopy("src/favicon.svg");
  eleventyConfig.addPassthroughCopy("src/favicon.ico");
  eleventyConfig.addPassthroughCopy("src/favicon-96x96.png");
  eleventyConfig.addPassthroughCopy("src/apple-touch-icon.png");
  eleventyConfig.addPassthroughCopy("src/site.webmanifest");
  eleventyConfig.addPassthroughCopy("src/web-app-manifest-192x192.png");
  eleventyConfig.addPassthroughCopy("src/web-app-manifest-512x512.png");

  // src/admin is copied verbatim just above. Without this line Eleventy would
  // also try to render admin/index.html as a template, writing the same file
  // twice and eating the CMS's own {{ }} syntax on the way through.
  eleventyConfig.ignores.add("src/admin/**");

  // --- Collections --------------------------------------------------------
  // A "collection" is just a named list of content Eleventy builds for you.

  // Where writing lives. Add a third kind of content one day — essays,
  // notes, whatever — and adding its folder here is most of the work.
  const WRITING = ["src/posts/*.md", "src/reviews/*.md"];

  // Every post, newest first.
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").reverse()
  );

  // Every On Screen review, newest first. Kept separate from posts because
  // reviews carry scores and posts don't.
  eleventyConfig.addCollection("reviews", (api) =>
    api.getFilteredByGlob("src/reviews/*.md").reverse()
  );

  // Both together, newest first. The feed and the sitemap want "everything
  // published" and don't care which kind of thing each item is.
  eleventyConfig.addCollection("everything", (api) =>
    api.getFilteredByGlob(WRITING).reverse()
  );

  // How a topic name becomes a URL: "Cafe Optics" -> "cafe-optics".
  // The collection below and the links in topiclist.njk both go through
  // this, so the page that gets built and the link pointing at it can't
  // disagree. Don't swap one of them for Eleventy's built-in `slug`.
  const topicSlug = (name) =>
    String(name)
      // Split accented letters into letter + accent, then drop the
      // accents, so "Café" slugs to "cafe" and not "caf".
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  eleventyConfig.addFilter("topicSlug", topicSlug);

  // Every distinct topic across everything written, with its entries.
  // Drives the /topics/<name>/ pages.
  eleventyConfig.addCollection("topics", (api) => {
    const all = api.getFilteredByGlob(WRITING);
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
        slug: topicSlug(name),
        entries: entries.reverse(),
        count: entries.length,
      }));
  });

  // --- Filters ------------------------------------------------------------
  // Filters are small functions you can use inside templates with a pipe:
  //   {{ post.date | readableDate }}

  // 17 August 2026. A date in front matter is read as midnight UTC, so
  // the timeZone matters: without it, a build machine west of Greenwich
  // prints the day before the one in the <time> attribute.
  eleventyConfig.addFilter("readableDate", (d) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
    })
  );

  // 2026-08-17 — for the <time datetime="..."> attribute
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));

  // The key of whichever section is ticked as "holds scored reviews".
  // Nothing hardcodes the name of that section, so renaming it — or moving
  // reviews somewhere else entirely — is one edit in _data/sections.json.
  eleventyConfig.addFilter("reviewSection", (list) => {
    const match = (list || []).find((s) => s.reviews);
    return match ? match.key : "";
  });

  // --- Scale bar positioning ---------------------------------------------
  // Sections are placed by exponent ("at": -5 means 10⁻⁵ m). Everything
  // below converts that to the percentage the CSS actually needs, so the
  // arithmetic lives here instead of in your head.

  // Exponent -> percentage along the bar.
  eleventyConfig.addFilter("atToPercent", (at, low, high) => {
    // Number(null) is 0, not NaN — without this guard a section with no "at"
    // lands silently on the 10^0 mark instead of the far left.
    if (at === null || at === undefined || at === "") return "0%";
    const n = Number(at);
    if (!isFinite(n)) return "0%";
    return (((n - low) / (high - low)) * 100).toFixed(3) + "%";
  });

  // Digits as superscripts, for writing 10^-5 as 10⁻⁵. The scale bar script
  // in scalebar.njk keeps its own copy — it runs in the browser and can't
  // reach in here.
  const SUPERSCRIPT = {
    "-": "⁻", "0": "⁰", "1": "¹", "2": "²",
    "3": "³", "4": "⁴", "5": "⁵", "6": "⁶",
    "7": "⁷", "8": "⁸", "9": "⁹", ".": "·",
  };

  // Exponent -> a display label like "10⁻⁵ m". Built from the same number
  // that positions the marker, so the label on the page and the place it
  // points at can't drift apart.
  eleventyConfig.addFilter("expLabel", (at) => {
    const n = Number(at);
    if (!isFinite(n)) return "";
    const digits = String(n).split("").map((c) => SUPERSCRIPT[c] || c).join("");
    return "10" + digits + " m";
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

  // Return only the posts belonging to one section, e.g. posts | inSection("bench")
  eleventyConfig.addFilter("inSection", (posts, key) =>
    (posts || []).filter((p) => p.data.section === key)
  );

  // Turn a section key into its display name: "bench" -> "The Bench".
  // Used by the back link on posts and reviews. Reads _data/sections.json.
  eleventyConfig.addFilter("sectionName", function (key) {
    const list = this.ctx?.sections?.list || [];
    const match = list.find((s) => s.key === key);
    return match ? match.name : this.ctx?.site?.title || "";
  });

  // "inkSoft" -> "--ink-soft". Lets base.njk turn the theme block in
  // site.json straight into CSS variables, so adding a colour there (and to
  // the CMS) needs no template edit.
  eleventyConfig.addFilter("cssVar", (name) =>
    "--" + String(name).replace(/[A-Z]/g, (c) => "-" + c.toLowerCase())
  );

  // Average of the review scores, to one decimal place. The axes come from
  // _data/rubric.json rather than being listed here, so adding a fourth axis
  // in the CMS actually changes the overall figure instead of being ignored.
  eleventyConfig.addFilter("meanScore", function (scores) {
    if (!scores) return "—";
    const axes = this.ctx?.rubric?.axes || [];
    const vals = axes
      .map((a) => scores[a.key])
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
