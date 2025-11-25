const { test, expect } = require('@playwright/test');
const LoginPage = require('../page/LoginPage');
const PermissionsPage = require('../page/PermissionsPage');

const validEmail = 'rishav.r@rocketlearning.org';
const validPassword = 'Rishabh1309!@';
function randomString(length = 5) {
  return Math.random().toString(36).substring(2, 2 + length);
}

const permissionName = `Automation_Test_${randomString()}`;
const updatedName = `${permissionName}_edit`;


test.describe('Rocket Learning - Permissions Module', () => {
  let loginPage, permissionsPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    permissionsPage = new PermissionsPage(page);

    await loginPage.goto();
    await loginPage.login(validEmail, validPassword);
    await permissionsPage.navigateToPermissions();
  });

test('TC01 - Navigate to Permissions module', async () => {
    await permissionsPage.navigateToPermissions();
  });

   test('TC02 - Verify Permissions heading is visible', async () => {
    await permissionsPage.navigateToPermissions();
    await permissionsPage.verifyPermissionsHeader();
  });

  test('TC03 - Pagination Next & Previous', async () => {
    await permissionsPage.navigateToPermissions();
    await permissionsPage.paginateNextAndPrevious();
  });

  test('TC04 - Verify Permission Name column is visible', async () => {
    await permissionsPage.navigateToPermissions();
    await permissionsPage.verifyPermissionNameHeader();
  });

  test('TC05 - Create a new permission', async () => {
    await permissionsPage.createPermission(permissionName);
    await expect(
      permissionsPage.page.getByRole('row', { name: new RegExp(permissionName, 'i') })
    ).toBeVisible();
  });

  test('TC06 - Edit permission name', async () => {
    await permissionsPage.createPermission(permissionName);
    await permissionsPage.openPermissionDetails(permissionName);
    await permissionsPage.editPermissionName(updatedName);
    await permissionsPage.searchPermission(updatedName);
    await expect(
      permissionsPage.page.getByRole('row', { name: new RegExp(updatedName, 'i') })
    ).toBeVisible();
  });

  test('TC03 - Delete permission', async ({ page }) => {
  const PermissionsPage = require('../page/PermissionsPage');
  const permissionsPage = new PermissionsPage(page);

  const permissionName = `Delete_Test_${Date.now()}`; // Unique name

  // Navigate to Permissions Page
  await permissionsPage.navigateToPermissions();

  // Step 1: Create a new permission
  await permissionsPage.createPermission(permissionName);
  await expect(
    permissionsPage.page.getByRole('row', { name: new RegExp(permissionName, 'i') })
  ).toBeVisible();
  await permissionsPage.searchPermission(permissionName);

  // Step 3: Delete the permission
  await permissionsPage.deletePermission(permissionName);
  await expect(
    permissionsPage.page.getByRole('row', { name: new RegExp(permissionName, 'i') })
  ).toHaveCount(0);
});
 
test('TC08 - Reset button clears form fields', async ({ page }) => {
  const permissionsPage = new PermissionsPage(page);

  await permissionsPage.navigateToPermissions();
  await permissionsPage.openCreateForm();                // 🔥 open the form first
  await permissionsPage.permissionNameInput.fill('Reset test');

  await permissionsPage.resetForm();                     // clicks Reset
  await expect(permissionsPage.permissionNameInput).toHaveValue('');
});

  test('TC09 - Back button navigates to Permissions list', async () => {
    await permissionsPage.addPermissionBtn.click();
    await permissionsPage.goBack();
    await expect(permissionsPage.addPermissionBtn).toBeVisible();
  });
});
