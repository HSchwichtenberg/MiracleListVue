// For authoring Nightwatch tests, see
// https://nightwatchjs.org/guide

var expect = require("chai").expect;

function generateUUID() {
 // Public Domain/MIT
 var d = new Date().getTime(); //Timestamp
 var d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
 return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
  var r = Math.random() * 16; //random number between 0 and 16
  if (d > 0) {
   //Use timestamp until depleted
   r = (d + r) % 16 | 0;
   d = Math.floor(d / 16);
  } else {
   //Use microseconds since page-load if supported
   r = (d2 + r) % 16 | 0;
   d2 = Math.floor(d2 / 16);
  }
  return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
 });
}

function Homepage(browser) {
 browser
  .init()
  .waitForElementVisible("#app")
  .assert.elementPresent(".panel-heading")
  .assert.containsText("h2", "User Login")
  .assert.elementCount("img", 1);
 return browser;
}

function Login(browser, username, password) {
 browser
  .waitForElementVisible("input[name=username]")
  .setValue("input[name=username]", username)
  .setValue("input[name=password]", password)
  .click("button[type=submit]");
 return browser;
}

module.exports = {
 // 'open login page': browser => {
 //   Homepage(browser);
 //   browser.end();
 // },

 "login and create": (browser) => {
  Homepage(browser); // oder mit custom-command: browser.openHomepage()
  Login(browser, "nightwatch", "nightwatch+init");
  browser.saveScreenshot("t:/nightwatch/LoginBefore.png");

  // check username
  browser.waitForElementVisible("#col1");
  browser.assert.containsText("#C_Username", "nightwatch");
  browser.saveScreenshot("t:/nightwatch/LoginAfter.png");

  // create new category
  browser.assert.containsText("#categoryCount", 4);
  // browser.assert.elementCount('#categoryList', 4)
  var newCatname = generateUUID();
  browser.setValue("input[name=newCategoryName]", newCatname);
  browser.keys(browser.Keys.ENTER);
  browser.assert.containsText("#categoryCount", 5);
  browser.assert.containsText("#categoryCurrentName", newCatname);
  // oder mit Expect-API
  browser.expect.element("#categoryCurrentName").text.to.equal(newCatname);
  // XPath-Selektor verwenden
  browser.useXpath().assert.containsText('//*[@id="categoryList"]/li[5]', newCatname);
  browser.saveScreenshot("t:/nightwatch/CategoryCreated.png");

  // hier wieder CSS-Selektoren
  browser.useCss(); 
  // create 10 tasks in the new category
  for (var i = 1; i <= 10; i++) {
   var newTaskName = "task #" + i;
   browser.setValue("input[name=newTaskTitle]", newTaskName);
   browser.keys(browser.Keys.ENTER);
   browser.assert.containsText("#taskCount", i);
  }
  browser.saveScreenshot("t:/nightwatch/TasksCreated.png");

  // Now remove the new category
  browser.useXpath().assert.attributeEquals('//*[@id="categoryList"]/li[5]//span[1]', "id", "remove");
  browser.useXpath().click('//*[@id="categoryList"]/li[5]/span[@id="remove"]');
  browser.saveScreenshot("t:/nightwatch/RemoveDialog.png");

  // Yes in Conformdialog
  browser.useXpath().click('//button[text()="Yes"]');
  // warten, dass Kategorie verschwindet
  browser.waitForElementNotPresent('//*[@id="categoryList"]/li[5]', 1000);
  browser.useCss().assert.containsText("#categoryCount", 4);

  browser.saveScreenshot("t:/nightwatch/RemoveDialogClicked.png");

  browser.useCss();
  browser.end();
  return;
 },

 // 'example e2e test using a custom command': browser => {
 //   browser
 //     .openHomepage()
 //     .assert.elementPresent('.hello')
 //     .end()
 // }
};
