// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

require("chai").expect;

module.exports = {
 diagnose: (browser) => {
  browser.init();

  console.log("+++ Nightwatch Diagnose Test +++");

  console.log("Launch URL", browser.launchUrl);
  browser.url(function (result) {
   // print the current url
   console.log("Launch URL", result);
  });

  // Classic Nightwatch Assertion
  browser.assert.urlContains("/");
  // Assertion with Chai
  browser.expect.element('body').to.be.present;
  browser.end();
 },
};