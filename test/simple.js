
const cmd = require('../cmd-promise')

console.log('cmd-promise: One or multiple commands.')

// const single = `node -v`

const multiple = `
  node -v
  npm -v
`

cmd(multiple).then(out => {
  console.log('out =', out)
}).catch(err => {
  console.log('err =', err)
})
