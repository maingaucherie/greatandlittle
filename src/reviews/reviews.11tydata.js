// Settings applied to every markdown file in this folder. See lib/content.js.
import { entryDefaults, reviewSectionKey } from "../../lib/content.js";

const defaults = entryDefaults({ layout: "review.njk", tag: "reviews" });

export default {
  ...defaults,
  eleventyComputed: {
    ...defaults.eleventyComputed,

    // Reviews don't pick a section the way posts do. They all file under
    // whichever one is ticked "holds scored reviews", so moving the whole
    // On Screen section elsewhere is a tickbox and nothing more.
    section: (data) => reviewSectionKey(data.sections.list),
  },
};
