// tests/permission.spec.js
import { expect } from '@playwright/test';
import { test } from '../../fixtures.js';
import BasePage from '../../page/BasePage.js';
import PermissionPage from '../../page/UsersPage/PermissionPage.js';

test.describe('🛡️ Permissions Management (Optimised)', () => {

  test.beforeEach(async ({ page, login }) => {
    const basePage = new BasePage(page);
    const permissionPage = new PermissionPage(page);

    // Always navigate fresh
    await permissionPage.navigateToPermissions(basePage);
    await expect(permissionPage.permissionsHeader).toBeVisible();
  });

  // --- UI Tests ---
  test('✅ Permissions page header is visible', async ({ page }) => {
    const permissionPage = new PermissionPage(page);
    await expect(permissionPage.permissionsHeader).toBeVisible();
  });

  test('🔍 Pagination works', async ({ page }) => {
    const permissionPage = new PermissionPage(page);
    await permissionPage.paginateNextAndPrevious();
  });

  test('📝 Permission Name column is visible', async ({ page }) => {
    const permissionPage = new PermissionPage(page);
    await expect(permissionPage.permissionNameHeader).toBeVisible();
  });

  test('🔄 Reset button clears form fields', async ({ page }) => {
    const permissionPage = new PermissionPage(page);

    await permissionPage.openCreateForm();
    await permissionPage.permissionNameInput.fill('Reset test');
    await permissionPage.resetForm();

    await expect(permissionPage.permissionNameInput).toHaveValue('');
    await permissionPage.goBack();
  });

  test('⬅️ Back button navigates to list', async ({ page }) => {
    const permissionPage = new PermissionPage(page);

    await permissionPage.openCreateForm();
    await permissionPage.goBack();

    await expect(permissionPage.addPermissionBtn).toBeVisible();
  });

  // --- Lifecycle CRUD ---
  test('🔄 Lifecycle: Edit and Delete existing permission', async ({ page }) => {
    const permissionPage = new PermissionPage(page);
    const baseName = `Auto_Perm_${Date.now()}`;
    const updatedName = `${baseName}_edit`;

    // Create
    await permissionPage.createPermission(baseName);

    // Edit
    await permissionPage.openPermissionDetails(baseName);
    await permissionPage.editPermissionName(updatedName);
    await permissionPage.searchPermission(updatedName);
    await expect(permissionPage.permissionRow(updatedName)).toBeVisible();

    // Delete
    await permissionPage.deletePermission(updatedName);
    await expect(permissionPage.permissionRow(updatedName)).toHaveCount(0);
  });

  // --- Negative Tests ---
  test('❌ Duplicate permission name', async ({ page }) => {
    const permissionPage = new PermissionPage(page);
    const baseName = `Auto_Perm_${Date.now()}`;

    // Create once
    await permissionPage.createPermission(baseName);

    // Try duplicate
    await permissionPage.openCreateForm();
    await permissionPage.permissionNameInput.fill(baseName);
    await permissionPage.createButton.click();
    await permissionPage.assertDuplicatePermissionError('The name has already been taken.');
    await permissionPage.goBack();
  });

  test('❌ Blank name while creating', async ({ page }) => {
    const permissionPage = new PermissionPage(page);

    await permissionPage.openCreateForm();
    await permissionPage.createButton.click();
    await permissionPage.assertPermissionNameError('The name field is required.');
    await permissionPage.goBack();
  });

  test('❌ Blank name while editing', async ({ page }) => {
    const permissionPage = new PermissionPage(page);
    const baseName = `Auto_Perm_${Date.now()}`;

    await permissionPage.createPermission(baseName);
    await permissionPage.openPermissionDetails(baseName);

    await permissionPage.editToggleButton.click();
    await permissionPage.permissionNameInput.fill('');
    await permissionPage.updateButton.click();

    await permissionPage.assertPermissionNameError('The name field is required.');
    await permissionPage.goBack();

    // cleanup
    await permissionPage.deletePermission(baseName);
  });

  test('🔄 Deletion cancellation', async ({ page }) => {
    const permissionPage = new PermissionPage(page);
    const cancelName = `Cancel_${Date.now()}`;

    await permissionPage.createPermission(cancelName);
    await permissionPage.deleteButton(cancelName).click();
    await permissionPage.cancelDeleteBtn.click();

    await permissionPage.searchPermission(cancelName);
    await expect(permissionPage.permissionRow(cancelName)).toBeVisible();

    // cleanup
    await permissionPage.deletePermission(cancelName);
  });

  test('🔍 Invalid/empty search', async ({ page }) => {
    const permissionPage = new PermissionPage(page);

    await permissionPage.searchInput.fill('');
    await expect(permissionPage.firstRowInTable).toBeVisible();

    await permissionPage.searchInput.fill(`Non_Existent_${Date.now()}`);
    await permissionPage.assertNoResults();
  });
});
