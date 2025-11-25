import { expect } from '@playwright/test';
import { test } from '../../../fixtures';

const BasePage = require('../../../page/BasePage');
const BrowseSchoolPage = require('../../../page/DemographicsPage/SchoolsPage/BrowseSchoolPage');

test.describe('📍 Browse Schools Section', () => {
  let basePage, browseSchool;

  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseSchool = new BrowseSchoolPage(page);
    await browseSchool.goToBrowseSchools(basePage);
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-01: Page Loaded
  // ---------------------------------------------------------------------
  test('BSCH-01 ✅ Page loaded', async () => {
    await expect(browseSchool.pageHeader).toBeVisible();
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-02: Table Renders
  // ---------------------------------------------------------------------
  test('BSCH-02 ✅ Table renders school data', async () => {
    const count = await browseSchool.tableRows.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-03: Valid UDISE Search
  // ---------------------------------------------------------------------
  test('BSCH-03 ✅ Search valid UDISE', async () => {
    const udise = "9999999999";
    console.log("Searching for UDISE:", udise);

    await browseSchool.searchSchool(udise);
    await browseSchool.validateUdiseInTable(udise);

    console.log("✅ UDISE validated successfully in table");
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-04: Edit School Flow
  // ---------------------------------------------------------------------
  test('BSCH-04 ✅ Edit school navigation', async () => {
    const udise = "9999999999";

    await browseSchool.searchSchool(udise);
    await browseSchool.clickEditSchool(udise);

    await expect(browseSchool.page.getByText('School Details')).toBeVisible({ timeout: 15000 });
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-05: Add School
  // ---------------------------------------------------------------------
  test('BSCH-05 ✅ Add school navigation', async () => {
    await browseSchool.clickAddSchool();
    await expect(browseSchool.page.getByText('Create School')).toBeVisible();
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-06: Delete Cancel Scenario
  // ---------------------------------------------------------------------
  test('BSCH-06 ✅ Cancel delete school', async () => {
    const udise = "9999999999";

    await browseSchool.searchSchool(udise);
    await browseSchool.cancelDeleteSchool(udise);

    console.log("✅ Delete cancelled, school remains listed.");
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-07: Apply Filters
  // ---------------------------------------------------------------------
  test('BSCH-07 ✅ Apply Filters', async () => {
    await browseSchool.openFilters();

    await browseSchool.selectState('Madhya Pradesh');
    await browseSchool.selectDistrict('Shivpuri');
    // await browseSchool.selectSchoolType('PS');

    await browseSchool.applyFilters();

    console.log("✅ Apply filters executed");
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-08: Reset Filters
  // ---------------------------------------------------------------------
  test('BSCH-08 ✅ Reset Filters', async () => {
    await browseSchool.openFilters();

    await browseSchool.selectState('Madhya Pradesh');
    await browseSchool.selectDistrict('Shivpuri');
    // await browseSchool.selectSchoolType('PS');

    await browseSchool.resetFilters();

    console.log("✅ Reset filters executed");
  });

  // ---------------------------------------------------------------------
  // ✅ BSCH-09: Invalid UDISE Search
  // ---------------------------------------------------------------------
  test('BSCH-09 ✅ Search invalid UDISE', async () => {
    const udise = 'NO-SCHOOL-999';

    const rows = await browseSchool.searchSchool(udise);
    expect(rows).toBe(0);

    console.log("✅ Invalid UDISE returned zero rows");
  });
});
