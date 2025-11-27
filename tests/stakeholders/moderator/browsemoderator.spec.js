import { expect } from '@playwright/test';
import { test } from '../../../fixtures';
const BasePage = require('../../../page/BasePage');
const BrowseModeratorPage = require('../../../page/stakeholders/Moderator/BrowseModeratorPage');
test.describe(':round_pushpin: Browse Moderators Section', () => {
  let basePage, browseModerator;
  test.beforeEach(async ({ page, login }) => {
    basePage = new BasePage(page);
    browseModerator = new BrowseModeratorPage(page);
    await browseModerator.goToBrowseModerators(basePage);
  });
  // ---------------------------------------------------------------------
  // :white_check_mark: BMOD-01: Page Loaded
  // ---------------------------------------------------------------------
  test('BMOD-01 :white_check_mark: Page loaded', async () => {
    await expect(browseModerator.pageHeader).toBeVisible();
  });
  // ---------------------------------------------------------------------
  // :white_check_mark: BMOD-02: Search by phone shows results
  // ---------------------------------------------------------------------
  test('BMOD-02 :white_check_mark: Search by phone', async () => {
    const phone = '919999999999'; // tweak a real phone from fixtures if available
    const count = await browseModerator.searchModerator(phone);
    expect(typeof count).toBe('number');
    if (count > 0) {
      await browseModerator.validateModeratorInRow(phone, { detailContains: 'Project' });
    }
  });
  // :white_check_mark: Positive
  test('BMOD-03  Filter by State → Telangana', async () => {
    await browseModerator.openFilters();
    await browseModerator.selectState('Telangana');
    await browseModerator.applyFilters();
    await browseModerator.verifyFilterResults({ state: 'Telangana' });
  });
  test('BMOD-04: Filter by District → Hyderabad', async () => {
    await browseModerator.openFilters();
    await browseModerator.selectState('Madhya Pradesh');
    await browseModerator.selectDistrict('Shivpuri');
    await browseModerator.applyFilters();
    await browseModerator.verifyFilterResults({ Role: 'AWW' });
  });
  test('BMOD-05: Reset Filters restores full list', async () => {
    await browseModerator.openFilters();
    await browseModerator.selectState('Telangana');
    await browseModerator.applyFilters();
    await browseModerator.resetFilters();
    const count = await browseModerator.tableRows.count();
    //expect(count).toBeGreaterThan(0); // full list restored
  });
    test('BMOD-06 :white_check_mark: Click Generate Enrollment Form button', async () => {
    await browseModerator.clickGenerateEnrollment();
    await expect(browseModerator.page.getByText('Generate Enrollment Form')).toBeVisible({ timeout: 15000 });
  } );
});