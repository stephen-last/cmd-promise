
const exec = require('child_process').exec

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
 * @param  {string} command command line command to run.
 * @param  {object} options options object as outlined in the node docs.
 * @return Promise
 */
function runCommand (command, options) {
  return new Promise((resolve, reject) => {
    exec(command, options, (error, stdout, stderr) => {
      if (error) { return reject(error) }
      resolve({ stdout, stderr })
    })
  })
}

/**
 * run one or many commands
 * @param  {string} commands command line command(s) string to run.
 * @param  {object} options  options object as outlined in the node docs.
 * @return Promise
 */
function cmdPromise (commands, options) {
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
      return runCommand(command, options)
    })

    // multiple lines, return an array of outs
    return Promise.all(arrOut)
  } else {
    // one line, run it
    return runCommand(commands, options)
  }
}

module.exports = cmdPromise
