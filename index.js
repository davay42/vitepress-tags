const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const glob = require('glob')
var appRoot = require('app-root-path')

module.exports = function (dir = './pages', pattern = '/**/*.md') {
  const root = appRoot.toString()
  const pageDir = path.resolve(root, dir)

  const filesList = glob.sync(pageDir + pattern, { nodir: true })
  const tags = {}
  const all = filesList.map((file) => {
    let stats = fs.statSync(file)
    let fileContent = fs.readFileSync(file, 'utf8')
    let frontmatter = matter(fileContent)
    let relLink = path.relative(pageDir, file)
    let url = relLink.includes('index.md')
      ? relLink.slice(0, -8)
      : relLink.slice(0, -3) + '.html'

    let data = {
      title: frontmatter.data?.title,
      subtitle: frontmatter.data?.subtitle,
      text: frontmatter.data?.title,
      lastModified: stats.mtime,
      link: '/' + url,
      date: frontmatter.data?.date,
      data: frontmatter?.data,
      more: !!frontmatter.content,
      content: frontmatter.block ? frontmatter.content : null,
    }

    if (typeof frontmatter?.data?.tags == 'string') {
      let tag = frontmatter?.data?.tags
      tags[tag] = tags[tag] || []
      tags[tag].push(data)
    }

    if (
      Array.isArray(frontmatter.data?.tags) &&
      frontmatter?.data?.tags.length > 0
    ) {
      frontmatter.data.tags.forEach((tag) => {
        tags[tag] = tags[tag] || []
        tags[tag].push(data)
      })
    }
    return data
  })

  Object.values(tags).forEach((tag) =>
    tag.sort((a, b) => {
      if (a?.data && b?.date) {
        return a.date > b.date ? -1 : 1
      }
      return a?.lastModified > b?.lastModified ? -1 : 1
    }),
  )

  return { all, ...tags }
}

// a function that doesn't work for production build
// function getMediaPath() {
//   if (!frontmatter?.data?.media) return null
//   let fileDir = path.dirname(file)
//   let mediaPath = path.resolve(fileDir, frontmatter?.data?.media)
//   let link = path.relative(pageDir, mediaPath)
//   return '/' + link
// }
