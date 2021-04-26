Easily create a blog, a digital garden or a directory from your markdown content and [vitepress](https://vitepress.vuejs.org/). It uses [glob](https://www.npmjs.com/package/glob) and [gray-matter](https://www.npmjs.com/package/gray-matter) to recursively parse the files for you.

### Installation

`npm i -D vitepress-tags`

Use it in your `.vitepress/config.js` to automatically create navbar and sidebar navigation. You can also the lists of pages available on any page with theme's `customData`. It will be available in your vitepress theme components as `$site.customData.pages`. 

```
import getTags from 'vitepress-tags'

const pages = getTags()

const config = {
  themeConfig: {
    nav: [
      {
        text: 'Collab',
        link: '/collab/',
        items: pages.collab
      },
      {
        text: 'Art',
        link: '/art/',
        items: pages.art
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Collab',
          link: '/collab/',
          children: pages.collab
        },
        {
          text: 'Art',
          link: '/art/',
          children: pages.art
        },
      ],
    },
  },
  customData: {
    pages: pages
  }
}
```

### Setting tags in markdown frontmatter

Add a `tag` or an `['array', 'of', 'tags']` to the `tags:` in the .md file frontmatter and it will appear in the `pages.tag` collection.

```
---
tags: tag
---
```

### Building data structures

With this simple tool you can create any kind of connections between your pages. Let's take an example use:

1. You add a tag `tags: collab` to a page `/pages/collab/code.md`
1. You add `list: collab` to `/pages/collab.md`
2. Then you can get a list of all collabs from `$site.customData.pages?.[$frontmatter.list]` and show them as you want in the `page.vue` component

### Data structure

Here's the actual code that creates a record for a given page. Last modified timestamo is inferred from the file stats for ease of digital gardening. May be some options for configuring this schema are needed. Like if to add the full content of the page to the collection list or not. For now we just have 'more` to see if it's there.

```
{
  title: frontmatter.data?.title,
  subtitle: frontmatter.data?.subtitle,
  text: frontmatter.data?.title,
  lastModified: stats.mtime,
  link: '/' + url,
  data: frontmatter?.data,  // here you have all the frontmatter fields
  more: !!frontmatter.content,
}
```

