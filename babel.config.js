// This plugin removes all console.* calls.
// https://www.npmjs.com/package/babel-plugin-transform-remove-console
const removeConsolePlugin = []
if(import.meta.env.NODE_ENV === 'production') {
  removeConsolePlugin.push("transform-remove-console")
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: removeConsolePlugin
}
