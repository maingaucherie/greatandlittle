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
