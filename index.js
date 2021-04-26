const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const glob = require('glob')

module.exports = function (dir = './pages', pattern = '/**/*.md') {
  const filesList = glob.sync(dir + pattern, { nodir: true })
  console.log(filesList)
  const tags = {}

  const all = filesList.map((file) => {
    let info = matter(fs.readFileSync(file, 'utf8'))
    let data = {
      title: info.data?.title,
      url:
        dir.split('/').pop() +
        '/' +
        path.relative(dir, file).split('.').shift(),
      data: info?.data,
    }

    if (typeof info?.data?.tags == 'string') {
      let tag = info?.data?.tags
      tags[tag] = tags[tag] || []
      tags[tag].push(data)
    }

    if (Array.isArray(info.data?.tags) && info?.data?.tags.length > 0) {
      info.data.tags.forEach((tag) => {
        tags[tag] = tags[tag] || []
        tags[tag].push(data)
      })
    }
    return data
  })

  return { all, ...tags }
}
