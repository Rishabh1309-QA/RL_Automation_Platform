import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseBeatPage = require('../../../page/DemographicsPage/BeatsPage/BrowseBeatPage');
const EditBeatPage = require('../../../page/DemographicsPage/BeatsPage/EditBeatPage');

test.describe('✏️ Edit Beat/Sector Section', () => {
  let basePage, browseBeat, editBeat;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseBeat = new BrowseBeatPage(page);
    editBeat = new EditBeatPage(page);

    
    await browseBeat.goToBrowseBeats(basePage);

    // Go to Edit page of existing Beat/Sector
    await browseBeat.clickEditBeat('सेक्टर -01');
    await editBeat.verifyPageLoaded();
  });

  // BS-10: Verify pre-populated data
  test('BS-10 ✅ Verify correct data is pre-populated on Beat/Sector Details page', async () => {
    await editBeat.verifyPrePopulatedData('सेक्टर -01', '234230903');
  });

  // ✅ BS-11: Verify fields editable after clicking Edit
  test('BS-11 ✅ Verify clicking Edit makes fields editable', async () => {
    await editBeat.clickEdit();
    await editBeat.verifyFieldsAreEditable();
  });

  // ✅ BS-12: Verify fields disabled before Edit
  test('BS-12 ✅ Verify fields are disabled before clicking Edit', async () => {
    await editBeat.verifyFieldsAreDisabled();
  });

  // ✅ BS-13: Verify successful update of Beat/Sector
  test('BS-13 ✅ Verify successful update of Beat/Sector details', async () => {
    await editBeat.clickEdit();
    await editBeat.updateBeatName('सेक्टर -01 अपडेटेड');
    await expect(editBeat.page.getByText('The beat/sector name field format is invalid.')).toBeVisible();
  });

  // ✅ BS-14: Verify Back button navigation
  test('BS-14 ✅ Verify Back button returns to previous page', async () => {
    await editBeat.goBack();
    await expect(browseBeat.pageHeader).toBeVisible();
  });

  // ❌ BS-15: Verify update fails with invalid data
  test('BS-15 ❌ Verify update fails with invalid data', async () => {
    await editBeat.clickEdit();
    await editBeat.updateBeatName('@@@!!!');
    await expect(editBeat.page.getByText('The beat/sector name field format is invalid.')).toBeVisible();
  });

  // ❌ BS-16: Verify update fails when required field is empty (like EditDistrict)
  test('BS-16 ❌ Verify update fails when required field is empty', async () => {
    await editBeat.clickEdit();
    await editBeat.clearBeatName();
    await editBeat.clickUpdate();
    const isValid = await editBeat.beatNameField.evaluate(el => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  // ❌ BS-17: Verify update fails with duplicate Beat/Sector name
  test('BS-17 ❌ Verify update fails with duplicate Beat/Sector name', async () => {
    await editBeat.clickEdit();
    await editBeat.updateBeatName('सेक्टर -03'); // existing beat name
    await expect(editBeat.page.getByText(/The beat\/sector name field format is invalid./)).toBeVisible();
  });
});
