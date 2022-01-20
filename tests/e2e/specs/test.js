// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide


function generateUUID() { // Public Domain/MIT
 var d = new Date().getTime();//Timestamp
 var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
 return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
     var r = Math.random() * 16;//random number between 0 and 16
     if(d > 0){//Use timestamp until depleted
         r = (d + r)%16 | 0;
         d = Math.floor(d/16);
     } else {//Use microseconds since page-load if supported
         r = (d2 + r)%16 | 0;
         d2 = Math.floor(d2/16);
     }
     return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
 });
}


module.exports = {

  'open login page': browser => {
    browser
      .openHomepage()
      .end()
  },

  'login': browser => {
   browser.openHomepage()
   .saveScreenshot('./reports/login.png')
   .waitForElementVisible('input[name=username]')
   .setValue('input[name=username]', 'nightwatch')
   .setValue('input[name=password]', 'nightwatch+init')
   .click('button[type=submit]');

   // check username
   browser.waitForElementVisible('#col1')
   browser.assert.containsText('#C_Username', 'nightwatch')
   
   // new category
   browser.assert.containsText("#categoryCount",4);
   // browser.assert.elementCount('#categoryList', 4)
   var newCatname = generateUUID();
   browser.setValue('input[name=newCategoryName]', newCatname);
   browser.keys(browser.Keys.ENTER);
   browser.assert.containsText("#categoryCount",5);
   // browser.assert.elementCount('#categoryList', 5)
   browser.end();
 },

  // 'example e2e test using a custom command': browser => {
  //   browser
  //     .openHomepage()
  //     .assert.elementPresent('.hello')
  //     .end()
  // }
}
