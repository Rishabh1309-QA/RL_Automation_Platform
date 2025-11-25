const { test: base } = require('@playwright/test');
const LoginPage = require('./page/Login/LoginPage');

// 🔹 Reusable login function for hooks and utilities
async function loginFn(page) {
  const loginPage = new LoginPage(page);
  await page.goto('https://v2.dev.lilyogis.in/login');
  await loginPage.login('rishav.r@rocketlearning.org', 'Rishabh1309!@');
  return loginPage; // return same as fixture for consistency
}

// 🔹 Fixture version (used in tests)
const test = base.extend({
  login: async ({ page }, use) => {
    const loginPage = await loginFn(page);
    await use(loginPage); // 👈 keeps your existing behaviour
  },
});

module.exports = { test, loginFn };
