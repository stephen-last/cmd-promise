
const exec = require('child_process').exec

/**
 * does the given object have the given property
 * @param  {object} obj  object to check.
 * @param  {string} prop property to check for.
 * @return Boolean
 */
function hasProp (obj, prop) {
  return obj.hasOwnProperty(prop)
}

/**
 * is this a string please sir?
 * @param  {string} str string (or is it?) to check.
 * @return Boolean
 */
function isString (str) {
  return (typeof str === 'string' || str instanceof String)
}

/**
 * wrapper for child_process.exec()
 * @param  {string} command     command line command to run.
 * @param  {object} options     cmd-promise options.
 * @param  {object} execOptions exec() options object as outlined in the node docs.
 * @return Promise
 */
function runCommand (command, options, execOptions) {
  // defaults
  if (!options) { options = {} }
  if (!execOptions) { execOptions = {} }

  // resolve to the child process?
  const returnProcess = hasProp(options, 'returnProcess') ? options.returnProcess : false

  return new Promise((resolve, reject) => {
    if (returnProcess) {
      // resolve to the child process, don't wait for the output
      resolve(exec(command, execOptions))
    } else {
      // resolve to the output, using the callback
      exec(command, execOptions, (error, stdout, stderr) => {
        if (error) { return reject(error) }
        resolve({ stdout, stderr })
      })
    }
  })
}

/**
 * run one or many commands
 * @param  {string} commands command line command(s) string to run.
 * @param  {object} options  options object as outlined in the node docs.
 * @return Promise
 */
function cmdPromise (commands, options, execOptions) {
  // make sure the command is a string
  if (!isString(commands)) {
    return Promise.reject(new Error('Command not a string.'))
  }

  // do we have multiple lines?
  if (commands.indexOf('\n') > -1) {
    // split by new lines
    const arrSplit = commands.split(/\n/g)

    // remove empty array elements
    const arrFiltered = arrSplit.filter(ele => ele.length)

    // trim each array element
    const arrTrimmed = arrFiltered.map(ele => ele.trim())

    // array of command promises
    const arrOut = arrTrimmed.map(command => {
      return runCommand(command, options, execOptions)
    })

    // multiple lines, return an array of outs
    return Promise.all(arrOut)
  } else {
    // one line, run it
    return runCommand(commands, options, execOptions)
  }
}

module.exports = cmdPromise
