const { expect } = require('@playwright/test');
class BrowseModeratorPage {
  constructor(page) {
    this.page = page;
    // =============== STATIC LOCATORS ===============
    this.pageHeader = page.locator('#moderators').getByText('Moderators');
    // Search Input
    this.searchInput = page.getByPlaceholder('Search by moderator phone');
    this.generateEnrollmentButton = page.locator('#moderators').getByRole('link', { name: 'Generate Enrollment Form' });
    // Table & Rows
    this.moderatorTable = page.locator('#moderators .card table');
    this.tableRows = this.moderatorTable.locator('tbody tr');
    // Loader
    this.loader = page.locator('[wire\\:loading], [wire\\:loading\\.flex]');
    // Filter Drawer Button
    this.filterButton = page.locator('#moderators div div:nth-child(2) > button');
    // Drawer Card Wrapper
    this.drawerCard = page.locator('div.drawer-end div.card[wire\\:key="drawer-card"]');
    // Confirm (Search) Button Inside Drawer
    this.confirmButton = this.drawerCard
      .locator('button[type="submit"][wire\\:target="filter"]')
      .filter({ hasText: 'Search' })
      .first();
    // Filter Dropdowns
    this.stateDropdown = page.locator('div[placeholder="Search by state name"]');
    this.districtDropdown = page.locator('div[placeholder="Search by district name"]');
    this.designationDropdown = page.locator('div[placeholder="Search by designation"]');
    // Reset Button Inside Drawer
    this.resetButton = this.drawerCard.getByRole('button', { name: 'Reset' }).first();
  }
  // =============== UTILITIES ===============
  async waitLoader(timeout = 15000) {
    await this.loader.waitFor({ state: 'hidden', timeout }).catch(() => {});
  }
  async scrollDown(pixels = 700, delay = 150) {
    await this.page.mouse.wheel(0, pixels);
    await this.page.waitForTimeout(delay);
  }
  async clearAndFill(input, value, delay = 40) {
    await input.fill('').catch(() => {});
    await input.fill(value).catch(async () => {
      await input.click({ force: true });
      await input.type(value, { delay });
    });
  }
  // =============== NAVIGATION ===============
  async goToBrowseModerators(basePage) {
    await basePage.goToBrowseModerator();
    await expect(this.pageHeader).toBeVisible({ timeout: 15000 });
  }
  // =============== SEARCH (Optimized & Stable) ===============
  async searchModerator(value) {
    console.log(`:mag: Searching for Moderator: ${value}`);
    await expect(this.searchInput).toBeAttached({ timeout: 12000 }).catch(() => {});
    await expect(this.searchInput).toBeVisible({ timeout: 12000 });
    await this.clearAndFill(this.searchInput, value);
    await this.page.keyboard.press('Enter');
    await this.waitLoader();
    await this.page.waitForTimeout(150);
    if (await this.noDataMessage().isVisible().catch(() => false)) {
      console.log(':warning: No records found on search');
      return 0;
    }
    return this.tableRows.count();
  }
   async clickGenerateEnrollment() {
    await expect(this.generateEnrollmentButton).toBeVisible({ timeout: 10000 });
    await this.generateEnrollmentButton.click();
  }
  // =============== FILTER ACTIONS ===============
  async openFilters() {
    console.log(':white_check_mark: Opening moderator filter drawer...');
    await expect(this.filterButton).toBeVisible({ timeout: 12000 });
    await this.filterButton.scrollIntoViewIfNeeded();
    await this.filterButton.click({ force: true });
    await expect(this.drawerCard).toBeVisible({ timeout: 8000 });
  }
  async applyFilters() {
    console.log(':white_check_mark: Clicking Search filter button...');
    await expect(this.confirmButton).toBeAttached({ timeout: 12000 }).catch(() => {});
    await expect(this.confirmButton).toBeVisible({ timeout: 12000 });
    await this.confirmButton.scrollIntoViewIfNeeded();
    await this.scrollDown(300, 120);
    await this.confirmButton.click({ force: true });
    await this.waitLoader();
    await this.page.waitForTimeout(150);
  }
  async resetFilters() {
    console.log(':arrows_counterclockwise: Resetting moderator filters...');
    await expect(this.resetButton).toBeVisible({ timeout: 12000 });
    await this.resetButton.scrollIntoViewIfNeeded();
    await this.scrollDown(300, 120);
    await this.resetButton.click({ force: true });
    await this.waitLoader();
  }
  // =============== DROPDOWN FILTER SELECT HELPERS ===============
  async openDropdown(dropdown) {
    await expect(dropdown).toBeVisible({ timeout: 8000 });
    await dropdown.scrollIntoViewIfNeeded();
    await dropdown.click({ force: true });
  }
  async selectOptionFromDropdown(dropdown, value) {
    const input = dropdown.locator('input[x-ref="searchInput"]').first();
    await expect(input).toBeVisible({ timeout: 6000 });
    await input.fill('');
    await input.type(value, { delay: 60 });
    const option = this.page.getByText(value).first();
    await expect(option).toBeVisible({ timeout: 8000 });
    await option.scrollIntoViewIfNeeded();
    await option.click({ force: true });
    await this.page.keyboard.press('Escape');
    await this.scrollDown(200, 120);
  }
  async selectState(state) {
    console.log(`:round_pushpin: Selecting State: ${state}`);
    await this.openDropdown(this.stateDropdown);
    await this.selectOptionFromDropdown(this.stateDropdown, state);
  }
  async selectDistrict(district) {
    console.log(`:round_pushpin: Selecting District: ${district}`);
    await this.openDropdown(this.districtDropdown);
    await this.selectOptionFromDropdown(this.districtDropdown, district);
  }
  async selectDesignation(designation) {
    console.log(`:round_pushpin: Selecting Designation: ${designation}`);
    await this.openDropdown(this.designationDropdown);
    await this.selectOptionFromDropdown(this.designationDropdown, designation);
  }
  // =============== VALIDATIONS ===============
  async verifyAllRowsContainState(state) {
    const rows = await this.tableRows.allTextContents();
    for (const row of rows) {
      expect(row.includes(state)).toBeTruthy();
    }
  }
  async verifyFilterResults({ state, district, Role }) {
    await this.waitLoader();
    const rows = await this.tableRows.all();
    const rowsToCheck = rows.slice(0, 3);
    if (await this.noDataMessage().isVisible().catch(() => false)) {
      console.log(':warning: No data found for filters');
      return 0;
    }
    for (const row of rowsToCheck) {
      const cells = await row.locator('td').allTextContents();
      const id = cells[0]?.trim() || '';
      const phone = cells[2]?.trim() || '';
      const name = cells[3]?.trim() || '';
      const role = cells[4]?.trim() || '';
      const combined = `${id} ${phone} ${name} ${role}`.toLowerCase();
      if (state) expect(combined.includes(state.toLowerCase())).toBeTruthy();
      if (district) expect(combined.includes(district.toLowerCase())).toBeTruthy();
      if (Role) expect(combined.includes(Role.toLowerCase())).toBeTruthy();
    }
    console.log(':white_check_mark: Validated ID, Phone, Name, Role in first 3 rows');
    return rowsToCheck.length;
  }
  noDataMessage() {
    return this.page.locator('#moderators').getByText(/No Data|No records|not found/i).first();
  }
}
module.exports = BrowseModeratorPage;