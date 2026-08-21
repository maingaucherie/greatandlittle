// ============================================================================
// The rules every piece of writing follows.
//
// Posts and reviews are different in the obvious ways — reviews carry scores,
// posts carry a series — but they agree on where they live, what wraps them,
// and when they're ready to be seen. That agreement lives here, so it can't
// drift between the two.
//
// Used by src/posts/posts.11tydata.js, src/reviews/reviews.11tydata.js and
// eleventy.config.js.
// ============================================================================

// Drafts show up while you're working and are left out of the published site.
// `npm start` runs Eleventy in "serve" mode; Cloudflare runs `npm run build`,
// which is "build". So a draft is visible at localhost:8080 and nowhere else.
const showDrafts = process.env.ELEVENTY_RUN_MODE !== "build";

// The key of whichever section is ticked "holds scored reviews" in
// _data/sections.json. Nothing anywhere hardcodes the name of that section.
export const reviewSectionKey = (list) =>
  ((list || []).find((s) => s.reviews) || {}).key || "";

// The shared settings. Pass the layout that wraps this kind of writing and
// the collection it joins; a third kind of content one day needs a data file
// of three lines and nothing else.
export function entryDefaults({ layout, tag }) {
  return {
    layout,
    tags: tag,

    // eleventyComputed values are worked out per page, after front matter has
    // been read, so they can depend on what the page itself says.
    eleventyComputed: {
      // Highlight this entry's section in the header scale bar.
      current: (data) => data.section,

      // /bench/fixing-the-z2/ — the section it belongs to, then its own name.
      // fileSlug is the filename with the date in front already taken off by
      // Eleventy, so "2026-08-20-fixing-the-z2.md" needs nothing done to it.
      //
      // Returning false instead means "don't build a page for this", which is
      // how an unfinished draft stays off the live site.
      permalink: (data) =>
        data.draft && !showDrafts
          ? false
          : `/${data.section}/${data.page.fileSlug}/`,

      // ...and the same draft stays out of the feed, the sitemap, the topic
      // pages and every section listing.
      eleventyExcludeFromCollections: (data) =>
        data.draft && !showDrafts ? true : data.eleventyExcludeFromCollections,
    },
  };
}
