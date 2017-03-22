
const cmd = require('../cmd-promise')

const commands = `
  node -v
  npm -v
`

cmd(commands).then(out => {
  console.log('out ===', out)
}).catch(err => {
  console.log('err ===', err)
})
