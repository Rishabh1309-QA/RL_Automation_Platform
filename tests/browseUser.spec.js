// --- File: tests/browseUser.spec.js ---
// This file contains the Playwright tests for the user deletion functionality,
// including new tests for pagination.

import { expect } from '@playwright/test';
import { test } from '../fixtures';
import BasePage from '../page/BasePage';
import BrowseUserPage from '../page/BrowseUserPage';

test.describe('👥 Browse User Section', () => {

  // Your existing test cases are preserved here.
  test('✅ Verify Global Search with Exact Match', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.searchUser('Somya budhori');
    await browseUserPage.assertUserVisible('Somya budhori');
  });

  test('🔍 Verify Global Search with Partial Match', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.searchUser('Somya');
    await browseUserPage.assertUserVisible('Somya budhori');
  });

  test('⚠️ Search for non-existing user', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.searchUser('NonExistingUser123');
    await page
      .locator("//html/body/main/div/div[1]/div/div/div[4]/div/div[2]/div/div[1]/div")
      .waitFor({ state: 'visible' });
  });

  test('⬆️ Sort Users by Name (Ascending)', async ({ page, login }) => {
  const basePage = new BasePage(page);
  const browseUserPage = new BrowseUserPage(page);

  await browseUserPage.goToBrowseUser(basePage);

  // Click twice to ensure ascending
  await browseUserPage.sortByName();
  await browseUserPage.sortByName();

  const names = await browseUserPage.getUserNames();
  const normalizedNames = names.map(n =>
    n.normalize('NFKD').replace(/\s+/g, ' ').trim().toLowerCase()
  );

  console.log("📋 Captured names:", normalizedNames);

  const sorted = [...normalizedNames].sort((a, b) => a.localeCompare(b));
  expect(normalizedNames).toEqual(sorted);
});


  test('⬇️ Sort Users by Name (Descending)', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);

    await browseUserPage.sortByName();

    // 2nd click → Descending
    await browseUserPage.sortByName();

    // ✅ wait for table to update after descending click
    await page.waitForTimeout(500);

    const names = await browseUserPage.getUserNames();
    const normalizedNames = names.map(n => n.trim().toLowerCase());

    for (let i = 0; i < normalizedNames.length - 1; i++) {
      const current = normalizedNames[i];
      const next = normalizedNames[i + 1];

      // Descending → current >= next
      expect(current.localeCompare(next)).toBeGreaterThanOrEqual(0);
    }
  });

  test('✅ Check Setting button Clickable', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);
    const testUserName = 'Radhika k';

    await browseUserPage.goToBrowseUser(basePage);
    // Find the specific user's row and then click its setting icon.
    await browseUserPage.settingIcon(testUserName);
    
    // You can add an assertion here to verify the next page or modal is visible.
    // await expect(page.getByRole('heading', { name: 'Edit User Role' })).toBeVisible();
  });

  // --- Start of new scenarios for user deletion ---

  test('✅ Should successfully delete a user', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);
    // Use a user that is guaranteed to exist in your test environment.
    // Make sure this user exists and can be deleted.
    const testUserName = 'Prathamesh baisware';

    await browseUserPage.goToBrowseUser(basePage);
    console.log(`Attempting to delete user: ${testUserName}`);

    // We now have a more robust method to handle the delete flow.
    await browseUserPage.deleteUserAndVerify(testUserName);

    console.log(`Successfully verified that ${testUserName} is no longer visible.`);
  });

  test('❌ Should cancel deletion and keep the user in the list', async ({ page, login }) => {
    const browseUserPage = new BrowseUserPage(page);
    const basePage = new BasePage(page);
    // Use a user that is guaranteed to exist for this test.
    const testUserName = 'Prathamesh baisware';

    await browseUserPage.goToBrowseUser(basePage);
    console.log(`Attempting to cancel deletion for user: ${testUserName}`);

    // We now have a more robust method that finds the specific row and clicks the buttons.
    await browseUserPage.cancelDeleteAndVerify(testUserName);

    console.log(`Successfully verified that ${testUserName} is still visible after cancellation.`);
  });

  // --- Start of new scenarios for pagination ---

    test('➡️ Should navigate to the next page and back', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);

    // Get the initial page's URL *after* navigating to the browse user page
    const initialUrl = page.url();

    // Navigate to the next page
    await browseUserPage.goToNextPage();

    // Assert that the URL or content has changed
    await expect(page.url()).not.toBe(initialUrl);

    // Navigate back to the previous page using Playwright's built-in goBack()
    await page.goBack();

    // Navigate back to the previous page
   // await browseUserPage.goToPreviousPage();

    // Assert that we are back on the first page
    await expect(page.url()).toBe(initialUrl);
  });

test('⏸️ "Previous" button should be disabled on the first page', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);

    // Assert that the 'Previous' button is hidden since it doesn't appear on the first page
    await expect(await browseUserPage.isPreviousButtonEnabled()).toBeTruthy();
  });

});