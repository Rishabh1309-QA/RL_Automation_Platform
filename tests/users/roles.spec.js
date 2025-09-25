// tests/roles.spec.js
import { expect } from '@playwright/test';
import { test } from '../../fixtures.js';
import RolesPage from '../../page/UsersPage/RolesPage.js';
import BasePage from '../../page/BasePage.js';
import CreateRolePage from '../../page/UsersPage/CreateRolePage.js';

test.describe('👥 Roles Management', () => {

  test('✅ Verify Roles page header is visible', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const rolesPage = new RolesPage(page);
    await rolesPage.navigateToRolesPage(basePage);
    await expect(rolesPage.rolesPageHeader).toBeVisible();
  });

  test('🔍 Verify Global Search with Partial Match', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const rolesPage = new RolesPage(page);
    await rolesPage.navigateToRolesPage(basePage);
    const searchTerm = 'general';
    await rolesPage.searchRole(searchTerm);
    await rolesPage.assertRoleVisible('field_general');
  });

  test('✅ Verify Global Search with Exact Match', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const rolesPage = new RolesPage(page);
    await rolesPage.navigateToRolesPage(basePage);
    const searchTerm = 'new role';
    await rolesPage.searchRole(searchTerm);
    await rolesPage.assertRoleVisible(searchTerm);
  });

test('⬆️ Verify Sort by Role Name (Ascending)', async ({ page, login }) => {
  const basePage = new BasePage(page);
  const rolesPage = new RolesPage(page);
  await rolesPage.navigateToRolesPage(basePage);
  await rolesPage.sortByName();
  await rolesPage.sortByName(); 
  const roleNames = await rolesPage.getRoleNames();
  const sorted = [...roleNames].sort((a, b) => a.localeCompare(b));
  expect(roleNames).toEqual(sorted);
});

test('⬇️ Verify Sort by Role Name (Descending)', async ({ page, login }) => {
  const basePage = new BasePage(page);
  const rolesPage = new RolesPage(page);
  await rolesPage.navigateToRolesPage(basePage);
  await rolesPage.sortByName();
  await page.waitForTimeout(500); // Wait for ascending sort
  await rolesPage.sortByName();
  await page.waitForTimeout(500); // Wait for descending sort
  const roleNames = await rolesPage.getRoleNames();
  const sorted = [...roleNames].sort((a, b) => b.localeCompare(a));
  expect(roleNames).toEqual(sorted);
});

  test('➡️ Verify pagination: Next and Previous buttons', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const rolesPage = new RolesPage(page);
    
    await rolesPage.navigateToRolesPage(basePage);
    await expect(rolesPage.nextButton).toBeVisible();
    await expect(rolesPage.previousButton).not.toBeVisible();
    
    // Capture the initial URL of the first page
    const initialUrl = page.url();
    
    // Navigate to the next page
    await rolesPage.goToNextPage();
    
    // Assert that the URL has changed from the initial URL
    await expect(page.url()).not.toBe(initialUrl);
    
    // Assert that the previous button is now visible
    await expect(rolesPage.previousButton).toBeVisible();
    
    // Navigate back to the previous page
    await rolesPage.goToPreviousPage();
    
    // Assert that the URL is back to the initial URL (page 1)
    await expect(page.url()).toBe(initialUrl);
});

  test('➕ Verify "Add Role" button navigates to Create Role page', async ({ page, login }) => {
  const basePage = new BasePage(page);
  const rolesPage = new RolesPage(page);
  const createRolePage = new CreateRolePage(page);

  await rolesPage.navigateToRolesPage(basePage);

  // Click "Add Role" and check navigation
  await rolesPage.addRole();
  await createRolePage.assertOnCreateRolePage();
});


  test('📝 Verify "Edit" icon/button for a specific role is visible and clickable', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const rolesPage = new RolesPage(page);
    await rolesPage.navigateToRolesPage(basePage);
    const testRoleName = 'Product';
    const editIcon = rolesPage.editButton(testRoleName);
    await expect(editIcon).toBeVisible();
    await editIcon.click();
    //await expect(page.url()).toContain('/roles/edit/');
  });

  test('🗑️ Verify "Delete" icon/button is visible and clickable', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const rolesPage = new RolesPage(page);
    await rolesPage.navigateToRolesPage(basePage);
    const testRoleName = 'tech_platform';
    const deleteIcon = rolesPage.deleteButton(testRoleName);
    await expect(deleteIcon).toBeVisible();
  });
});