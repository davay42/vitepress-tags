import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import glob from "fast-glob";
import appRoot from "app-root-path";

export default function ({
  dir = "./docs",
  pattern = "/**/*.md",
  publicMedia = ["icon", "cover"],
  ignore = ["**/public/", "**/node_modules/**/*.md"],
  mediaFolder = "_media",
} = {}) {
  const tags = {};

  const root = appRoot.toString();
  const pageDir = path.resolve(root, dir);

  fs.rmSync(path.join("public", mediaFolder), { recursive: true, force: true });

  const all = glob
    .sync([pageDir + pattern], {
      nodir: true,
      ignore,
    })
    .map((file) => {
      let stats = fs.statSync(file);
      let fileContent = fs.readFileSync(file, "utf8");
      let frontmatter = matter(fileContent);
      let data = frontmatter.data;
      let relLink = path.relative(pageDir, file);
      const directory = path.dirname(relLink);
      let url = relLink.includes("index.md")
        ? relLink.slice(0, -8)
        : relLink.slice(0, -3) + ".html";

      let obj = {
        data,
        title: data?.title,
        subtitle: data?.subtitle,
        text: data?.title,
        lastModified: stats.mtime,
        link: "/" + url,
        date: data?.date,
        more: !!frontmatter.content,
        content: frontmatter.block ? frontmatter.content : null,
      };

      for (let media of publicMedia) {
        if (data[media]) {
          let fileName = data[media];
          const filePath = path.join(directory, fileName);
          // const from = path.join(root, fileDir);
          // const webDir = path.join("public/media/", fileDir);
          // const to = path.join(root, webDir);
          const publicPath = path.join("public", mediaFolder, filePath);
          const dirs = path.dirname(publicPath);
          if (!fs.existsSync(dirs)) {
            fs.mkdirSync(dirs, {
              recursive: true,
            });
          }
          obj[media] = path.join("/", mediaFolder, filePath);
          fs.copyFileSync(filePath, path.join("public", mediaFolder, filePath));
        }
      }

      if (typeof frontmatter?.data?.tags == "string") {
        let tag = frontmatter?.data?.tags;
        tags[tag] = tags[tag] || [];
        tags[tag].push(obj);
      }

      if (Array.isArray(data?.tags) && frontmatter?.data?.tags.length > 0) {
        data.tags.forEach((tag) => {
          tags[tag] = tags[tag] || [];
          tags[tag].push(obj);
        });
      }
      return obj;
    });

  Object.entries(tags).forEach(([tag, list]) => {
    let len = list.length;
    list.sort((a, b) => {
      if (a?.data && b?.date) {
        return a.date > b.date ? -1 : 1;
      }
      return a?.lastModified > b?.lastModified ? -1 : 1;
    });
    tags[tag] = list.map((el, i) => {
      return {
        ...el,
        index: i + 1,
        total: len,
      };
    });
  });

  return { all, ...tags };
}
