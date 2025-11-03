import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseDistrictPage = require('../../../page/DemographicsPage/DistrictPage/BrowseDistrictPage');

test.describe('📍 Browse Districts Section', () => {
  let basePage, browseDistrict;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseDistrict = new BrowseDistrictPage(page);
    await browseDistrict.goToBrowseDistricts(basePage);
  });

  test('BD-01 ✅ Navigate to Browse Districts', async () => {
    await expect(browseDistrict.pageHeader).toBeVisible();
  });

  test('BD-02 ✅ Correct data display in districts table', async ({page}) => {
  await page.waitForLoadState('networkidle', { timeout: 15000 });
    await expect(browseDistrict.districtTable).toBeVisible();
    
  });

  test('BD-03 ✅ Search valid district', async () => {
    await browseDistrict.searchDistrict('Test Punjabi');
    await expect(browseDistrict.districtTable).toContainText('Test Punjabi');
  });

  test('BD-04 ✅ Navigate to Edit via edit icon', async ({ page }) => {
    await browseDistrict.clickEditDistrict('Test Punjabi');
    await expect(page).toHaveURL(/.*\/districts\/\d+/);
  });

  test('BD-05 ✅ Navigate to Create via add button', async ({ page }) => {
    await browseDistrict.clickAddDistrict();
    await expect(page).toHaveURL(/.*\/districts\/create/);
  });

  test('BD-07 ✅ Search non-existent district', async () => {
    await browseDistrict.searchDistrict('AtlantisDistrict');
    await expect(browseDistrict.districtTable).not.toContainText('AtlantisDistrict');
  });

  test('BD-08 ✅ Search special characters', async () => {
    await browseDistrict.searchDistrict('@#$%^^');
    await expect(browseDistrict.districtTable).not.toContainText('@#$%^^');
  });

  test('BD-09 ✅ Cancel delete keeps district', async () => {
    await browseDistrict.cancelDeleteDistrict('Test Punjabi');
  });

test('Verify user can filter districts by Country and State', async () => {
    await browseDistrict.openFilters();
    console.log('Filter panel opened');
    await browseDistrict.selectCountry('India');
    console.log('Country selected: India');
    await browseDistrict.selectState('Punjab');
    console.log('State selected: Punjab');
    await browseDistrict.search();

    // ✅ Validate results contain "Punjab"
    await browseDistrict.verifyFilterResults('Punjab');
});

 test('BD-11 ✅ Reset filter works', async () => {
    await browseDistrict.openFilters();
    console.log('Filter panel opened');
    await browseDistrict.selectCountry('India');
    console.log('Country selected: India');
    await browseDistrict.selectState('Punjab');
    console.log('State selected: Punjab');
    await browseDistrict.resetFilters();
  });

  

});
