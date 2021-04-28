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
  media: getMediaPath(), // you set 'media: some/relative/path/to/picture.jpg and you'll get an absolute (to your web site domain)
  more: !!frontmatter.content,
}
```

#### The story behind

First I was thinking that this script shuold obviously be shipped with vitepress. Then I understood, that it's a feature. Here's the quote from the vitepress docs:

> ## Lighter Page Weight
>
> Does not ship metadata for every page on every request. This decouples page weight from total number of pages. Only the current page's metadata is sent. Client side navigation fetches the new page's component and metadata together.


So then I wrote this by myself. Used it as a snippet code in a couple of projects and then realized I need to make it an npm package to be more consistent.

The final thing was the recent [article](https://www.joshwcomeau.com/blog/how-i-built-my-blog/#index-pages) by Josh Cameau, who described a similar `getLatestContent` function he uses to parse MDX files for his blog on Next.js.

> `getLatestContent` is a method that traverses the local filesystem to find all of the .mdx blog posts. The logic looks something like this:
> - Collect all of the MDX files in the pages directory, using fs.readdirSync.
> - Filter out any unpublished posts (ones where isPublished is not set to true).
> - Sort all of the blog posts by publishedOn, and slice out everything after the specified limit.
> - Return the data.

So it's a nice fun fact to see the parallels in vue and react ecosystem development. Both matter, Vue is just more fun to me. Peace! ✌️

`vitepress-tags` is intended to be used for digital gardening and so there's not sort or limits – you'll get all the tagged posts all together. And there's no need in isPublished as you just don't add `tags` to the files you don't want to be listed and they're not. 