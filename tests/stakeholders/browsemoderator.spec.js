// --- File: tests/stakeholders/moderator/browsemoderator.spec.js ---
import { expect } from '@playwright/test';
import { test } from '../../fixtures'; // Adjust path if necessary
import BasePage from '../../page/BasePage';
import BrowseModeratorPage from '../../page/StakeHolderPage/BrowseModeratorPage';
import GenerateEnrollmentPage from '../../page/StakeHolderPage/GenerateEnrollmentPage';


test.describe('👮 Stakeholders - Browse Moderators', () => {

  // --- Search Functionality ---

  test('✅ Verify Search by Moderator Phone (Exact Match)', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseModeratorPage = new BrowseModeratorPage(page);
    const testPhoneNumber = '9876543210'; 
    const expectedModeratorName = 'BASANTI'; // Ensure this name is correct for your test data

    await browseModeratorPage.goToBrowseModerator(basePage);
    await browseModeratorPage.searchByPhone(testPhoneNumber);
    
    // ✅ FIXED: Explicitly added 15s timeout for slow search results (Test 1)
    await expect(browseModeratorPage.moderatorTable).toContainText(expectedModeratorName, { timeout: 15000 });
  });

  test('⚠️ Search for non-existing phone number should yield no results', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseModeratorPage = new BrowseModeratorPage(page);

    await browseModeratorPage.goToBrowseModerator(basePage);
    await browseModeratorPage.searchByPhone('9999999999'); 
    
    // ✅ FIXED: Use the robust locator from the PO and increase timeout (Test 2)
    await expect(browseModeratorPage.noDataMessage).toBeVisible({ timeout: 10000 });
  });
  
  // --- Filter Drawer Functionality ---

  test('🔎 Apply filter by Country and verify results', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseModeratorPage = new BrowseModeratorPage(page);
    const countryToFilter = 'India (IND)'; 

    await browseModeratorPage.goToBrowseModerator(basePage);
    
    // This relies on the openFilterButton fix in the PO (Test 3)
    await browseModeratorPage.filterByCountry(countryToFilter); 
    
    const filterChipLocator = page.getByText(countryToFilter).first();
    await expect(filterChipLocator).toBeVisible();
  });

  // --- Enrollment Form Navigation ---

  test('🔗 Navigate to Generate Enrollment Form', async ({ page, login }) => {
    const basePage = new BasePage(page);
    const browseModeratorPage = new BrowseModeratorPage(page);
    const generateEnrollmentPage = new GenerateEnrollmentPage(page); // Correctly imported (Test 4)
    
    await browseModeratorPage.goToBrowseModerator(basePage);
    await browseModeratorPage.clickGenerateEnrollmentForm();
    
    // Assuming you have a verifyPageHeader() method in GenerateEnrollmentPage
    await generateEnrollmentPage.verifyPageHeader();
    await expect(page.url()).toContain('/generate/form/teacher'); 
  });
  
  // ... (Optional Pagination/Delete Tests) ...
});