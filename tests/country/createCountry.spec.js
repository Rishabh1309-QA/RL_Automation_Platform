import { expect } from '@playwright/test';
import { test } from '../../fixtures';
const BasePage = require('../../page/BasePage');
const BrowseCountryPage = require('../../page/BrowseCountryPage');
const CreateCountryPage = require('../../page/CreateCountryPage');

test.describe('🌍 Create Country Section', () => {
  let basePage, browseCountryPage, createPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseCountryPage = new BrowseCountryPage(page);
    createPage = new CreateCountryPage(page);
    
    // Navigate → Browse Countries → Create New
    await basePage.goToCreateCountry();
    //await browseCountryPage.clickCreateCountry(basePage);
  });

test('CC-01 ✅ Verify a new country can be successfully created', async () => {
  const countryName = `Afganistan`;
  const isoCode = `AFG`;

  // Create
  await createPage.form.fillForm({ name: countryName, iso: isoCode });
  await createPage.form.create();

  // Verify it appears
  await expect(browseCountryPage.countryRow(countryName)).toBeVisible();

  // Cleanup: Delete the country
  await browseCountryPage.deleteCountry(countryName);
});


  test('CC-02 ✅ Verify Reset button clears all input fields', async () => {
    await createPage.form.fillForm({ name: 'TempCountry', iso: 'TC' });
    await createPage.form.reset();
    await expect(createPage.form.nameField).toHaveValue('');
    await expect(createPage.form.isoField).toHaveValue('');
  });

  test('CC-03 ✅ Verify Back button returns to Browse Countries', async () => {
    await createPage.form.back();
    await expect(browseCountryPage.pageHeader).toBeVisible();
  });

  test('CC-04 ❌ Verify creation fails with duplicate ISO code', async () => {
    await createPage.form.fillForm({ name: 'DuplicateCountry', iso: 'IND' }); // assuming IND exists
    await createPage.form.create();
    await expect(createPage.page.getByText('The country code has already been taken.')).toBeVisible();
  });

  test('CC-05 ❌ Verify creation fails with empty required fields', async () => {
    await createPage.form.fillForm({ name: '', iso: '' });
    await createPage.form.create();
    await expect(createPage.page.locator('input:invalid')).toHaveCount(2); // both required
  });

test('CC-06 ❌ Verify creation fails with invalid data', async () => {
  await createPage.form.fillForm({ name: '123@###', iso: 'INvalid@1' });
  await createPage.form.create();

  // Expect all validation errors to show up
  await expect(createPage.page.getByText('The country code field must only contain letters.')).toBeVisible();
  await expect(createPage.page.getByText('The country code field must be 3 characters.')).toBeVisible();
  await expect(createPage.page.getByText('The country code field must be uppercase.')).toBeVisible();
});

  test.afterEach(async ({ page }) => {
    await page.close();
  });     

});
