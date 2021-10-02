const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')

const app = express()
const PORT = 8080
const URL = 'https://g1.globo.com/'

const getHtml = async () => {
  const response = await axios(URL)
  const html = response.data
  return html
}

const scrapeArticles = async () => {
  const html = await getHtml()
  const $ = cheerio.load(html)
  const articles = []
  $('.feed-post-link', html).each(function () {
    articles.push({
      text: $(this).text(),
      href: $(this).attr('href'),
    })
  })
  return articles
}

app.get('/', async (request, response) => {
  const articles = await scrapeArticles()
  let items = ''
  for (const art of articles) {
    items += `<li><a href=${art.href}>${art.text}</a></li>`
  }
  response.send('<ul>' + items + '</ul>')
})

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`)
})
