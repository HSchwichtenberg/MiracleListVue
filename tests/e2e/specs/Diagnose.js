// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

require("chai").expect;

module.exports = {
 "diagnose": (browser) => {
  browser.init();

  browser.url(function(result) {
   // return the current url
   console.log(result);
 });
 
 },

};
