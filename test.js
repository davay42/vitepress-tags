import getTags from "./index.js";

const tags = getTags({ dir: "./" });

console.log(tags.all);
