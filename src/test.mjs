import getTags from "./main.mjs";

const tags = getTags({ dir: "./" });

console.log(tags.all);
