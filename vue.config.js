/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // outputDir: "t:/publish",
    configureWebpack: {
      devtool: 'source-map',
    },
    chainWebpack: config => {
     // config.plugins.delete('preload-index')
     // config.plugins.delete('preload-login')
     // config.plugins.delete('preload-home')
     // config.plugins.delete('preload-about')
     config
          .plugin('define')
          .tap(args => {
             // Daten aus package.json' für main.ts in process.env speichern
              let pj = require('./package.json'); 
              args[0]['process.env']['VERSION'] = JSON.stringify(pj.version)
              args[0]['process.env']['RELEASEDATE'] = JSON.stringify(pj.releaseDate)
              args[0]['process.env']['BACKEND'] = JSON.stringify(pj.backend)
              return args
          })
  }
}