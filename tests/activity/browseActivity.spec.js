import { expect } from '@playwright/test';
import { test } from '../../fixtures';
const BasePage = require('../../page/BasePage');
const BrowseActivityPage = require('../../page/ActivityPage/BrowseActivityPage').default;


test.describe('Browse Activities Module', () => {
  let browseActivityPage;
  let basePage;


test.beforeEach(async ({page, login}) => {
    basePage = new BasePage(page);
    browseActivityPage = new BrowseActivityPage(page);
    await browseActivityPage.openActivitiesMenu();
    await browseActivityPage.goToBrowseActivities();
       await page.waitForTimeout(3000); 
});

  test('✅ Verify navigation in Browse Activities page', async () => {
    await browseActivityPage.verifyActivitiesPage();
  });

  test('✅ Verify Next and Previous buttons are working', async () => {
    await browseActivityPage.navigateNext();
    await browseActivityPage.navigatePrevious();
  });  

   test('✅ Verify + icon lands on Create Activity page', async () => {
    await browseActivityPage.clickPlusIcon();
    await browseActivityPage.verifyCreateActivityPage();
  });

  test('✅ Verify on Create Activity page clicking on Back button navigates to Browse Activities', async ({ page }) => {

    // Step 1: Click + icon and verify Create Activity
    await browseActivityPage.clickPlusIcon();
    await browseActivityPage.verifyCreateActivityPage();

    // Step 2: Click Back and verify Browse Activities page
    await browseActivityPage.clickBackButton();
    await browseActivityPage.verifyBrowseActivitiesPage();
  });

  test('Verify Filter icon is clickable', async ({ page }) => {
    await browseActivityPage.openFilters();
  });

 // test('Verify Filters sidebar opens after clicking filter icon', async ({ page }) => {
  // Open Filters
//  await browseActivityPage.openFilters();
   // await expect(page.getByText('Filters')).toBeVisible();

//});

test('✅ Verify filter sidebar can be opened and closed', async ({ page }) => {
    await browseActivityPage.openFilters();

    // Close Filters sidebar (cross button)
    await browseActivityPage.closeFilters();
  });


  });