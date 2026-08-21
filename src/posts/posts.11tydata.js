// Settings applied to every markdown file in this folder. See lib/content.js
// for what they do; the only thing special about posts is that each one
// chooses its own section in the CMS.
import { entryDefaults } from "../../lib/content.js";

export default entryDefaults({ layout: "post.njk", tag: "posts" });
