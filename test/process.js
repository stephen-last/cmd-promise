
const cmd = require('../cmd-promise')

console.log('cmd-promise: Return child process instead of output.')

const options = { returnProcess: true }

cmd(`node -v`, options).then(childProcess => {
  console.log('pid =', childProcess.pid)
  childProcess.stdout.on('data', stdout => {
    console.log('stdout =', stdout)
  })
  childProcess.stderr.on('data', stderr => {
    console.log('stderr =', stderr)
  })
}).catch(err => {
  console.log('err =', err)
})
