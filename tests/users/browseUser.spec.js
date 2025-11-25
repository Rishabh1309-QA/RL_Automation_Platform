// --- File: tests/browseUser.spec.js ---
import { expect } from '@playwright/test';
import { test } from '../../fixtures';
import BasePage from '../../page/BasePage';
import BrowseUserPage from '../../page/UsersPage/BrowseUserPage';

test.describe('👥 Browse User Section', () => {

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
    await page.locator("//html/body/main/div/div[1]/div/div/div[4]/div/div[2]/div/div[1]/div")
      .waitFor({ state: 'visible' });
  });

  test('⬆️ Sort Users by Name (Ascending)', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.sortByName();
    await browseUserPage.sortByName(); // second click → ascending

    const names = await browseUserPage.getUserNames();
    const normalizedNames = names.map(n =>
      n.normalize('NFKD').replace(/\s+/g, ' ').trim().toLowerCase()
    );

    const sorted = [...normalizedNames].sort((a, b) => a.localeCompare(b));
    expect(normalizedNames).toEqual(sorted);
  });

  test('⬇️ Sort Users by Name (Descending)', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.sortByName();
    await browseUserPage.sortByName(); // second click → descending
    await page.waitForTimeout(500);

    const names = await browseUserPage.getUserNames();
    const normalizedNames = names.map(n => n.trim().toLowerCase());

    for (let i = 0; i < normalizedNames.length - 1; i++) {
      expect(normalizedNames[i].localeCompare(normalizedNames[i + 1]))
        .toBeGreaterThanOrEqual(0);
    }
  });

  test('✅ Check Edit button Clickable', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);
    const testUserName = 'Radhika k';

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.settingIcon(testUserName);
    await browseUserPage.editUserAndVerify();
    await browseUserPage.updateUser();

    await page.close();
    
  });

  test('❌ Edit user - should not update when role is removed', async ({ page, login }) => {
  const basePage = new BasePage(page);
  const browseUserPage = new BrowseUserPage(page);
  
  const testUserName = 'Radhika k';

  await browseUserPage.goToBrowseUser(basePage);
  await browseUserPage.settingIcon(testUserName);
  await browseUserPage.editUserAndVerify(); 
  await browseUserPage.chooseRole();
  await browseUserPage.clearRole();
  await browseUserPage.updateUser();
  
  await page.close();
});


  test('❌ Edit user - should update when role is updated', async ({ page, login }) => {
  const basePage = new BasePage(page);
  const browseUserPage = new BrowseUserPage(page);
  
  const testUserName = 'Radhika k';

  await browseUserPage.goToBrowseUser(basePage);
  await browseUserPage.settingIcon(testUserName);
  await browseUserPage.editUserAndVerify(); 
  await browseUserPage.chooseRole();
  await browseUserPage.clearRole();
  await browseUserPage.updateRole('PlatformAdmin');

  await browseUserPage.updateUser();
  
  await page.close();
});


  test('✅ Should successfully delete a user', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);
    const testUserName = 'Jaya khilnani';

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.deleteUserAndVerify(testUserName);
  });

  test('❌ Should cancel deletion and keep the user in the list', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);
    const testUserName = 'Platform pbpb api user';

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.cancelDeleteAndVerify(testUserName);
  });

  test('➡️ Navigate until last page (Next should be disabled)', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);

    let pageCounter = 1;
    while (await browseUserPage.isNextButtonEnabled()) {
      await browseUserPage.goToNextPage();
      pageCounter++;
    }

    await expect(await browseUserPage.isNextButtonEnabled()).toBeFalsy();
    console.log(`✅ Reached last page after ${pageCounter} pages.`);
  });

  test('⬅️ Navigate back to first page (Previous should be disabled)', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await browseUserPage.goToLastPage();

    let pageCounter = 0;
    while (await browseUserPage.isPreviousButtonEnabled()) {
      await browseUserPage.goToPreviousPage();
      pageCounter++;
    }

    await expect(await browseUserPage.isPreviousButtonEnabled()).toBeFalsy();
    console.log(`✅ Returned to first page after ${pageCounter} steps.`);
  });

  test('➡️ Should navigate to the next page and back', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    const initialUrl = page.url();

    await browseUserPage.goToNextPage();
    await expect(page.url()).not.toBe(initialUrl);

    await page.goBack();
    await expect(page.url()).toBe(initialUrl);
  });

  test('⏸️ "Previous" button should be disabled on the first page', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseUserPage = new BrowseUserPage(page);

    await browseUserPage.goToBrowseUser(basePage);
    await expect(await browseUserPage.isPreviousButtonEnabled()).toBeFalsy();
  });

});
