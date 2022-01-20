/**
 * A basic Nightwatch custom command
 *  which demonstrates usage of ES6 async/await instead of using callbacks.
 *  The command name is the filename and the exported "command" function is the command.
 *
 * Example usage:
 *   browser.openHomepage();
 *
 * For more information on writing custom commands see:
 *   https://nightwatchjs.org/guide/extending-nightwatch/#writing-custom-commands
 *
 */
module.exports = {
  command: async function () {
   this.init()
   .waitForElementVisible('#app')
   .assert.elementPresent('.panel-heading')
   .assert.containsText('h2', 'User Login')
   .assert.elementCount('img', 1)
  }
}
