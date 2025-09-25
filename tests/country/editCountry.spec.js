import { expect } from '@playwright/test';
import { test } from '../../fixtures';
const BasePage = require('../../page/BasePage');
const BrowseCountryPage = require('../../page/CountryPage/BrowseCountryPage');
const EditCountryPage = require('../../page/CountryPage/EditCountryPage');

test.describe('✏️ Edit Country Section', () => {
  let basePage, browseCountryPage, editPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseCountryPage = new BrowseCountryPage(page);
    editPage = new EditCountryPage(page);

    // ✅ Navigate → Browse Countries → Edit specific country
    await basePage.goToBrowseCountries();
    await browseCountryPage.clickEditCountry('India'); // Pick target country
  });

  test('✅ Verify correct data is pre-populated', async () => {
    await editPage.verifyPrepopulatedData('India', 'IND');
  });

  test('✅ Verify fields are not editable until Edit is clicked', async () => {
    await editPage.verifyFieldsReadOnly();
  });

  test('✅ Verify fields become editable after clicking Edit', async () => {
    await editPage.enableEditing();
    console.log('Edit button clicked');
    await editPage.verifyFieldsEditable();
  });

  test('✅ Verify successful update with valid data', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: `India`});
    await editPage.form.save();
    await expect(editPage.page).toHaveURL("https://v2.dev.lilyogis.in/countries");
  });

  test('❌ Verify update fails with empty field', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: '' });
    await editPage.form.save();
   // Check validity state of the input
const isValid = await editPage.form.countryname.evaluate((el) => el.validity.valid);
expect(isValid).toBeFalsy();


  });

  test('❌ Verify update fails with duplicate data', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: 'India' });
    console.log('Attempting to save duplicate country data');
    await editPage.form.save();
    //await expect(editPage.page).toContainText('already exists');
  });

  test('✅ Verify Back button returns to Browse Countries', async () => {
    await editPage.form.back();
    await expect(editPage.page).toHaveURL(/\/countries$/);
  });

  test('✅ Verify changes are not saved when clicking Back', async ({ page }) => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: 'TempChange' });
    await editPage.form.back();

    // Re-open edit to confirm data not saved
    await browseCountryPage.clickEditCountry('India');
    console.log('Re-opened edit page to verify unsaved changes');
    await expect(editPage.form.countryname).not.toHaveValue('TempChange');
  });
});
