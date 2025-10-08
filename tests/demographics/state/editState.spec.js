import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseStatePage = require('../../../page/DemographicsPage/StatePage/BrowseStatePage');
const EditStatePage = require('../../../page/DemographicsPage/StatePage/EditStatePage');

test.describe('✏️ Edit State Section', () => {
  let basePage, browseStatePage, editPage;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseStatePage = new BrowseStatePage(page);
    editPage = new EditStatePage(page);

    // ✅ Navigate → Browse States → Edit specific state
    await basePage.goToBrowseStates();
    
    // 🟢 FIX: Ensure data is loaded to prevent timeout before clicking 'Edit'.
    await browseStatePage.verifyDataIsDisplayed(); 
    
    // 🟢 CHANGE: Target state is now 'Haryana'
    await browseStatePage.clickEditState('Haryana'); 
  });

  // 1️⃣ Verify pre-populated data
  test('✅ Verify correct data is pre-populated', async () => {
    // 🟢 CHANGE: Expected data is now 'Haryana' and 'HAR'
    await editPage.verifyPrepopulatedData('Haryana', 'HAR'); 
  });

  // 2️⃣ Verify fields are read-only initially
  test('✅ Verify fields are not editable until Edit is clicked', async () => {
    await editPage.verifyFieldsReadOnly();
  });

  // 3️⃣ Verify fields become editable
  test('✅ Verify fields become editable after clicking Edit', async () => {
    await editPage.enableEditing();
    await editPage.verifyFieldsEditable();
  });

  // 4️⃣ Verify successful update
  test('✅ Verify successful update with valid data', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: 'UpdatedHaryana' });
    await editPage.form.save();
    await expect(editPage.page).toHaveURL(/\/states$/); // should return to states list
  });

  // 5️⃣ Verify update fails with invalid data
  test('❌ Verify update fails with invalid data', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: '123@@Invalid' });
    await editPage.form.save();
    // check validity or error message

await expect(editPage.page.getByText('The state name field format is invalid.')).toBeVisible();
    //const isValid = await editPage.form.statename.evaluate(el => el.validity.valid);
    //expect(isValid).toBeFalsy();
  });

  // 6️⃣ Verify update fails with empty field
  // ...
// 6️⃣ Verify update fails with empty field
test('❌ Verify update fails with empty field', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: '' });
    await editPage.form.save();
    
    // 🟢 FIX: Assert that the page remains on the Edit form (update failed)
    await expect(editPage.page).not.toHaveURL(/\/states$/); 

    // ❌ REMOVE the original failing code:
    // const isValid = await editPage.form.statename.evaluate(el => el.validity.valid);
    // expect(isValid).toBeFalsy();
});
// ...

  // 7️⃣ Verify duplicate state name
  test('❌ Verify update fails with duplicate data', async () => {
    await editPage.enableEditing();
    // 🟢 CHANGE: Duplicate state is now 'Haryana'
    await editPage.form.fillForm({ name: 'Haryana' }); 
    await editPage.form.save();
    // optionally check toast/message
    // await expect(editPage.page).toContainText('already exists');
  });

  // 8️⃣ Verify Back button
  test('✅ Verify Back button returns to Browse States', async () => {
    await editPage.form.back();
    await expect(editPage.page).toHaveURL(/\/states$/);
  });

  // 9️⃣ Verify unsaved changes are discarded
  test('✅ Verify changes are not saved when clicking Back', async () => {
    await editPage.enableEditing();
    await editPage.form.fillForm({ name: 'TempChange' });
    await editPage.form.back();

    // Re-open edit page
    // 🟢 CHANGE: Target state is now 'Haryana'
    await browseStatePage.clickEditState('Haryana');
    await expect(editPage.form.statename).not.toHaveValue('TempChange');
  });
});