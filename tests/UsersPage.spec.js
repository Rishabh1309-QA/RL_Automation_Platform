const { test } = require('@playwright/test');
const UsersPage = require('../page/UsersPage');
const LoginPage = require('../page/LoginPage');
const LogoutPage = require('../page/LogoutPage');

test.describe('Users Page Functionality', () => {
  let usersPage;
  let loginPage;
  let logoutPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    logoutPage = new LogoutPage(page);
    usersPage = new UsersPage(page);
    await loginPage.goto();
    await loginPage.login('rishav.r@rocketlearning.org', 'Rishabh1309!@');
  });

    test('Navigate to Browse Users', async ({ page }) => {
        await usersPage.gotoBrowseUsers();
        await expect(page).toHaveURL(/.*browse-users/);
        console.log('✅ Successfully navigated to Browse Users page');
    });

    test.afterEach(async ({ page }) => {
        await logoutPage.logout();
        console.log('🚪 Logged out successfully after Users page tests');
    });
    test('Navigate to Invite Users', async ({ page }) => {
        await usersPage.inviteUsersLink.click();
        await expect(page).toHaveURL(/.*invite-users/);
        console.log('✅ Successfully navigated to Invite Users page');
    }
    );

    test('Navigate to Roles', async ({ page }) => {
        await usersPage.rolesLink.click();
        await expect(page).toHaveURL(/.*roles/);
        console.log('✅ Successfully navigated to Roles page');
    });
    test('Navigate to Permissions', async ({ page }) => {
        await usersPage.permissionsLink.click();
        await expect(page).toHaveURL(/.*permissions/);
        console.log('✅ Successfully navigated to Permissions page');
    });
    test.afterAll(async ({ page }) => {
        await logoutPage.logout();
        console.log('🚪 Logged out successfully after all Users page tests');
    }
    );


});