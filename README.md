
# CMD Promise

Node command line interface with a simple Promise based API.

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Version](https://img.shields.io/npm/v/cmd-promise.svg)](https://www.npmjs.com/package/cmd-promise)
[![Downloads](https://img.shields.io/npm/dt/cmd-promise.svg)](https://www.npmjs.com/package/cmd-promise)

## Requirments

- Uses native node promises (including `Promise.all` with generic iterables) so requires at least node version 4.0.0. See [http://node.green/](http://node.green/#ES2015-built-ins-Promise).
- Zero dependencies.

## Install

`npm install cmd-promise`

## Examples

Run a single command:

```js
const cmd = require('cmd-promise')

cmd(`node -v`).then(out => {
  console.log('out =', out)
}).catch(err => {
  console.log('err =', err)
})

// out = { stdout: 'v4.2.2\r\n', stderr: '' }
```

Run multiple commands

```js
const cmd = require('cmd-promise')

const commands = `
  node -v
  npm -v
`

cmd(commands).then(out => {
  console.log('out =', out)
}).catch(err => {
  console.log('err =', err)
})

// out = [ { stdout: 'v4.2.2\r\n', stderr: '' }, { stdout: '4.4.1\n', stderr: '' } ]
// out[0].stdout = v4.2.2
```

Check if your npm version is out of date:

```js
const semver = require('semver') // https://github.com/npm/node-semver
const cmd = require('cmd-promise')

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
```

## API

`cmd(commands [,options]) -> Promise`

- **commands** (string) Single or multiple line string of commands to execute.
- **options** (object) Options as passed to [`exec()`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) method of the [child_process](https://nodejs.org/api/child_process.html) node module.

Returns a Promise.

For single commands the promises return value is an `object` containing `stdout` and `stderr` properties.

```js
const cmd = require('cmd-promise')

cmd(`node -v`).then(out => {
  console.log('out.stdout =', out.stdout) // v4.2.2
  console.log('out.stderr =', out.stderr)
})
```

For multiple line command calls the promises return value is an array of `object`'s containing `stdout` and `stderr` properties.

```js
const cmd = require('cmd-promise')

const commands = `
  node -v
  npm -v
`

cmd(commands).then(out => {
  console.log('out[0] =', out[0]) // result from 'node -v'
  console.log('out[1] =', out[1]) // result from 'npm -v'
})
```
