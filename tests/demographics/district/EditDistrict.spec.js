import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseDistrictPage = require('../../../page/DemographicsPage/DistrictPage/BrowseDistrictPage');
const EditDistrictPage = require('../../../page/DemographicsPage/DistrictPage/EditDistrictPage');

test.describe('✏️ Edit District Section', () => {
  let basePage, browsePage, editPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browsePage = new BrowseDistrictPage(page);
    editPage = new EditDistrictPage(page);

    await basePage.goToBrowseDistricts();
    await browsePage.clickEditDistrict('Test Punjabi'); // existing district used as base
  });

  test('ED-01 ✅ Pre-populated data correct', async () => {
    await editPage.verifyPrepopulatedData('Test Punjabi', 'India (IND)', 'Punjab (PB)');
  });

  test('ED-02 ✅ Fields are read-only before Edit', async () => {
    await editPage.verifyFieldsReadOnly();
  });

  test('ED-03 ✅ Fields editable after clicking Edit', async () => {
    await editPage.enableEditing();
    await editPage.verifyFieldsEditable();
  });

 test('ED-04 ✅ Successful update', async ({ page }) => { // Ensure 'page' is destructured if needed
    // Define both names for clarity and correctness
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: 'Test Punjabi' }); // Change to a new valid name
    await editPage.form.save();
    await expect(page).toHaveURL("https://v2.dev.lilyogis.in/districts");
});
  test('ED-05 ❌ Update fails with invalid data', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: '123@###' });
    await editPage.form.save();
    await expect(editPage.page.getByText(/invalid|must only contain letters/)).toBeVisible();
  });

  test('ED-06 ❌ Update fails when required field empty', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: '' });
    await editPage.form.save();
    const isValid = await editPage.form.districtName.evaluate(el => el.validity.valid);
    expect(isValid).toBeFalsy();
  });


  test('ED-08 ✅ Back returns to browse without saving', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: 'TempChange' });
    await editPage.form.back();
    await browsePage.clickEditDistrict('Test Punjabi');
    await editPage.verifyPrepopulatedData('Test Punjabi', 'India', 'Punjab');
  });

});
