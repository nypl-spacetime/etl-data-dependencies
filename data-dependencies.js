const fs = require('fs')
const path = require('path')
const orchestrator = require('@spacetime/orchestrator')

function aggregate (config, dirs, tools, callback) {
  const dot = orchestrator({
    useSteps: false
  }).getDot()

  fs.writeFileSync(path.join(dirs.current, 'spacetime.dot'), dot)

  callback()
}

// ==================================== Steps ====================================

module.exports.steps = [
  aggregate
]

