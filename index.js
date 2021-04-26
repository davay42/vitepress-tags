const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const glob = require('glob')
const { url } = require('inspector')

module.exports = function (dir = './pages', pattern = '/**/*.md') {
  const pageDir = path.resolve(__dirname, dir)

  const filesList = glob.sync(pageDir + pattern, { nodir: true })
  const tags = {}
  const all = filesList.map((file) => {
    let stats = fs.statSync(file)
    let fileContent = fs.readFileSync(file, 'utf8')
    let frontmatter = matter(fileContent)
    let relLink = path.relative(dir, file)
    let url = relLink.includes('index.md')
      ? relLink.slice(0, -8)
      : relLink.slice(0, -3) + '.html'

    let data = {
      title: frontmatter.data?.title,
      subtitle: frontmatter.data?.subtitle,
      text: frontmatter.data?.title,
      lastModified: stats.mtime,
      link: '/' + url,
      data: frontmatter?.data,
      more: !!frontmatter.content,
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

  return { all, ...tags }
}
