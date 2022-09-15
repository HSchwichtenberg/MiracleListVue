// Refer to the online docs for more details:
// https://nightwatchjs.org/guide/configuration/nightwatch-configuration-file.html
//
//  _   _  _         _      _                     _          _
// | \ | |(_)       | |    | |                   | |        | |
// |  \| | _   __ _ | |__  | |_ __      __  __ _ | |_   ___ | |__
// | . ` || | / _` || '_ \ | __|\ \ /\ / / / _` || __| / __|| '_ \
// | |\  || || (_| || | | || |_  \ V  V / | (_| || |_ | (__ | | | |
// \_| \_/|_| \__, ||_| |_| \__|  \_/\_/   \__,_| \__| \___||_| |_|
//             __/ |
//            |___/
//

module.exports = {
  // An array of folders (excluding subfolders) where your tests are located;
  // if this is not specified, the test source must be passed as the second argument to the test runner.
  "src_folders": [
   "tests/e2e/specs" 
 ],

 // The location where the XML report files will be saved.
 output_folder: './tests/e2e/reports',

  // // See https://nightwatchjs.org/guide/concepts/page-object-model.html
  // page_objects_path: ['node_modules/nightwatch/examples/pages/'],

  // // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-commands.html
  // custom_commands_path: ['node_modules/nightwatch/examples/custom-commands/'],

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-custom-assertions.html
  custom_assertions_path: 'tests/e2e/custom-assertions/',

  // See https://nightwatchjs.org/guide/extending-nightwatch/adding-plugins.html
  plugins: ["vite-plugin-nightwatch"],
  
  // See https://nightwatchjs.org/guide/concepts/test-globals.html#external-test-globals
  globals_path : '',

  webdriver: {},

  test_settings: {
    default: {
      disable_error_log: false,
      launch_url: 'http://localhost:4173',

      screenshots: {
        enabled: true,
        path: './tests/e2e/reports',
        on_failure: true
      },

      desiredCapabilities: {
        browserName : 'chrome'
      },

      webdriver: {
        start_process: true,
        server_path: ''
      }
    },

    chrome: {
      desiredCapabilities : {
        browserName : 'chrome',
        'goog:chromeOptions' : {
          // More info on Chromedriver: https://sites.google.com/a/chromium.org/chromedriver/
          //
          // w3c:false tells Chromedriver to run using the legacy JSONWire protocol (not required in Chrome 78)
          w3c: false,
          args: [
           "--no-sandbox",
           "--disable-gpu",
           "--disable-logging",
           "--disable-in-process-stack-traces",
           "--log-level=3"
          ]
        }
      },

      webdriver: {
        start_process: true,
        server_path: '',
        cli_args: [
          // --verbose
        ]
      }
    },

    firefox: {
     desiredCapabilities : {
       browserName : 'firefox',
       alwaysMatch: {
         acceptInsecureCerts: true,
         'moz:firefoxOptions': {
           args: [
             // '-headless',
             // '-verbose'
           ]
         }
       }
     },
     webdriver: {
       start_process: true,
       server_path: '',
       cli_args: [
         // very verbose geckodriver logs
         // '-vv'
       ]
     }
   },

    // edge: {
    //   desiredCapabilities : {
    //     browserName : 'MicrosoftEdge',
    //     'ms:edgeOptions' : {
    //       w3c: true,
    //       // More info on EdgeDriver: https://docs.microsoft.com/en-us/microsoft-edge/webdriver-chromium/capabilities-edge-options
    //       args: [
    //         //'--headless'
    //       ]
    //     }
    //   },

    //   webdriver: {
    //     start_process: true,
    //     // Download msedgedriver from https://docs.microsoft.com/en-us/microsoft-edge/webdriver-chromium/
    //     //  and set the location below:
    //     server_path: '',
    //     cli_args: [
    //       // --verbose
    //     ]
    //   }
    // },
   
  }
 }