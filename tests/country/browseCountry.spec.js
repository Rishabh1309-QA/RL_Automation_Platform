import { expect } from '@playwright/test';
import { test } from '../../fixtures';
const BasePage = require('../../page/BasePage');
const BrowseCountryPage = require('../../page/BrowseCountryPage');

test.describe('🌍 Browse Countries Section', () => {
  let basePage, countryPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    countryPage = new BrowseCountryPage(page);
    await countryPage.goToBrowseCountries(basePage);
  });

  test('✅ Verify successful navigation to Browse Countries page', async () => {
    await expect(countryPage.pageHeader).toBeVisible();
  });

  test('✅ Verify correct data display in countries table', async () => {
    await countryPage.verifyCountryInTable('India');
    await countryPage.verifyCountryInTable('Peru');
  });

  test('✅ Verify search functionality with a valid country name', async () => {
    await countryPage.searchCountry('India');
    await countryPage.verifyCountryInTable('India');
  });

  test('✅ Verify search functionality with a non-existent country', async () => {
    await countryPage.searchCountry('Atlantis');
    await expect(countryPage.countryTable).not.toContainText('Atlantis');
  });

  test('✅ Verify search functionality with special characters', async () => {
    await countryPage.searchCountry('@#$%^&*');
    await expect(countryPage.countryTable).not.toContainText('@#$%^&*');
  });

  test('✅ Verify navigation to Edit Country page via edit icon', async ({ page }) => {
    await countryPage.clickEditCountry('India');
    await expect(page).toHaveURL(/.*\/countries\/\d+/);
  });

  test('✅ Verify navigation to Create Country page via Add button', async ({ page }) => {
    await countryPage.clickAddCountry();
    await expect(page).toHaveURL(/.*\/countries\/create/);
  });

  test('✅ Verify ISO code column sorts Ascending and Descending', async () => {
  await countryPage.verifyIsoSorting();
});


  test('✅ Verify country is not deleted if action is cancelled', async () => {
    await countryPage.cancelDeleteCountry('India');
    await countryPage.verifyCountryInTable('India');
  });
});
