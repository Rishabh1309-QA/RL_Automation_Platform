import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseStatePage = require('../../../page/DemographicsPage/StatePage/BrowseStatePage');
const CreateStatePage = require('../../../page/DemographicsPage/StatePage/CreateStatePage');

test.describe('🌍 Create State Section', () => {
  let basePage, browseStatePage, createPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseStatePage = new BrowseStatePage(page);
    createPage = new CreateStatePage(page);

    // Navigate → Create State
    await basePage.goToCreateState();
  });

  // 1️⃣ Create & Delete flow
  test('SC-01 ✅ Verify a new state can be successfully created', async () => {
    const stateName = 'Ladakh';
    const stateCode = 'LA';
    const countryName = 'India'; // existing country

    // Create
    await createPage.form.fillForm({
      country: countryName,
      name: stateName,
      code: stateCode,
    });
    await createPage.form.create();

    // Verify it appears
    await expect(browseStatePage.stateRow(stateName)).toBeVisible();

    // Cleanup: Delete the state
    await browseStatePage.deleteState(stateName);
  });

  // 2️⃣ Reset button
  test('SC-02 ✅ Verify Reset button clears all input fields', async () => {
    await createPage.form.fillForm({ country: 'India', name: 'TempState', code: 'TMP' });
    await createPage.form.reset();

    await expect(createPage.form.nameField).toHaveValue('');
    await expect(createPage.form.codeField).toHaveValue('');
  });

  // 3️⃣ Back button
  test('SC-03 ✅ Verify Back button returns to Browse States', async () => {
    await createPage.form.back();
    await expect(browseStatePage.pageHeader).toBeVisible();
  });

  // 4️⃣ Duplicate code
  test('SC-04 ❌ Verify creation fails with duplicate state code', async () => {
    await createPage.form.fillForm({ country: 'India', name: 'DuplicateState', code: 'DL' }); // assume DL exists
    await createPage.form.create();
    await expect(createPage.page.getByText('The state code has already been taken.')).toBeVisible();
  });

  // 5️⃣ Empty fields
  test('SC-05 ❌ Verify creation fails with empty required fields', async () => {
    await createPage.form.fillForm({ country: '', name: '', code: '' });
    await createPage.form.create();
    await expect(createPage.page.locator('input:invalid')).toHaveCount(3);
  });

  // 6️⃣ Invalid data
  test('SC-06 ❌ Verify creation fails with invalid data', async () => {
    await createPage.form.fillForm({ country: 'India', name: '123@@@', code: 'INV#1' });
    await createPage.form.create();

    await expect(createPage.page.getByText('The state code field must only contain letters.')).toBeVisible();
    await expect(createPage.page.getByText('The state code field must not be greater than 3 characters.')).toBeVisible();
    await expect(createPage.page.getByText('The state name field format is invalid.')).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
