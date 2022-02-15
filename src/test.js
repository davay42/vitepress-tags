const getTags = require("../dist/vitepress-tags.umd");

const tags = getTags({ dir: "./" });

console.log(tags.all);
