
# CMD Promise

Node command line interface with a simple Promise based API.

[![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Version](https://img.shields.io/npm/v/cmd-promise.svg)](https://www.npmjs.com/package/cmd-promise)
[![Downloads](https://img.shields.io/npm/dt/cmd-promise.svg)](https://www.npmjs.com/package/cmd-promise)

Inspired by [node-cmd](https://github.com/RIAEvangelist/node-cmd).

## Features

- Simple Promise based API.
- Single or multiple commands in one call.
- Passes the [`exec()`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) node options through.
- Returns an `object` containing both `stdout` and `stderr`.
- Optionally return the [child process](https://nodejs.org/api/child_process.html#child_process_class_childprocess) instead of the output.
- Zero dependencies.

## Requirments

Uses native node promises (including `Promise.all` with generic iterables) so requires at least node version 4.0.0. See [http://node.green/](http://node.green/#ES2015-built-ins-Promise).

## Install

`npm install cmd-promise`

## Examples

### Single command

```js
const cmd = require('cmd-promise')

cmd(`node -v`).then(out => {
  console.log('out =', out)
}).catch(err => {
  console.log('err =', err)
})

// out = { stdout: 'v4.2.2\r\n', stderr: '' }
```

### Multiple commands

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

### More involved example

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

### Return the child process instead

```js
const cmd = require('../cmd-promise')

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
```

### Pass exec() options

Pass [`child_process.exec()`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) options as defined in the node docs.

```js
const cmd = require('../cmd-promise')

const execOptions = { timeout: 1000 }

cmd(`node -v`, {}, execOptions).then(out => {
  console.log('out =', out)
}).catch(err => {
  console.log('err =', err)
})
```

## API

`cmd(commands [,options] [,execOptions]) -> Promise`

- **commands** (string) Single or multiple line string of commands to execute.
- **options** (object)
  - `returnProcess` (boolean) Return the child process instead of waiting on and returning the outcome. Default is `false`.
- **execOptions** (object) Options as passed to the  [`exec()`](https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback) method of the [child_process](https://nodejs.org/api/child_process.html) node module.

Returns a Promise.

For **single** commands the promises return value is an `object` containing `stdout` and `stderr` properties. If `options.returnProcess` is set to `true` the return value is the [child process](https://nodejs.org/api/child_process.html#child_process_class_childprocess) instead.

```js
const cmd = require('cmd-promise')

cmd(`node -v`).then(out => {
  console.log('out.stdout =', out.stdout) // v4.2.2
  console.log('out.stderr =', out.stderr)
})
```

For **multiple line** command calls the promises return value is an array of `object`'s containing `stdout` and `stderr` properties. If `options.returnProcess` is set to `true` the return value is an array of [child processes](https://nodejs.org/api/child_process.html#child_process_class_childprocess) instead.

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
