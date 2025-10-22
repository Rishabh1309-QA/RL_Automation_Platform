// --- File: page/StakeHolderPage/BrowseModeratorPage.js (Final Stable) ---
const { expect } = require('@playwright/test');
const FilterDrawer = require('../components/FilterDrawer'); 

class BrowseModeratorPage {
  constructor(page) {
    this.page = page;
    this.filterDrawer = new FilterDrawer(page);

    // 🔹 Locators inside Browse Moderators page
    this.pageHeader = page.locator('#moderators').getByText('Moderators');
    
    // Stable locators using roles/text
    this.searchBox = page.getByRole('textbox', { name: 'Search by moderator phone' });
    this.searchButton = page.getByRole('button', { name: 'Search' }).first(); 
    this.generateEnrollmentFormButton = page.getByRole('button', { name: 'Generate Enrollment Form' });
    
    // Fixed for filter timeout: use getByText
    this.openFilterButton = page.getByText('Search or add filter to view moderator list').first();
    
    // Stable table locators
    this.moderatorTable = page.locator('.MuiTableContainer-root table, table').first();
    this.noDataMessage = page.locator('div, span, p', { hasText: /No data/i }); // Used for Test 2
  }

  async goToBrowseModerator(basePage) {
    await basePage.goToBrowseModerator();
    await expect(this.pageHeader).toBeVisible(); 
  }
  
  async clickGenerateEnrollmentForm() {
    await this.generateEnrollmentFormButton.click();
  }

  async searchByPhone(phoneNumber) {
    await this.searchBox.fill(phoneNumber);
    await this.searchButton.click();
    // No explicit wait here; rely on assertion timeout in the test.
  }

  async verifyModeratorVisible(nameOrPhone) {
    await expect(this.moderatorTable).toContainText(nameOrPhone);
  }

  // ---------------------------------
  // 🔹 Filter Methods
  // ---------------------------------
  
  async openFilterDrawer() {
    // Uses force: true and increased timeout to stabilize against overlays
    await this.openFilterButton.click({ force: true, timeout: 10000 });
    await expect(this.filterDrawer.drawerTitle).toBeVisible();
  }
  
  async filterByCountry(countryName) {
    await this.openFilterDrawer();
    await this.filterDrawer.selectCountry(countryName);
    this.filterDrawer.closeDrawer(); 
  }
  
  // Note: Add moderatorRow, clickEditModerator, and deleteModerator methods here for completeness.
}

module.exports = BrowseModeratorPage;