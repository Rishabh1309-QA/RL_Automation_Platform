const { expect } = require('@playwright/test');

class BrowseBeatPage {
  constructor(page) {
    this.page = page;

    // 🔸 Browse Beat/Sector Page Locators (Aligned with ProjectPage)
    this.pageHeader = page.locator('#beatssectors').getByText('Beats/Sectors');
    this.beatTable = page.locator('table');
    this.tableRows = this.beatTable.locator('tr'); // Added a specific locator for rows for easier assertion
    this.searchBox = page.getByRole('textbox', { name: 'Search...' });
    this.addButton = page.locator('//*[@id="beatssectors"]/div/div[3]/a'); // Explicitly locate 'Add' button

    // 🔸 Filter Drawer Trigger Button (Use a more robust locator if possible, but keeping original for now)
    this.filterButton = page.locator('#beatssectors div div:nth-child(3) button');

    // 🔸 Filter Drawer Elements
    this.drawerCard = page.locator('div.drawer-end div.card[wire\\:key="drawer-card"]');
    this.drawerTitle = this.drawerCard.getByRole('heading', { name: 'Filters' }); // Added for consistency

    // 🔸 Filter dropdowns
    this.stateDropdown = this.drawerCard.getByPlaceholder('Search by state name', { exact: true });
    this.districtDropdown = this.drawerCard.getByPlaceholder('Search by district name', { exact: true });
    this.projectDropdown = this.drawerCard.getByPlaceholder('Search by project name', { exact: true });

    // 🔸 Buttons
    this.searchButton = this.drawerCard.getByRole('button', { name: 'Search' });
    this.resetButton = this.drawerCard.getByRole('button', { name: 'Reset' });

    // Livewire loader
    this.loader = page.locator('[wire\\:loading], [wire\\:loading\\.flex]'); // Aligned with ProjectPage
  }

  // ==========================
  // ✅ HELPER LOCATORS
  // ==========================

  beatRow(name) {
    return this.page.locator('tr', { hasText: name });
  }

  // ==========================
  // ✅ COMMON ACTIONS
  // ==========================

  async goToBrowseBeats(basePage) {
    await basePage.goToBrowseBeats();
    await expect(this.pageHeader).toBeVisible({ timeout: 15000 });
  }

  async waitLoader() { // Renamed and simplified
    await this.loader.waitFor({ state: 'hidden', timeout: 8000 }).catch(() => {});
  }

  async searchBeat(name) { // Aligned name
    await this.searchBox.fill(name);
    // Note: Assuming search is live or auto-triggered after fill. If a search button is needed, add a click here.
    await this.waitLoader();
  }

  async clickAddBeat() { // Aligned name
    await this.addButton.click();
  }

  async clickEditBeat(beatName) { // Aligned logic
    const row = this.beatRow(beatName);
    await row.waitFor({ state: 'visible', timeout: 10000 });
    await row.getByRole('link', { name: 'Edit' }).click();
  }

  async deleteBeat(beatName) { // Added missing delete logic
    const row = this.beatRow(beatName);
    await row.getByRole('button', { name: 'Delete' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Delete' }).click();
  }

  async cancelDeleteBeat(beatName) { // Added missing cancelDelete logic
    const row = this.beatRow(beatName);
    await row.getByRole('button', { name: 'Delete' }).click();
    const dialog = this.page.getByRole('dialog');
    await dialog.getByRole('button', { name: 'Cancel' }).click();
    await expect(this.beatTable).toContainText(beatName);
  }

  // ==========================
  // ✅ FILTER PANEL FUNCTIONS (Simplified and aligned)
  // ==========================

  async openFilters() {
    console.log("Opening filter panel...");
    await this.filterButton.click();
    await expect(this.drawerCard).toBeVisible({ timeout: 8000 }); // Reduced timeout to match ProjectPage
    console.log("Filter panel opened");
  }

  async selectState(stateName) {
    console.log(`Selecting state: ${stateName}`);
    await expect(this.drawerCard).toBeVisible();

    await this.stateDropdown.scrollIntoViewIfNeeded();
    await this.stateDropdown.click(); // Click the main container

    // Type in actual search input (assuming it appears after click)
    const stateInput = this.stateDropdown.locator('input'); 
    await stateInput.fill(stateName);

    // Pick the option
    const option = this.page.getByText(`${stateName} (`, { exact: false });
    await expect(option.first()).toBeVisible({ timeout: 10000 });
    await option.first().click();

    await this.page.keyboard.press('Escape');
    await this.waitLoader(); // Use the standardized waitLoader
  }

  async selectDistrict(districtName) {
    console.log(`Selecting district: ${districtName}`);
    await expect(this.drawerCard).toBeVisible();

    // open dropdown
    await this.districtDropdown.scrollIntoViewIfNeeded();
    await this.districtDropdown.click({ force: true });

    // Assuming district is a select, not an input/search like state.
    // If it's a searchable input, we'd add fill logic here. 
    // For now, we search by text directly in the dropdown list.

    await this.waitLoader();
    const option = this.page.getByText(`${districtName}`, { exact: false });
    await expect(option.first()).toBeVisible({ timeout: 30000 });
    await option.first().click({ force: true });

    await this.page.keyboard.press('Escape');
    console.log(`Selected district: ${districtName}`);
  }

  async selectProject(projectName) {
    console.log(`Selecting project: ${projectName}`);
    await expect(this.drawerCard).toBeVisible();

    await this.projectDropdown.scrollIntoViewIfNeeded();
    await this.projectDropdown.click();

    // Type in actual search input
    const projectInput = this.projectDropdown.locator('input');
    await projectInput.fill(projectName);

    const option = this.page.getByText(`${projectName} (`, { exact: false });
    await expect(option.first()).toBeVisible({ timeout: 15000 });
    await option.first().click();

    await this.page.keyboard.press('Escape');
    await this.waitLoader();
  }

  async applyFilters() { // Aligned name with the action
    await this.searchButton.click({ force: true });
    await this.waitLoader();
  }

  async resetFilters() {
    console.log("Resetting filters...");
    await this.resetButton.click({ force: true }); // Added force for consistency
    await this.waitLoader();
  }

  async verifyFilterResults({ state, district, project }) {
    if (state) await expect(this.beatTable).toContainText(state);
    if (district) await expect(this.beatTable).toContainText(district);
    if (project) await expect(this.beatTable).toContainText(project);
  }
  
  async verifyDataDisplayed() {
    await expect(this.beatTable).toBeVisible();
    const rowCount = await this.tableRows.count();
    expect(rowCount).toBeGreaterThan(1); // Expecting > 1 because of the header row
  }
}

module.exports = BrowseBeatPage;