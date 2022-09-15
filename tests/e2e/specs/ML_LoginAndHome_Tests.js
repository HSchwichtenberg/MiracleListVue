// Nightwatch End-to-End-Tests für MiracleList /Login und /Home
// https://nightwatchjs.org/guide

require("chai").expect;

/**
Hilfsfunktion: Öffnet und prüft die Startseite
 */
function CheckLoginForm(browser) {
 browser
  .url(browser.launchUrl + "Login")
  // Prüfe Überschrift
  .waitForElementVisible("#app")
  .assert.elementPresent(".panel-heading")
  .assert.containsText("h2", "User Login")
  // Prüfe Bild
  .assert.elementCount("img", 1);
 return browser;
}

/**
Hilfsfunktion: Anmeldung
 */
function Login(browser, username, password) {
 CheckLoginForm(browser); // oder mit custom-command: browser.CheckLoginForm()
 browser
  .waitForElementVisible("input[name=username]")
  .setValue("input[name=username]", username)
  .setPassword("input[name=password]", password)
  .click("button[type=submit]");
 return browser;
}

module.exports = {
 "open login page": (browser) => {
  browser.init();
  CheckLoginForm(browser);
  browser.end();
 },

 "invalid login without password": (browser) => {
  browser.init();
  Login(browser, "nightwatch", "");
  browser.assert.containsText("#errorMsg", "Username and Password required!");
  browser.assert.not.urlContains("/Home");
  browser.saveScreenshot("tests/e2e/reports/LoginInvalid.png");
  browser.end();
 },

 "login, create category with tasks and remove": (browser) => {
  browser.init();
  Login(browser, "nightwatch", "nightwatch+init");
  browser.saveScreenshot("tests/e2e/reports/LoginBefore.png");

  // Prüfe angezeigten Benutzernamen
  browser
   .waitForElementVisible("#col1")
   .assert.urlContains("/Home")
   .assert.elementPresent("#C_Username")
   .assert.containsText("#C_Username", "nightwatch")
   .saveScreenshot("tests/e2e/reports/LoginAfter.png");

  // Erzeuge neue Aufgabenkategorie
  browser.assert.containsText("#categoryCount", 4);
  var newCatname = "Testkategorie";
  browser.updateValue("input[name=newCategoryName]", [ newCatname, browser.Keys.ENTER ]);
  // oder
  // browser.setValue("input[name=newCategoryName]", newCatname);
  // browser.sendKeys("input[name=newCategoryName]", browser.Keys.ENTER);
  browser.saveScreenshot("tests/e2e/reports/CategoryCreated.png");
  browser.assert.containsText("#categoryCount", 5);
  browser.assert.containsText("#categoryCurrentName", newCatname);
  // Option: mit Chai Expect-API
  browser.expect.element("#categoryCurrentName").text.to.equal(newCatname);
  // Option: XPath-Selektor verwenden
  browser.useXpath().assert.containsText('//*[@id="categoryList"]/li[5]', newCatname);
  // ab hier wieder CSS-Selektoren
  browser.useCss();
  browser.assert.elementCount('#categoryList li', 5) // Custom Assertion
  
  // Erzeuge 10 Aufgaben in der neuen Kategorie
  for (var i = 1; i <= 10; i++) {
   var newTaskName = "task #" + i;
   browser.setValue("input[name=newTaskTitle]", newTaskName).sendKeys("input[name=newTaskTitle]", browser.Keys.ENTER).assert.containsText("#taskCount", i); 
   // browser.keys(browser.Keys.ENTER); // funktioniert nicht mehr in Nightwatch 2.3.5 :-(
  }
  browser.saveScreenshot("tests/e2e/reports/TasksCreated.png");
  browser.assert.elementCount('#taskList li', 10) // Custom Assertion

  // Entferne die oben neu angelegte Kategorie
  browser.useXpath().assert.attributeEquals('//*[@id="categoryList"]/li[5]//span[1]', "id", "remove");
  browser.useXpath().click('//*[@id="categoryList"]/li[5]/span[@id="remove"]');
  browser.saveScreenshot("tests/e2e/reports/RemoveDialog.png");

  // Yes im Confirmdialog
  browser.useXpath().click('//button[text()="Yes"]');
  // warten, dass Kategorie verschwindet
  browser.waitForElementNotPresent('//*[@id="categoryList"]/li[5]', 1000);
  browser.useCss().assert.containsText("#categoryCount", 4);
  browser.saveScreenshot("tests/e2e/reports/RemoveDialogClicked.png");

  browser.end();
  return;
 },
};