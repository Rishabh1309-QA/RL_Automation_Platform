const { test, expect } = require('@playwright/test');
const LoginPage = require('../../page/Login/LoginPage');
const LogoutPage = require('../../page/Login/LogoutPage');

test.describe('🔐 Login & Logout Functionality', () => {
  let loginPage, logoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    logoutPage = new LogoutPage(page);
    await loginPage.goto();
  });

  test('✅ Positive Login Flow', async ({ page }) => {
  await loginPage.login('rishav.r@rocketlearning.org', 'Rishabh1309!@');
  await expect(page).toHaveTitle('Rocket Learning V2 Platform');
  await logoutPage.logout();
  await page.close();
});

  test('❌ Negative Login - Invalid Email & Password', async () => {
    await loginPage.login('rishav.r@rocketlearning.or', 'wrongPassword123');
    await loginPage.assertErrorText('These credentials do not match our records.');
  });

  test('⚠️ Missing Email', async () => {
    await loginPage.login('', 'Rishabh1309!@');
    await loginPage.assertValidationText('The email field is required.');
  });

  test('⚠️ Missing Password', async () => {
    await loginPage.login('rishav.r@rocketlearning.org', '');
    await loginPage.assertValidationText('The password field is required.');
  });

test('📩 Forgot Password - Valid Email', async () => {
  await loginPage.clickForgotPassword(); // step 1
  await loginPage.fillForgotEmail('rishav.r@rocketlearning.org'); // step 2 + 3
  await loginPage.clickSendReset(); // step 4
  await loginPage.verifyPasswordResetMessage(); // step 5
});


  test('❌ Forgot Password - Invalid Email', async () => {
   await loginPage.clickForgotPassword(); // step 1
  await loginPage.fillForgotEmail('rishav.r@rocketlearning.or'); // step 2 + 3
  await loginPage.clickSendReset(); // step 4
  await loginPage.verifyErrorAlert(); // step 5
  console.log('❌ Forgot password error displayed for invalid email.');
});
});
