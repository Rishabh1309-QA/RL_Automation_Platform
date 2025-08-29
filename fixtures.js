// fixtures.js
const { test: base } = require('@playwright/test');
const LoginPage = require('./page/LoginPage');

exports.test = base.extend({
  login: async ({ page }, use) => {
    const loginPage = new LoginPage(page);

    await page.goto('https://v2.dev.lilyogis.in/login');
    await loginPage.login('rishav.r@rocketlearning.org', 'Rishabh1309!@');

    // 👇 now login is complete, pass control to the test
    await use(loginPage);
  }
});
