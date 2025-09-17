// tests/createRole.spec.js
import { expect } from '@playwright/test';
import { test } from '../fixtures';
import BasePage from '../page/BasePage.js';
import RolesPage from '../page/RolesPage.js';
import CreateRolePage from '../page/CreateRolePage.js';

test.describe('🆕 Create Role Page', () => {

  test.beforeEach(async ({ page, login }) => {
    const basePage = new BasePage(page);
    const rolesPage = new RolesPage(page);

    // Navigate to Create Role page
    await rolesPage.navigateToRolesPage(basePage);
    await rolesPage.addRole();

    const createRolePage = new CreateRolePage(page);
    await createRolePage.assertOnCreateRolePage();
  });

  test('✅ Positive: Create Role with valid data', async ({ page, login }) => { 
    const createRolePage = new CreateRolePage(page);
    const roleName = `AutoRole_${Date.now()}`;

    await createRolePage.enterRoleName(roleName);
    await createRolePage.choosePermission('activity_create'); // adjust as per real permission
    await createRolePage.clickCreate();

    // Verify success (toast or redirect)
    await createRolePage.assertSuccessMessage('New role created successfully.');
  });

  test('❌ Negative: Create Role with blank Role Name', async ({ page, login }) => {
    const createRolePage = new CreateRolePage(page);

    await createRolePage.choosePermission('activity_create');
    await createRolePage.clickCreate();

    await createRolePage.assertRoleNameError('The name field is required.');
  });

  test('❌ Negative: Create Role without selecting Permission', async ({ page, login }) => {
    const createRolePage = new CreateRolePage(page);

    await createRolePage.enterRoleName('TestRole_NoPermission');
    await createRolePage.clickCreate();

    await createRolePage.assertPermissionError('The permission id field is required.');
  });

  test('🔄 Reset button clears fields', async ({ page, login }) => {
    const createRolePage = new CreateRolePage(page);

    await createRolePage.enterRoleName('TempRole');
    await createRolePage.choosePermission('activity_create');
    console.log('Fields populated.');
    await createRolePage.clickReset();
      console.log('Reset clicked.');
    await createRolePage.assertFieldsAreCleared();
  });

  test('⬅️ Back button navigates to Roles list page', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const rolesPage = new RolesPage(page);
    const createRolePage = new CreateRolePage(page);

    await createRolePage.clickBack();
    await expect(rolesPage.rolesPageHeader).toBeVisible();
  });

  test('❌ Negative: Duplicate role name creation', async ({ page, login }) => {
  const createRolePage = new CreateRolePage(page);
  const roleName = `AutoRole_${Date.now()}`;

  // First, create the role successfully
  await createRolePage.enterRoleName(roleName);
  await createRolePage.choosePermission('activity_create');
  await createRolePage.clickCreate();
  await createRolePage.assertSuccessMessage('New role created successfully.');

  // Navigate back to the create page
  const rolesPage = new RolesPage(page);
  await rolesPage.addRole();

  // Now, try to create it again with the same name
  await createRolePage.enterRoleName(roleName);
  await createRolePage.choosePermission('activity_create');
  await createRolePage.clickCreate();

  // Assert the duplicate error message
  await createRolePage.assertRoleNameError('The name has already been taken.');
});
});
