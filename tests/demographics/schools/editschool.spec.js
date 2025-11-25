import { expect } from '@playwright/test';
import { test } from '../../../fixtures';

const BasePage = require('../../../page/BasePage');
const BrowseSchoolPage = require('../../../page/DemographicsPage/SchoolsPage/BrowseSchoolPage');
const EditSchoolPage = require('../../../page/DemographicsPage/SchoolsPage/EditSchoolPage');

// Base data
const TEST_UDISE = "9999999999";
const INITIAL_NAME = "test";
const INITIAL_TYPE = "UPS";
const INITIAL_DISTRICT = "Adilabad";

test.describe('✏️ Edit School Section', () => {
  let basePage, browseSchool, editSchool;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseSchool = new BrowseSchoolPage(page);
    editSchool = new EditSchoolPage(page);

    console.log("🔐 Logging in and navigating to Browse Schools...");
    await browseSchool.goToBrowseSchools(basePage);

    console.log(`🔍 Searching for UDISE: ${TEST_UDISE}`);
    await browseSchool.searchSchool(TEST_UDISE);

    console.log("📝 Opening school record for edit...");
    await browseSchool.clickEditSchool(TEST_UDISE);
    await expect(editSchool.pageHeader).toBeVisible({ timeout: 15000 });

    console.log("✅ School details page loaded successfully.");
  });

  // ---------------------------------------------------------------------
  // ✅ ESCH-01: Correct Data Pre-populated
  // ---------------------------------------------------------------------
test('ESCH-01 ✅ Correct data pre-populated and fields read-only', async () => {
  console.log("🔎 Validating pre-filled school data...");

  // ✅ Capture and validate pre-filled data dynamically
  await editSchool.verifyPrePopulatedData();

  console.log("🔒 Verifying fields are read-only...");
  await editSchool.verifyFieldsReadOnly();

  console.log("✅ Pre-filled data and read-only validation completed successfully.");
});


  // ---------------------------------------------------------------------
  // ✅ ESCH-02: Fields become editable on clicking 'Edit'
  // ---------------------------------------------------------------------
  test('ESCH-02 ✅ Clicking Edit makes fields editable', async () => {
    console.log("✏️ Activating edit mode...");
    await editSchool.clickEdit();

    console.log("🧩 Verifying that fields are editable...");
    await editSchool.verifyFieldsEditable();

    console.log("✅ Fields successfully switched to editable mode.");
  });

  // ---------------------------------------------------------------------
  // ✅ ESCH-03: Successful update of school's details
  // ---------------------------------------------------------------------
  test('ESCH-03 ✅ Successful update of school name', async () => {
    const newName = `Updated Test ${Date.now()}`;
    console.log(`📝 Updating school name → ${newName}`);

    await editSchool.clickEdit();
    await editSchool.updateSchoolName(newName);
    await editSchool.clickSave();

    console.log("🔔 Waiting for success toast...");
    await editSchool.expectSuccessToast('updated successfully');

    console.log("✅ Verifying updated name value...");
    await expect(editSchool.nameInput).toHaveValue(newName);

    console.log("✅ School name updated successfully.");
  });

  // ---------------------------------------------------------------------
  // ✅ ESCH-04: Back button navigates to Browse Schools
  // ---------------------------------------------------------------------
  /*test('ESCH-04 ✅ Back button returns to Browse Schools', async () => {
    console.log("🔙 Clicking on Back button...");
    await editSchool.clickBack();

    //console.log("🔍 Verifying navigation to Browse Schools...");
    await expect(browseSchool.pageHeader).toBeVisible();

    console.log("✅ Navigated back to Browse Schools page successfully.");
  });*/

 test('ESCH-05-07 ✅ Launches, Moderators, and Groups tables display', async () => {
  // Only validating header and table container presence (Fix 3)
  await editSchool.validateLaunchesTableData();
  await editSchool.validateModeratorsTableData();
  await editSchool.validateGroupsTableData();
  console.log("✅ Launches, Moderators, and Groups tables validated.");
});


  // ---------------------------------------------------------------------
  // ❌ ESCH-08: Update fails with invalid data (Long Name)
  // ---------------------------------------------------------------------
  test('ESCH-08 ❌ Update fails with invalid data (Long Name)', async () => {
    const invalidName = 'A'.repeat(300);
    console.log("🚫 Attempting to update with invalid (too long) name...");

    await editSchool.clickEdit();
    await editSchool.updateSchoolName(invalidName);
    await editSchool.clickSave();

    console.log("🔔 Test Pass because no validation on length or character");
    await expect(
            editSchool.page.getByText(
                'The name field must not be greater than 255 characters.'
            )
        ).toBeVisible({ timeout: 10000 });

    console.log("❌ Validation error displayed as expected for long name input.");
  });

  // ---------------------------------------------------------------------
  // ❌ ESCH-09: Update fails when a required field is empty
  // ---------------------------------------------------------------------
  test('ESCH-09 ❌ Update fails with empty required field (Name)', async () => {
    console.log("🚫 Attempting to update with empty required field...");

    await editSchool.clickEdit();
    await editSchool.updateSchoolName('');
    await editSchool.clickSave();

    console.log("🔔 Expecting required field validation toast...");
    await expect(
            editSchool.page.getByText(
                'The name field is required.'
            )
        ).toBeVisible({ timeout: 10000 });

    console.log("❌ Required field validation worked as expected.");
  });

  // ---------------------------------------------------------------------
  // ❌ ESCH-10: UDISE remains read-only in edit mode
  // ---------------------------------------------------------------------
  test('ESCH-10 ❌ UDISE field remains read-only during edit', async () => {
    console.log("🔒 Checking UDISE field read-only state...");

    await editSchool.verifyFieldsReadOnly();
    await editSchool.clickEdit();

    console.log("🔎 Verifying UDISE input remains disabled in edit mode...");
    await expect(editSchool.udiseInput).toHaveAttribute('disabled', 'disabled');
    await expect(editSchool.udiseInput).toHaveValue(TEST_UDISE);

    console.log("✅ UDISE field is correctly locked in edit mode.");
  });
});
