import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseBeatPage = require('../../../page/DemographicsPage/BeatsPage/BrowseBeatPage');
const CreateBeatPage = require('../../../page/DemographicsPage/BeatsPage/CreateBeatPage');

test.describe('📌 Create Beat/Sector Section', () => {
  let basePage, browseBeatPage, createPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseBeatPage = new BrowseBeatPage(page);
    createPage = new CreateBeatPage(page);

    // ✅ Navigate to Create Beat/Sector page
    await basePage.goToCreateBeat();
    await createPage.verifyPageLoaded();
  });

  // ✅ BS-18: Create new Beat/Sector successfully
  test('BS-18 ✅ Verify a new Beat/Sector can be successfully created', async () => {
    const beatName = 'Dhanapur';
    const beatCode = '12345561';
    const districtName = 'Adilabad';
    const projectName = 'Test (00426)';

    // Fill and submit form
    await createPage.form.fillForm({
      name: beatName,
      code: beatCode,
      district: districtName,
      project: projectName,
    });

    await createPage.form.create();

    // Verify entry in browse table
    await expect(browseBeatPage.beatRow(beatName)).toBeVisible({ timeout: 20000 });

    // ✅ Cleanup (delete created beat)
    await browseBeatPage.deleteBeat(beatName);
  });

  // ✅ BS-19: Reset button clears all fields
  test('BS-19 ✅ Verify Reset button clears all input fields', async () => {
    await createPage.form.fillForm({
      name: 'ResetCheck',
      code: 'RC01',
      district: 'Adilabad',
    });

    await createPage.form.reset();

    await expect(createPage.form.beatName).toHaveValue('');
    await expect(createPage.form.beatCode).toHaveValue('');
  });

  // ✅ BS-20: Back button navigation
  test('BS-20 ✅ Verify Back button returns to Browse Beats/Sectors page', async () => {
    await createPage.form.back();
    await expect(browseBeatPage.pageHeader).toBeVisible({ timeout: 10000 });
  });

  // ❌ BS-21: Duplicate Beat/Sector creation fails
  test('BS-21 ❌ Verify creation fails with duplicate Beat/Sector', async () => {
    await createPage.form.fillForm({
      name: 'सेक्टर -04', // already existing
      code: '234230905',
      district: 'Shivpuri',
      project: 'शिवपुरी नवीन (2342309)',
    });

    await createPage.form.create();

    await expect(
      createPage.page.getByText(/The beat\/sector code has already been taken./)
    ).toBeVisible({ timeout: 10000 });
  });

  // ❌ BS-22: Empty required fields
  test('BS-22 ❌ Verify creation fails when required fields are empty', async () => {
    await createPage.form.fillForm({ name: '', code: '', district: '', project: '' });
    await createPage.form.create();
    // Verify form shows invalid required inputs
    const invalidInputs = createPage.page.locator('input:invalid');
    await expect(invalidInputs).toHaveCount(3);
  });

  // ❌ BS-23: Invalid data validation
  test('BS-23 ❌ Verify creation fails with invalid data', async () => {
    await createPage.form.fillForm({
      name: '123@@',
      code: 'invalid@',
      district: 'Adilabad',
      project: 'Test (00426)',
    });

    await createPage.form.create();

    await expect(
      createPage.page.getByText('The beat/sector name field format is invalid.')
    ).toBeVisible({ timeout: 10000 });

    await expect(
      createPage.page.getByText('The beat/sector code field must be a number.')
    ).toBeVisible({ timeout: 10000 });

    await expect(
      createPage.page.getByText('The beat/sector code field must be between 8 and 9 digits.')
    ).toBeVisible({ timeout: 10000 });
  });

  test.afterEach(async ({ page }) => {
    await page.close();
  });
});
