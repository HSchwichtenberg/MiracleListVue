// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

require("chai").expect;

module.exports = {
 diagnose: (browser) => {
  browser.init();

  browser.url(function (result) {
   // print the current url
   console.log(result);
  });

  // classic Nightwatch Assertion
  browser.assert.urlContains("/");
  // Assertion with Chai
  browser.expect.element('body').to.be.present;

  browser.end();
 },
};