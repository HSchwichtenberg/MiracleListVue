/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // outputDir: "t:/publish",
    configureWebpack: {
      devtool: 'source-map',
    },
    chainWebpack: config => {
     config.plugins.delete('prefetch') // für echtes Lazy Loading der Chunks https://github.com/vuejs/vue-cli/issues/5562
     config
          .plugin('define')
          .tap(args => {
             // Daten aus package.json' für main.ts in import.meta.env speichern
             let pj = require('./package.json'); 
             args[0]['import.meta.env']['VERSION'] = JSON.stringify(pj.version)
             args[0]['import.meta.env']['RELEASEDATE'] = JSON.stringify(pj.releaseDate)
             return args
          })
  }
}