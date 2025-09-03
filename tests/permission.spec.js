import { expect } from '@playwright/test';
import { test } from '../fixtures.js';
import BasePage from '../page/BasePage.js';
import PermissionPage from '../page/PermissionPage.js';

function randomString(length = 5) {
  return Math.random().toString(36).substring(2, 2 + length);
}

const permissionName = `Automation_Test_${randomString()}`;
const updatedName = `${permissionName}_edit`;

test.describe('🛡️ Permissions Management', () => {

  test('✅ Verify Permissions page header is visible', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);
    await permissionPage.navigateToPermissions(basePage);
    await expect(permissionPage.permissionsHeader).toBeVisible();
  });

  test('🔍 Verify Pagination Next & Previous', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);
    await permissionPage.navigateToPermissions(basePage);
    await permissionPage.paginateNextAndPrevious();
  });

  test('📝 Verify Permission Name column is visible', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);
    await permissionPage.navigateToPermissions(basePage);
    await permissionPage.verifyPermissionNameHeader();
  });

  test('➕ Create a new permission', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);
    await permissionPage.navigateToPermissions(basePage);
    await permissionPage.createPermission(permissionName);
    await expect(permissionPage.permissionRow(permissionName)).toBeVisible();
  });

  test('✏️ Edit permission name', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);
    await permissionPage.navigateToPermissions(basePage);
    await permissionPage.createPermission(permissionName);
    await permissionPage.openPermissionDetails(permissionName);
    await permissionPage.editPermissionName(updatedName);
    await permissionPage.searchPermission(updatedName);
    await expect(permissionPage.permissionRow(updatedName)).toBeVisible();
  });

  test('🗑️ Delete permission', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);
    const deletePermissionName = `Delete_Test_${Date.now()}`;
    await permissionPage.navigateToPermissions(basePage);
    await permissionPage.createPermission(deletePermissionName);
    await expect(permissionPage.permissionRow(deletePermissionName)).toBeVisible();
    await permissionPage.deletePermission(deletePermissionName);
    await expect(permissionPage.permissionRow(deletePermissionName)).toHaveCount(0);
  });

  test('🔄 Reset button clears form fields', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);
    await permissionPage.navigateToPermissions(basePage);
    await permissionPage.openCreateForm();
    await permissionPage.permissionNameInput.fill('Reset test');
    await permissionPage.resetForm();
    await expect(permissionPage.permissionNameInput).toHaveValue('');
  });

  test('⬅️ Back button navigates to Permissions list', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);
    await permissionPage.navigateToPermissions(basePage);
    await permissionPage.addPermissionBtn.click();
    await permissionPage.goBack();
    await expect(permissionPage.addPermissionBtn).toBeVisible();
  });

});
