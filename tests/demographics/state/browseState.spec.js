import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseStatePage = require('../../../page/DemographicsPage/StatePage/BrowseStatePage');



test.describe('🌍 Browse States Section', () => {
  let basePage, statePage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    statePage = new BrowseStatePage(page);
    await statePage.goToBrowseStates(basePage);
  });

  test('✅ Verify successful navigation to Browse States page', async ({ page }) => {
    await expect(statePage.pageHeader).toBeVisible();
   // await page.close();
  });

 test('✅ Verify correct data display in the states table', async ({page}) => {
  await statePage.verifyDataIsDisplayed();
  await page.close();
});


  test('✅ Verify search functionality with a valid state name', async ({page}) => {
    await statePage.searchState('Bihar');
    await statePage.verifyStateInTable('Bihar');
    await page.close();
  });

  test('✅ Verify navigation to Edit State page via the edit icon', async ({ page }) => {
    await statePage.clickEditState('Haryana');
    await expect(page).toHaveURL(/.*\/states\/\d+/);
    await page.close();
  });

  test('✅ Verify navigation to Create State page via the add button', async ({ page }) => {
    await statePage.clickAddState();
    await expect(page).toHaveURL(/.*\/states\/create/);
    await page.close();
  });

  /*test('✅ Verify sorting functionality for the State column', async ({page}) => {
    await statePage.sortByState();
    const states = await statePage.getStates();
    const expected = [...states].sort((a, b) => a.localeCompare(b));
    await expect(states).toEqual(expected);
    await page.close();
  });*/

  test('✅ Verify search functionality with a non-existent state', async ({page}) => {
    await statePage.searchState('AtlantisState');
    await expect(statePage.stateTable).not.toContainText('AtlantisState');
    await page.close();
  });

  test('✅ Verify a state is not deleted if action is cancelled', async ({page}) => {
    await statePage.cancelDeleteState('Haryana');
    await statePage.verifyStateInTable('Haryana');
    await page.close();
  });
});
