
const semver = require('semver')
const cmd = require('../cmd-promise')

console.log('cmd-promise: More involved example.')

const commands = `
  npm view npm version
  npm -v
`

cmd(commands).then(out => {
  return {
    npm: out[0].stdout.replace(/\n/g, ''),
    me: out[1].stdout.replace(/\n/g, '')
  }
}).then(versions => {
  if (semver.lt(versions.me, versions.npm)) {
    console.log(`My npm version is out of date (npm install npm@latest -g).`)
  } else {
    console.log(`My npm version is up to date! :-)`)
  }
}).catch(err => {
  console.log('err =', err)
})
