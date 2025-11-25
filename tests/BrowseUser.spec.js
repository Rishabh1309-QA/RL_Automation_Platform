import { expect } from '@playwright/test';
import { test } from '../fixtures'; // Using your fixture setup
import BasePage from '../page/BasePage'; // Using your page object class
import BrowseUserPage from '../page/BrowseUserPage'; // Using your page object class

test.describe('👥 Browse User Section', () => {

  // Your existing test cases are preserved here.
  test('✅ Verify Global Search with Exact Match', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.searchUser('Janvi sharma');
    await browseUserPage.assertUserVisible('Janvi sharma');
  });

  test('🔍 Verify Global Search with Partial Match', async ({ page, login }) => {
    const basePage = new BasePage(page); // Corrected this line to use BasePage
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.searchUser('Janvi');
    await browseUserPage.assertUserVisible('Janvi sharma');
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

    await browseUserPage.sortByName();
    // Click again → Ascending
    await browseUserPage.sortByName();

    // Now capture names for Ascending validation
    const names = await browseUserPage.getUserNames();
    const normalizedNames = names.map(n => n.trim().toLowerCase());

    // Assert ascending
    for (let i = 0; i < normalizedNames.length - 1; i++) {
      const current = normalizedNames[i];
      const next = normalizedNames[i + 1];
      expect(current.localeCompare(next) <= 0).toBeTruthy();
    }
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
    const testUserName = 'Prathamesh baisware';

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
    const testUserName = 'Janvi sharma';

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
    const testUserName = 'Harshita saxena';

    await browseUserPage.goToBrowseUser(basePage);
    console.log(`Attempting to cancel deletion for user: ${testUserName}`);

    // We now have a more robust method that finds the specific row and clicks the buttons.
    await browseUserPage.cancelDeleteAndVerify(testUserName);

    console.log(`Successfully verified that ${testUserName} is still visible after cancellation.`);
  });
});