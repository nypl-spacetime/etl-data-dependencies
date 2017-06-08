const fs = require('fs')
const path = require('path')
const Viz = require('viz.js')
const cheerio = require('cheerio')
const orchestrator = require('@spacetime/orchestrator')

const filename = 'spacetime-graph'

function aggregate (config, dirs, tools, callback) {
  const dot = orchestrator({
    useSteps: false
  }).getDot()

  const svg = Viz(dot, {
    format: 'svg'
  })

  const $ = cheerio.load(svg)

  // Somehow, Viz.js incorrectly sets the "viewbox" attribute,
  //   while it should be "viewBox" (capital B)
  $('svg')
    .attr('viewBox', $('svg').attr('viewbox'))
    .removeAttr('viewbox')

  // Remove polygons with white background
  $('polygon[fill=#ffffff]').remove()

  $('.node').map((index, element) => {
    const dataset = $('text', element).html()
    const link = $(`<a xlink:href="https://github.com/nypl-spacetime/etl-${dataset}"></a>`)
    return $(element).wrap(link)
  })

  fs.writeFileSync(path.join(dirs.current, `${filename}.dot`), dot)
  fs.writeFileSync(path.join(dirs.current, `${filename}.svg`), $.html())

  callback()
}

// ==================================== Steps ====================================

module.exports.steps = [
  aggregate
]

